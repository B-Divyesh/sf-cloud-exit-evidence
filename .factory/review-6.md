# Adversarial first-read review 6 — Cloud Exit Evidence

Reviewed 28 August 2026 against the deployed site at <https://cloud-exit-evidence.sociobot.in/> and repository commit `9f19b3bd683b90a3c03f38cf00c37b5737e1dbe8`.

## Verdict: FAIL

There are two findings. The direct demo is otherwise immediately usable, result-first, local-only, and offline-capable after a landing visit. All 25 listed claim commands passed from a fresh clone; neither finding is covered by a failing listed claim test.

## Cold read, before scrolling

At 390 × 844, before scrolling, the page says **“Check your offline cloud copy.”** I understand this as a check of a fallback drive against an exported cloud file list, for people keeping that fallback drive. The first action is clearly **“Try it with sample data”**, and the adjacent text says it shows a gap report immediately. The same three answers are visible at 1440 × 900. No first-screen blocking finding.

## Findings

### F-6-1 — Major — Leaving the demo through its ordinary Home link does not discard demo state, contrary to the README and sandbox rule

- **Quote/location:** README, “Website and privacy”: **“The sample opens with a report, uses only `demo:` browser storage, and is removed when you leave it.”** The deployed `/demo/` header has an ordinary **Home** link.
- **Evidence:** In a fresh browser context, `/demo/` creates `localStorage["demo:cloud-exit-evidence"] = "sample"`. Clicking **Home** reaches `/` but leaves that key intact. In [site/src/main.ts](/work/repo/site/src/main.ts:91), removal is bound only to `#start-real` at lines 94–96. **Start for real** itself is correct: it removes the key and reaches `/#install`.
- **Why this matters:** A visitor can reasonably leave a sample through Home. The claimed cleanup does not happen on that exit path. The retained value is only bundled sample state, not real data, but the documented privacy behavior is false and the demo-isolation claim tests only the special exit control.
- **Concrete fix:** On every navigation that exits `/demo/` (Home, wordmark, Privacy, Terms, and back-to-home where applicable), remove `demo:cloud-exit-evidence`; or narrow the README and demo policy to say only **Start for real** removes it. Prefer cleanup on every exit. Expand `@claim:demo-isolation` to enter `/demo/`, use each ordinary leaving link, and assert the demo key is absent while a `real:` sentinel is unchanged.

### F-6-2 — Minor — The landing page has a moderate Axe landmark violation

- **Location:** [site/index.html](/work/repo/site/index.html:47), `<aside class="front-note" aria-label="Backup reminder">…</aside>` inside the `main`/masthead landmark.
- **Evidence:** A live `@axe-core/playwright` scan reports `landmark-complementary-is-top-level` (moderate): “Aside should not be contained in another landmark.” The node is that `aside`. `/demo/`, `/privacy/`, `/terms/`, and the designed 404 have no Axe violations.
- **Why this matters:** The note is supplementary editorial copy, not a page-level complementary region. Exposing it as a nested landmark adds a misleading landmark to assistive-technology navigation.
- **Concrete fix:** Change this decorative/supplementary note to a `<div class="front-note">`, retaining its visible content, or move a genuinely complementary `<aside>` outside the `main` landmark. Add an Axe assertion that the landing page has zero violations, not only zero serious/critical violations.

## Copy audit

Counts treat hyphenated terms, commands, code options, and URLs as one word. Commands and JSON fixtures are not sentences. No item exceeds 22 words. No banned marketing adjective appears. Public terminology is consistent on **check**, **file list**, **folder**, and **command-line tool**. Buttons name a result: **Try it with sample data**, **Open the full local demo**, **Copy install command**, **Copy demo command**, **Reset demo**, and **Start for real**.

### Landing page

| Words | Sentence or visitor-facing phrase |
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
| 11 | The browser demo checks only bundled sample files in this tab. |
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

