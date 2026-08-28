# Demo sandbox

- URL: `https://cloud-exit-evidence.sociobot.in/demo/` (or local `/demo/`). `/?demo=1` redirects directly into that isolated route.
- Browser sample: a three-file cloud export, a one-file local copy, and one Android permission exclusion. It opens directly to a **Not ready** report with two missing files and one open exclusion.
- Browser isolation: demo state is only `localStorage["demo:cloud-exit-evidence"]`. The demo never reads a real-data key. **Reset demo** replaces only that key with the bundled sample. **Start for real** removes it before returning home.
- CLI sample: `cloud-exit-evidence demo` writes the same bundled three-file manifest and one-file offline folder into a newly created temporary directory. It prints two missing files, the open Android exclusion, and the directory path on stderr.
- Offline: the static shell and sample code are precached after the first visit; the direct demo works after an offline reload.
