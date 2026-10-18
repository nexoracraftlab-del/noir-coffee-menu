import test from 'node:test';
import assert from 'node:assert/strict';
import data from './data/products.json';
import type { Product } from './types';
import { filterProducts, normalize, number, categories } from './menu';
import { applyLiveMenu } from './live-menu';
const products = data as Product[];
test('Live prices and availability update while reviewed copy and images remain intact', () => {
  const payload = { schema: 1, products: products.map(p => ({ id: p.id, price: 220000, available: false, nameFa: 'injected' })) };
  const next = applyLiveMenu(products, payload);
  assert.equal(next[0].price, 220000); assert.equal(next[0].available, false);
  assert.equal(next[0].nameFa, products[0].nameFa); assert.equal(next[0].image, products[0].image);
  assert.notEqual(products[0].price, 220000);
});
test('Malformed, missing, duplicate, negative and unknown live products are rejected atomically', () => {
  const rows = products.map(p => ({ id: p.id, price: p.price, available: p.available }));
  for (const payload of [null, {schema: 2, products: rows}, {schema: 1, products: rows.slice(1)},
    {schema: 1, products: [{...rows[0], price: -1}, ...rows.slice(1)]},
    {schema: 1, products: [rows[1], ...rows.slice(1)]},
    {schema: 1, products: [{...rows[0], id: 'unknown'}, ...rows.slice(1)]}]) assert.throws(() => applyLiveMenu(products, payload));
});
test('all 28 products are reachable through category filters', () => {
  assert.equal(filterProducts(products, 'all', '').length, 28);
  const groups = categories.slice(1).map(c => filterProducts(products, c.id, ''));
  assert.ok(groups.every(g => g.length > 0));
  assert.equal(groups.flat().length, products.length);
});
test('search accepts Persian and Arabic forms, English case, spaces and vowel marks', () => {
  assert.equal(normalize('  كيكِ  يخي '), 'کیک یخی');
  assert.deepEqual(filterProducts(products, 'all', 'آيس لاته').map(p => p.slug), ['iced-latte', 'iced-caramel-latte']);
  assert.equal(filterProducts(products, 'all', ' LATTE ').length, 5);
  assert.ok(filterProducts(products, 'all', 'مخملی').length > 0);
});
test('category and query combine; empty and missing queries are safe', () => {
  assert.ok(filterProducts(products, 'hot', 'لاته').every(p => p.category === 'hot'));
  assert.equal(filterProducts(products, 'dessert', 'latte').length, 0);
  assert.equal(filterProducts(products, 'all', 'محصولی که وجود ندارد').length, 0);
  assert.equal(filterProducts(products, 'all', '  ').length, 28);
});
test('unavailable products remain discoverable without fake ordering', () => {
  const unavailable = products.filter(p => !p.available);
  assert.equal(unavailable.length, 3);
  for (const p of unavailable) assert.ok(filterProducts(products, p.category, p.nameFa).some(x => x.id === p.id));
});
test('prices are formatted with appropriate locale digits', () => {
  assert.equal(number(145000, 'fa'), '۱۴۵٬۰۰۰');
  assert.equal(number(145000, 'en'), '145,000');
});
