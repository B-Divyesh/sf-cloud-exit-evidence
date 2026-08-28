use clap::{Parser, Subcommand, ValueEnum};
use cloud_exit_evidence::audit::{AuditOptions, Readiness, audit};
use cloud_exit_evidence::crypto;
use cloud_exit_evidence::manifest::read_manifest;
use cloud_exit_evidence::report::{OutputFormat, redact, render};
use cloud_exit_evidence::{EvidenceError, Result};
use std::path::PathBuf;

#[derive(Parser)]
#[command(
    name = "cloud-exit-evidence",
    version,
    about = "Prove whether a physical cloud-file copy covers the provider manifest",
    long_about = "Compare a provider export, sync manifest, or rclone listing with an offline destination. Reports missing, stale, mismatched, unsafe, and explicitly excluded coverage. This audits a copy; it does not create a backup or access cloud credentials."
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Compare a manifest with a local destination
    Audit {
        /// JSON, CSV, or rclone lsjson manifest
        #[arg(short, long)]
        manifest: PathBuf,
        /// Offline copy to inspect (symlinks are not followed)
        #[arg(short, long)]
        destination: PathBuf,
        /// Seconds a local modified time may trail the manifest
        #[arg(long, default_value_t = 2)]
        stale_tolerance_seconds: i64,
        /// Acknowledge a declared exclusion pattern (repeatable)
        #[arg(long)]
        acknowledge: Vec<String>,
        /// Record why acknowledged exclusions are acceptable
        #[arg(long, requires = "acknowledge")]
        acknowledgement_note: Option<String>,
        /// Report format written to stdout or encrypted output
        #[arg(long, value_enum, default_value_t = FormatArg::Terminal)]
        format: FormatArg,
        /// Encrypted report file; requires CEE_PASSPHRASE
        #[arg(short, long)]
        output: Option<PathBuf>,
        /// Replace paths with stable hashed labels
        #[arg(long)]
        redact_paths: bool,
        /// Choose when audit exits with code 2
        #[arg(long, value_enum, default_value_t = FailOn::Gaps)]
        fail_on: FailOn,
    },
    /// Decrypt an evidence report to stdout
    Decrypt {
        /// Encrypted .cee report
        #[arg(short, long)]
        input: PathBuf,
    },
}

#[derive(Clone, Copy, ValueEnum)]
enum FormatArg {
    Terminal,
    Json,
    Markdown,
}

#[derive(Clone, Copy, ValueEnum)]
enum FailOn {
    /// Fail only when unresolved gaps exist
    Gaps,
    /// Fail for unresolved gaps or acknowledged exceptions
    Exceptions,
    /// Always exit zero after a successful audit
    Never,
}

fn main() {
    let code = match run(Cli::parse()) {
        Ok(code) => code,
        Err(error) => {
            eprintln!("error: {error}");
            3
        }
    };
    std::process::exit(code);
}

fn run(cli: Cli) -> Result<i32> {
    match cli.command {
        Command::Audit {
            manifest,
            destination,
            stale_tolerance_seconds,
            acknowledge,
            acknowledgement_note,
            format,
            output,
            redact_paths,
            fail_on,
        } => {
            if stale_tolerance_seconds < 0 {
                return Err(EvidenceError::Config(
                    "--stale-tolerance-seconds cannot be negative".into(),
                ));
            }
            for pattern in &acknowledge {
                globset::Glob::new(pattern).map_err(|error| {
                    EvidenceError::Config(format!(
                        "invalid --acknowledge pattern {pattern:?}: {error}"
                    ))
                })?;
            }
            let manifest = read_manifest(&manifest)?;
            let mut report = audit(
                &manifest,
                &destination,
                &AuditOptions {
                    stale_tolerance_seconds,
                    acknowledgements: acknowledge,
                    acknowledgement_note,
                },
            )?;
            if redact_paths {
                redact(&mut report);
            }
            let rendered = render(
                &report,
                match format {
                    FormatArg::Terminal => OutputFormat::Terminal,
                    FormatArg::Json => OutputFormat::Json,
                    FormatArg::Markdown => OutputFormat::Markdown,
                },
            )?;
            if let Some(path) = output {
                let passphrase = std::env::var("CEE_PASSPHRASE").map_err(|_| {
                    EvidenceError::Config(
                        "--output requires CEE_PASSPHRASE (12+ characters)".into(),
                    )
                })?;
                let encrypted = crypto::encrypt(rendered.as_bytes(), &passphrase)?;
                std::fs::write(&path, encrypted).map_err(|source| EvidenceError::Io {
                    path: path.display().to_string(),
                    source,
                })?;
                eprintln!("Encrypted evidence written to {}", path.display());
            } else {
                println!("{rendered}");
            }
            let failed = match fail_on {
                FailOn::Never => false,
                FailOn::Gaps => report.readiness == Readiness::NotReady,
                FailOn::Exceptions => report.readiness != Readiness::Ready,
            };
            Ok(if failed { 2 } else { 0 })
        }
        Command::Decrypt { input } => {
            let passphrase = std::env::var("CEE_PASSPHRASE")
                .map_err(|_| EvidenceError::Config("decrypt requires CEE_PASSPHRASE".into()))?;
            let bytes = std::fs::read(&input).map_err(|source| EvidenceError::Io {
                path: input.display().to_string(),
                source,
            })?;
            let plaintext = crypto::decrypt(&bytes, &passphrase)?;
            let text = String::from_utf8(plaintext)
                .map_err(|_| EvidenceError::Crypto("decrypted report is not UTF-8".into()))?;
            print!("{text}");
            Ok(0)
        }
    }
}
