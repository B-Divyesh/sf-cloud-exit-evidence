# Independent verification — FAIL

Work order: `cloud-exit-evidence-verify-1`  
Verified candidate: `a5600bf50e10e95621db2483d4967a4e17bc9391`  
Production URL: <https://cloud-exit-evidence.sociobot.in/>  
Date: 2026-08-28 (UTC)

## Verdict

**FAIL — production response policy and caching do not meet the shipped product contract.**

The candidate itself builds and functions correctly. The live deployment is byte-for-byte the candidate's static output, but its host does not apply the repository's `site/public/_headers` rules. This is a real deployment-only release blocker, not an inability to reproduce the build.

## Passing evidence

- Clean candidate checkout was confirmed (`git status --short --branch` clean; `HEAD` = `a5600bf50e10e95621db2483d4967a4e17bc9391`). `npm ci` completed with 0 npm vulnerabilities.
- `npm test` passed: Rust `fmt --check`, Clippy with `-D warnings`, 6 library tests, 2 CLI integration tests, 1 doctest; 4 Vitest tests; and all 10 Playwright tests (desktop Chromium plus 390×844 mobile).
- Exact production build passed: `npm run build` produced `target/release/cloud-exit-evidence` and `dist/site/`.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty` passed (12 files; 76.4 KiB / 20.9 KiB compressed). The `.crate` was unpacked to a clean temporary consumer, installed with `cargo install --path … --root … --locked`, and its installed `cloud-exit-evidence 0.1.0`, top-level help, and `audit --help` worked.
- CLI independent exercises:
  - Intentional-gap fixture exited `2` and JSON reported exactly 1 size mismatch, 1 missing file, and 1 open Android permission exclusion with `not_ready` readiness.
  - Invalid JSON manifest, nonexistent destination, and negative stale tolerance each exited `3` with actionable errors.
  - Encrypted report output had no visible source paths/provider strings; correct-passphrase decrypt returned the redacted report; wrong passphrase exited `3`.
- Browser independent exercises on the live URL:
  - Desktop 1440px and 390px mobile: no console or page errors, no horizontal overflow, no third-party request origins, sample gap report worked, malformed JSON gave an accessible error and recovered with the sample fixture.
  - Keyboard skip link is reachable and visibly focused; reduced-motion computed transition/animation durations are `0s`.
  - Service worker became controller and an offline reload succeeded.
  - axe on `/`, `/privacy/`, and `/terms/` at desktop and 390px found **0 serious/critical** violations. The home page has one moderate `landmark-complementary-is-top-level` finding (see low-severity defect).
- Live identity check: SHA-256 values of `index.html`, both JS files, CSS, desktop/mobile hero images exactly matched the freshly built `dist/site/` files. The live HTML references `index-CBIJ4j6c.js` and `style-B7Ib3T_Z.css`, matching the candidate build.
- Live Lighthouse mobile simulated run: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP 1,149 ms, TBT 20.5 ms, CLS 0, transfer 38,612 B. Built initial JS is 7,623 B uncompressed (6,882 + 711), CSS 10,065 B, fonts 0 B, and mobile hero 28,402 B — within stated budgets.
- Source and browser network review found no telemetry, analytics, account, upload, or third-party runtime request. The only runtime fetch is service-worker same-origin caching.

## Release-blocking defects

### High — production does not enforce the shipped response security policy

Observed on 2026-08-28 with `curl -I` for `/`, `/privacy/`, `/terms/`, `/assets/index-CBIJ4j6c.js`, `/assets/style-B7Ib3T_Z.css`, and `/sw.js`:

- no `Content-Security-Policy`;
- no `Permissions-Policy`;
- `Referrer-Policy: strict-origin-when-cross-origin`, rather than the shipped `no-referrer`;
- no `X-Frame-Options` / CSP `frame-ancestors` enforcement.

`dist/site/_headers` contains the intended CSP, permissions policy, no-referrer policy, and `frame-ancestors 'none'`. The deployed platform is not applying that file. This fails the privacy/security response-policy check despite the current page having no third-party requests.

### Medium — production ignores immutable asset and service-worker cache policy

Every tested live response, including fingerprinted JS/CSS and `/sw.js`, returns `Cache-Control: public, must-revalidate, max-age=30`. The shipped policy requires one-year `immutable` caching for `/assets/*` and `no-cache` for `/sw.js`. This misses the supplied PWA/cache performance contract and makes update behavior dependent on a 30-second edge-cache policy rather than the explicit service-worker rule.

### Low — moderate axe landmark finding on the home page

axe reports `landmark-complementary-is-top-level` for `<aside class="front-note" aria-label="Important distinction">`, because the complementary landmark is nested inside `<main>`. It is not serious/critical and did not block keyboard or screen-level access, but should be resolved before the next release.

## Required release action

Configure the production static host to apply the contents of `dist/site/_headers` (or its platform-native equivalent), redeploy, then re-run the header checks. No product-code change was made during this verification.
