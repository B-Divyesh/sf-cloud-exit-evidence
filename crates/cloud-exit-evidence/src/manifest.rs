use crate::{EvidenceError, Result};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::path::{Component, Path};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpectedFile {
    #[serde(alias = "Path")]
    pub path: String,
    #[serde(default, alias = "Size")]
    pub size: Option<u64>,
    #[serde(default, alias = "ModTime")]
    pub modified: Option<DateTime<Utc>>,
    #[serde(default, alias = "Hashes", deserialize_with = "deserialize_hash")]
    pub sha256: Option<String>,
    #[serde(default, alias = "IsDir", skip_serializing)]
    pub is_dir: bool,
}

fn deserialize_hash<'de, D>(deserializer: D) -> std::result::Result<Option<String>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let value = Option::<serde_json::Value>::deserialize(deserializer)?;
    Ok(match value {
        None | Some(serde_json::Value::Null) => None,
        Some(serde_json::Value::String(value)) if value.is_empty() => None,
        Some(serde_json::Value::String(value)) => Some(value),
        Some(serde_json::Value::Object(map)) => map
            .get("SHA-256")
            .or_else(|| map.get("sha256"))
            .and_then(|v| v.as_str())
            .map(str::to_owned),
        _ => None,
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Exclusion {
    pub path: String,
    pub reason: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Manifest {
    #[serde(default = "unknown_provider")]
    pub provider: String,
    #[serde(default)]
    pub generated_at: Option<DateTime<Utc>>,
    #[serde(default)]
    pub files: Vec<ExpectedFile>,
    #[serde(default)]
    pub exclusions: Vec<Exclusion>,
}

fn unknown_provider() -> String {
    "Unspecified provider".to_owned()
}

#[derive(Debug, Deserialize)]
struct CsvRow {
    path: String,
    #[serde(default)]
    size: Option<u64>,
    #[serde(default)]
    modified: Option<DateTime<Utc>>,
    #[serde(default)]
    sha256: Option<String>,
    #[serde(default)]
    excluded: Option<bool>,
    #[serde(default)]
    exclusion_reason: Option<String>,
}

pub fn read_manifest(path: &Path) -> Result<Manifest> {
    let content = std::fs::read_to_string(path).map_err(|source| EvidenceError::Io {
        path: path.display().to_string(),
        source,
    })?;
    if content.trim().is_empty() {
        return Err(EvidenceError::Manifest("the manifest is empty".into()));
    }

    let mut manifest = if path.extension().and_then(|e| e.to_str()) == Some("csv") {
        parse_csv(&content)?
    } else {
        parse_json(&content)?
    };
    validate(&mut manifest)?;
    Ok(manifest)
}

fn parse_json(content: &str) -> Result<Manifest> {
    let value: serde_json::Value = serde_json::from_str(content)
        .map_err(|e| EvidenceError::Manifest(format!("JSON could not be parsed: {e}")))?;
    if value.is_array() {
        let files: Vec<ExpectedFile> = serde_json::from_value(value)
            .map_err(|e| EvidenceError::Manifest(format!("rclone JSON is invalid: {e}")))?;
        Ok(Manifest {
            provider: "rclone listing".into(),
            generated_at: None,
            files,
            exclusions: vec![],
        })
    } else {
        serde_json::from_value(value)
            .map_err(|e| EvidenceError::Manifest(format!("native JSON is invalid: {e}")))
    }
}

fn parse_csv(content: &str) -> Result<Manifest> {
    let mut reader = csv::ReaderBuilder::new()
        .trim(csv::Trim::All)
        .from_reader(content.as_bytes());
    let mut files = Vec::new();
    let mut exclusions = Vec::new();
    for (index, record) in reader.deserialize::<CsvRow>().enumerate() {
        let row = record.map_err(|e| {
            EvidenceError::Manifest(format!("CSV row {} is invalid: {e}", index + 2))
        })?;
        if row.excluded.unwrap_or(false) {
            exclusions.push(Exclusion {
                path: row.path,
                reason: row
                    .exclusion_reason
                    .unwrap_or_else(|| "declared by manifest".into()),
            });
        } else {
            files.push(ExpectedFile {
                path: row.path,
                size: row.size,
                modified: row.modified,
                sha256: row.sha256.filter(|s| !s.is_empty()),
                is_dir: false,
            });
        }
    }
    Ok(Manifest {
        provider: "CSV export".into(),
        generated_at: None,
        files,
        exclusions,
    })
}

fn validate(manifest: &mut Manifest) -> Result<()> {
    manifest.files.retain(|file| !file.is_dir);
    if manifest.files.is_empty() && manifest.exclusions.is_empty() {
        return Err(EvidenceError::Manifest(
            "no files or declared exclusions were found".into(),
        ));
    }
    let mut seen = HashSet::new();
    for file in &mut manifest.files {
        file.path = normalize_relative(&file.path)?;
        if !seen.insert(file.path.clone()) {
            return Err(EvidenceError::Manifest(format!(
                "duplicate path: {}",
                file.path
            )));
        }
        if let Some(hash) = &mut file.sha256 {
            *hash = hash.to_ascii_lowercase();
            if hash.len() != 64 || !hash.bytes().all(|b| b.is_ascii_hexdigit()) {
                return Err(EvidenceError::Manifest(format!(
                    "{} has an invalid SHA-256 value",
                    file.path
                )));
            }
        }
    }
    for exclusion in &mut manifest.exclusions {
        exclusion.path = normalize_pattern(&exclusion.path)?;
        if exclusion.reason.trim().is_empty() {
            return Err(EvidenceError::Manifest(format!(
                "exclusion {} has no reason",
                exclusion.path
            )));
        }
    }
    Ok(())
}

pub fn normalize_relative(value: &str) -> Result<String> {
    let replaced = value.replace('\\', "/");
    let path = Path::new(&replaced);
    if replaced.trim().is_empty() || path.is_absolute() {
        return Err(EvidenceError::Manifest(format!(
            "path must be non-empty and relative: {value:?}"
        )));
    }
    let mut parts = Vec::new();
    for part in path.components() {
        match part {
            Component::Normal(value) => parts.push(value.to_string_lossy().to_string()),
            Component::CurDir => {}
            _ => {
                return Err(EvidenceError::Manifest(format!(
                    "path escapes the destination: {value}"
                )));
            }
        }
    }
    if parts.is_empty() {
        return Err(EvidenceError::Manifest(format!("invalid path: {value}")));
    }
    Ok(parts.join("/"))
}

fn normalize_pattern(value: &str) -> Result<String> {
    let normalized = value.replace('\\', "/");
    if normalized.starts_with('/')
        || normalized.trim().is_empty()
        || normalized.split('/').any(|part| part == "..")
    {
        return Err(EvidenceError::Manifest(format!(
            "invalid exclusion pattern: {value}"
        )));
    }
    Ok(normalized)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_escaping_paths() {
        assert!(normalize_relative("../secret").is_err());
        assert!(normalize_relative("/etc/passwd").is_err());
    }

    #[test]
    fn accepts_rclone_hash_object() {
        let json = r#"[{"Path":"a.txt","Size":1,"ModTime":"2026-01-01T00:00:00Z","Hashes":{"SHA-256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}}]"#;
        let mut manifest = parse_json(json).unwrap();
        validate(&mut manifest).unwrap();
        assert_eq!(manifest.files[0].path, "a.txt");
        assert!(manifest.files[0].sha256.is_some());
    }
}
