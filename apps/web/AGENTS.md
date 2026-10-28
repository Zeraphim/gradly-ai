# Learner interface

Follow the [root instructions](../../AGENTS.md) and read
[DESIGN.md](../../docs/DESIGN.md), [REQUIREMENTS.md](../../docs/REQUIREMENTS.md),
and the relevant checks in [TESTING.md](../../docs/TESTING.md).

- For new or changed interactive frontend behavior anywhere on the site, load
  [gradly-motion](../../.agents/skills/gradly-motion/SKILL.md). Match equivalent
  interactions to the shared motion convention, including surrounding layout,
  interruption, immediate input, focus and live reduced-motion behavior. Reuse
  shared primitives; keep the implementation scoped to the requested screen.
- `src/App.tsx` owns hash-route selection. Preserve upload-first entry, retired-link
  recovery, the single Learn study library, and the separately labeled reasoning preview.
  The public classic quest, its LegacyApp and bespoke TextingQuest, and the
  intermediate PathPicker are retired. The prepared texting study stays available. Preserve
  individual study links and uploaded-session progress; do not restore the old
  home Resume quest or route sample actions through a second picker.
- Reuse the supplied Gradly artwork, self-hosted Plus Jakarta Sans, blue palette,
  native controls, and existing icon family. Keep research styles scoped and retain
  keyboard focus, reduced motion, loading, empty, error, and retry states.
- Preserve document-bound upload callbacks and version/challenge-bound drafts.
  Late requests must not redirect or overwrite a learner's newer work. Server-saved
  progress is authoritative; explanation edits do not duplicate practice points.
  Prepared answers are also bound to `StudyCard.revision`: bump it when question
  or answer meaning changes, keeping it for copy-only edits. Legacy browser saves
  are revision 1. Show the restart notice before replacing that study’s old save
  on Begin; keep other study saves and server-owned uploaded sessions separate.
- Keep browser-only authored reasoning feedback separate from live assessment.
  Custom writing remains unassessed in that preview. Preserve source provenance
  and evidence-reveal ordering. Do not put provider keys in client code or Vite
  environment variables.
- Run commands from the repository root. Use `npm run typecheck`, relevant
  interface/state tests, and the affected browser scenarios when authorized and
  available. Report unverified rendering or browser behavior explicitly.

DESIGN.md contains retained historical paper-case sections. The retired standalone
paper-case application is not a request to recreate it. Current route code and
requirements describe the implemented upload-first experience; ask about material
intent conflicts instead of silently reviving a retired flow.
