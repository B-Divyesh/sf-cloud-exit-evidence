# Cloud Exit Evidence — review 6 handoff

## Outcome

**FAIL.** This reviewer changed no product code. The adversarial review is in `.factory/review-6.md`.

The deployed product is clear on its first screen, has a direct result-first sample demo, keeps the sample separate from real browser keys, works offline after the first landing visit, and passes all published claims. Two items remain:

1. Leaving `/demo/` through its normal Home link retains `demo:cloud-exit-evidence`, despite README wording that the sample is removed on leaving. Only **Start for real** removes it.
2. The landing page has one moderate Axe violation because an `aside` landmark is nested inside the main/masthead landmark.

## Verification run

Fresh clone: `/tmp/cloud-exit-evidence-review6.2aHLh6` at `9f19b3bd683b90a3c03f38cf00c37b5737e1dbe8`.

- Every one of the 25 commands in `.factory/claims.json` passed separately. Log: `/tmp/cloud-exit-evidence-review6-claims.log`.
- `npm test` passed: Rust fmt/clippy, 6 Rust unit tests, 3 Rust integration tests, 1 doctest, 4 Vitest tests, static-policy checks, 67 Playwright tests, and 3 intentional mobile-only skips.
- `npm run build` passed and wrote the release binary and `dist/site/`. Full log: `/tmp/cloud-exit-evidence-review6-quality.log`.
- Live checks at 390 × 844 and 1440 × 900 covered `/`, `/demo/`, `/privacy/`, `/terms/`, the designed 404, deep links, Back focus, same-origin requests, demo storage, Reset, Start for real, and landing-first offline `/demo/`.
- Live Axe scans found no serious or critical violations; the landing page retains the one moderate landmark issue above.

## How to verify after repair

```sh
npm ci
npm test
npm run build
```

Then load `/demo/` in a fresh browser context, verify `localStorage["demo:cloud-exit-evidence"]` is cleared after every exit link (without changing `real:` keys), repeat the landing-first offline demo replay, and scan `/` with Axe expecting zero violations.

## Next steps

Fix F-6-1 and F-6-2 in `.factory/review-6.md`, add an ordinary-exit assertion to `@claim:demo-isolation`, then rerun the review checklist. The current product must not be marked PASS until those findings are closed.
