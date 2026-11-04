import { chromium } from '@playwright/test';
import { format } from 'prettier';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = path.dirname(fileURLToPath(import.meta.url));
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
    marker: { en: 'Professional introduction', es: 'Presentación profesional' },
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
const screenshotResults = [];
const routeResults = [];
const performanceResults = [];

for (const device of devices) {
  await mkdir(path.join(output, device.key), { recursive: true });
}

const browser = await chromium.launch();
try {
  for (const device of devices) {
    for (const theme of ['light', 'dark']) {
      const themePages =
        theme === 'dark' ? pages.filter(({ key }) => ['home', 'speaking'].includes(key)) : pages;
      const context = await browser.newContext({
        viewport: device.viewport,
        isMobile: device.isMobile,
        hasTouch: device.isMobile,
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
        colorScheme: theme,
      });

      for (const pageInfo of themePages) {
        for (const locale of ['en', 'es']) {
          const route = pageInfo[locale];
          const page = await context.newPage();
          const consoleErrors = [];
          const pageErrors = [];
          const requestFailures = [];
          const badResponses = [];
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
          page.on('response', (result) => {
            if (
              result.status() >= 400 &&
              new URL(result.url()).origin === new URL(baseUrl).origin
            ) {
              badResponses.push(`${result.status()} ${result.url()}`);
            }
          });
          await page.addInitScript(() => {
            window.__launchQa = { lcp: null, cls: 0 };
            try {
              new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) window.__launchQa.lcp = entry.startTime;
              }).observe({ type: 'largest-contentful-paint', buffered: true });
              new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (!entry.hadRecentInput) window.__launchQa.cls += entry.value;
                }
              }).observe({ type: 'layout-shift', buffered: true });
            } catch {
              // PerformanceObserver types vary by browser; missing metrics are reported as unavailable.
            }
          });

          const response = await page.goto(new URL(route, baseUrl).href, {
            waitUntil: 'networkidle',
          });
          if (!response?.ok()) {
            throw new Error(`${route} returned HTTP ${response?.status() ?? 'no response'}`);
          }
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
              `${route} is missing the localized marker "${pageInfo.marker[locale]}"`,
            );
          }
          if ((await page.locator('html').getAttribute('lang')) !== locale) {
            throw new Error(`${route} has the wrong document language`);
          }
          if ((await page.locator('html').getAttribute('data-theme')) !== theme) {
            throw new Error(`${route} did not render the requested ${theme} theme`);
          }

          if (device.isMobile && route === '/' && theme === 'light') {
            performanceResults.push(
              await page.evaluate(() => {
                const resources = performance.getEntriesByType('resource');
                const images = resources.filter((entry) =>
                  /\.(avif|gif|jpe?g|png|svg|webp)(\?|$)/i.test(entry.name),
                );
                return {
                  route: window.location.pathname,
                  viewport: `${window.innerWidth}x${window.innerHeight}`,
                  theme: document.documentElement.dataset.theme,
                  navigation: {
                    domContentLoadedMs: Math.round(
                      performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd ?? 0,
                    ),
                    loadEventMs: Math.round(
                      performance.getEntriesByType('navigation')[0]?.loadEventEnd ?? 0,
                    ),
                  },
                  lcpMs: window.__launchQa.lcp === null ? null : Math.round(window.__launchQa.lcp),
                  cls: Number(window.__launchQa.cls.toFixed(4)),
                  resourceCount: resources.length,
                  transferBytes: resources.reduce((sum, entry) => sum + entry.transferSize, 0),
                  imageTransferBytes: images.reduce((sum, entry) => sum + entry.transferSize, 0),
                  largestImages: images
                    .map((entry) => ({
                      url: new URL(entry.name).pathname,
                      bytes: entry.transferSize,
                    }))
                    .sort((a, b) => b.bytes - a.bytes)
                    .slice(0, 5),
                };
              }),
            );
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
            for (const image of Array.from(document.images)) image.loading = 'eager';
            await Promise.all(
              Array.from(document.images, (image) => image.decode().catch(() => undefined)),
            );
            await document.fonts.ready;
            await new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            );
          });

          const audit = await page.evaluate(() => ({
            viewportWidth: window.innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            brokenImages: Array.from(document.images)
              .filter((image) => !image.complete || image.naturalWidth === 0)
              .map((image) => image.currentSrc || image.src),
            visibleBodyText: document.body.innerText.trim().length > 0,
          }));
          const issues = [];
          if (audit.documentWidth > audit.viewportWidth) issues.push('Horizontal overflow');
          if (audit.brokenImages.length)
            issues.push(`Broken images: ${audit.brokenImages.join(', ')}`);
          if (!audit.visibleBodyText) issues.push('Page content is empty');
          if (consoleErrors.length) issues.push(`Console errors: ${consoleErrors.join(' | ')}`);
          if (pageErrors.length) issues.push(`Page errors: ${pageErrors.join(' | ')}`);
          if (requestFailures.length)
            issues.push(`Local request failures: ${requestFailures.join(' | ')}`);
          if (badResponses.length) issues.push(`Local HTTP errors: ${badResponses.join(' | ')}`);

          const prefix = `${pageInfo.key}-${locale}-${theme}-${device.key}`;
          const directory = path.join(output, device.key);
          const fullPageFile = path.join(directory, `${prefix}-full.png`);
          await page.screenshot({ path: fullPageFile, fullPage: true, animations: 'disabled' });
          screenshotResults.push({
            path: path.relative(root, fullPageFile).replaceAll(path.sep, '/'),
            page: pageInfo.key,
            locale,
            route,
            theme,
            viewport: `${device.viewport.width}x${device.viewport.height}`,
            type: 'Full page',
            issues,
            audit,
          });

          if (theme === 'light' && ['home', 'about'].includes(pageInfo.key)) {
            const viewportFile = path.join(directory, `${prefix}-viewport.png`);
            await page.screenshot({ path: viewportFile, fullPage: false, animations: 'disabled' });
            screenshotResults.push({
              path: path.relative(root, viewportFile).replaceAll(path.sep, '/'),
              page: pageInfo.key,
              locale,
              route,
              theme,
              viewport: `${device.viewport.width}x${device.viewport.height}`,
              type: 'Above the fold',
              issues,
              audit,
            });
          }

          routeResults.push({
            route,
            locale,
            theme,
            viewport: `${device.viewport.width}x${device.viewport.height}`,
            status: response.status(),
            audit,
            consoleErrors,
            pageErrors,
            requestFailures,
            badResponses,
            issues,
          });
          console.log(
            `${route} ${theme} ${device.key}: ${issues.length ? issues.join('; ') : 'audit passed'}`,
          );
          await page.close();
        }
      }

      await context.close();
    }
  }
} finally {
  await browser.close();
}

