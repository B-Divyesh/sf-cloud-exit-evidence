# Cloud Exit Evidence — polish 3 handoff

## Delivered

- Repaired every finding from adversarial reviews 1, 2, and 3 without changing the product class: the Rust command-line tool and its static documentation site remain local-first and offline-capable.
- Released repair commit `28865ae03f516f3940a876bf1f677121c091dbeb` (`fix: close review three evidence gaps`) to `origin/main`.
- Production was rechecked cold at <https://cloud-exit-evidence.sociobot.in/> after the pushed static deployment. It serves the repaired title, first-screen facts, direct demo, legal routes, and build label `polish-3`.
- Added the complete 21-claim inventory in `.factory/claims.json`. Each entry has one tagged observable Playwright test and was run individually from a clean clone.
- Updated the catalog description to: “Check offline cloud copies for missing, old, changed, or excluded files.”

## Verification

### Clean clone

Fresh clone: `/tmp/cloud-exit-evidence-polish3.y0mbmC` at `28865ae03f516f3940a876bf1f677121c091dbeb`.

```sh
npm ci
# every command in .factory/claims.json, run individually
npm test
npm run build
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

All 21 tagged claim commands passed. `npm test` passed: Rust formatting and Clippy, 6 Rust unit tests, 3 CLI integration tests, 1 doctest, 4 Vitest tests, static-response policy checks, and 56 Playwright tests (2 intentional desktop skips for the 390px-only assertion). The build produced `target/release/cloud-exit-evidence` and `dist/site`; packaging produced `target/package/cloud-exit-evidence-0.1.0.crate`.

### Production cold check

- `/opt/fleet/lib/verify-url.sh https://cloud-exit-evidence.sociobot.in/ .factory/evidence/verify-url-polish-3` passed: HTTP 200, title, `lang=en`, one `h1`, `main`, zero missing image alt text, zero unnamed buttons, and zero console errors. Output: `.factory/evidence/verify-url-polish-3/verify.json`.
- A fresh Playwright browser check covered `/`, `?demo=1`, `/privacy/`, `/terms/`, and a missing route at desktop and 390px. It verified title/canonical/Open Graph, route focus and `aria-live` announcements, legal links, branded HTTP 404, 44px visible targets, no console errors, same-origin runtime requests, service-worker offline demo reload, and Axe serious/critical = 0. Screenshots: `.factory/evidence/live-polish-3-home-390.png` and `.factory/evidence/live-polish-3-demo-390.png`.
- Live demo behavior was checked from a fresh browser context: `?demo=1` redirected to `/demo/`, showed the persistent sample banner, preserved the real-storage sentinel, reset only `demo:cloud-exit-evidence`, and discarded demo storage only when leaving demo mode. The first 844px contains the status, both missing paths, and the acknowledged exclusion.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.1s, TBT 20ms, CLS 0. Report: `.factory/evidence/lighthouse-polish-3-mobile.json`.

## Run and package

```sh
npm ci
npm test
npm run build
./target/release/cloud-exit-evidence --help
./target/release/cloud-exit-evidence demo
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

For the static site, use `npm run dev`; `npm run build` emits `dist/site/` for the static deployment.

## Remaining gaps

None. The finding-by-finding closure and evidence are in `.factory/polish-3.md`.
