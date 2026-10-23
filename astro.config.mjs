import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://andres-celis.dev',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
});
