# Deployment readiness

Publication approved by the owner on 2026-10-16. Independent repository: https://github.com/nexoracraftlab-del/noir-coffee-menu. Target URL: https://nexoracraftlab-del.github.io/noir-coffee-menu/. The main Nexora website is unchanged.

GitHub Pages uses the checked-in `.github/workflows/pages.yml` workflow. It installs locked dependencies, validates data, runs the five tests, checks TypeScript, builds `dist`, and deploys the artifact. The repository Pages source must be set to **GitHub Actions**. See the release report for the observed deployment result. QR files point to the public URL plus `#menu`, so a scan opens the menu section.

## Build once

From this project's directory:

```sh
pnpm install --frozen-lockfile
pnpm validate
pnpm test
pnpm build
```

Output: `dist/`. Deploy the **contents** so `index.html` is at the hosting root. The source directory itself is not a static production site.

## Cloudflare Pages

For a Pages project, use Git integration after the remote repository is approved, or upload the prebuilt `dist` directory through Direct Upload.

- Build command: `pnpm build` (install using the checked-in package manager and lockfile).
- Build output directory: `dist`.
- Root directory: this project's root.
- No environment secrets, Functions, database or backend are needed.
- Use a supported Node version (tested locally: Node 24.19.0).

Cloudflare currently also recommends Workers for new projects. Either static Pages or Workers Static Assets can serve this application's build. Review the current dashboard instructions when actually publishing.

References: [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [framework guides](https://developers.cloudflare.com/pages/framework-guides/).

## GitHub Pages alternative

After approval, create a **new independent** repository (suggested name: `noir-coffee-menu`), never upload the source over `nexora-website`.

Build the site and publish `dist/` via a GitHub Pages workflow or a dedicated deployment branch. Set Pages to the matching workflow/branch. `vite.config.ts` uses relative paths, so no brand site path needs to be edited. Do not upload `node_modules` or credentials. No workflow or remote settings were activated in this delivery.

## Verification after publishing

1. Open the final HTTPS URL and reload at `#menu`.
2. Verify all asset responses, Persian/English switching, search, categories and product detail.
3. Check actual mobile Safari/Chrome and the QR on a second device.
4. Update any public metadata with the real origin only after it exists.
5. Generate the QR using `pnpm qr https://THE-REAL-URL/`.
6. With separate approval, add a Nexora portfolio card named **NOIR Coffee — Interactive Digital Menu**, linked through “مشاهده دمو”. Do not describe the café as a real client.

## Rollback

Retain the previous built archive/version. If a menu update is incorrect, redeploy the previous static build or revert the source commit and rebuild. There is no backend migration or user data to restore.
