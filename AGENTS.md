# Agent operating rules

## Repository boundary

- `Video-Intelligence` is the writable implementation repository.
- `design-intelligence` is an optional, read-only design dependency. Never create, edit, delete, reformat, install, commit, or reorganize anything there from this repository's workflow.
- Before adding a design rule, creative framework, reference, or skill, inspect the pinned Design Intelligence registry and integration contract. Reference an approved existing capability instead of copying it.

## Architecture rules

- Keep the core domain model provider- and renderer-independent.
- Treat frame counts as the canonical timeline unit. Convert seconds at boundaries.
- Parse all untrusted specs and profiles through the exported Zod schemas before use.
- Select providers from declared capabilities; do not scatter vendor-name conditionals through workflows.
- Keep project assets, brand choices, and overrides in the consumer repository.
- Genuine subject footage wins. Synthetic correction is a localized, disclosed repair path.
- Add deterministic validation when a judgment can be expressed as a stable rule. Leave contextual aesthetic judgment to review skills/models.

## Design Intelligence consumption

Read `docs/DESIGN_INTELLIGENCE.md` first. Resolve a local checkout only through an explicit path, `DESIGN_INTELLIGENCE_PATH`, or caller-supplied workspace roots. Validate that a checkout contains `AGENTS.md`, `docs/INTEGRATION_CONTRACT.md`, and `registry.yaml`, and that its `HEAD` resolves to the pinned Git ref. If unavailable, report the pinned resource and ref and label design output as an unverified loadout.

Do not duplicate the Design Intelligence registry, agent specs, evaluations, contract, or general design skills here.

## Verification

Run `pnpm test`, `pnpm typecheck`, and `pnpm validate:examples` for architecture changes. Run the Skill Creator validator for every changed skill.
