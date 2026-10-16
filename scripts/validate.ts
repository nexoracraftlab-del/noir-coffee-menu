import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import products from '../src/data/products.json';
import { categories } from '../src/menu';
const ids = new Set<string>(); const slugs = new Set<string>();
for (const p of products) {
  assert.ok(!ids.has(p.id) && !slugs.has(p.slug), `Duplicate: ${p.id}`);
  ids.add(p.id); slugs.add(p.slug);
  for (const field of ['id','slug','nameFa','nameEn','descriptionFa','descriptionEn','ingredientsFa','ingredientsEn','image'] as const) assert.ok(p[field].trim(), `${p.id}: ${field}`);
  assert.ok(p.price > 0 && Number.isSafeInteger(p.price));
  assert.ok(typeof p.available === 'boolean' && typeof p.featured === 'boolean');
  assert.ok(categories.some(c => c.id === p.category));
  for (const width of [480,800]) assert.ok(existsSync(resolve(`public/images/${p.image}-${width}.webp`)), `Image missing: ${p.image}`);
}
assert.ok(products.length >= 28);
const sources = JSON.parse(readFileSync('docs/image-sources.json','utf8')) as {file:string;page:string;license:string}[];
for (const p of products) assert.ok(sources.some(s => s.file === p.image && s.page.startsWith('https://www.pexels.com/') && s.license));
for (const file of ['public/favicon.svg','public/images/hero.webp','public/fonts/Vazirmatn-Variable.ttf','public/fonts/OFL.txt']) assert.ok(statSync(file).size > 0);
console.log(`PASS: ${products.length} unique products, valid prices, all categories and image variants, licensed sources, font and favicon.`);
