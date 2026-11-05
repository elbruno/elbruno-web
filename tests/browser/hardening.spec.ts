import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['', 'about/', 'projects/', 'speaking/'];

test('WCAG 2.2 AA checks cover both themes and languages', async ({ page }) => {
  for (const locale of ['/', '/es/']) {
    for (const route of routes) {
      await page.goto(`${locale}${route}`);
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        const audit = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(audit.violations, `${locale}${route} ${theme}`).toEqual([]);
      }
    }
  }
});

test('all routes reflow at required widths and doubled page zoom', async ({ page }) => {
  for (const width of [320, 375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['/', '/es/']) {
      for (const route of routes) {
        await page.goto(`${locale}${route}`);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${locale}${route} at ${width}px`,
        ).toBe(true);
      }
    }
  }
  // A 1440 x 900 browser at 200% zoom exposes a 720 x 450 CSS viewport.
  await page.setViewportSize({ width: 720, height: 450 });
  for (const locale of ['/', '/es/']) {
    for (const route of routes) {
      await page.goto(`${locale}${route}`);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${locale}${route} at the 200% zoom-equivalent CSS viewport`,
      ).toBe(true);
    }
  }
});

test('text spacing does not clip any carousel caption', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['/', '/es/']) {
      await page.goto(locale);
      await page.addStyleTag({
        content:
          '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }',
      });
      for (let index = 0; index < 6; index++) {
        await page.locator(`[data-story-index="${index}"]`).click();
        await expect(page.locator('[data-hero-carousel]')).toHaveAttribute(
          'data-active-slide',
          String(index + 1),
        );
        const caption = page.locator('.story-slide:not([hidden]) figcaption');
        expect(
          await caption.evaluate((element) => element.scrollHeight <= element.clientHeight),
          `${locale} slide ${index + 1} at ${width}px`,
        ).toBe(true);
      }
    }
  }
});

test('keyboard skip link and carousel controls retain visible, unobscured focus', async ({
  page,
}) => {
  for (const locale of ['/', '/es/']) {
    await page.goto(locale);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    for (const selector of ['.story-previous', '.story-next', '.story-play']) {
      const control = page.locator(selector);
      await control.focus();
      await expect
        .poll(() =>
          control.evaluate((element) => {
            const box = element.getBoundingClientRect();
            const header = document.querySelector('header')!.getBoundingClientRect();
            return (
              element === document.activeElement &&
              getComputedStyle(element).outlineStyle !== 'none' &&
              box.top >= Math.max(0, header.bottom) &&
              box.bottom <= innerHeight
            );
          }),
        )
        .toBe(true);
    }
  }
});

test('social metadata and structured identity match visible source-backed content', async ({
  page,
}) => {
  for (const locale of ['/', '/es/']) {
    for (const route of routes) {
      await page.goto(`${locale}${route}`);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description!.length).toBeGreaterThan(30);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        'content',
        description!,
      );
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
        'content',
        description!,
      );
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
        'content',
        await page.title(),
      );
      const image = await page.locator('meta[name="twitter:image"]').getAttribute('content');
      expect((await page.request.get(new URL(image!).pathname)).status()).toBe(200);
      const schema = JSON.parse(
        await page.locator('script[type="application/ld+json"]').innerText(),
      );
      expect(schema.jobTitle).toBe('Cloud Advocate');
      expect(schema.worksFor).toEqual({ '@type': 'Organization', name: 'Microsoft' });
      expect(schema.sameAs).toContain('https://github.com/elbruno');
    }
    await page.goto(locale);
    await expect(page.locator('[data-feed-freshness]')).toHaveCount(4);
    for (const excerpt of await page.locator('#feed-blog .feed-card p').allTextContents())
      expect(excerpt).not.toMatch(/^Hi!/);
    await expect(page.locator('#feed-podcast h3 a').first()).toHaveAttribute('lang', 'es');
  }
});
