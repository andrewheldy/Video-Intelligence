# Talking-head workflow

The flagship workflow preserves genuine footage as the subject source:

```text
footage + transcript + project profile
  → edit decisions
  → VideoSpec
  → deterministic validation
  → Remotion render request + FFmpeg media plan
  → render preflight
  → perceptual review
  → revision
```

Narration may be synthesized when the brief calls for voiceover, but it does not authorize synthesis of the on-camera person. Localized lip-sync or visual repair requires `talkingHead.allowSyntheticRepair: true`, explicit edit-decision provenance, limited time bounds, and before/after review.

Phase 1 supplies the contracts and example only. Media probing, transcript alignment, rendering, and review execution are Phase 2.

