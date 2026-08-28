# Cloud Exit Evidence — polish 5 handoff

## Outcome

PASS. The cumulative review 1–5 backlog is closed. The browser demo is now a real sample-only sandbox: it has no real file-list or folder input, no `FileList` reader, and no path that can replace the sample report with private file details. **Reset demo** changes only `demo:` state. **Start for real** clears that state and opens the command-line setup.

The evidence-broadsheet identity, CLI artifact class, direct routes, offline behavior, metadata, legal pages, and deterministic Rust audit remain intact. The final visual pass also moved the narrow header to two rows so no mobile link is clipped.

Product repair commits:

- `9f1463e65e20a1c0c4e0cc5117b86f1fa63ee96a` — sample-only demo boundary, claim, copy, and test.
- `d57986a0ca989310582f25fd537c5102135aaced` — mobile navigation bounds and Start-for-real viewport proof.

## How to run

```sh
npm ci
npm test
npm run build
./target/release/cloud-exit-evidence demo
```

The deployable site is `dist/site/`. The publishable Rust crate is verified with:

```sh
cargo package -p cloud-exit-evidence --locked --allow-dirty
```

## Clean-clone verification

Verified commit `d57986a` from `/tmp/cloud-exit-evidence-polish5-final.k2cSlL`.

- Every one of the 25 commands in `.factory/claims.json` passed separately.
- `npm test` passed: Rust fmt/clippy, 6 unit tests, 3 CLI integration tests, 1 doctest, 4 Vitest tests, static policy, 67 Playwright tests, and the build-artifact test. Three Playwright skips were intentional desktop exclusions for 390 px-only checks.
- `npm run build` produced the release binary and `dist/site/`.
- `cargo package -p cloud-exit-evidence --locked --allow-dirty` verified 13 files, 78.3 KiB uncompressed and 21.2 KiB compressed.
- Production site output: 4.15 kB main JS, 1.57 kB navigation JS, and 12.11 kB CSS uncompressed. The mobile hero image is 28 KiB.

## Deployment and cold production verification

Work-order deployment `43b86823-a767-4dd4-ab20-f0e24d759776` completed on 28 August 2026. Final URL: <https://cloud-exit-evidence.sociobot.in/>.

Cold browser checks at 390 × 844 and 1440 × 900 passed for `/`, `/demo/`, `/privacy/`, and `/terms/`. The missing route returned the designed 404. Each normal route had its exact title, one h1, one main landmark, full canonical/OG/Twitter/icon metadata, no missing alt text, no console errors, and zero serious/critical Axe findings. Forward and Back navigation focused the page h1 and updated the polite hidden announcement.

The live adversarial demo replay injected the former file-list and folder controls with `private-tax.pdf`. The page made zero `File` or `FileList` reads, did not render the private path, and retained the bundled sample report. Entry and Reset kept a real-state sentinel unchanged. Start for real removed only the demo key and placed the command-line section at the top of the viewport. Runtime requests stayed on the product origin. A landing-only visit then supported a direct offline `/demo/` load.

Live Lighthouse mobile: **100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.

Evidence:

- `.factory/evidence/live-polish-5.json`
- `.factory/evidence/live-polish-5-home-390.png`
- `.factory/evidence/live-polish-5-demo-390.png`
- `.factory/evidence/live-polish-5-start-real-390.png`
- `.factory/evidence/live-polish-5-offline-demo-390.png`
- `.factory/evidence/lighthouse-polish-5-mobile.json`
- `.factory/evidence/verify-url-polish-5/verify.json`
- `.factory/polish-5.md`

## Known gaps and next steps

None. Registry publication remains a factory release action; this work order did not publish the crate.
