# Cloud Exit Evidence

Cloud Exit Evidence is a local, provider-neutral audit CLI for people who keep an offline copy of cloud files. It compares a cloud export, provider listing, or sync manifest with a destination on disk and produces a falsifiable answer: complete, complete with explicitly acknowledged exceptions, or not ready.

It is deliberately **not a backup or sync tool**. It never signs in to a provider, downloads files, stores credentials, or repairs gaps.

## Install

Build the single binary from source (Rust 1.85+):

```sh
cargo install --path crates/cloud-exit-evidence
cloud-exit-evidence --help
```

Or build a release binary locally:

```sh
cargo build --release --locked
./target/release/cloud-exit-evidence --help
```

## Usage

Audit a JSON, CSV, or `rclone lsjson` manifest against an offline directory:

```sh
cloud-exit-evidence audit \
  --manifest cloud-export.json \
  --destination /media/offline/cloud-copy
```

Use JSON output in automation and fail the job when evidence is incomplete:

```sh
cloud-exit-evidence audit \
  --manifest cloud-export.json \
  --destination /media/offline/cloud-copy \
  --format json \
  --fail-on gaps
```

Record an understood provider or OS limitation. Acknowledgement is explicit and appears in the evidence:

```sh
cloud-exit-evidence audit \
  --manifest nextcloud.json \
  --destination /media/offline/phone \
  --acknowledge 'Documents/**' \
  --acknowledgement-note 'Android permission restriction; exported separately monthly'
```

Save an encrypted evidence report. The passphrase is read from an environment variable, never a command-line argument or prompt:

```sh
export CEE_PASSPHRASE='use-a-password-manager-generated-secret'
cloud-exit-evidence audit \
  --manifest cloud-export.csv \
  --destination /media/offline/cloud-copy \
  --format json \
  --output evidence-2026-08.cee

cloud-exit-evidence decrypt --input evidence-2026-08.cee
```

`--redact-paths` replaces file paths with stable SHA-256 labels in displayed output. Classification totals remain readable.

### Manifest formats

Native JSON:

```json
{
  "provider": "Example Cloud",
  "generated_at": "2026-08-28T10:00:00Z",
  "files": [
    {"path": "Documents/plan.pdf", "size": 4210, "modified": "2026-08-22T08:30:00Z", "sha256": "optional-lowercase-hex"}
  ],
  "exclusions": [
    {"path": "Documents/private/**", "reason": "mobile OS denied folder access"}
  ]
}
```

CSV headers are `path,size,modified,sha256,excluded,exclusion_reason`. Only `path` is required. Rows with `excluded=true` describe known coverage exclusions rather than expected files.

`rclone lsjson` arrays are accepted directly using `Path`, `Size`, `ModTime`, and `IsDir`. Directories are ignored.

Paths must be relative, UTF-8, and must not contain `..`. Duplicate manifest paths are rejected. Symlinks in the destination are listed as unsafe and are never followed.

### Readiness and exit codes

- `READY`: every expected file is present and current, and no exclusions are open.
- `READY WITH EXCEPTIONS`: file evidence passes and every declared exclusion is explicitly acknowledged.
- `NOT READY`: missing, stale, size/hash mismatch, unsafe, unreadable, or unacknowledged coverage exists.

Exit codes: `0` completed and the selected `--fail-on` policy passed; `2` readiness policy failed; `3` invalid input or filesystem error. The default `--fail-on gaps` makes a not-ready audit exit `2`, while acknowledged exceptions pass.

## Develop and verify

```sh
npm ci
npm test
npm run build
```

`npm test` runs Rust formatting/lints/tests plus site unit and browser tests. It also verifies the generated Azure Static Web Apps response policy: a restrictive CSP and permissions policy, `no-referrer`, immutable fingerprinted assets, and a revalidated service worker. `npm run build` creates the release CLI and the deployable static site at `dist/site/`. Deploy `dist/site/` to Azure Static Web Apps; its root-level `staticwebapp.config.json` is required for the security and cache policy. `cargo package --locked --allow-dirty` verifies the publishable Rust crate; registry publishing is handled by the factory.

## Website

The landing page at <https://cloud-exit-evidence.sociobot.in> documents the CLI and includes a fully local browser demo. Selected folder names and manifest content stay in that browser tab: there are no accounts, analytics, third-party scripts, or network uploads.

## Privacy and security

Cloud Exit Evidence works offline and has no telemetry. It reads manifests and destination metadata, hashes local files only when the manifest provides a SHA-256 value, and never follows symlinks. Saved reports created with `--output` are encrypted with XChaCha20-Poly1305 using an Argon2id-derived key. Plain stdout remains the caller’s responsibility.

## License

MIT. See [LICENSE](LICENSE).
