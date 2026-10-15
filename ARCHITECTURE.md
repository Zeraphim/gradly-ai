# Architecture

Gradly keeps the existing React/Vite + Express TypeScript workspaces, shared contracts and Node 22 runtime. `server.ts` exports the Express application for Vercel; `scripts/prepare-vercel.mjs` copies Vite assets into generated `public/`. No Next.js runtime or second application server was added.

## Modules

| Module                                              | Responsibility                                                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------------- |
| `apps/web/src/App.tsx`, `components/`               | Original hero, six-quest curated flow and research entry                          |
| `packages/contracts`, `packages/lesson-state`       | Original lesson API contracts and curated progress                                |
| `apps/api/src/feedback.ts`                          | Guarded curated reasoning assessment with authored teaching text                  |
| `apps/web/src/research/`                            | Lazy-loaded research views, hash navigation and scoped design                     |
| `apps/api/src/research/pdf.ts`, `ocr.ts`            | PDF validation, physical page extraction and bounded English OCR                  |
| `research/provider.ts`, `pipeline.ts`               | Nebius adapter and persisted sequential role workflow                             |
| `research/contracts.ts`, `engine.ts`, `featured.ts` | Lesson schemas, source checks, learning transitions and eight-challenge reference |
| `research/store.ts`, `auth.ts`, `router.ts`         | Persistence, guest ownership and Express request adaptation                       |
| `research/routes/`                                  | Config, documents, jobs, learning, feedback and retention maintenance             |

## Research data flow

PDF selection → local blob preview → explicit server extraction → per-page transcription review → confirmation for external processing → evidence analyst → lesson architect → statistical reviewer → coach reviewer → deterministic verification → learning session → optional explanation feedback → reveal → completion/history.

`#/research/…` routes work with the existing static hosting. `/api/research/…` is a separate API namespace. The original `/api/lesson`, `/api/feedback` and `/api/health` remain available when research dependencies are absent.

## Processing and verification

The provider interface supports distinct role prompts using a configured server-side Nebius endpoint/model. Defaults preserve the existing regional Nemotron Ultra configuration. Research requests use JSON Schema, local Zod parsing, expected-model/finish checks, 20-second timeouts and at most one retry for selected transient HTTP errors. The original curated service retains its 45-second timeout.

Jobs persist role, task, status, evidence references, concise summary and error. A versioned lease prevents overlapping stage requests; an expired lease permits recovery. The browser dispatches stages and polls saved state. There is no background worker or fabricated time-based completion. The help view describes the sequential architecture and does not claim a parallel Mixture of Agents implementation.

Exact excerpt/page matching, valid answer guides, known reference identifiers and reviewer approvals gate generated lessons. Model reviews assess semantic support; deterministic checks alone cannot prove that every inference is correct. Missing evidence or rejected review blocks play. Statistical results and paper metadata remain hidden in research session responses until permitted by the learning engine. The preserved curated entry independently exposes its original study metadata.

## Storage and security

Local SQLite and remote libSQL share `store.ts`. Records have guest owner, kind, version and 30-day expiry. Compare-and-swap updates reject stale submissions. Deleting a document atomically removes its linked learner sessions. Protected maintenance removes expired records and stale request counters.

HMAC-signed HttpOnly SameSite=Strict cookies identify guests; Vercel cookies are Secure. Guest ownership is not an account or cross-device sync system. On Vercel, research requires explicit enablement, a remote database URL/token and a signing secret. Source and client assets contain no credentials.

Uploads are bounded before parsing, then checked for contents, MIME, extension and size. Original PDF bytes are not persisted. Text extraction is capped at 80 pages/250,000 characters; OCR is capped at six low-text pages with pixel, confidence and time limits. OCR provenance is visible. Exact text matching cannot establish pixel-level transcription accuracy.

Document text is untrusted data. Prompts prohibit following embedded commands, and no document-driven tools or URL fetching exist. Model text renders as escaped text. Same-origin mutation checks, security headers, owner checks and request budgets add boundaries, without claiming immunity to prompt injection. Research has persistent shared/per-guest logical AI request budgets; retries can add billed calls. The curated service's existing process-local budgets remain separate.

See `RESEARCH_INTEGRATION.md` for the deployment variables, function package settings and setup sequence. Hosted storage, OCR packaging and new live inference require configuration and smoke tests before release.
