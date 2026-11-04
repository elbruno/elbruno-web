import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { httpsUrl, validEntry, type ExternalEntry, type Source } from './model';

const entities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '...',
  ndash: '-',
  mdash: ',',
};
export function plainText(value: unknown, limit = 180): string {
  const text = String(value ?? '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
      if (entity.startsWith('#')) {
        const code =
          entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
        return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
      }
      return entities[entity.toLowerCase()] ?? match;
    })
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > limit ? `${text.slice(0, limit - 3).trimEnd()}...` : text;
}
function list<T>(value: T | T[] | undefined): T[] {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}
type XmlItem = Record<string, unknown>;
function string(value: unknown): string {
  if (value && typeof value === 'object' && '#text' in value)
    return String((value as XmlItem)['#text']);
  return String(value ?? '');
}
export function normalize(entries: unknown[], now = Date.now()): ExternalEntry[] {
  const urls = new Set<string>();
  const ids = new Set<string>();
  return entries
    .filter(validEntry)
    .filter((entry) => Date.parse(entry.publishedAt) <= now)
    .sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.url.localeCompare(b.url),
    )
    .filter((entry) => {
      if (urls.has(entry.url) || ids.has(entry.id)) return false;
      urls.add(entry.url);
      ids.add(entry.id);
      return true;
    })
    .slice(0, 3);
}
export function parseFeed(xml: string, source: Source, now = Date.now()): ExternalEntry[] {
  if (Buffer.byteLength(xml) > 2_000_000) throw new Error('Feed exceeds size limit');
  if (/<!DOCTYPE|<!ENTITY/i.test(xml))
    throw new Error('DTD and entity declarations are not allowed');
  if (XMLValidator.validate(xml) !== true) throw new Error('Invalid XML');
  const parsed = new XMLParser({
    ignoreAttributes: false,
    processEntities: true,
    htmlEntities: true,
    trimValues: true,
  }).parse(xml);
  const channel = parsed.rss?.channel;
  const feed = parsed.feed;
  if (channel === undefined && feed === undefined) throw new Error('Unsupported feed');
  const items = list<XmlItem>(channel?.item ?? feed?.entry);
  const entries = items.map((item) => {
    const link =
      typeof item.link === 'string'
        ? item.link
        : list<XmlItem>(item.link as XmlItem | XmlItem[]).find(
            (link) => link['@_rel'] === 'alternate' || !link['@_rel'],
          )?.['@_href'];
    const url = string(link);
    const date = new Date(string(item.pubDate ?? item.published ?? item.updated));
    if (!httpsUrl(url) || !Number.isFinite(date.getTime())) return null;
    return {
      id: string(item.guid ?? item.id ?? url),
      title: plainText(string(item.title), 500),
      url,
      publishedAt: date.toISOString(),
      summary: plainText(
        string(
          item.description ??
            item.summary ??
            (item['media:group'] as XmlItem)?.['media:description'],
        ),
      ),
      source,
    };
  });
  const normalized = normalize(entries, now);
  if (!normalized.length) throw new Error('Feed contains no valid published entries');
  return normalized;
}
