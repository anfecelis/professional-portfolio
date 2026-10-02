# QA leadership portfolio

English, one-page portfolio for Andrés Felipe Celis Gómez. It is an Astro static site with no client-side framework, database, or contact form.

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

The static output is written to `dist/`. All visible copy lives in `src/pages/index.astro`; the responsive design lives in `src/styles/global.css`.

The site self-hosts variable Raleway (headings and interface labels) and Merriweather (reading text). Their SIL Open Font License notices are included in `public/licenses/` and copied into the production build.

## Deployment

Import this repository into Vercel as an Astro project. The repository root is the Astro project root; the build command is `npm run build`, and the static output is `dist/`.

## Content boundary

The professional QA cases are summaries of prior work; proprietary client artifacts are not published. Tinwa and Xentinela are presented as AI software-development projects, not professional QA engagements. The AI-augmented quality lifecycle describes a proposed approach, not prior client work.
