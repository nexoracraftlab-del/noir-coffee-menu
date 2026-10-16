# NOIR Coffee — Interactive Digital Menu

A Persian-first, bilingual café menu built by **Nexora**. An independent portfolio project with 28 fictional products, responsive category browsing, instant search, and accessible product details.

**Demo disclosure:** NOIR is an imagined café. Products, prices, availability and opening hours are illustrative. There is no real location, ordering, checkout, account system, or payment integration. Photographs are illustrative and may be shared by related products.

## Quick start

Requirements: Node.js 22.12+ (tested with 24.19.0) and pnpm 11.25.0. Install pnpm using the official [installation guide](https://pnpm.io/installation) if it is not already installed.

Run these commands **inside this project directory**:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed by Vite. Do not open `index.html` directly from the file system: the source uses TypeScript and must be served/built.

```sh
pnpm typecheck       # Strict TypeScript checking
pnpm test            # Five search/filter/locale behavior tests
pnpm validate        # Data, images, uniqueness, licenses and required assets
pnpm build           # TypeScript check + production build
pnpm preview         # Serve the production build locally
```

`dist/` contains the standalone static website. No backend, environment secrets or external API is required. React and React DOM are the only runtime dependencies. pnpm permits the official esbuild package's install script through `pnpm-workspace.yaml`.

## Edit the menu

Edit `src/data/products.json`. All prices are integers in **toman**, not rial. Rebuild after changes. For example:

```json
{
  "id": "hot-01",
  "slug": "classic-latte",
  "nameFa": "لاته کلاسیک",
  "nameEn": "Classic latte",
  "descriptionFa": "اسپرسوی دبل و شیر بخاردیده؛ نرم، متعادل و آشنا.",
  "descriptionEn": "Double espresso with silky steamed milk. Smooth and familiar.",
  "price": 145000,
  "category": "hot",
  "image": "latte",
  "available": true,
  "featured": true,
  "tags": [],
  "ingredientsFa": "اسپرسو، شیر لبنی، فوم شیر",
  "ingredientsEn": "Espresso, dairy milk, milk foam"
}
```

- IDs and slugs must be unique. Slugs are stable editing identifiers; this version does not implement product URLs.
- Categories: `hot`, `cold`, `signature`, `tea`, `dessert`, `breakfast`.
- `image` is the local file stem, without extension. Supply both `public/images/STEM-480.webp` and `STEM-800.webp` (5:4 aspect ratio recommended).
- `available: false` keeps a product discoverable and displays its unavailable status; it does not remove the card.
- `featured: true` displays the NOIR selection badge. `tags: ["new"]` displays the New badge (unavailability takes precedence).
- Search covers the Persian/English names and short descriptions. Categories and query combine. Arabic/Persian Yeh and Kaf, diacritics, spaces and half spaces are normalized.
- Update `src/copy.ts` for general UI text and café information. Keep the fictional/demo disclosure until actual business details have been supplied.

After editing, run `pnpm validate && pnpm test && pnpm build`.

## Project structure

```text
src/
  App.tsx                  Page composition and small UI state
  copy.ts                  Persian / English interface copy
  menu.ts                  Category definitions, filtering and formatting
  menu.test.ts             Search, category and price tests
  types.ts                 Product schema
  components/
    Icon.tsx               Small local SVG icon set
    MenuImage.tsx          Responsive image + error fallback
    Modal.tsx              Native dialog, focus trap and focus restoration
    ProductCard.tsx        Reusable menu card
  data/products.json       28 editable sample products
  styles.css               Responsive design and motion preferences
public/
  images/                  Local WebP images (480 / 800px + hero)
  fonts/                   Local Vazirmatn and OFL license
  favicon.svg              Custom NOIR monogram
scripts/
  validate.ts              Integrity checks
  qr.mjs                   QR generation for the approved final URL
docs/
  ARCHITECTURE.md
  DEPLOYMENT.md
  ASSETS.md
  image-sources.json
  VALIDATION.md
```

## Design & architecture

Warm ivory, espresso ink, editorial spacing, a serif NOIR wordmark, locally served Vazirmatn, and quiet image interactions. Two cards per row on narrow screens, three on desktop. Category buttons scroll horizontally without widening the page. Product details become a bottom sheet on mobile.

React state is limited to language, category, query and the open dialog. No router, UI framework, state library or Tailwind dependency is required. Native semantic controls and `<dialog>` handle the interaction. Only language preference is stored locally; the app collects or transmits no visitor data. Browser/web-server access logs remain subject to the selected host.

See [architecture](docs/ARCHITECTURE.md), [deployment](docs/DEPLOYMENT.md), [image/font licensing](docs/ASSETS.md), and [actual validation results](docs/VALIDATION.md).

## Deployment & QR

Public menu: [NOIR Coffee](https://nexoracraftlab-del.github.io/noir-coffee-menu/).

The owner approved publication in the independent [noir-coffee-menu repository](https://github.com/nexoracraftlab-del/noir-coffee-menu). The included GitHub Pages workflow validates and builds every push to `main`, then deploys `dist/`. The main Nexora website is unchanged.

The production `dist/` can be uploaded to a static host. Its asset paths are relative, so it also supports a project subdirectory. See deployment instructions before publishing.

Once the final URL exists:

```sh
pnpm qr https://YOUR-APPROVED-FINAL-URL/
```

The script writes `docs/qr.svg` and `docs/qr.png` with a four-module quiet zone. Test the final code using an actual phone before printing. The production QR is included as [PNG](docs/qr.png) and [SVG](docs/qr.svg). It opens `https://nexoracraftlab-del.github.io/noir-coffee-menu/#menu` directly in the menu section. See [the QR guide](docs/QR.md).

## Credits & usage

Designed & Developed by [Nexora](https://nexoracraftlab-del.github.io/nexora-website/).

Source code/design copyright Nexora. No open-source license for the application source is granted in this delivery. Photographs remain subject to the [Pexels License](https://www.pexels.com/license/); Vazirmatn is licensed under SIL OFL 1.1. See `docs/ASSETS.md` and the included font license.
