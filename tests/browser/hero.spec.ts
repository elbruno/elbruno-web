import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { heroStories, carouselText } from '../../src/data/hero-stories';
import AxeBuilder from '@axe-core/playwright';
import hosting from '../../public/staticwebapp.config.json' with { type: 'json' };

test.beforeEach(async ({ page, isMobile }) => {
  await page.setViewportSize(isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 });
});

test('all six bilingual stories pair captions and photos without moving the introduction or frame', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const locale of ['en', 'es'] as const) {
    await page.goto(locale === 'en' ? '/' : '/es/');
    const root = page.locator('[data-hero-carousel]');
    await expect(root).toHaveAttribute('data-active-slide', '1');
    await expect(root.locator('img[src]')).toHaveCount(1);
    await expect(root.locator('img').first()).toHaveAttribute('fetchpriority', 'high');
    await expect(root.locator('img').first()).toHaveAttribute('srcset', /960w.*1280w/);
    const fixed = await page.locator('.hero-copy').evaluate((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y: y + scrollY, width, height, text: element.textContent };
    });
    const dimensions = await root.boundingBox();
    for (let index = 0; index < heroStories.length; index++) {
      if (index) await root.locator('.story-next').click();
      await expect(root).toHaveAttribute('data-active-slide', String(index + 1));
      const current = root.locator('.story-slide:not([hidden])');
      await expect(current).toHaveCount(1);
      await expect(current.locator('strong')).toHaveText(heroStories[index].text[locale].title);
      await expect(current.locator('figcaption p')).toHaveText(
        heroStories[index].text[locale].caption,
      );
      await expect(current.locator('img')).toHaveAttribute(
        'alt',
        heroStories[index].text[locale].alt,
      );
      await expect
        .poll(() =>
          current
            .locator('img')
            .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
        )
        .toBe(true);
      await expect(root.locator('[aria-current="true"]')).toHaveAttribute(
        'data-story-index',
        String(index),
      );
      const bounds = await root.boundingBox();
      expect(bounds!.width).toBeCloseTo(dimensions!.width, 1);
      expect(bounds!.height).toBeCloseTo(dimensions!.height, 1);
      expect(
        await page.locator('.hero-copy').evaluate((element) => {
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y: y + scrollY, width, height, text: element.textContent };
        }),
      ).toEqual(fixed);
      expect(
        await current.evaluate((element) => {
          const frame = element.querySelector('.story-frame')!.getBoundingClientRect();
          const caption = element.querySelector('figcaption')!.getBoundingClientRect();
          return (
            caption.top >= frame.bottom &&
            caption.bottom <= element.getBoundingClientRect().bottom + 1 &&
            element.querySelector('figcaption')!.scrollHeight <= caption.height
          );
        }),
      ).toBe(true);
    }
    await root.locator('.story-next').click();
    await expect(root).toHaveAttribute('data-active-slide', '1');
    await root.locator('.story-previous').click();
    await expect(root).toHaveAttribute('data-active-slide', '6');
    await root.locator('[data-story-index="2"]').click();
    await expect(root).toHaveAttribute('data-active-slide', '3');
    await expect(root.locator('[data-story-announcement]')).toContainText(
      heroStories[2].text[locale].caption,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('autoplay uses 6.5 seconds, pauses for hover, focus and explicit pause, and stops after manual navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install({ time: new Date('2026-11-05T19:00:00Z') });
  await page.clock.pauseAt(new Date('2026-11-05T19:00:01Z'));
  await page.goto('/');
  const root = page.locator('[data-hero-carousel]');
  await expect(root).toHaveAttribute('data-rotating', 'true');
  await page.clock.fastForward(6499);
  await expect(root).toHaveAttribute('data-active-slide', '1');
  await page.clock.fastForward(1);
  await expect(root).toHaveAttribute('data-active-slide', '2');
  await expect(root.locator('[data-story-announcement]')).toBeEmpty();
  await root.hover();
  await page.clock.fastForward(20_000);
  await expect(root).toHaveAttribute('data-active-slide', '2');
  await page.mouse.move(0, 0);
  await page.clock.fastForward(6500);
  await expect(root).toHaveAttribute('data-active-slide', '3');
  await root.locator('.story-next').focus();
  await page.clock.fastForward(20_000);
  await expect(root).toHaveAttribute('data-active-slide', '3');
  await page.locator('.hero-blog').focus();
  await page.clock.fastForward(6500);
  await expect(root).toHaveAttribute('data-active-slide', '4');
  await root.locator('.story-play').click();
  await page.locator('.hero-blog').focus();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(20_000);
  await expect(root).toHaveAttribute('data-active-slide', '4');
  await expect(root.locator('.story-play')).toHaveAttribute('aria-label', 'Play stories');
  await root.locator('.story-play').click();
  await page.locator('.hero-blog').focus();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(6500);
  await expect(root).toHaveAttribute('data-active-slide', '5');
  await root.locator('.story-next').click();
  await page.locator('.hero-blog').focus();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(20_000);
  await expect(root).toHaveAttribute('data-active-slide', '6');
  await expect(root).toHaveAttribute('data-rotating', 'false');
  await page.reload();
  await expect(root).toHaveAttribute('data-active-slide', '1');
});

