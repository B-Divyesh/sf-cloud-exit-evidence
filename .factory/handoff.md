# Cloud Exit Evidence — polish 4 handoff

## Outcome

All cumulative adversarial-review findings are closed. The functional repair is commit `30037c37a82c7c74ee338fb31bc2f73a77d37d00` (`fix: close review four regressions`), pushed to `main` before deployment.

Static deployment `5f20dc26-fa0a-4578-ac11-108fbeb96079` completed on 2026-08-28 at:

- <https://cloud-exit-evidence.sociobot.in/>
- <https://cloud-exit-evidence.sociobot.in/demo/>

The repair makes the demo work offline after a first landing-page visit, removes old demo-error vocabulary, adds the missing claim coverage, restores the required landing order and limits section, and replaces the untestable Terms commitment with a checked effective date. The warm-paper evidence-broadsheet identity remains unchanged.

## How to run and verify

```sh
npm ci
npm test
npm run build
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

Run every command named in `.factory/claims.json` separately. The browser claims use the direct `/demo/` entry and the command-line claims create their own temporary fixtures. `npm run build` produces the release command at `target/release/cloud-exit-evidence` and the deployable static site at `dist/site/`.

Deploy the static site with the work-order configuration:

```sh
npm ci && npm run build:site
/opt/fleet/lib/deploy-static.sh cloud-exit-evidence dist/site
```

## Exact verification evidence

- Root `npm test`: passed — Rust fmt/clippy, 6 Rust unit tests, 3 CLI integration tests, 1 doctest, 4 Vitest tests, static response-policy checks, 64 Playwright checks passed, and 2 intentionally viewport-inapplicable checks skipped. The build-artifact claim also passed.
- Root `npm run build`: passed — release binary and `dist/site/` produced.
- Root `cargo package -p cloud-exit-evidence --locked --allow-dirty`: passed.
- Clean clone `/tmp/cloud-exit-evidence-polish4.6j9J0G` at `30037c37a82c7c74ee338fb31bc2f73a77d37d00`: `npm ci`, all 24 `.factory/claims.json` commands run separately, and a complete `npm test` all passed. Its final Playwright status was `passed` with no failed tests.
- Claim registration audit: each of the 24 manifest IDs has exactly one `@claim:<id>` tagged test.
- Production basic check: [`verify.json`](evidence/verify-url-polish-4/verify.json) — HTTP 200, title `Cloud Exit Evidence — Check an offline copy`, `lang=en`, one h1/main, no missing image alt or unlabeled button, and no console errors.
- Production cold browser replay: [`live-polish-4.json`](evidence/live-polish-4.json) — landing-first offline demo, `?demo=1`, heading focus, demo errors, routes, designed 404, metadata, same-origin runtime traffic, and serious/critical Axe checks all pass. Screens: [`home 390`](evidence/live-polish-4-home-390.png), [`demo 390`](evidence/live-polish-4-demo-390.png), and [`offline demo 390`](evidence/live-polish-4-offline-demo-390.png).
- The literal landing-first offline regression is also recorded locally at [`offline-demo-from-landing-390.png`](evidence/offline-demo-from-landing-390.png).
- Live Lighthouse mobile: [`lighthouse-polish-4-mobile.json`](evidence/lighthouse-polish-4-mobile.json) — Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.6 s, LCP 1.6 s, TBT 10 ms, CLS 0.

## Known gaps and next steps

None. The CLI package is ready for factory-owned publication; do not publish from this workspace.
