import type { Category, Language, Product } from './types';
export const categories: { id: 'all' | Category; fa: string; en: string }[] = [
  { id: 'all', fa: 'همهٔ منو', en: 'All items' },
  { id: 'hot', fa: 'قهوه گرم', en: 'Hot coffee' },
  { id: 'cold', fa: 'قهوه سرد', en: 'Iced coffee' },
  { id: 'signature', fa: 'نوشیدنی‌های ویژه', en: 'Signatures' },
  { id: 'tea', fa: 'چای و دمنوش', en: 'Tea & infusions' },
  { id: 'dessert', fa: 'کیک و دسر', en: 'Cake & dessert' },
  { id: 'breakfast', fa: 'صبحانه', en: 'Breakfast' },
];
export function normalize(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/[يى]/g, 'ی').replace(/ك/g, 'ک')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[\u200c\u200d]/g, ' ').replace(/\s+/g, ' ').trim();
}
export function filterProducts(products: Product[], category: string, query: string) {
  const tokens = normalize(query).split(' ').filter(Boolean);
  return products.filter(p => (category === 'all' || p.category === category) &&
    tokens.every(token => normalize(`${p.nameFa} ${p.nameEn} ${p.descriptionFa} ${p.descriptionEn}`).includes(token)));
}
export function number(value: number, lang: Language) { return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(value); }
export function asset(path: string) { return `${import.meta.env.BASE_URL}${path}`; }
