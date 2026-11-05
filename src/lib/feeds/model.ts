export type Source = 'blog' | 'podcast' | 'youtube';
export type ExternalEntry = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  summary?: string;
  source: Source;
};
export type RepositorySummary = {
  name: string;
  url: string;
  description: string;
  language?: string;
  stars?: number;
  updatedAt?: string;
};
export type Snapshot = {
  sources: Record<Source, string | null>;
  entries: ExternalEntry[];
  repositories: RepositorySummary[];
  fetchedAt?: Partial<Record<Source | 'repositories', string>>;
};
export function httpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}
export function validEntry(value: unknown): value is ExternalEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    entry.id.length > 0 &&
    typeof entry.title === 'string' &&
    entry.title.trim().length > 0 &&
    entry.title.length <= 500 &&
    httpsUrl(entry.url) &&
    typeof entry.publishedAt === 'string' &&
    Number.isFinite(Date.parse(entry.publishedAt)) &&
    (entry.summary === undefined ||
      (typeof entry.summary === 'string' && entry.summary.length <= 240)) &&
    ['blog', 'podcast', 'youtube'].includes(String(entry.source))
  );
}
export function validRepository(value: unknown): value is RepositorySummary {
  if (!value || typeof value !== 'object') return false;
  const repo = value as Record<string, unknown>;
  return (
    typeof repo.name === 'string' &&
    repo.name.length > 0 &&
    httpsUrl(repo.url) &&
    new URL(repo.url).hostname === 'github.com' &&
    typeof repo.description === 'string' &&
    (repo.stars === undefined || (Number.isSafeInteger(repo.stars) && Number(repo.stars) >= 0)) &&
    (repo.language === undefined || typeof repo.language === 'string') &&
    (repo.updatedAt === undefined ||
      (typeof repo.updatedAt === 'string' && Number.isFinite(Date.parse(repo.updatedAt))))
  );
}
export function validateSnapshot(value: unknown): asserts value is Snapshot {
  if (!value || typeof value !== 'object') throw new Error('Snapshot must be an object');
  const data = value as Snapshot;
  if (
    data.fetchedAt !== undefined &&
    (!data.fetchedAt ||
      typeof data.fetchedAt !== 'object' ||
      Array.isArray(data.fetchedAt) ||
      Object.entries(data.fetchedAt).some(
        ([source, date]) =>
          !['blog', 'podcast', 'youtube', 'repositories'].includes(source) ||
          typeof date !== 'string' ||
          !Number.isFinite(Date.parse(date)),
      ))
  )
    throw new Error('Invalid snapshot refresh timestamps');
  if (
    !data.sources ||
    !(['blog', 'podcast', 'youtube'] as const).every(
      (source) => data.sources[source] === null || httpsUrl(data.sources[source]),
    )
  )
    throw new Error('Invalid source configuration');
  if (!Array.isArray(data.entries) || !data.entries.every(validEntry))
    throw new Error('Invalid feed entry');
  if (!Array.isArray(data.repositories) || !data.repositories.every(validRepository))
    throw new Error('Invalid repository metadata');
  for (const source of ['blog', 'podcast', 'youtube']) {
    const entries = data.entries.filter((entry) => entry.source === source);
    if (entries.length > 3 || new Set(entries.map((entry) => entry.url)).size !== entries.length)
      throw new Error(`Invalid ${source} entry count or duplicate URL`);
    if (
      entries.some(
        (entry, i) =>
          i > 0 && Date.parse(entry.publishedAt) > Date.parse(entries[i - 1].publishedAt),
      )
    )
      throw new Error(`${source} entries are not newest first`);
  }
}
