# Adversarial first-read review 3 — Cloud Exit Evidence

Reviewed 2026-08-28 against production and clean clone `dcc295b71f311795a0a3360afa3e43002ada98aa`.

## Verdict: FAIL

The core job is clear, the browser and command-line demos work, and every listed claim command passes. This is still a fail. The first screen omits the required price fact, several public promises are absent from the claim inventory, earlier terminology work is incomplete, and mobile controls miss the product's 44px target. The click path also exposes the route announcement as visible page text.

## Cold read before scrolling

Fresh 390 × 844 and 1440 × 1000 contexts loaded the live home page with no console errors or horizontal overflow.

- **What it does:** checks whether an offline cloud copy is missing or has outdated files.
- **For whom:** someone keeping a fallback drive before relying on it.
- **What to click first:** **“Try it with sample data.”**

The first-screen text that supplied those answers was **“Check your offline cloud copy.”**, **“For people keeping a fallback drive, find missing and outdated cloud files before relying on it.”**, and **“Try it with sample data”** with **“Shows a sample gap report right away.”** The narrow cold-read blocker does not apply.

## Blocking findings

### F-3-1 — The first-screen facts omit price and explicit offline behavior (reopens review 1 finding 4)

**Location / quote:** Live home, 390px and desktop: **“No account” · “No upload” · “Runs locally.”**

**Why:** The mandatory first-screen shape calls for privacy, offline behavior, and price. The current set covers setup/privacy, but it neither says “offline” nor says that the product is free. Review 1 prescribed **“No account, No upload, Free”**; the repair substituted **“Runs locally.”** This is a half-fix and is blocking under the history rule.

**Fix:** Use three tested facts such as **“No uploads” · “Works offline” · “Free under MIT.”** Add a `free-to-use` claim test that checks the public license and confirms there is no purchase or paywall path.

### F-3-2 — Duplicate-path rejection is an unlisted claim (reopens review 1 findings 1 and 7)

**Location / quote:** Landing: **“Unsafe and duplicate paths are rejected.”** README: **“Duplicate and escaping paths are rejected.”**

**Why:** `cli-validation-and-links` lists escaping paths and links, not duplicate paths. A normal user can rely on duplicate detection to prevent false coverage totals. A non-claim unit test exists, but the promise has no claim entry and no `@claim:` test.

**Fix:** Add a `duplicate-paths` claim and one tagged test that submits duplicate entries to both supported parsers named by the public copy, then asserts rejection. Alternatively remove “duplicate” from public copy.

### F-3-3 — Stable redaction is an unlisted claim (reopens review 1 findings 1 and 7)

**Location / quote:** README: **“Use `--redact-paths` to replace printed file paths with stable labels.”**

**Why:** `cli-redaction` proves only that one original path disappears and that `path:` is printed. It does not assert that repeated runs produce the same label or that different paths do not collapse to one label.

**Fix:** Expand the claim to include stability and test two runs plus two distinct paths, or replace “stable labels” with the narrower tested wording **“redacted labels.”**

### F-3-4 — Both `--fail-on` modes are unlisted claims (reopens review 1 findings 1 and 7)

**Location / quote:** README: **“The `--fail-on` option chooses the exit rule. Use `--fail-on exceptions` or `--fail-on never` when needed.”**

**Why:** `cli-exit-codes` covers only the default policy. Neither alternate mode appears in `claims.json`, and “when needed” does not tell a first-time user what either result is.

**Fix:** Add a `cli-fail-on` claim with fixtures proving that `exceptions` exits 2 for acknowledged exclusions and `never` exits 0 after a valid not-ready check. Rewrite as **“Use `--fail-on exceptions` to fail on acknowledged exclusions. Use `--fail-on never` to return 0 after any valid check.”**

### F-3-5 — “Unreadable” is an unlisted readiness result (reopens review 1 findings 1 and 7)

**Location / quote:** README: **“`NOT READY` means a file is missing, old, changed, unsafe, unreadable, or unacknowledged.”**

