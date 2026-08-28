# Cloud Exit Evidence — polish 1 handoff

Repair code commit: `a4086b73f687c8c5fe967351eb5bbff3b20f9339` (repairs candidate `dc0db2b762ba3e57822f83d46200f0c1ac0a35e7` against review `10fe864445a99fb3ac25ed3187f0075784cd675f`).

## Delivered

- Rewrote the first screen in plain language and retained the product's warm-paper evidence-broadsheet identity.
- Added `/?demo=1` → `/demo/`, immediate intentional-gap results, persistent isolated-demo banner, Reset demo, and Start for real.
- Added the bundled `cloud-exit-evidence demo` command, root and crate-packaged sample data, and a self-hosted terminal recording.
- Added claim inventory, claim-tagged browser/CLI evidence, demo documentation, copy audit, metadata/social assets, shared legal chrome, direct routes, focus restoration, and Azure-branded 404 response override.
- Added 1200×630 social image and 180px touch icon derived from the existing original ledger art.

## Verification evidence

Fresh clone: `/tmp/cloud-exit-evidence-clean2-DfIaI6` from commit `a4086b7`.

```sh
npm ci
npm test
npm run build
cargo package -p cloud-exit-evidence --locked --allow-dirty
npm run test:claims -- --grep @claim:
```

All commands passed. `npm test` passed Rust formatting, Clippy, 6 Rust unit tests, 3 CLI integrations, 1 doctest, 4 Vitest tests, response-policy checks, and 40 Playwright desktop/390px tests. The fresh-clone Playwright result is `status: passed` in `test-results/.last-run.json`.

`npm run build` produces `target/release/cloud-exit-evidence` and `dist/site/`. The site build reports 7.77 KB gzip JS and 3.41 KB gzip CSS. `cargo package` verified the packaged crate after compiling its generated tarball.

Accessibility is checked by Axe in all five routes at desktop and 390px; no serious or critical violations were found. Browser tests cover skip-link keyboard focus, visible route-heading focus after navigation, direct demo routing, offline reload, demo reset isolation, request interception, and console errors. The local screenshots are:

- `.factory/evidence/home-desktop.png`
- `.factory/evidence/demo-mobile.png`
- `.factory/evidence/live-demo-mobile.png`

Every manifest entry in `.factory/claims.json` has exactly one `@claim:` test definition and was covered by the clean-clone claim run.

## Run and deploy

```sh
npm ci
npm test
npm run build
# deploy dist/site/ with dist/site/staticwebapp.config.json
```

Publish the CLI with the factory-owned registry credentials only, after `cargo package -p cloud-exit-evidence --locked`.

## Deployment and cold-live recheck

Deployed `dist/site/` to Azure Static Web App `sf-cloud-exit-evidence` (production) with the Static Web Apps CLI. A fresh 390px browser context then checked <https://cloud-exit-evidence.sociobot.in/?demo=1>: it redirected to `/demo/`, displayed the **Not ready** sample report and demo banner, made 9 same-origin requests, and recorded zero console errors. Reset demo restored only `demo:cloud-exit-evidence`; Start for real removed that key and returned home.

Cold HTTP checks returned: `/` 200 with the new landing title/copy; `/demo/` 200 with `Demo — Cloud Exit Evidence`; `/privacy/` and `/terms/` 200; `/missing-review-route` 404 with `Not found — Cloud Exit Evidence` and the product 404 page. No known gaps remain.
