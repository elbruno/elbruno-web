import { test, expect } from '@playwright/test';
import { featuredProjects, curatedRepositories } from '../../src/data/profile';
import feeds from '../../src/data/feeds/snapshot.json' with { type: 'json' };
import { heroStories } from '../../src/data/hero-stories';

const routes = ['', 'about/', 'projects/', 'speaking/'];

test('all WordPress links open isolated new tabs, including mobile navigation and article cards', async ({
  page,
  context,
  isMobile,
}) => {
  await context.route(/^https:\/\/(?:www\.)?elbruno\.com(?:\/|$)/, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<title>Blog destination</title>' }),
  );
  for (const prefix of ['/', '/es/']) {
    for (const route of routes) {
      await page.goto(`${prefix}${route}`);
      const original = page.url();
      const links = page.locator('a[href^="https://elbruno.com"]');
      expect(await links.count()).toBeGreaterThan(0);
      if (!route) {
        for (const article of feeds.entries.filter((entry) => entry.source === 'blog'))
          await expect(page.locator(`a[href="${article.url}"]`)).toHaveCount(1);
      }
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        if (isMobile && (await link.evaluate((element) => !!element.closest('nav'))))
          await page.locator('.mobile-toggle').click();
        const popupEvent = context.waitForEvent('page');
        await link.click();
        const popup = await popupEvent;
        await popup.waitForLoadState('domcontentloaded');
        expect(popup.url()).toBe(new URL((await link.getAttribute('href'))!).href);
        expect(await popup.evaluate(() => window.opener)).toBeNull();
        expect(page.url()).toBe(original);
        await popup.close();
        if (
          isMobile &&
          (await page.locator('.mobile-toggle').getAttribute('aria-expanded')) === 'true'
        )
          await page.locator('.mobile-toggle').click();
      }
      for (const link of await page.locator('a[href^="/"]').all())
        await expect(link).not.toHaveAttribute('target', '_blank');
    }
  }
});

test('curated portfolio and API repository cards retain distinct stable orders and verified URLs', async ({
  page,
  isMobile,
}) => {
  for (const prefix of ['/', '/es/']) {
    await page.goto(prefix);
    const featured = page.locator('#featured-projects');
    await expect(featured.locator('h3')).toHaveText(
      featuredProjects.map((project) => project.name),
    );
    const github = page.locator('#from-github');
    expect(
      await github
        .locator('h3 a')
        .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href'))),
    ).toEqual(curatedRepositories.map((project) => project.url));
    for (const project of featuredProjects)
      await expect(featured.locator(`h3 a[href="${project.url}"]`)).toHaveCount(1);
    await expect(featured).not.toContainText('PromptDot');
    await expect(github).not.toContainText('PromptDot');
    const cards = await featured.locator('.project-card').all();
    const first = (await cards[0].boundingBox())!;
    const second = (await cards[1].boundingBox())!;
    expect(isMobile ? second.y > first.y : Math.abs(second.y - first.y) < 1).toBe(true);
    const conference = page.locator('[data-talks]');
    await expect(conference.locator('h2')).toContainText('.NET Conf 2026');
    await expect(conference.locator('h3')).toHaveText([
      '.NET + Foundry: Better Together',
      'Beyond Localhost: .NET Agents in Foundry',
    ]);
    await expect(conference.locator('.conference-actions .primary')).toHaveAttribute(
      'href',
      'https://www.dotnetconf.net/',
    );
    await expect(conference.locator('.conference-actions .small-link')).toHaveAttribute(
      'href',
      'https://www.dotnetconf.net/agenda',
    );
  }
});

test('every slide fills its frame with a photograph or illustration and embeds all controls above its caption', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const root = page.locator('[data-hero-carousel]');
  for (let index = 0; index < heroStories.length; index++) {
    await root.locator(`[data-story-index="${index}"]`).click();
    await expect(root).toHaveAttribute('data-active-slide', String(index + 1));
    const frame = root.locator('.story-slide:not([hidden]) .story-frame');
    expect(
      await frame.evaluate((element) => {
        const image = element.querySelector('img')!;
        const style = getComputedStyle(image);
        const background = getComputedStyle(element, '::before');
        const box = element.getBoundingClientRect();
        return {
          filled:
            style.objectFit === 'cover' ||
            (background.backgroundImage.includes(image.getAttribute('src')!) &&
              background.backgroundSize === 'cover' &&
              background.filter.includes('blur')),
          ratio: box.width / box.height,
        };
      }),
    ).toMatchObject({ filled: index !== 2, ratio: expect.closeTo(16 / 11, 2) });
    const bounds = (await frame.boundingBox())!;
    for (const control of await root.locator('button').all()) {
      const box = (await control.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(bounds.x);
      expect(box.y).toBeGreaterThanOrEqual(bounds.y);
      expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(bounds.y + bounds.height + 1);
    }
    if (heroStories[index].backgroundMode === 'photo')
      await expect(frame.locator('img')).toHaveCSS('object-fit', 'contain');
  }
});

test('all bilingual captions remain unclipped at narrow and intermediate responsive widths', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const prefix of ['/', '/es/']) {
      await page.goto(prefix);
      for (let index = 0; index < heroStories.length; index++) {
        await page.locator(`[data-story-index="${index}"]`).click();
        await expect(page.locator('[data-hero-carousel]')).toHaveAttribute(
          'data-active-slide',
          String(index + 1),
        );
        expect(
          await page
            .locator('.story-slide:not([hidden]) figcaption')
            .evaluate((caption) => caption.scrollHeight <= caption.clientHeight),
          `${prefix}, ${width}px, story ${index + 1}`,
        ).toBe(true);
      }
    }
  }
});
