import { useState, useId, useLayoutEffect, useRef } from 'react';
import { copy } from '../copy';
import { number } from '../menu';
import type { Language, Product } from '../types';

import { MenuImage } from './MenuImage';
export function ProductCard({ product: p, lang }: { product: Product; lang: Language; onOpen: (p: Product) => void }) {
 const content=useRef<HTMLDivElement>(null);const [height,setHeight]=useState(0);
 useLayoutEffect(()=>{const el=content.current;if(!el)return;const measure=()=>setHeight(el.getBoundingClientRect().height);measure();const observer=new ResizeObserver(measure);observer.observe(el);return()=>observer.disconnect();},[]);
 const [open,setOpen]=useState(false);const id=useId();const t=copy[lang];const name=lang==='fa'?p.nameFa:p.nameEn;
 return <article className={`product-card fold-card ${open?'expanded':''} ${p.available?'':'is-unavailable'}`}>
  <button className="fold-trigger" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls={id} aria-label={`${t.details}: ${name}`}>
   <div className="product-photo"><MenuImage image={p.image} alt={name}/><div className="fold-caption"><h3>{name}</h3><span className="price">{number(p.price,lang)} <small>{t.toman}</small></span></div>{!p.available&&<span className="badge muted">{t.unavailable}</span>}</div>
   <span className="fold-handle"><span>{open?t.close:t.details}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
  </button>
  <div id={id} className="fold-region" style={{height:open?height:0}} inert={!open} aria-hidden={!open}><div className="fold-clip"><div className="fold-content" ref={content}><p>{lang==='fa'?p.descriptionFa:p.descriptionEn}</p><div className="fold-ingredients"><h4>{t.ingredients}</h4><p>{lang==='fa'?p.ingredientsFa:p.ingredientsEn}</p></div><p className={`availability ${p.available?'':'off'}`}><span/>{p.available?t.available:t.unavailable}</p><p className="fold-note">{t.detailNote}</p></div></div></div>
 </article>;
}

