import { useEffect, useMemo, useState } from 'react';
import data from './data/products.json';
import type { Language, Product } from './types';
import { asset, categories, filterProducts, number } from './menu';
import { copy } from './copy';
import { Icon } from './components/Icon';
import { ProductCard } from './components/ProductCard';
import { MenuImage } from './components/MenuImage';
import { Modal } from './components/Modal';
import { CategoryPicker } from './components/CategoryPicker';
import { applyLiveMenu } from './live-menu';
const catalogue: Product[] = data as Product[];
export default function App() {
  const [products, setProducts] = useState<Product[]>(catalogue);
  const [syncFailed, setSyncFailed] = useState(false);
  const [pricesReady, setPricesReady] = useState(false);
  const [lang, setLang] = useState<Language>(() => { try { return localStorage.getItem('noir-language') === 'en' ? 'en' : 'fa'; } catch { return 'fa'; } });
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = products.find(p => p.id === selectedId) ?? null;
  const setSelected = (product: Product | null) => setSelectedId(product?.id ?? null);
  const [infoOpen, setInfoOpen] = useState(false);
  const t = copy[lang];
  const visible = useMemo(() => filterProducts(products, category, query), [products, category, query]);
  useEffect(() => {
    let disposed = false, busy = false;
    const controller = new AbortController();
    async function refresh() {
      if (busy || document.hidden) return;
      busy = true;
      try {
        const source = import.meta.env.VITE_MENU_DATA_URL || (import.meta.env.PROD ? 'https://raw.githubusercontent.com/nexoracraftlab-del/noir-coffee-menu/main/public/menu-live.json' : `${import.meta.env.BASE_URL}menu-live.json`);
        const response = await fetch(`${source}?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) });
        if (!response.ok) throw Error('Menu unavailable');
        const next = applyLiveMenu(catalogue, await response.json());
        if (!disposed) { setProducts(next); setPricesReady(true); setSyncFailed(false); }
      } catch { if (!disposed) setSyncFailed(true); }
      finally { busy = false; }
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), 3000);
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => { disposed = true; controller.abort(); clearInterval(timer); window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onFocus); };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.title = lang === 'fa' ? 'NOIR Coffee — منوی دیجیتال' : 'NOIR Coffee — Digital Menu';
    try { localStorage.setItem('noir-language', lang); } catch { /* No storage is required to use the menu. */ }
  }, [lang]);
  function reset() { setQuery(''); setCategory('all'); }
  return <>
    <a className="skip" href="#menu">{t.skip}</a>
    <header className="site-header"><div className="header-inner wrap">
      <a className="wordmark" href="#home" aria-label="NOIR Coffee"><span lang="en" dir="ltr">NOIR<span className="wordmark-dot">.</span></span><small lang="en" dir="ltr">COFFEE & SLOW MOMENTS</small></a>
      <nav className="header-nav" aria-label={lang === 'fa' ? 'ناوبری اصلی' : 'Main navigation'}><a href="#menu">{t.menu}</a><a href="#story">{t.story}</a></nav>
      <div className="header-actions"><button className="language-button" onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')} aria-label={lang === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}>{lang === 'fa' ? 'EN' : 'فا'}</button><span className="header-divider" /><button className="info-button" aria-label={t.info} onClick={() => setInfoOpen(true)} aria-haspopup="dialog"><Icon name="info" /><span>{t.info}</span></button></div>
    </div></header>
    <main>
      <section className="hero wrap" id="home" aria-labelledby="hero-title">
        <div className="hero-copy"><span className="eyebrow"><span className="tiny-line" />{t.eyebrow}</span><h1 id="hero-title">{t.hero}</h1><p>{t.intro}</p><div className="hero-actions"><a className="primary-button" href="#location">{t.locationButton}<Icon name="pin" /></a><a className="primary-button location-button" href="https://t.me/CafeMenuPrototypebot" target="_blank" rel="noopener noreferrer"><Icon name="bot" />{lang === 'fa' ? 'بات تلگرام' : 'Telegram bot'}</a></div><div className="hero-footnote"><Icon name="sun" size={19} /><span>{t.scroll}</span></div></div>
        <div className="hero-visual"><img src={asset('images/hero-splash.png')} width="1671" height="941" alt={lang === 'fa' ? 'فنجان معلق، دانه‌های قهوه و موج قهوه' : 'A floating coffee cup with coffee beans and a coffee splash'} fetchPriority="high" /><div className="hero-image-label" lang="en" dir="ltr"><span>BREWED WITH CARE</span><span>01 / NOIR</span></div><div className="coffee-stamp" aria-hidden="true"><span>NOIR COFFEE</span><Icon name="bean" size={30} /><span>TAKE A MOMENT</span></div></div>
      </section>
      <div className="demo-note wrap"><span className="demo-dot" />{t.note}</div>
      <section className="menu-section wrap" id="menu" aria-labelledby="menu-title">
        {syncFailed && pricesReady && <p role="status">{lang === 'fa' ? 'دریافت قیمت تازه ممکن نشد؛ آخرین اطلاعات موجود نمایش داده می‌شود. دوباره تلاش می‌کنیم.' : 'Could not refresh prices. Showing the last available menu; retrying shortly.'}</p>}
        <div className="menu-heading"><div><span className="eyebrow">{t.menuEyebrow}</span><h2 id="menu-title">{t.menuTitle}</h2><p>{t.menuIntro}</p></div><div className="menu-edition" lang="en" dir="ltr"><Icon name="cup" size={28} /><span>THE MENU<br /><b>NOIR / 01</b></span></div></div>
        <div className="menu-tools"><CategoryPicker lang={lang} value={category} onSelect={setCategory} /><div className="category-scroll" role="group" aria-label={t.categories}>{categories.map(c => <button key={c.id} aria-pressed={category === c.id} className={`category ${category === c.id ? 'active' : ''}`} onClick={e => { setCategory(c.id); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }}>{c[lang]}</button>)}</div>
          <div className="search-row"><div className="search"><Icon name="search" /><label className="sr-only" htmlFor="menu-search">{t.search}</label><input id="menu-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t.placeholder} maxLength={100} />{query && <button className="clear-search icon-button" onClick={() => setQuery('')} aria-label={t.clear}><Icon name="close" size={17} /></button>}</div><p className="result-count" role="status" aria-live="polite" aria-atomic="true"><strong>{number(visible.length, lang)}</strong> {t.count}</p></div>
        </div>
        {!pricesReady ? <div className="price-loading" role="status" aria-live="polite" aria-busy={!syncFailed}><Icon name="cup" size={30} /><p>{lang === 'fa' ? (syncFailed ? 'دریافت قیمت‌ها ممکن نشد؛ دوباره تلاش می‌کنیم.' : 'در حال دریافت قیمت‌های به‌روز…') : (syncFailed ? 'Could not load prices. Retrying shortly.' : 'Loading current prices…')}</p></div> : visible.length ? <div className="product-grid">{visible.map(p => <ProductCard key={p.id} product={p} lang={lang} onOpen={setSelected} />)}</div> : <div className="empty-state"><Icon name="search" size={36} /><h3>{t.empty}</h3><p>{t.emptyText}</p><button className="primary-button" onClick={reset}>{t.reset}<Icon name="arrow" /></button></div>}
      </section>
      <section className="story-section" id="story" aria-labelledby="story-title"><div className="wrap story-inner"><div className="story-mark" lang="en" dir="ltr" aria-hidden="true"><span>n.</span><small>COFFEE, CONVERSATION<br />& EVERYTHING IN BETWEEN.</small></div><div className="story-copy"><span className="eyebrow">{t.storyEyebrow}</span><h2 id="story-title">{t.storyTitle}</h2><p>{t.storyText}</p><button className="story-info" onClick={() => setInfoOpen(true)}>{t.info}<Icon name="arrow" size={18} /></button></div></div></section>
    </main>
    <footer className="site-footer wrap"><section className="location-bar" id="location" aria-labelledby="location-title"><a className="location-preview" href="https://www.google.com/maps/dir/?api=1&destination=35.69972%2C51.33722" target="_blank" rel="noopener noreferrer" aria-label={t.openMap}><img className="location-map" src={asset('images/azadi-map.svg')} width="240" height="240" alt={t.locationAddress} loading="lazy" /></a><div className="location-copy"><h2 id="location-title">{t.locationAddress}</h2><p>{t.locationDemo}</p></div><div className="location-links"><a href="https://www.google.com/maps/dir/?api=1&destination=35.69972%2C51.33722" target="_blank" rel="noopener noreferrer">{t.openMap}<Icon name="arrow" size={17} /></a></div></section><div className="footer-top"><a className="footer-brand" href="#home" lang="en" dir="ltr">NOIR<span>.</span></a><div><span className="eyebrow">{t.hours}</span><p>{t.hoursValue}</p></div><div className="footer-demo"><span className="outline-tag" lang="en">DEMO PROJECT</span><p>{t.footer}</p></div></div><div className="footer-bottom"><a href="https://nexoracraftlab-del.github.io/nexora-website/" target="_blank" rel="noopener noreferrer" lang="en" dir="ltr">Designed & Developed by <strong>Nexora</strong><Icon name="arrow" size={15} /></a><span>{t.photoCredit}</span></div></footer>
    <Modal open={selected !== null} onClose={() => setSelected(null)} titleId="product-title" closeLabel={t.close}>
      {selected && <><div className="detail-photo"><MenuImage key={selected.id} image={selected.image} alt={lang === 'fa' ? selected.nameFa : selected.nameEn} eager /></div><div className="detail-content"><span className="eyebrow">{categories.find(c => c.id === selected.category)?.[lang]}</span><div className="detail-heading"><h2 id="product-title">{lang === 'fa' ? selected.nameFa : selected.nameEn}</h2><p className="price">{number(selected.price, lang)} <small>{t.toman}</small></p></div><span className="product-en" lang="en" dir="ltr">{selected.nameEn}</span><p>{lang === 'fa' ? selected.descriptionFa : selected.descriptionEn}</p><div className="ingredient-box"><h3>{t.ingredients}</h3><p>{lang === 'fa' ? selected.ingredientsFa : selected.ingredientsEn}</p></div><p className={`availability ${selected.available ? '' : 'off'}`}><span />{selected.available ? t.available : t.unavailable}</p>{!selected.available && <p className="unavailable-note">{t.unavailableNote}</p>}<p className="detail-small">{t.imageNote}<br />{t.detailNote}</p></div></>}
    </Modal>
    <Modal open={infoOpen} onClose={() => setInfoOpen(false)} titleId="info-title" closeLabel={t.close}><div className="cafe-info"><span className="eyebrow" lang="en">A CONCEPT BY NEXORA</span><h2 id="info-title" lang="en" dir="ltr">NOIR Coffee<span>.</span></h2><p>{t.locationValue}</p><div className="info-hours"><Icon name="clock" size={24} /><div><h3>{t.hours}</h3><p>{t.hoursValue}</p></div></div><p className="info-disclaimer">{t.note}<br />{t.detailNote}</p><a className="primary-button" href="https://nexoracraftlab-del.github.io/nexora-website/" target="_blank" rel="noopener noreferrer">Nexora<Icon name="arrow" /></a></div></Modal>
  </>;
}
