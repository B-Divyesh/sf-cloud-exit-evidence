# Adversarial first-read review 1 — Cloud Exit Evidence

Reviewed 2026-08-28 against production and commit `dc0db2b762ba3e57822f83d46200f0c1ac0a35e7`.

## Verdict: FAIL

The interface has a distinct, product-specific editorial identity and the ordinary clean-clone tests pass. It nonetheless fails three required product contracts: claims are not enumerated/tested, the sample is not a one-click isolated demo (and the CLI has no demo command), and `/demo`/a designed 404 do not exist.

## Cold read, before scrolling

Fresh 390 × 844 and desktop contexts both answered the basic questions from the explanatory paragraph: this compares a cloud export with an offline drive; it is for someone planning to rely on that drive; click **“Audit a sample.”** The narrow “cannot answer all three” blocker therefore does not apply. The visible headline, however, is the unclear metaphor **“Your cloud copy needs a witness.”** and the action does not actually audit a sample; see findings 2 and 4.

## Blocking findings

### 1. Claims cannot be independently verified

**Quote:** `.factory/claims.json` is absent. Visitor-facing promises include **“No login, upload, tracking, or cloud credentials,” “Nothing leaves this page,” “Cloud Exit Evidence works offline and has no telemetry,”** and **“Saved reports created with `--output` are encrypted with XChaCha20-Poly1305 using an Argon2id-derived key.”**

**Why:** There is no claim inventory, no `@claim:<id>` test, and no listed test command to run in a clean clone. `npm test` passing does not prove every promise a visitor relies on.

**Fix:** Add `.factory/claims.json`, one tagged observable test per claim, and `.factory/demo.md`. At minimum test browser privacy by intercepting requests through the full demo, demo offline reload, browser classification, CLI formats/readiness, no CLI network requests, redaction, and encrypted-report round-trip. Remove or narrow promises that lack a test.

### 2. “Audit a sample” is not a one-click demo or a CLI demo sandbox

**Quote:** Clicking **“Audit a sample”** only changes the URL to `/#demo`; the report still says **“No audit yet.”** I then had to click **“Load evidence fixture”** and **“Run local audit.”**

**Why:** The first screen after the action is not product use; it takes three actions from landing to report. There is no **“Demo — sample data, nothing is saved”** banner, **“Reset demo,”** or **“Start for real.”** `?demo=1` loads the same empty form. No separate demo namespace is documented. In the observed three-action flow, local/session storage stayed empty and only same-origin assets were requested; this is encouraging but not a demo-sandbox contract.

The CLI requirement is also unmet: `cloud-exit-evidence --help` has only `audit` and `decrypt`; no `demo` or `--demo` exists. There is no `examples/` sample input and no self-hosted terminal recording on the landing.

**Fix:** The hero should be **“Try it with sample data”** and open `/demo` or `?demo=1`, immediately rendering the three-file gap report. Show the persistent banner, Reset, and Start for real; store only `demo:` state and discard it on exit. Ship `examples/`, implement `cloud-exit-evidence demo` in a temporary directory, and show its real terminal recording on the landing.

### 3. `/demo` and a product 404 are missing

**Quote:** `GET /demo` and `GET /missing-review-route` each return 404 with title **“Azure Static Web Apps - 404: Not found.”**

**Why:** `/demo` is the direct catalog/verifier route and does not work. A broken/saved URL presents hosting-provider chrome, not a product explanation or a way home. There is no navigation fallback/404 configuration, no route-change focus/announcement, and no Back/Forward state for a demo route.

**Fix:** Implement `/demo` plus a branded `/404` page with h1 and Home link. Configure fallback. On route change update title, move focus to h1, and announce via `aria-live`; test direct load, reload, Back, Forward, and keyboard focus.

## Other findings

### 4. First-screen copy fails the plain-words shape — major

**Quote:** “Your cloud copy needs a witness.”

**Why:** It names neither the comparison nor the offline drive. It is a metaphor, not a ≤9-word job headline.

