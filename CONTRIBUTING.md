# Contributing

Keep changes inside this repository and preserve the boundary in [`AGENTS.md`](AGENTS.md). Before adding a creative rule or skill, inspect the pinned Design Intelligence source recorded in [`docs/DESIGN_INTELLIGENCE.md`](docs/DESIGN_INTELLIGENCE.md).

For code changes:

1. Add or update the smallest contract that expresses the need.
2. Validate external data at the boundary; keep internal code typed.
3. Add behavior-focused tests for schemas, capability selection, time conversion, or validation rules.
4. Run `pnpm test`, `pnpm typecheck`, and `pnpm validate:examples`.

For skills, follow [`docs/SKILLS.md`](docs/SKILLS.md). Do not add placeholder skill directories solely to reserve names.

Provider integrations must implement the shared contracts and declare capabilities. Never put API keys, project footage, generated media, or brand assets in this repository.

