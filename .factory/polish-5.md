# Polish 5 — cumulative adversarial closure

Product repair commits: `9f1463e65e20a1c0c4e0cc5117b86f1fa63ee96a`, `d57986a0ca989310582f25fd537c5102135aaced`  
Deployment: `43b86823-a767-4dd4-ab20-f0e24d759776`  
Live URL checked cold: <https://cloud-exit-evidence.sociobot.in/>

Every finding from reviews 1–5 is closed below. The final clean clone was `/tmp/cloud-exit-evidence-polish5-final.k2cSlL` at `d57986a`; all 25 claim commands passed separately.

Common visual/live evidence: [home at 390 px](evidence/live-polish-5-home-390.png), [sample-only demo at 390 px](evidence/live-polish-5-demo-390.png), [Start for real destination](evidence/live-polish-5-start-real-390.png), [offline demo](evidence/live-polish-5-offline-demo-390.png), [live replay JSON](evidence/live-polish-5.json), and [URL verifier](evidence/verify-url-polish-5/verify.json).

## Review 1

| Finding id | Change made | Evidence |
| --- | --- | --- |
| R1-1 | Maintained a complete claim inventory and added `demo-sample-only`; every id has exactly one tagged outcome test. | 25-command clean-clone replay; `.factory/claims.json`; live route/privacy replay. |
| R1-2 | Kept one-click `/demo/` and `?demo=1`, the banner, reset/exit, CLI demo, bundled sample, and recording; removed every real browser input. | `@claim:demo-sample-report`, `@claim:demo-isolation`, `@claim:demo-sample-only`, `@claim:cli-demo`; live demo screenshot and URL. |
| R1-3 | Preserved real demo/legal URLs, focus and announcement handling, Back/Forward behavior, and the designed 404. | `@claim:routing-focus`; live `/missing-polish-5` returned 404; live replay JSON. |
| R1-4 | Preserved the five-word job headline, audience sentence, sample action, outcome note, and privacy/offline/price facts. | `.factory/copy-audit.md`; `@claim:demo-first-screen`; live home screenshot and `/`. |
| R1-5 | Preserved route titles, descriptions, canonical/OG/Twitter metadata, icons, shared chrome, legal links, factory credit, and build id. | Route metadata/Axe tests; `verify-url-polish-5/verify.json`; live route replay. |
| R1-6 | Kept public wording on check, file list, folder, and command-line tool; the demo now has no editable/error vocabulary. | `sample-only demo exposes no editable file workflow or legacy error terms`; copy audit; live `/demo/`. |
| R1-7 | Listed and tested every remaining functional landing and README statement. | 25 claim entries/tags; clean-clone replay; live privacy interception. |

## Review 2

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept the result-first mobile report; the two missing paths and exclusion remain above 844 px after the header fix. | `@claim:demo-first-screen`; local and live demo screenshots; live `/demo/`. |
| F-2-2 | Kept browser sample, CLI sample, example README, and self-hosted transcript on the same two gaps and exclusion. | `@claim:cli-demo`; live `/` transcript; home screenshot. |
| F-2-3 | Kept destination-marked heading focus under `no-referrer`, including forward and Back navigation. | `@claim:routing-focus`; live replay JSON; live `/` → `/demo/`. |
| F-2-4 | Preserved read-only CLI checks with before/after input hashes and inventories. | `@claim:cli-read-only`; clean-clone replay; live README at `/`. |
| F-2-5 | Preserved recorded acknowledgement evidence and exact 0/2/3 exits. | `@claim:cli-acknowledgement`, `@claim:cli-exit-codes`; clean-clone replay; live install documentation. |
| F-2-6 | Kept encryption wording limited to the verified passphrase round trip. | `@claim:encrypted-report`; live `/privacy/`; route screenshot evidence. |
| F-2-7 | Preserved same-origin checks across every route and no-account coverage. | `@claim:site-no-third-party-runtime`, `@claim:no-account`; live request origin list; `/privacy/`. |
| F-2-8 | Kept each README exit-code outcome as a short separate sentence. | `.factory/copy-audit.md`; live source link from `/`. |
| F-2-9 | Kept public terms consistent: check, file list, folder, and command-line tool. | Copy audit; sample-only vocabulary test; live `/demo/` and `/`. |