**Fix:** **“Check your offline cloud copy.”** Follow it with **“For people keeping a fallback drive, find missing and outdated cloud files before relying on it.”** Put **“Try it with sample data — shows a sample gap report”** beside it.

### 5. Metadata and shared skeleton are incomplete — major

**Quote:** The landing head has description and SVG favicon only; no canonical, Open Graph/Twitter fields, social image, or Apple touch icon. Legal pages lack favicon and social/canonical metadata. Legal headers/footers differ, and all footers omit “Built by Param Factory” and a build id.

**Why:** Shared links lack product identity, the landing title is a question rather than plain product description, and navigation is inconsistent.

**Fix:** Use **“Cloud Exit Evidence — Audit an offline copy”** and **“Demo — Cloud Exit Evidence”** (plus canonical, OG/Twitter image/description, SVG + 180px favicon). Use one header/footer everywhere with Privacy, Terms, Factory attribution, and build id.

### 6. Labels use editorial jargon or misrepresent the immediate result — major

**Quote:** “Three claims. All inspectable.” “Try the evidence test.” “Local desk check.” “Expected.” “Observed.” “Accounted for.” “Awaiting evidence.” “Load evidence fixture.” “Audit a sample.”

**Why:** A new visitor must learn the metaphor before understanding the controls. “Audit a sample” only scrolls, while “fixture” is developer vocabulary.

**Fix:** Use **“How the audit compares files,” “See a sample gap report,” “Sample audit,” “Files in the export,” “Files on your drive,” “Known exclusions,” “No report yet,”** and **“Load sample files.”** The hero button must load the result itself.

### 7. All claim-like copy is unlisted — major

With no claims file, every testable assertion is unlisted. This includes every format, validation, symlink, size/date/hash, grouping, exclusion, local-memory, offline, no-account/no-telemetry, exit-code, encryption, redaction, no-upload, and no-third-party-script assertion in the copy inventory below. Add each to the claim manifest with an observable sandbox test, or remove it.

## Copy audit

Counts treat hyphenated terms/options as one word. Code-block commands are commands rather than sentences. `!` means a finding: `>22` exceeds the cap; `J` is jargon/ambiguous out of context; `A` is an action that does not name the immediate result; `C` is a claim without a claims entry.

### Landing prose inventory

| Words | Text | Flag |
| ---: | --- | --- |
| 6 | Your cloud copy needs a witness. | ! J |
| 24 | Cloud Exit Evidence compares a provider export with the drive you plan to rely on—then names every missing, stale, mismatched, or permission-excluded file. | ! >22 J C |
| 3 | Local by construction. | ! J C |
| 7 | No login, upload, tracking, or cloud credentials. | ! C |
| 10 | A copied file is not evidence of a complete copy. | ! J C |
| 4 | Synchronization is not backup. | ! J C |
| 11 | A sync can faithfully repeat deletion, corruption, or a permission gap. | ! J C |
| 11 | This tool audits coverage; you still need versioned media and restore tests. | ! J |
| 2 | Three claims. | ! J |
| 2 | All inspectable. | ! J |
| 9 | Read a JSON, CSV, or rclone listing. | ! J C |
| 8 | Paths are validated; duplicate and escaping paths are rejected. | ! J C |
| 8 | Walk the physical destination without following symlinks. | ! J C |
| 6 | Compare bytes, dates, and SHA-256 when supplied. | ! J C |
| 8 | Group gaps by folder, type, and month. | ! C |
| 7 | Declared permission exclusions stay open until explicitly acknowledged. | ! J C |
| 11 | This browser edition checks names, byte sizes, modified dates, and declared exclusions. | ! J C |
| 4 | Nothing leaves this page. | ! C |
| 9 | Use the CLI for SHA-256 and encrypted reports. | ! J C |
| 6 | Native JSON, rclone JSON, or CSV. | ! J C |
| 4 | Paths stay in memory. | ! C |
| 3 | No folder selected. | |
| 22 | Paste a manifest and choose a folder, or load the intentional-gap fixture to see the report call out missing and excluded coverage. | ! J |
| 5 | Run the full audit offline. | ! C |
| 5 | One open-source Rust binary. | ! J C |
| 2 | No daemon. | ! J C |
| 2 | No account. | ! C |
| 2 | No telemetry. | ! C |
| 5 | Native JSON, CSV, rclone lsjson. | ! J C |
| 5 | Terminal, JSON, Markdown, encrypted .cee. | ! J C |
| 7 | 0 pass · 2 gaps · 3 invalid input. | ! J C |
| 3 | MIT · free forever. | ! C |
| 3 | A provider-neutral utility. | ! J |
| 6 | You are offline. | ! C |
| 7 | The demo still runs locally in this tab. | ! C |

