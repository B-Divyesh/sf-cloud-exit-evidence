# Adversarial first-read review 2 — Cloud Exit Evidence

Reviewed 2026-08-28 against the deployed site and clean clone `1705a864cea7599c7da41905a5c8230394019acd`.

## Verdict: FAIL

The cold landing read is clear and the editorial visual system is specific, responsive, and not a generic SaaS template. The product still fails the demo and routing contracts on the live site. The sample report is below the first phone screen, the claimed focus behavior does not work in production, and the static CLI “recording” does not match the bundled command. Copy and claim inventory issues remain below.

## Cold read before scrolling

Fresh 390 × 844 and 1440 × 1000 browser contexts loaded `https://cloud-exit-evidence.sociobot.in/` with no console errors.

From the first screen, this is my understanding:

- **What it does:** compares a cloud file list with an offline copy and identifies missing or old files.
- **For whom:** someone relying on a fallback drive.
- **What to click first:** **“Try it with sample data.”**

The exact first-screen text that made those answers available was **“Check your offline cloud copy.”**, **“For people keeping a fallback drive, find missing and outdated cloud files before relying on it.”**, and **“Try it with sample data”** / **“Shows a sample gap report right away.”** This cold-read gate passes.

## Blocking findings

### F-2-1 — The phone demo does not show the product result on its first screen

**Location / evidence:** Live `/demo/` at 390 × 844. The visible screen ends in the **“FILE LIST”** textarea. The rendered `#report-results` begins at y=1439.7px (its bottom is y=2302.2px). It is not visible before scrolling. The desktop report begins at y=768.8px, but the mandatory phone view is the failing case.

**Why this fails:** The hero promises **“Shows a sample gap report right away.”** The demo does calculate a realistic report, but a first-time phone visitor sees a marketing heading, banner, explanatory copy, and editable JSON before seeing any actual result. This fails the demo-sandbox requirement that the first screen after the one-click action already look like the product being used. This is a half-fix of review 1 finding 2.

**Concrete fix:** Put a compact, real **Not ready — 1 missing file · 1 open exclusion** result above the editable form at 390px, or make the report the first demo section and move the inputs below it. Keep the banner visible without consuming the result area. Add a 390px claim assertion that the `Not ready` heading and both sample findings are within the initial viewport.

### F-2-2 — The landing’s CLI “recording” is not the real bundled demo output

**Location / quote:** Landing terminal block says:

```text
NOT READY
missing: Documents/tax-return.pdf
open exclusion: Phone/Documents/**
```

The actual clean-clone command, run in a new temp directory, reports both **`Photos/2026/birthday.webp`** and **`Documents/tax-return.pdf`** as missing. The shipped `examples/intentional-gaps/README.md` also says “The missing photo and tax return”.

**Why this fails:** The CLI demo contract requires a self-hosted recording of the real binary doing the main job on its bundled sample. The page instead presents a hand-written, contradictory result. A visitor cannot rely on the landing to know what the supplied command will show. This is a regression/half-fix of review 1 finding 2.

**Concrete fix:** Make the browser sample, CLI sample, shipped sample README, and terminal recording use exactly the same fixture and findings. Generate a self-hosted asciinema/SVG recording from `cloud-exit-evidence demo`, rather than embedding a manually maintained text block. Extend `@claim:cli-demo` to assert the complete expected set of missing paths and the open exclusion; add a browser assertion that the landing recording matches that set.

### F-2-3 — Route-change heading focus is false on the deployed site

**Location / evidence:** From live `/`, clicking the header **“Demo”** link to `/demo/` leaves `document.activeElement` as `BODY`; it does not focus the `/demo/` `<h1>` **“Check a sample offline copy.”** Back navigation does focus the home heading. The deployed response sets `Referrer-Policy: no-referrer`. `site/src/main.ts` and `site/src/legal.ts` gate focus on `document.referrer.startsWith(window.location.origin)` or a back/forward navigation, so forward navigation has no referrer in production.

**Why this fails:** This violates the route/focus contract and reopens review 1 finding 3. The local `@claim:routing-focus` test passes because its Vite server does not send the deployed `no-referrer` header; it is not an honest production verification.

**Concrete fix:** Persist an intentional internal navigation marker before same-origin link navigation and consume it on `pageshow`, while retaining the back/forward branch. Alternatively use a privacy-preserving same-origin referrer policy and verify that exact deployed header. Add a deployment-equivalent browser test that sends `Referrer-Policy: no-referrer`, clicks both header and hero demo links, and asserts focus plus the live announcement.

## Major findings

