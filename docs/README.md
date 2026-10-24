# Gradly documentation

Start with [CONTEXT.md](CONTEXT.md), the generated registry of instructions,
requirements, runtime documentation, design evidence, and references. Use
[../README.md](../README.md) for setup and [../AGENTS.md](../AGENTS.md) for agent routing.
Unlinked code paths in these documents are relative to the repository root.

## Merge readiness

[MERGE_GUARDRAILS.md](MERGE_GUARDRAILS.md) records the upload-first integration's
delivery failures, supporting changes and the diff-based verification matrix.
[merge-verification](../.agents/skills/merge-verification/SKILL.md) routes pre-merge
and post-integration work; [vercel-delivery](../.agents/skills/vercel-delivery/SKILL.md)
owns packaging and hosted checks. These are agent procedures, not automated branch
protection or authorization to merge or deploy.

## Interaction consistency

[The site-wide motion convention](DESIGN.md#site-wide-motion-convention) defines
consistent interaction behavior across screens. The project-local
[gradly-motion skill](../.agents/skills/gradly-motion/SKILL.md) routes contributors
to shared primitives, accessibility handling and relevant verification. The shared Motion provider is used by research scenes, PDF review and the paper
story (including curated preparation). These instructions do not claim all
existing pages have already adopted it.

[Intake and processing notes](ui/INTAKE_PROCESSING.md) record the issue-12
implementation and pending backend/player integration decisions.

## Research scene development

[The 21 October animation and dynamic-paper review](INTERACTION_REFERENCES.md#21-october-2026-animation-and-dynamic-paper-review)
records the current source audit, Brilliant research, targeted cleanup opportunities,
proposed learning activities, effort estimates and verification limits. Larger
automatic-generation changes remain recommendations. The bounded
[three-paper activity pilot](DESIGN.md#three-paper-activity-pilot)
now reuses the existing renderer with prepared experiment, observational and
interview evidence; its [source checks](research/PAPER_SELECTION.md#three-design-activity-pilot--21-october-2026)
record the distinction from live generation.

[SCENE_AUTHORING.md](SCENE_AUTHORING.md) explains the reusable scene contract,
generation instructions, public-response gates and backend setup.
[Fresh Adventure evidence](ui/FRESH_ADVENTURE.md) maps all nine visual challenges
to source components and names the verification limits.
[The motion review](ui/FRESH_ADVENTURE_MOTION.md) inventories interaction coverage
and records shared motion rules and the remaining browser review.

## Adopted documents

The ten uppercase-named documents here were introduced by merged pull request 2
(`7a85e5c`, consolidated upload-first research learning) and moved from the repository
root without changing their content. Their reported test counts, design reviews,
external references, and rollout restrictions describe their original scope and
point in time. They are not fresh verification of today's checkout or environment.

- PRODUCT_DIRECTION.md and REQUIREMENTS.md describe product intent and acceptance.
- ARCHITECTURE.md describes module boundaries. RESEARCH_INTEGRATION.md records setup,
  configuration, and original integration limits. TESTING.md lists verification paths.
- DESIGN.md mixes the retained interface conventions with historical paper-case
  sections. Current requirements and route code retire that standalone case flow.
  No design-approval owner/event is established by the document's wording alone.
- REASONING_PREVIEW.md separates an authored browser showcase from future live review.
  RESEARCH_LEARNING_DESIGN.md and INTERACTION_REFERENCES.md retain research and design
  proposals; they do not commit the team to implementing them.
- UI_POLISH_REVIEW.md is a historical source/browser review. Its "Approve" statement
  is not independent maintainer approval or proof of current hosted behavior.

Report contradictions between documented intent, retained historical proposals, and
current code before changing behavior. Do not create a competing work-status tracker.

## Research references

- [research/PAPER_SELECTION.md](research/PAPER_SELECTION.md) is a curated shortlist of
  source studies that could seed Gradly paper cases, with a per-study fit against the
  selection criteria. It is a research input; it commits no one to implementing any of
  it, and its access and licensing notes describe what could be verified when written.
- [research/NEMOTRON_EVALUATION.md](research/NEMOTRON_EVALUATION.md) measures how
  reliably each Nemotron model reads a paper through the real pipeline, where it invents
  content, and which guards the pipeline needs. Rerun it with `npm run eval:nemotron`.
- [research/papers/](research/papers/README.md) stores only source PDFs whose licence
  permits redistribution, with attribution and retrieval notes.

## Shared agent setup

Open this application repository as the workspace, regardless of where it was
cloned. Project instructions are tracked in `AGENTS.md`, with scoped rules under
`apps/web/` and `apps/api/`. Shared skills are in `.agents/skills/`; there is no
required personal skill installation, private parent repository, or account setting.

Codex reads [AGENTS.md instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
and [repository skills](https://learn.chatgpt.com/docs/build-skills).
Google Antigravity is a separate tool with support for the same
[rule files](https://www.antigravity.google/docs/rules) and
[skill directory](https://antigravity.google/docs/skills). Current versions can share
these canonical files. If an older client does not discover them, check its version
and official discovery documentation before creating a second copy of the rules.

## Compatibility links

Other clients share the canonical instructions and skills through relative symlinks:

| Client              | Link                              | Target              |
| ------------------- | --------------------------------- | ------------------- |
| Claude Code         | `CLAUDE.md`                       | `AGENTS.md`         |
| Claude Code         | `.claude/skills`                  | `../.agents/skills` |
| Cursor              | `.cursor`                         | `.agents`           |
| Cursor legacy rules | `.cursorrules`                    | `AGENTS.md`         |
| Windsurf            | `.windsurfrules`                  | `AGENTS.md`         |
| Cline               | `.clinerules`                     | `AGENTS.md`         |
| GitHub Copilot      | `.github/copilot-instructions.md` | `../AGENTS.md`      |
| Kiro skills         | `.kiro/skills`                    | `../.agents/skills` |
| Kiro steering       | `.kiro/steering/AGENTS.md`        | `../../AGENTS.md`   |

Edit `AGENTS.md` and `.agents/skills/` as the canonical sources. Keep these links
relative so the same checkout works on another developer's machine. Never replace
an existing client configuration with a link without reviewing its real content.
Codex and Antigravity use the canonical files directly.

## Context maintenance

```sh
npm run context:index
npm run context:check
npm run context:acknowledge -- <artifact-id>
```

The index is deterministic and generated from `.agents/context-manifest.json`.
Check is read-only. Acknowledge records an explicit review of committed affected
paths; it does not accept an architecture proposal or approve a design. New scaffold
files may have no committed review baseline until reviewed and committed.

Use [adr/TEMPLATE.md](adr/TEMPLATE.md) and [ui/TEMPLATE.md](ui/TEMPLATE.md) for future
decisions and local design evidence. The initial architecture-record proposal is
Proposed. No acceptance, interface approval, delivery ownership, or continuous
integration enforcement was inferred during scaffolding.
