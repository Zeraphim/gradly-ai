---
name: documentation-maintenance
description: >-
  Maintain Gradly documentation, agent routing, architecture decisions, design
  evidence, and the context registry when code, configuration, interface behavior,
  project structure, or contributor commands change. Use before closing such work.
---

# Documentation maintenance

Read `docs/README.md` for adopted documentation and provenance. The typed authority
map is `.agents/context-manifest.json`; `docs/CONTEXT.md` is its generated index.
Current task instructions govern scope. Requirements document intended behavior,
Accepted decisions govern architecture, Approved local design evidence governs
visual intent, and code/tests establish runtime. No delivery tracker is currently
nominated in this application repository. Do not invent owners or approval events.

## Review a change

1. Identify documentation and skills affected by changed behavior, configuration,
   routes, commands, or paths. Review their `appliesTo` scopes in the manifest.
2. Update canonical docs where durable facts or intent changed. Correct links when
   moving files; put substantive project Markdown in `docs/`, keeping the root
   README and scoped `AGENTS.md` files at their discovery locations. Keep skill
   entrypoints and references under `.agents/skills/`. When recording a source file
   or citation, verify the artifact's own text and metadata against the claim before
   describing it — a download link is not proof of the file's version or licence.
   Stored PDFs under `docs/research/papers/` are checked against their entries by
   `tests/research/stored-papers.test.ts`.
3. Update registry paths, relationships, status, and implementation references.
   Register new canonical documents instead of duplicating their prose.
4. Run `npm run context:index`, then `npm run context:check`. The check is read-only.
   Review errors and warnings; an unreviewed or affected baseline is not approval.
5. After reviewed changes are committed, explicitly acknowledge still-valid
   context with `npm run context:acknowledge -- <artifact-id>`. Acknowledgement
   refuses affected uncommitted changes. Do not advance baselines just to hide
   warnings, accept decisions, approve designs, or rewrite evidence digests.

## Architecture decisions

Use `docs/adr/TEMPLATE.md` for significant durable decisions. One file records one
choice with rationale, alternatives, consequences, affected paths, owners, and
references. Use Proposed, Accepted, Deprecated, or Superseded by ADR-NNNN.
`ADR-0001-we-use-adrs.md` is Proposed until a maintainer explicitly accepts it.

Do not infer acceptance from merging source code or a document saying "approved".
Preserve Accepted records and their sealed content. A material change needs a new
superseding record with reciprocal manifest relationships. A clerical correction
requires explicit review before re-sealing. Keep descriptive ARCHITECTURE.md separate
from a record of an explicitly accepted architectural choice.

## Interface evidence

Use `docs/ui/TEMPLATE.md`. Link a local Markdown, image, or HTML artifact for design
review; external design links may supplement it. Statuses are Proposed, Approved,
Implemented, and Superseded. Approval requires a known owner and explicit approval
record. Approved/Implemented entries need content digests; Implemented entries also
need code or change references. Preserve approved history through supersession.

The adopted DESIGN.md contains implemented descriptions and historical paper-case
sections, but no independently established approval event. It is registered Proposed.
UI_POLISH_REVIEW.md is an earlier validation report, not a current approval grant.
Do not claim screenshots mentioned in old notes are present unless local files exist.

## Scope and freshness

Use README for setup and navigation, ARCHITECTURE for current module descriptions,
REQUIREMENTS for intended behavior, TESTING for checks and their limits, and
RESEARCH_INTEGRATION for configuration. Research/interaction references and the
proposed live contract are not automatic implementation commitments.

Refresh project-context for layout/command/service changes and vercel-delivery for
build/hosting changes. Keep identifiers and paths portable. Do not add task trackers,
CI gates, personal rules, private planning material, or new dependencies merely to
maintain this scaffold. Record actual validation separately from historical reports.
