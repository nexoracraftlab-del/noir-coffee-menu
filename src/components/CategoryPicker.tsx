import { useEffect, useRef, useState } from 'react';
import type { Language } from '../types';
import { categories } from '../menu';
export function CategoryPicker({lang,value,onSelect}:{lang:Language;value:string;onSelect:(id:string)=>void}){
 const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[open]);
 return <div ref={root} className={`liquid-picker ${open?'is-open':''}`} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}}}>
 <button ref={trigger} className="liquid-trigger" aria-expanded={open} aria-controls="category-options" onClick={()=>setOpen(!open)}>{categories.find(c=>c.id===value)?.[lang]}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
 <div id="category-options" className="liquid-options" inert={!open} aria-hidden={!open}><div>{categories.map(c=><button key={c.id} aria-pressed={value===c.id} onClick={()=>{onSelect(c.id);setOpen(false);trigger.current?.focus();}}>{c[lang]}<span aria-hidden="true">{value===c.id?'•':''}</span></button>)}</div></div></div>;
}