for (const device of devices) {
  const entries = screenshotResults.filter(
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
    const image = await sharp(path.join(root, item.path))
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
      `<svg width="${cellWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#f3effa"/><text x="12" y="22" font-family="Arial,sans-serif" font-size="15" font-weight="600" fill="#32224b">${item.page} · ${item.locale.toUpperCase()} · ${item.theme}</text></svg>`,
    );
    composites.push({
      input: label,
      left: (index % columns) * cellWidth,
      top: Math.floor(index / columns) * cellHeight,
    });
    composites.push({ input: image, left: x, top: y });
  }
  await sharp({
    create: {
      width: columns * cellWidth,
      height: rows * cellHeight,
      channels: 3,
      background: '#ffffff',
    },
  })
    .composite(composites)
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(path.join(output, `contact-sheet-${device.key}.jpg`));
}

const auditIssues = [...new Set(routeResults.flatMap((result) => result.issues))];
const readmeRows = screenshotResults
  .map(
    (result) =>
      `| [\`${result.path.replace('screenshots/launch-review/', '')}\`](${result.path.replace('screenshots/launch-review/', '')}) | \`${result.route}\` | ${result.locale.toUpperCase()} | ${result.theme} | ${result.viewport} | ${result.type} |`,
  )
  .join('\n');
const readme = `# Launch-readiness visual review

Captured from the local production build with Playwright Chromium ${browser.version()} at \`${baseUrl}\`. No website or production configuration was changed to capture these files.

## Contact sheets

- [Desktop contact sheet](contact-sheet-desktop.jpg)
- [Mobile contact sheet](contact-sheet-mobile.jpg)

## Screenshot inventory

All eight English and Spanish routes were captured at desktop 1440x900 and mobile 390x844. Home and About also have above-the-fold captures in light theme. Home and Speaker Kit have full-page dark-theme captures in both languages and viewports.

| File | Route | Language | Theme | Viewport | Capture |
| --- | --- | --- | --- | --- | --- |
${readmeRows}

## Automated review

- Routes: ${[...new Set(routeResults.map(({ route }) => route))].map((route) => `\`${route}\``).join(', ')}.
- Route/theme/viewport combinations: ${routeResults.length}.
- Screenshot files: ${screenshotResults.length}.
- Fonts were awaited; page images were scrolled into view and decoded; animations were disabled.
- Localized headings, document language, response status, horizontal overflow, broken images, page/console errors, and failed same-origin requests were checked for each combination.
- Automated issues: ${auditIssues.length ? auditIssues.join('; ') : 'none'}.
- This is a browser/screenshot check, not a Lighthouse score, full assistive-technology assessment, or production-host verification.

## Performance sample

\`audit-results.json\` contains Chromium Resource Timing, navigation timing, LCP, CLS and image-transfer observations for the mobile English homepage. Values are one local sample from the production build and are not field data or a Lighthouse score.

## Reproduce

From the repository root, build and start the production preview:

\`\`\`powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4322
node screenshots\\launch-review\\capture.mjs
\`\`\`

Set \`BASE_URL\` to capture another local preview. The screenshot script does not deploy.
`;
const readmePath = path.join(output, 'README.md');
await writeFile(readmePath, await format(readme, { filepath: readmePath }), 'utf8');
const auditPath = path.join(output, 'audit-results.json');
const auditJson = JSON.stringify(
  {
    baseUrl,
    browser: `Chromium ${browser.version()}`,
    screenshots: screenshotResults,
    routes: routeResults,
    performance: performanceResults,
  },
  null,
  2,
);
await writeFile(auditPath, await format(auditJson, { filepath: auditPath }), 'utf8');

if (auditIssues.length) {
  console.error(`Capture completed with issues: ${auditIssues.join('; ')}`);
  process.exitCode = 1;
} else {
  console.log(`Captured ${screenshotResults.length} screenshots; all automated audits passed.`);
}
