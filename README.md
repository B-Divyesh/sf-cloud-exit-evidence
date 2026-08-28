# Cloud Exit Evidence

Check whether an offline cloud-file copy has the files you expect.

For people keeping a fallback drive, it lists missing, old, changed, and excluded files. It compares a supplied file list with a local folder. It does not sign in, copy files, or restore files.

## Install

Build the Rust command-line tool from this repository:

```sh
cargo install --path crates/cloud-exit-evidence
cloud-exit-evidence --help
```

Try the bundled sample immediately:

```sh
cloud-exit-evidence demo
```

The command writes a sample folder in a new temporary directory. It prints the directory path and an intentional-gap report.

## Check a folder

Give the tool a JSON, CSV, or rclone `lsjson` file list and an offline folder:

```sh
cloud-exit-evidence audit \
  --manifest cloud-export.json \
  --destination /media/offline/cloud-copy
```

Use JSON output in a script. Missing files make the default command exit with code 2:

```sh
cloud-exit-evidence audit \
  --manifest cloud-export.json \
  --destination /media/offline/cloud-copy \
  --format json
```

Use `--acknowledge` only for an exclusion you have checked:

```sh
cloud-exit-evidence audit \
  --manifest cloud-export.json \
  --destination /media/offline/cloud-copy \
  --acknowledge 'Phone/Documents/**' \
  --acknowledgement-note 'Exported separately each month'
```

Use `--redact-paths` to replace printed file paths with stable labels.

## Save an encrypted report

Set a passphrase outside the command line, then write an encrypted `.cee` report:

```sh
export CEE_PASSPHRASE='use-a-password-manager-generated-secret'
cloud-exit-evidence audit \
  --manifest cloud-export.json \
  --destination /media/offline/cloud-copy \
  --format json \
  --output evidence.cee

cloud-exit-evidence decrypt --input evidence.cee
```

Saved reports use XChaCha20-Poly1305 encryption and an Argon2id-derived key. Plain terminal output remains under your control.

## File-list rules

JSON uses a `files` array. Each file needs a relative `path`. It can also include `size`, `modified`, and `sha256`.

```json
{
  "files": [
    {"path": "Documents/plan.pdf", "size": 4210, "modified": "2026-08-22T08:30:00Z"}
  ],
  "exclusions": [
    {"path": "Phone/Documents/**", "reason": "Android denied folder access"}
  ]
}
```

CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. rclone lists use `Path`, `Size`, `ModTime`, and `IsDir`.

Paths must stay inside the selected folder. Duplicate and escaping paths are rejected. Links are reported as unsafe and are never followed.

## Results and exit codes

- `READY` means every listed file passed and no exclusion is open.
- `READY WITH EXCEPTIONS` means every file passed and listed exclusions were acknowledged.
- `NOT READY` means a file is missing, old, changed, unsafe, unreadable, or unacknowledged.

The command exits 0 after a passing policy, 2 for a failed readiness policy, and 3 for invalid input or a file-system error. Use `--fail-on exceptions` or `--fail-on never` when needed.

## Website and privacy

The site at <https://cloud-exit-evidence.sociobot.in> includes a local sample at [/demo/](https://cloud-exit-evidence.sociobot.in/demo/). The sample opens with a report, uses only `demo:` browser storage, and is removed when you leave it.

The browser sample does not upload file-list text or selected file details. It calls no third-party runtime service. The CLI contains no network client or telemetry.

## Develop and verify

```sh
npm ci
npm test
npm run build
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

`npm run build` writes the release binary and `dist/site/`. Deploy that static directory with its `staticwebapp.config.json` file. Registry publishing is factory-owned; do not publish from this checkout.

## License

MIT. See [LICENSE](LICENSE).
