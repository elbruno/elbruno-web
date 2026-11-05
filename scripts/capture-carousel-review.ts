import { chromium, type Page } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { heroStories, carouselText } from '../src/data/hero-stories';

declare global {
  interface Window {
    v06Metrics: { cls: number; lcp: number };
  }
}
const output = resolve('screenshots', 'v06-carousel-review');
const baseURL = 'http://127.0.0.1:4321';
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const routes = { home: '', about: 'about/', projects: 'projects/', speaking: 'speaking/' };
type Capture = {
  file: string;
  localPath: string;
  route: string;
  locale: string;
  viewport: string;
  width: number;
  height: number;
  theme: string;
  kind: string;
  slide: number | null;
  title: string;
  heroBox?: { left: number; top: number; width: number; height: number };
};
const captures: Capture[] = [];
const issues: string[] = [];
const performanceSamples: {
  viewport: string;
  locale: string;
  cls: number;
  lcp: number;
  fcp: number | null;
}[] = [];

async function ready(page: Page, scroll = false) {
  await page.evaluate(async (shouldScroll) => {
    await document.fonts.ready;
    if (shouldScroll) {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.75) {
        window.scrollTo(0, y);
        await new Promise((done) => setTimeout(done, 40));
      }
    }
    await Promise.all(
      [...document.images]
        .filter(
          (image) =>
            !image.closest('[hidden]') &&
            (shouldScroll ||
              image.loading !== 'lazy' ||
              (image.complete && image.naturalWidth > 0)),
        )
        .map((image) => image.decode()),
    );
    if (shouldScroll) window.scrollTo(0, 0);
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  }, scroll);
}

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
      reducedMotion: 'no-preference',
    });
    await context.addInitScript(() => {
      window.v06Metrics = { cls: 0, lcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) window.v06Metrics.cls += shift.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.v06Metrics.lcp = entry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
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
        const carousel = page.locator('[data-hero-carousel]');
        if (await carousel.count()) {
          await carousel.locator('.story-play').waitFor();
          if (
            (await carousel.locator('.story-play').getAttribute('aria-label')) ===
            carouselText[locale].pause
          )
            await carousel
              .locator('.story-play')
              .evaluate((button: HTMLButtonElement) => button.click());
        }
        await page.addStyleTag({
          content:
            '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; caret-color: transparent !important; }',
        });
        await page.locator(`html[data-theme="${theme}"]`).waitFor();
        await ready(page);
      }
      async function capture(
        filename: string,
        route: string,
        kind: string,
        theme = 'light',
        slide: number | null = null,
      ) {
        await ready(page);
        let heroBox: Capture['heroBox'];
        if (kind === 'carousel' || kind === 'dark') {
          await page
            .locator('[data-hero-carousel]')
            .evaluate((element) =>
              element.scrollIntoView({ block: 'center', behavior: 'instant' }),
            );
          await ready(page);
          const box = (await page.locator('[data-hero-carousel]').boundingBox())!;
          heroBox = {
            left: Math.round(box.x),
            top: Math.round(box.y),
            width: Math.floor(box.width),
            height: Math.floor(box.height),
          };
          if (box.y < 0 || box.y + box.height > viewport.height + 1)
            issues.push(`${filename}: carousel is not fully within the viewport`);
        }
        const audit = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          broken: [...document.images]
            .filter(
              (image) =>
                !image.closest('[hidden]') && (!image.complete || image.naturalWidth === 0),
            )
            .map((image) => image.src),
          overlap: [...document.querySelectorAll('.story-slide:not([hidden])')].some((slide) => {
            const image = slide.querySelector('.story-frame')!.getBoundingClientRect();
            const caption = slide.querySelector('figcaption')!.getBoundingClientRect();
            return (
              caption.top < image.bottom ||
              slide.querySelector('figcaption')!.scrollHeight > caption.height
            );
          }),
        }));
        if (audit.overflow || audit.broken.length || audit.overlap)
          issues.push(`${filename}: ${JSON.stringify(audit)}`);
        const file = `${device}/${filename}`;
        const localPath = join(output, device, filename);
        await page.screenshot({
          path: localPath,
          fullPage: kind === 'full',
          animations: 'disabled',
        });
        captures.push({
          file,
          localPath,
          route,
          locale,
          viewport: device,
          ...viewport,
          theme,
          kind,
          slide,
          title: slide ? heroStories[slide - 1].text[locale].title : route,
          heroBox,
        });
        console.log(file);
      }
      for (const [name, path] of Object.entries(routes)) {
        const route = `${prefix}${path}`;
        await navigate(route);
        if (name === 'home') {
          await page.waitForTimeout(1000);
          performanceSamples.push({
            viewport: device,
            locale,
            ...(await page.evaluate(() => ({
              ...window.v06Metrics,
              fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
            }))),
          });
        }
        await ready(page, true);
        await capture(
          `${name}-${locale}-${device}-full.png`,
          route,
          'full',
          'light',
          name === 'home' ? 1 : null,
        );
        if (name === 'home' || name === 'about')
          await capture(
            `${name}-${locale}-${device}-viewport.png`,
            route,
            'viewport',
            'light',
            name === 'home' ? 1 : null,
          );
      }
      await navigate(prefix);
      await ready(page, true);
      for (let index = 0; index < heroStories.length; index++) {
        await page
          .locator(`[data-story-index="${index}"]`)
          .evaluate((button: HTMLButtonElement) => button.click());
        await page.locator(`[data-hero-carousel][data-active-slide="${index + 1}"]`).waitFor();
        await capture(
          `hero-slide-${String(index + 1).padStart(2, '0')}-${locale}-${device}.png`,
          prefix,
          'carousel',
          'light',
          index + 1,
        );
      }
      await navigate(prefix, 'dark');
      await ready(page, true);
      for (const index of [0, 5]) {
        await page
          .locator(`[data-story-index="${index}"]`)
          .evaluate((button: HTMLButtonElement) => button.click());
        await page.locator(`[data-hero-carousel][data-active-slide="${index + 1}"]`).waitFor();
        await capture(
          `hero-slide-${String(index + 1).padStart(2, '0')}-${locale}-${device}-dark.png`,
          prefix,
          'dark',
          'dark',
          index + 1,
        );
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

for (const sheet of ['desktop', 'mobile', 'carousel']) {
  const selected = captures.filter((capture) =>
    sheet === 'carousel'
      ? capture.kind === 'carousel'
      : capture.viewport === sheet && capture.kind !== 'carousel',
  );
  const tiles = await Promise.all(
    selected.map(async (capture) => {
      let image = sharp(capture.localPath);
      if (capture.heroBox) image = image.extract(capture.heroBox);
      const thumbnail = await image.resize({ width: 340, height: 620, fit: 'inside' }).toBuffer();
      const title = capture.title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const label = Buffer.from(
        `<svg width="360" height="70"><rect width="360" height="70" fill="white"/><text x="10" y="20" font-size="12" font-family="Arial" fill="#232036">${capture.file.split('/')[1]}</text><text x="10" y="41" font-size="14" font-family="Arial" fill="#232036">${title}</text><text x="10" y="60" font-size="12" font-family="Arial" fill="#605b71">${capture.locale} | ${capture.width} x ${capture.height} | ${capture.theme}</text></svg>`,
      );
      return sharp({ create: { width: 360, height: 710, channels: 3, background: '#eeeaf4' } })
        .composite([
          { input: thumbnail, left: 10, top: 80 },
          { input: label, left: 0, top: 0 },
        ])
        .jpeg({ quality: 88 })
        .toBuffer();
    }),
  );
  await sharp({
    create: {
      width: 1440,
      height: Math.ceil(tiles.length / 4) * 710,
      channels: 3,
      background: '#eeeaf4',
    },
  })
    .composite(
      tiles.map((input, index) => ({
        input,
        left: (index % 4) * 360,
        top: Math.floor(index / 4) * 710,
      })),
    )
    .jpeg({ quality: 88 })
    .toFile(join(output, `contact-sheet-${sheet}.jpg`));
}
await writeFile(
  join(output, 'review-manifest.json'),
  JSON.stringify(
    { capturedAt: new Date().toISOString(), captures, performanceSamples, issues },
    null,
    2,
  ),
);
await writeFile(
  join(output, 'README.md'),
  `# V06 carousel visual review

Real Chromium Playwright screenshots from the local production build at ${baseURL}.
Output directory: \`${output}\`.

## Actual counts and capture settings

- ${captures.length} PNG screenshots: 16 full-page, 8 first-viewport, 24 individual story viewports, 8 dark hero viewports.
- Desktop 1440 x 900 and mobile 390 x 844, device scale factor 1.
- EN and ES, all four content routes. Slide-specific captures scroll the complete carousel into view.
- Autoplay explicitly paused for capture; fonts and active/lazy images decoded; CSS motion disabled.
- Three labeled contact sheets: [desktop](contact-sheet-desktop.jpg), [mobile](contact-sheet-mobile.jpg), [carousel](contact-sheet-carousel.jpg).
- Full-page PNG heights follow content. All other PNGs use the exact requested viewport dimensions.
- [QA summary](QA_SUMMARY.md) and [machine-readable inventory](review-manifest.json).

## Screenshot inventory

| File | Exact local path | Route | Language | Viewport | Theme | Slide |
| --- | --- | --- | --- | --- | --- | --- |
${captures.map((capture) => `| [${capture.file}](${capture.file}) | \`${capture.localPath}\` | ${capture.route} | ${capture.locale} | ${capture.width} x ${capture.height} | ${capture.theme} | ${capture.slide ?? 'n/a'} |`).join('\n')}

## Discovered visual issues

${issues.length ? issues.map((issue) => `- ${issue}`).join('\n') : 'No horizontal overflow, broken active images, clipped captions, image/caption overlap or browser errors detected. Manual visual review findings and publication gates are recorded in QA_SUMMARY.md.'}

## Reproduce locally

Run \`npm run build\`, start \`npm run preview -- --host 127.0.0.1\`, then run
\`npx tsx scripts/capture-carousel-review.ts\`. Originals and full-resolution
assets must never be added to this directory or the review ZIP.
`,
);
if (captures.length !== 56) throw new Error(`Expected 56 screenshots, got ${captures.length}`);
if (issues.length) throw new Error(issues.join('\n'));
console.log(
  `Saved ${captures.length} real screenshots, three contact sheets and inventories to ${output}`,
);
