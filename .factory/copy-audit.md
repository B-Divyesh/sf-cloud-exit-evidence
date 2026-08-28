# Copy audit — polish 5

Every visitor-facing landing sentence, heading, label, action, image alt, and footer line is at most 22 words. None use a banned marketing word. Functional promises map to a tagged entry in `.factory/claims.json`.

| Words | Type | Text | Claim / result |
| ---: | --- | --- | --- |
| 3 | label | Independent file-copy check | Pass |
| 5 | h1 | Check your offline cloud copy. | Pass |
| 16 | sentence | For people keeping a fallback drive, find missing and outdated cloud files before relying on it. | `demo-sample-report` |
| 5 | action | Try it with sample data | `demo-sample-report` |
| 7 | sentence | Shows a sample gap report right away. | `demo-first-screen` |
| 2 | fact | No uploads | `browser-local` |
| 6 | fact | Demo works offline after first visit | `offline-reload` |
| 3 | fact | Free under MIT | `free-to-use` |
| 15 | alt | An archival ledger holding a physical drive beside a cloud-shaped hole cut through the paper | Pass |
| 3 | label | File copy check. | Pass |
| 11 | sentence | Compare a file list with the folder you plan to keep. | `cli-formats-readiness` |
| 3 | sentence | Keep versioned media. | Pass |
| 8 | sentence | Test real restores before relying on any copy. | Pass |
| 3 | label | Sample file-copy check | Pass |
| 5 | h2 | See a sample gap report. | `demo-sample-report` |
| 9 | sentence | It compares three exported files with a partial folder. | `demo-sample-report` |
| 10 | sentence | The sample highlights two missing files and an open exclusion. | `demo-sample-report` |
| 2 | label | Sample result | Pass |
| 2 | status | Not ready | `demo-sample-report` |
| 6 | metric | 2 missing files · 1 open exclusion | `demo-sample-report` |
| 5 | action | Open the full local demo | `demo-sample-report` |
| 3 | label | How it works | Pass |
| 5 | h2 | Compare files in three steps. | Pass |
| 4 | h3 | Read your file list | Pass |
| 9 | sentence | Use JSON, CSV, or an rclone JSON file list. | `cli-formats-readiness` |
| 6 | sentence | Unsafe and duplicate paths are rejected. | `cli-validation-and-links`, `duplicate-paths` |
| 3 | h3 | Read your drive | Pass |
| 7 | sentence | Check the selected folder without following links. | `cli-validation-and-links` |
| 7 | sentence | Compare names, sizes, dates, and supplied hashes. | `cli-formats-readiness` |
| 4 | h3 | Show what needs work | Pass |
| 7 | sentence | See missing, old, changed, and excluded files. | `cli-formats-readiness` |
| 7 | sentence | Record accepted exclusions in the command-line report. | `cli-acknowledgement` |
| 2 | label | Limits | Pass |
| 6 | h2 | What this check does not do. | Pass |
| 7 | sentence | It does not copy or restore files. | `cli-read-only` |
| 11 | sentence | The browser demo checks only bundled sample files in this tab. | `demo-sample-only`, `browser-local` |
| 3 | sentence | Keep versioned media. | Pass |
| 3 | sentence | Test real restores. | Pass |
| 2 | label | Command line | Pass |
| 5 | h2 | Run the full check offline. | `cli-no-network` |
| 5 | sentence | Use one command-line tool. | Pass |
| 10 | sentence | It does not need an account or a network connection. | `cli-no-account`, `cli-no-network` |
| 1 | label | Reads | Pass |
| 6 | value | JSON, CSV, and rclone JSON lists | `cli-formats-readiness` |
| 1 | label | Checks | Pass |
| 5 | value | Names, sizes, dates, and hashes | `cli-formats-readiness` |
| 1 | label | Saves | Pass |
| 4 | value | Encrypted reports when requested | `encrypted-report` |
| 1 | label | License | Pass |
| 1 | value | MIT | `mit-license` |
| 13 | alt | Terminal recording of cloud-exit-evidence demo showing two missing files and one open exclusion. | `cli-demo` |
| 7 | caption | Recorded from the bundled sample: `cloud-exit-evidence demo`. | `cli-demo` |
| 6 | link | Read the source and file-list format | Pass |
| 11 | footer | Cloud Exit Evidence / Check an offline copy before relying on it. | Pass |

Controls audited separately: **CEE / 001**, **Demo**, **How it works**, **Install**, **Privacy**, **Copy install command**, **Copy demo command**, **Terms**, **Source**, **Built by Param Factory**, and **Build polish-5**. Every action names its result. The control labels contain no banned wording.

## Demo sandbox copy

