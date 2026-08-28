# Cloud Exit Evidence — review 5 handoff

## Outcome

Completed the independent adversarial review without modifying product code. The review is **FAIL** because the visible `/demo/` sandbox reads a selected real folder’s file details while its persistent banner says it does not read real data. Details and a concrete repair/test are in `.factory/review-5.md` as F-5-1.

## Verification performed

- Cold live checks at 390 × 844 and 1440 × 900: first-screen explanation/action, direct demo, `?demo=1`, Reset/Start-for-real storage isolation, landing-first offline demo, same-origin network interception, route metadata, 404, links, and Back/Forward focus.
- Fresh clone `/tmp/cloud-exit-evidence-review5` at `a789aefe2cb777da8f27900f4a1a9312db6829a3`: all 24 commands declared in `.factory/claims.json` ran separately and passed.
- `npm run test:browser`: 64 passed, 2 viewport-inapplicable skips.
- CLI format/clippy/unit/integration/doctest components, Vitest, static policy check, `npm run test:build-artifacts`, `npm run build`, and `cargo package -p cloud-exit-evidence --locked --allow-dirty` passed.

## Known gap and next step

Do not treat the demo as complete until F-5-1 is fixed. Keep it sample-only (or route “Start for real” to a distinct real workflow), then add a tagged assertion proving the demo cannot read real file-list/folder input and rerun the full review.
