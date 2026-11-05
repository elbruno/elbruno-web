import { parseFeed } from './parse';
import { validRepository, type RepositorySummary, type Snapshot, type Source } from './model';

type Request = (url: string) => Promise<string>;

export async function refreshFeed(
  previous: Snapshot,
  source: Source,
  url: string,
  request: Request,
  now = Date.now(),
): Promise<{ snapshot: Snapshot; warning?: string }> {
  try {
    const entries = parseFeed(await request(url), source, now);
    const sourceUrl = source === 'youtube' ? previous.sources.youtube : url;
    if (
      previous.fetchedAt?.[source] &&
      previous.sources[source] === sourceUrl &&
      JSON.stringify(previous.entries.filter((entry) => entry.source === source)) ===
        JSON.stringify(entries)
    )
      return { snapshot: previous };
    return {
      snapshot: {
        ...previous,
        sources: {
          ...previous.sources,
          [source]: sourceUrl,
        },
        entries: [...previous.entries.filter((entry) => entry.source !== source), ...entries],
        fetchedAt: { ...previous.fetchedAt, [source]: new Date(now).toISOString() },
      },
    };
  } catch (error) {
    return {
      snapshot: previous,
      warning: `${source}: keeping last known good snapshot. ${String(error)}`,
    };
  }
}

export async function refreshRepository(
  project: { slug: string; url: string },
  previous: RepositorySummary | undefined,
  request: Request,
): Promise<{ repository?: RepositorySummary; warning?: string }> {
  try {
    const repo = JSON.parse(await request(`https://api.github.com/repos/elbruno/${project.slug}`));
    const normalized = {
      name: repo.name,
      url: repo.html_url,
      description: repo.description ?? '',
      ...(repo.language ? { language: repo.language } : {}),
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    };
    if (!validRepository(normalized) || normalized.url.toLowerCase() !== project.url.toLowerCase())
      throw new Error('Invalid or unexpected repository metadata');
    return { repository: normalized };
  } catch (error) {
    return {
      repository: previous,
      warning: `${project.slug}: keeping last known good metadata. ${String(error)}`,
    };
  }
}