Other navigation/footer controls are short labels (CEE / 001, Demo, How it works, Install, Privacy, Terms, Source, Built by Param Factory, and Build polish-5). They have visible link affordances and do not use vague actions.

### README

| Words | Sentence or visitor-facing phrase |
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
| 10 | The browser demo accepts no real file list or folder. |
| 11 | It checks only bundled sample files and contacts no third-party service. |
| 13 | Choose **Start for real** to leave demo storage and open the command-line setup. |
| 12 | The command-line tool has no network client and sends no usage data. |
| 3 | Develop and verify |
| 9 | `npm run build` writes the release binary and `dist/site/`. |
| 8 | Deploy that static directory with its `staticwebapp.config.json` file. |
| 1 | License |
| 1 | MIT. |
| 2 | See `LICENSE`. |

The only copy defect is F-6-1: “is removed when you leave it” has no matching claims entry and is false for the Home exit. All other functional statements have a matching entry in `.factory/claims.json` and an observable tagged test.

## Demo, claims, and sandbox verification

- **One click / first used screen:** Clicking the landing primary action opens `/demo/`. At 390 × 844 the first demo view shows the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, Start for real, **NOT READY**, both missing paths, and the open exclusion. The supplied sample is a three-file export versus one local file plus an Android permission exclusion.
- **Reset and Start for real:** Reset re-renders the bundled report and changes only `demo:cloud-exit-evidence`; a `real:sentinel` remained unchanged. Start for real removes the demo key and opens `/#install` with the installation section in view.
- **Privacy and offline:** Instrumented live demo traffic was same-origin only. The sample exposes no file or folder input. After a landing-only visit and service-worker control, offline navigation to `/demo/` returned the report and banner.
- **Claims:** From a fresh no-local clone at `/tmp/cloud-exit-evidence-review6.2aHLh6`, all 25 commands listed in `.factory/claims.json` passed separately. The log is `/tmp/cloud-exit-evidence-review6-claims.log`. This includes the browser-local interception, offline reload, sample-only instrumentation, CLI temporary-directory demo, and encrypted-report checks. F-6-1 is outside the stated `demo-isolation` claim and therefore remains untested.
- **Quality gates:** In that same clone, `npm test` passed (6 Rust unit, 3 Rust integration, 1 doctest, 4 Vitest, 67 Playwright, 3 intentional mobile-only skips, response-policy, and build-artifact test). `npm run build` then passed and produced the release binary and `dist/site/`. Log: `/tmp/cloud-exit-evidence-review6-quality.log`.

## Earlier-finding verification

Each earlier item was rechecked against the deployed site and the current code, rather than accepted from the prior handoff.