### F-2-4 — The README’s no-write / no-restore claim has no claims entry or observable test

**Location / quote:** README opening: **“It does not sign in, copy files, or restore files.”**

**Why this fails:** `cli-no-network` only checks source/dependencies for network clients. It does not establish that normal audit/demo operation never copies source files or restores data. The visitor-facing statement has no matching claim in `.factory/claims.json`.

**Concrete fix:** Either remove “copy files, or restore files”, or add a `cli-read-only` claim with a fresh-temp-dir test that hashes the manifest and selected destination before and after `audit`, asserting they are unchanged (except for an explicitly requested `--output` path).

### F-2-5 — Acknowledgement and exact exit-code promises are unlisted / insufficiently tested

**Location / quotes:** README says **“Use `--acknowledge` only for an exclusion you have checked:”** and **“The command exits 0 after a passing policy, 2 for a failed readiness policy, and 3 for invalid input or a file-system error.”**

**Why this fails:** No claim entry covers acknowledgement behavior or these exact numeric exit codes. `cli-formats-readiness` only observes that test commands fail; it does not assert `0`, `2`, and `3`, nor an acknowledged exclusion result. Quantitative and behavioral promises must be observable in their tagged sandbox test.

**Concrete fix:** Add separate `cli-acknowledgement` and `cli-exit-codes` entries and tagged tests. The latter should assert 0 for a ready fixture, 2 for a gap fixture, and 3 for malformed input. If not tested, remove the exact promises.

### F-2-6 — The named encryption implementation is not verified by the encryption claim

**Location / quote:** README: **“Saved reports use XChaCha20-Poly1305 encryption and an Argon2id-derived key.”**

**Why this fails:** `encrypted-report` establishes only a `CEE1` prefix and successful round trip. It does not test the named cipher or KDF. The exact technical assertion is therefore untested in the claim sandbox.

**Concrete fix:** Add a non-secret fixture/header test that asserts the report format version and declared algorithm/KDF fields, or simplify the README to the existing tested claim: **“Saved reports are encrypted and require the supplied passphrase to decrypt.”**

### F-2-7 — Privacy-page claims exceed the claim inventory

**Location / quote:** `/privacy/`: **“This site has no accounts, analytics, ads, third-party fonts, or third-party runtime scripts.”**

**Why this fails:** `no-account` only verifies that the demo has no sign-in form. `browser-local` intercepts the demo flow, not every live route, and does not test source/response policy for analytics, ads, fonts, or scripts. These are visitor-reliant privacy assertions without matching claim entries.

**Concrete fix:** Add a `site-no-third-party-runtime` claim that crawls `/`, `/demo/`, `/privacy/`, `/terms/`, and `404`, intercepts all requests, and asserts same-origin only; add a static-source check for analytics/ad/font URLs. Otherwise narrow the policy to what is tested.

### F-2-8 — README sentence exceeds the 22-word cap and buries its outcome

**Location / quote:** README, “Results and exit codes”: **“The command exits 0 after a passing policy, 2 for a failed readiness policy, and 3 for invalid input or a file-system error.”** (23 words)

**Why this fails:** It exceeds the plain-words hard cap and mixes three outcomes plus jargon in one sentence.

**Concrete fix:** Replace it with: **“A passing check exits 0. A failed readiness check exits 2. Invalid input or file errors exit 3.”** (The numerical behavior still needs F-2-5’s test.)

### F-2-9 — Copy switches between “check”, “audit”, and “CLI” without defining the latter two

**Location / quotes:** Landing headings **“Sample audit”**, **“Run the full check offline.”**, and method text **“Record accepted exclusions in the CLI report.”** README adds **“rclone lsjson”** and **“XChaCha20-Poly1305”** without plain-language context.

**Why this fails:** The first screen succeeds because it says “check”; lower sections make the same job sound like an “audit” and introduce “CLI”. The technical terms belong in reference documentation, not the first explanatory layer.

**Concrete fix:** Use **“Sample file-copy check”** and **“command-line report”** consistently. Write **“an rclone JSON file list”** on first use. Replace the encryption sentence as in F-2-6 and move algorithm names to a technical format reference.

## Copy audit

Counts treat a hyphenated term, option, and URL as one word. `J` marks jargon/inconsistent terminology; `L` marks an action or label reviewed for plain-language clarity. There are no landing sentences over 22 words and no banned marketing adjectives. The flagged rows are findings F-2-8 and F-2-9; the terminal metric row is also covered by F-2-2.

### Landing page

