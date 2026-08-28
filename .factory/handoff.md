# Cloud Exit Evidence — review 4 handoff

## Outcome

Adversarial review 4 is recorded in `.factory/review-4.md` with verdict **FAIL**. No product code was modified.

The review found six items: two blocking regressions, three major findings, and one minor finding. The principal blocker is that **“Works offline after first visit”** is not true after only a landing-page visit; offline `/demo/` serves the cached home page. The other blocker is stale `manifest` / `audit` / `evidence fixture` language in live demo errors, reopening earlier terminology findings.

## Verification performed

- Cold production loads at 390 × 844 and 1440 × 900.
- One-click demo result, banner, Reset, Start for real, storage isolation, same-origin traffic, and offline behavior.
- Every command in `.factory/claims.json`, separately, from clean clone `/tmp/cloud-exit-evidence-review4.xDrKVb` at `9259bc1aef3cc075083b9115c3f1a85ebe15040f`: all 21 passed.
- `npm test`: passed (56 Playwright passed, 2 expected viewport skips; all Rust/Vitest/policy checks passed).
- `npm run build`: passed and produced the release binary plus `dist/site/`.
- Live `/`, `/demo/`, `/privacy/`, `/terms/`, and designed 404 at mobile and desktop: metadata, h1/main, links, focus/Back, 44px targets, reduced motion, headers, and serious/critical Axe checks passed.
- `/opt/fleet/lib/verify-url.sh` passed on the production root.
- CLI demo ran in an empty temporary working directory and wrote only to its announced temporary sample directory.

## Remaining work

Implement F-4-1 through F-4-6 from `.factory/review-4.md`, add the specified claim/error tests, deploy, and repeat the landing-first offline scenario. The repository is otherwise left buildable; only this review and handoff are changed by the review commit.