**Why:** No claim or tagged fixture makes a destination entry unreadable and asserts a not-ready result. The listed format claim covers missing, stale, size, and hash gaps; the link claim covers unsafe links.

**Fix:** Add an `unreadable-file` claim and a fixture that reliably produces a read failure under the test user, or remove “unreadable” from the result definition.

### F-3-6 — “Free” is a live, unlisted claim (reopens review 1 findings 1 and 7)

**Location / quote:** `/terms/` and its meta description: **“The software and website are free under the MIT License.”**

**Why:** `mit-license` verifies the license text, not the absence of a charge or paywall. This matters because price must also be stated on the first screen (F-3-1).

**Fix:** Add the `free-to-use` claim described in F-3-1, or remove “free” everywhere. The brief says the product is free, so listing and testing it is the useful fix.

### F-3-7 — “No telemetry” exceeds the listed no-network claim (reopens review 1 findings 1 and 7)

**Location / quote:** README: **“The CLI contains no network client or telemetry.”** Privacy: **“The command-line tool makes no network requests or telemetry.”**

**Why:** `cli-no-network` scans for network-client code and dependencies. Its claim text does not promise no telemetry, and its test does not check for unrequested local usage records. “Telemetry” is also unexplained jargon.

**Fix:** Narrow both sentences to **“The command-line tool has no network client and sends no usage data.”** List that exact claim and test network absence plus no unrequested state files in an isolated run.

### F-3-8 — Six listed claim tests do not assert their whole promise (reopens review 1 finding 1)

**Location / evidence:** `tests/browser/site.spec.ts` and `.factory/claims.json`.

- `demo-isolation` creates its real-data sentinel only after `/demo/` has loaded, so it cannot detect damage during demo entry.
- `cli-demo` checks output text but never parses the printed temporary path or checks the seeded files there.
- `cli-formats-readiness`, `cli-redaction`, and the symlink half of `cli-validation-and-links` silently pass if the command unexpectedly exits 0 because their assertions exist only inside `catch` blocks.
- `cli-acknowledgement` checks only `readiness`; it does not confirm the promised accepted exclusion and note are recorded in the report.

**Why:** All five commands passed, but a passing test is not evidence for behavior it never asserts. This leaves listed claims partly untested.

**Fix:** Seed real storage with `addInitScript` before navigation; inspect the CLI demo directory; explicitly fail when a gap command returns 0; and assert the acknowledgement path and note in output.

### F-3-9 — Terminology is still inconsistent and undefined (reopens F-2-9)

**Location / quotes:** Landing title/OG: **“Cloud Exit Evidence — Audit an offline copy”** while the page consistently calls the job a **“check.”** README: **“The CLI contains…”** while the chosen term is **“command-line tool.”** README also says **“exit rule”** and **“when needed”** without defining either mode.

**Why:** F-2-9 required consistent “check” and “command-line tool” wording and an explanation of `--fail-on`. `.factory/polish-2.md` marks it fixed, but these exact exceptions remain. This is a half-fix and therefore blocking.

**Fix:** Use **“Cloud Exit Evidence — Check an offline copy,” “The command-line tool…,”** and F-3-4's explicit two-sentence option explanation.

## Major findings

### F-3-10 — Mobile touch targets are smaller than 44px

**Location / evidence:** Live 390px measurements: **Reset demo** and **Start for real** are 38.8px high; the wordmark is 18.6px high; footer links are 20.1px high; header **Demo/Home** targets are 39.8px wide. Source explicitly reduces demo controls to `min-height: 38px` below 700px.

**Why:** This violates the attached accessibility and site-structure baseline and the design document's “at least 44px” rule. The smallest controls occur on the required phone path.

**Fix:** Give every interactive target a minimum 44 × 44px hit area without changing the visible type size. Add a 390px test that measures all rendered links, buttons, and their associated input labels.

### F-3-11 — Route announcements are visible page text

