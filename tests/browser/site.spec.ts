import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import hosting from '../../public/staticwebapp.config.json' with { type: 'json' };

const routes = [
  '/',
  '/about/',
  '/projects/',
  '/speaking/',
  '/es/',
  '/es/about/',
  '/es/projects/',
  '/es/speaking/',
];
test('all localized routes have metadata, working local links and no overflow', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      route.startsWith('/es') ? 'es' : 'en',
    );
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://elbruno.com${route}`,
    );
    const englishRoute = route.startsWith('/es/') ? route.slice(3) : route;
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      `https://elbruno.com${englishRoute}`,
    );
    await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
      'href',
      `https://elbruno.com/es/${englishRoute === '/' ? '' : englishRoute.slice(1)}`,
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      'href',
      `https://elbruno.com${englishRoute}`,
    );
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', '');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://elbruno.com/assets/illustration/v02-social-art.jpg',
    );
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    expect(
      await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((image) => !image.hasAttribute('alt'))
            .map((image) => image.getAttribute('src')),
        ),
    ).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map(
        (item) => `${item.id}: ${item.nodes.map((node) => node.target).join(', ')}`,
      ),
    ).toEqual([]);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((anchors) => [
        ...new Set(anchors.map((anchor) => anchor.getAttribute('href')!)),
      ]);
    for (const href of links) expect((await page.request.get(href)).status()).toBe(200);
  }
  expect(errors).toEqual([]);
});
test('homepage retains all available feed items and the site sitemap covers localized routes', async ({
  page,
}) => {
  const localizedHeadings = [
    { route: '/', headings: ['Latest episodes', 'Watch', 'Read', 'From GitHub'] },
    { route: '/es/', headings: ['Últimos episodios', 'Ver', 'Leer', 'Desde GitHub'] },
  ] as const;
  for (const { route, headings } of localizedHeadings) {
    await page.goto(route);
    for (const heading of headings) {
      const section = page
        .getByRole('heading', { name: heading })
        .locator('xpath=ancestor::section[1]');
      await expect(section.locator('.feed-card')).toHaveCount(
        heading === 'From GitHub' || heading === 'Desde GitHub' ? 2 : 3,
      );
    }
  }
  const index = await page.request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  const indexText = await index.text();
  expect(indexText).toContain('https://elbruno.com/sitemap-0.xml');
  const sitemap = await page.request.get('/sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  for (const route of routes) expect(sitemapText).toContain(`https://elbruno.com${route}`);
  const robots = await page.request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Allow: /');
});
test('language switch preserves the current page and theme persists', async ({
  page,
  isMobile,
}) => {
  await page.goto('/projects/');
  await page.getByRole('link', { name: 'Español', exact: true }).click();
  await expect(page).toHaveURL('/es/projects/');
  await page.getByRole('button', { name: 'Cambiar tema oscuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
  expect(audit.violations).toEqual([]);
  if (isMobile) {
    const menu = page.getByRole('button', { name: 'Abrir o cerrar navegación' });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
    expect(await menu.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe(
      'none',
    );
  }
});
test('speaker kit copies the concise Spanish public introduction and absolute headshot URL', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/es/speaking/');
  await expect(page.locator('#speaker-bio')).toHaveAttribute('lang', 'es');
  await page.getByRole('button', { name: 'Copiar presentación', exact: true }).click();
  await expect(page.locator('[data-title-status]')).toHaveText('Texto copiado.');
  const copiedIntro = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedIntro).toContain('Bruno Capuano, Cloud Advocate en Microsoft.');
  expect(copiedIntro).toContain('experimentos de código abierto');
  await expect(
    page.getByRole('heading', { name: /Official headshot|Retrato oficial/ }),
  ).toBeVisible();
  await expect(page.locator('.speaker-photo-card a[download]')).toHaveCount(3);
  await page.getByRole('button', { name: 'Copiar datos del speaker' }).click();
  const copiedDetails = await page.evaluate(() => navigator.clipboard.readText());
  expect(copiedDetails).toContain('experimentos de código abierto');
  expect(copiedDetails).toContain(
    'https://elbruno.com/downloads/speaker/21-11%20Bruno%20Headshot%20for%20Msft.jpg',
  );
});
test('speaker kit exposes a selectable fallback when clipboard access is blocked', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('Clipboard blocked')) },
    });
  });
  await page.goto('/speaking/');
  await page.getByRole('button', { name: 'Copy introduction', exact: true }).click();
  await expect(page.locator('[data-title-status]')).toHaveText(
    'Clipboard access is unavailable. The text is selected below; copy it with your keyboard.',
  );
  const fallback = page.locator('[data-clipboard-fallback]');
  await expect(fallback).toBeVisible();
  expect(await fallback.inputValue()).toContain(await page.locator('#speaker-bio').innerText());
  expect(
    await fallback.evaluate((element: HTMLTextAreaElement) => element.selectionEnd),
  ).toBeGreaterThan(0);
});
test('About provides localized current experience, selected work and no invented CV download', async ({
  page,
}) => {
  for (const [route, currentRole, workHeading] of [
    ['/about/', 'Cloud Advocate', 'Selected work'],
    ['/es/about/', 'Cloud Advocate', 'Trabajo destacado'],
  ]) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: currentRole })).toBeVisible();
    await expect(page.getByRole('heading', { name: workHeading })).toBeVisible();
    await expect(page.locator('.cv-work-card')).toHaveCount(4);
    await expect(
      page.getByText(/dates are not listed|No incluyo otros puestos ni fechas/),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Download CV|Descargar CV/ })).toHaveCount(0);
  }
});
test('organizers can retrieve byte-identical photos and the safe Speaker Kit ZIP', async ({
  page,
}) => {
  await page.goto('/speaking/');
  await expect(
    page.getByRole('heading', { name: 'Speaker Kit for event organizers' }),
  ).toBeVisible();
  const expectedPhotos = [
    '21-11 Bruno Headshot for Msft.jpg',
    '22-01 Bruno speaking in Podioum 1.jpg',
    '22-01 Bruno speaking in Podioum 2.jpg',
  ];
  const photoDownloads = page.locator('.speaker-photo-card a[download]');
  await expect(photoDownloads).toHaveCount(expectedPhotos.length);
  for (let index = 0; index < expectedPhotos.length; index++) {
    const photoHref = await photoDownloads.nth(index).getAttribute('href');
    const photoResponse = await page.request.get(photoHref!);
    expect(photoResponse.status()).toBe(200);
    expect(photoResponse.headers()['content-type']).toContain('image/jpeg');
    expect(Buffer.from(await photoResponse.body())).toEqual(
      await readFile(`public/downloads/speaker/${expectedPhotos[index]}`),
    );
    const downloadPromise = page.waitForEvent('download');
    await photoDownloads.nth(index).click();
    expect((await downloadPromise).suggestedFilename()).toBe(expectedPhotos[index]);
  }
  const zipResponse = await page.request.get('/downloads/speaker/speaker-kit.zip');
  expect(zipResponse.status()).toBe(200);
  expect(zipResponse.headers()['content-type']).toContain('application/zip');
  expect(Buffer.from(await zipResponse.body())).toEqual(
    await readFile('public/downloads/speaker/speaker-kit.zip'),
  );
  const kitDownload = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download the complete Speaker Kit (ZIP)' }).click();
  expect((await kitDownload).suggestedFilename()).toBe('bruno-capuano-speaker-kit.zip');
});
test('Spanish organizers receive localized media downloads', async ({ page }) => {
  await page.goto('/es/speaking/');
  await expect(
    page.getByRole('heading', { name: 'Speaker Kit para organizadores de eventos' }),
  ).toBeVisible();
  const photoDownloads = page.locator('.speaker-photo-card a[download]');
  await expect(photoDownloads).toHaveCount(3);
  const photoDownload = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Descargar retrato oficial: Retrato oficial' }).click();
  expect((await photoDownload).suggestedFilename()).toBe('21-11 Bruno Headshot for Msft.jpg');
  const kitDownload = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Descargar el Speaker Kit completo (ZIP)' }).click();
  expect((await kitDownload).suggestedFilename()).toBe('bruno-capuano-speaker-kit.zip');
});
test('robot reacts, game lazy-loads and keyboard, touch and turn-based controls work', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const gameRequests: string[] = [];
  page.on('request', (request) => {
    if (/invaders.*\.js/.test(request.url())) gameRequests.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Say hello to the desk robot' }).click();
  await expect(page.locator('[data-robot-message]')).toHaveText('Coffee is a dependency, right?');
  expect(gameRequests).toHaveLength(0);
  await page.locator('[data-open-game]').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(gameRequests.length).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Start / restart', exact: true }).click();
  await expect(page.locator('canvas')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Space');
  await expect(page.locator('[data-game-status]')).toContainText('Lives: 3');
  await page.getByRole('button', { name: 'Fire', exact: true }).click();
  await page.getByRole('button', { name: 'Move left', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(page.locator('[data-game-status]')).toContainText('Paused.');
  await page.getByText('Prefer a slower pace?', { exact: true }).click();
  const scoreBeforeFix = Number(
    (await page.locator('[data-game-status]').innerText()).match(/Score: (\d+)/)?.[1],
  );
  await page.getByRole('button', { name: 'Fix one bug', exact: true }).click();
  await expect(page.locator('[data-game-status]')).toContainText(`Score: ${scoreBeforeFix + 1}`);
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('[data-open-game]')).toBeFocused();
});
test('both secret activation paths open the game', async ({ page }) => {
  await page.goto('/es/');
  for (let i = 0; i < 5; i++) await page.locator('#terminal-trigger').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  for (const key of [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ])
    await page.keyboard.press(key);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar juego' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('localized 404 pages are noindex and recover to the right homepage', async ({ page }) => {
  for (const route of ['/404.html', '/es/404/']) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await page.locator('main a.button').click();
    await expect(page).toHaveURL(route.includes('/es/') ? '/es/' : '/');
  }
});
test('homepage screenshot', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
});
test('dark routes meet automated contrast rules and narrow layouts do not overflow', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
  }
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/es/');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
test('hosting CSP permits interactions without third-party browser requests', async ({ page }) => {
  const errors: string[] = [];
  const offsite: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4321/')) offsite.push(request.url());
  });
  await page.route('**/*', async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), ...hosting.globalHeaders } });
  });
  await page.goto('/es/speaking/');
  await expect(page.locator('#speaker-bio')).toContainText('experimentos de código abierto');
  await page.getByRole('button', { name: 'Cambiar tema oscuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-open-game]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Iniciar / reiniciar' }).click();
  await expect(page.locator('canvas')).toBeFocused();
  await page.keyboard.press('Escape');
  expect(offsite).toEqual([]);
  expect(errors).toEqual([]);
});