Rendered headings/actions also checked: **“Independent file coverage audit · Issue no. 001,” “§ 01 / The method,” “Expected,” “Observed,” “Accounted for,” “§ 02 / Local desk check,” “Try the evidence test,” “Paste a manifest,” “Choose the physical copy,” “Run local audit,” “Load evidence fixture,” “Awaiting evidence,” “§ 03 / Field edition,” “Audit a sample,”** and **“Read the source and manifest specification.”** All marked J above should be replaced with the plain alternatives in finding 6; **Audit a sample** and **Load evidence fixture** are additionally `A` findings.

Landing rewrite: split the 24-word sentence into **“Compare your cloud export with an offline drive. See missing, outdated, mismatched, and excluded files.”** Replace the slogan with finding 4’s headline. Keep only short, tested facts: **“No account,” “No upload,” “Free.”**

### README prose inventory

| Words | Text | Flag |
| ---: | --- | --- |
| 18 | Cloud Exit Evidence is a local, provider-neutral audit CLI for people who keep an offline copy of cloud files. | ! J C |
| 29 | It compares a cloud export, provider listing, or sync manifest with a destination on disk and produces a falsifiable answer: complete, complete with explicitly acknowledged exceptions, or not ready. | ! >22 J C |
| 9 | It is deliberately not a backup or sync tool. | ! J C |
| 14 | It never signs in to a provider, downloads files, stores credentials, or repairs gaps. | ! C |
| 8 | Build the single binary from source (Rust 1.85+). | ! J |
| 8 | Or build a release binary locally. | ! J |
| 11 | Audit a JSON, CSV, or rclone lsjson manifest against an offline directory. | ! J C |
| 10 | Use JSON output in automation and fail the job when evidence is incomplete. | ! J C |
| 8 | Record an understood provider or OS limitation. | ! J |
| 7 | Acknowledgement is explicit and appears in the evidence. | ! J C |
| 5 | Save an encrypted evidence report. | ! J C |
| 17 | The passphrase is read from an environment variable, never a command-line argument or prompt. | ! J C |
| 12 | `--redact-paths` replaces file paths with stable SHA-256 labels in displayed output. | ! J C |
| 5 | Classification totals remain readable. | |
| 20 | CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. Only `path` is required. | ! J C |
| 11 | Rows with `excluded=true` describe known coverage exclusions rather than expected files. | ! J C |
| 18 | `rclone lsjson` arrays are accepted directly using `Path`, `Size`, `ModTime`, and `IsDir`. | ! J C |
| 3 | Directories are ignored. | ! C |
| 10 | Paths must be relative, UTF-8, and must not contain `..`. | ! J C |
| 5 | Duplicate manifest paths are rejected. | ! J C |
| 12 | Symlinks in the destination are listed as unsafe and are never followed. | ! J C |
| 15 | `READY`: every expected file is present and current, and no exclusions are open. | ! J C |
| 11 | `READY WITH EXCEPTIONS`: file evidence passes and every declared exclusion is explicitly acknowledged. | ! J C |
| 12 | `NOT READY`: missing, stale, size/hash mismatch, unsafe, unreadable, or unacknowledged coverage exists. | ! J C |
| 20 | Exit codes: `0` completed and the selected `--fail-on` policy passed; `2` readiness policy failed; `3` invalid input or filesystem error. | ! J C |
| 13 | The default `--fail-on gaps` makes a not-ready audit exit `2`, while acknowledged exceptions pass. | ! J C |
| 15 | `npm test` runs Rust formatting/lints/tests plus site unit and browser tests. | ! J |
| 26 | It also verifies the generated Azure Static Web Apps response policy: a restrictive CSP and permissions policy, `no-referrer`, immutable fingerprinted assets, and a revalidated service worker. | ! >22 J |
| 12 | `npm run build` creates the release CLI and the deployable static site at `dist/site/`. | ! J |
| 18 | Deploy `dist/site/` to Azure Static Web Apps; its root-level `staticwebapp.config.json` is required for the security and cache policy. | ! J |
| 13 | `cargo package --locked --allow-dirty` verifies the publishable Rust crate; registry publishing is handled by the factory. | ! J |
| 19 | The landing page at cloud-exit-evidence.sociobot.in documents the CLI and includes a fully local browser demo. | ! C |
| 21 | Selected folder names and manifest content stay in that browser tab: there are no accounts, analytics, third-party scripts, or network uploads. | ! C |
| 12 | Cloud Exit Evidence works offline and has no telemetry. | ! C |
| 21 | It reads manifests and destination metadata, hashes local files only when the manifest provides a SHA-256 value, and never follows symlinks. | ! J C |
| 13 | Saved reports created with `--output` are encrypted with XChaCha20-Poly1305 using an Argon2id-derived key. | ! J C |
| 7 | Plain stdout remains the caller’s responsibility. | ! J |