**Location / evidence:** Click the live hero action. **“Demo — Cloud Exit Evidence”** appears at y=0 in a 24.8px-high block above the header. Back navigation similarly exposes **“Cloud Exit Evidence — Audit an offline copy.”** `.route-announcement` has no visually-hidden styling.

**Why:** The live region should announce navigation to assistive technology, not appear as an unexplained duplicate title. It shifts the phone demo and consumes the margin that lets the last sample gap fit at y=814.

**Fix:** Apply the existing visually-hidden treatment to `.route-announcement` while retaining `aria-live="polite"`. Add a route test that checks both announcement text and a clipped/off-screen visual box.

## Minor copy findings

### F-3-12 — Both command copy buttons have the same non-specific name

**Location / quote:** Landing command section: two buttons both named **“Copy.”**

**Why:** “Copy” does not name the result, and a screen-reader button list cannot distinguish the install command from the demo command.

**Fix:** Use **“Copy install command”** and **“Copy demo command.”**

### F-3-13 — The terminal-output warning is vague

**Location / quote:** README: **“Plain terminal output remains under your control.”**

**Why:** “Under your control” does not say whether the output is encrypted or what action the reader should take.

**Fix:** Replace it with **“Terminal output is not encrypted. Protect or redirect it yourself.”**

### F-3-14 — The README exposes unexplained factory jargon

**Location / quote:** README: **“Registry publishing is factory-owned; do not publish from this checkout.”**

**Why:** A public reader has no context for “factory-owned,” and the sentence describes an internal release boundary rather than how to use the product.

**Fix:** Remove the sentence from the public README or write **“Only maintainers publish releases. Do not publish from this checkout.”**

## Complete copy audit

Counts use whitespace-separated words; hyphenated terms and options count as one. Code blocks and JSON examples are executable/structured data, not sentences. Headings, labels, actions, and alt text are included because the plain-words rules apply to them. No item exceeds 22 words and no banned marketing adjective appears. `!` maps each flag to a finding above.

### Landing page

| Words | Type | Text | Flag |
| ---: | --- | --- | --- |
| 3 | label | Independent file-copy check | |
| 5 | h1 | Check your offline cloud copy. | |
| 16 | sentence | For people keeping a fallback drive, find missing and outdated cloud files before relying on it. | |
| 5 | action | Try it with sample data | |
| 7 | sentence | Shows a sample gap report right away. | |
| 2 | fact | No account | ! F-3-1: required price fact is absent from this set |
| 2 | fact | No upload | ! F-3-1: required price fact is absent from this set |
| 2 | fact | Runs locally | ! F-3-1: required price fact is absent from this set |
| 3 | label | File copy check. | |
| 11 | sentence | Compare a file list with the folder you plan to keep. | |
| 3 | sentence | Keep versioned media. | |
| 8 | sentence | Test real restores before relying on any copy. | |
| 3 | label | How it works | |
| 5 | h2 | Compare files in three steps. | |
| 4 | h3 | Read your file list | |
| 9 | sentence | Use JSON, CSV, or an rclone JSON file list. | |
| 6 | sentence | Unsafe and duplicate paths are rejected. | ! F-3-2 |
| 3 | h3 | Read your drive | |
| 7 | sentence | Check the selected folder without following links. | |
| 7 | sentence | Compare names, sizes, dates, and supplied hashes. | |
| 4 | h3 | Show what needs work | |
| 7 | sentence | See missing, old, changed, and excluded files. | |
| 7 | sentence | Record accepted exclusions in the command-line report. | ! F-3-8: listed test does not assert the record |
| 3 | label | Sample file-copy check | |
| 5 | h2 | See a sample gap report. | |
| 9 | sentence | It compares three exported files with a partial folder. | |
| 10 | sentence | The sample highlights two missing files and an open exclusion. | |
| 2 | label | Sample result | |
| 2 | status | Not ready | |
| 6 | metric | 2 missing files · 1 open exclusion | |
| 5 | action | Open the full local demo | |
| 2 | label | Command line | |
| 5 | h2 | Run the full check offline. | |
| 5 | sentence | Use one Rust command-line tool. | |
| 10 | sentence | It does not need an account or a network connection. | |
| 1 | label | Reads | |
| 6 | value | JSON, CSV, and rclone JSON lists | |
| 1 | label | Checks | |
| 5 | value | Names, sizes, dates, and hashes | |
| 1 | label | Saves | |
| 4 | value | Encrypted reports when requested | |
| 1 | label | License | |
| 1 | value | MIT | |
| 13 | alt | Terminal recording of cloud-exit-evidence demo showing two missing files and one open exclusion. | |
| 7 | caption | Recorded from the bundled sample: `cloud-exit-evidence demo`. | |
| 6 | link | Read the source and file-list format | |
| 11 | sentence | Cloud Exit Evidence / Check an offline copy before relying on it. | |

