# Adversarial first-read review 4 — Cloud Exit Evidence

Reviewed 2026-08-28 against production and clean clone `9259bc1aef3cc075083b9115c3f1a85ebe15040f`.

## Verdict: FAIL

The first screen is clear, the one-click sandbox works while online, all 21 listed claim commands pass, and the visual/routing baseline is strong. The release still has two blocking regressions: its first-screen offline promise is broader than the behavior tested or delivered, and live demo errors retain terminology that three earlier rounds said was removed. Four additional findings leave the claim inventory and required landing structure incomplete.

## Cold read before scrolling

Fresh contexts loaded the production root at 390 × 844 and 1440 × 900. I did not scroll before recording these answers.

- **What it does:** checks an offline cloud-file copy for missing or outdated files.
- **For whom:** people keeping a fallback drive before relying on it.
- **What to click first:** **“Try it with sample data.”**

The exact first-screen text was **“Check your offline cloud copy.”**, **“For people keeping a fallback drive, find missing and outdated cloud files before relying on it.”**, and **“Try it with sample data”** / **“Shows a sample gap report right away.”** Both sizes answer all three questions, so the cold-read clarity gate passes.

## Findings

### F-4-1 — BLOCKING — “Works offline after first visit” is false for the first landing-page visit

**Quote/location:** Landing first-screen fact: **“Works offline after first visit.”** `.factory/claims.json` narrows this to **“The demo reloads offline after its first visit.”**

**Observed:** In a fresh 390px context, I opened `/`, waited until its service worker controlled the page, enabled offline mode, then opened `/demo/`. The URL became `/demo/`, but the service worker returned the cached home page: title **“Cloud Exit Evidence — Check an offline copy”**, h1 **“Check your offline cloud copy.”**, no demo banner, and no sample result. `site/public/sw.js` does not precache `/demo/` and falls back to `/` for an uncached request.

**Why:** A phone visitor reads the unqualified fact as “visit this site once, then the product works offline.” The listed `@claim:offline-reload` test first visits `/demo/`, reloads it online so it enters the runtime cache, and only then goes offline. The test proves the narrower manifest wording, not the sentence shown on the first screen. This reopens Review 1 findings 1, 4, and 7 and F-3-1/F-3-8; the history rule makes the regression blocking.

**Concrete fix:** Either precache `/demo/` and add a claim test that visits only `/`, goes offline, opens `/demo/`, and asserts the banner plus **Not ready** report, or rewrite the fact to **“Demo works offline after you open it.”** Then make the claim text and test use that exact scope.

### F-4-2 — BLOCKING — Demo errors still use the terminology earlier repairs claimed to remove

**Quote/location:** Live `/demo/` errors:

- **“Paste a manifest before running the audit.”**
- **“The JSON manifest could not be parsed. Check commas and quotation marks.”**
- **“Select a destination folder or load the evidence fixture.”**

The visible form calls these concepts **“File list,” “Check this file list,” “Folder to compare,”** and **“Load sample files.”**

**Why:** A first-time visitor meets two names for every core object and action exactly when something goes wrong. “Manifest,” “audit,” “destination,” and “fixture” are developer terms that the public copy deliberately replaced. This is a half-fix of Review 1 finding 6, F-2-9, and F-3-9, so it is blocking under the required history rule.

**Concrete fix:** Use **“Add a file list before checking.”**, **“This file list is not valid JSON. Check its commas and quotation marks.”**, and **“Select a folder or load the sample files.”** Change the transient **“Checking evidence…”** label to **“Checking files…”** and add browser tests for all three errors.

### F-4-3 — Major — The command-line no-account promise has no matching claim entry

**Quote/location:** Landing command-line section: **“It does not need an account or a network connection.”** README opening: **“It does not sign in, copy files, or restore files.”**

**Why:** `no-account` promises only that the website demo needs no account, while `cli-no-network` promises no network client and no usage data. Neither entry states or tests the command-line tool's no-account/no-sign-in behavior. The CLI demo succeeds without credentials, but that evidence is not inventoried against this public promise.

**Concrete fix:** Add `cli-no-account` with a tagged clean-environment test that runs help, demo, and audit without credentials, account files, or authentication prompts. Alternatively remove the account/sign-in wording and keep the tested no-network/read-only statements.

### F-4-4 — Major — The README build-output promise is absent from `claims.json`

**Quote/location:** README, “Develop and verify”: **“`npm run build` writes the release binary and `dist/site/`.”**

