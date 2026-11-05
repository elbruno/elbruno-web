import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const source = resolve('tmp', 'photos', '24-12-Bruno running with ACE snow.jpg');
const destination = resolve('public', 'images', 'personal');
const hash = async () =>
  createHash('sha256')
    .update(await readFile(source))
    .digest('hex');
const before = await hash();
await mkdir(destination, { recursive: true });
for (const width of [600, 908]) {
  const output = resolve(destination, `canadian-winters-${width}.webp`);
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);
  const metadata = await sharp(output).metadata();
  if (metadata.exif || metadata.xmp || metadata.iptc)
    throw new Error(`Private metadata found in ${output}`);
  console.log(`${output}: ${metadata.width} x ${metadata.height}`);
}
if ((await hash()) !== before) throw new Error('The private source photograph changed.');
console.log(`Original unchanged (SHA-256 ${before}). No source assets copied.`);