README headings **Cloud Exit Evidence, Install, Usage, Manifest formats, Native JSON, Readiness and exit codes, Develop and verify, Website, Privacy and security,** and **License** are included; “Native JSON,” “Manifest formats,” and “Readiness and exit codes” are J findings because a first-time user has not yet been told what a manifest is. Open instead with **“Check whether an offline cloud-file copy has the files you expect.”** Then **“For people keeping a fallback drive, it lists missing, old, changed, and excluded files.”** Split the 29-word sentence, define advanced terms once in reference material, split the 26-word build sentence, and put `cloud-exit-evidence demo` immediately after install.

## Verification record

| Check | Result | Evidence |
| --- | --- | --- |
| Live first-load desktop + 390px | Baseline pass | HTTP 200, `lang`, one h1 and main, no console errors. |
| Live link crawl | Partial | `/`, `/privacy/`, `/terms/`, favicon, robots, sitemap, anchors, and GitHub source worked. `/demo` and unknown route were generic 404s. |
| Live demo privacy | Partial | Fixture flow made only same-origin page/asset requests and wrote no local/session keys; it is not an isolated direct demo. |
| Offline reload | Baseline pass | After service-worker control, offline reload rendered the shell. |
| Accessibility baseline | Baseline pass | Clean-clone Axe had no serious/critical issues for home/privacy/terms at desktop + 390px; skip-link keyboard check passed. |
| Claims | Fail | No manifest, no tags, no claim commands. |
| CLI demo | Fail | No command or shipped examples. |
| Fresh clone tests | Baseline pass | `npm ci && npm test`: Rust format/clippy, 6 unit + 2 CLI + 1 doctest, 4 Vitest, response policy, 12 Playwright all passed. |
| Fresh clone build | Baseline pass | `npm run build` completed and produced release CLI + `dist/site/`. |
| Visual identity | Pass | The warm-paper broadsheet, ledger image, editorial rules, and proof-red accent match `.factory/design.md`; it is not generic SaaS. |

## Retest

From a fresh 390px context, direct `/demo` must immediately show a realistic report and persistent banner. Verify Reset clears only `demo:` data and Start for real exits. Run every claims JSON command in a clean clone. Run `cloud-exit-evidence demo` in an empty temporary directory. Then retest offline/privacy interception, the branded 404, metadata, direct routes, Back/Forward focus, and links.