**Why:** This is a concrete result a contributor relies on, but none of the 21 claim entries covers it. I ran the command and it currently passes, but an ad hoc review run is not the required permanent tagged claim test.

**Concrete fix:** Add `build-artifacts` and a tagged test that starts without `dist/`, runs the production build, and asserts the release executable and `dist/site/index.html`; or remove the outcome sentence from visitor-facing documentation.

### F-4-5 — Major — The landing sections do not follow the required information order

**Location:** Live landing sequence: first screen → **“Compare files in three steps.”** → **“See a sample gap report.”** → **“Run the full check offline.”** → footer.

**Why:** The required skeleton puts the product/live preview before “How it works” and includes a later plain-language “what it does not do / privacy” section. The current sample preview comes after the explanation, and there is no dedicated limitations/privacy section. Scattered hero facts and the Privacy link do not provide the required scan point explaining that this checks evidence but neither creates nor restore-tests a backup.

**Concrete fix:** Move **“See a sample gap report”** directly after the first screen. Follow “How it works” with a short section such as **“What this check does not do”**: **“It does not copy or restore files. Your file list stays local. Keep versioned media and test real restores.”** Map each factual sentence to existing or new claims.

### F-4-6 — Minor — The Terms page makes an unlisted change-record commitment

**Quote/location:** `/terms/`, “Changes”: **“Material changes appear in the project changelog and this effective date. Repository history is the public record.”**

**Why:** This is a process promise a user could rely on. No claim entry or tagged test checks the displayed date against `CHANGELOG.md`, and a future-facing commitment cannot be proved by the current suite.

**Concrete fix:** Remove the promise, or replace it with a dated, testable statement such as **“These terms were last updated on 28 August 2026.”** If the changelog statement remains, add a tagged check for the current terms date and matching changelog entry.

## Copy audit

Counts use word/number tokens; hyphenated terms and options count as one, while punctuation-only separators do not count. Code blocks and JSON examples are commands/data rather than sentences. No item exceeds 22 words, no banned marketing adjective appears, and the result-naming actions pass. `!` identifies a finding.

### Landing page

| Words | Type | Exact text | Flag |
| ---: | --- | --- | --- |
| 3 | label | Independent file-copy check | — |
| 5 | h1 | Check your offline cloud copy. | — |
| 16 | sentence | For people keeping a fallback drive, find missing and outdated cloud files before relying on it. | — |
| 5 | action | Try it with sample data | — |
| 7 | sentence | Shows a sample gap report right away. | — |
| 2 | fact | No uploads | — |
| 5 | fact | Works offline after first visit | ! F-4-1 |
| 3 | fact | Free under MIT | — |
| 3 | label | File copy check. | — |
| 11 | sentence | Compare a file list with the folder you plan to keep. | — |
| 3 | sentence | Keep versioned media. | — |
| 8 | sentence | Test real restores before relying on any copy. | — |
| 3 | label | How it works | — |
| 5 | h2 | Compare files in three steps. | — |
| 4 | h3 | Read your file list | — |
| 9 | sentence | Use JSON, CSV, or an rclone JSON file list. | — |
| 6 | sentence | Unsafe and duplicate paths are rejected. | — |
| 3 | h3 | Read your drive | — |
| 7 | sentence | Check the selected folder without following links. | — |
| 7 | sentence | Compare names, sizes, dates, and supplied hashes. | — |
| 4 | h3 | Show what needs work | — |
| 7 | sentence | See missing, old, changed, and excluded files. | — |
| 7 | sentence | Record accepted exclusions in the command-line report. | — |
| 3 | label | Sample file-copy check | — |
| 5 | h2 | See a sample gap report. | — |
| 9 | sentence | It compares three exported files with a partial folder. | — |
| 10 | sentence | The sample highlights two missing files and an open exclusion. | — |
| 2 | label | Sample result | — |
| 2 | status | Not ready | — |
| 6 | metric | 2 missing files · 1 open exclusion | — |
| 5 | action | Open the full local demo | — |
| 2 | label | Command line | — |
| 5 | h2 | Run the full check offline. | — |
| 4 | sentence | Use one command-line tool. | — |
| 10 | sentence | It does not need an account or a network connection. | ! F-4-3 (account half) |
| 1 | label | Reads | — |
| 6 | value | JSON, CSV, and rclone JSON lists | — |
| 1 | label | Checks | — |
| 5 | value | Names, sizes, dates, and hashes | — |
| 1 | label | Saves | — |
| 4 | value | Encrypted reports when requested | — |
| 1 | label | License | — |
| 1 | value | MIT | — |
| 13 | alt | Terminal recording of cloud-exit-evidence demo showing two missing files and one open exclusion. | — |
| 7 | caption | Recorded from the bundled sample: `cloud-exit-evidence demo`. | — |
| 6 | link | Read the source and file-list format | — |
| 11 | footer | Cloud Exit Evidence / Check an offline copy before relying on it. | — |

