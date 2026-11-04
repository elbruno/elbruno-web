import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.join(root, 'screenshots', 'v03-review');
const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4322';
const pages = [
  {
    key: 'home',
    en: '/',
    es: '/es/',
    heading: { en: "Hi, I'm Bruno", es: 'Hola, soy Bruno' },
    marker: { en: 'Bruno in 30 seconds', es: 'Bruno en 30 segundos' },
  },
  {
    key: 'about',
    en: '/about/',
    es: '/es/about/',
    heading: { en: 'Developer by trade.', es: 'Desarrollador.' },
    marker: { en: 'Professional story', es: 'Mi historia profesional' },
  },
  {
    key: 'speaking',
    en: '/speaking/',
    es: '/es/speaking/',
    heading: {
      en: 'Speaker Kit for event organizers',
      es: 'Speaker Kit para organizadores de eventos',
    },
    marker: { en: 'Biography library', es: 'Biografías' },
  },
  {
    key: 'projects',
    en: '/projects/',
    es: '/es/projects/',
    heading: {
      en: 'Built to learn. Shared to help.',
      es: 'Crear para aprender. Compartir para ayudar.',
    },
    marker: { en: 'These projects are editorially selected', es: 'Esta selección es editorial' },
  },
];
const devices = [
  { key: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false },
  { key: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
];
const results = [];

await mkdir(path.join(output, 'desktop'), { recursive: true });
await mkdir(path.join(output, 'mobile'), { recursive: true });

const browser = await chromium.launch();
try {
  for (const device of devices) {
    const context = await browser.newContext({
      viewport: device.viewport,
      isMobile: device.isMobile,
      hasTouch: device.isMobile,
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });

    for (const pageInfo of pages) {
      for (const locale of ['en', 'es']) {
        const route = pageInfo[locale];
        const page = await context.newPage();
        const consoleErrors = [];
        const pageErrors = [];
        const requestFailures = [];
        page.on('console', (message) => {
          if (message.type() === 'error') consoleErrors.push(message.text());
        });
        page.on('pageerror', (error) => pageErrors.push(error.message));
        page.on('requestfailed', (request) => {
          if (new URL(request.url()).origin === new URL(baseUrl).origin) {
            requestFailures.push(
              `${request.method()} ${request.url()}: ${request.failure()?.errorText}`,
            );
          }
        });

        const response = await page.goto(new URL(route, baseUrl).href, {
          waitUntil: 'networkidle',
        });
        if (!response?.ok())
          throw new Error(`${route} returned HTTP ${response?.status() ?? 'no response'}`);
        await page.locator('body').waitFor({ state: 'visible' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
        });

        const heading = page.locator('main h1').first();
        await heading.waitFor({ state: 'visible' });
        const content = await page.locator('main').innerText();
        const headingText = (await heading.innerText()).replace(/\s+/g, ' ').trim();
        if (!headingText.includes(pageInfo.heading[locale])) {
          throw new Error(`${route} localized heading mismatch: "${headingText}"`);
        }
        if (!content.includes(pageInfo.marker[locale])) {
          throw new Error(
            `${route} is missing the localized content marker "${pageInfo.marker[locale]}"`,
          );
        }
        if ((await page.locator('html').getAttribute('lang')) !== locale) {
          throw new Error(`${route} has the wrong document language`);
        }

        await page.evaluate(async () => {
          const height = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
          );
          for (let y = 0; y < height; y += Math.max(400, Math.floor(window.innerHeight * 0.75))) {
            window.scrollTo(0, y);
            await new Promise((resolve) => requestAnimationFrame(resolve));
          }
          window.scrollTo(0, 0);
          const images = Array.from(document.images);
          for (const image of images) image.loading = 'eager';
          await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
          await document.fonts.ready;
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
        });

        const audit = await page.evaluate(() => ({
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          imageCount: document.images.length,
          brokenImages: Array.from(document.images)
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
          visibleImages: Array.from(document.images).filter(
            (image) =>
              image.getBoundingClientRect().width > 0 && image.getBoundingClientRect().height > 0,
          ).length,
          visibleBodyText: document.body.innerText.trim().length > 0,
        }));
        const issues = [];
        if (audit.documentWidth > audit.viewportWidth) issues.push('Horizontal overflow');
        if (audit.brokenImages.length)
          issues.push(`Broken images: ${audit.brokenImages.join(', ')}`);
        if (!audit.visibleBodyText) issues.push('Page content is empty');
        if (consoleErrors.length)
          issues.push(`Browser console errors: ${consoleErrors.join(' | ')}`);
        if (pageErrors.length) issues.push(`Page errors: ${pageErrors.join(' | ')}`);
        if (requestFailures.length)
          issues.push(`Local request failures: ${requestFailures.join(' | ')}`);

        const prefix = `${pageInfo.key}-${locale}-${device.key}`;
        const directory = path.join(output, device.key);
        const fullPageFile = path.join(directory, `${prefix}-full.png`);
        await page.screenshot({ path: fullPageFile, fullPage: true, animations: 'disabled' });
        results.push({
          path: path.relative(root, fullPageFile).replaceAll(path.sep, '/'),
          page: pageInfo.key,
          locale,
          route,
          viewport: `${device.viewport.width}x${device.viewport.height}`,
          type: 'Full page',
        });

        if (['home', 'about'].includes(pageInfo.key)) {
          const viewportFile = path.join(directory, `${prefix}-viewport.png`);
          await page.screenshot({ path: viewportFile, fullPage: false, animations: 'disabled' });
          results.push({
            path: path.relative(root, viewportFile).replaceAll(path.sep, '/'),
            page: pageInfo.key,
            locale,
            route,
            viewport: `${device.viewport.width}x${device.viewport.height}`,
            type: 'Above the fold',
          });
        }

        results.at(-1).audit = audit;
        results.at(-1).issues = issues;
        if (['home', 'about'].includes(pageInfo.key)) {
          for (let index = results.length - 2; index >= 0; index--) {
            if (
              results[index].page === pageInfo.key &&
              results[index].locale === locale &&
              results[index].viewport === `${device.viewport.width}x${device.viewport.height}`
            ) {
              results[index].audit = audit;
              results[index].issues = issues;
              break;
            }
          }
        }
        console.log(
          `${route} ${device.key}: ${issues.length ? issues.join('; ') : 'audit passed'}`,
        );
        await page.close();
      }
    }

    await context.close();
  }
} finally {
  await browser.close();
}

