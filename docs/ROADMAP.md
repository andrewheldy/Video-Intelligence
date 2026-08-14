# Roadmap

## Phase 1 — architecture (current)

Define and test the core model, profiles, provider/adapter boundaries, deterministic validation, optional Design Intelligence discovery, and a minimal video-specific skill surface.

## Phase 2 — talking-head vertical slice (recommended next)

Implement one end-to-end, local, fixture-driven workflow:

1. probe genuine footage with FFmpeg/ffprobe
2. ingest a supplied transcript with word timestamps
3. produce and validate a talking-head `VideoSpec`
4. render it through a minimal Remotion runtime with captions, lower third, hard cuts, and restrained punch-ins
5. run deterministic render preflight and generate a review packet
6. use a pluggable review-provider fixture before enabling one real provider

Acceptance requires a repeatable render from checked-in metadata and synthetic test media, frame-accurate duration, verified caption safe areas, provenance retention, and passing tests. Do not add generated video, lip sync, cloud queues, a UI, or multiple workflow types in this phase.

## Later candidates

- ElevenLabs voice adapter and narration alignment
- Gemini review adapter with a normalized issue schema
- image/video generation adapters selected by capabilities
- localized lip-sync repair with disclosure and before/after QA
- reusable Remotion packages for captions, lower thirds, charts, diagrams, maps, transitions, and talking-head layouts
- additional workflows: explainer, social short, product demo, case study
- evidence-backed skills extracted from repeated workflow failures

