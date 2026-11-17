import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { events } from '../../src/data/events';

test('bilingual event filters compose, announce empty selections and preserve language navigation', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-11-17T15:00:00Z') });
  for (const prefix of ['/', '/es/']) {
    await page.goto(`${prefix}events/`);
    await expect(page.locator('[data-event-group="past"] [data-event-count]')).toHaveText('(32)');
    await expect(page.locator('[data-event-group="upcoming"] [data-event-count]')).toHaveText(
      '(5)',
    );
    await expect(page.locator('[data-event-id]:visible')).toHaveCount(events.length);
    const firstLink = page.locator('[data-event-id]:visible a').first();
    await firstLink.focus();
    await page.clock.fastForward(30_000);
    await expect(firstLink).toBeFocused();
    await page.locator('[data-event-view]').selectOption('past');
    await expect(page.locator('[data-event-id]:visible')).toHaveCount(32);
    await expect(page.locator('[data-event-id="standup-copilot-cli-sdk"]')).toBeVisible();
    await expect(
      page.locator('[data-event-id="foundry-03"] [data-recording-link]'),
    ).toHaveAttribute('href', 'https://www.youtube.com/watch?v=FJV3NSElLC4');
    await expect(
      page.locator('[data-event-id="global-ai-sarasota-keynote"] [data-recording-link]'),
    ).toHaveText(prefix === '/' ? 'Watch the full event' : 'Ver el evento completo');
    await expect(
      page.locator('[data-event-id="reactor-resilient-agents-26753"] [data-recording-link]'),
    ).toHaveCount(0);
    await page.locator('select[data-event-year]').selectOption('2026');
    await page.locator('select[data-event-type]').selectOption('conference');
    await expect(page.locator('[data-event-id]:visible')).toHaveCount(6);
    await expect(page.locator('[data-event-group="past"] [data-event-count]')).toHaveText('(6)');
    await expect(page.locator('[data-event-id]:visible').first()).toHaveAttribute(
      'data-event-id',
      'global-ai-sarasota-keynote',
    );
    await page.locator('[data-event-view]').selectOption('upcoming');
    await expect(page.locator('[data-event-id]:visible')).toHaveCount(1);
    await expect(page.locator('[data-event-id="dotnetconf-mississauga"]')).toBeVisible();
    await page.locator('select[data-event-type]').selectOption('livestream');
    await expect(page.locator('[data-event-id]:visible')).toHaveCount(4);
    await expect(page.locator('[data-event-id]:visible').first()).toHaveAttribute(
      'data-event-id',
      'new-year-new-bot-1',
    );
    await expect(page.locator('[data-event-group="upcoming"] a[href*="youtu"]')).toHaveCount(0);
    await page.locator('select[data-event-type]').selectOption('collaboration');
    await expect(page.locator('[data-event-id]:visible')).toHaveCount(0);
    await expect(page.locator('[data-event-group="upcoming"] [data-event-empty]')).toBeVisible();
    await page.locator('[data-event-view]').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('select[data-event-year]')).toBeFocused();
    await page
      .getByRole('link', { name: prefix === '/' ? 'ES: Español' : 'EN: English', exact: true })
      .click();
    await expect(page).toHaveURL(prefix === '/' ? '/es/events/' : '/events/');
    for (const theme of ['light', 'dark']) {
      await page.evaluate((theme) => (document.documentElement.dataset.theme = theme), theme);
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(audit.violations).toEqual([]);
    }
  }
});

test('directory moves completed sessions into the archive and respects an active filter', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-12-03T17:00:00Z') });
  await page.goto('/events/');
  await page.locator('[data-event-view]').selectOption('upcoming');
  const foundry = page.locator('[data-event-id="foundry-04"]');
  await expect(foundry.locator('[data-event-status]')).toHaveText('Scheduled now');
  await page.clock.setSystemTime(new Date('2026-12-03T18:00:00Z'));
  await page.clock.fastForward(30_000);
  await expect(foundry).toBeHidden();
  await page.locator('[data-event-view]').selectOption('past');
  await expect(foundry).toBeVisible();
  await expect(page.locator('[data-event-group="past"] [data-event-id]').first()).toHaveAttribute(
    'data-event-id',
    'foundry-04',
  );
  await expect(foundry.locator('[data-event-status]')).toHaveText('Past event');
  await expect(foundry.locator('a[href*="youtu"]')).toHaveCount(0);
});

test('events remain readable without JavaScript and reflow at small and intermediate widths', async ({
  browser,
  baseURL,
  page,
}) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const staticPage = await context.newPage();
    await staticPage.goto('/es/events/');
    await expect(staticPage.locator('[data-event-filters]')).toBeHidden();
    await expect(staticPage.locator('[data-event-id]:visible')).toHaveCount(events.length);
    await expect(staticPage.locator('[data-event-group="past"] [data-recording-link]')).toHaveCount(
      22,
    );
    await expect(
      staticPage.locator('[data-event-id="standup-copilot-cli-sdk"] time'),
    ).toHaveAttribute('datetime', '2026-01-28');
  } finally {
    await context.close();
  }
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/es/events/', '/es/']) {
      await page.goto(path);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
  }
});
