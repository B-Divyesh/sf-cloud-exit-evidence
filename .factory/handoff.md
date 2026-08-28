# Cloud Exit Evidence — independent QA handoff

## Review 1 update — 2026-08-28 UTC

This handoff predates the adversarial first-read review. The current review is **FAIL**; see `.factory/review-1.md` for the complete evidence and retest criteria.

- No product code was changed for review work.
- A new clean clone passed `npm ci && npm test` and `npm run build`.
- Blocking gaps found: no `.factory/claims.json` or tagged claim tests; no one-click isolated `/demo` nor CLI demo command/sample; `/demo` and a designed 404 are absent.
- The review also records plain-language, metadata, and shared navigation/footer fixes required before re-review.

Work order: `cloud-exit-evidence-verify-2`
Verified candidate: `32cc05abf688649eead18dad8a47c1a66298383f`
Production URL: <https://cloud-exit-evidence.sociobot.in/>
Verified: 2026-08-28 (UTC)

## Verdict

**PASS.** The local CLI fulfils the brief's evidence-backed exit-readiness audit, and the live site is byte-matched to the freshly built candidate. The prior live-only Azure response-header/cache failure is fixed.

## What was independently verified

- Clean `npm ci` completed with 0 vulnerabilities. `npm test` passed; its direct rerun showed Rust fmt, Clippy `-D warnings`, 6 unit tests, 2 CLI integrations, 1 doctest, 4 Vitest checks, and 12 desktop/390px Playwright tests passing.
- `npm run build` passed and produced the release CLI plus `dist/site/`; generated Azure response-policy verification passed. `cargo package -p cloud-exit-evidence --locked --allow-dirty` passed, and the packaged crate installed and ran from a clean temporary consumer.
- The intentional-gap audit exited 2 and called out the missing file, size mismatch, and Android permission exclusion; matching and acknowledged-exception cases exit 0 with distinct readiness states. Invalid inputs and filesystem errors were checked.
- Live desktop and 390px checks passed: no console/page errors, only same-origin runtime requests, sample audit and malformed-input recovery work, keyboard skip link has visible focus, reduced motion is honored, axe has 0 serious/critical issues on home/privacy/terms, and the service-worker shell reloads offline.
- Fresh SHA-256 comparison matched the built candidate's HTML, JS, CSS, WebPs, and service worker to production. Live global CSP/permissions/referrer/anti-framing headers now match the Azure config; immutable asset caching and no-cache service-worker policy are active.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,063 ms, TBT 0 ms, CLS 0. Built initial JS is 7.6 KB, CSS 10.1 KB, no fonts, and the mobile hero is 28.4 KB.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

Deploy `dist/site/` to Azure Static Web Apps, retaining root-level `staticwebapp.config.json`. The release CLI is `target/release/cloud-exit-evidence`; registry publishing remains factory-owned.

## Known boundaries

- The tool proves consistency against the supplied provider listing. It cannot discover files the provider omitted unless that exclusion is declared.
- It does not download, synchronize, version, or restore files. Users still need independent versioned media and restore tests.
- The browser demo compares names, sizes, and dates; SHA-256 and encrypted report generation remain CLI features.
- v1 deliberately supports native JSON/CSV and rclone-compatible listings instead of provider account adapters, keeping it credential-free and provider-neutral.
- Low-severity CLI documentation mismatch: `--stale-tolerance-seconds=-1` exits 3 as documented, while `--stale-tolerance-seconds -1` is parsed as a Clap usage error and exits 2. See `.factory/verification-2.md` for exact evidence; this is not a release blocker.
