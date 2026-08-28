# Adversarial first-read review 5 — Cloud Exit Evidence

Reviewed 2026-08-28 against production at <https://cloud-exit-evidence.sociobot.in/> and clean clone `a789aefe2cb777da8f27900f4a1a9312db6829a3` in `/tmp/cloud-exit-evidence-review5`.

## Verdict: FAIL

One blocking sandbox boundary remains. The direct demo correctly starts with realistic sample data, but it also accepts and reads a visitor’s selected real folder while the persistent banner says it does not read real data. This reopens the original demo-sandbox finding. The rest of the first-read, claims, routing, metadata, accessibility, and visual checks pass.

## Cold read before scrolling

Fresh 390 × 844 and 1440 × 900 contexts both loaded the root route without console errors. Before scrolling:

- **What it does:** checks an offline copy of cloud files for missing or outdated files.
- **For whom:** people keeping a fallback drive before relying on it.
- **Click first:** **“Try it with sample data.”**

The screen supplies the exact supporting text: **“Check your offline cloud copy.”**, **“For people keeping a fallback drive, find missing and outdated cloud files before relying on it.”**, and **“Shows a sample gap report right away.”** The first-read clarity blocker does not apply.

## Findings

### F-5-1 — BLOCKING — The demo reads real folder details while saying it does not read real data

**Quote/location:** `/demo/` persistent banner: **“Demo — sample data, nothing is saved. This page does not read or change your real data.”** The same page then exposes **“File list”**, **“Select a folder”**, and **“Check this file list.”** Privacy says: **“The demo processes file-list text and selected file details in your browser.”**

**Verified behavior:** In a fresh live context, I replaced the sample list with `private-tax.pdf`, selected a real local folder containing that file, and ran the check. The displayed report changed to **“READY”** and printed `private-tax.pdf`; `site/src/main.ts` passes the selected `FileList` to `filesFromInput()` and then to `auditDemo()`. The demo does not persist those values to `localStorage`, but it does read the real file name, size, and modified time while its “demo” banner remains visible.

**Why this fails:** The required sandbox boundary is not merely separate persistence. While the demo banner is shown, real data must not be read or written. A first-time visitor can reasonably trust the explicit sentence and paste/select sensitive evidence, yet this screen operates on it. The existing `demo-isolation` test asserts only `real:`/`demo:` browser-storage keys; `browser-local` asserts no upload. Neither inventories or proves the stated no-real-data boundary. This reopens Review 1 finding 2 (isolated demo sandbox), so it is blocking.

**Concrete fix:** Keep `/demo/` sample-only: disable or omit the editable file-list and folder controls there, and make **“Start for real”** open a clearly non-demo local workflow (or point directly to the command-line instructions). Remove the false sentence only if the product deliberately permits real inputs in demo mode; that would still not satisfy the sandbox requirement. Add a tagged claim such as `demo-sample-only` that verifies `/demo/` exposes no real file input, never reads a supplied real `FileList`, and changes only `demo:` storage on Reset/exit.

## Copy audit

Counts treat hyphenated compounds, options, and URLs as one word. Commands and JSON data are not sentences. No landing or README sentence exceeds 22 words; no banned marketing adjective appears. `rclone JSON file list`, `file list`, `folder`, `check`, and `command-line tool` are consistent. The headings and buttons below make sense in context and name their result; the demo-banner claim is F-5-1.

### Landing prose

