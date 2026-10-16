# Architecture and decisions

## Scope

An independent, client-side static menu; not an extension or rebuild of the Nexora website. No ordering, payments, login, database or paid APIs. The original portfolio remains untouched.

## Stack

- React + TypeScript: small reusable components and a typed product interface.
- Vite: local development and a compact static build. `base: './'` supports hosting from a subdirectory without hard-coded repository names.
- Plain CSS: design tokens, logical properties, responsive rules, local font, hover treatments, reduced-motion override. Tailwind would add little value to this bounded application.
- JSON: all product data is edited in one file; both language descriptions, ingredients and availability are explicit.
- No routing dependency: hash links move to menu/story/home; product detail is a dialog in the same page.
- `qrcode` and `tsx` are development tools, not shipped runtime code.

## State flow

`App` owns `lang`, `category`, `query`, `selected`, `infoOpen`. Filtering is a derived `useMemo` value; data is not duplicated in state. Opening a card passes the whole typed product to the product dialog. Closing clears the selection and restores focus to the trigger. Preference storage is optional and guarded for browsers where localStorage is unavailable.

## Accessibility

- Landmarks, heading hierarchy, skip link, named search field and button controls.
- Categories use `aria-pressed`; result count uses a polite status announcement.
- The entire card is one named button, avoiding nested interactive controls.
- Native modal dialog with `aria-labelledby`, initial focus on Close, explicit Tab/Shift+Tab loop, Escape, backdrop click and trigger-focus restoration.
- Modal background becomes inert through native `showModal()`; body scrolling is locked only while a modal is open.
- Touch targets are 44px or larger for core controls; product cards provide large interactive areas.
- Nonessential animations/transitions are removed under `prefers-reduced-motion`.
- No essential content depends on animation, hover or color alone. Unavailable status is written on the card and detail sheet.

## Assets and performance

- All runtime assets are local: no external font/CDN/image request is needed.
- WebP cards have 480px and 800px variants. Product images are lazy loaded with reserved dimensions; hero is high-priority.
- Images use a component fallback when loading fails; the broken URL is not retried indefinitely.
- The font is locally served and preloaded, with `font-display: swap` and Tahoma/system fallbacks.
- Production assets have Vite content hashes. No service worker caches obsolete prices.
- No analytics, cookies, remote API, client-side personal-data collection or form submission.

## Boundaries

The content is bundled into JavaScript; changing prices requires a rebuild. An editing dashboard, ordering, live inventory, per-product shareable URLs, offline cache, and server-driven localization are outside this first version. Shared stock photos illustrate related products and do not guarantee exact serving appearance. Do not treat sample ingredients as verified information for a real café.
