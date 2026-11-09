import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const photos = [
  { source: '26-06-BusAllForMyself.png', name: 'hero-bus', widths: [480, 900] },
  {
    source: '24-10-bruno ai tour new york.jpg',
    name: 'hero-speaker-new-york',
    widths: [960, 1280],
  },
];
const output = resolve('public', 'images', 'hero');
const digest = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
await mkdir(output, { recursive: true });
for (const photo of photos) {
  const source = resolve('tmp', 'photos', photo.source);
  const original = await readFile(source);
  for (const width of photo.widths) {
    const path = resolve(output, `${photo.name}-${width}.webp`);
    await sharp(original)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path);
    const metadata = await sharp(path).metadata();
    if (metadata.exif || metadata.iptc || metadata.xmp)
      throw new Error('Private metadata retained');
    console.log(
      `${path}: ${metadata.width} x ${metadata.height}, ${(await readFile(path)).length} bytes`,
    );
  }
  if (digest(original) !== digest(await readFile(source)))
    throw new Error('Private source changed');
  console.log(`${photo.source} unchanged: SHA-256 ${digest(original)}.`);
}
