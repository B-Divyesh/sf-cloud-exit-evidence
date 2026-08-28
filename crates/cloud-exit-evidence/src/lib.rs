//! Provider-neutral evidence for deciding whether a physical cloud-file copy is usable.

pub mod audit;
pub mod crypto;
pub mod manifest;
pub mod report;

use thiserror::Error;

#[derive(Debug, Error)]
pub enum EvidenceError {
    #[error("could not read {path}: {source}")]
    Io {
        path: String,
        #[source]
        source: std::io::Error,
    },
    #[error("invalid manifest: {0}")]
    Manifest(String),
    #[error("invalid configuration: {0}")]
    Config(String),
    #[error("encryption failed: {0}")]
    Crypto(String),
    #[error("could not serialize report: {0}")]
    Serialize(String),
}

pub type Result<T> = std::result::Result<T, EvidenceError>;
