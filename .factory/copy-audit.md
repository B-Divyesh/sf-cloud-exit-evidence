# Landing copy audit — polish 4

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
| 10 | sentence | The browser sample checks your file list in this tab. | `browser-local` |
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

Controls audited separately: **CEE / 001**, **Demo**, **How it works**, **Install**, **Privacy**, **Copy install command**, **Copy demo command**, **Terms**, **Source**, **Built by Param Factory**, and **Build polish-4**. Every action names its result. The control labels contain no banned wording.

## Demo error states

| Words | Error | Result |
| ---: | --- | --- |
| 6 | Add a file list before checking. | Uses the visible “file list” and “checking” terms. |
| 12 | This file list is not valid JSON. Check its commas and quotation marks. | Names the input and the next correction. |
| 9 | Select a folder or load the sample files. | Uses the visible folder and sample-file terms. |
| 2 | Checking files… | Names the active work plainly. |

## Terminology

| Concept | One term used |
| --- | --- |
| The comparison activity | check |
| The result shown without setup | sample gap report |
| Files expected from a provider | file list |
| Physical destination | offline copy / folder |
| Terminal program | command-line tool |
| rclone input | rclone JSON file list |
| Known coverage exception | exclusion |