Other controls: **CEE / 001** (2), **Demo** (1), **How it works** (3), **Install** (1), **Privacy** (1), **Copy install command** (3), **Copy demo command** (3), **Terms** (1), **Source** (1), **Built by Param Factory** (4), and **Build polish-3** (2). None is vague or non-result-naming in context.

### README

| Words | Type | Exact text | Flag |
| ---: | --- | --- | --- |
| 3 | h1 | Cloud Exit Evidence | — |
| 11 | sentence | Check whether an offline cloud-file copy has the files you expect. | — |
| 14 | sentence | For people keeping a fallback drive, it lists missing, old, changed, and excluded files. | — |
| 10 | sentence | It compares a supplied file list with a local folder. | — |
| 10 | sentence | It does not sign in, copy files, or restore files. | ! F-4-3 (sign-in part) |
| 1 | h2 | Install | — |
| 8 | instruction | Build the Rust command-line tool from this repository: | — |
| 5 | instruction | Try the bundled sample immediately: | — |
| 11 | sentence | The command writes a sample folder in a new temporary directory. | — |
| 9 | sentence | It prints two missing files and one open exclusion. | — |
| 3 | h2 | Check a folder | — |
| 16 | instruction | Give the tool a JSON, CSV, or rclone JSON (`lsjson`) file list and an offline folder: | — |
| 6 | instruction | Use JSON output in a script. | — |
| 10 | sentence | Missing files make the default command exit with code 2: | — |
| 9 | instruction | Use `--acknowledge` only for an exclusion you have checked: | — |
| 10 | instruction | Use `--redact-paths` to replace printed file paths with stable labels. | — |
| 4 | h2 | Save an encrypted report | — |
| 13 | instruction | Set a passphrase outside the command line, then write an encrypted `.cee` report: | — |
| 11 | sentence | Saved reports are encrypted and need the supplied passphrase to decrypt. | — |
| 5 | sentence | Terminal output is not encrypted. | — |
| 5 | sentence | Protect or redirect it yourself. | — |
| 2 | h2 | File-list rules | — |
| 5 | sentence | JSON uses a `files` array. | — |
| 6 | sentence | Each file needs a relative `path`. | — |
| 8 | sentence | It can also include `size`, `modified`, and `sha256`. | — |
| 4 | sentence | CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. | — |
| 9 | sentence | rclone JSON lists use `Path`, `Size`, `ModTime`, and `IsDir`. | — |
| 7 | sentence | Paths must stay inside the selected folder. | — |
| 6 | sentence | Duplicate and escaping paths are rejected. | — |
| 9 | sentence | Links are reported as unsafe and are never followed. | — |
| 4 | h2 | Results and exit codes | — |
| 11 | result | `READY` means every listed file passed and no exclusion is open. | — |
| 12 | result | `READY WITH EXCEPTIONS` means every file passed and listed exclusions were acknowledged. | — |
| 12 | result | `NOT READY` means a file is missing, old, changed, unsafe, or unacknowledged. | — |
| 5 | sentence | A passing check exits 0. | — |
| 6 | sentence | A failed readiness check exits 2. | — |
| 7 | sentence | Invalid input or file errors exit 3. | — |
| 8 | instruction | Use `--fail-on exceptions` to fail on acknowledged exclusions. | — |
| 10 | instruction | Use `--fail-on never` to return 0 after any valid check. | — |
| 3 | h2 | Website and privacy | — |
| 10 | sentence | The site at `https://cloud-exit-evidence.sociobot.in` includes a local sample at `/demo/`. | — |
| 18 | sentence | The sample opens with a report, uses only `demo:` browser storage, and is removed when you leave it. | — |
| 12 | sentence | The browser sample does not upload file-list text or selected file details. | — |
| 5 | sentence | It contacts no third-party service. | — |
| 12 | sentence | The command-line tool has no network client and sends no usage data. | — |
| 3 | h2 | Develop and verify | — |
| 9 | sentence | `npm run build` writes the release binary and `dist/site/`. | ! F-4-4 |
| 8 | instruction | Deploy that static directory with its `staticwebapp.config.json` file. | — |
| 1 | h2 | License | — |
| 1 | sentence | MIT. | — |
| 2 | sentence | See `LICENSE`. | — |

