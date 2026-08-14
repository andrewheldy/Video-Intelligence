# Video Intelligence

Video Intelligence is a reusable, provider-independent foundation for AI-assisted video production. It gives agents and deterministic renderers a shared `VideoSpec`, project profile, provider contracts, validation rules, and video-specific workflows.

It solves the handoff problem between creative reasoning and repeatable production: models plan and critique; typed code validates, adapts, and renders. Remotion is the first renderer adapter, not the domain model. FFmpeg is the first media-processing adapter. External generation and review services sit behind capability-based provider contracts.

It is not a video editor UI, a single video project, a whole-video generation model, or a bundled copy of brand/design knowledge.

## Relationship to Design Intelligence

[`design-intelligence`](https://github.com/andrewheldy/design-intelligence) remains the authority for shared design taste, typography, composition, visual hierarchy, accessibility, anti-slop review, and general motion principles. This repository owns video-specific planning, editing, rendering, review, and provider orchestration.

Nothing is vendored or synchronized. A consumer pins a Design Intelligence ref in [`docs/DESIGN_INTELLIGENCE.md`](docs/DESIGN_INTELLIGENCE.md); tools may locate an operator-provided checkout through `DESIGN_INTELLIGENCE_PATH` or explicit workspace roots. Unavailable design guidance must be reported, never silently reconstructed.

## Consume from another repository

1. Add this package as a pinned dependency (a package release or Git ref; local paths are for development only).
2. Create `.video/profile.yaml` from [`config/defaults/project-profile.yaml`](config/defaults/project-profile.yaml).
3. Keep project footage, references, brand rules, and overrides in that consumer repository.
4. Produce a `VideoSpec`, parse it with `parseVideoSpec`, run deterministic validation, and hand the validated result to a renderer adapter.
5. Connect Design Intelligence separately using its integration contract; do not copy its registry, agents, or skills.

```ts
import {
  parseProjectProfileYaml,
  parseVideoSpecYaml,
  validateVideoSpec,
} from "video-intelligence";

const profile = parseProjectProfileYaml(profileYaml);
const spec = parseVideoSpecYaml(specYaml);
const issues = validateVideoSpec(spec, profile);
```

## Phase 1 status

Implemented now:

- runtime-validated `VideoSpec` and project-profile schemas
- frame-based timeline utilities and cross-reference validation
- deterministic anti-slop/safety checks that can be extended without prompting
- capability-based provider and renderer contracts
- Remotion and FFmpeg adapter boundaries without vendor API integration
- optional, pinned Design Intelligence discovery
- three video-specific Agent Skills and an authoring convention
- a talking-head example and workflow contract

Not implemented yet: provider API clients, a Remotion runtime, automatic transcript alignment, media probing, render workers, model-based review, reusable graphics packages, or a UI.

## Development

Requires Node.js 20 or later and pnpm 9 or later.

```sh
pnpm install
pnpm test
pnpm typecheck
pnpm validate:examples
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/PROJECT_INTEGRATION.md`](docs/PROJECT_INTEGRATION.md), and [`docs/ROADMAP.md`](docs/ROADMAP.md) for the boundaries and next phase.
