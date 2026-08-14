# Video skill convention

Create a skill here only for a repeatable video-production capability. Before creation, inspect the pinned Design Intelligence registry, agent specs, and relevant approved skills. Reference general typography, composition, color, hierarchy, accessibility, anti-slop, imagery, creative direction, and motion guidance by registry ID and pinned ref.

Every active skill contains:

```text
skill-name/
  SKILL.md
  agents/openai.yaml
  references/  # only when detailed domain material is needed
  examples/    # only when an executable/example artifact materially helps
  tests/       # only for scripts or deterministic outputs
```

Keep `SKILL.md` concise and imperative. Its YAML frontmatter contains only `name` and a description that states behavior and trigger contexts. Put user-facing metadata in `agents/openai.yaml`. Do not create folders to reserve future skill names.

Use the repository-neutral template at [`templates/skill`](../templates/skill). Initialize real skills with the Codex Skill Creator script, replace all placeholders, then run its `quick_validate.py` validator.

## Composition with Design Intelligence

A video skill may say which Design Intelligence capability to load, but must not paraphrase that capability. Resolve it through the project's pinned connection record. If unavailable, follow the documented failure behavior and avoid inventing substitute design rules.

The current active skills are intentionally narrow:

- `video-director`: brief/profile/assets to `VideoSpec` and edit decisions
- `talking-head-editor`: genuine-footage-first talking-head edit plan
- `render-review`: rendered output against spec, brief, and measurable checks

Potential skills such as caption editing, shot planning, lip-sync QA, model routing, or specialized video critique are Phase 2 candidates. Create one only after concrete tasks demonstrate a reusable workflow that is not already covered by the three entry points.