| Words | Text | Result |
| ---: | --- | --- |
| 5 | Check a sample offline copy. | Plain job headline. |
| 12 | See missing files and exclusions in a local sample with known gaps. | `demo-sample-report` |
| 6 | Demo — sample data, nothing is saved. | Required persistent sandbox label; `demo-isolation` |
| 7 | This page uses only bundled sample details. | `demo-sample-only` |
| 2 | Reset demo | `demo-isolation` |
| 3 | Start for real | `demo-isolation` |
| 3 | Sample gap report. | Direct result label. |
| 6 | This report uses bundled sample files. | `demo-sample-only` |
| 12 | To check your drive, leave the demo and install the command-line tool. | `demo-isolation` |
| 4 | 3 items need attention. | `demo-sample-report` |
| 7 | Name, size, and available date evidence match. | `demo-sample-report` |
| 6 | Not found in the selected copy. | `demo-sample-report` |
| 4 | Android denied all-files access. | `demo-sample-report` |
| 8 | This browser check compares a bundled file list. | `demo-sample-only` |
| 8 | It does not create or test a backup. | Scope statement. |

The demo has no editable field, file picker, or input error state. The former manifest, fixture, destination, and audit error wording is no longer reachable.

## README sentence audit

Commands and structured examples are excluded. Every prose sentence is at most 22 words and contains no banned marketing word.

| Words | Text | Claim / result |
| ---: | --- | --- |
| 11 | Check whether an offline cloud-file copy has the files you expect. | Plain job statement. |
| 14 | For people keeping a fallback drive, it lists missing, old, changed, and excluded files. | `cli-formats-readiness` |
| 10 | It compares a supplied file list with a local folder. | `cli-formats-readiness` |
| 10 | It does not sign in, copy files, or restore files. | `cli-no-account`, `cli-read-only` |
| 8 | Build the Rust command-line tool from this repository. | Install instruction. |
| 5 | Try the bundled sample immediately. | `cli-demo` |
| 11 | The command writes a sample folder in a new temporary directory. | `cli-demo` |
| 9 | It prints two missing files and one open exclusion. | `cli-demo` |
| 16 | Give the tool a JSON, CSV, or rclone JSON file list and an offline folder. | `cli-formats-readiness` |
| 6 | Use JSON output in a script. | Documented instruction. |
| 10 | Missing files make the default command exit with code 2. | `cli-exit-codes` |
| 9 | Use `--acknowledge` only for an exclusion you have checked. | `cli-acknowledgement` |
| 10 | Use `--redact-paths` to replace printed file paths with stable labels. | `cli-redaction` |
| 13 | Set a passphrase outside the command line, then write an encrypted `.cee` report. | `encrypted-report` |
| 11 | Saved reports are encrypted and need the supplied passphrase to decrypt. | `encrypted-report` |
| 5 | Terminal output is not encrypted. | `encrypted-report` |
| 5 | Protect or redirect it yourself. | Direct next action. |
| 5 | JSON uses a `files` array. | `cli-formats-readiness` |
| 6 | Each file needs a relative `path`. | `cli-validation-and-links` |
| 8 | It can also include `size`, `modified`, and `sha256`. | `cli-formats-readiness` |
| 4 | CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. | `cli-formats-readiness` |
| 9 | rclone JSON lists use `Path`, `Size`, `ModTime`, and `IsDir`. | `cli-formats-readiness` |
| 7 | Paths must stay inside the selected folder. | `cli-validation-and-links` |
| 6 | Duplicate and escaping paths are rejected. | `duplicate-paths`, `cli-validation-and-links` |
| 9 | Links are reported as unsafe and are never followed. | `cli-validation-and-links` |
| 11 | `READY` means every listed file passed and no exclusion is open. | `cli-formats-readiness` |
| 12 | `READY WITH EXCEPTIONS` means every file passed and listed exclusions were acknowledged. | `cli-acknowledgement` |
| 12 | `NOT READY` means a file is missing, old, changed, unsafe, or unacknowledged. | CLI claim set. |
| 5 | A passing check exits 0. | `cli-exit-codes` |
| 6 | A failed readiness check exits 2. | `cli-exit-codes` |
| 7 | Invalid input or file errors exit 3. | `cli-exit-codes` |
| 8 | Use `--fail-on exceptions` to fail on acknowledged exclusions. | `cli-fail-on` |
| 10 | Use `--fail-on never` to return 0 after any valid check. | `cli-fail-on` |
| 10 | The site at `cloud-exit-evidence.sociobot.in` includes a local sample at `/demo/`. | `demo-sample-report` |
| 18 | The sample opens with a report, uses only `demo:` browser storage, and is removed when you leave it. | `demo-sample-report`, `demo-isolation` |
| 10 | The browser demo accepts no real file list or folder. | `demo-sample-only` |
| 11 | It checks only bundled sample files and contacts no third-party service. | `demo-sample-only`, `browser-local` |
| 12 | Choose Start for real to leave demo storage and open the command-line setup. | `demo-isolation` |
| 12 | The command-line tool has no network client and sends no usage data. | `cli-no-network` |
| 9 | `npm run build` writes the release binary and `dist/site/`. | `build-artifacts` |
| 8 | Deploy that static directory with its `staticwebapp.config.json` file. | Deployment instruction. |
| 1 | MIT. | `mit-license` |
| 2 | See `LICENSE`. | `mit-license` |

## Terminology

| Concept | One term used |
| --- | --- |
| The comparison activity | check |
| The result shown without setup | sample gap report |
| Browser try-out boundary | demo / bundled sample |
| Files expected from a provider | file list |
| Physical destination | offline copy / folder |
| Terminal program | command-line tool |
| rclone input | rclone JSON file list |
| Known coverage exception | exclusion |
