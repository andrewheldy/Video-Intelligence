---
name: render-review
description: Review an actual rendered video against its VideoSpec, brief, project profile, provenance, and measurable constraints, then produce time-bounded revision issues. Use after rendering or after a revision to assess continuity, pacing, captions, graphics, audio, generated inserts, lip sync, technical output, and spec drift.
---

# Render Review

## Inputs

Require the rendered media, validated `VideoSpec`, project profile, brief, and prior issue dispositions. Use proxy media only when its limitations are stated. Do not review a render from code or still screenshots alone.

## Workflow

1. Confirm the file opens, duration/aspect ratio match the spec, and audio/video are present as expected.
2. Run deterministic checks and retain their rule IDs. Do not replace measurable failures with aesthetic prose.
3. Watch once for narrative comprehension and pacing without stopping.
4. Watch again for frame/time-bounded continuity, captions, safe areas, graphic density, transitions, audio balance, source quality, and spec drift.
5. Inspect every generated insert and synthetic repair for provenance, boundary artifacts, identity drift, temporal inconsistency, and whether genuine material could replace it.
6. For lip-sync repairs, compare before/after evidence and inspect the whole repaired interval plus handles. Mark unverified if frame-accurate comparison is unavailable.
7. Invoke applicable Design Intelligence reviewers at the consumer's pinned ref for general motion/accessibility/anti-slop judgments. Reference their findings; do not duplicate their rules.
8. Normalize each finding with severity, rule/code, start/end frame when possible, evidence, and one actionable revision.
9. Recheck resolved issues on the next render and guard against regressions.

## Output contract

Return `PASS`, `PASS WITH WARNINGS`, or `REVISE`; a render identity/spec fingerprint; deterministic check status; and ordered revision issues. Name any tooling, viewport, audio, frame-access, or Design Intelligence limitation. Never label an unviewed or partially inspected render verified.

