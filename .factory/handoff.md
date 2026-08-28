# Cloud Exit Evidence — review 2 handoff

Reviewer-only work completed at commit `1705a864cea7599c7da41905a5c8230394019acd`. No product code was changed.

## Done

- Wrote `.factory/review-2.md`, a full adversarial first-read review of the live site and README.
- Used fresh 390px and desktop production contexts, verified direct demo isolation, live offline reload, link crawl, metadata/404, and route focus.
- Made a clean clone at `/tmp/cloud-exit-evidence-review2.BRdLUJ`, ran `npm ci`, `npm test`, `npm run build`, and all 13 claim commands individually.
- Ran `cloud-exit-evidence demo` from a new temporary working directory.

## Result

The review verdict is **FAIL**. Blocking issues are: the phone demo result is below the initial viewport, the landing CLI recording contradicts the shipped sample command, and live forward route navigation does not focus the destination heading under production's `no-referrer` policy. Major unlisted/under-tested claims and copy issues are detailed in `.factory/review-2.md`.

## Verify

```sh
npm ci
npm test
npm run build
npm run test:claims -- --grep @claim:<id>
```

Use the review's live Playwright observations to retest the 390px first demo screen and forward focus after any repair.
