import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
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
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://elbruno.com${route}`,
    );
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
  }
});
test('speaker kit switches language and length and copies actual Spanish text', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/speaking/');
  await page.locator('#bio-language').selectOption('es');
  await page.locator('#bio-length').selectOption('100');
  await expect(page.locator('#bio-text')).toHaveAttribute('lang', 'es');
  await page.getByRole('button', { name: 'Copy bio', exact: true }).click();
  await expect(page.locator('[data-bio-status]')).toHaveText('Copied to clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'Bruno Capuano es Cloud Advocate',
  );
  await page.locator('#bio-length').selectOption('200');
  expect((await page.locator('#bio-text').innerText()).split(/\s+/).length).toBeGreaterThan(170);
  await expect(page.getByText('Photos coming soon')).toBeVisible();
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
  await page.locator('#bio-length').selectOption('200');
  expect((await page.locator('#bio-text').innerText()).split(/\s+/).length).toBeGreaterThan(170);
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
