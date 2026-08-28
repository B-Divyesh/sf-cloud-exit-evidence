# Polish 6 — cumulative adversarial closure

Product repair commits: `014bdaf79e6533df377699566615c8c0be1eae2f`, `a75fb8a3beeb91c3d8ab5b62106aff3b4f6c56d9`  
Static deployment: `2a4b45df-c2ad-45f3-9508-5520a546d426`  
Live URL checked cold: <https://cloud-exit-evidence.sociobot.in/>

Every finding from reviews 1–6 is closed below. The final clean clone was `/tmp/cloud-exit-evidence-polish6-final.VUUWmY` at `a75fb8a`; all 25 claim commands passed separately. Common production evidence is the [cold replay](evidence/live-polish-6.json), [home at 390 px](evidence/live-polish-6-home-390.png), [demo at 390 px](evidence/live-polish-6-demo-390.png), [offline demo](evidence/live-polish-6-offline-demo-390.png), [URL verifier](evidence/verify-url-polish-6/verify.json), and [mobile Lighthouse report](evidence/lighthouse-polish-6-mobile.json).

## Review 1

| Finding id | Change made | Evidence |
| --- | --- | --- |
| R1-1 | Maintained the 25-entry claim inventory and exactly one outcome test for every id. | Final clean-clone claim replay; `.factory/claims.json`; live request/storage replay. |
| R1-2 | Preserved one-click `/demo/` and `?demo=1`, the sample-only banner/reset/exit controls, isolated `demo:` key, CLI demo, bundled fixture, and recording. All demo exits now discard the key. | `@claim:demo-sample-report`, `@claim:demo-isolation`, `@claim:demo-sample-only`, `@claim:cli-demo`; live demo screenshot and cold replay. |
| R1-3 | Preserved real demo/legal routes, exact titles, route focus and announcement, Back/Forward behavior, and the designed HTTP 404. | `@claim:routing-focus`; route metadata/Axe tests; live `/missing-polish-6` returned 404. |
| R1-4 | Preserved the five-word job headline, audience sentence, one-click sample action, immediate result note, and privacy/offline/price facts. | Browser test `landing first screen states the job…`; copy audit; live home screenshot. |
| R1-5 | Preserved route descriptions, canonical/OG/Twitter metadata, icons, shared header/footer, legal links, factory credit, and build id. | Browser route metadata matrix; `npm run test:response-policy`; live route replay. |
| R1-6 | Preserved plain wording on check, file list, folder, and command-line tool; the sample remains free of the old editable error path. | `sample-only demo exposes no editable file workflow…`; copy audit; live `/demo/`. |
| R1-7 | Kept every visitor-reliant behavior in the claim inventory or removed unsupported wording. | 25 clean-clone claim commands; copy audit; live policy replay. |

## Review 2

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Preserved the result-first phone report; status, both missing paths, and the exclusion fit within 390 × 844. | `@claim:demo-first-screen`; live demo screenshot and recorded bounds in the cold replay. |
| F-2-2 | Preserved one fixture across browser, CLI, example README, and self-hosted transcript. | `@claim:cli-demo`; landing transcript check; live home. |
| F-2-3 | Preserved destination-marked heading focus under `no-referrer`, including forward and Back. | `@claim:routing-focus`; live replay `routing`. |
| F-2-4 | Preserved the before/after hash and inventory proof that ordinary checks do not alter supplied inputs. | `@claim:cli-read-only`; final clean clone. |
| F-2-5 | Preserved exact acknowledgement content and 0/2/3 exit outcomes. | `@claim:cli-acknowledgement`, `@claim:cli-exit-codes`; final clean clone. |
| F-2-6 | Kept encryption wording limited to the verified supplied-passphrase behavior. | `@claim:encrypted-report`; Privacy route; final clean clone. |
| F-2-7 | Preserved all-route same-origin runtime checks and no-account demo coverage. | `@claim:site-no-third-party-runtime`, `@claim:no-account`; live origin list contains only the product origin. |
| F-2-8 | Kept every public sentence within 22 words. | `.factory/copy-audit.md`; README review. |
| F-2-9 | Kept public terminology consistent: check, file list, folder, and command-line tool. | Copy audit; sample-only vocabulary test; live home/demo. |

