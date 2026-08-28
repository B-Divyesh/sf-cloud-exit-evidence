use crate::manifest::{Exclusion, Manifest};
use crate::{EvidenceError, Result};
use chrono::{DateTime, Utc};
use globset::Glob;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, HashSet};
use std::fs::File;
use std::io::Read;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Readiness {
    Ready,
    ReadyWithExceptions,
    NotReady,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FileState {
    Verified,
    PresentUnverified,
    Missing,
    Stale,
    SizeMismatch,
    HashMismatch,
    Unsafe,
    Unreadable,
}

impl FileState {
    pub fn is_gap(self) -> bool {
        !matches!(self, Self::Verified | Self::PresentUnverified)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileEvidence {
    pub path: String,
    pub state: FileState,
    pub expected_size: Option<u64>,
    pub actual_size: Option<u64>,
    pub detail: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExclusionEvidence {
    pub path: String,
    pub reason: String,
    pub acknowledged: bool,
    pub acknowledgement_note: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct CoverageBucket {
    pub expected: u64,
    pub present: u64,
    pub gaps: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditReport {
    pub schema_version: u8,
    pub audited_at: DateTime<Utc>,
    pub provider: String,
    pub manifest_generated_at: Option<DateTime<Utc>>,
    pub destination: String,
    pub readiness: Readiness,
    pub summary: Summary,
    pub files: Vec<FileEvidence>,
    pub exclusions: Vec<ExclusionEvidence>,
    pub extra_files: Vec<String>,
    pub unsafe_links: Vec<String>,
    pub by_folder: BTreeMap<String, CoverageBucket>,
    pub by_type: BTreeMap<String, CoverageBucket>,
    pub by_month: BTreeMap<String, CoverageBucket>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Summary {
    pub expected: u64,
    pub verified: u64,
    pub present_unverified: u64,
    pub missing: u64,
    pub stale: u64,
    pub size_mismatch: u64,
    pub hash_mismatch: u64,
    pub unsafe_or_unreadable: u64,
    pub extra: u64,
    pub exclusions: u64,
    pub unacknowledged_exclusions: u64,
}

pub struct AuditOptions {
    pub stale_tolerance_seconds: i64,
    pub acknowledgements: Vec<String>,
    pub acknowledgement_note: Option<String>,
}

pub fn audit(
    manifest: &Manifest,
    destination: &Path,
    options: &AuditOptions,
) -> Result<AuditReport> {
    if !destination.is_dir() {
        return Err(EvidenceError::Config(format!(
            "destination is not a readable directory: {}",
            destination.display()
        )));
    }
    let root = destination
        .canonicalize()
        .map_err(|source| EvidenceError::Io {
            path: destination.display().to_string(),
            source,
        })?;
    let expected_paths: HashSet<&str> = manifest.files.iter().map(|f| f.path.as_str()).collect();
    let mut files = Vec::with_capacity(manifest.files.len());
    let mut summary = Summary {
        expected: manifest.files.len() as u64,
        ..Summary::default()
    };
    let mut by_folder = BTreeMap::new();
    let mut by_type = BTreeMap::new();
    let mut by_month = BTreeMap::new();

    for expected in &manifest.files {
        let evidence = inspect_file(&root, expected, options.stale_tolerance_seconds);
        count_state(&mut summary, evidence.state);
        update_bucket(
            &mut by_folder,
            classify_folder(&expected.path),
            evidence.state,
        );
        update_bucket(&mut by_type, classify_type(&expected.path), evidence.state);
        let month = expected
            .modified
            .map(|d| d.format("%Y-%m").to_string())
            .unwrap_or_else(|| "unknown date".into());
        update_bucket(&mut by_month, month, evidence.state);
        files.push(evidence);
    }

    let (extra_files, unsafe_links) = inventory_destination(&root, &expected_paths)?;
    summary.extra = extra_files.len() as u64;
    summary.unsafe_or_unreadable += unsafe_links.len() as u64;
    let exclusions = manifest
        .exclusions
        .iter()
        .map(|exclusion| exclusion_evidence(exclusion, options))
        .collect::<Vec<_>>();
    summary.exclusions = exclusions.len() as u64;
    summary.unacknowledged_exclusions =
        exclusions.iter().filter(|e| !e.acknowledged).count() as u64;

    let file_gaps = files.iter().any(|file| file.state.is_gap()) || !unsafe_links.is_empty();
    let readiness = if file_gaps || summary.unacknowledged_exclusions > 0 {
        Readiness::NotReady
    } else if summary.exclusions > 0 {
        Readiness::ReadyWithExceptions
    } else {
        Readiness::Ready
    };

    Ok(AuditReport {
        schema_version: 1,
        audited_at: Utc::now(),
        provider: manifest.provider.clone(),
        manifest_generated_at: manifest.generated_at,
        destination: root.display().to_string(),
        readiness,
        summary,
        files,
        exclusions,
        extra_files,
        unsafe_links,
        by_folder,
        by_type,
        by_month,
    })
}

fn inspect_file(
    root: &Path,
    expected: &crate::manifest::ExpectedFile,
    tolerance: i64,
) -> FileEvidence {
    let path = root.join(Path::new(&expected.path));
    if path_has_symlink(root, &path) {
        return evidence(expected, FileState::Unsafe, None, "path crosses a symlink");
    }
    let metadata = match std::fs::metadata(&path) {
        Ok(value) => value,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            return evidence(
                expected,
                FileState::Missing,
                None,
                "not found in destination",
            );
        }
        Err(error) => {
            return evidence(
                expected,
                FileState::Unreadable,
                None,
                &format!("metadata could not be read: {error}"),
            );
        }
    };
    if !metadata.is_file() {
        return evidence(expected, FileState::Unsafe, None, "expected a regular file");
    }
    let actual_size = metadata.len();
    if let Some(size) = expected.size
        && size != actual_size
    {
        return evidence(
            expected,
            FileState::SizeMismatch,
            Some(actual_size),
            "byte size differs",
        );
    }
    if let Some(expected_hash) = &expected.sha256 {
        match sha256_file(&path) {
            Ok(actual_hash) if &actual_hash != expected_hash => {
                return evidence(
                    expected,
                    FileState::HashMismatch,
                    Some(actual_size),
                    "SHA-256 differs",
                );
            }
            Err(error) => {
                return evidence(
                    expected,
                    FileState::Unreadable,
                    Some(actual_size),
                    &format!("hash could not be read: {error}"),
                );
            }
            _ => {}
        }
    }
    if let Some(expected_modified) = expected.modified
        && let Ok(actual_modified) = metadata.modified()
    {
        let actual_modified: DateTime<Utc> = actual_modified.into();
        if expected_modified.timestamp() - actual_modified.timestamp() > tolerance {
            return evidence(
                expected,
                FileState::Stale,
                Some(actual_size),
                &format!("local copy predates manifest by more than {tolerance}s"),
            );
        }
    }
    let state = if expected.sha256.is_some() {
        FileState::Verified
    } else {
        FileState::PresentUnverified
    };
    let detail = if expected.sha256.is_some() {
        "size and SHA-256 match"
    } else {
        "present; no manifest hash to verify contents"
    };
    evidence(expected, state, Some(actual_size), detail)
}

fn evidence(
    expected: &crate::manifest::ExpectedFile,
    state: FileState,
    actual_size: Option<u64>,
    detail: &str,
) -> FileEvidence {
    FileEvidence {
        path: expected.path.clone(),
        state,
        expected_size: expected.size,
        actual_size,
        detail: detail.into(),
    }
}

fn path_has_symlink(root: &Path, path: &Path) -> bool {
    let Ok(relative) = path.strip_prefix(root) else {
        return true;
    };
    let mut current = PathBuf::from(root);
    for component in relative.components() {
        current.push(component);
        if std::fs::symlink_metadata(&current)
            .map(|metadata| metadata.file_type().is_symlink())
            .unwrap_or(false)
        {
            return true;
        }
    }
    false
}

fn sha256_file(path: &Path) -> std::io::Result<String> {
    let mut file = File::open(path)?;
    let mut hash = Sha256::new();
    let mut buffer = [0_u8; 64 * 1024];
    loop {
        let read = file.read(&mut buffer)?;
        if read == 0 {
            break;
        }
        hash.update(&buffer[..read]);
    }
    Ok(hex::encode(hash.finalize()))
}

fn inventory_destination(
    root: &Path,
    expected: &HashSet<&str>,
) -> Result<(Vec<String>, Vec<String>)> {
    let mut extra = Vec::new();
    let mut unsafe_links = Vec::new();
    for item in WalkDir::new(root).follow_links(false).into_iter().skip(1) {
        let entry = match item {
            Ok(entry) => entry,
            Err(error) => {
                unsafe_links.push(
                    error
                        .path()
                        .and_then(|path| path.strip_prefix(root).ok())
                        .map(|path| path.to_string_lossy().replace('\\', "/"))
                        .unwrap_or_else(|| format!("unreadable entry: {error}")),
                );
                continue;
            }
        };
        let relative = entry
            .path()
            .strip_prefix(root)
            .unwrap_or(entry.path())
            .to_string_lossy()
            .replace('\\', "/");
        if entry.file_type().is_symlink() {
            unsafe_links.push(relative);
        } else if entry.file_type().is_file() && !expected.contains(relative.as_str()) {
            extra.push(relative);
        }
    }
    extra.sort();
    unsafe_links.sort();
    Ok((extra, unsafe_links))
}

fn exclusion_evidence(exclusion: &Exclusion, options: &AuditOptions) -> ExclusionEvidence {
    let acknowledged = options.acknowledgements.iter().any(|ack| {
        ack == &exclusion.path
            || Glob::new(ack)
                .ok()
                .map(|glob| glob.compile_matcher().is_match(&exclusion.path))
                .unwrap_or(false)
    });
    ExclusionEvidence {
        path: exclusion.path.clone(),
        reason: exclusion.reason.clone(),
        acknowledged,
        acknowledgement_note: acknowledged.then(|| {
            options
                .acknowledgement_note
                .clone()
                .unwrap_or_else(|| "acknowledged by operator".into())
        }),
    }
}

fn count_state(summary: &mut Summary, state: FileState) {
    match state {
        FileState::Verified => summary.verified += 1,
        FileState::PresentUnverified => summary.present_unverified += 1,
        FileState::Missing => summary.missing += 1,
        FileState::Stale => summary.stale += 1,
        FileState::SizeMismatch => summary.size_mismatch += 1,
        FileState::HashMismatch => summary.hash_mismatch += 1,
        FileState::Unsafe | FileState::Unreadable => summary.unsafe_or_unreadable += 1,
    }
}

fn update_bucket(map: &mut BTreeMap<String, CoverageBucket>, key: String, state: FileState) {
    let bucket = map.entry(key).or_default();
    bucket.expected += 1;
    if state.is_gap() {
        bucket.gaps += 1;
    } else {
        bucket.present += 1;
    }
}

fn classify_folder(path: &str) -> String {
    path.split('/').next().unwrap_or("root").to_owned()
}

fn classify_type(path: &str) -> String {
    let ext = Path::new(path)
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    match ext.as_str() {
        "jpg" | "jpeg" | "png" | "gif" | "webp" | "heic" | "raw" | "svg" => "images",
        "mp4" | "mov" | "mkv" | "avi" | "webm" => "video",
        "mp3" | "wav" | "flac" | "m4a" | "ogg" => "audio",
        "pdf" | "doc" | "docx" | "odt" | "txt" | "rtf" | "xls" | "xlsx" | "csv" | "ppt"
        | "pptx" => "documents",
        "zip" | "tar" | "gz" | "7z" | "rar" => "archives",
        "rs" | "go" | "py" | "js" | "ts" | "html" | "css" | "json" | "yaml" | "yml" => "code/data",
        "" => "no extension",
        _ => "other",
    }
    .to_owned()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::manifest::{ExpectedFile, Manifest};
    use chrono::TimeZone;
    use std::io::Write;

    #[test]
    fn finds_missing_stale_hash_and_exclusion_gaps() {
        let dir = tempfile::tempdir().unwrap();
        let mut good = File::create(dir.path().join("good.txt")).unwrap();
        good.write_all(b"good").unwrap();
        let manifest = Manifest {
            provider: "test".into(),
            generated_at: None,
            files: vec![
                ExpectedFile {
                    path: "good.txt".into(),
                    size: Some(4),
                    modified: None,
                    sha256: Some(hex::encode(Sha256::digest(b"good"))),
                    is_dir: false,
                },
                ExpectedFile {
                    path: "missing.pdf".into(),
                    size: Some(10),
                    modified: Some(Utc.with_ymd_and_hms(2026, 1, 1, 0, 0, 0).unwrap()),
                    sha256: None,
                    is_dir: false,
                },
            ],
            exclusions: vec![Exclusion {
                path: "Phone/Documents/**".into(),
                reason: "permission denied".into(),
            }],
        };
        let report = audit(
            &manifest,
            dir.path(),
            &AuditOptions {
                stale_tolerance_seconds: 2,
                acknowledgements: vec![],
                acknowledgement_note: None,
            },
        )
        .unwrap();
        assert_eq!(report.readiness, Readiness::NotReady);
        assert_eq!(report.summary.verified, 1);
        assert_eq!(report.summary.missing, 1);
        assert_eq!(report.summary.unacknowledged_exclusions, 1);
    }

    #[test]
    fn acknowledged_exclusion_is_ready_with_exceptions() {
        let dir = tempfile::tempdir().unwrap();
        let manifest = Manifest {
            provider: "test".into(),
            generated_at: None,
            files: vec![],
            exclusions: vec![Exclusion {
                path: "Documents/**".into(),
                reason: "permission".into(),
            }],
        };
        let report = audit(
            &manifest,
            dir.path(),
            &AuditOptions {
                stale_tolerance_seconds: 2,
                acknowledgements: vec!["Documents/**".into()],
                acknowledgement_note: Some("separate export".into()),
            },
        )
        .unwrap();
        assert_eq!(report.readiness, Readiness::ReadyWithExceptions);
    }

    #[test]
    fn classifies_a_local_file_older_than_manifest_as_stale() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("old.txt");
        std::fs::write(&path, b"old").unwrap();
        filetime::set_file_mtime(&path, filetime::FileTime::from_unix_time(1_700_000_000, 0))
            .unwrap();
        let manifest = Manifest {
            provider: "test".into(),
            generated_at: None,
            files: vec![ExpectedFile {
                path: "old.txt".into(),
                size: Some(3),
                modified: Some(Utc.timestamp_opt(1_800_000_000, 0).unwrap()),
                sha256: None,
                is_dir: false,
            }],
            exclusions: vec![],
        };
        let report = audit(
            &manifest,
            dir.path(),
            &AuditOptions {
                stale_tolerance_seconds: 2,
                acknowledgements: vec![],
                acknowledgement_note: None,
            },
        )
        .unwrap();
        assert_eq!(report.summary.stale, 1);
        assert_eq!(report.readiness, Readiness::NotReady);
    }
}
