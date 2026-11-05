import { readFile } from 'node:fs/promises';
import { validateSnapshot } from '../src/lib/feeds/model';
import { validatePackageSnapshot } from '../src/lib/packages';
const snapshot: unknown = JSON.parse(
  await readFile(new URL('../src/data/feeds/snapshot.json', import.meta.url), 'utf8'),
);
validateSnapshot(snapshot);
const packages: unknown = JSON.parse(
  await readFile(new URL('../src/data/nuget/snapshot.json', import.meta.url), 'utf8'),
);
validatePackageSnapshot(packages);
console.log('Content snapshot is valid.');