| Words | Type | Text | Flag |
| ---: | --- | --- | --- |
| 3 | label | Independent file-copy check | |
| 5 | h1 | Check your offline cloud copy. | |
| 16 | prose | For people keeping a fallback drive, find missing and outdated cloud files before relying on it. | |
| 5 | action | Try it with sample data | |
| 7 | prose | Shows a sample gap report right away. | |
| 2 | fact | No account | |
| 2 | fact | No upload | |
| 2 | fact | Runs locally | |
| 3 | label | File copy check. | |
| 11 | prose | Compare a file list with the folder you plan to keep. | |
| 6 | prose | A sync is not a backup. | |
| 3 | prose | This checks coverage. | |
| 7 | prose | Keep versioned media and test restores too. | |
| 3 | heading | How it works | |
| 5 | h2 | Compare files in three steps. | |
| 4 | h3 | Read your file list | |
| 8 | prose | Use a JSON, CSV, or rclone file list. | J: define rclone on first use |
| 6 | prose | Unsafe and duplicate paths are rejected. | |
| 3 | h3 | Read your drive | |
| 7 | prose | Check the selected folder without following links. | |
| 7 | prose | Compare names, sizes, dates, and supplied hashes. | |
| 4 | h3 | Show what needs work | |
| 7 | prose | See missing, old, changed, and excluded files. | |
| 7 | prose | Record accepted exclusions in the CLI report. | J: use “command-line report” |
| 2 | heading | Sample audit | J: use “Sample file-copy check” |
| 5 | h2 | See a sample gap report. | |
| 9 | prose | It compares three exported files with a partial folder. | |
| 10 | prose | The sample highlights a missing file and an open exclusion. | |
| 2 | label | Sample result | |
| 2 | status | Not ready | |
| 7 | metric | 1 missing file · 1 open exclusion | F-2-2: does not match CLI sample |
| 5 | action | Open the full local demo | |
| 2 | heading | Command line | |
| 5 | h2 | Run the full check offline. | |
| 5 | prose | Use one Rust command-line tool. | |
| 10 | prose | It does not need an account or a network connection. | |
| 1 | label | Reads | |
| 5 | value | JSON, CSV, and rclone lists | J: define rclone |
| 1 | label | Checks | |
| 5 | value | Names, sizes, dates, and hashes | |
| 1 | label | Saves | |
| 4 | value | Encrypted reports when requested | |
| 1 | label | License | |
| 1 | value | MIT | |
| 6 | link | Read the source and file-list format | |
| 12 | footer | Cloud Exit Evidence / Check an offline copy before relying on it. | |

### README

| Words | Type | Text | Flag |
| ---: | --- | --- | --- |
| 11 | prose | Check whether an offline cloud-file copy has the files you expect. | |
| 14 | prose | For people keeping a fallback drive, it lists missing, old, changed, and excluded files. | |
| 10 | prose | It compares a supplied file list with a local folder. | |
| 10 | prose | It does not sign in, copy files, or restore files. | F-2-4 |
| 8 | instruction | Build the Rust command-line tool from this repository: | |
| 5 | instruction | Try the bundled sample immediately: | |
| 11 | prose | The command writes a sample folder in a new temporary directory. | |
| 9 | prose | It prints the directory path and an intentional-gap report. | J: “intentional-gap” is not defined |
| 15 | instruction | Give the tool a JSON, CSV, or rclone lsjson file list and an offline folder: | J: define rclone lsjson |
| 6 | instruction | Use JSON output in a script. | |
| 10 | prose | Missing files make the default command exit with code 2: | F-2-5 |
| 9 | instruction | Use `--acknowledge` only for an exclusion you have checked: | F-2-5 |
| 10 | instruction | Use `--redact-paths` to replace printed file paths with stable labels. | |
| 13 | instruction | Set a passphrase outside the command line, then write an encrypted `.cee` report: | |
| 9 | prose | Saved reports use XChaCha20-Poly1305 encryption and an Argon2id-derived key. | F-2-6; J |
| 7 | prose | Plain terminal output remains under your control. | |
| 5 | prose | JSON uses a `files` array. | |
| 6 | prose | Each file needs a relative `path`. | |
| 8 | prose | It can also include `size`, `modified`, and `sha256`. | |
| 4 | prose | CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. | |
| 8 | prose | rclone lists use `Path`, `Size`, `ModTime`, and `IsDir`. | J: define rclone |
| 7 | prose | Paths must stay inside the selected folder. | |
| 6 | prose | Duplicate and escaping paths are rejected. | |
| 9 | prose | Links are reported as unsafe and are never followed. | |
| 11 | result | `READY` means every listed file passed and no exclusion is open. | |
| 12 | result | `READY WITH EXCEPTIONS` means every file passed and listed exclusions were acknowledged. | |
| 13 | result | `NOT READY` means a file is missing, old, changed, unsafe, unreadable, or unacknowledged. | |
| 23 | prose | The command exits 0 after a passing policy, 2 for a failed readiness policy, and 3 for invalid input or a file-system error. | F-2-5, F-2-8, J |
| 8 | instruction | Use `--fail-on exceptions` or `--fail-on never` when needed. | J: define “fail-on” |
| 10 | prose | The site at https://cloud-exit-evidence.sociobot.in includes a local sample at /demo/. | |
| 18 | prose | The sample opens with a report, uses only `demo:` browser storage, and is removed when you leave it. | |
| 12 | prose | The browser sample does not upload file-list text or selected file details. | |
| 6 | prose | It calls no third-party runtime service. | |
| 8 | prose | The CLI contains no network client or telemetry. | J: use “command-line tool”; claim coverage is partial |
| 9 | prose | `npm run build` writes the release binary and `dist/site/`. | |
| 8 | instruction | Deploy that static directory with its `staticwebapp.config.json` file. | |
| 10 | prose | Registry publishing is factory-owned; do not publish from this checkout. | |
| 1 | license | MIT. | |