Landing controls not naturally included above: **CEE / 001** (2), **Demo** (1), **How it works** (3), **Install** (1), **Privacy** (1), two **Copy** buttons (1 each, ! F-3-12), **Terms** (1), **Source** (1), **Built by Param Factory** (4), and **Build polish-2** (2). The document title/OG title **“Cloud Exit Evidence — Audit an offline copy”** is 7 words and is flagged by F-3-9.

### README

| Words | Type | Text | Flag |
| ---: | --- | --- | --- |
| 3 | h1 | Cloud Exit Evidence | |
| 11 | sentence | Check whether an offline cloud-file copy has the files you expect. | |
| 14 | sentence | For people keeping a fallback drive, it lists missing, old, changed, and excluded files. | |
| 10 | sentence | It compares a supplied file list with a local folder. | |
| 10 | sentence | It does not sign in, copy files, or restore files. | |
| 1 | h2 | Install | |
| 8 | instruction | Build the Rust command-line tool from this repository: | |
| 5 | instruction | Try the bundled sample immediately: | |
| 11 | sentence | The command writes a sample folder in a new temporary directory. | ! F-3-8: tagged test does not inspect the folder |
| 9 | sentence | It prints two missing files and one open exclusion. | |
| 3 | h2 | Check a folder | |
| 16 | instruction | Give the tool a JSON, CSV, or rclone JSON (`lsjson`) file list and an offline folder: | |
| 6 | instruction | Use JSON output in a script. | |
| 10 | sentence | Missing files make the default command exit with code 2: | |
| 9 | instruction | Use `--acknowledge` only for an exclusion you have checked: | |
| 10 | instruction | Use `--redact-paths` to replace printed file paths with stable labels. | ! F-3-3 |
| 4 | h2 | Save an encrypted report | |
| 13 | instruction | Set a passphrase outside the command line, then write an encrypted `.cee` report: | |
| 11 | sentence | Saved reports are encrypted and need the supplied passphrase to decrypt. | |
| 7 | sentence | Plain terminal output remains under your control. | ! F-3-13 |
| 2 | h2 | File-list rules | |
| 5 | sentence | JSON uses a `files` array. | |
| 6 | sentence | Each file needs a relative `path`. | |
| 8 | sentence | It can also include `size`, `modified`, and `sha256`. | ! F-3-8: cross-format field behavior is not fully asserted |
| 4 | sentence | CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. | ! F-3-8: listed test uses only `path,size` |
| 9 | sentence | rclone JSON lists use `Path`, `Size`, `ModTime`, and `IsDir`. | ! F-3-8: listed test uses only `Path,Size` |
| 7 | sentence | Paths must stay inside the selected folder. | |
| 6 | sentence | Duplicate and escaping paths are rejected. | ! F-3-2 |
| 9 | sentence | Links are reported as unsafe and are never followed. | ! F-3-8: symlink branch can silently pass |
| 4 | h2 | Results and exit codes | |
| 11 | result | `READY` means every listed file passed and no exclusion is open. | |
| 12 | result | `READY WITH EXCEPTIONS` means every file passed and listed exclusions were acknowledged. | |
| 13 | result | `NOT READY` means a file is missing, old, changed, unsafe, unreadable, or unacknowledged. | ! F-3-5 |
| 5 | sentence | A passing check exits 0. | |
| 6 | sentence | A failed readiness check exits 2. | |
| 7 | sentence | Invalid input or file errors exit 3. | |
| 7 | sentence | The `--fail-on` option chooses the exit rule. | ! F-3-4, F-3-9 |
| 8 | instruction | Use `--fail-on exceptions` or `--fail-on never` when needed. | ! F-3-4, F-3-9 |
| 3 | h2 | Website and privacy | |
| 10 | sentence | The site at `https://cloud-exit-evidence.sociobot.in` includes a local sample at `/demo/`. | |
| 18 | sentence | The sample opens with a report, uses only `demo:` browser storage, and is removed when you leave it. | ! F-3-8: entry-time isolation is not asserted |
| 12 | sentence | The browser sample does not upload file-list text or selected file details. | |
| 6 | sentence | It calls no third-party runtime service. | ! F-3-9: unnecessary jargon; use “contacts no third-party service” |
| 8 | sentence | The CLI contains no network client or telemetry. | ! F-3-7, F-3-9 |
| 3 | h2 | Develop and verify | |
| 9 | sentence | `npm run build` writes the release binary and `dist/site/`. | |
| 8 | instruction | Deploy that static directory with its `staticwebapp.config.json` file. | |
| 10 | sentence | Registry publishing is factory-owned; do not publish from this checkout. | ! F-3-14 |
| 1 | h2 | License | |
| 1 | sentence | MIT. | |
| 2 | sentence | See `LICENSE`. | |

