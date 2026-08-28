use crate::audit::{AuditReport, FileState, Readiness};
use crate::{EvidenceError, Result};
use sha2::{Digest, Sha256};
use std::fmt::Write;

#[derive(Debug, Clone, Copy)]
pub enum OutputFormat {
    Terminal,
    Json,
    Markdown,
}

pub fn render(report: &AuditReport, format: OutputFormat) -> Result<String> {
    match format {
        OutputFormat::Json => serde_json::to_string_pretty(report)
            .map_err(|e| EvidenceError::Serialize(e.to_string())),
        OutputFormat::Terminal => Ok(terminal(report)),
        OutputFormat::Markdown => Ok(markdown(report)),
    }
}

pub fn redact(report: &mut AuditReport) {
    report.destination = "[redacted destination]".into();
    for file in &mut report.files {
        file.path = path_label(&file.path);
    }
    for exclusion in &mut report.exclusions {
        exclusion.path = path_label(&exclusion.path);
    }
    report.extra_files = report
        .extra_files
        .iter()
        .map(|path| path_label(path))
        .collect();
    report.unsafe_links = report
        .unsafe_links
        .iter()
        .map(|path| path_label(path))
        .collect();
    report.by_folder = report
        .by_folder
        .iter()
        .map(|(key, value)| (path_label(key), value.clone()))
        .collect();
}

fn path_label(path: &str) -> String {
    format!(
        "path:{}",
        &hex::encode(Sha256::digest(path.as_bytes()))[..12]
    )
}

fn readiness_label(readiness: Readiness) -> &'static str {
    match readiness {
        Readiness::Ready => "READY",
        Readiness::ReadyWithExceptions => "READY WITH EXCEPTIONS",
        Readiness::NotReady => "NOT READY",
    }
}

fn terminal(report: &AuditReport) -> String {
    let mut out = String::new();
    let s = &report.summary;
    writeln!(
        out,
        "CLOUD EXIT EVIDENCE  /  {}",
        readiness_label(report.readiness)
    )
    .unwrap();
    writeln!(out, "Provider:    {}", report.provider).unwrap();
    writeln!(out, "Destination: {}", report.destination).unwrap();
    writeln!(out, "Audited:     {}", report.audited_at.to_rfc3339()).unwrap();
    writeln!(
        out,
        "────────────────────────────────────────────────────────"
    )
    .unwrap();
    writeln!(
        out,
        "Expected {:>6}   Verified {:>6}   Unverified {:>6}",
        s.expected, s.verified, s.present_unverified
    )
    .unwrap();
    writeln!(
        out,
        "Missing  {:>6}   Stale    {:>6}   Mismatch   {:>6}",
        s.missing,
        s.stale,
        s.size_mismatch + s.hash_mismatch
    )
    .unwrap();
    writeln!(
        out,
        "Excluded {:>6}   Open     {:>6}   Extra      {:>6}",
        s.exclusions, s.unacknowledged_exclusions, s.extra
    )
    .unwrap();

    let findings: Vec<_> = report
        .files
        .iter()
        .filter(|file| file.state.is_gap())
        .collect();
    if !findings.is_empty() {
        writeln!(out, "\nUNRESOLVED FILE EVIDENCE").unwrap();
        for file in findings {
            writeln!(
                out,
                "  [{}] {} — {}",
                state_label(file.state),
                file.path,
                file.detail
            )
            .unwrap();
        }
    }
    if !report.exclusions.is_empty() {
        writeln!(out, "\nDECLARED EXCLUSIONS").unwrap();
        for exclusion in &report.exclusions {
            let state = if exclusion.acknowledged {
                "ACKNOWLEDGED"
            } else {
                "OPEN"
            };
            writeln!(out, "  [{state}] {} — {}", exclusion.path, exclusion.reason).unwrap();
            if let Some(note) = &exclusion.acknowledgement_note {
                writeln!(out, "    Note: {note}").unwrap();
            }
        }
    }
    writeln!(
        out,
        "\nThis is coverage evidence, not a backup. Restore-test critical files."
    )
    .unwrap();
    out
}

fn markdown(report: &AuditReport) -> String {
    let mut out = String::new();
    let s = &report.summary;
    writeln!(
        out,
        "# Cloud exit evidence: {}\n",
        readiness_label(report.readiness)
    )
    .unwrap();
    writeln!(out, "- **Provider:** {}", report.provider).unwrap();
    writeln!(out, "- **Destination:** `{}`", report.destination).unwrap();
    writeln!(out, "- **Audited:** {}", report.audited_at.to_rfc3339()).unwrap();
    writeln!(
        out,
        "\n> This is coverage evidence, not a backup. Restore-test critical files.\n"
    )
    .unwrap();
    writeln!(out, "| Expected | Verified | Present, unverified | Missing | Stale | Mismatch | Exclusions open |").unwrap();
    writeln!(out, "| ---: | ---: | ---: | ---: | ---: | ---: | ---: |").unwrap();
    writeln!(
        out,
        "| {} | {} | {} | {} | {} | {} | {} |",
        s.expected,
        s.verified,
        s.present_unverified,
        s.missing,
        s.stale,
        s.size_mismatch + s.hash_mismatch,
        s.unacknowledged_exclusions
    )
    .unwrap();
    writeln!(out, "\n## Findings\n").unwrap();
    for file in report.files.iter().filter(|file| file.state.is_gap()) {
        writeln!(
            out,
            "- **{}** `{}` — {}",
            state_label(file.state),
            file.path,
            file.detail
        )
        .unwrap();
    }
    for exclusion in &report.exclusions {
        let state = if exclusion.acknowledged {
            "ACKNOWLEDGED"
        } else {
            "OPEN EXCLUSION"
        };
        writeln!(
            out,
            "- **{state}** `{}` — {}",
            exclusion.path, exclusion.reason
        )
        .unwrap();
    }
    if report.files.iter().all(|f| !f.state.is_gap()) && report.exclusions.is_empty() {
        writeln!(out, "- No coverage gaps found.").unwrap();
    }
    out
}

fn state_label(state: FileState) -> &'static str {
    match state {
        FileState::Verified => "VERIFIED",
        FileState::PresentUnverified => "PRESENT",
        FileState::Missing => "MISSING",
        FileState::Stale => "STALE",
        FileState::SizeMismatch => "SIZE",
        FileState::HashMismatch => "HASH",
        FileState::Unsafe => "UNSAFE",
        FileState::Unreadable => "UNREADABLE",
    }
}
