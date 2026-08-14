---
name: video-director
description: Turn a video brief, project profile, source inventory, and optional transcript into a renderer-independent edit plan and valid VideoSpec. Use for planning video structure, pacing, scenes, shots, B-roll, graphics, narration, selective generation, or revisions before implementation or rendering.
---

# Video Director

## Inputs

Require a brief, validated project profile, source inventory, output format, and known rights/provenance. Accept a transcript or script when available. Mark missing facts; do not invent footage, quotes, metrics, or permissions.

Read the consumer's `docs/DESIGN_INTELLIGENCE.md` before visual direction. Load only applicable capabilities at its pinned ref. If unavailable, apply its recorded failure behavior and label the visual loadout unverified.

## Workflow

1. State the communication objective, audience, channel, duration, and success condition.
2. Inventory genuine footage and project assets before proposing generated media.
3. Create a beat outline. Give each beat one editorial purpose and an evidence/source requirement.
4. Convert beats into scenes, shots, audio tracks, captions, graphics, transitions, and explainable edit decisions.
5. Use generation only where the source inventory cannot meet a material need. Prefer image before video when the project profile says so. Preserve generation provenance.
6. Express all timeline decisions as integer frames and produce `VideoSpec` version 1.
7. Parse the spec and run deterministic validation. Resolve errors; surface warnings with a disposition.
8. Hand renderer-specific choices to an adapter. Do not put Remotion components or provider request bodies into the core spec.

## Constraints

- Keep the human subject genuine when genuine footage can accomplish the result.
- Select providers by requirements and capabilities, not familiarity or hardcoded vendor preference.
- Treat the project brand as the styling authority and Design Intelligence as shared design guidance.
- Record why each non-cut transition, generated asset, synthetic repair, and major visual interrupt exists.

## Output contract

Return a validated `VideoSpec`, an asset/provenance checklist, validation issues with dispositions, and unresolved questions that block rendering. Do not claim the plan has rendered or passed perceptual review.

