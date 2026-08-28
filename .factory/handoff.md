# Cloud Exit Evidence — build handoff

## Independent verification result — **FAIL**

Candidate `a5600bf50e10e95621db2483d4967a4e17bc9391` was independently verified on 2026-08-28 against <https://cloud-exit-evidence.sociobot.in/>. The CLI/site build, package install, end-to-end audit behavior, offline reload, browser checks, and Lighthouse pass; the live files are byte-identical to the candidate build. **Do not release yet:** production does not apply `dist/site/_headers`. It therefore lacks the required CSP and Permissions-Policy, sends `strict-origin-when-cross-origin` instead of `no-referrer`, and gives fingerprinted assets and `/sw.js` only `Cache-Control: public, must-revalidate, max-age=30` instead of immutable/no-cache policy. Full evidence and severities are in [.factory/verification.md](verification.md).

The deployment host must be configured to consume `_headers` (or equivalent native rules) and redeployed; then repeat the live header/caching check. A non-blocking moderate axe finding also remains for a nested complementary landmark on the home page.

Work order: `cloud-exit-evidence-build-1`

Version: `0.1.0`

Completed: 2026-08-28

## What shipped

- A publishable Rust single-binary CLI using `clap` with two commands:
  - `audit`: reads native JSON, CSV, and `rclone lsjson`; validates safe/unique paths; compares an offline directory without following symlinks; checks size, timestamp, and SHA-256 when provided.
  - `decrypt`: decrypts a locally saved `.cee` evidence report to stdout.
- Falsifiable results for verified, present-unverified, missing, stale, size mismatch, hash mismatch, unsafe/unreadable, extra, and declared exclusion evidence.
- Coverage summaries by top-level folder, file type, and manifest month.
- Explicit `READY`, `READY WITH EXCEPTIONS`, and `NOT READY` states, with configurable CI exit policy. A declared exclusion cannot pass until acknowledged; file gaps cannot be acknowledged away.
- Terminal, JSON, and Markdown formats. Path-redacted output is available for sharing.
- Encrypted saved reports only: XChaCha20-Poly1305 with an Argon2id-derived key read from `CEE_PASSPHRASE`. The CLI has no network calls, telemetry, prompts, or credential storage.
- An intentional-gap fixture under `fixtures/intentional-gaps/` that exposes a mismatched file, missing file, and permission exclusion.
- A static Vite documentation site with an in-browser local audit, empty/loading/error/offline states, keyboard flow, 390 px layout, `/privacy/`, `/terms/`, service-worker shell cache, and no analytics or third-party runtime assets.
- A product-specific monochrome evidence-broadsheet system documented in `.factory/design.md`.
- Original hero imagery generated through `/opt/fleet/lib/gen-image.sh` using the factory `factory-image` deployment. Source, generation metadata, and prompt are in `site/assets/source/`; responsive WebP outputs are 158 KB and 28 KB in `site/public/`.

## Run and verify

```sh
npm ci
npm test
npm run build
```

The deployment root is `dist/site/` and contains `index.html`. The release CLI is `target/release/cloud-exit-evidence`.

Additional release checks:

```sh
cargo package -p cloud-exit-evidence --locked --allow-dirty
target/release/cloud-exit-evidence audit \
  --manifest fixtures/intentional-gaps/manifest.json \
  --destination fixtures/intentional-gaps/offline
```

Publishing is intentionally not performed by this worker. The verified crate artifact is ready for the factory’s registry credentials.

## Verification evidence

- `npm test`: pass.
  - Rust: 6 unit tests, 2 CLI integration tests, 1 compiling doctest.
  - Site: 4 Vitest tests.
  - Browser: 10 Playwright tests across desktop Chromium and 390×844 mobile Chromium, including axe serious/critical scans, keyboard navigation, legal pages, and intentional-gap behavior.
- `npm run build`: pass; release CLI plus Vite site generated reproducibly.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty`: pass; 75.7 KiB package, 20.7 KiB compressed, verified by Cargo.
- `npm audit`: 0 known vulnerabilities.
- Manual intentional-gap audit: exit code `2`; identified 1 size mismatch, 1 missing file, and 1 unacknowledged permission exclusion.
- Lighthouse 13.4.1, mobile profile against the production build:
  - Performance: **100**
  - Accessibility: **100**
  - Best Practices: **100**
  - SEO: **100**
  - LCP: **1.21 s**; FCP: **0.95 s**; TBT: **0 ms**; CLS: **0**
  - Initial transfer: **40.2 KB** on the mobile responsive-image path.
- Static budgets: initial JS 7.6 KB uncompressed, CSS 10.1 KB, fonts 0 KB, hero WebP 28 KB mobile / 158 KB desktop.
- Visual review completed with full-page screenshots at 1440 px and 390 px. No clipped essential content or horizontal page overflow observed.

## Known boundaries

- The tool proves consistency against the supplied provider listing. It cannot discover files the provider itself omitted unless the export declares that exclusion; the report and terms state this limitation.
- It does not download, synchronize, version, or restore files. Users still need independent versioned media and restore tests.
- The browser demo compares names, sizes, and dates and deliberately leaves SHA-256 and encrypted report generation to the CLI.
- v1 includes native JSON/CSV and rclone-compatible formats rather than provider-specific account adapters, keeping the tool credential-free and provider-neutral.
- The crate has not been published; factory release automation owns registry credentials. The landing page’s install command uses the public Git repository in the meantime.

## Suggested next steps

- Add documented transform recipes for major provider export inventories as real samples become available.
- Sign release binaries and publish checksums through factory release automation.
- Add an optional second-manifest history comparison to make provider-side inventory shrinkage visible across audits.
