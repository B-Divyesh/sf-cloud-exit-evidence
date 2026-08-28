# Polish 1 — review finding closure

Repair code commit: `a4086b73f687c8c5fe967351eb5bbff3b20f9339`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| 1 — claims cannot be independently verified | Added `.factory/claims.json` with 12 observable claims and one tagged test definition per claim. Added browser privacy/offline/demo/routing tests and CLI format, local-only, redaction, encryption, validation/link, demo, and license tests. | Fresh-clone `npm run test:claims -- --grep @claim:` passed; all tags are in `tests/browser/site.spec.ts`. |
| 2 — one-click demo and CLI demo missing | Hero now opens `/?demo=1`, which enters `/demo/`; direct demo immediately renders the three-file intentional-gap report. The banner offers Reset demo and Start for real. Added separate `demo:` storage and `cloud-exit-evidence demo` using bundled sample files in a new temporary directory. | `@claim:demo-sample-report`, `@claim:demo-isolation`, `@claim:cli-demo`; [.factory/evidence/demo-mobile.png](evidence/demo-mobile.png). |
| 3 — `/demo` and product 404 missing | Added physical `/demo/` and `404.html`, plus Azure `responseOverrides` to rewrite 404 responses to the branded record page. Routes expose titles, canonical metadata, focus/announcement behavior, and Back navigation. | `@claim:routing-focus`; Axe/structure tests cover `/demo/` and `/404.html`. |
| 4 — first-screen copy | Replaced the metaphor with “Check your offline cloud copy.” Added the specified audience sentence, direct “Try it with sample data” action, next-step text, and three short facts. | Landing copy audit in `.factory/copy-audit.md`; [.factory/evidence/home-desktop.png](evidence/home-desktop.png). |
| 5 — metadata and skeleton | Added route-specific titles, canonical, OG/Twitter metadata, 1200×630 social art, SVG/Apple icons, shared header/footer, Privacy/Terms, Param Factory attribution, build id, sitemap demo route, and response-policy verification. | Structure/Axe tests for home, demo, privacy, terms, and 404; `npm run test:response-policy`. |
| 6 — jargon and misleading labels | Replaced editorial controls and labels with file list, folder, sample audit, sample gap report, and direct result language. The sample action now genuinely opens the report. | Browser sample-report assertion; copy audit. |
| 7 — unlisted claims | Removed unsupported promises where practical and inventory-tested all remaining visitor-facing functional claims. | `.factory/claims.json`; clean-clone claim run. |

## Additional review checks

- The 390px layout stacks the evidence report, keeps controls at least 44px high, and keeps the primary demo action before the hero image.
- Offline direct-demo reload, no upload/third-party requests, and no CLI network client code are claim tests.
- The CLI packaging test now succeeds because the demo manifest is shipped inside the crate package.

## Live recheck

Deployed `dist/site/` to Azure Static Web App `sf-cloud-exit-evidence`. A fresh 390px live visit to `/?demo=1` redirected to `/demo/`, showed the immediate report/banner, made only same-origin requests, and had zero console errors. Live Reset demo and Start for real passed. Live HTTP checks: `/` 200, `/demo/` 200, `/privacy/` 200, `/terms/` 200, and `/missing-review-route` 404 with the branded page. Screenshot: `.factory/evidence/live-demo-mobile.png`.