## Demo and sandbox result

The hero reaches `/demo/` in one click. At 390 × 844, the loaded report shows **Not ready**, `Photos/2026/birthday.webp`, `Documents/tax-return.pdf`, and `Phone/Documents/**`; the last row ends at y=814. The persistent demo banner, Reset, and Start for real are present. Desktop shows the live **Not ready** report in its first screen.

The live sandbox passed an adversarial storage check: a `real:before-demo` key seeded before navigation remained unchanged; Reset replaced only `demo:cloud-exit-evidence`; Start for real removed only that demo key. Network interception saw only `https://cloud-exit-evidence.sociobot.in`, and a service-worker-controlled reload rendered the report offline. There were no console errors.

The release CLI demo was run from an empty temporary working directory. It created `/tmp/cloud-exit-evidence-demo-*`, left the working directory empty, printed two missing files plus the Android exclusion, and matched the landing recording.

## Claims verification

Fresh clone: `/tmp/cloud-exit-evidence-review3.GutVIf`. Every command was run individually exactly as listed in `.factory/claims.json`.

| Claim id | Result |
| --- | --- |
| demo-sample-report | Pass |
| demo-first-screen | Pass |
| demo-isolation | Pass command; incomplete assertion (F-3-8) |
| browser-local | Pass |
| no-account | Pass |
| offline-reload | Pass |
| routing-focus | Pass |
| cli-demo | Pass command; incomplete assertion (F-3-8) |
| cli-no-network | Pass; does not list/prove “no telemetry” (F-3-7) |
| cli-read-only | Pass |
| cli-formats-readiness | Pass command; incomplete negative assertions and schema coverage (F-3-8) |
| cli-acknowledgement | Pass command; report evidence not asserted (F-3-8) |
| cli-exit-codes | Pass |
| cli-redaction | Pass command; its negative assertion can silently pass, and “stable” remains unlisted (F-3-3, F-3-8) |
| cli-validation-and-links | Pass command; symlink branch can silently pass (F-3-8) |
| encrypted-report | Pass |
| site-no-third-party-runtime | Pass |
| mit-license | Pass; “free” remains unlisted (F-3-6) |

`npm test` also passed in the clean clone: 6 Rust unit tests, 3 CLI integration tests, 1 doctest, 4 Vitest tests, response-policy verification, and 49 Playwright tests passed with the intended desktop-only skip for the mobile viewport claim. The published landing install command installed `cloud-exit-evidence 0.1.0` from GitHub successfully.

