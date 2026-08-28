use crate::{EvidenceError, Result};
use argon2::Argon2;
use chacha20poly1305::aead::{Aead, KeyInit};
use chacha20poly1305::{XChaCha20Poly1305, XNonce};
use rand::RngCore;
use rand::rngs::OsRng;

const MAGIC: &[u8; 4] = b"CEE1";
const SALT_LEN: usize = 16;
const NONCE_LEN: usize = 24;

pub fn encrypt(plaintext: &[u8], passphrase: &str) -> Result<Vec<u8>> {
    if passphrase.len() < 12 {
        return Err(EvidenceError::Crypto(
            "CEE_PASSPHRASE must be at least 12 characters".into(),
        ));
    }
    let mut salt = [0_u8; SALT_LEN];
    let mut nonce = [0_u8; NONCE_LEN];
    OsRng.fill_bytes(&mut salt);
    OsRng.fill_bytes(&mut nonce);
    let key = derive_key(passphrase, &salt)?;
    let cipher = XChaCha20Poly1305::new((&key).into());
    let ciphertext = cipher
        .encrypt(XNonce::from_slice(&nonce), plaintext)
        .map_err(|_| EvidenceError::Crypto("content encryption failed".into()))?;
    let mut output = Vec::with_capacity(MAGIC.len() + SALT_LEN + NONCE_LEN + ciphertext.len());
    output.extend_from_slice(MAGIC);
    output.extend_from_slice(&salt);
    output.extend_from_slice(&nonce);
    output.extend_from_slice(&ciphertext);
    Ok(output)
}

pub fn decrypt(envelope: &[u8], passphrase: &str) -> Result<Vec<u8>> {
    if envelope.len() < MAGIC.len() + SALT_LEN + NONCE_LEN + 16 || &envelope[..4] != MAGIC {
        return Err(EvidenceError::Crypto(
            "not a Cloud Exit Evidence encrypted report".into(),
        ));
    }
    let salt = &envelope[4..4 + SALT_LEN];
    let nonce = &envelope[4 + SALT_LEN..4 + SALT_LEN + NONCE_LEN];
    let ciphertext = &envelope[4 + SALT_LEN + NONCE_LEN..];
    let key = derive_key(passphrase, salt)?;
    XChaCha20Poly1305::new((&key).into())
        .decrypt(XNonce::from_slice(nonce), ciphertext)
        .map_err(|_| EvidenceError::Crypto("wrong passphrase or damaged report".into()))
}

fn derive_key(passphrase: &str, salt: &[u8]) -> Result<[u8; 32]> {
    let mut key = [0_u8; 32];
    Argon2::default()
        .hash_password_into(passphrase.as_bytes(), salt, &mut key)
        .map_err(|e| EvidenceError::Crypto(format!("key derivation failed: {e}")))?;
    Ok(key)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encrypted_report_round_trips() {
        let encrypted = encrypt(b"sensitive paths", "a-long-passphrase").unwrap();
        assert!(!String::from_utf8_lossy(&encrypted).contains("sensitive"));
        assert_eq!(
            decrypt(&encrypted, "a-long-passphrase").unwrap(),
            b"sensitive paths"
        );
        assert!(decrypt(&encrypted, "wrong-password").is_err());
    }
}