| Earlier finding | Current result |
| --- | --- |
| R1-1 | Fixed: all 25 declared claims passed separately in a clean clone. |
| R1-2 | Fixed: direct `/demo/`, banner, reset, start-for-real, browser sample, CLI sample, and bundled transcript exist. |
| R1-3 | Fixed: `/demo/`, legal routes, and a styled HTTP 404 are live; navigation and Back focus the destination h1. |
| R1-4 | Fixed: the first screen states the job, audience, sample action, immediate result, and three facts. |
| R1-5 | Fixed: all normal routes have title, description, canonical, OG/Twitter metadata, icons, shared chrome, legal links, sitemap, and robots. |
| R1-6 | Fixed: the sample-only demo has no editable error workflow or legacy audit jargon. |
| R1-7 | Fixed except the new unlisted ordinary-leave assertion in F-6-1. |
| F-2-1 | Fixed: the mobile demo result, both gaps, and exclusion fit in the first 844 px. |
| F-2-2 | Fixed: browser sample, CLI sample, example, and terminal SVG agree on the two gaps and exclusion. |
| F-2-3 | Fixed: live Demo navigation and Back focus the h1 and update the polite announcement. |
| F-2-4 | Fixed: the CLI read-only test hashes and inventories both supplied inputs. |
| F-2-5 | Fixed: acknowledgement content and 0/2/3 results are asserted. |
| F-2-6 | Fixed: public encryption wording matches the passphrase round trip. |
| F-2-7 | Fixed: live all-route requests remain same-origin; the demo has no account form. |
| F-2-8 | Fixed: no landing or README copy item exceeds 22 words. |
| F-2-9 | Fixed: public wording consistently uses check, file list, folder, and command-line tool. |
| F-3-1 | Fixed: the first screen says free under MIT and demo works offline after its first visit. |
| F-3-2 | Fixed: JSON, CSV, and rclone duplicate paths are rejected. |
| F-3-3 | Fixed: redacted labels are stable and distinct across repeated CLI runs. |
| F-3-4 | Fixed: both documented `--fail-on` modes have exact exit tests. |
| F-3-5 | Fixed: unsupported unreadable-result wording is absent. |
| F-3-6 | Fixed: the free-under-MIT/no-purchase behavior is listed and tested. |
| F-3-7 | Fixed: no-network-client/no-usage-data wording is narrowed and tested. |
| F-3-8 | Fixed for the previous listed promises; F-6-1 is a newly observed uncovered exit path. |
| F-3-9 | Fixed: terminology remains consistent in the rendered sample. |
| F-3-10 | Fixed: 390 px links and controls meet the 44 px target check. |
| F-3-11 | Fixed: the route announcement is visually hidden and remains polite. |
| F-3-12 | Fixed: install and demo copy controls have distinct names. |
| F-3-13 | Fixed: README says terminal output is unencrypted and tells the user to protect or redirect it. |
| F-3-14 | Fixed: no factory-only publishing vocabulary appears in the public README. |
| F-4-1 | Fixed: a landing-only visit precaches the demo; an offline direct demo replay succeeds. |
| F-4-2 | Fixed: the public demo has no editable error state with old terminology. |
| F-4-3 | Fixed: CLI no-account/no-sign-in behavior has a dedicated claim. |
| F-4-4 | Fixed: release binary and `dist/site/` have a dedicated build-artifact claim. |
| F-4-5 | Fixed: landing order is first screen, sample result, steps, limits, then install. |
| F-4-6 | Fixed: Terms shows a tested 28 August 2026 effective date without a future change-record promise. |
| F-5-1 | Fixed: the demo has no real file/folder input; injected legacy controls do not read `File`/`FileList` or affect the sample. |

## Structure, accessibility, and visual identity

- The broadsheet presentation is distinct and matches `.factory/design.md`: warm paper, monochrome ledger image, Georgian editorial display type, narrow rules, proof-red accent, and no generic gradient/card SaaS hero.
- Live crawls of all internal and external links returned 200, apart from the intentional missing route, which correctly returns its designed 404. Normal routes have one h1 and one main landmark; titles follow the product/route pattern; no script console errors occurred on normal routes. The browser reports the expected document-load 404 message only for the intentional 404 route.
- The direct demo URL, deep links, Back, focus movement, and polite announcement work. Header/footer legal links are present on every route. CSP, no-referrer, nosniff, robots, sitemap, favicon, canonical, and social image are present.
- Axe has the one moderate landing violation in F-6-2. There are no serious or critical Axe violations.

## Missed leverage

No additional AI, sync, or import/export feature is required by the brief. The job is deliberately a local, read-only command-line comparison; it already accepts the three expected file-list formats, emits reports, and has a bundled CLI demo. An AI feature would be decorative and would weaken the privacy-first scope.

## What would make this perfect

Discard the demo namespace on every ordinary exit and prove it with a tagged claim test. Remove the nested complementary landmark and make the landing Axe scan zero-violation. Re-run the clean-clone claim replay, full test/build suite, mobile live demo check, offline replay, and Axe scan; only then should the verdict change to PASS.
