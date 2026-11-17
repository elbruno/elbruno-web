import type { ExternalEntry, Source } from './model';

export function selectFeedEntries(
  entries: readonly ExternalEntry[],
  source: Source,
  now = Date.now(),
) {
  return entries
    .filter((entry) => entry.source === source && Date.parse(entry.publishedAt) <= now)
    .sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.url.localeCompare(b.url),
    )
    .slice(0, source === 'youtube' ? 3 : 2);
}
