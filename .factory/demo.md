# Demo sandbox

- URL: `https://cloud-exit-evidence.sociobot.in/demo/` (or local `/demo/`). `/?demo=1` is the one-click catalog shortcut and redirects directly into that isolated route.
- Browser sample: a three-file cloud export, a two-file local copy, and one Android permission exclusion. It opens directly to the resulting **Not ready** report.
- Browser isolation: demo state is only `localStorage["demo:cloud-exit-evidence"]`. The demo never reads a real-data key. **Reset demo** replaces only that key with the bundled sample. **Start for real** removes it before returning home.
- CLI sample: `cloud-exit-evidence demo` writes a bundled copy of `examples/intentional-gaps/manifest.json` and a partial offline folder into a newly created temporary directory. It prints that directory on stderr and intentionally exits zero after showing the report.
- Offline: the static shell and sample code are precached after the first visit; the direct demo works after an offline reload.
