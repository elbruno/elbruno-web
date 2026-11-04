import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { inflateRawSync } from 'node:zlib';
import sharp from 'sharp';
import { route, translations } from '../src/i18n/index';
import { projects } from '../src/data/profile';
import { careerEntries, selectedWork } from '../src/data/cv';

test('language switching preserves every supported route', () => {
  for (const page of ['', 'about', 'projects', 'speaking'] as const) {
    assert.equal(route('es', page), `/es/${page ? `${page}/` : ''}`);
    assert.equal(route('en', page), `/${page ? `${page}/` : ''}`);
  }
});
test('translation structures have parity including array entries', () => {
  function shape(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(shape);
    if (value && typeof value === 'object')
      return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, shape(val)]));
    return typeof value;
  }
  assert.deepEqual(shape(translations.en), shape(translations.es));
});
test('project descriptions preserve the verified teleprompter identity', () => {
  const prompt = projects.find((project) => project.slug === 'PromptDot')!;
  assert.match(prompt.en, /teleprompter/);
  assert.match(prompt.es, /teleprompter/);
});
test('CV content contains only linked, verified career facts and evidence-backed work', () => {
  assert.ok(careerEntries.length > 0);
  assert.ok(careerEntries.every((entry) => entry.verified && entry.source.startsWith('https://')));
  assert.ok(careerEntries.every((entry) => entry.period === null));
  assert.ok(selectedWork.length >= 2 && selectedWork.length <= 4);
  assert.ok(selectedWork.every((item) => item.href.startsWith('https://')));
});

function readZipEntries(archive: Buffer) {
  const end = archive.lastIndexOf(Buffer.from('504b0506', 'hex'));
  assert.notEqual(end, -1, 'ZIP end record is present');
  const count = archive.readUInt16LE(end + 10);
  const entries = new Map<string, Buffer>();
  let cursor = archive.readUInt32LE(end + 16);

  for (let index = 0; index < count; index++) {
    assert.equal(archive.readUInt32LE(cursor), 0x02014b50, 'central directory record is valid');
    const method = archive.readUInt16LE(cursor + 10);
    const compressedSize = archive.readUInt32LE(cursor + 20);
    const uncompressedSize = archive.readUInt32LE(cursor + 24);
    const nameLength = archive.readUInt16LE(cursor + 28);
    const extraLength = archive.readUInt16LE(cursor + 30);
    const commentLength = archive.readUInt16LE(cursor + 32);
    const localOffset = archive.readUInt32LE(cursor + 42);
    const name = archive.toString('utf8', cursor + 46, cursor + 46 + nameLength);
    const localNameLength = archive.readUInt16LE(localOffset + 26);
    const localExtraLength = archive.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = archive.subarray(dataStart, dataStart + compressedSize);
    const data = method === 8 ? inflateRawSync(compressed) : compressed;
    assert.equal(data.length, uncompressedSize, `${name} decompresses to the expected size`);
    entries.set(name, data);
    cursor += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

test('speaker kit ZIP contains only its three safe photos, draft bios and usage notes', async () => {
  const archive = readZipEntries(await readFile('public/downloads/speaker/speaker-kit.zip'));
  const photoNames = [
    '21-11 Bruno Headshot for Msft.jpg',
    '22-01 Bruno speaking in Podioum 1.jpg',
    '22-01 Bruno speaking in Podioum 2.jpg',
  ];
  assert.deepEqual(
    [...archive.keys()].sort(),
    [
      'README.txt',
      'bios-en.txt',
      'bios-es.txt',
      ...photoNames.map((name) => `photos/${name}`),
    ].sort(),
  );

  for (const name of photoNames) {
    const photo = archive.get(`photos/${name}`)!;
    assert.deepEqual(
      photo,
      await readFile(`public/downloads/speaker/${name}`),
      `${name} in the ZIP matches its individual download`,
    );
    const metadata = await sharp(photo).metadata();
    assert.equal(metadata.exif, undefined, `${name} contains no EXIF metadata`);
  }

  assert.match(archive.get('bios-en.txt')!.toString(), /approval pending/i);
  assert.match(archive.get('bios-es.txt')!.toString(), /pendientes de aprobación/i);
  assert.match(archive.get('README.txt')!.toString(), /does not grant image reuse rights/i);
});