The three live error strings in F-4-2 are 7, 7/5, and 9 words respectively. They pass length but fail terminology and first-read clarity.

## Demo and sandbox verification

- One click from the hero opened `/demo/` with the persistent **“Demo — sample data, nothing is saved”** banner.
- At 390 × 844, **Not ready** ended at y=488.7; the two missing paths ended at y=673.4 and y=730.0; the exclusion ended at y=786.7. All were visible without scrolling.
- A real-state sentinel was installed before navigation. Entry and Reset kept it unchanged; Reset restored only `demo:cloud-exit-evidence`; Start for real removed only the demo key.
- The online sample flow requested only `https://cloud-exit-evidence.sociobot.in` and logged no console/page errors.
- Offline reload after first opening `/demo/` passed. Offline navigation to `/demo/` after visiting only `/` failed as described in F-4-1.
- The release CLI demo ran from an empty temporary working directory, left that directory empty, created a separate `/tmp/cloud-exit-evidence-demo-*` directory, and reported exactly the two missing files plus `Phone/Documents/**`.

## Claims verification

Clean clone: `/tmp/cloud-exit-evidence-review4.xDrKVb` at `9259bc1aef3cc075083b9115c3f1a85ebe15040f`. Every manifest command was run separately and every id occurs exactly once in `tests/browser/site.spec.ts`.

| Claim | Result | Independent note |
| --- | --- | --- |
| demo-sample-report | Pass | Direct demo shows both missing paths and the exclusion. |
| demo-first-screen | Pass | All required result rows fit within 390 × 844. |
| demo-isolation | Pass | Entry/reset/exit preserve a pre-navigation real-state sentinel. |
| free-to-use | Pass | MIT text and no purchase path. |
| browser-local | Pass | Sample flow is same-origin only. |
| no-account | Pass | Website demo has no sign-in form; it does not cover F-4-3's CLI wording. |
| offline-reload | Pass as written | Reloads `/demo/` after visiting `/demo/`; it does not prove F-4-1's landing sentence. |
| routing-focus | Pass | Forward and Back focus the h1; announcement remains 1 × 1px. |
| cli-demo | Pass | Temp sample contents and landing transcript match. |
| cli-no-network | Pass | No network client and no usage files in the empty working directory. |
| cli-read-only | Pass | Manifest and destination hashes/inventories remain unchanged. |
| cli-formats-readiness | Pass | JSON/CSV/rclone and missing/stale/size/hash outcomes asserted. |
| duplicate-paths | Pass | All three formats reject duplicates. |
| cli-acknowledgement | Pass | Path, reason, note, status, and readiness asserted. |
| cli-exit-codes | Pass | Exact 0/2/3 outcomes asserted. |
| cli-redaction | Pass | Two labels remain distinct and stable across runs. |
| cli-fail-on | Pass | `exceptions` and `never` outcomes asserted. |
| cli-validation-and-links | Pass | Escaping path and symlink behavior asserted. |
| encrypted-report | Pass | Ciphertext, correct/wrong passphrases, and plain terminal output asserted. |
| site-no-third-party-runtime | Pass | All named routes and static source checked. |
| mit-license | Pass | Repository license text present. |

No listed command failed. F-4-1, F-4-3, F-4-4, and F-4-6 are copy-to-inventory mismatches or unlisted claims.

## Earlier-finding verification

