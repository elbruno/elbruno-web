import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { format } from 'prettier';

const output = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4322';
const origin = new URL(baseUrl).origin;
const results = [];
const screenshots = [];
const browser = await chromium.launch();
try {
  for (const [device, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    await mkdir(path.join(output, device), { recursive: true });
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        isMobile: device === 'mobile',
        hasTouch: device === 'mobile',
        colorScheme: theme,
        reducedMotion: 'reduce',
      });
      for (const locale of ['en', 'es']) {
        for (const name of ['home', 'projects']) {
          const route = `${locale === 'es' ? '/es/' : '/'}${name === 'home' ? '' : 'projects/'}`;
          const page = await context.newPage();
          const issues = [];
          page.on('pageerror', (error) => issues.push(error.message));
          page.on('console', (message) => {
            if (message.type() === 'error') issues.push(message.text());
          });
          page.on('requestfailed', (request) => issues.push(`Request failed: ${request.url()}`));
          page.on('response', (response) => {
            if (new URL(response.url()).origin === origin && response.status() >= 400)
              issues.push(`HTTP ${response.status()}: ${response.url()}`);
          });
          await page.addInitScript(() => {
            window.__v04Metrics = { lcpMs: null, cls: 0 };
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) window.__v04Metrics.lcpMs = entry.startTime;
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries())
                if (!entry.hadRecentInput) window.__v04Metrics.cls += entry.value;
            }).observe({ type: 'layout-shift', buffered: true });
          });
          const response = await page.goto(new URL(route, baseUrl).href, {
            waitUntil: 'networkidle',
          });
          if (!response?.ok()) throw new Error(`${route}: HTTP ${response?.status()}`);
          await page.locator('.theme-toggle').click();
          await page.waitForFunction(
            (initial) => document.documentElement.dataset.theme !== initial,
            theme,
          );
          await page.locator('.theme-toggle').click();
          await page.waitForFunction(
            (initial) => document.documentElement.dataset.theme === initial,
            theme,
          );
          await page.evaluate(async () => {
            await document.fonts.ready;
            for (const image of document.images) image.loading = 'eager';
            await Promise.all(
              [...document.images].map((image) => image.decode().catch(() => undefined)),
            );
            for (
              let y = 0;
              y < document.documentElement.scrollHeight;
              y += window.innerHeight * 0.75
            ) {
              window.scrollTo(0, y);
              await new Promise((resolve) => requestAnimationFrame(resolve));
            }
            window.scrollTo(0, 0);
            await new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            );
          });
          const audit = await page.evaluate(() => ({
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            brokenImages: [...document.images]
              .filter((image) => !image.complete || !image.naturalWidth)
              .map((image) => image.src),
            locale: document.documentElement.lang,
            theme: document.documentElement.dataset.theme,
            cards: document.querySelectorAll('[data-package]').length,
            metrics: window.__v04Metrics,
            transferBytes: performance
              .getEntriesByType('resource')
              .reduce((sum, entry) => sum + entry.transferSize, 0),
            scripts: [...document.scripts]
              .filter((script) => script.src)
              .map((script) => new URL(script.src).pathname),
          }));
          if (audit.documentWidth > viewport.width) issues.push('Horizontal overflow');
          if (audit.brokenImages.length)
            issues.push(`Broken images: ${audit.brokenImages.join(', ')}`);
          if (audit.locale !== locale || audit.theme !== theme)
            issues.push('Locale/theme mismatch');
          if (audit.cards !== (name === 'home' ? 3 : 6)) issues.push('Missing package cards');
          const heading =
            locale === 'en'
              ? name === 'home'
                ? 'AI & .NET libraries'
                : 'Packages & libraries'
              : name === 'home'
                ? 'Librerías de IA y .NET'
                : 'Paquetes y librerías';
          if ((await page.getByRole('heading', { name: heading, exact: true }).count()) !== 1)
            issues.push('Missing localized package heading');
          const prefix = `${name}-${locale}-${theme}-${device}`;
          for (const fullPage of [true, false]) {
            const filename = `${device}/${prefix}-${fullPage ? 'full' : 'viewport'}.png`;
            await page.screenshot({
              path: path.join(output, filename),
              fullPage,
              animations: 'disabled',
            });
            screenshots.push({
              filename,
              route,
              viewport: `${viewport.width}x${viewport.height}`,
              theme,
              type: fullPage ? 'Full page' : 'Viewport',
              issues,
            });
          }
          results.push({ route, device, theme, audit, issues });
          console.log(`${prefix}: ${issues.length ? issues.join('; ') : 'OK'}`);
          await page.close();
        }
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}

