//! Provider-neutral evidence for deciding whether a physical cloud-file copy is usable.
//!
//! The binary is the primary interface, while the library keeps parsing and audit logic reusable:
//!
//! ```no_run
//! use cloud_exit_evidence::audit::{audit, AuditOptions};
//! use cloud_exit_evidence::manifest::read_manifest;
//! use std::path::Path;
//!
//! # fn main() -> Result<(), Box<dyn std::error::Error>> {
//! let manifest = read_manifest(Path::new("cloud-export.json"))?;
//! let report = audit(
//!     &manifest,
//!     Path::new("/media/offline-copy"),
//!     &AuditOptions {
//!         stale_tolerance_seconds: 2,
//!         acknowledgements: vec![],
//!         acknowledgement_note: None,
//!     },
//! )?;
//! println!("{:?}", report.readiness);
//! # Ok(())
//! # }
//! ```

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
