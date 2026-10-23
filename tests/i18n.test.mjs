import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { en } from '../src/i18n/en.ts';
import { es } from '../src/i18n/es.ts';

const root = new URL('../', import.meta.url);
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const html = {
  en: readFileSync(new URL('dist/index.html', root), 'utf8'),
  es: readFileSync(new URL('dist/es/index.html', root), 'utf8'),
};
const tags = (source, name) => [...source.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(([tag]) => {
  const attrs = {};
  for (const match of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[match[1]] = decode(match[2]);
  return attrs;
});

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (typeof value !== 'object' || value === null) return typeof value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
}

function strings(value, key = '') {
  if (typeof value === 'string') return ['id', 'kind'].includes(key) ? [] : [value];
  return Object.entries(value).flatMap(([name, item]) => strings(item, name));
}

test('Both translations have the same complete structure and stable experience IDs', () => {
  assert.deepEqual(shape(es), shape(en));
  assert.equal(en.experience.length, 7);
  assert.equal(en.approach.length, 4);
  assert.deepEqual(es.experience.map((item) => item.id), en.experience.map((item) => item.id));
});

for (const [locale, copy, canonical, alternate, target] of [
  ['en', en, 'https://andres-celis.dev/', '/es/', 'es'],
  ['es', es, 'https://andres-celis.dev/es/', '/', 'en'],
]) {
  test(`${locale}: language, translated content, metadata and one main heading`, () => {
    const source = decode(html[locale]);
    assert.equal(tags(source, 'html')[0].lang, locale);
    assert.equal(tags(source, 'h1').length, 1);
    assert.ok(source.includes(`<title>${copy.meta.title}</title>`));
    assert.equal(tags(html[locale], 'meta').find((tag) => tag.name === 'description').content, copy.meta.description);
    for (const value of strings(copy)) assert.ok(source.includes(value), `Missing translated content: ${value}`);
    assert.ok(!source.includes(locale === 'es' ? en.hero.bio : es.hero.bio));
  });

  test(`${locale}: self-canonical and reciprocal language alternates`, () => {
    const links = tags(html[locale], 'link');
    assert.equal(links.find((tag) => tag.rel === 'canonical').href, canonical);
    for (const [language, href] of [['en', 'https://andres-celis.dev/'], ['es', 'https://andres-celis.dev/es/'], ['x-default', 'https://andres-celis.dev/']]) {
      assert.equal(links.find((tag) => tag.hreflang === language).href, href);
    }
  });

  test(`${locale}: language switch is a normal, accessible link without a JS dependency`, () => {
    const link = tags(html[locale], 'a').find((tag) => tag.class === 'language-switch');
    assert.equal(link.href, alternate);
    assert.equal(link.hreflang, target);
    assert.equal(link.lang, target);
    assert.equal(link['aria-label'], copy.header.languageLabel);
    assert.equal(tags(html[locale], 'a').find((tag) => tag.class === 'brand').href, locale === 'es' ? '/es/' : '/');
  });

  test(`${locale}: all seven timeline dialogs and internal anchors remain connected`, () => {
    const ids = [...html[locale].matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs');
    assert.equal(tags(html[locale], 'dialog').length, 7);
    const triggers = tags(html[locale], 'button').filter((tag) => tag['data-dialog-target']);
    assert.equal(triggers.length, 7);
    for (const trigger of triggers) {
      assert.ok(ids.includes(trigger['data-dialog-target']));
      assert.equal(trigger['aria-controls'], trigger['data-dialog-target']);
    }
    for (const link of tags(html[locale], 'a').filter((tag) => tag.href?.startsWith('#'))) assert.ok(ids.includes(link.href.slice(1)));
    assert.ok(tags(html[locale], 'a').some((tag) => tag.href === 'mailto:hi@andres-celis.dev'));
  });

  test(`${locale}: images and stylesheet URLs resolve from either language path`, () => {
    const assets = [
      ...tags(html[locale], 'img').map((tag) => tag.src),
      ...tags(html[locale], 'link').filter((tag) => ['stylesheet', 'icon'].includes(tag.rel)).map((tag) => tag.href),
    ];
    for (const asset of assets) {
      assert.ok(asset.startsWith('/'), `Not root-relative: ${asset}`);
      assert.ok(existsSync(new URL(`dist${asset}`, root)), `Missing asset: ${asset}`);
    }
  });
}

test('Sitemap and robots expose both canonical pages, without query-based language URLs', () => {
  const sitemap = readFileSync(new URL('dist/sitemap.xml', root), 'utf8');
  assert.ok(sitemap.includes('<loc>https://andres-celis.dev/</loc>'));
  assert.ok(sitemap.includes('<loc>https://andres-celis.dev/es/</loc>'));
  assert.ok(readFileSync(new URL('dist/robots.txt', root), 'utf8').includes('Sitemap: https://andres-celis.dev/sitemap.xml'));
});
