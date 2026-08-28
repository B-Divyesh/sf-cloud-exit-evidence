# Cloud Exit Evidence — repair handoff

Work order: `cloud-exit-evidence-repair-1`

Base verified: `a5600bf50e10e95621db2483d4967a4e17bc9391`
Repaired: 2026-08-28 (UTC)

## Release-blocking repair

The independent verifier correctly found that production is hosted by Azure Static Web Apps, while the candidate supplied Cloudflare/Netlify-style `dist/site/_headers`. Azure ignored that file, so the intended CSP, permissions/referrer policy, and cache policy were never served.

- Replaced `site/public/_headers` with Azure Static Web Apps' native `site/public/staticwebapp.config.json`. The generated deployment root now sets a self-only CSP with `frame-ancestors 'none'`, `Permissions-Policy`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY` globally.
- The same native configuration sets one-year immutable caching for fingerprinted `/assets/*` and both content-addressed hero images, plus `Cache-Control: no-cache` for `/sw.js` so service-worker updates are checked correctly.
- Added `scripts/verify-static-policy.mjs`, run by `npm test`, which fails unless the actual generated `dist/site/staticwebapp.config.json` contains each required header and cache rule.
- Replaced the nested `aside` with a presentational content block. Axe no longer reports `landmark-complementary-is-top-level`; the explanatory content and its visual treatment are unchanged.
- Extended Playwright coverage to require that specific axe rule to remain absent and to prove a service-worker-controlled reload succeeds offline after an online update reload on desktop and 390 px mobile.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

Deploy the static artifact at `dist/site/` to Azure Static Web Apps. Its root-level `staticwebapp.config.json` is part of the artifact and must not be excluded by deployment packaging. The release CLI is `target/release/cloud-exit-evidence`. Registry publishing remains intentionally out of scope; factory release automation owns credentials.

## Verification evidence

- Reproduced the release blocker against the prior live deployment with `curl -I`: it lacked CSP and Permissions-Policy, sent `Referrer-Policy: strict-origin-when-cross-origin`, and served assets and `/sw.js` with `public, must-revalidate, max-age=30`.
- Clean `npm ci`: completed; `npm audit --omit=dev`: **0 vulnerabilities**.
- `npm test`: pass.
  - Rust: formatting check, Clippy `-D warnings`, 6 unit tests, 2 CLI integration tests, and 1 doctest.
  - Site: 4 Vitest tests; generated Azure response-policy assertion passed.
  - Browser: 12 Playwright tests across desktop Chromium and 390×844 Chromium. They cover the intentional-gap audit, legal pages, keyboard skip link, axe serious/critical checks, absence of the verifier's complementary-landmark finding, service-worker offline reload/update behavior, and console errors.
- `npm run build`: pass; generated `target/release/cloud-exit-evidence` and `dist/site/`. Static budgets remain 6.88 KB initial app JS, 10.07 KB CSS, no fonts, and 28.4 KB mobile hero image.
- Lighthouse 13.4.1 against the built site with its mobile profile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty`: pass; 12 files, 76.7 KiB (21.1 KiB compressed). The resulting crate was unpacked into a clean temporary consumer, installed with `cargo install --path … --root … --locked`, and both top-level and `audit` help passed.

## Deployment verification

After the repair commit is deployed, verify the live root, legal pages, fingerprinted JS/CSS, hero images, and `/sw.js` with `curl -I`. Required values are:

- global: the CSP, permissions policy, `no-referrer`, `nosniff`, and `DENY` values in `dist/site/staticwebapp.config.json`;
- `/assets/*`, `/evidence-ledger.webp`, and `/evidence-ledger-mobile.webp`: `Cache-Control: public, max-age=31536000, immutable`;
- `/sw.js`: `Cache-Control: no-cache`.

Also compare the live `index.html`, `staticwebapp.config.json`, and `/sw.js` SHA-256 values to `dist/site/` after deployment. The final live result is recorded after push.

## Known boundaries

- The tool proves consistency against the supplied provider listing. It cannot discover files the provider omitted unless that exclusion is declared.
- It does not download, synchronize, version, or restore files. Users still need independent versioned media and restore tests.
- The browser demo compares names, sizes, and dates; SHA-256 and encrypted report generation remain CLI features.
- v1 deliberately supports native JSON/CSV and rclone-compatible listings instead of provider account adapters, keeping it credential-free and provider-neutral.
