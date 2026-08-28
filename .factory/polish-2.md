# Polish 2 — cumulative review closure

Repair commit: `05bb256fc3c81f51682ff6bb5775e8445b54f3df`.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| Review 1 / 1 | Kept the claim inventory and added observable tests for mobile first-screen result, read-only behavior, acknowledgement, exact exit codes, and whole-site runtime privacy. | Every id has exactly one `@claim:<id>` test; `npm run test:claims -- --grep @claim:` passes. |
| Review 1 / 2 | Kept the isolated `/demo/` and `?demo=1` entry, banner, reset, exit cleanup, shipped sample, and CLI `demo`; made the browser and CLI fixtures identical. | `@claim:demo-isolation`, `@claim:demo-sample-report`, `@claim:cli-demo`; live `/?demo=1` check passed. |
| Review 1 / 3 | Kept direct routes and product 404; replaced referrer-dependent focus with an intentional same-origin navigation marker. | `@claim:routing-focus` under preview `Referrer-Policy: no-referrer`; live header navigation focuses the demo h1. |
| Review 1 / 4 | Retained the plain first-screen headline, audience sentence, primary demo action, outcome note, and three facts. | `.factory/copy-audit.md`; live cold home check passed. |
| Review 1 / 5 | Retained per-route metadata, canonical/OG/Twitter fields, favicon, shared legal links, and build label. | Browser metadata/a11y route tests; live `/`, `/demo/`, `/privacy/`, `/terms/` checks passed. |
| Review 1 / 6 | Replaced remaining lower-page `CLI`, rclone, and sample-audit wording with command-line tool, rclone JSON file list, and sample file-copy check. | `.factory/copy-audit.md`; browser copy and route checks pass. |
| Review 1 / 7 | Listed each remaining visitor-facing behavior, or simplified copy where the named technical detail did not add user value. | `.factory/claims.json` and one tagged test per entry. |
| F-2-1 | Moved the real report ahead of the editable inputs; compacted mobile-only demo framing so status, both missing paths, and exclusion fit in 390×844. | `@claim:demo-first-screen`; `.factory/evidence/demo-first-screen-390.png`; live `.factory/evidence/live-polish-2-demo-mobile.png`. |
| F-2-2 | Aligned browser, CLI, example README, landing preview, and a self-hosted SVG terminal transcript to two missing files plus the Android exclusion. | `@claim:cli-demo`; live landing recording check; `cloud-exit-evidence demo`. |
| F-2-3 | Persisted a destination-keyed internal-navigation marker before same-origin page changes, then focus/announce on `pageshow`; preview sends production’s `no-referrer` header. | `@claim:routing-focus`; live header Demo check passed. |
| F-2-4 | Added a read-only claim that hashes the manifest and selected folder before/after normal audit. | `@claim:cli-read-only`. |
| F-2-5 | Added acknowledgement and exact exit-code claims with separate ready, gap, invalid-input, and acknowledged-exclusion fixtures. | `@claim:cli-acknowledgement`; `@claim:cli-exit-codes`. |
| F-2-6 | Rewrote public encryption copy to the observable promise: encrypted reports require the supplied passphrase. | `@claim:encrypted-report`; README and Privacy review. |
| F-2-7 | Added a whole-site runtime request-origin claim over landing, demo, legal pages, and 404; retained the no-account claim. | `@claim:site-no-third-party-runtime`; `@claim:no-account`. |
| F-2-8 | Split exit-code prose into three short sentences. | README review and `.factory/copy-audit.md`. |
| F-2-9 | Standardized visitor copy on “check,” “command-line tool,” and “rclone JSON file list.” | README, landing, demo, and `.factory/copy-audit.md`. |

## Live verification

Static deployment `9a76f0f0-6f26-4dcb-ac38-6a996addf87d` completed on 2026-08-28. A cold 390×844 context then passed on `https://cloud-exit-evidence.sociobot.in/`: first-screen demo action, `?demo=1`, banner, initial sample result, forward heading focus, all named routes, title/main/h1, designed 404, and zero console errors.
