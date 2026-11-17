import assert from 'node:assert/strict';
import { test } from 'node:test';
import { events } from '../src/data/events';
import {
  eventDate,
  eventStatus,
  eventYear,
  selectEvents,
  validateEvents,
  type Appearance,
} from '../src/lib/events';

const now = Date.parse('2026-11-17T15:00:00Z');
const future = events.find((event) => event.id === 'foundry-04')!;
const dateOnly: Appearance = {
  ...future,
  id: 'date-only',
  precision: 'date',
  start: '2026-12-03',
  type: 'collaboration',
  end: undefined,
};

test('event status respects exact endpoints and date-only days without fabricated times', () => {
  assert.equal(eventStatus(future, Date.parse(future.start) - 1), 'upcoming');
  assert.equal(eventStatus(future, Date.parse(future.start)), 'live');
  assert.equal(eventStatus(future, Date.parse(future.end!) - 1), 'live');
  assert.equal(eventStatus(future, Date.parse(future.end!)), 'past');
  assert.equal(eventStatus(dateOnly, Date.parse('2026-12-02T23:59:59Z')), 'upcoming');
  assert.equal(eventStatus(dateOnly, Date.parse('2026-12-03T00:00:00Z')), 'today');
  assert.equal(eventStatus(dateOnly, Date.parse('2026-12-04T00:00:00Z')), 'past');
  assert.equal(eventDate(dateOnly, 'en'), 'December 3, 2026');
  assert.equal(eventYear({ ...future, start: '2027-01-01T01:00:00Z' }), '2026');
});

test('directory sorts upcoming chronologically and archive newest first with composable filters', () => {
  const upcoming = selectEvents(events, { view: 'upcoming' }, now);
  assert.deepEqual(
    upcoming.map((event) => event.id),
    [
      'new-year-new-bot-1',
      'dotnetconf-mississauga',
      'new-year-new-bot-2',
      'foundry-04',
      'new-year-new-bot-3',
    ],
  );
  const past = selectEvents(events, { view: 'past', type: 'conference', year: '2026' }, now);
  assert.equal(past.length, 6);
  assert.equal(past[0].id, 'global-ai-sarasota-keynote');
  assert.equal(past.at(-1)?.id, 'dotnet-day-agentic-modernization');
  assert.deepEqual(selectEvents(events, { year: '2025' }, now), []);
  assert.deepEqual(selectEvents(events, { view: 'upcoming', type: 'collaboration' }, now), []);
  const mixed = selectEvents(events, {}, now);
  assert.equal(mixed[0].id, upcoming[0].id);
  assert.equal(eventStatus(mixed[upcoming.length], now), 'past');
});

test('the archive includes verified community appearances beyond the four conference highlights', () => {
  const past = selectEvents(events, { view: 'past' }, now);
  assert.equal(past.length, 32);
  assert.equal(past[0].id, 'global-ai-sarasota-keynote');
  assert.equal(past.at(-1)?.id, 'standup-copilot-cli-sdk');
  assert.equal(selectEvents(events, { view: 'past', type: 'collaboration' }, now).length, 12);
  assert.equal(past.filter((event) => event.videoUrl).length, 22);
  assert.deepEqual(
    events
      .filter((event) => event.featured)
      .map((event) => event.id)
      .sort(),
    ['dotnetconf-brk007', 'dotnetconf-brk031', 'dotnetconf-brk037', 'dotnetconf-brk040'],
  );
});

test('mixed date-only and timed appearances sort by their displayed Pacific day', () => {
  const date = { ...dateOnly, id: 'next-day', start: '2026-02-11' };
  const evening = {
    ...future,
    id: 'previous-evening',
    start: '2026-02-11T02:00:00Z',
    end: '2026-02-11T03:00:00Z',
  };
  assert.equal(eventDate(evening, 'en'), 'February 10, 2026');
  assert.deepEqual(
    selectEvents([evening, date], { view: 'past' }, now).map((event) => event.id),
    ['next-day', 'previous-evening'],
  );
});

test('public catalogue rejects duplicates/bad dates and keeps conference and recurring series distinct', () => {
  assert.doesNotThrow(() => validateEvents(events));
  assert.throws(() => validateEvents([future, future]), /Duplicate/);
  assert.throws(() => validateEvents([{ ...future, end: future.start }]), /dates/);
  assert.throws(() => validateEvents([{ ...dateOnly, start: 'not-a-date' }]), /dates/);
  assert.throws(() => validateEvents([{ ...dateOnly, start: '2026-02-30' }]), /dates/);
  assert.throws(() => validateEvents([{ ...future, start: '2026-12-03T17:00:00' }]), /dates/);
  assert.throws(() => validateEvents([{ ...future, url: 'http://example.com/' }]), /link/);
  assert.equal(future.videoUrl, undefined);
  assert.equal(events.filter((event) => event.featured && event.videoUrl).length, 4);
  const conference = events.find((event) => event.id === 'dotnetconf-brk007')!;
  assert.equal(conference.type, 'conference');
  assert.equal(future.type, 'livestream');
  assert.match(conference.summary.en, /30-minute/);
  assert.match(future.summary.en, /biweekly/);
});
