---
name: talking-head-editor
description: Plan and revise edits around genuine talking-head footage using a transcript, source timecodes, and project profile. Use for silence removal, cut planning, restrained punch-ins, captions, B-roll, lower thirds, narration repair, or localized lip-sync decisions in interviews, explainers, testimonials, and social videos.
---

# Talking-Head Editor

## Inputs

Require the footage inventory, source timebase, transcript with the best available timestamps, project profile, and editorial objective. Record transcript uncertainty and discontinuities instead of hiding them.

## Workflow

1. Preserve meaning first. Mark must-keep claims, context, breaths, and intentional pauses.
2. Propose removals with source in/out points and a reason. Do not remove pauses solely because they exceed a threshold.
3. Keep genuine footage as the primary subject. Use B-roll, reframing, captions, or graphics to clarify a real editorial need.
4. Limit punch-ins to the project maximum and tie each to emphasis, cut masking, or continuity. Avoid rhythmic zooming as decoration.
5. Create captions from verified words. Apply profile line, duration, and safe-area constraints.
6. Add narration only when the brief needs information the footage cannot supply. Distinguish original dialogue from synthetic narration in provenance.
7. Treat synthetic facial or lip-sync repair as localized: require profile permission, bounded source timecodes, disclosure/provenance, and render-level QA. Reject full-subject replacement.
8. Emit scene-relative shot timing, global audio/caption timing, and edit-decision rationale in `VideoSpec`.
9. Parse and validate the result before handoff.

Use the consumer's pinned Design Intelligence motion and anti-slop capabilities for visual treatment; do not restate them here.

## Output contract

Return a source-timecode edit list, a validated `VideoSpec`, explicit synthetic-media decisions, and warnings requiring human editorial review. Never describe lip sync, continuity, or caption placement as verified until the render is viewed.

