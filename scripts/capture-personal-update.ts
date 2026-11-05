import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const baseURL = 'http://127.0.0.1:4321';
const output = resolve('screenshots', 'v05-personal-update');
const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};
const routes = { home: '', about: 'about/', speaking: 'speaking/', projects: 'projects/' };
const captures: { file: string; route: string; width: number; height: number; theme: string }[] =
  [];
const issues: string[] = [];
const browser = await chromium.launch();
try {
  for (const [device, viewport] of Object.entries(viewports)) {
    await mkdir(join(output, device), { recursive: true });
    for (const theme of ['light', 'dark'] as const) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        colorScheme: theme,
        reducedMotion: 'reduce',
        isMobile: device === 'mobile',
        hasTouch: device === 'mobile',
      });
      await context.addInitScript((value) => localStorage.setItem('theme', value), theme);
      const page = await context.newPage();
      page.on('pageerror', (error) => issues.push(`${page.url()}: ${error.message}`));
      for (const locale of ['en', 'es']) {
        for (const [name, path] of Object.entries(routes)) {
          const route = `${locale === 'es' ? '/es/' : '/'}${path}`;
          const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
          if (response?.status() !== 200) throw new Error(`Route failed: ${route}`);
          await page.locator(`html[lang="${locale}"][data-theme="${theme}"]`).waitFor();
          await page.addStyleTag({
            content:
              '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; caret-color: transparent !important; }',
          });
          await page.evaluate(async () => {
            await document.fonts.ready;
            for (
              let y = 0;
              y < document.documentElement.scrollHeight;
              y += window.innerHeight * 0.75
            ) {
              window.scrollTo(0, y);
              await new Promise((done) => window.setTimeout(done, 60));
            }
            await Promise.all([...document.images].map((image) => image.decode()));
            window.scrollTo(0, 0);
            await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
          });
          const audit = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth > window.innerWidth,
            images: [...document.images]
              .filter(
                (image) =>
                  !image.complete ||
                  image.naturalWidth === 0 ||
                  (!image.alt && !image.hasAttribute('alt')),
              )
              .map((image) => image.src),
            hiddenImages: [...document.images]
              .filter(
                (image) =>
                  image.getBoundingClientRect().width === 0 ||
                  image.getBoundingClientRect().height === 0,
              )
              .map((image) => image.src),
            missingAnchors: [...document.querySelectorAll<HTMLAnchorElement>('a[href]')]
              .filter(
                (anchor) =>
                  anchor.origin === location.origin &&
                  anchor.pathname === location.pathname &&
                  anchor.hash &&
                  !document.getElementById(decodeURIComponent(anchor.hash.slice(1))),
              )
              .map((anchor) => anchor.getAttribute('href')),
          }));
          if (
            audit.overflow ||
            audit.images.length ||
            audit.hiddenImages.length ||
            audit.missingAnchors.length
          )
            issues.push(`${device}/${theme}${route}: ${JSON.stringify(audit)}`);
          for (const kind of name === 'home' || name === 'about'
            ? ['full', 'viewport']
            : ['full']) {
            const filename = `${name}-${locale}-${device}-${kind}${theme === 'dark' ? '-dark' : ''}.png`;
            const file = `${device}/${filename}`;
            await page.screenshot({
              path: join(output, device, filename),
              fullPage: kind === 'full',
              animations: 'disabled',
            });
            captures.push({ file, route, ...viewport, theme });
            console.log(file);
          }
        }
      }
      await context.close();
    }

    const tiles = await Promise.all(
      captures
        .filter((capture) => capture.file.startsWith(device))
        .map(async (capture) => {
          const image = await sharp(join(output, capture.file))
            .resize({ width: 280, height: 600, fit: 'inside', withoutEnlargement: true })
            .toBuffer();
          const label = Buffer.from(
            `<svg width="300" height="50"><rect width="300" height="50" fill="#ffffff"/><text x="8" y="20" font-size="12" font-family="Arial" fill="#232036">${capture.file.split('/')[1].replace('.png', '')}</text><text x="8" y="38" font-size="11" font-family="Arial" fill="#605b71">${capture.route} | ${capture.width} x ${capture.height} | ${capture.theme}</text></svg>`,
          );
          return sharp({ create: { width: 300, height: 660, channels: 3, background: '#eeeaf4' } })
            .composite([
              { input: image, top: 50, left: 10 },
              { input: label, top: 0, left: 0 },
            ])
            .jpeg({ quality: 85 })
            .toBuffer();
        }),
    );
    await sharp({
      create: {
        width: 1200,
        height: Math.ceil(tiles.length / 4) * 660,
        channels: 3,
        background: '#eeeaf4',
      },
    })
      .composite(
        tiles.map((input, index) => ({
          input,
          left: (index % 4) * 300,
          top: Math.floor(index / 4) * 660,
        })),
      )
      .jpeg({ quality: 86 })
      .toFile(join(output, `contact-sheet-${device}.jpg`));
  }
} finally {
  await browser.close();
}

await writeFile(
  join(output, 'README.md'),
  `# V05 personal update screenshots

Captured ${new Date().toISOString()} from the local production build at ${baseURL}.
These are real Playwright Chromium screenshots, not generated mockups.

## Capture settings

- Desktop: 1440 x 900 CSS pixels. Mobile: 390 x 844 CSS pixels.
- Both English and Spanish, all four routes, full-page captures.
- Home and About also have viewport-only captures.
- Light is the standard review package. Dark captures are included because the site's surfaces, text and borders change materially.
- 48 screenshots: 32 full-page and 16 viewport-only (24 per theme).
- Fonts ready, lazy images scrolled into view and decoded, nonessential animation and transitions disabled.
- Original photographs and temporary editing files are excluded.
- Reproduce with a production preview running: \`npx tsx scripts/capture-personal-update.ts\`.

## Screenshots

| File | Route | Viewport | Theme |
| --- | --- | --- | --- |
${captures.map((capture) => `| [${capture.file}](${capture.file}) | ${capture.route} | ${capture.width} x ${capture.height} | ${capture.theme} |`).join('\n')}

## Contact sheets

- [Desktop](contact-sheet-desktop.jpg)
- [Mobile](contact-sheet-mobile.jpg)

## Discovered visual issues

${issues.length ? issues.map((issue) => `- ${issue}`).join('\n') : 'No horizontal overflow, broken or hidden images, missing same-page anchor targets, or browser runtime errors detected across the 32 route/language/viewport/theme combinations. Manual visual review is recorded in QA-summary.md.'}

Full-page PNG height follows actual page content; viewport dimensions above describe the browser, not the full-page image height.

Manual review note: the existing mobile Home photo caption overlaps the photograph and has limited contrast. This pre-existing styling is unchanged by V05. The new winter card is readable, with both Bruno and Ace visible.
`,
);
if (captures.length !== 48) throw new Error(`Expected 48 captures, got ${captures.length}`);
if (issues.length) throw new Error(`Screenshot audit failed: ${issues.join('; ')}`);
console.log(`Saved ${captures.length} screenshots, two contact sheets and README to ${output}`);