| Words | Text |
| ---: | --- |
| 3 | Independent file-copy check |
| 5 | Check your offline cloud copy. |
| 16 | For people keeping a fallback drive, find missing and outdated cloud files before relying on it. |
| 5 | Try it with sample data |
| 7 | Shows a sample gap report right away. |
| 2 | No uploads |
| 6 | Demo works offline after first visit |
| 3 | Free under MIT |
| 15 | An archival ledger holding a physical drive beside a cloud-shaped hole cut through the paper |
| 3 | File copy check. |
| 11 | Compare a file list with the folder you plan to keep. |
| 3 | Keep versioned media. |
| 8 | Test real restores before relying on any copy. |
| 3 | Sample file-copy check |
| 5 | See a sample gap report. |
| 9 | It compares three exported files with a partial folder. |
| 10 | The sample highlights two missing files and an open exclusion. |
| 2 | Sample result |
| 2 | Not ready |
| 6 | 2 missing files · 1 open exclusion |
| 5 | Open the full local demo |
| 3 | How it works |
| 5 | Compare files in three steps. |
| 4 | Read your file list |
| 9 | Use JSON, CSV, or an rclone JSON file list. |
| 6 | Unsafe and duplicate paths are rejected. |
| 3 | Read your drive |
| 7 | Check the selected folder without following links. |
| 7 | Compare names, sizes, dates, and supplied hashes. |
| 4 | Show what needs work |
| 7 | See missing, old, changed, and excluded files. |
| 7 | Record accepted exclusions in the command-line report. |
| 2 | Limits |
| 6 | What this check does not do. |
| 7 | It does not copy or restore files. |
| 10 | The browser sample checks your file list in this tab. |
| 3 | Keep versioned media. |
| 3 | Test real restores. |
| 2 | Command line |
| 5 | Run the full check offline. |
| 5 | Use one command-line tool. |
| 10 | It does not need an account or a network connection. |
| 1 | Reads |
| 6 | JSON, CSV, and rclone JSON lists |
| 1 | Checks |
| 5 | Names, sizes, dates, and hashes |
| 1 | Saves |
| 4 | Encrypted reports when requested |
| 1 | License |
| 1 | MIT |
| 13 | Terminal recording of cloud-exit-evidence demo showing two missing files and one open exclusion. |
| 7 | Recorded from the bundled sample: `cloud-exit-evidence demo`. |
| 6 | Read the source and file-list format |
| 11 | Cloud Exit Evidence / Check an offline copy before relying on it. |

Other controls: **CEE / 001** (2), **Demo** (1), **How it works** (3), **Install** (1), **Privacy** (1), **Copy install command** (3), **Copy demo command** (3), **Terms** (1), **Source** (1), **Built by Param Factory** (4), and **Build polish-4** (2). No control is vague or a non-result naming action.

### README prose

| Words | Text |
| ---: | --- |
| 3 | Cloud Exit Evidence |
| 11 | Check whether an offline cloud-file copy has the files you expect. |
| 14 | For people keeping a fallback drive, it lists missing, old, changed, and excluded files. |
| 10 | It compares a supplied file list with a local folder. |
| 10 | It does not sign in, copy files, or restore files. |
| 1 | Install |
| 8 | Build the Rust command-line tool from this repository: |
| 5 | Try the bundled sample immediately: |
| 11 | The command writes a sample folder in a new temporary directory. |
| 9 | It prints two missing files and one open exclusion. |
| 3 | Check a folder |
| 16 | Give the tool a JSON, CSV, or rclone JSON (`lsjson`) file list and an offline folder: |
| 6 | Use JSON output in a script. |
| 10 | Missing files make the default command exit with code 2: |
| 9 | Use `--acknowledge` only for an exclusion you have checked: |
| 10 | Use `--redact-paths` to replace printed file paths with stable labels. |
| 4 | Save an encrypted report |
| 13 | Set a passphrase outside the command line, then write an encrypted `.cee` report: |
| 11 | Saved reports are encrypted and need the supplied passphrase to decrypt. |
| 5 | Terminal output is not encrypted. |
| 5 | Protect or redirect it yourself. |
| 2 | File-list rules |
| 5 | JSON uses a `files` array. |
| 6 | Each file needs a relative `path`. |
| 8 | It can also include `size`, `modified`, and `sha256`. |
| 4 | CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. |
| 9 | rclone JSON lists use `Path`, `Size`, `ModTime`, and `IsDir`. |
| 7 | Paths must stay inside the selected folder. |
| 6 | Duplicate and escaping paths are rejected. |
| 9 | Links are reported as unsafe and are never followed. |
| 4 | Results and exit codes |
| 11 | `READY` means every listed file passed and no exclusion is open. |
| 12 | `READY WITH EXCEPTIONS` means every file passed and listed exclusions were acknowledged. |
| 12 | `NOT READY` means a file is missing, old, changed, unsafe, or unacknowledged. |
| 5 | A passing check exits 0. |
| 6 | A failed readiness check exits 2. |
| 7 | Invalid input or file errors exit 3. |
| 8 | Use `--fail-on exceptions` to fail on acknowledged exclusions. |
| 10 | Use `--fail-on never` to return 0 after any valid check. |
| 3 | Website and privacy |
| 10 | The site at `https://cloud-exit-evidence.sociobot.in` includes a local sample at `/demo/`. |
| 18 | The sample opens with a report, uses only `demo:` browser storage, and is removed when you leave it. |
| 12 | The browser sample does not upload file-list text or selected file details. |
| 5 | It contacts no third-party service. |
| 12 | The command-line tool has no network client and sends no usage data. |
| 3 | Develop and verify |
| 9 | `npm run build` writes the release binary and `dist/site/`. |
| 8 | Deploy that static directory with its `staticwebapp.config.json` file. |
| 1 | License |
| 1 | MIT. |
| 2 | See `LICENSE`. |

