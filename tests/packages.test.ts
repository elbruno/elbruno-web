import assert from 'node:assert/strict';
import { test } from 'node:test';
import { curatedPackages, packageSources, packageUrl } from '../src/data/packages';
import {
  displayedPackages,
  formatDownloads,
  formatPackageDate,
  normalizePackages,
  refreshPackages,
  stalePackages,
  validatePackageSnapshot,
  type PackageSnapshot,
} from '../src/lib/packages';
import committedSnapshot from '../src/data/nuget/snapshot.json';

const now = Date.parse('2026-11-04T18:00:00Z');
const generatedAt = '2026-11-04T12:13:30-05:00';
function fixtures() {
  return {
    nuget: {
      generatedAt,
      packages: curatedPackages.map((config) => ({
        packageId: config.packageId,
        latestVersion: '1.2.3',
        totalDownloads: 12345,
        retired: false,
        listed: true,
        projectUrl: config.repositoryUrl,
      })),
    },
    repositories: {
      generatedAt,
      repositories: curatedPackages.map((config) => ({
        fullName: config.repositoryUrl.slice('https://github.com/'.length),
        htmlUrl: config.repositoryUrl,
        archived: false,
        retired: false,
        isStub: false,
      })),
    },
  };
}
const makeSnapshot = (): PackageSnapshot => {
  const { nuget, repositories } = fixtures();
  return { fetchedAt: new Date(now).toISOString(), ...normalizePackages(nuget, repositories, now) };
};

test('dashboard maps exact case-normalized IDs in editorial order and skips missing selections', () => {
  const { nuget, repositories } = fixtures();
  nuget.packages.reverse();
  nuget.packages = nuget.packages.filter((item) => item.packageId !== 'ElBruno.LocalLLMs');
  nuget.packages[0].packageId = nuget.packages[0].packageId.toLowerCase();
  nuget.packages.push({ ...nuget.packages[0], packageId: 'Unrelated.Utility' });
  const normalized = normalizePackages(nuget, repositories, now);
  assert.equal(normalized.packages.length, 5);
  assert.equal(normalized.packages[0].packageId, 'ElBruno.LocalEmbeddings');
  assert.equal(normalized.sourceUpdatedAt, '2026-11-04T17:13:30.000Z');
  assert.ok(!normalized.packages.some((item) => item.packageId === 'ElBruno.LocalLLMs'));
  assert.ok(!normalized.packages.some((item) => item.packageId === 'Unrelated.Utility'));
});

test('schema drift, missing IDs, duplicate IDs and invalid source dates fail closed', () => {
  const { nuget, repositories } = fixtures();
  assert.throws(() => normalizePackages({}, repositories, now), /schema/);
  assert.throws(
    () => normalizePackages({ ...nuget, generatedAt: 'tomorrow' }, repositories, now),
    /timestamp/,
  );
  assert.throws(
    () => normalizePackages({ ...nuget, generatedAt: '2030-01-01T00:00:00Z' }, repositories, now),
    /timestamp/,
  );
  assert.throws(
    () => normalizePackages({ ...nuget, packages: [{}] }, repositories, now),
    /package ID/,
  );
  assert.throws(
    () => normalizePackages({ ...nuget, packages: [] }, repositories, now),
    /no curated/,
  );
  nuget.packages.push({
    ...nuget.packages[0],
    packageId: nuget.packages[0].packageId.toLowerCase(),
  });
  assert.throws(() => normalizePackages(nuget, repositories, now), /Duplicate/);
});

