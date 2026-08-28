use serde_json::Value;
use std::process::Command;

fn binary() -> Command {
    Command::new(env!("CARGO_BIN_EXE_cloud-exit-evidence"))
}

#[test]
fn cli_finds_all_fixture_gaps_then_accepts_an_acknowledged_remediation() {
    let temp = tempfile::tempdir().unwrap();
    let destination = temp.path().join("offline");
    std::fs::create_dir(&destination).unwrap();
    std::fs::write(destination.join("present.txt"), b"here").unwrap();
    let manifest = temp.path().join("manifest.json");
    std::fs::write(
        &manifest,
        r#"{
          "provider":"fixture",
          "files":[
            {"path":"present.txt","size":4},
            {"path":"missing.txt","size":7}
          ],
          "exclusions":[{"path":"Phone/Documents/**","reason":"OS permission denied"}]
        }"#,
    )
    .unwrap();

    let output = binary()
        .args([
            "audit",
            "--manifest",
            manifest.to_str().unwrap(),
            "--destination",
            destination.to_str().unwrap(),
            "--format",
            "json",
        ])
        .output()
        .unwrap();
    assert_eq!(output.status.code(), Some(2));
    let report: Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(report["summary"]["missing"], 1);
    assert_eq!(report["summary"]["unacknowledged_exclusions"], 1);
    assert_eq!(report["readiness"], "not_ready");

    std::fs::write(destination.join("missing.txt"), b"remedy!").unwrap();
    let remediated = binary()
        .args([
            "audit",
            "--manifest",
            manifest.to_str().unwrap(),
            "--destination",
            destination.to_str().unwrap(),
            "--format",
            "json",
            "--acknowledge",
            "Phone/Documents/**",
            "--acknowledgement-note",
            "separate monthly export",
        ])
        .output()
        .unwrap();
    assert!(remediated.status.success());
    let report: Value = serde_json::from_slice(&remediated.stdout).unwrap();
    assert_eq!(report["readiness"], "ready_with_exceptions");
}

#[test]
fn cli_saves_only_encrypted_reports() {
    let temp = tempfile::tempdir().unwrap();
    let destination = temp.path().join("offline");
    std::fs::create_dir(&destination).unwrap();
    std::fs::write(destination.join("present.txt"), b"here").unwrap();
    let manifest = temp.path().join("manifest.json");
    std::fs::write(&manifest, r#"{"files":[{"path":"present.txt","size":4}]}"#).unwrap();
    let report = temp.path().join("report.cee");
    let saved = binary()
        .env("CEE_PASSPHRASE", "integration-secret")
        .args([
            "audit",
            "--manifest",
            manifest.to_str().unwrap(),
            "--destination",
            destination.to_str().unwrap(),
            "--format",
            "json",
            "--output",
            report.to_str().unwrap(),
        ])
        .output()
        .unwrap();
    assert!(saved.status.success());
    let encrypted = std::fs::read(&report).unwrap();
    assert!(encrypted.starts_with(b"CEE1"));
    assert!(!String::from_utf8_lossy(&encrypted).contains("present.txt"));

    let decrypted = binary()
        .env("CEE_PASSPHRASE", "integration-secret")
        .args(["decrypt", "--input", report.to_str().unwrap()])
        .output()
        .unwrap();
    assert!(decrypted.status.success());
    assert!(String::from_utf8_lossy(&decrypted.stdout).contains("present.txt"));
}

#[test]
fn cli_demo_runs_the_bundled_intentional_gap_sample() {
    let output = binary().arg("demo").output().unwrap();
    assert!(output.status.success());
    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(stdout.contains("NOT READY"));
    assert!(stdout.contains("Documents/tax-return.pdf"));
    assert!(stderr.contains("Demo files written to"));
}