All functional landing/README claims map to the 24-entry inventory. The separate live demo sentence **“This page does not read or change your real data.”** is not covered by an entry or outcome-level test and is included in F-5-1.

## Demo and sandbox checks

- Hero → `/demo/` is one click. The direct demo and `?demo=1` both show **Not ready**, the two missing files, and the Android exclusion immediately at 390 px.
- The banner is present. Reset restored only `demo:cloud-exit-evidence`; a pre-set `real:review5-sentinel` remained intact. Start for real discarded the demo key and kept the real sentinel.
- Network interception during the sample flow saw only `https://cloud-exit-evidence.sociobot.in` requests. After visiting only `/` and waiting for service-worker control, offline navigation to `/demo/` retained the demo banner and sample report.
- `cloud-exit-evidence demo` is covered by the clean-clone claim test and writes its bundled sample in a temporary directory.
- F-5-1 remains: the editable demo form accepts real file details while the banner is visible.

## Claims and local verification

All 24 commands listed in `.factory/claims.json` were run separately in the clean clone: `demo-sample-report`, `demo-first-screen`, `demo-isolation`, `free-to-use`, `browser-local`, `no-account`, `offline-reload`, `routing-focus`, `cli-demo`, `cli-no-network`, `cli-no-account`, `cli-read-only`, `cli-formats-readiness`, `duplicate-paths`, `cli-acknowledgement`, `cli-exit-codes`, `cli-redaction`, `cli-fail-on`, `cli-validation-and-links`, `encrypted-report`, `site-no-third-party-runtime`, `build-artifacts`, `terms-effective-date`, and `mit-license`. All passed.

Additional isolated checks passed:

- `npm run test:browser`: 64 passed, 2 desktop-only checks skipped.
- CLI formatting, clippy, 6 unit tests, 3 CLI integration tests, and 1 doctest passed as the `npm test` component run.
- Vitest (4 tests), static response-policy verification, `npm run test:build-artifacts`, `npm run build`, and `cargo package -p cloud-exit-evidence --locked --allow-dirty` passed.

## Earlier-finding verification

