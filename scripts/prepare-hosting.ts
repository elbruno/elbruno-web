import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { indexingPolicy } from '../src/lib/indexing';

const policy = indexingPolicy(process.env.SITE_ENV, process.env.SITE_ORIGIN);
const configPath = new URL('../dist/staticwebapp.config.json', import.meta.url);
const config = JSON.parse(await readFile(configPath, 'utf8'));
if (policy.noindex) config.globalHeaders['X-Robots-Tag'] = 'noindex, nofollow';
else delete config.globalHeaders['X-Robots-Tag'];
await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
await writeFile(new URL('../dist/robots.txt', import.meta.url), policy.robots);
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const dirty = !!execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
await writeFile(
  new URL('../dist/build-info.json', import.meta.url),
  `${JSON.stringify({ sha, dirty, environment: policy.environment, builtAt: new Date().toISOString() }, null, 2)}\n`,
);
console.log(`Hosting policy: ${policy.environment}; source ${sha}; dirty=${dirty}`);
