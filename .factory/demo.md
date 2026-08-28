# Demo sandbox

- URL: `https://cloud-exit-evidence.sociobot.in/demo/` (or local `/demo/`). `/?demo=1` redirects directly into that isolated route.
- Browser sample: a three-file cloud export, a one-file local copy, and one Android permission exclusion. It opens directly to a **Not ready** report with two missing files and one open exclusion.
- Browser isolation: the demo exposes no file-list or folder input and runs only bundled sample details. Its only state is `localStorage["demo:cloud-exit-evidence"]`; it never reads real file details or real-data keys. **Reset demo** replaces only the demo key. Leaving through any link, browser history, refresh, or close removes it without changing `real:` keys. **Start for real** opens the command-line setup at `/#install`.
- CLI sample: `cloud-exit-evidence demo` writes the same bundled three-file manifest and one-file offline folder into a newly created temporary directory. It prints two missing files, the open Android exclusion, and the directory path on stderr.
- Offline: the static shell and sample code are precached after the first visit; the direct demo works after an offline reload.