test('background visibility suspends autoplay and starts a fresh interval when visible', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/');
  const root = page.locator('[data-hero-carousel]');
  await expect(root).toHaveAttribute('data-rotating', 'true');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(30_000);
  await expect(root).toHaveAttribute('data-active-slide', '1');
  await expect(root).toHaveAttribute('data-rotating', 'false');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(6500);
  await expect(root).toHaveAttribute('data-active-slide', '2');
});

test('reduced motion disables autoplay, keeps manual controls usable and uses no animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/es/');
  const root = page.locator('[data-hero-carousel]');
  await expect(root.locator('.story-play')).toBeDisabled();
  await page.clock.fastForward(30_000);
  await expect(root).toHaveAttribute('data-active-slide', '1');
  await root.locator('.story-next').click();
  await expect(root).toHaveAttribute('data-active-slide', '2');
  expect(
    await root
      .locator('.story-slide:not([hidden])')
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(root.locator('.story-play')).toBeEnabled();
  await page.locator('.hero-blog').focus();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(20_000);
  await expect(root).toHaveAttribute('data-active-slide', '2');
});

test('keyboard controls use Enter, Space and arrows without trapping focus', async ({ page }) => {
  await page.goto('/');
  const root = page.locator('[data-hero-carousel]');
  await root.locator('.story-previous').focus();
  await page.keyboard.press('Enter');
  await expect(root).toHaveAttribute('data-active-slide', '6');
  await page.keyboard.press('ArrowRight');
  await expect(root).toHaveAttribute('data-active-slide', '1');
  await root.locator('.story-next').focus();
  await page.keyboard.press('Space');
  await expect(root).toHaveAttribute('data-active-slide', '2');
  await root.locator('[data-story-index="2"]').focus();
  await page.keyboard.press('Enter');
  await expect(root).toHaveAttribute('data-active-slide', '3');
  expect(
    await page.locator(':focus').evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe('none');
  await root.locator('[data-story-index="5"]').focus();
  await page.keyboard.press('Tab');
  expect(
    await page.locator(':focus').evaluate((element) => !!element.closest('[data-hero-carousel]')),
  ).toBe(false);
  await page.keyboard.press('Shift+Tab');
  await expect(root.locator('[data-story-index="5"]')).toBeFocused();
});

test('native mobile swipes change stories while vertical gestures can still scroll', async ({
  page,
  context,
  isMobile,
}) => {
  test.skip(!isMobile, 'Native touch gestures are tested in the mobile Chromium project');
  await page.goto('/');
  const root = page.locator('[data-hero-carousel]');
  const frame = root.locator('.story-slides');
  await frame.scrollIntoViewIfNeeded();
  const session = await context.newCDPSession(page);
  async function swipe(dx: number, dy: number) {
    const box = (await frame.boundingBox())!;
    const x = box.x + box.width * (dx < 0 ? 0.8 : 0.2);
    const y = Math.max(100, box.y + Math.min(box.height * 0.3, 150));
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 5; step++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + (dx * step) / 5, y: y + (dy * step) / 5 }],
      });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await swipe(-160, 0);
  await expect(root).toHaveAttribute('data-active-slide', '2');
  await swipe(160, 0);
  await expect(root).toHaveAttribute('data-active-slide', '1');
  const before = await page.evaluate(() => scrollY);
  await swipe(0, -180);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  await expect(root).toHaveAttribute('data-active-slide', '1');
  await session.detach();
});

