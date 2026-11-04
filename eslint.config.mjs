import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'],
  },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  { files: ['**/*.astro'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
);
