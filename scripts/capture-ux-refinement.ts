import { chromium, type Page } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { heroStories, carouselText } from '../src/data/hero-stories';

const v07 = process.argv.includes('--v07');
const output = resolve('screenshots', v07 ? 'v07-review' : 'v06-ux-refinement');
const baseURL = 'http://127.0.0.1:4321';
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const routes = { home: '', about: 'about/', projects: 'projects/', 'speaker-kit': 'speaking/' };
type Capture = {
  file: string;
  route: string;
  locale: string;
  device: string;
  kind: string;
  theme: string;
  slide?: number;
  heroBox?: { left: number; top: number; width: number; height: number };
};
const captures: Capture[] = [];
const issues: string[] = [];

async function ready(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) {
      if (!image.closest('[hidden]') && image.getAttribute('src')) {
        image.loading = 'eager';
        await image.decode();
      }
    }
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  });
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [device, viewport] of Object.entries(viewports)) {
    await mkdir(join(output, device), { recursive: true });
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      isMobile: device === 'mobile',
      hasTouch: device === 'mobile',
      colorScheme: 'light',
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => issues.push(`${page.url()}: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') issues.push(`${page.url()}: ${message.text()}`);
    });
    for (const locale of ['en', 'es'] as const) {
      const prefix = locale === 'en' ? '/' : '/es/';
      async function navigate(path: string, theme = 'light') {
        const response = await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
        if (response?.status() !== 200) throw new Error(`Route failed: ${path}`);
        await page.evaluate((value) => {
          localStorage.setItem('theme', value);
          document.documentElement.dataset.theme = value;
        }, theme);
        const play = page.locator('.story-play');
        if (await play.count()) {
          await play.waitFor();
          if ((await play.getAttribute('aria-label')) === carouselText[locale].pause)
            await play.evaluate((button: HTMLButtonElement) => button.click());
        }
        await page.addStyleTag({
          content:
            '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; caret-color: transparent !important; }',
        });
        await ready(page);
      }
      async function capture(
        name: string,
        route: string,
        kind: string,
        selector?: string,
        slide?: number,
        theme = 'light',
      ) {
        await ready(page);
        const audit = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          broken: [...document.images]
            .filter(
              (image) =>
                !image.closest('[hidden]') &&
                image.getAttribute('src') &&
                (!image.complete || image.naturalWidth === 0),
            )
            .map((image) => image.src),
          clippedCaptions: [
            ...document.querySelectorAll('.story-slide:not([hidden]) figcaption'),
          ].some((element) => element.scrollHeight > element.clientHeight),
        }));
        if (audit.overflow || audit.broken.length || audit.clippedCaptions)
          issues.push(`${name}: ${JSON.stringify(audit)}`);
        const file = `${device}/${name}-${locale}-${device}.png`;
        let heroBox: Capture['heroBox'];
        if (selector) {
          await page.evaluate(() => scrollTo(0, 0));
          const box = (await page.locator(selector).boundingBox())!;
          const screenshot = await page.screenshot({ fullPage: true, animations: 'disabled' });
          await sharp(screenshot)
            .extract({
              left: Math.round(box.x),
              top: Math.round(box.y),
              width: Math.floor(box.width),
              height: Math.floor(box.height),
            })
            .png()
            .toFile(join(output, file));
        } else {
          if (kind === 'carousel' || (kind === 'dark' && !v07)) {
            await page
              .locator('[data-hero-carousel]')
              .evaluate((element) =>
                element.scrollIntoView({ block: 'center', behavior: 'instant' }),
              );
            const box = (await page.locator('[data-hero-carousel]').boundingBox())!;
            if (box.y < 0 || box.y + box.height > viewport.height)
              issues.push(`${file}: carousel is not fully within the viewport`);
            heroBox = {
              left: Math.round(box.x),
              top: Math.round(box.y),
              width: Math.floor(box.width),
              height: Math.floor(box.height),
            };
          } else await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({
            path: join(output, file),
            fullPage: kind === 'full' || (kind === 'dark' && v07),
            animations: 'disabled',
          });
        }
        captures.push({ file, route, locale, device, kind, theme, slide, heroBox });
        console.log(file);
      }
      for (const [name, path] of Object.entries(routes)) {
        const route = `${prefix}${path}`;
        await navigate(route);
        await capture(`${name}-full`, route, 'full');
        if (name === 'home' || name === (v07 ? 'about' : 'projects'))
          await capture(`${name}-viewport`, route, 'viewport');
      }
      await navigate(prefix);
      for (let index = 0; index < heroStories.length; index++) {
        await page
          .locator(`[data-story-index="${index}"]`)
          .evaluate((button: HTMLButtonElement) => button.click());
        await page.locator(`[data-active-slide="${index + 1}"]`).waitFor();
        await capture(
          `carousel-${String(index + 1).padStart(2, '0')}`,
          prefix,
          'carousel',
          undefined,
          index + 1,
        );
      }
      if (locale === 'en') {
        for (const [name, selector] of Object.entries({
          'upcoming-talks': '[data-talks]',
          'building-in-public': '#featured-projects',
          'from-github': '#from-github',
          [v07 ? 'nuget' : 'blog-and-external-links']: v07 ? '#featured-libraries' : '#feed-blog',
        }))
          await capture(name, prefix, 'focused', selector);
        if (device === 'desktop') {
          await navigate(prefix, 'dark');
          await capture(v07 ? 'home-dark' : 'carousel-dark', prefix, 'dark', undefined, 1, 'dark');
        }
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
for (const sheet of ['desktop', 'mobile', 'carousel']) {
  const tileHeight = sheet === 'carousel' ? 430 : 620;
  const selected = captures.filter((capture) =>
    sheet === 'carousel'
      ? capture.kind === 'carousel'
      : capture.device === sheet && capture.kind !== 'carousel',
  );
  const tiles = await Promise.all(
    selected.map(async (capture) => {
      let image = sharp(join(output, capture.file));
      if (capture.heroBox) image = image.extract(capture.heroBox);
      const thumb = await image
        .resize({ width: 340, height: tileHeight - 80, fit: 'inside' })
        .toBuffer();
      const label = Buffer.from(
        `<svg width="360" height="62"><rect width="360" height="62" fill="white"/><text x="10" y="20" font-size="12" font-family="Arial" fill="#232036">${escape(capture.file.split('/')[1])}</text><text x="10" y="42" font-size="12" font-family="Arial" fill="#605b71">${capture.locale} | ${capture.device} | ${capture.kind} | ${capture.theme}</text></svg>`,
      );
      return sharp({
        create: { width: 360, height: tileHeight, channels: 3, background: '#eeeaf4' },
      })
        .composite([
          { input: label, left: 0, top: 0 },
          { input: thumb, left: 10, top: 72 },
        ])
        .jpeg({ quality: 88 })
        .toBuffer();
    }),
  );
  await sharp({
    create: {
      width: 1440,
      height: Math.ceil(tiles.length / 4) * tileHeight,
      channels: 3,
      background: '#eeeaf4',
    },
  })
    .composite(
      tiles.map((input, index) => ({
        input,
        left: (index % 4) * 360,
        top: Math.floor(index / 4) * tileHeight,
      })),
    )
    .jpeg({ quality: 88 })
    .toFile(join(output, `contact-sheet-${sheet}.jpg`));
}
await writeFile(
  join(output, 'review-manifest.json'),
  JSON.stringify(
    { capturedAt: new Date().toISOString(), baseURL, viewports, captures, issues },
    null,
    2,
  ),
);
await writeFile(
  join(output, 'README.md'),
  `# ${v07 ? 'V07 launch-hardening' : 'V06 UX refinement'} review

Real Chromium Playwright screenshots from the local production preview, ${baseURL}.
Desktop: 1440 x 900. Mobile: 390 x 844. Device scale factor: 1.
Autoplay is explicitly paused, images decoded and motion disabled for consistent capture.
Speaker Kit uses the existing /speaking/ and /es/speaking/ routes.

## Inventory

${captures.length} screenshots: 16 full-page, 8 viewport-only Home/${v07 ? 'About' : 'Projects'},
24 individual carousel states, 8 focused sections and one dark-mode ${v07 ? 'homepage' : 'carousel'}.
Focused captures are cropped to their complete section. Full-page heights follow
content. Other screenshots use the exact device viewport.

- [Desktop contact sheet](contact-sheet-desktop.jpg)
- [Mobile contact sheet](contact-sheet-mobile.jpg)
- [Carousel contact sheet](contact-sheet-carousel.jpg)
- [Actual QA results](QA_SUMMARY.md)
- [Machine-readable inventory](review-manifest.json)

| Screenshot | Route | Language | Device | Kind | Theme | Slide |
| --- | --- | --- | --- | --- | --- | --- |
${captures.map((capture) => `| [${capture.file}](${capture.file}) | ${capture.route} | ${capture.locale} | ${capture.device} | ${capture.kind} | ${capture.theme} | ${capture.slide ?? 'n/a'} |`).join('\n')}

## Capture audits

${issues.length ? issues.map((issue) => `- ${issue}`).join('\n') : 'No horizontal overflow, broken visible images, clipped captions or browser errors detected.'}

## Reproduce

Run \`npm run build\`, start \`npm run preview -- --host 127.0.0.1\`, then run
\`npx tsx scripts/capture-ux-refinement.ts${v07 ? ' --v07' : ''}\`.
Only screenshots and review documents belong in this local-only directory and ZIP.
No source photographs, full-resolution images, dependencies or secrets are included.
`,
);
if (captures.length !== 57) throw new Error(`Expected 57 screenshots, got ${captures.length}`);
if (issues.length) throw new Error(issues.join('\n'));
console.log(`Saved ${captures.length} screenshots and three contact sheets to ${output}`);