## History verification

| Earlier finding | Live and code result |
| --- | --- |
| Review 1 / 1 — no claims verification | Reopened by F-3-2 through F-3-8: the manifest exists and commands pass, but public claims and whole-promise assertions remain missing. |
| Review 1 / 2 — demo/CLI sandbox | Fixed in behavior: one click, direct route, banner, reset/exit isolation, matching bundled CLI sample, and terminal recording all work. F-3-8 is a test-completeness defect, not a live demo failure. |
| Review 1 / 3 — demo route and 404 | Fixed: direct routes, reload, Back/Forward focus, announcements, and designed 404 work. F-3-11 is a new presentation defect in the announcer. |
| Review 1 / 4 — first-screen shape | Reopened by F-3-1: job, audience, and action are clear, but price is still absent from the three facts. |
| Review 1 / 5 — metadata/skeleton | Fixed: titles, descriptions, canonical/OG/Twitter, icons, shared footer, and build id are present. |
| Review 1 / 6 — jargon/misleading labels | The original landing controls are fixed. Remaining README/title inconsistencies reopen F-2-9 instead. |
| Review 1 / 7 — unlisted claims | Reopened by F-3-2 through F-3-8. |
| F-2-1 — mobile demo result | Fixed: all sample gaps fit by y=814 at 390 × 844. |
| F-2-2 — recording mismatch | Fixed: browser, CLI, example, SVG transcript, and landing text all name the same two missing files and exclusion. |
| F-2-3 — deployed route focus | Fixed: live forward and Back navigation focus the new h1 under `no-referrer`. |
| F-2-4 — read-only claim | Fixed: tagged test hashes and inventories the supplied inputs. |
| F-2-5 — acknowledgement/exit codes | Fixed for readiness and default numeric exit codes; the narrower report assertion gap is F-3-8. |
| F-2-6 — encryption wording | Fixed: public copy matches the tested passphrase round trip. |
| F-2-7 — site privacy inventory | Fixed for accounts, analytics, ads, fonts, scripts, and runtime origins. Telemetry wording is a separate gap (F-3-7). |
| F-2-8 — sentence over 22 words | Fixed: no landing or README item exceeds 22 words. |
| F-2-9 — inconsistent terms | Reopened by F-3-9. |

## Structure, accessibility, and identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and an unknown route have the correct status, `lang`, one h1, one main, route title, description, canonical, OG image, and favicon/Apple icon. The unknown path returns the designed product 404.
- All internal and external links crawled from those pages returned 200; in-page anchors resolve to existing targets. Back/Forward and direct deep links work.
- Live Axe found zero serious or critical violations on all five routes at 390px and desktop. Reduced-motion mode left no active animation or transition.
- Response headers include the intended CSP, permissions policy, `no-referrer`, `nosniff`, and frame denial. Runtime requests were same-origin only.
- The warm-paper evidence broadsheet, ledger/drive/cloud-cutout art, red proof marks, editorial rules, and squared controls match `.factory/design.md`. It is recognisable and not a generic SaaS template.
- Touch sizing and the visible announcer still fail F-3-10 and F-3-11.

## Missed leverage

No AI feature is justified. This job depends on deterministic, local file evidence; model output would weaken the result and the offline/privacy promise. The product already supplies the valuable import/export surface implied by the brief: JSON, CSV, and rclone lists; terminal/JSON/Markdown output; encrypted reports; and a bundled demo. It should not add sync because the brief explicitly distinguishes checking from copying or restoring.

## What would make this perfect

Close every finding above: state and test the free price, enumerate every public behavior as a claim, make each tagged test assert the entire promise, finish the “check”/“command-line tool” terminology pass, restore 44px targets, visually hide the live announcer, and make both Copy buttons self-identifying. Re-run all claim commands from another clean clone and repeat the cold live phone click path before considering a pass.
