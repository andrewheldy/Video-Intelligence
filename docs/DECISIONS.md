# Decisions

## D-001 — Frame-based intermediate representation

**Decision:** Use a versioned, Zod-validated `VideoSpec` with integer frames as the canonical clock.

**Why:** Renderers operate on frames, frame math is deterministic, and agents can exchange a compact declarative plan. Seconds remain boundary inputs for providers and profiles.

## D-002 — Remotion and FFmpeg are adapters

**Decision:** Keep Remotion composition input and FFmpeg operation plans outside the core schema.

**Why:** The initial implementation can use both tools without making replacement or headless validation depend on their APIs.

## D-003 — Loose, pinned Design Intelligence integration

**Decision:** Follow Design Intelligence's existing consumer contract: record a concrete ref, read it in place, and do not vendor, synchronize, submodule, or package it. Optional local discovery uses an explicit caller path, `DESIGN_INTELLIGENCE_PATH`, or caller-supplied workspace roots.

**Why:** The canonical URL/ref provides stable identity; an operator-controlled path is portable across machines and agents. Automatic sibling traversal and hardcoded absolute paths are fragile. A package or submodule would contradict the upstream integration contract and create upgrade coupling.

**Failure behavior:** Resolution validates the expected contract files and verifies that the configured commit or tag resolves to the checkout's current `HEAD`. Failure names the pinned ref and produces an unverified-loadout state; it never changes the checkout or reconstructs registry content from memory.

## D-004 — Three active video skills

**Decision:** Create `video-director`, `talking-head-editor`, and `render-review`; keep other proposed skill names on the roadmap.

**Why:** They cover the flagship loop with distinct video-specific procedures. General creative direction, motion character/selection, accessibility, typography, hierarchy, and anti-slop review already exist in Design Intelligence. Placeholder directories would imply capabilities that Phase 1 has not specified or evaluated.

## D-005 — One package before a monorepo

**Decision:** Publish the Phase 1 contracts as one package. Do not create empty `packages/*` workspaces.

**Why:** There is no implementation to justify independent versions yet. Extract packages only when the Phase 2 render slice creates real dependency or release boundaries.

## D-006 — Validation is layered

**Decision:** Separate schema validity, deterministic policy rules, renderer preflight, and perceptual render review.

**Why:** A prompt should not enforce measurable limits, while a static schema cannot prove text collision, decodability, pacing, or visual distinction.

## Design Intelligence recommendations

No missing generalized Design Intelligence capability blocks Phase 1. Its existing `motion-intelligence`, `emil-design-skills`, design-director, accessibility reviewer, and anti-slop reviewer cover the shared layer. Video pacing, shot planning, caption timing, render critique, and lip-sync QA belong here because they depend on temporal media and render evidence.
