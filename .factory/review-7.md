# Adversarial first-read review 7 — Cloud Exit Evidence

Reviewed 2026-08-28 against production and clean clone `2195c6ce3ecd01a7ccbba322a2ddfa48234cf278`.

## Verdict: PASS

No blocking, major, or minor finding remains. All listed claims were independently exercised from a clean clone. Product code was not changed during this review.

## Cold read, before scrolling

Fresh 390 × 844 and 1440 × 1000 contexts loaded the landing page with no console errors. Before scrolling, the page answers all three questions:

- **What it does:** checks an offline cloud copy for missing and outdated files.
- **For whom:** people keeping a fallback drive.
- **What to click first:** **Try it with sample data**.

The exact supporting text is **“Check your offline cloud copy.”**, **“For people keeping a fallback drive, find missing and outdated cloud files before relying on it.”**, and **“Shows a sample gap report right away.”** The mobile page has no horizontal overflow.

## Demo and sandbox

The hero opened `/demo/` in one click. At 390 × 844, the first visible report contained **NOT READY**, both missing paths, and **Phone/Documents/** before the viewport ended. The persistent banner reads **“Demo — sample data, nothing is saved.”**

- Reset preserved `real:review7` and reset only `demo:cloud-exit-evidence` to the bundled sample.
- Start for real removed only the demo key and opened `/#install`.
- The Demo Home link removed only the demo key; browser Back re-entered with a fresh sample and retained real state.
- The complete demo flow requested only `https://cloud-exit-evidence.sociobot.in`.
- After a landing-only first visit and service-worker control, offline navigation to `/demo/` retained the demo banner and all three sample findings.
- The demo exposes no real file or folder input. Its sample is bundled; it is not a disguised real-data workflow.

The bundled CLI demo, file-list formats, read-only behavior, redaction, encryption, validation, exit modes, and no-account/no-network behavior are covered by the successful claim replay below. No AI feature is missing: this brief requires a deterministic local evidence check, while the product already includes the implied import formats, reports, and CLI demo.

## Copy audit

Counts treat hyphenated terms and command options as one word. Commands, structured data examples, and repeated navigation labels are excluded. Every sentence is at most 22 words; no banned marketing adjective appears; action labels name a concrete result. All functional statements map to a claim listed in `.factory/claims.json`.

### Landing page

| Words | Text | Result |
| ---: | --- | --- |
| 3 | Independent file-copy check | Label |
| 5 | Check your offline cloud copy. | H1 |
| 16 | For people keeping a fallback drive, find missing and outdated cloud files before relying on it. | Clear audience/result |
| 5 | Try it with sample data | Result-naming action |
| 7 | Shows a sample gap report right away. | `demo-first-screen` |
| 2 | No uploads | `browser-local` |
| 6 | Demo works offline after first visit | `offline-reload` |
| 3 | Free under MIT | `free-to-use` |
| 15 | An archival ledger holding a physical drive beside a cloud-shaped hole cut through the paper | Image alt |
| 3 | File copy check. | Label |
| 11 | Compare a file list with the folder you plan to keep. | `cli-formats-readiness` |
| 3 | Keep versioned media. | Advice |
| 8 | Test real restores before relying on any copy. | Advice |
| 3 | Sample file-copy check | Label |
| 5 | See a sample gap report. | `demo-sample-report` |
| 9 | It compares three exported files with a partial folder. | `demo-sample-report` |
| 10 | The sample highlights two missing files and an open exclusion. | `demo-sample-report` |
| 2 | Sample result | Label |
| 2 | Not ready | Status |
| 6 | 2 missing files · 1 open exclusion | `demo-sample-report` |
| 5 | Open the full local demo | Result-naming action |
| 3 | How it works | Label |
| 5 | Compare files in three steps. | H2 |
| 4 | Read your file list | H3 |
| 9 | Use JSON, CSV, or an rclone JSON file list. | `cli-formats-readiness` |
| 6 | Unsafe and duplicate paths are rejected. | `cli-validation-and-links`, `duplicate-paths` |
| 3 | Read your drive | H3 |
| 7 | Check the selected folder without following links. | `cli-validation-and-links` |
| 7 | Compare names, sizes, dates, and supplied hashes. | `cli-formats-readiness` |
| 4 | Show what needs work | H3 |
| 7 | See missing, old, changed, and excluded files. | `cli-formats-readiness` |
| 7 | Record accepted exclusions in the command-line report. | `cli-acknowledgement` |
| 2 | Limits | Label |
| 6 | What this check does not do. | H2 |
| 7 | It does not copy or restore files. | `cli-read-only` |
| 11 | The browser demo checks only bundled sample files in this tab. | `demo-sample-only`, `browser-local` |
| 3 | Keep versioned media. | Advice |
| 3 | Test real restores. | Advice |
| 2 | Command line | Label |
| 5 | Run the full check offline. | `cli-no-network` |
| 5 | Use one command-line tool. | Plain instruction |
| 10 | It does not need an account or a network connection. | `cli-no-account`, `cli-no-network` |
| 6 | JSON, CSV, and rclone JSON lists | `cli-formats-readiness` |
| 5 | Names, sizes, dates, and hashes | `cli-formats-readiness` |
| 4 | Encrypted reports when requested | `encrypted-report` |
| 1 | MIT | `mit-license` |
| 13 | Terminal recording of cloud-exit-evidence demo showing two missing files and one open exclusion. | `cli-demo` |
| 7 | Recorded from the bundled sample: cloud-exit-evidence demo. | `cli-demo` |
| 6 | Read the source and file-list format | Link |
| 11 | Cloud Exit Evidence / Check an offline copy before relying on it. | Footer |

### README

| Words | Text | Claim / result |
| ---: | --- | --- |
| 11 | Check whether an offline cloud-file copy has the files you expect. | Plain job statement |
| 14 | For people keeping a fallback drive, it lists missing, old, changed, and excluded files. | `cli-formats-readiness` |
| 10 | It compares a supplied file list with a local folder. | `cli-formats-readiness` |
| 10 | It does not sign in, copy files, or restore files. | `cli-no-account`, `cli-read-only` |
| 8 | Build the Rust command-line tool from this repository. | Instruction |
| 5 | Try the bundled sample immediately. | `cli-demo` |
| 11 | The command writes a sample folder in a new temporary directory. | `cli-demo` |
| 9 | It prints two missing files and one open exclusion. | `cli-demo` |
| 16 | Give the tool a JSON, CSV, or rclone JSON file list and an offline folder. | `cli-formats-readiness` |
| 6 | Use JSON output in a script. | Instruction |
| 10 | Missing files make the default command exit with code 2. | `cli-exit-codes` |
| 9 | Use `--acknowledge` only for an exclusion you have checked. | `cli-acknowledgement` |
| 10 | Use `--redact-paths` to replace printed file paths with stable labels. | `cli-redaction` |
| 13 | Set a passphrase outside the command line, then write an encrypted `.cee` report. | `encrypted-report` |
| 11 | Saved reports are encrypted and need the supplied passphrase to decrypt. | `encrypted-report` |
| 5 | Terminal output is not encrypted. | `encrypted-report` |
| 5 | Protect or redirect it yourself. | Next action |
| 5 | JSON uses a `files` array. | `cli-formats-readiness` |
| 6 | Each file needs a relative `path`. | `cli-validation-and-links` |
| 8 | It can also include `size`, `modified`, and `sha256`. | `cli-formats-readiness` |
| 4 | CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. | `cli-formats-readiness` |
| 9 | rclone JSON lists use `Path`, `Size`, `ModTime`, and `IsDir`. | `cli-formats-readiness` |
| 7 | Paths must stay inside the selected folder. | `cli-validation-and-links` |
| 6 | Duplicate and escaping paths are rejected. | `duplicate-paths`, `cli-validation-and-links` |
| 9 | Links are reported as unsafe and are never followed. | `cli-validation-and-links` |
| 11 | READY means every listed file passed and no exclusion is open. | `cli-formats-readiness` |
| 12 | READY WITH EXCEPTIONS means every file passed and listed exclusions were acknowledged. | `cli-acknowledgement` |
| 12 | NOT READY means a file is missing, old, changed, unsafe, or unacknowledged. | CLI outcome suite |
| 5 | A passing check exits 0. | `cli-exit-codes` |
| 6 | A failed readiness check exits 2. | `cli-exit-codes` |
| 7 | Invalid input or file errors exit 3. | `cli-exit-codes` |
| 8 | Use `--fail-on exceptions` to fail on acknowledged exclusions. | `cli-fail-on` |
| 10 | Use `--fail-on never` to return 0 after any valid check. | `cli-fail-on` |
| 10 | The site at cloud-exit-evidence.sociobot.in includes a local sample at /demo/. | `demo-sample-report` |
| 18 | The sample opens with a report, uses only demo: browser storage, and is removed when you leave it. | `demo-isolation` |
| 10 | The browser demo accepts no real file list or folder. | `demo-sample-only` |
| 11 | It checks only bundled sample files and contacts no third-party service. | `demo-sample-only`, `browser-local` |
| 12 | Choose Start for real to leave demo storage and open the command-line setup. | `demo-isolation` |
| 12 | The command-line tool has no network client and sends no usage data. | `cli-no-network` |
| 9 | npm run build writes the release binary and dist/site/. | `build-artifacts` |
| 8 | Deploy that static directory with its staticwebapp.config.json file. | Instruction |
| 1 | MIT. | `mit-license` |
| 2 | See LICENSE. | `mit-license` |

Terminology remains consistent: **check**, **file list**, **folder/offline copy**, **command-line tool**, and **exclusion**. Headings are meaningful in context; the initial H1 is a five-word job statement.

## Claims and local verification

Clean clone: `/tmp/cloud-exit-evidence-review7.lyM1Sp` at `2195c6c`. Every one of the 25 `.factory/claims.json` commands was run separately. All passed:

- Demo report, mobile first screen, isolation, sample-only boundary, browser-local privacy, no-account, offline reload, and route focus.
- CLI demo, no-network, no-account, read-only behavior, JSON/CSV/rclone formats, duplicate rejection, acknowledgement, exit codes, redaction, failure modes, unsafe paths/links, and encryption.
- Whole-site third-party-runtime check, build artifacts, Terms date, and MIT license.

Each claim identifier occurs exactly once in a tagged test definition. The full `npm test` passed; Playwright’s final run status was `passed` with no failed tests. `npm run build` passed and emitted the release binary plus `dist/site/`. The production static payload remains well below the 200 KB JavaScript budget (main JavaScript is 4.24 kB uncompressed).

## Structure, accessibility, and links

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with route-specific title, description, canonical, Open Graph/Twitter fields, SVG favicon, and Apple touch icon.
- The unknown route returned the designed HTTP 404 with **“This page is not in the record.”** and a home action.
- Each normal route has one H1, one main landmark, shared header/footer, Privacy and Terms links, a skip link, and the Factory credit/build label.
- Home, demo, Privacy, Terms, Source, Factory, robots, sitemap, icons, and social image all returned 200. No dead link was found.
- Direct paths, reload, Back/Forward, h1 focus, and polite route announcement worked. All normal-route loads had no console or page errors.
- The browser suite includes zero-violation Axe checks, keyboard/focus coverage, 44 px mobile target checks, and reduced-motion coverage. The live 390 px pass showed no clipping or horizontal scroll.
- The warm-paper, monochrome broadsheet, original ledger/drive/cloud-cutout image, proof-red accents, narrow rules, and typesetting conform to `.factory/design.md` and are visually distinct from a generic SaaS template.

## Earlier-finding verification

| Earlier findings | Confirmed result on live site and code |
| --- | --- |
| Review 1: 1–7 | Claim inventory/tests, direct isolated demo and CLI demo, branded routes/404, first-screen copy, metadata/shared chrome, plain terminology, and claim coverage remain fixed. |
| Review 2: F-2-1–F-2-9 | Phone result is first-screen; CLI/browser/example/transcript agree; focus, read-only, acknowledgement/exits, encryption, privacy, sentence length, and terms remain fixed. |
| Review 3: F-3-1–F-3-14 | Offline/price, duplicate paths, redaction, both failure modes, limited claims, MIT/no-network language, outcome-level tests, consistent language, touch targets, hidden announcer, labelled copy controls, terminal warning, and public README wording remain fixed. |
| Review 4: F-4-1–F-4-6 | Landing-first offline demo, removed editable demo errors, CLI no-account, build artifact evidence, required landing order/limits, and the testable Terms date remain fixed. |
| Review 5: F-5-1 | Demo contains no real file/folder input and does not read injected real file details. |
| Review 6: F-6-1–F-6-2 | All ordinary demo exits discard only demo state; live accessibility checks remain zero-violation. |
| Polish 1–6 / prior handoff | Their stated closures were confirmed rather than accepted on assertion alone by the cold live checks, clean-clone claim replay, source inspection, and full suite. |

## What would make this perfect

Keep the current evidence discipline: preserve the one-click sample, separate demo namespace, direct offline path, and one observable test for every visitor-facing promise as the product changes. No concrete missing feature or repair is identified in this round.
