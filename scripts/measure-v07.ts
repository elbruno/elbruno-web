import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4321';
const output = resolve('screenshots', 'v07-review', 'evidence', 'lighthouse');
await mkdir(output, { recursive: true });
const info = await fetch(`${baseURL}/build-info.json`).then((response) => response.json());
if (info.environment !== 'production')
  throw new Error(
    'Measure an explicitly prepared local production build, not staging noindex output',
  );
const robots = await fetch(`${baseURL}/robots.txt`).then((response) => response.text());
if (!robots.includes('Allow: /')) throw new Error('Production robots policy is missing');
const hosting = JSON.parse(await readFile('dist/staticwebapp.config.json', 'utf8'));
if (hosting.globalHeaders['X-Robots-Tag'])
  throw new Error('Production output still contains a staging response header');
const productionRoutes = [
  '/',
  '/about/',
  '/projects/',
  '/speaking/',
  '/es/',
  '/es/about/',
  '/es/projects/',
  '/es/speaking/',
];
for (const route of productionRoutes) {
  const response = await fetch(`${baseURL}${route}`);
  const html = await response.text();
  if (!response.ok || /name="robots" content="noindex"/.test(html))
    throw new Error(`Production HTML is unavailable or noindex: ${route}`);
  if (!html.includes(`rel="canonical" href="https://elbruno.com${route}"`))
    throw new Error(`Production canonical mismatch: ${route}`);
}
await writeFile(
  resolve(output, 'production-indexing.json'),
  `${JSON.stringify(
    {
      build: info,
      routes: productionRoutes,
      allRoutesIndexable: true,
      robots,
      stagingHeaderAbsent: true,
    },
    null,
    2,
  )}\n`,
);

type Audit = { title: string; score: number | null; numericValue?: number; displayValue?: string };
type Result = {
  lighthouseVersion: string;
  fetchTime: string;
  userAgent: string;
  categories: Record<string, { score: number | null }>;
  audits: Record<string, Audit>;
  configSettings: { formFactor: string; throttlingMethod: string; throttling: unknown };
};
const runs = [];
for (const locale of ['en', 'es']) {
  const url = `${baseURL}/${locale === 'es' ? 'es/' : ''}`;
  const html = await fetch(url).then((response) => response.text());
  if (/name="robots" content="noindex"/.test(html))
    throw new Error(`Production HTML still contains noindex: ${url}`);
  for (const device of ['desktop', 'mobile']) {
    for (let run = 1; run <= 3; run++) {
      const path = resolve(output, `${locale}-${device}-${run}`);
      const args = [
        fileURLToPath(new URL('../node_modules/lighthouse/cli/index.js', import.meta.url)),
        url,
        '--chrome-flags=--headless --disable-gpu --no-first-run',
        '--only-categories=performance,accessibility,best-practices,seo',
        '--output=json',
        '--output=html',
        `--output-path=${path}`,
        '--quiet',
        ...(device === 'desktop' ? ['--preset=desktop'] : []),
      ];
      execFileSync(process.execPath, args, {
        env: { ...process.env, CHROME_PATH: chromium.executablePath() },
        stdio: 'inherit',
        timeout: 180_000,
      });
      const result: Result = JSON.parse(await readFile(`${path}.report.json`, 'utf8'));
      const measured = {
        locale,
        device,
        run,
        scores: Object.fromEntries(
          Object.entries(result.categories).map(([key, category]) => [
            key,
            (category.score ?? 0) * 100,
          ]),
        ),
        lcpMs: result.audits['largest-contentful-paint'].numericValue,
        cls: result.audits['cumulative-layout-shift'].numericValue,
        diagnostics: Object.entries(result.audits)
          .filter(([, audit]) => audit.score !== null && audit.score < 1)
          .map(([id, audit]) => ({
            id,
            title: audit.title,
            score: audit.score,
            value: audit.displayValue,
          })),
        lighthouseVersion: result.lighthouseVersion,
        userAgent: result.userAgent,
        fetchTime: result.fetchTime,
        settings: result.configSettings,
      };
      runs.push(measured);
      console.log(
        JSON.stringify({
          locale,
          device,
          run,
          scores: measured.scores,
          lcpMs: measured.lcpMs,
          cls: measured.cls,
        }),
      );
    }
  }
}
await writeFile(
  resolve(output, 'summary.json'),
  `${JSON.stringify({ baseURL, platform: process.platform, node: process.version, build: info, runs }, null, 2)}\n`,
);
