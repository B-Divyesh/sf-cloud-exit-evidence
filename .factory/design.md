# Visual thesis — The evidence broadsheet

## Direction and rationale

Cloud Exit Evidence uses a **monochrome typographic broadsheet**: the visual language of a printed record that can be inspected, challenged, and filed. Cloud dashboards tend toward soft gradients and reassuring green checks. This product instead looks like evidence—black ink, warm archival stock, narrow rules, numbered findings, and type that rewards close reading. A single red proofreader’s mark calls attention to an unresolved claim. The result is sober, provider-neutral, and specific to the act of auditing an exit copy.

## Palette

The site is intentionally single-mode and paints every surface explicitly.

- `paper #F3F0E8` — warm uncoated stock; page background.
- `sheet #FBFAF5` — lifted report pages and form surfaces.
- `ink #171714` — primary text and rules (15.6:1 on paper).
- `ink-soft #5B5A53` — annotations and secondary copy (6.2:1 on paper).
- `proof #A52A25` — sole accent, like an editor’s correction (6.3:1 on paper).
- `pass #285B3F` — verified result text (7.1:1 on paper).
- `caution #765600` — acknowledged exceptions (6.4:1 on paper).
- `danger #8C211D` — unresolved coverage (7.4:1 on paper).

No gradient is used. Status always has a word and shape in addition to color.

## Type

- Display/editorial: Georgia, `Times New Roman`, serif. High-contrast letterforms make headlines feel published rather than marketed.
- Working/data: `Arial Narrow`, `Roboto Condensed`, Arial, sans-serif. The narrow fallback preserves dense report-table rhythm without fetching a font.
- Numeric evidence uses tabular figures and monospace (`ui-monospace`, SFMono-Regular, Consolas).

System faces keep the first load fast and private. The scale is 12, 14, 16, 20, 28, and a fluid 48–82 px masthead, on an 8 px spacing grid.

## Layout and interaction grammar

A 12-column editorial grid becomes one column at 760 px. Content is separated by whitespace and hairline rules, not rounded cards. The masthead behaves like a newspaper nameplate; audit evidence is arranged as ledgers and marginal notes. Controls are rectangular, minimally rounded (0–2 px), with an inset active state. Every interactive target is at least 44 px.

The primary journey is linear: read the claim, inspect how it is proved, then try the local demo or install the CLI. On mobile, ornamental folio labels disappear, evidence rows stack, and tables turn into labeled blocks; no essential evidence is dropped.

## Motion policy

Motion is restrained to a 180 ms proof-mark reveal and 220 ms report expansion using opacity and transform. Nothing loops. With `prefers-reduced-motion: reduce`, transitions and transforms are removed and all content appears in place. The design’s hierarchy remains intact without movement.

## Asset plan and provenance

The hero is an original generated editorial still life: an open archival ledger whose rows resolve into a physical drive and a cloud-shaped cut-paper absence, photographed top-down in black ink and warm paper tones. It explains comparison and missing coverage without depicting a generic dashboard. No text is generated into the image, and meaningful alt text describes it.

- Generator: `/opt/fleet/lib/gen-image.sh`, factory `factory-image` deployment.
- Prompt: “Top-down editorial still life for a software audit broadsheet: an open archival paper ledger with precise rows and check marks, a compact unbranded external hard drive resting on one page, and one cloud-shaped piece cleanly cut out of the opposite page to reveal a dark void beneath; monochrome black ink and warm off-white paper, subtle newsprint halftone grain, hard directional studio light, sober forensic mood, asymmetrical horizontal composition, generous clean negative space, photoreal materials with graphic editorial restraint; no people, no screens, no logos, no legible text, no watermark, no blue, no gradients.”
- License: original project asset generated for this product; MIT-distributed with the repository.
- Delivery: source PNG retained under `site/assets/source/`; optimized WebP ≤300 KB under `site/public/` with explicit intrinsic dimensions.
- Social and touch assets: `site/public/social-card.webp` is a 1200×630 centre crop of the same original ledger image; `apple-touch-icon.png` is a 180×180 crop. They retain the source asset's project-only MIT provenance.
- Terminal evidence: `site/public/cloud-exit-evidence-demo.svg` is a hand-composed, self-hosted SVG transcript generated from the bundled `cloud-exit-evidence demo` command on 2026-08-28. It is an original project asset, shares the repository MIT license, and uses the broadsheet ink/paper palette.

All interface symbols (ticks, warning lozenges, disclosure marks) are CSS/text primitives created for the product; no third-party icon set.
