import type { Product } from './types';

// Only price and availability may override the reviewed product catalogue.
export function applyLiveMenu(products: Product[], value: unknown): Product[] {
  if (!value || typeof value !== 'object') throw Error('Invalid menu');
  const payload = value as { schema?: unknown; products?: unknown };
  if (payload.schema !== 1 || !Array.isArray(payload.products) || payload.products.length !== products.length) throw Error('Invalid menu');
  const rows = new Map<string, { price: number; available: boolean }>();
  for (const row of payload.products) {
    if (!row || typeof row.id !== 'string' || rows.has(row.id) || !Number.isSafeInteger(row.price) || row.price < 100 || row.price > 1_000_000_000 || typeof row.available !== 'boolean') throw Error('Invalid menu');
    rows.set(row.id, { price: row.price, available: row.available });
  }
  return products.map(p => {
    const row = rows.get(p.id);
    if (!row) throw Error('Incomplete menu');
    return { ...p, ...row };
  });
}
