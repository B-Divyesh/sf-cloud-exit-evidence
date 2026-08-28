# Cloud Exit Evidence — polish 2 handoff

Repair commit: `05bb2568ae8ccfae0b988be9977b2ccf01502c3e`.

## Done

- Closed every finding in `.factory/review-1.md` and `.factory/review-2.md`; the precise mapping is in `.factory/polish-2.md`.
- The `/demo/` report now leads on phones, shows two real missing paths and one real open exclusion in the 390×844 viewport, and remains isolated under `demo:cloud-exit-evidence`.
- Browser, CLI fixture, example documentation, landing preview, and self-hosted SVG terminal evidence now describe the same sample.
- Added production-safe same-origin navigation focus, expanded claim inventory/tests, simplified untestable implementation wording, refreshed copy audit/catalog text, and retained the evidence-broadsheet visual system.
- Deployed `dist/site/` with `/opt/fleet/lib/deploy-static.sh cloud-exit-evidence dist/site`: deployment `9a76f0f0-6f26-4dcb-ac38-6a996addf87d`.

## Verification

- `npm test` — pass: Rust fmt, clippy, unit/integration tests, site unit tests, static response policy, Playwright desktop/mobile route/a11y/privacy/offline tests.
- `npm run build` — pass; `dist/site/` produced. Initial site JS is 7.39 kB gzip and CSS is 3.61 kB gzip.
- `npm run test:claims -- --grep @claim:` — pass; all 18 claim entries run their tagged observable test.
- Fresh clone `/tmp/cloud-exit-evidence-polish2.ovQx5S`: `npm ci`, every individual command from `.factory/claims.json`, `npm test`, `npm run build`, and `cargo package -p cloud-exit-evidence --locked --allow-dirty` all passed.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty` — ready-to-publish package check.
- Browser axe checks in `tests/browser/site.spec.ts` report no serious or critical findings for every route.
- Evidence: `.factory/evidence/demo-first-screen-390.png` (local) and `.factory/evidence/live-polish-2-demo-mobile.png` (cold live site).
- Live mobile Lighthouse: Performance 100, Accessibility 100, LCP 1.109 s, CLS 0; report at `.factory/evidence/lighthouse-mobile.json`.
- Cold live recheck passed at `https://cloud-exit-evidence.sociobot.in/`: home/title, one-click demo, `?demo=1`, 390px first-screen report, banner/reset sandbox, forward heading focus under `no-referrer`, legal routes, product 404, and no console errors.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:claims -- --grep @claim:
cargo package -p cloud-exit-evidence --locked --allow-dirty
/opt/fleet/lib/deploy-static.sh cloud-exit-evidence dist/site
```

## Known gaps

None. No AI feature was added because the brief’s local deterministic comparison job does not benefit from one.
