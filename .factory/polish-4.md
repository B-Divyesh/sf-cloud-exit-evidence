# Polish 4 — cumulative adversarial closure

Repair commit: `30037c37a82c7c74ee338fb31bc2f73a77d37d00`  
Static deployment: `5f20dc26-fa0a-4578-ac11-108fbeb96079`  
Live URL checked cold: <https://cloud-exit-evidence.sociobot.in/>. Every “live” reference below means that production URL (or its named path) was opened in the final cold browser replay recorded at `.factory/evidence/live-polish-4.json`.

Every listed finding is closed below. “Clean-clone claim replay” means every one of the 24 commands in `.factory/claims.json` passed separately from `/tmp/cloud-exit-evidence-polish4.6j9J0G` at the repair commit.

## Review 1

| Finding id | Change made | Evidence |
| --- | --- | --- |
| R1-1 | Kept the complete claims inventory and added the missing offline, command-line account, build-artifact, and Terms-date claims. | Clean-clone claim replay; all 24 IDs occur exactly once in their tagged test. |
| R1-2 | Kept direct `/demo/` and `?demo=1`, isolated `demo:` storage, banner, reset/exit controls, bundled CLI sample, and self-hosted recording. | `@claim:demo-sample-report`, `@claim:demo-isolation`, `@claim:cli-demo`; live `/demo/`. |
| R1-3 | Kept direct routes, branded 404, per-route title/metadata, heading focus, Back/Forward behavior, and the polite announcement. | `@claim:routing-focus`; route/Axe suite; live missing-route check. |
| R1-4 | Retained the plain job headline, audience sentence, direct sample action, next-step note, and three tested facts. | `.factory/copy-audit.md`; `@claim:offline-reload`; live home cold check. |
| R1-5 | Kept canonical, Open Graph, Twitter, icon, legal, footer, sitemap, and response-policy coverage. | Route metadata/Axe tests; `npm run test:response-policy`; live route checks. |
| R1-6 | Removed stale developer vocabulary from all demo errors and active-state feedback. | Browser test `demo validation errors use the same plain language as its controls`; live `/demo/` invalid-input check. |
| R1-7 | Added an observable claim or removed/narrowed every visitor-reliant functional statement. | 24-entry `.factory/claims.json`; clean-clone claim replay. |

## Review 2

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Preserved the result-first compact demo layout, including the two missing paths and exclusion before the 390px fold. | `@claim:demo-first-screen`; `.factory/evidence/demo-first-screen-390.png`; live 390px demo check. |
| F-2-2 | Preserved one bundled fixture across browser, CLI, example, and self-hosted terminal transcript. | `@claim:cli-demo`; live landing transcript check. |
| F-2-3 | Preserved destination-marked heading focus under `no-referrer`. | `@claim:routing-focus`; live header Demo and Back checks. |
| F-2-4 | Preserved a before/after hash and inventory assertion for ordinary checks. | `@claim:cli-read-only`. |
| F-2-5 | Preserved exact acknowledged-exclusion output and 0/2/3 exit assertions. | `@claim:cli-acknowledgement`; `@claim:cli-exit-codes`. |
| F-2-6 | Kept encryption wording at the observable supplied-passphrase behavior. | `@claim:encrypted-report`; README and Privacy checks. |
| F-2-7 | Preserved all-route same-origin runtime checks and no-account demo coverage. | `@claim:site-no-third-party-runtime`; `@claim:no-account`. |
| F-2-8 | Kept exit outcomes as three short sentences. | README review; `.factory/copy-audit.md`. |
| F-2-9 | Kept public terminology on check, file list, folder, and command-line tool. | Copy audit; demo error regression test; live demo error check. |

## Review 3

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Made the first-screen offline fact true from a landing-only first visit and retained the free fact. | `@claim:offline-reload`; `.factory/evidence/offline-demo-from-landing-390.png`; live cold offline replay. |
| F-3-2 | Preserved duplicate rejection for JSON, CSV, and rclone lists. | `@claim:duplicate-paths`. |
| F-3-3 | Preserved stable, distinct path-redaction labels. | `@claim:cli-redaction`. |
| F-3-4 | Preserved documented `--fail-on exceptions` and `--fail-on never` outcomes. | `@claim:cli-fail-on`. |
| F-3-5 | Kept unsupported unreadable-result wording removed. | README copy review; `@claim:cli-formats-readiness`. |
| F-3-6 | Preserved the free-under-MIT claim and no-purchase assertion. | `@claim:free-to-use`; Terms and landing checks. |
| F-3-7 | Preserved the narrow, observable no-network-client/no-usage-data wording. | `@claim:cli-no-network`; Privacy check. |
| F-3-8 | Preserved strengthened outcome-level claim assertions and expanded the offline assertion to the landing-first path. | Clean-clone claim replay; `@claim:offline-reload`. |
| F-3-9 | Removed remaining old vocabulary from failures, not only happy-path labels. | Browser demo-error test; live invalid-input check. |
| F-3-10 | Preserved 44px visible target coverage at 390px. | `mobile interactive targets are at least 44 by 44 pixels`; live 390px crawl. |
| F-3-11 | Preserved the 1px visually hidden polite announcement. | `@claim:routing-focus`; live forward/back check. |
| F-3-12 | Preserved distinct, result-naming copy controls. | Browser route/copy control checks; live home check. |
| F-3-13 | Preserved explicit unencrypted-terminal guidance. | README review; `@claim:encrypted-report`. |
| F-3-14 | Kept factory-internal publication wording out of the public README. | README review; `.factory/copy-audit.md`. |

## Review 4

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | `sw.js` v2 precaches the demo document and built entry assets during a landing visit; same-origin cached modules now safely ignore host `Vary: Origin` differences. The exact fact and claim now say “Demo works offline after first visit.” | `@claim:offline-reload`; `.factory/evidence/offline-demo-from-landing-390.png`; live landing-first offline `/demo/` check. |
| F-4-2 | Replaced every cited error with “Add a file list before checking,” “This file list is not valid JSON…,” “Select a folder or load the sample files,” and “Checking files…”. | Browser test `demo validation errors use the same plain language as its controls`; live `/demo/` error check. |
| F-4-3 | Added `cli-no-account`, with a clean-environment help/demo/check test that passes no credentials or home directory and observes no account/sign-in prompt. | `@claim:cli-no-account`; clean-clone claim replay. |
| F-4-4 | Added `build-artifacts`, which deletes `dist/`, runs `npm run build`, and verifies the release binary and `dist/site/index.html`. | `@claim:build-artifacts`; `npm run test:build-artifacts`; clean-clone claim replay. |
| F-4-5 | Moved the live sample result directly after the first screen, then kept How it works, a dedicated limits/privacy section, and install. | Browser test `landing shows the sample product before method and limitations sections`; live home check. |
| F-4-6 | Replaced the untestable change-record commitment with a marked, exact Terms update date and added a claim. | `@claim:terms-effective-date`; live `/terms/` check. |

## Final verification

- `npm test`: Rust formatting/lints/unit/integration/doctest, Vitest, static-policy, full Playwright/Axe suite, and build-artifact claim all pass.
- `npm run build`: release command-line binary and `dist/site/` pass.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty`: package verification passes.
- Clean-clone replay: all 24 claim commands pass separately.
- Production checks, Lighthouse, `verify-url.sh`, and live route/offline rechecks are recorded in `.factory/handoff.md`.
