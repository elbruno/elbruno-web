import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elbruno.com',
  output: 'static',
  trailingSlash: 'always',
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    sitemap({
      filter: (page) => !/\/404(?:\/|\.html)?$/.test(new URL(page).pathname),
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
    }),
  ],
});