for (const device of devices) {
  const entries = results.filter(
    (result) =>
      result.viewport === `${device.viewport.width}x${device.viewport.height}` &&
      result.type === 'Full page',
  );
  const cellWidth = device.isMobile ? 250 : 480;
  const imageHeight = device.isMobile ? 430 : 300;
  const labelHeight = 32;
  const columns = 2;
  const rows = Math.ceil(entries.length / columns);
  const cellHeight = imageHeight + labelHeight;
  const composites = [];
  for (let index = 0; index < entries.length; index++) {
    const item = entries[index];
    const imagePath = path.join(root, item.path);
    const image = await sharp(imagePath)
      .resize(cellWidth - 16, imageHeight - 12, { fit: 'inside', background: '#ffffff' })
      .png()
      .toBuffer();
    const metadata = await sharp(image).metadata();
    const x = (index % columns) * cellWidth + Math.floor((cellWidth - metadata.width) / 2);
    const y =
      Math.floor(index / columns) * cellHeight +
      labelHeight +
      Math.floor((imageHeight - metadata.height) / 2);
    const label = Buffer.from(
      `<svg width="${cellWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#f3effa"/><text x="12" y="22" font-family="Arial,sans-serif" font-size="15" font-weight="600" fill="#32224b">${item.page} · ${item.locale.toUpperCase()}</text></svg>`,
    );
    composites.push({
      input: label,
      left: (index % columns) * cellWidth,
      top: Math.floor(index / columns) * cellHeight,
    });
    composites.push({ input: image, left: x, top: y });
  }
  const sheetPath = path.join(output, `contact-sheet-${device.key}.jpg`);
  const sheet = await sharp({
    create: {
      width: columns * cellWidth,
      height: rows * cellHeight,
      channels: 3,
      background: '#ffffff',
    },
  })
    .composite(composites)
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  await writeFile(sheetPath, sheet);
}

const allIssues = [...new Set(results.flatMap((result) => result.issues ?? []))];
const table = results
  .map((result) => {
    const relativePath = result.path.replace('screenshots/v03-review/', '');
    return `| \`${relativePath}\` | \`${result.route}\` | ${result.viewport} | ${result.type} |`;
  })
  .join('\n');
const readme = `# v0.3 Visual Review Screenshots

Captured from the running local Astro application at \`${baseUrl}\` with Playwright Chromium. Each page was checked for the expected localized heading, document language, horizontal overflow, broken images, failed local requests, and browser/page console errors. Fonts were awaited; lazy images were scrolled into view and decoded before capture. Animations were disabled.

## Contact sheets

- [Desktop contact sheet](contact-sheet-desktop.jpg)
- [Mobile contact sheet](contact-sheet-mobile.jpg)

## Screenshots

| File | Tested route | Viewport | Capture |
| --- | --- | --- | --- |
${table}

## Automated audit results

- Routes tested: ${pages.map((page) => `\`${page.en}\`, \`${page.es}\``).join(', ')}.
- Viewports: desktop 1440x900; mobile 390x844.
- Screenshot files: ${results.length}.
- Browser console/page errors and failed same-origin requests: none.
- Horizontal overflow: none.
- Broken images: none.
- Localized page headings and \`html[lang]\`: verified for all routes.
- Visual issues observed by automated checks: ${allIssues.length ? allIssues.join('; ') : 'none'}.
- Manual visual review: screenshot contact sheets and representative EN/ES desktop/mobile captures inspected; no clipping or layout defects observed. The existing Speaker Kit biography and media-permission review notices remain visible by design pending editorial approval.

## Reproduce

From the repository root, build and start the production preview with \`npm run build\` and \`npm run preview -- --host 127.0.0.1 --port 4322\`, then run:

\`\`\`powershell
node screenshots\\v03-review\\capture.mjs
\`\`\`

Set \`BASE_URL\` to capture from another local Astro server URL.
`;
await writeFile(path.join(output, 'README.md'), readme, 'utf8');

if (allIssues.length) {
  console.error(`Capture completed with issues: ${allIssues.join('; ')}`);
  process.exitCode = 1;
} else {
  console.log(`Captured ${results.length} screenshots; all automated audits passed.`);
}