| Earlier finding | Live/code result in round 4 |
| --- | --- |
| Review 1 / 1 — claims absent | Reopened by F-4-1, F-4-3, F-4-4, and F-4-6: inventory exists, but it still does not match all public claims. |
| Review 1 / 2 — demo/CLI sandbox | Fixed: one click, immediate result, banner, isolation, reset/exit, CLI temp sample, and recording pass. |
| Review 1 / 3 — routes/404 | Fixed: demo/legal deep links, branded 404, focus, Back, and announcements pass live. |
| Review 1 / 4 — first-screen copy | Reopened by F-4-1: job/audience/action/price are clear, but the offline fact overstates behavior. |
| Review 1 / 5 — metadata/skeleton | Metadata/shared chrome are fixed; the information-order portion remains incomplete as F-4-5. |
| Review 1 / 6 — jargon/misleading labels | Reopened by F-4-2: the visible controls changed, but the old terms remain in live errors. |
| Review 1 / 7 — unlisted claims | Reopened by F-4-1, F-4-3, F-4-4, and F-4-6. |
| F-2-1 — mobile result below fold | Fixed: status, two missing paths, and exclusion fit before y=844. |
| F-2-2 — recording mismatch | Fixed: browser, CLI, example, and SVG transcript agree. |
| F-2-3 — live route focus | Fixed under the live `no-referrer` policy. |
| F-2-4 — read-only claim | Fixed with before/after hashes and directory inventories. |
| F-2-5 — acknowledgement/exit codes | Fixed with exact result and numeric assertions. |
| F-2-6 — encryption wording | Fixed; public wording matches observable round-trip behavior. |
| F-2-7 — privacy inventory | Fixed for runtime origins/accounts; F-4-3 is the separate CLI account wording. |
| F-2-8 — sentence length | Fixed: no landing/README item exceeds 22 words. |
| F-2-9 — terminology | Reopened by F-4-2 in error states. |
| F-3-1 — first-screen offline/price facts | Price is fixed; offline wording is half-fixed and fails F-4-1. |
| F-3-2 — duplicate claim | Fixed for JSON, CSV, and rclone. |
| F-3-3 — stable redaction | Fixed with two paths across repeated runs. |
| F-3-4 — both failure modes | Fixed with exact exit behavior. |
| F-3-5 — unreadable result | Fixed; unsupported public wording remains removed. |
| F-3-6 — free claim | Fixed with MIT/no-purchase-path test. |
| F-3-7 — telemetry wording | Fixed to network-client/no-usage-data wording and test. |
| F-3-8 — whole-promise assertions | Earlier listed-test gaps are fixed, but the narrowed offline test still misses the broader live sentence (F-4-1). |
| F-3-9 — terminology | Reopened by F-4-2 in error states. |
| F-3-10 — 44px targets | Fixed: every visible mobile link/button measured at least 44 × 44px. |
| F-3-11 — visible announcement | Fixed: announcement is 1 × 1px off-screen and remains live. |
| F-3-12 — ambiguous Copy buttons | Fixed: install and demo buttons have distinct result names. |
| F-3-13 — vague terminal warning | Fixed with explicit unencrypted-output guidance. |
| F-3-14 — factory jargon | Fixed in the README. |

## Structure, accessibility, and visual identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and a missing route were checked at 390 × 844 and 1440 × 900. Each has `lang=en`, one h1, one main, route-specific title, description, canonical, OG/Twitter image, SVG favicon, Apple icon, header, and footer.
- The missing route returned HTTP 404 with the designed broadsheet page and a home action.
- Every discovered internal/external link returned 200, except the intentionally missing route's expected 404; every fragment target exists.
- Live forward and Back navigation focus the destination h1 and update the polite route announcement.
- Axe found zero serious/critical violations on all five routes at both sizes. Mobile had no horizontal overflow; visible targets were at least 44 × 44px. Reduced-motion mode left no active animation or transition.
- Live response headers include self-only CSP, permissions restrictions, `no-referrer`, `nosniff`, and frame denial. The site made same-origin requests only.
- The build emits 7.47 kB of main JavaScript and 1.57 kB of navigation JavaScript uncompressed, below the budget.
- The warm-paper evidence broadsheet, generated ledger/drive/cloud-cutout image, red proof marks, editorial rules, and squared controls match `.factory/design.md` and are not a generic SaaS template.
- F-4-5 is the remaining structural failure.

## Full suite

From the same clean clone:

- `npm test`: pass — 6 Rust unit tests, 3 CLI integration tests, 1 doctest, 4 Vitest tests, response-policy checks, and 56 Playwright tests passed; 2 viewport-inapplicable tests skipped.
- `npm run build`: pass — release binary and `dist/site/` produced.
- `/opt/fleet/lib/verify-url.sh`: pass for production root; HTTP 200, title/lang/main/alt/button/console checks clean.

## Missed leverage

No AI feature is justified. Exit readiness depends on deterministic local evidence; model output would weaken the trust and offline/privacy properties. The product already has the obvious imports (JSON, CSV, rclone), machine-readable/exportable reports, encrypted saved reports, and an isolated browser/CLI sample. Sync would contradict the stated boundary that this tool checks but does not copy or restore files. No leverage finding is added.

## What would make this perfect

Make the exact first-screen offline sentence true from a first landing visit, remove the old demo error vocabulary, inventory the CLI account and build-output promises, restore the required preview/how-it-works/limitations order, and remove or test the Terms change-record commitment. Then rerun every claim command from a clean clone and repeat the literal landing-first offline path.
