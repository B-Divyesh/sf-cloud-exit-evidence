# Polish 3 — complete adversarial closure

Repair commit: `28865ae03f516f3940a876bf1f677121c091dbeb`  
Live URL checked cold: <https://cloud-exit-evidence.sociobot.in/>

Every row below is closed. “Claim run” means all 21 individual commands declared in `.factory/claims.json` passed from `/tmp/cloud-exit-evidence-polish3.y0mbmC`; the listed tag identifies the direct observable assertion.

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| R1-1 claims cannot be independently verified | Completed the 21-entry claim inventory and gave every visitor-facing behavior one tagged, outcome-level test. | Clean-clone claim run; `npm run test:claims -- --grep @claim:demo-sample-report` through `@claim:mit-license`. |
| R1-2 one-click isolated demo and CLI demo | Kept `/demo/` and `?demo=1` direct entry, the persistent sample banner, reset/exit controls, and distinct `demo:` storage; strengthened entry isolation and CLI temp-output inspection. | `@claim:demo-first-screen`, `@claim:demo-isolation`, `@claim:cli-demo`; live `/demo/`; `.factory/evidence/live-polish-3-demo-390.png`. |
| R1-3 real routes, focus, and 404 | Retained route-specific titles, legal pages, branded `404.html`, History API focus restoration, and live announcement; made the announcement visually screen-reader-only. | `@claim:routing-focus`; cold route crawl; live `/missing-polish-3` HTTP 404. |
| R1-4 first-screen plain words | Rewrote the primary facts as “No uploads”, “Works offline after first visit”, and “Free under MIT”; retained the specific sample action. | `@claim:demo-first-screen`, `@claim:offline-reload`, `@claim:free-to-use`; live home screenshot. |
| R1-5 metadata and shared skeleton | Kept the structured header/main/footer, canonical/OG metadata, sitemap, robots, favicon, legal navigation, and product-specific broadsheet design; corrected the home title wording. | Cold route crawl; `verify-url.sh`; Lighthouse SEO 100. |
| R1-6 jargon and misleading labels | Standardized visitor copy on “check” and “command-line tool”; removed vague immediate-result labels and used precise copy controls. | `.factory/copy-audit.md`; `@claim:cli-validation-and-links`; live home check. |
| R1-7 unlisted claim-like copy | Added claims for price, duplicate rejection, redaction stability, both failure policies, privacy wording, and encryption output behavior; removed the untestable public “unreadable” wording. | `@claim:free-to-use`, `@claim:duplicate-paths`, `@claim:cli-redaction`, `@claim:cli-fail-on`, `@claim:cli-no-network`, `@claim:encrypted-report`. |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 mobile demo result | Retained the result-first compact demo layout and protected it with a 390×844 regression assertion. | `@claim:demo-first-screen`; `.factory/evidence/live-polish-3-demo-390.png`. |
| F-2-2 recording matches bundled demo | Retained the same two missing paths and acknowledged exclusion in browser preview, CLI demo, example, and self-hosted transcript; test now inspects the generated temp files too. | `@claim:cli-demo`; `cloud-exit-evidence demo`; live landing recording check. |
| F-2-3 deployed route focus | Retained the destination marker and `pageshow` focus recovery under `no-referrer`; route announcer is now visually hidden. | `@claim:routing-focus`; cold live forward/back check. |
| F-2-4 read-only behavior | Retained the before/after input manifest and folder hashing assertion. | `@claim:cli-read-only`. |
| F-2-5 acknowledgement and exits | Retained and expanded exact ready/gap/invalid statuses plus the recorded acknowledged exclusion. | `@claim:cli-acknowledgement`; `@claim:cli-exit-codes`. |
| F-2-6 encryption promise | Kept public wording at the observable passphrase promise and verifies correct/wrong-passphrase behavior; terminal output is explicitly plain. | `@claim:encrypted-report`; README and live Privacy review. |
| F-2-7 privacy inventory | Retained the all-route same-origin request check and no-account behavior; narrowed network language to the testable no-network-client/no-usage-data fact. | `@claim:site-no-third-party-runtime`, `@claim:no-account`, `@claim:cli-no-network`; cold live request interception. |
| F-2-8 sentence length | Rechecked landing and README sentence counts; no current audited sentence exceeds 22 words. | `.factory/copy-audit.md`. |
| F-2-9 terminology and failure policy | Finished standardization on “check” and “command-line tool,” explained the rclone JSON file list once, and documented `--fail-on exceptions` and `--fail-on never`. | `.factory/copy-audit.md`; `@claim:cli-fail-on`; README review. |

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 missing offline and price facts | Added explicit offline and price facts beside “No uploads” in the first screen. | `@claim:offline-reload`; `@claim:free-to-use`; live home screenshot. |
| F-3-2 duplicate-path claim | Added `duplicate-paths` to the inventory and asserts duplicate rejection in JSON, CSV, and rclone inputs. | `@claim:duplicate-paths`. |
| F-3-3 stable redaction claim | Added the claim and verifies two distinct local paths across two separate runs keep their stable redacted labels. | `@claim:cli-redaction`. |
| F-3-4 both `--fail-on` modes | Added the claim, README explanation, and separate assertions for `exceptions` and `never`. | `@claim:cli-fail-on`. |
| F-3-5 unlisted “unreadable” result | Removed “unreadable” from the public result copy; retained only readiness outcomes that the CLI reports and tests. | README copy audit; `@claim:cli-formats-readiness`. |
| F-3-6 unlisted free claim | Added the `free-to-use` claim and a no-purchase-path source/UI test. | `@claim:free-to-use`; live first screen. |
| F-3-7 overbroad “no telemetry” | Replaced it with the narrow, observable “has no network client and sends no usage data”; test checks source/dependencies and an empty working directory. | `@claim:cli-no-network`; live Privacy route. |
| F-3-8 underasserted listed claims | Strengthened isolation, CLI demo, exit status, format schema, redaction repetition, unsafe symlink, acknowledgement-note, and encrypted-output assertions. | `@claim:demo-isolation`, `@claim:cli-demo`, `@claim:cli-exit-codes`, `@claim:cli-formats-readiness`, `@claim:cli-redaction`, `@claim:cli-validation-and-links`, `@claim:cli-acknowledgement`, `@claim:encrypted-report`. |
| F-3-9 remaining terminology inconsistencies | Replaced remaining public “CLI” terminology with “command-line tool,” corrected the title to “Check,” and explained failure modes. | `.factory/copy-audit.md`; live title; `@claim:cli-fail-on`. |
| F-3-10 small mobile targets | Set header, footer, wordmark, skip link, and demo controls to at least 44px; regression checks visible controls on every route. | `@claim:demo-first-screen`; cold 390px route crawl; Lighthouse touch-target audit. |
| F-3-11 visible route announcement | Applied the existing `sr-only` treatment to each route announcement while retaining polite live semantics and route focus. | `@claim:routing-focus`; cold live check confirms <=1px announcement box. |
| F-3-12 ambiguous copy buttons | Renamed buttons to “Copy install command” and “Copy demo command”; feedback names the copied command. | Live home check; `@claim:cli-validation-and-links`. |
| F-3-13 vague terminal warning | Rewrote it as “Terminal output is not encrypted. Protect or redirect it yourself.” | README review; `@claim:encrypted-report`. |
| F-3-14 internal factory jargon | Removed the internal registry-publishing sentence from public README copy. | README review; `.factory/copy-audit.md`. |

## Production evidence

- `verify-url.sh` result: `.factory/evidence/verify-url-polish-3/verify.json` (HTTP 200; title/lang/main/alt/button/console checks pass).
- Cold live screenshots: `.factory/evidence/live-polish-3-home-390.png` and `.factory/evidence/live-polish-3-demo-390.png`.
- Lighthouse mobile: `.factory/evidence/lighthouse-polish-3-mobile.json` (Performance/Accessibility/Best Practices/SEO 100/100/100/100; FCP 0.9s, LCP 1.1s, TBT 20ms, CLS 0).
- Full local browser suite: `npm run test:browser` — 56 passed, 2 expected skips; Axe serious/critical findings = 0. The cold production replay also completed with zero console errors, same-origin runtime requests only, offline reload in the demo, and Axe serious/critical = 0.