## Review 3

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Preserved tested offline and free facts in the first screen. | `@claim:offline-reload`, `@claim:free-to-use`; live home and offline screenshots. |
| F-3-2 | Preserved duplicate rejection in JSON, CSV, and rclone lists. | `@claim:duplicate-paths`; clean-clone replay; live `/` method copy. |
| F-3-3 | Preserved distinct, stable redaction labels across repeated runs. | `@claim:cli-redaction`; clean-clone replay; live README link. |
| F-3-4 | Preserved exact `--fail-on exceptions` and `--fail-on never` behavior. | `@claim:cli-fail-on`; clean-clone replay; live install section. |
| F-3-5 | Kept unsupported unreadable-result wording removed. | Copy audit; `@claim:cli-formats-readiness`; live `/`. |
| F-3-6 | Preserved free-under-MIT wording and no-purchase behavior. | `@claim:free-to-use`, `@claim:mit-license`; live `/terms/` and home screenshot. |
| F-3-7 | Preserved the narrow no-network-client and no-usage-data wording. | `@claim:cli-no-network`; live `/privacy/`; route replay. |
| F-3-8 | Preserved outcome-level assertions for isolation, CLI demo, formats, redaction, links, acknowledgement, and encryption; added direct file-access instrumentation. | Relevant `@claim:*` tests plus `@claim:demo-sample-only`; 25-command replay; live demo screenshot. |
| F-3-9 | Preserved consistent check/command-line wording and explicit failure-mode descriptions. | Copy audit; `@claim:cli-fail-on`; live `/`. |
| F-3-10 | Preserved 44 px targets and added a bounds test so every mobile header link is fully visible. | `mobile interactive targets…`, `mobile header links fit…`; live home/demo screenshots. |
| F-3-11 | Preserved a 1 × 1 px polite route announcement with no visible layout shift. | `@claim:routing-focus`; live replay JSON; live `/demo/`. |
| F-3-12 | Preserved distinct Copy install command and Copy demo command controls. | Browser route suite; live Start-for-real screenshot and `/`. |
| F-3-13 | Preserved explicit unencrypted-terminal guidance. | `@claim:encrypted-report`; copy audit; live source documentation. |
| F-3-14 | Kept internal factory publishing language out of the public README. | Copy audit/source check; live source link from `/`. |

## Review 4

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Preserved landing-first precaching of the direct demo. | `@claim:offline-reload`; live offline screenshot; cold live landing → offline `/demo/`. |
| F-4-2 | Removed the editable demo workflow entirely, so the old manifest/audit/fixture/destination errors cannot appear. | `sample-only demo exposes no editable file workflow or legacy error terms`; `@claim:demo-sample-only`; live `/demo/`. |
| F-4-3 | Preserved clean-environment no-account behavior for help, demo, and audit. | `@claim:cli-no-account`; clean-clone replay; live install copy. |
| F-4-4 | Preserved the no-`dist/` production build claim. | `@claim:build-artifacts`; `npm run build`; live deployment. |
| F-4-5 | Preserved first screen → product preview → steps → limits/privacy → install order. | `landing shows the sample product before method and limitations sections`; live home screenshot and `/`. |
| F-4-6 | Preserved the exact, tested Terms date without a future change-record promise. | `@claim:terms-effective-date`; live `/terms/`; route replay. |

## Review 5

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Removed the file-list editor, folder picker, `FileList` reader, and real-input event path from `/demo/`. The demo now renders constants from the bundle only. Reset touches only `demo:` state; Start for real removes it and visibly opens `/#install`. | `@claim:demo-sample-only` injects the former inputs and a private file, observes zero `File`/`FileList` reads, unchanged sample output, and isolated storage. Live replay repeats the attack with zero reads; see live demo and Start-for-real screenshots. |

## Additional final visual check

| Finding id | Change made | Evidence |
| --- | --- | --- |
| P5-mobile-nav | Changed the 390 px header to two intentional rows so “Demo” is never clipped after navigation. | `mobile header links fit without clipping or horizontal scrolling`; live home screenshot; live bounds in `live-polish-5.json`. |

## Final verification

- Final clean clone: `/tmp/cloud-exit-evidence-polish5-final.k2cSlL` at `d57986a`; all 25 claim commands passed separately.
- `npm test`: 6 Rust unit, 3 Rust integration, 1 doctest, 4 Vitest, 67 Playwright passes, 3 intentional viewport skips, static policy, and build-artifact test all passed.
- `npm run build`: release binary plus `dist/site/`; site bundles are 4.15 kB main JS, 1.57 kB navigation JS, and 12.11 kB CSS uncompressed.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty`: 13 files, 78.3 KiB (21.2 KiB compressed), verified.
- Live Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Live routes, metadata, 404, focus, storage, privacy, offline, screenshots, and headers passed with zero console errors and zero serious/critical Axe findings.
