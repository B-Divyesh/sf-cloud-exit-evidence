# Cloud Exit Evidence — adversarial review 3 handoff

## Done

- Completed a fresh production review at 390 × 844 and 1440 × 1000.
- Re-ran the landing, demo, privacy, offline, storage-isolation, CLI, history, routing, metadata, link, accessibility, and visual-identity checks from scratch.
- Wrote `.factory/review-3.md` with a **FAIL** verdict, complete landing/README copy inventory, claim evidence, prior-finding matrix, and 14 concrete findings.
- Did not modify product code or deploy anything.

## Verification

- Fresh clone: `/tmp/cloud-exit-evidence-review3.GutVIf` at `dcc295b71f311795a0a3360afa3e43002ada98aa`.
- Ran all 18 commands from `.factory/claims.json` individually: every command passed.
- `npm test` passed in the clean clone: Rust format/Clippy, 6 unit tests, 3 CLI integration tests, 1 doctest, 4 Vitest tests, response-policy verification, and 49 Playwright tests; the desktop skip for the 390px-only claim was expected.
- `npm run build` passed in the review tree and produced the release binary plus `dist/site/`.
- Live demo made only same-origin requests, reloaded offline, preserved a real-data key seeded before entry, reset only `demo:cloud-exit-evidence`, and removed only demo state on exit.
- The release CLI demo ran from an empty temporary working directory and produced the same two missing paths and open exclusion as the site.
- The published `cargo install --git ... cloud-exit-evidence` command installed and ran version 0.1.0.
- Live route crawl, metadata, deep links, Back/Forward focus, response headers, designed 404, reduced motion, and Axe serious/critical checks passed.

## Known gaps / next steps

- Verdict remains FAIL. See `.factory/review-3.md` for the authoritative list.
- Blocking work: add missing claim entries/assertions, add explicit offline and price facts to the first screen, and finish the terminology repair.
- Other work: restore 44px mobile targets, visually hide the route announcement, disambiguate Copy buttons, and replace two vague/internal README sentences.
- Re-run every listed claim command from a clean clone and repeat the live phone click path after repair.
