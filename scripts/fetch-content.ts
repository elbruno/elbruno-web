import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { refreshFeed, refreshRepository } from '../src/lib/feeds/refresh';
import {
  httpsUrl,
  validateSnapshot,
  type RepositorySummary,
  type Source,
} from '../src/lib/feeds/model';
import { curatedRepositories } from '../src/data/profile';
import { refreshPackages, validatePackageSnapshot } from '../src/lib/packages';

const path = fileURLToPath(new URL('../src/data/feeds/snapshot.json', import.meta.url));
const old = await readFile(path, 'utf8');
const repositoriesOnly = process.argv.includes('--repositories-only');
const packagePath = fileURLToPath(new URL('../src/data/nuget/snapshot.json', import.meta.url));
const oldPackages = await readFile(packagePath, 'utf8');
const packageSnapshot: unknown = JSON.parse(oldPackages);
validatePackageSnapshot(packageSnapshot);
const snapshot: unknown = JSON.parse(old);
validateSnapshot(snapshot);
const sources: Record<Source, string | null> = {
  blog: process.env.BLOG_RSS_URL || 'https://elbruno.com/feed/',
  podcast: process.env.PODCAST_RSS_URL || 'https://feeds.ivoox.com/feed_fg_f1277993_filtro_1.xml',
  youtube: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCyHCkJ4lsphfhu_ljRws6aA',
};
async function request(url: string): Promise<string> {
  if (!httpsUrl(url)) throw new Error('Source must use HTTPS');
  const response = await fetch(url, {
    signal: AbortSignal.timeout(20_000),
    headers: { 'User-Agent': 'elbruno-web-content-refresh/1.0' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Empty response');
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 2_000_000) throw new Error('Response exceeds size limit');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString('utf8');
}
for (const source of repositoriesOnly ? [] : (Object.keys(sources) as Source[])) {
  const result = await refreshFeed(snapshot, source, sources[source]!, request);
  if (result.warning) console.warn(result.warning);
  else console.log(`${source}: verified entries refreshed`);
  Object.assign(snapshot, result.snapshot);
}
const repositories: RepositorySummary[] = [];
let repositoryFailure = false;
await Promise.all(
  curatedRepositories.map(async (project) => {
    const result = await refreshRepository(
      project,
      snapshot.repositories.find((repo) => repo.url === project.url),
      request,
    );
    if (result.warning) {
      repositoryFailure = true;
      console.warn(result.warning);
    }
    if (result.repository) repositories.push(result.repository);
  }),
);
const previousRepositories = JSON.stringify(snapshot.repositories);
snapshot.repositories = [
  ...curatedRepositories.flatMap((project) =>
    repositories.filter((repo) => repo.url === project.url),
  ),
  ...snapshot.repositories.filter(
    (repo) => !curatedRepositories.some((project) => project.url === repo.url),
  ),
];
if (
  !repositoryFailure &&
  (!snapshot.fetchedAt?.repositories ||
    previousRepositories !== JSON.stringify(snapshot.repositories))
)
  snapshot.fetchedAt = { ...snapshot.fetchedAt, repositories: new Date().toISOString() };
snapshot.entries.sort(
  (a, b) =>
    a.source.localeCompare(b.source) ||
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
    a.url.localeCompare(b.url),
);
if (!repositoriesOnly) {
  const packageResult = await refreshPackages(packageSnapshot, request);
  if (packageResult.warning) console.warn(packageResult.warning);
  if (packageResult.snapshot) {
    validatePackageSnapshot(packageResult.snapshot);
    const packageOutput = `${JSON.stringify(packageResult.snapshot, null, 2)}\n`;
    if (oldPackages !== packageOutput) await writeFile(packagePath, packageOutput);
    console.log(`packages: ${packageResult.snapshot.packages.length} curated entries`);
  }
}
validateSnapshot(snapshot);
const output = `${JSON.stringify(snapshot, null, 2)}\n`;
if (old === output) console.log('No normalized content changes.');
else {
  await writeFile(path, output);
  console.log('Snapshot updated.');
}