| Earlier finding | Live and code check in round 5 |
| --- | --- |
| Review 1 / 1 | Claim inventory and tagged observable tests exist; the new unlisted demo-boundary assertion is F-5-1. |
| Review 1 / 2 | Reopened by F-5-1: sample/reset/exit work, but the visible demo can read selected real folder details. |
| Review 1 / 3 | Fixed: direct demo, designed 404, deep links, Back/Forward focus, and polite announcement work. |
| Review 1 / 4 | Fixed: the first screen states job, audience, primary action, result, privacy, offline, and price facts. |
| Review 1 / 5 | Fixed: route metadata, canonical/OG/Twitter/icon fields, shared chrome, factory footer, and build id are present. |
| Review 1 / 6 | Fixed: public controls and validation errors use file list/folder/check/sample wording. |
| Review 1 / 7 | Fixed for landing/README claims; F-5-1 is the remaining live-page claim gap. |
| F-2-1 | Fixed: the 390 px first demo screen includes status, two gaps, and exclusion. |
| F-2-2 | Fixed: browser sample, CLI sample, example, and terminal recording name the same two files and exclusion. |
| F-2-3 | Fixed: live forward and Back focus the destination h1 under `no-referrer`. |
| F-2-4 | Fixed: before/after manifest and folder checks cover read-only CLI operation. |
| F-2-5 | Fixed: acknowledgement content and 0/2/3 exits are asserted. |
| F-2-6 | Fixed: public encryption wording matches the passphrase round-trip test. |
| F-2-7 | Fixed: whole-site runtime requests are same-origin and the demo requires no account. |
| F-2-8 | Fixed: README sentences are at most 22 words. |
| F-2-9 | Fixed: public terminology is consistent, including demo errors. |
| F-3-1 | Fixed: first screen says offline after first visit and free under MIT; landing-first offline replay passes. |
| F-3-2 | Fixed: duplicate JSON, CSV, and rclone paths are rejected. |
| F-3-3 | Fixed: redacted labels are stable and distinct across repeated runs. |
| F-3-4 | Fixed: both documented `--fail-on` modes have exact tests. |
| F-3-5 | Fixed: unsupported unreadable-result language remains absent. |
| F-3-6 | Fixed: free-under-MIT/no-paywall is listed and tested. |
| F-3-7 | Fixed: the narrower no-network-client/no-usage-data wording is tested. |
| F-3-8 | Fixed for the earlier listed promises; F-5-1 identifies a different untested live demo promise. |
| F-3-9 | Fixed: check, file list, folder, and command-line tool are used consistently. |
| F-3-10 | Fixed: the mobile target test passes at 390 px. |
| F-3-11 | Fixed: the route announcement is visually hidden and remains polite. |
| F-3-12 | Fixed: copy buttons identify install versus demo command. |
| F-3-13 | Fixed: terminal output warning says it is unencrypted and gives a next action. |
| F-3-14 | Fixed: factory-only publishing language is absent from the README. |
| F-4-1 | Fixed: a landing-only first visit precaches the direct demo; offline replay passes. |
| F-4-2 | Fixed: all checked demo errors use plain visible terms. |
| F-4-3 | Fixed: CLI no-account/no-sign-in behavior has its own claim. |
| F-4-4 | Fixed: build outputs have their own claim and test. |
| F-4-5 | Fixed: live sample preview precedes steps and limits/privacy. |
| F-4-6 | Fixed: Terms displays a tested effective date without a future change-record promise. |

## Structure, accessibility, and visual identity

`/`, `/demo/`, `/privacy/`, `/terms/`, and an unknown path were checked at mobile and desktop. The four normal routes return 200; the unknown path returns a designed 404 with a home route. Each page has `lang=en`, one h1, one main landmark, a route-specific title, description, canonical, OG/Twitter image, SVG favicon, Apple touch icon, skip link, and shared legal/footer links. Internal, external, sitemap, robots, and asset links returned 200; the explicit unknown route returned the expected 404. There were no normal-route console errors.

The warm-paper, monochrome evidence-broadsheet layout, ledger/drive/cloud-cutout asset, red proof mark, editorial rules, and squared controls match `.factory/design.md` and are distinct from a generic SaaS template. The browser suite’s Axe checks found no serious or critical issue. No AI feature is warranted: deterministic local comparison is the trust-preserving path, while AI would weaken the offline and privacy boundary.

## What would make this perfect

Make `/demo/` genuinely sample-only, provide a clearly separate real-use entry, test that boundary, and remove the false no-real-data sentence only as part of that correction. Then rerun the clean-clone claim commands and the live folder-selection replay. With that boundary closed, this review has no other finding.
