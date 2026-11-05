import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseFeed } from '../src/lib/feeds/parse';
import {
  httpsUrl,
  validRepository,
  validateSnapshot,
  type RepositorySummary,
  type Source,
} from '../src/lib/feeds/model';
import { projects } from '../src/data/profile';
import { refreshPackages, validatePackageSnapshot } from '../src/lib/packages';

const path = fileURLToPath(new URL('../src/data/feeds/snapshot.json', import.meta.url));
const old = await readFile(path, 'utf8');
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
await Promise.all(
  (Object.keys(sources) as Source[]).map(async (source) => {
    try {
      const url = sources[source]!;
      const entries = parseFeed(await request(url), source);
      snapshot.entries = [
        ...snapshot.entries.filter((entry) => entry.source !== source),
        ...entries,
      ];
      snapshot.sources[source] =
        source === 'youtube' ? 'https://www.youtube.com/channel/UCyHCkJ4lsphfhu_ljRws6aA' : url;
      console.log(`${source}: ${entries.length} verified entries`);
    } catch (error) {
      console.warn(
        `${source}: keeping last known good snapshot. ${error instanceof Error ? error.message : 'Source unavailable'}`,
      );
    }
  }),
);
const repositories: RepositorySummary[] = [];
await Promise.all(
  projects.map(async (project) => {
    try {
      const repo = JSON.parse(
        await request(`https://api.github.com/repos/elbruno/${project.slug}`),
      );
      const normalized = {
        name: repo.name,
        url: repo.html_url,
        description: repo.description ?? '',
        ...(repo.language ? { language: repo.language } : {}),
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
      };
      if (!validRepository(normalized)) throw new Error('Invalid repository metadata');
      repositories.push(normalized);
    } catch (error) {
      console.warn(
        `${project.slug}: keeping last known good metadata. ${error instanceof Error ? error.message : 'Source unavailable'}`,
      );
      const previous = snapshot.repositories.find((repo) => repo.url === project.url);
      if (previous) repositories.push(previous);
    }
  }),
);
snapshot.repositories = projects.flatMap((project) =>
  repositories.filter((repo) => repo.url === project.url),
);
snapshot.entries.sort(
  (a, b) =>
    a.source.localeCompare(b.source) ||
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
    a.url.localeCompare(b.url),
);
const packageResult = await refreshPackages(packageSnapshot, request);
if (packageResult.warning) console.warn(packageResult.warning);
if (packageResult.snapshot) {
  validatePackageSnapshot(packageResult.snapshot);
  const packageOutput = `${JSON.stringify(packageResult.snapshot, null, 2)}\n`;
  if (oldPackages !== packageOutput) await writeFile(packagePath, packageOutput);
  console.log(`packages: ${packageResult.snapshot.packages.length} curated entries`);
}
validateSnapshot(snapshot);
const output = `${JSON.stringify(snapshot, null, 2)}\n`;
if (old === output) console.log('No normalized content changes.');
else {
  await writeFile(path, output);
  console.log('Snapshot updated.');
}