test('JavaScript-disabled pages retain the first bilingual story and hide nonfunctional controls', async ({
  browser,
  isMobile,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  for (const locale of ['en', 'es'] as const) {
    await page.goto(`http://127.0.0.1:4321/${locale === 'es' ? 'es/' : ''}`);
    const root = page.locator('[data-hero-carousel]');
    await expect(root.locator('.story-slide:visible')).toHaveCount(1);
    await expect(root.locator('.story-slide:visible strong')).toHaveText(
      heroStories[0].text[locale].title,
    );
    await expect(root.locator('img[src]')).toHaveCount(1);
    await expect(root.locator('.story-controls')).toBeHidden();
  }
  await context.close();
});

test('failed images keep the current story visible and the first image has a nonblank fallback', async ({
  page,
}) => {
  await page.route('**/hero-speaker-new-york-*.webp', (route) => route.abort());
  await page.goto('/es/');
  const root = page.locator('[data-hero-carousel]');
  await root.locator('.story-next').click();
  await expect(root.locator('[data-story-announcement]')).toHaveText(carouselText.es.unavailable);
  await expect(root).toHaveAttribute('data-active-slide', '1');
  await expect(root.locator('[data-story="maker"]')).toBeVisible();
  await root.locator('[data-story-index="2"]').click();
  await expect(root).toHaveAttribute('data-active-slide', '3');
  await page.route('**/hero-stackchan-*.webp', (route) => route.abort());
  await page.reload();
  await expect(root.locator('.story-fallback')).toBeVisible();
  await expect(root.locator('.story-fallback')).toContainText(carouselText.es.fallback);
});

test('private originals remain ignored, untracked and unavailable from the public build', async ({
  page,
}) => {
  expect(execFileSync('git', ['ls-files', '--', 'tmp/photos'], { encoding: 'utf8' }).trim()).toBe(
    '',
  );
  expect(
    execFileSync('git', ['check-ignore', '--', 'tmp/photos/26-06-BusAllForMyself.png'], {
      encoding: 'utf8',
    }).trim(),
  ).toBe('tmp/photos/26-06-BusAllForMyself.png');
  for (const basename of [
    '26-06-BusAllForMyself.png',
    '26-11-bruno hold stackchan.jpg',
    '24-10-bruno ai tour new york.jpg',
  ]) {
    expect((await page.request.get(`/tmp/photos/${encodeURIComponent(basename)}`)).status()).toBe(
      404,
    );
  }
  await page.goto('/');
  expect(await page.content()).not.toContain('tmp/photos');
  expect(await page.content()).not.toContain('D:\\elbruno');
});

test('every story has accessible controls and caption contrast in both themes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark']) {
    await page.goto('/es/');
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    for (let index = 0; index < heroStories.length; index++) {
      await page.locator(`[data-story-index="${index}"]`).click();
      await expect(page.locator('[data-hero-carousel]')).toHaveAttribute(
        'data-active-slide',
        String(index + 1),
      );
      const audit = await new AxeBuilder({ page })
        .include('[data-hero-carousel]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(audit.violations).toEqual([]);
    }
  }
});

test('initial enhancement reserves its controls and does not shift the hero', async ({ page }) => {
  await page.route('**/_astro/*.js', async (route) => {
    await new Promise((done) => setTimeout(done, 500));
    await route.continue();
  });

  for (const route of ['/', '/es/']) {
    await page.goto(route);
    await expect(page.locator('[data-hero-carousel]')).toHaveAttribute('data-active-slide', '1');
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
              if (!shift.hadRecentInput) total += shift.value;
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => {
            observer.disconnect();
            resolve(total);
          }, 300);
        }),
    );
    expect(cls).toBeLessThanOrEqual(0.01);
  }
});

test('returning from the back-forward cache resets to StackChan even with focus inside', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-story-index="5"]').click();
  await expect(page.locator('[data-hero-carousel]')).toHaveAttribute('data-active-slide', '6');
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })),
  );
  await expect(page.locator('[data-hero-carousel]')).toHaveAttribute('data-active-slide', '1');
});

test('carousel works under the existing hosting CSP without third-party requests', async ({
  page,
}) => {
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
    await route.fulfill({
      response,
      headers: { ...response.headers(), ...hosting.globalHeaders },
    });
  });
  await page.goto('/');
  for (let index = 0; index < heroStories.length; index++) {
    await page.locator(`[data-story-index="${index}"]`).click();
    await expect(page.locator('[data-hero-carousel]')).toHaveAttribute(
      'data-active-slide',
      String(index + 1),
    );
  }
  expect(offsite).toEqual([]);
  expect(errors).toEqual([]);
});
