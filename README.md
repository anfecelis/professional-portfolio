# QA leadership portfolio

Bilingual portfolio for Andrés Felipe Celis Gómez. It is an Astro static site with no client-side framework, database, or contact form.

## Local use

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

For a production build:

```sh
npm run build
npm run preview
```

The static output is written to `dist/`. Both languages share `src/components/Portfolio.astro`; English and Spanish copy live in `src/i18n/en.ts` and `src/i18n/es.ts`. The responsive design lives in `src/styles/global.css`.

## Languages and URLs

- English: `/` (the existing URL is preserved).
- Spanish: `/es/`.
- The header language link works without JavaScript. With JavaScript, it also preserves the current section hash.
- Each page has its own HTML language, translated metadata, self-referencing canonical URL, and reciprocal `hreflang` links (including English as `x-default`).
- The production origin is configured in `astro.config.mjs`. `public/sitemap.xml` lists both canonical pages, and `public/robots.txt` points to it. No language detection redirects or language cookies are used.

Run `npm test` to build both pages and verify translation completeness, language URLs, SEO annotations, dialogs, internal links and asset paths. The test runner uses Node's built-in TypeScript stripping (Node 22.6+).

The site self-hosts variable Raleway (headings and interface labels) and Merriweather (reading text). Their SIL Open Font License notices are included in `public/licenses/` and copied into the production build.

## Deployment

Import this repository into Vercel as an Astro project. The repository root is the Astro project root; the build command is `npm run build`, and the static output is `dist/`.

## Content boundary

The professional QA cases are summaries of prior work; proprietary client artifacts are not published. Tinwa and Xentinela are presented as AI software-development projects, not professional QA engagements. The AI-augmented quality lifecycle describes a proposed approach, not prior client work.
