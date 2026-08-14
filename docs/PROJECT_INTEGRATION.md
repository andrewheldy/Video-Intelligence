# Project integration

A consumer keeps its assets and decisions local:

```text
consumer-project/
  .video/
    profile.yaml
    references/
    assets/
    overrides.md
  docs/
    DESIGN_INTELLIGENCE.md
```

Only `profile.yaml` has a framework-owned schema. The remaining paths are project inputs and may be reorganized by the consumer.

## Video Intelligence dependency

Pin a package release or Git ref. Use a workspace dependency only while developing both repositories together. Never copy this repository's implementation into the consumer.

Parse `profile.yaml`, parse or construct a `VideoSpec`, and run the validation rules before invoking an adapter. A consumer can append rules to `builtInValidationRules` without forking them.

## Design Intelligence dependency

Integrate Design Intelligence independently using its canonical `docs/INTEGRATION_CONTRACT.md`. The project-owned `docs/DESIGN_INTELLIGENCE.md` records the canonical URL, concrete ref, applicable agents, and registry IDs.

For tools that need filesystem access, use this resolution order:

1. an explicit path supplied by the caller for the current run
2. the environment variable named `DESIGN_INTELLIGENCE_PATH`
3. caller-supplied workspace roots

Every candidate must contain readable `AGENTS.md`, `docs/INTEGRATION_CONTRACT.md`, and `registry.yaml`. Its current Git `HEAD` must resolve to the configured commit or tag; discovery never checks out or mutates a candidate. No default absolute path, parent traversal, sibling-name guess, submodule, package dependency, or automatic sync is used. The canonical URL and ref remain authoritative; the local path is only a transport.

When resolution fails, show the missing resource and pinned ref, use only project-local connection records and prior briefs, preserve the accessibility and one-opinion-skill rules, and label design output **unverified loadout**.

## Project profile

Start from [`config/defaults/project-profile.yaml`](../config/defaults/project-profile.yaml). Defaults are conservative and overridable. They are production constraints, not a brand system.
