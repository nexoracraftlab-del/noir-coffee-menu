import test from 'node:test';
import assert from 'node:assert/strict';
import data from './data/products.json';
import type { Product } from './types';
import { filterProducts, normalize, number, categories } from './menu';
const products = data as Product[];
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
