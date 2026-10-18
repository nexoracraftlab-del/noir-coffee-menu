export function Icon({ name, size = 20 }: { name: 'arrow' | 'search' | 'close' | 'info' | 'cup' | 'sun' | 'clock' | 'bean' | 'pin' | 'bot'; size?: number }) {
  const paths = {
    bot: <><path d="M5 10a7 7 0 0 1 14 0v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" fill="currentColor" stroke="none" /><rect x="8" y="9" width="8" height="6" rx="2" fill="var(--paper, #f7f3ec)" stroke="none" /><path d="M2 12v5M22 12v5" strokeWidth="2.5" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    arrow: <><path d="M18 6 6 18M6 7v11h11" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    cup: <><path d="M4 9h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM17 10h1a3 3 0 1 1 0 6h-1M7 3v2M11 2v3M15 3v2" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    bean: <><ellipse cx="12" cy="12" rx="7" ry="10" transform="rotate(35 12 12)" /><path d="M16 4c-8 2 0 14-8 16" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