for (const device of ['desktop', 'mobile']) {
  const selected = screenshots.filter(
    (item) => item.filename.startsWith(device) && item.type === 'Full page',
  );
  const width = device === 'desktop' ? 260 : 175;
  const height = 850;
  const gap = 16;
  const labelHeight = 30;
  const columns = 4;
  const composites = [];
  for (const [index, shot] of selected.entries()) {
    const left = gap + (index % columns) * (width + gap);
    const top = gap + Math.floor(index / columns) * (height + labelHeight + gap);
    const label = Buffer.from(
      `<svg width="${width}" height="${labelHeight}"><rect width="100%" height="100%" fill="#f3effa"/><text x="6" y="20" font-size="12" font-family="sans-serif" fill="#35205c">${path.basename(shot.filename).replace(`-${device}-full.png`, '')}</text></svg>`,
    );
    composites.push({ input: label, left, top });
    const image = await sharp(path.join(output, shot.filename))
      .resize({ width, height, fit: 'contain', background: '#ffffff' })
      .png()
      .toBuffer();
    composites.push({ input: image, left, top: top + labelHeight });
  }
  await sharp({
    create: {
      width: gap + columns * (width + gap),
      height: gap + 2 * (height + labelHeight + gap),
      channels: 3,
      background: '#e8e1f3',
    },
  })
    .composite(composites)
    .png({ palette: true })
    .toFile(path.join(output, `contact-sheet-${device}.png`));
}
await writeFile(
  path.join(output, 'qa-results.json'),
  await format(JSON.stringify(results), { parser: 'json', printWidth: 100 }),
);
const issues = results.flatMap((item) =>
  item.issues.map((issue) => `${item.device}/${item.theme} ${item.route}: ${issue}`),
);
const markdown = `# v0.4 visual review

Actual Chromium captures of the local production build. No mockups or generated artwork.

- Reproduce: \`npm run build\`, start \`npm run preview -- --host 127.0.0.1 --port 4322\`, then \`node screenshots/v04-review/capture.mjs\`.
- Desktop 1440×900; mobile 390×844; device scale 1; EN/ES; light/dark.
- Fonts and image decoding awaited, lazy images loaded, site controls exercised, animations disabled.
- 32 screenshots, two lightweight contact sheets, and [machine-readable audits](qa-results.json).
- [Desktop contact sheet](contact-sheet-desktop.png) / [Mobile contact sheet](contact-sheet-mobile.png).
- Local unthrottled timing samples are diagnostic, not Lighthouse or field performance scores.

## Issues

${issues.length ? issues.map((issue) => `- ${issue}`).join('\n') : 'No horizontal overflow, broken images, missing package translations, local HTTP failures or browser console/page errors found in the capture matrix. Automated checks do not replace owner visual approval.'}

## Screenshot inventory

| Screenshot | Route | Viewport | Theme | Capture |
|---|---|---|---|---|
${screenshots.map((shot) => `| [${shot.filename}](${shot.filename}) | ${shot.route} | ${shot.viewport} | ${shot.theme} | ${shot.type} |`).join('\n')}
`;
await writeFile(
  path.join(output, 'README.md'),
  await format(markdown, { parser: 'markdown', printWidth: 100 }),
);
if (issues.length) process.exitCode = 1;
