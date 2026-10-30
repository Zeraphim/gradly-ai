---
name: project-context
description: >-
  Orient work in the Gradly application repository using its verified stack,
  workspace layout, commands, configuration, and subsystem map. Use for setup,
  feature work, debugging, and changes to manifests, routes, packages, or services.
---

# Gradly project context

Resolve the application root from this skill under `.agents/skills/project-context/`.
Read root `AGENTS.md` and any scoped instructions. This repository can be cloned
anywhere; it does not depend on a parent context repository or personal skill paths.

## Stack and navigation

- Node 22.18+ within version 22, npm lockfile/workspaces, TypeScript with strict
  NodeNext server resolution and `.js` import specifiers in server TypeScript.
- `apps/web`: React 19, Vite 8, self-hosted Plus Jakarta Sans, Lucide icons, supplied
  blue Gradly artwork. `src/App.tsx` owns upload-first entry, shared configuration,
  motion preference and retired-route recovery; `src/research/` owns research views.
  `/research/learn` is the prepared-study library; the old `/research/studies`
  index, classic, lab and meet entry points recover there. Individual
  `/research/studies/<slug>` links and uploaded `/research/play/<id>` remain.
  The classic app, separate picker and bespoke texting screen have been removed.
  The texting study remains in the prepared shared player. Never restore the old
  picker or home Resume quest; retained curated API/state tests are separate.
- `apps/api`: Express 5. `src/app.ts` composes the curated service and research
  router. `src/research/` owns document extraction, bounded English OCR, schemas,
  sequential generation/review stages, ownership, storage, and learning state.
- `packages/contracts`: curated shared types, versioned runtime-validated research
  scene contracts, and compiled runtime exports. Research scenes use Zod and the
  frontend uses the scoped Motion layer in `scene-motion.tsx` for scene layout,
  gestures, presence and live reduced-motion handling. Motion is frontend policy,
  not generated scene data. Read
  `docs/SCENE_AUTHORING.md` for the data, generation and projection contract.
  `packages/lesson-state`: curated attempts, progress, and unique rewards.
  Keep the existing `@paperquest/*` package identifiers despite Gradly branding.
- `apps/video`: Remotion 4 promotional film (`Gradly90`, `GradlyWalkthrough`),
  isolated from the web bundle and root typecheck. App footage is real Playwright
  captures; see `apps/video/README.md` for render commands and asset provenance.
- `server.ts`: hosted Express export. `vercel.json`: explicit static and server
  builders. `scripts/prepare-vercel.mjs`: frontend output copied to generated
  `public/`. Load vercel-delivery for packaging or hosting changes.
- `tests/*.test.ts`: Node service/state/interface checks. `tests/research/`: Vitest.
  `tests/browser/`: Playwright. `docs/`: maintained project documentation and
  historical research/review evidence indexed by `docs/CONTEXT.md`.

Compatibility symlinks share `AGENTS.md` and `.agents/skills/` with other agent
clients. See `docs/README.md` for the maintained link map; edit canonical sources
rather than introducing client-specific copies.

For interactive frontend changes across any route, load
[gradly-motion](../gradly-motion/SKILL.md). It applies the site-wide convention and
identifies the current research-scoped implementation boundaries.

For pull-request readiness and after authorized integration, load
[merge-verification](../merge-verification/SKILL.md). Its check matrix distinguishes
source tests, clean packaging, frontend rendering and actual hosted results.

## Commands from the repository root

| Need                                       | Command                                           |
| ------------------------------------------ | ------------------------------------------------- |
| Install locked dependencies                | `npm ci`                                          |
| Local upload and sample flow, no inference | `npm run dev:preview`                             |
| Configured frontend and server             | `npm run dev`                                     |
| Frontend only                              | `npm run dev:prototype`                           |
| Type checks                                | `npm run typecheck`                               |
| Curated service/state/interface tests      | `npm test`                                        |
| Research tests                             | `npm run test:research`                           |
| Full source validation                     | `npm run check`                                   |
| Browser suite, Chromium required           | `npm run test:e2e`                                |
| Compiled application                       | `npm run build` then `npm start`                  |
| Frontend/static preparation                | `npm run build:vercel`                            |
| Vercel builder entrypoint                  | `npm run vercel-build`                            |
| Opt-in actual model feedback               | `npm run test:live`                               |
| Context audit / index                      | `npm run context:check` / `npm run context:index` |

`check` runs type checks, Node tests, research tests, and production builds, but not
browser or live checks. Match verification to the task rather than treating an old
reported test count as a current result. See `docs/TESTING.md`.

`dev:preview` starts the frontend on 5173 and server on 3001, uses local SQLite, and
clears the provider credential in its process environment. `dev:prototype` lacks
the upload service. Browser-test configuration uses an isolated local database;
it needs free configured ports and an installed Chromium.

## Configuration

Read `.env.example`, configuration code, and `docs/RESEARCH_INTEGRATION.md` for
variable names and requirements, never a teammate's real values. Server-side
`NEBIUS_API_KEY` enables live calls. `NEBIUS_PIPELINE_MODEL` (quest pipeline) and
`NEBIUS_FEEDBACK_MODEL` (live feedback) select the two model tiers; `NEBIUS_MODEL_ID`
forces one model for both, and `NEBIUS_BASE_URL` overrides the endpoint. `PREVIEW_MODE` disables live research calls; explicit local
`DEMO_MODE` enables separately labeled sample lessons. Demo is refused in production.

Research uses local SQLite through libSQL for local work. Hosted research requires
`RESEARCH_ENABLED`, remote `DATABASE_URL`/`DATABASE_AUTH_TOKEN`, and `SESSION_SECRET`.
`CRON_SECRET` protects retention maintenance. Additional bounds and origin settings
are defined by the relevant server modules. Store credentials only in ignored local
configuration or the intended host environment; never use client `VITE_` variables.

## Maintain this context

Update this skill when verified stack versions, commands, package layout, routes,
configuration, or service boundaries change. Refresh the canonical docs and context
manifest in the same task. Requirements describe intent, current code and passing
checks describe runtime, and old test reports are historical evidence.