## Claims and sandbox verification

`.factory/claims.json` contains 13 entries. I made a clean local clone at `/tmp/cloud-exit-evidence-review2.BRdLUJ`, ran `npm ci`, then ran every listed command individually:

| Claim id | Result |
| --- | --- |
| demo-sample-report | Pass |
| demo-isolation | Pass |
| browser-local | Pass |
| no-account | Pass |
| offline-reload | Pass |
| routing-focus | Pass locally, **fails on live production** (F-2-3) |
| cli-demo | Pass, but does not check the contradictory second missing file (F-2-2) |
| cli-no-network | Pass |
| cli-formats-readiness | Pass, but does not cover acknowledgement/exact statuses (F-2-5) |
| cli-redaction | Pass |
| cli-validation-and-links | Pass |
| encrypted-report | Pass, but does not prove the named algorithm/KDF (F-2-6) |
| mit-license | Pass |

`npm test` passed in that clean clone (including the Playwright suite), and `npm run build` completed with `dist/site/` and the release CLI. All claim invocations used `npm run test:claims -- --grep @claim:<id>` exactly as listed.

Sandbox checks on live `/demo/` showed only same-origin requests, no console errors, `demo:cloud-exit-evidence` isolated from a pre-existing `real:sentinel`, Reset preserving that sentinel, Start for real deleting only the demo key, and a service-worker-controlled offline reload rendering **Not ready**. The CLI demo was run in a new temp working directory and created its own `/tmp/cloud-exit-evidence-demo-*` folder.

## History, structure, and leverage

- Earlier review finding 1 (claim inventory): improved, but F-2-4 through F-2-7 show remaining unlisted or under-tested visitor claims.
- Earlier finding 2 (demo): half-fixed; reopening as F-2-1 and F-2-2.
- Earlier finding 3 (routing/focus): `/demo/`, the branded 404, deep links, and Back work, but forward route focus fails live; reopening as F-2-3.
- Earlier findings 4–6: landing cold-read, metadata, shared footer, direct routes, visual identity, mobile controls, and plain primary action are fixed. The monochrome evidence broadsheet matches `.factory/design.md` and is distinct from a generic template.
- Earlier finding 7: claims inventory exists, but the specific gaps above remain.

Live structure checks passed for `/`, `/demo/`, `/privacy/`, `/terms/`, and an unknown path: each has one `h1`, `lang`, `main`, route title, description, canonical, OG/Twitter image, and favicon. `/does-not-exist-review-2` returned status 404 with the designed page. The home link crawl returned HTTP 200 for every internal, GitHub, and Sociobot link. Headers include CSP, `X-Content-Type-Options`, and `Referrer-Policy`. Axe serious/critical checks pass in the existing clean-clone suite.

The brief does not imply an AI feature: comparing supplied evidence should remain deterministic and local. JSON/CSV/rclone input, a bundled sample, encrypted output, and the `demo` command supply the obvious import/export and no-network value; no additional AI or sync is expected.

## What would make this perfect

Show the actual sample result immediately on a phone, generate one truthful CLI recording from the same fixture, make route focus work with the deployed privacy header, then reduce every privacy/behavioral promise to a corresponding sandbox assertion. Finish the README rewrites so a new CLI user sees short, defined terms and exact verified outcomes.
