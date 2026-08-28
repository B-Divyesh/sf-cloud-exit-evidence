# Cloud Exit Evidence — polish 6 handoff

## Outcome

**PASS.** Every finding from adversarial reviews 1–6 is closed. The repaired command-line product and its static documentation/demo retain the evidence-broadsheet visual system and original artifact class.

Product commits:

- `014bdaf79e6533df377699566615c8c0be1eae2f` — ordinary demo-exit cleanup, complete claim test, zero-violation Axe gate, exact route metadata checks, catalog/copy/docs updates.
- `a75fb8a3beeb91c3d8ab5b62106aff3b4f6c56d9` — unique accessible report-title lifecycle and duplicate-ID regression check.

Deployment `2a4b45df-c2ad-45f3-9508-5520a546d426` is live at <https://cloud-exit-evidence.sociobot.in/>.

## What changed

- Demo state now disappears on every real exit from `/demo/`, including Home, wordmark, Privacy, Terms, Start for real, Back, refresh, close, and external navigation. Only `demo:cloud-exit-evidence` is touched; `real:` state remains unchanged. Forward/re-entry creates a fresh bundled sample.
- The landing backup reminder is presentation content instead of a nested complementary landmark.
- Axe checks now require zero violations on every route. Route tests also prove exact titles/canonicals/social metadata, shared legal links, heading order, unique IDs, and no console errors.
- The established first-screen wording, one-click `?demo=1` path, sample-only boundary, mobile result layout, offline behavior, focus routing, 404, legal pages, privacy, and command-line claims remain covered.
- `.factory/catalog-description.txt` is a 92-character verb-first sentence. `.factory/copy-audit.md`, `.factory/demo.md`, `.factory/claims.json`, and `.factory/polish-6.md` reflect the final behavior.

## Verification

Final clean clone: `/tmp/cloud-exit-evidence-polish6-final.VUUWmY` at `a75fb8a3beeb91c3d8ab5b62106aff3b4f6c56d9`.

- Every one of the 25 commands in `.factory/claims.json` passed separately. Log: `/tmp/cloud-exit-evidence-polish6-final-claims.log`.
- `npm test` passed: Rust fmt/clippy, 6 unit tests, 3 CLI integrations, 1 doctest, 4 Vitest tests, response-policy checks, 71 Playwright/Axe passes, 3 intentional viewport skips, and the build-artifact test.
- `npm run build` passed and produced the release binary plus `dist/site/`. Main JS is 4.24 kB; CSS is 12.11 kB uncompressed.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty` passed: 13 files, 78.3 KiB, 21.2 KiB compressed.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, total transfer 39 KiB.
- `/opt/fleet/lib/verify-url.sh` passed after the final deploy: HTTP 200, exact title, `lang=en`, one h1/main, complete alt text, labeled buttons, and no console errors.
- Cold production replay passed `/`, `/demo/`, `/privacy/`, `/terms/`, and `/missing-polish-6` (designed HTTP 404). All normal routes had zero console errors and every route had zero Axe violations.
- Live demo replay passed `?demo=1`, sample-only input checks, every ordinary exit, Back/Forward focus and storage, same-origin-only requests, 44 px touch targets, no horizontal overflow, and landing-first offline `/demo/`.

Evidence:

- `.factory/evidence/live-polish-6.json`
- `.factory/evidence/live-polish-6-home-390.png`
- `.factory/evidence/live-polish-6-demo-390.png`
- `.factory/evidence/live-polish-6-offline-demo-390.png`
- `.factory/evidence/verify-url-polish-6/verify.json`
- `.factory/evidence/lighthouse-polish-6-mobile.json`

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

Run `cloud-exit-evidence demo` to exercise the bundled command-line sample. Open `/demo/` or `/?demo=1` for the isolated browser sample.

## Known gaps and next steps

None. No review finding, claim failure, accessibility violation, console error, privacy boundary issue, or deployment discrepancy remains.
