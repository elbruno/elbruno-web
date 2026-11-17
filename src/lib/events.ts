import type { Locale } from '../i18n';

export type EventType = 'conference' | 'livestream' | 'collaboration';
export type Appearance = {
  id: string;
  title: string;
  language: Locale;
  series: string;
  type: EventType;
  start: string;
  end?: string;
  url: string;
  videoUrl?: string;
  recordingScope?: 'event';
  resourcesUrl?: string;
  summary: Record<Locale, string>;
  featured?: boolean;
} & ({ precision: 'date' } | { precision: 'time'; end: string });

export function eventStatus(event: Appearance, now = Date.now()) {
  if (event.precision === 'date') {
    const start = Date.parse(`${event.start}T00:00:00Z`);
    return now < start ? 'upcoming' : now < start + 86_400_000 ? 'today' : 'past';
  }
  if (now < Date.parse(event.start)) return 'upcoming';
  return now < Date.parse(event.end) ? 'live' : 'past';
}

export function eventYear(event: Appearance) {
  return event.precision === 'date'
    ? event.start.slice(0, 4)
    : new Intl.DateTimeFormat('en', {
        year: 'numeric',
        timeZone: 'America/Los_Angeles',
      }).format(new Date(event.start));
}

function eventDay(event: Appearance) {
  if (event.precision === 'date') return event.start;
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(event.start));
  return ['year', 'month', 'day']
    .map((type) => parts.find((part) => part.type === type)!.value)
    .join('-');
}

export function selectEvents(
  events: readonly Appearance[],
  filters: { view?: string; year?: string; type?: string } = {},
  now = Date.now(),
) {
  const selected = events.filter((event) => {
    const past = eventStatus(event, now) === 'past';
    return (
      (!filters.view || filters.view === 'all' || (filters.view === 'past' ? past : !past)) &&
      (!filters.year || filters.year === 'all' || eventYear(event) === filters.year) &&
      (!filters.type || filters.type === 'all' || event.type === filters.type)
    );
  });
  return selected.sort((a, b) => {
    const aPast = eventStatus(a, now) === 'past';
    const bPast = eventStatus(b, now) === 'past';
    if (aPast !== bPast) return aPast ? 1 : -1;
    const chronological =
      eventDay(a).localeCompare(eventDay(b)) ||
      a.precision.localeCompare(b.precision) ||
      Date.parse(a.start) - Date.parse(b.start);
    return chronological * (aPast ? -1 : 1) || a.id.localeCompare(b.id);
  });
}

export function eventDate(event: Appearance, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: event.precision === 'date' ? 'UTC' : 'America/Los_Angeles',
  }).format(new Date(event.start));
}

export function validateEvents(events: readonly Appearance[]) {
  const ids = new Set<string>();
  const urls = new Set<string>();
  for (const event of events) {
    if (ids.has(event.id) || urls.has(event.url)) throw new Error(`Duplicate event: ${event.id}`);
    ids.add(event.id);
    urls.add(event.url);
    if (
      !Number.isFinite(Date.parse(event.start)) ||
      (event.precision === 'date' &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(event.start) ||
          new Date(event.start).toISOString().slice(0, 10) !== event.start)) ||
      (event.precision === 'time' &&
        (!/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(event.start) ||
          !/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(event.end) ||
          !Number.isFinite(Date.parse(event.end)) ||
          Date.parse(event.end) <= Date.parse(event.start)))
    )
      throw new Error(`Invalid event dates: ${event.id}`);
    for (const value of [event.url, event.videoUrl, event.resourcesUrl]) {
      if (!value) continue;
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password)
        throw new Error(`Invalid public event link: ${event.id}`);
    }
  }
}