test('invalid, null, negative or unsafe counts and versions are omitted, not displayed as zero', () => {
  const { nuget, repositories } = fixtures();
  for (const invalid of [-1, null, '123', 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    const data = structuredClone(nuget);
    Object.assign(data.packages[0], {
      totalDownloads: invalid,
      latestVersion: '<script>bad</script>',
    });
    const row = normalizePackages(data, repositories, now).packages[0];
    assert.equal(row.totalDownloads, undefined);
    assert.equal(row.version, undefined);
  }
  nuget.packages[0].totalDownloads = 0;
  assert.equal(normalizePackages(nuget, repositories, now).packages[0].totalDownloads, 0);
});

test('only verified, exact source associations produce repository links', () => {
  const { nuget, repositories } = fixtures();
  for (const invalid of [
    'javascript:alert(1)',
    'https://github.com.evil.example/elbruno/elbruno.localembeddings',
    'https://attacker@github.com/elbruno/elbruno.localembeddings',
    'https://github.com/elbruno/Other',
  ]) {
    nuget.packages[0].projectUrl = invalid;
    assert.equal(normalizePackages(nuget, repositories, now).packages[0].repositoryUrl, undefined);
  }
  nuget.packages[0].projectUrl = curatedPackages[0].repositoryUrl;
  repositories.repositories[0].isStub = true;
  assert.equal(normalizePackages(nuget, repositories, now).packages[0].repositoryUrl, undefined);
  repositories.repositories[0].isStub = false;
  repositories.repositories.push(repositories.repositories[0]);
  assert.throws(() => normalizePackages(nuget, repositories, now), /Duplicate/);
});

test('retired, archived, unlisted and unknown entries remain qualified and are not featured', () => {
  const { nuget, repositories } = fixtures();
  nuget.packages[0].retired = true;
  repositories.repositories[1].archived = true;
  nuget.packages[2].listed = false;
  const snapshot = {
    fetchedAt: new Date(now).toISOString(),
    ...normalizePackages(nuget, repositories, now),
  };
  assert.equal(displayedPackages(snapshot, true).length, 0);
  assert.equal(displayedPackages(snapshot).length, 6);
  assert.equal(snapshot.packages[0].lifecycle, 'retired');
  assert.equal(snapshot.packages[1].repositoryArchived, true);
  assert.equal(snapshot.packages[2].listed, false);
  const unknown = structuredClone(nuget);
  Reflect.deleteProperty(unknown.packages[0], 'retired');
  assert.equal(normalizePackages(unknown, repositories, now).packages[0].lifecycle, 'unknown');
  repositories.repositories[3].retired = true;
  assert.equal(normalizePackages(nuget, repositories, now).packages[3].lifecycle, 'retired');
});

test('network and schema failures retain the previous snapshot, even when it is stale', async () => {
  const previous = makeSnapshot();
  const later = now + 8 * 86400_000;
  const offline = await refreshPackages(
    previous,
    async () => {
      throw new Error('offline');
    },
    later,
  );
  assert.strictEqual(offline.snapshot, previous);
  assert.match(offline.warning!, /network failure/);
  assert.equal(stalePackages(previous, later), true);
  const corrupt = await refreshPackages(previous, async () => '{"changedSchema":[]}', later);
  assert.strictEqual(corrupt.snapshot, previous);
  assert.match(corrupt.warning!, /schema failure/);
  const missing = await refreshPackages(
    undefined,
    async () => {
      throw new Error('offline');
    },
    later,
  );
  assert.equal(missing.snapshot, undefined);
});

test('identical normalized refresh is idempotent and older source payloads cannot replace last-good data', async () => {
  const previous = makeSnapshot();
  const { nuget, repositories } = fixtures();
  const request = async (url: string) =>
    JSON.stringify(url === packageSources.nuget ? nuget : repositories);
  const unchanged = await refreshPackages(previous, request, now + 10000);
  assert.strictEqual(unchanged.snapshot, previous);
  nuget.generatedAt = '2026-11-03T00:00:00Z';
  const older = await refreshPackages(previous, request, now);
  assert.strictEqual(older.snapshot, previous);
  assert.match(older.warning!, /older/);
  nuget.generatedAt = '2026-11-04T17:30:00Z';
  const updated = await refreshPackages(previous, request, now + 20000);
  assert.equal(updated.snapshot?.sourceUpdatedAt, '2026-11-04T17:30:00.000Z');
  assert.equal(updated.snapshot?.fetchedAt, new Date(now + 20000).toISOString());
  assert.equal(stalePackages(updated.snapshot!, now), false);
});

test('committed offline snapshot rejects invalid metrics, duplicates and unverified source URLs', () => {
  assert.doesNotThrow(() => validatePackageSnapshot(committedSnapshot));
  const data = makeSnapshot();
  data.packages[0].repositoryUrl = 'javascript:alert(1)';
  assert.throws(() => validatePackageSnapshot(data), /entry/);
  data.packages[0].repositoryUrl = curatedPackages[0].repositoryUrl;
  data.packages[0].totalDownloads = -1;
  assert.throws(() => validatePackageSnapshot(data), /entry/);
  data.packages[0].totalDownloads = 1;
  data.packages.push(data.packages[0]);
  assert.throws(() => validatePackageSnapshot(data), /entry/);
});

test('EN/ES metrics use localized numbers and UTC dates; NuGet links preserve exact IDs', () => {
  assert.equal(formatDownloads(12345, 'en'), '12,345');
  assert.equal(formatDownloads(12345, 'es'), '12.345');
  assert.equal(formatPackageDate('2026-11-05T00:30:00+02:00', 'en'), 'Nov 4, 2026');
  assert.match(formatPackageDate('2026-11-05T00:30:00+02:00', 'es'), /4 nov 2026/);
  for (const config of curatedPackages) {
    const url = new URL(packageUrl(config.packageId));
    assert.equal(url.origin, 'https://www.nuget.org');
    assert.equal(decodeURIComponent(url.pathname), `/packages/${config.packageId}`);
  }
});
