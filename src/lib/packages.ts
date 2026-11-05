import { curatedPackages, packageSources } from '../data/packages';
import type { Locale } from '../i18n';

export type PackageSummary = {
  packageId: string;
  version?: string;
  totalDownloads?: number;
  lifecycle: 'active' | 'retired' | 'unknown';
  listed?: boolean;
  repositoryUrl?: string;
  repositoryArchived?: boolean;
};
export type PackageSnapshot = {
  fetchedAt: string;
  sourceUpdatedAt: string;
  repositorySourceUpdatedAt: string;
  packages: PackageSummary[];
};
type Row = Record<string, unknown>;
const object = (value: unknown): value is Row =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const timestamp = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(value) &&
  Number.isFinite(Date.parse(value));
const version = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length <= 100 &&
  /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(value);
const count = (value: unknown): value is number =>
  Number.isSafeInteger(value) && Number(value) >= 0;
const canonicalRepo = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\/$/, '').toLowerCase() : '';

function sourceRows(value: unknown, key: string, now: number): { date: string; rows: Row[] } {
  if (
    !object(value) ||
    !timestamp(value.generatedAt) ||
    Date.parse(value.generatedAt) > now + 300_000 ||
    !Array.isArray(value[key]) ||
    value[key].length > 5000 ||
    !value[key].every(object)
  )
    throw new Error(`Invalid dashboard ${key} schema or timestamp`);
  return { date: new Date(value.generatedAt).toISOString(), rows: value[key] as Row[] };
}

export function normalizePackages(
  nuget: unknown,
  repositories: unknown,
  now = Date.now(),
): Omit<PackageSnapshot, 'fetchedAt'> {
  const source = sourceRows(nuget, 'packages', now);
  const repos = sourceRows(repositories, 'repositories', now);
  const byId = new Map<string, Row>();
  for (const row of source.rows) {
    if (typeof row.packageId !== 'string' || !/^[A-Za-z0-9_.-]+$/.test(row.packageId))
      throw new Error('Invalid dashboard package ID');
    const id = row.packageId.toLowerCase();
    if (byId.has(id)) throw new Error(`Duplicate dashboard package ID: ${id}`);
    byId.set(id, row);
  }
  const packages = curatedPackages.flatMap((config): PackageSummary[] => {
    const row = byId.get(config.packageId.toLowerCase());
    if (!row) return [];
    const matches = repos.rows.filter(
      (repo) =>
        canonicalRepo(repo.htmlUrl) === canonicalRepo(config.repositoryUrl) &&
        typeof repo.fullName === 'string' &&
        `https://github.com/${repo.fullName.toLowerCase()}` ===
          canonicalRepo(config.repositoryUrl) &&
        repo.isStub !== true,
    );
    if (matches.length > 1) throw new Error('Duplicate dashboard repository association');
    const repo =
      canonicalRepo(row.projectUrl) === canonicalRepo(config.repositoryUrl)
        ? matches[0]
        : undefined;
    return [
      {
        packageId: config.packageId,
        ...(version(row.latestVersion) ? { version: row.latestVersion } : {}),
        ...(count(row.totalDownloads) ? { totalDownloads: row.totalDownloads } : {}),
        lifecycle: row.retired === true ? 'retired' : row.retired === false ? 'active' : 'unknown',
        ...(typeof row.listed === 'boolean' ? { listed: row.listed } : {}),
        ...(repo
          ? {
              repositoryUrl: config.repositoryUrl,
              ...(typeof repo.archived === 'boolean' ? { repositoryArchived: repo.archived } : {}),
              ...(repo.retired === true ? { lifecycle: 'retired' as const } : {}),
            }
          : {}),
      },
    ];
  });
  if (packages.length === 0) throw new Error('Dashboard contains no curated packages');
  return {
    sourceUpdatedAt: source.date,
    repositorySourceUpdatedAt: repos.date,
    packages,
  };
}

export function validatePackageSnapshot(value: unknown): asserts value is PackageSnapshot {
  if (
    !object(value) ||
    !timestamp(value.fetchedAt) ||
    !timestamp(value.sourceUpdatedAt) ||
    !timestamp(value.repositorySourceUpdatedAt) ||
    !Array.isArray(value.packages)
  )
    throw new Error('Invalid package snapshot');
  const seen = new Set<string>();
  for (const row of value.packages) {
    if (!object(row)) throw new Error('Invalid package snapshot entry');
    const config = curatedPackages.find((item) => item.packageId === row.packageId);
    if (
      !config ||
      seen.has(config.packageId) ||
      !['active', 'retired', 'unknown'].includes(String(row.lifecycle)) ||
      (row.version !== undefined && !version(row.version)) ||
      (row.totalDownloads !== undefined && !count(row.totalDownloads)) ||
      (row.listed !== undefined && typeof row.listed !== 'boolean') ||
      (row.repositoryUrl !== undefined && row.repositoryUrl !== config.repositoryUrl) ||
      (row.repositoryArchived !== undefined && typeof row.repositoryArchived !== 'boolean')
    )
      throw new Error('Invalid package snapshot entry');
    seen.add(config.packageId);
  }
}

export const stalePackages = (snapshot: PackageSnapshot, now = Date.now()) =>
  now -
    Math.min(Date.parse(snapshot.sourceUpdatedAt), Date.parse(snapshot.repositorySourceUpdatedAt)) >
  7 * 24 * 60 * 60 * 1000;

export const formatDownloads = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale).format(value);
export const formatPackageDate = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date));

export function displayedPackages(snapshot: PackageSnapshot, featured = false) {
  return curatedPackages
    .flatMap((config) => {
      const metrics = snapshot.packages.find((item) => item.packageId === config.packageId);
      if (
        !metrics ||
        (featured &&
          (!config.featured ||
            config.category !== 'ai' ||
            metrics.lifecycle !== 'active' ||
            metrics.listed === false ||
            metrics.repositoryArchived === true))
      )
        return [];
      return [{ ...config, ...metrics }];
    })
    .slice(0, featured ? 3 : 8);
}

export async function refreshPackages(
  previous: PackageSnapshot | undefined,
  request: (url: string) => Promise<string>,
  now = Date.now(),
): Promise<{ snapshot: PackageSnapshot | undefined; warning?: string }> {
  if (previous) validatePackageSnapshot(previous);
  let payloads: string[];
  try {
    payloads = await Promise.all([
      request(packageSources.nuget),
      request(packageSources.repositories),
    ]);
  } catch (error) {
    return {
      snapshot: previous,
      warning: `Package network failure; retaining last-good snapshot: ${String(error)}`,
    };
  }
  try {
    const normalized = normalizePackages(JSON.parse(payloads[0]), JSON.parse(payloads[1]), now);
    if (
      previous &&
      (Date.parse(normalized.sourceUpdatedAt) < Date.parse(previous.sourceUpdatedAt) ||
        Date.parse(normalized.repositorySourceUpdatedAt) <
          Date.parse(previous.repositorySourceUpdatedAt))
    )
      throw new Error('Dashboard snapshot is older than last-good data');
    if (
      previous &&
      previous.sourceUpdatedAt === normalized.sourceUpdatedAt &&
      previous.repositorySourceUpdatedAt === normalized.repositorySourceUpdatedAt &&
      JSON.stringify(previous.packages) === JSON.stringify(normalized.packages)
    )
      return { snapshot: previous };
    return { snapshot: { fetchedAt: new Date(now).toISOString(), ...normalized } };
  } catch (error) {
    return {
      snapshot: previous,
      warning: `Package schema failure; retaining last-good snapshot: ${String(error)}`,
    };
  }
}
