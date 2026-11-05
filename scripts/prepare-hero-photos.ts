import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const source = resolve('tmp', 'photos', '26-06-BusAllForMyself.png');
const output = resolve('public', 'images', 'hero');
const original = await readFile(source);
const digest = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
await mkdir(output, { recursive: true });
for (const width of [480, 900]) {
  const path = resolve(output, `hero-bus-${width}.webp`);
  await sharp(original)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path);
  const metadata = await sharp(path).metadata();
  if (metadata.exif || metadata.iptc || metadata.xmp) throw new Error('Private metadata retained');
  console.log(
    `${path}: ${metadata.width} x ${metadata.height}, ${(await readFile(path)).length} bytes`,
  );
}
if (digest(original) !== digest(await readFile(source))) throw new Error('Private source changed');
console.log(`Source unchanged: SHA-256 ${digest(original)}. Publication approval pending.`);
