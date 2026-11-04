import { readFile } from 'node:fs/promises';
import { validateSnapshot } from '../src/lib/feeds/model';
const snapshot: unknown = JSON.parse(
  await readFile(new URL('../src/data/feeds/snapshot.json', import.meta.url), 'utf8'),
);
validateSnapshot(snapshot);
console.log('Content snapshot is valid.');
