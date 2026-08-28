# Independent verification — PASS

Work order: `cloud-exit-evidence-verify-2`
Candidate commit: `32cc05abf688649eead18dad8a47c1a66298383f`
Production URL: <https://cloud-exit-evidence.sociobot.in/>
Date: 2026-08-28 (UTC)

## Verdict

**PASS — the candidate satisfies the researched CLI job-to-be-done and the live deployment matches its production build.** The deployment-only response-policy and cache defect recorded in [verification.md](verification.md) is fixed on the live site.

## Clean-build and package evidence

- Started at the requested candidate with a clean tracked worktree. `npm ci` completed with **0 vulnerabilities**.
- `npm test` completed from that clean install. Its component checks were also directly rerun: Rust formatting, Clippy (`-D warnings`), **6** library tests, **2** CLI integration tests, **1** doctest, **4** Vitest tests, and all **12** Playwright tests (desktop and 390×844 mobile) passed.
- Exact production build passed: `npm run build` produced `target/release/cloud-exit-evidence` and `dist/site/`; `node scripts/verify-static-policy.mjs` passed against the generated Azure Static Web Apps configuration.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty` passed (12 files; 76.7 KiB / 21.1 KiB compressed). The packaged crate was installed into a fresh temporary consumer with `cargo install --path target/package/cloud-exit-evidence-0.1.0 --root <temp>/install --locked`; installed `cloud-exit-evidence 0.1.0`, top-level help, and `audit --help` worked.

## Independent CLI exercises

- Intentional-gap fixture: JSON audit exited **2**, reported `not_ready`, one missing file, one size mismatch, and the unacknowledged `Phone/Documents/**` Android all-files exclusion. It grouped the file gaps by folder, type, and date. This meets the brief's success criterion: it does not claim readiness in the presence of the permission gap.
- Representative ready case (a matching one-file manifest) exited **0** with `ready`. An acknowledged declared exclusion exited **0** with `ready_with_exceptions` and preserved the acknowledgement evidence.
- Invalid/missing manifest and nonexistent destination each exited **3** with actionable errors. The integrated encryption test verified a `CEE1` encrypted report contains no visible source path and decrypts only with the passphrase.
- The release CLI is one credential-free binary. Help explicitly says the audit does not create a backup or access cloud credentials; JSON output and documented readiness exit policy are present.

## Browser, privacy, and accessibility evidence

- Fresh live Chromium checks at **1440px** and **390px** found no console/page errors, no horizontal overflow, and no runtime request origin other than `https://cloud-exit-evidence.sociobot.in`.
- On both sizes, loading the sample then running the audit showed **Not ready**, `Documents/tax-return.pdf`, and `Phone/Documents/**`. Malformed JSON produced the exposed `role=alert` error and recovered successfully after loading the fixture.
- Keyboard-only smoke test reached a visibly focused skip link; Enter moved focus to main. With reduced motion, all tested transitions/animations computed to `0s`.
- Axe on live `/`, `/privacy/`, and `/terms/` at both widths found **0 serious or critical violations**. The locally built browser suite additionally confirmed semantic structure and service-worker offline reload/update behavior on both widths; fresh live checks also registered a controller then successfully reloaded the shell offline.
- Source review plus browser network capture found no telemetry, analytics, credentials, uploads, third-party fonts/scripts, or third-party runtime traffic. CLI source contains no network client. The privacy and terms pages are present.

## Live identity, headers, cache, and performance

- SHA-256 matched fresh `dist/site/` output for live `index.html`, app JS, support JS, CSS, both WebP assets, and `sw.js`. The host intentionally does not expose `staticwebapp.config.json` (404); its configured effects are verified below.
- Live `/`, `/privacy/`, `/terms/`, `/sw.js`, and fingerprinted JS/CSS served the expected self-only `Content-Security-Policy` (including `frame-ancestors 'none'`), `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`.
- Live fingerprinted JS/CSS and both hero WebPs served `Cache-Control: public, max-age=31536000, immutable`; `/sw.js` served `Cache-Control: no-cache`. HTML keeps the appropriate short revalidation cache (`public, must-revalidate, max-age=30`).
- Built budgets: initial application JS **7,593 B** uncompressed (**3,381 B gzip** across the two initial chunks), CSS **10,065 B** (**3,069 B gzip**), fonts **0 B**, mobile hero **28,402 B**. All are within the stated budgets.
- Fresh live Lighthouse mobile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP **1,063 ms**, TBT **0 ms**, CLS **0**, transfer **38,873 B**.

## Defects

### Low — negative numeric option is inconsistent in one conventional spelling

The documented invalid-input exit code is 3. `--stale-tolerance-seconds=-1` correctly produces the validation error and exits 3. In contrast, the conventional space-separated spelling `--stale-tolerance-seconds -1` is consumed by Clap as an unexpected option and exits 2 (with a clear usage error). This is not a readiness false-positive and has an obvious `=` workaround, but can confuse scripts that rely on the documented distinction between readiness failures (2) and invalid configuration (3).

No high- or medium-severity defects found.

## Commands to reproduce

```sh
npm ci
npm test
npm run build
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

Then deploy `dist/site/` to Azure Static Web Apps; `staticwebapp.config.json` must remain at the artifact root.
