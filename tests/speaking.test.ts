import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bios } from '../src/data/speaking';
import { talkDate, talkTime, talkStatus, talks, foundrySeries, botSeries } from '../src/data/talks';
test('all six factual draft biographies have useful requested lengths', () => {
  for (const language of ['en', 'es'] as const) {
    for (const length of ['50', '100', '200'] as const) {
      const count = bios[language][length].split(/\s+/).length;
      assert.ok(
        count >= Number(length) * 0.8 && count <= Number(length) * 1.2,
        `${language}/${length}: ${count} words`,
      );
      assert.match(bios[language][length], /Bruno Capuano/);
      assert.ok(!bios[language][length].includes('\u2014'));
    }
  }
});

test('session status changes at the exact scheduled start and end, without implying a recording', () => {
  for (const talk of [...talks, ...foundrySeries.sessions, ...botSeries.sessions]) {
    const start = Date.parse(talk.start);
    const end = Date.parse(talk.end);
    assert.equal(talkStatus(talk.start, talk.end, start - 1), 'upcoming');
    assert.equal(talkStatus(talk.start, talk.end, start), 'live');
    assert.equal(talkStatus(talk.start, talk.end, end - 1), 'live');
    assert.equal(talkStatus(talk.start, talk.end, end), 'past');
  }
});

test('session dates use the official Pacific day in both languages', () => {
  assert.equal(talkDate(talks[0].start, 'en'), 'November 11, 2026');
  assert.equal(talkDate(talks[0].start, 'es'), '11 de noviembre de 2026');
  assert.equal(talkDate(foundrySeries.sessions[0].start, 'en'), 'November 12, 2026');
  assert.equal(talkDate(foundrySeries.sessions[1].start, 'es'), '3 de diciembre de 2026');
  assert.equal(talkDate(botSeries.sessions[0].start, 'en'), 'November 24, 2026');
  assert.equal(talkDate(botSeries.sessions[1].start, 'es'), '1 de diciembre de 2026');
  assert.equal(talkDate(botSeries.sessions[2].start, 'en'), 'December 8, 2026');
  for (const session of botSeries.sessions) {
    assert.equal(talkTime(session.start), '10:00');
    assert.equal(talkTime(session.end), '11:00');
  }
});
