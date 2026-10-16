import { copy } from '../copy';
import { number } from '../menu';
import type { Language, Product } from '../types';
import { Icon } from './Icon';
import { MenuImage } from './MenuImage';
export function ProductCard({ product: p, lang, onOpen }: { product: Product; lang: Language; onOpen: (p: Product) => void }) {
  const t = copy[lang]; const name = lang === 'fa' ? p.nameFa : p.nameEn;
  return <article className={`product-card ${p.available ? '' : 'is-unavailable'}`}>
    <button className="product-open" onClick={() => onOpen(p)} aria-label={`${t.details}: ${name}`} aria-haspopup="dialog">
      <div className="product-photo"><MenuImage image={p.image} alt={name} />
        {(!p.available || p.featured || p.tags.includes('new')) && <span className={`badge ${!p.available ? 'muted' : ''}`}>{!p.available ? t.unavailable : p.tags.includes('new') ? t.new : t.special}</span>}
        <span className="photo-arrow"><Icon name="arrow" /></span>
      </div>
      <div className="product-body"><span className="product-en" lang="en" dir="ltr">{p.nameEn}</span><h3>{name}</h3><p>{lang === 'fa' ? p.descriptionFa : p.descriptionEn}</p>
        <div className="product-bottom"><span className="price">{number(p.price, lang)} <small>{t.toman}</small></span><span className="detail-label">{t.details}<Icon name="arrow" size={14} /></span></div>
      </div>
    </button>
  </article>;
}
