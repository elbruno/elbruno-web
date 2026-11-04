import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';

interface ArchiveEntry {
  name: string;
  data: Buffer;
}

function crc32(data: Buffer) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZip(entries: ArchiveEntry[]) {
  const localRecords: Buffer[] = [];
  const centralRecords: Buffer[] = [];
  const dosDate = ((2026 - 1980) << 9) | (1 << 5) | 1;
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8');
    const compressed = deflateRawSync(entry.data, { level: 9 });
    const checksum = crc32(entry.data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(entry.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    localRecords.push(local, name, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralRecords.push(central, name);
    offset += local.length + name.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralRecords);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localRecords, centralDirectory, end]);
}

async function main() {
  const root = process.cwd();
  const speakerDir = path.join(root, 'public', 'downloads', 'speaker');
  const photoNames = [
    '21-11 Bruno Headshot for Msft.jpg',
    '22-01 Bruno speaking in Podioum 1.jpg',
    '22-01 Bruno speaking in Podioum 2.jpg',
  ];
  const entries: ArchiveEntry[] = await Promise.all(
    photoNames.map(async (name) => ({
      name: `photos/${name}`,
      data: await readFile(path.join(speakerDir, name)),
    })),
  );
  entries.push({
    name: 'README.txt',
    data: Buffer.from(
      [
        'BRUNO CAPUANO SPEAKER KIT',
        '',
        'This organizer kit contains three authentic photographs.',
        'A short public introduction and current resources are available at:',
        'https://elbruno.com/speaking/',
        '',
        'LinkedIn: https://www.linkedin.com/in/elbruno/',
        'GitHub: https://github.com/elbruno',
        'Blog: https://elbruno.com',
        'Podcast: https://notienenombre.com',
        '',
        'The photo files are JPEG copies with location metadata removed.',
        'They have not been generatively edited. The original source photographs remain unchanged.',
        'This download does not grant image reuse rights. Confirm permission and required credit',
        'with Bruno before publishing or redistributing any photograph.',
        '',
        'The ZIP contains only the three official photos and this README.',
        '',
      ].join('\n'),
      'utf8',
    ),
  });

  const output = path.join(speakerDir, 'speaker-kit.zip');
  await mkdir(speakerDir, { recursive: true });
  await writeFile(output, createZip(entries));
  console.log(`Created ${path.relative(root, output)} with ${entries.length} files.`);
}

await main();