## Review 3

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Preserved tested offline and free facts in the first screen. | `@claim:offline-reload`, `@claim:free-to-use`; live home and offline screenshots. |
| F-3-2 | Preserved duplicate rejection for JSON, CSV, and rclone lists. | `@claim:duplicate-paths`; final clean clone. |
| F-3-3 | Preserved stable, distinct path-redaction labels across repeated runs. | `@claim:cli-redaction`; final clean clone. |
| F-3-4 | Preserved documented `--fail-on exceptions` and `--fail-on never` behavior. | `@claim:cli-fail-on`; final clean clone. |
| F-3-5 | Kept unsupported unreadable-result wording removed. | Copy audit; `@claim:cli-formats-readiness`. |
| F-3-6 | Preserved free-under-MIT wording and no-purchase behavior. | `@claim:free-to-use`, `@claim:mit-license`; live home and Terms. |
| F-3-7 | Preserved narrow no-network-client and no-usage-data wording. | `@claim:cli-no-network`; live Privacy route. |
| F-3-8 | Preserved complete outcome assertions for demo isolation, formats, redaction, links, acknowledgement, encryption, and offline use. | Relevant `@claim:*` tests; all 25 final clean-clone commands passed. |
| F-3-9 | Preserved consistent terms and explicit failure-mode descriptions. | Copy audit; `@claim:cli-fail-on`; README. |
| F-3-10 | Preserved 44 px mobile targets and unclipped two-row navigation. | Browser target/bounds tests; live replay target measurements; demo screenshot. |
| F-3-11 | Preserved the 1 × 1 px polite route announcement. | `@claim:routing-focus`; live forward/Back replay. |
| F-3-12 | Preserved distinct Copy install command and Copy demo command controls. | Landing browser checks; live home. |
| F-3-13 | Preserved explicit unencrypted-terminal guidance. | `@claim:encrypted-report`; copy audit. |
| F-3-14 | Kept internal factory publishing language out of the public README. | Copy audit and README review. |

## Review 4

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Preserved landing-first precaching of the direct demo. | `@claim:offline-reload`; live offline screenshot and cold replay. |
| F-4-2 | Kept the old editable demo and its manifest/audit/fixture/destination errors unreachable. | `sample-only demo exposes no editable file workflow…`; `@claim:demo-sample-only`; live demo. |
| F-4-3 | Preserved clean-environment no-account behavior for help, demo, and checks. | `@claim:cli-no-account`; final clean clone. |
| F-4-4 | Preserved build-from-no-`dist/` coverage for the release binary and static site. | `@claim:build-artifacts`; `npm run build`; final clean clone. |
| F-4-5 | Preserved first screen → product preview → steps → limits/privacy → install order. | Browser test `landing shows the sample product before method…`; live home. |
| F-4-6 | Preserved the exact tested Terms date without a future change-record promise. | `@claim:terms-effective-date`; live `/terms/`. |

## Review 5

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Preserved the sample-only browser boundary: no real fields, no `File`/`FileList` reads, and no effect from injected legacy inputs. | `@claim:demo-sample-only`; live demo has zero inputs and only bundled results. |

## Review 6

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-6-1 | Added demo lifecycle cleanup on `pagehide`, so wordmark, Home, Privacy, Terms, Start for real, Back, refresh, close, and external exits remove only `demo:cloud-exit-evidence`. A `pageshow` re-entry reseeds the bundled sample. Expanded the existing claim to cover ordinary exits and real-state preservation. | `@claim:demo-isolation`; final clean clone; live replay `exits` and `routing` show `demo: null`, `real: keep`, then a fresh sample on Forward. |
| F-6-2 | Replaced the nested landing `aside` with a styled `div` and raised every route’s Axe gate from serious/critical-only to zero violations. Added exact metadata, heading, legal-link, unique-ID, and reduced-motion checks. | Browser route tests `…zero accessibility violations`; live replay reports `frontNoteTag: DIV` and zero Axe violations on all routes; Lighthouse Accessibility 100. |

## Final verification

- Final clean clone: `/tmp/cloud-exit-evidence-polish6-final.VUUWmY` at `a75fb8a`; all 25 claim commands passed separately. Log: `/tmp/cloud-exit-evidence-polish6-final-claims.log`.
- `npm test`: 6 Rust unit tests, 3 CLI integration tests, 1 doctest, 4 Vitest tests, 71 Playwright/Axe passes, 3 intentional viewport skips, static-policy verification, and the build-artifact test all passed.
- `npm run build`: release binary plus `dist/site/`; main JS 4.24 kB and CSS 12.11 kB uncompressed.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty`: 13 files, 78.3 KiB (21.2 KiB compressed), verified.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, total transfer 39 KiB.
- Production replay: exact metadata/routes, 404, focus, all demo exits, isolated storage, same-origin requests, landing-first offline use, mobile layout, and zero Axe violations passed with no normal-route console errors.

No finding remains open.
