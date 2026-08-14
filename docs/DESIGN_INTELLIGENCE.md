# Design Intelligence — Project Connection Record

This project consumes the canonical [`design-intelligence`](https://github.com/andrewheldy/design-intelligence) repository by reference. Nothing is synchronized, vendored, or edited from this repository.

## Identity

| Field | Value |
|---|---|
| Project name | Video Intelligence |
| Product type | mixed framework; resolve the consumer surface per task |
| Target users | Agents and engineers building project-specific video workflows |
| Integration status | active |
| Owner | Andrew Heldy |

## Constraint envelope

- Accessibility floor: caption legibility and safe areas; WCAG 2.2 AA for any rendered interface or graphic; reduced-motion alternatives for nonessential motion.
- Motion: select purpose before implementation and verify rendered motion, not code alone.
- Brand: no framework brand is imposed. Consumer profiles and brand sources win over skill preferences, except accessibility.

## Project-owned locations

| Field | Path |
|---|---|
| Profile/brand constraint schema | `config/defaults/project-profile.yaml` |
| Design decision log | `docs/DECISIONS.md` |
| Reusable findings | `docs/DESIGN_FINDINGS.md` |

## Canonical link

| Field | Value |
|---|---|
| Repository | `https://github.com/andrewheldy/design-intelligence` |
| Canonical commit reviewed | `bf9b8b3b6997df3ab4d7958a9d1838d07c50470a` |
| Last reviewed | 2026-08-14 |
| Reviewed by | Codex for the Phase 1 architecture |

Read at that ref in this order: `AGENTS.md` → `docs/INTEGRATION_CONTRACT.md` → the applicable `registry.yaml` entries → applicable agent specs.

## Applicable capabilities

- Agents: `design-director`, `anti-slop-reviewer`, and `motion-reviewer` when their routing conditions apply. Reference specs in the canonical repository; do not copy them.
- Registry `motion-intelligence` (`approved` at review): motion selection, specification, accessibility, and verification entry point.
- Registry `emil-design-skills` (`approved` at review): motion character and restraint.
- Select at most one opinion skill per consumer task according to the canonical rules. Video Intelligence does not choose one globally.

## Standing rules

- Brand beats a skill preference; accessibility is not overridable.
- If the canonical resource/ref is unavailable, say which lookup failed, use only local connection/profile material, preserve the accessibility and one-opinion-skill rules, and label output **unverified loadout**.
- Never install or substitute design sources when the pinned registry cannot be checked.

