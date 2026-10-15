# Architecture

Gradly keeps the existing React/Vite + Express TypeScript workspaces, shared contracts and Node 22 runtime. `server.ts` exports the Express application for Vercel; `scripts/prepare-vercel.mjs` copies Vite assets into generated `public/`. No Next.js runtime or second application server was added.

## Current public experience

`App.tsx` is a small hash router. The root and `#/research/lab` lazy-load `PaperLab`, a browser-only paper investigation with one shared flow for a published reference case and a fictional qualitative case. It makes no API request. Earlier routes lazy-load `LegacyApp`, preserving saved links while keeping its services and UI out of the default experience.

`case-types.ts` defines a paper through its question, design, findings, limitations, source-labelled evidence, claim range and transfer setting. `reference-case.ts` and `research-cases.ts` supply explicit reference/fictional provenance. `case-state.ts` validates per-case tab drafts, recomputes selected-card/claim guidance, rejects impossible saved phases and produces local text notes. It stores inputs rather than verdicts. The first claim and confidence become read-only once evidence is opened. The guide does not assess free text or award mastery.

Wonder → evidence board with open/pin controls → calibrated claim and explanation → independent transfer → connected paper recap and export. This is the current frontend prototype; it does not turn arbitrary uploaded papers into case files. Future live review must be connected through the source and revision boundaries documented in the product and reasoning guides.

## Modules

| Module                                              | Responsibility                                                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------------- |
| `apps/web/src/App.tsx`, `research/PaperLab.tsx`     | Current public paper exploration and lazy compatibility routing                   |
| `apps/web/src/LegacyApp.tsx`, `components/`         | Preserved original hero, curated flow and API-backed research entry               |
| `packages/contracts`, `packages/lesson-state`       | Original lesson API contracts and curated progress                                |
| `apps/api/src/feedback.ts`                          | Guarded curated reasoning assessment with authored teaching text                  |
| `apps/web/src/research/`                            | Lazy-loaded research views, hash navigation and scoped design                     |
| `apps/api/src/research/pdf.ts`, `ocr.ts`            | PDF validation, physical page extraction and bounded English OCR                  |
| `research/provider.ts`, `pipeline.ts`               | Nebius adapter and persisted sequential role workflow                             |
| `research/contracts.ts`, `engine.ts`, `featured.ts` | Lesson schemas, source checks, learning transitions and eight-challenge reference |
| `research/store.ts`, `auth.ts`, `router.ts`         | Persistence, guest ownership and Express request adaptation                       |
| `research/routes/`                                  | Config, documents, jobs, learning, feedback and retention maintenance             |

The research workspace composes `PathPicker`, `UploadPage`, `ProcessingPage`, `HistoryPage` and `SupportPages`. `useDocumentUpload` owns browser-file validation, blob previews, upload cancellation and callback cleanup. `useResearchConfig` loads availability once per mounted API-backed workspace and exposes explicit retry; its internal navigation reuses the result. Shared display types live in `research/types.ts`. Confirmation dialogs reuse the original native `Dialog` component.

`ReasoningPreview` handles `#/research/reasoning` outside that configuration dependency. `reasoning-preview.ts` is a pure authored-fixture adapter: only an exact method and normalized authored explanation receive a prepared review. Custom text stays unassessed. `reasoning-preview-state.ts` validates draft inputs; verdicts are recomputed rather than trusted from storage. The showcase has no provider, session mutation or scoring calls. It preserves before/after attempts in separate tab storage, with a memory fallback for denied or failed writes. See `REASONING_PREVIEW.md` for the proposed live-review contract; stable attempt/revision binding and full evidence prompting are future backend work.

## Research data flow

PDF selection → local blob preview → explicit server extraction → per-page transcription review → confirmation for external processing → evidence analyst → lesson architect → statistical reviewer → coach reviewer → deterministic verification → learning session → optional explanation feedback → reveal → completion/history.

`#/research/…` routes work with the existing static hosting. `/api/research/…` is a separate API namespace. The original `/api/lesson`, `/api/feedback` and `/api/health` remain available when research dependencies are absent.

## Processing and verification

The provider interface supports distinct role prompts using a configured server-side Nebius endpoint/model. Defaults preserve the existing regional Nemotron Ultra configuration. Research requests use JSON Schema, local Zod parsing, expected-model/finish checks, 20-second timeouts and at most one retry for selected transient HTTP errors. The original curated service retains its 45-second timeout.

Jobs persist role, task, status, evidence references, concise summary and error. A versioned lease prevents overlapping stage requests; an expired lease permits recovery. The browser dispatches stages and polls saved state. There is no background worker or fabricated time-based completion. The help view describes the sequential architecture and does not claim a parallel Mixture of Agents implementation.

Exact excerpt/page matching, valid answer guides, known reference identifiers and reviewer approvals gate generated lessons. Model reviews assess semantic support; deterministic checks alone cannot prove that every inference is correct. Missing evidence or rejected review blocks play. Statistical results and paper metadata remain hidden in research session responses until permitted by the learning engine. The preserved curated entry independently exposes its original study metadata.

## Explicit local sample mode

`research/demo.ts` advances saved sample stages without an AI provider. It uses the separate reference study, preserves uploaded pages, and marks its lessons `source=demo`. Both `DEMO_MODE=true` and `PREVIEW_MODE=true` are required, and hosted/production execution is rejected. Document mode is immutable after consent; sample records cannot become live lessons. Live failures never switch into this path. See the setup guide for the flag transition and fresh-upload requirement.

## Storage and security

Local SQLite and remote libSQL share `store.ts`. Records have guest owner, kind, version and 30-day expiry. Compare-and-swap updates reject stale submissions. Deleting a document atomically removes its linked learner sessions. Protected maintenance removes expired records and stale request counters.

`research/client-state.ts` keeps unsubmitted choices, explanations, revisions and reflections in tab-scoped session storage, with an in-memory fallback when storage is denied. Drafts require matching session version and challenge; submitted decisions remain authoritative on the server. Selected PDFs and checked-document results stay in browser memory across research navigation. Route loads are abortable, upload callbacks are detached on departure, and late mutations cannot redirect a learner away from their chosen screen. `research/request.ts` presents recoverable connection/response errors without exposing raw diagnostics.

HMAC-signed HttpOnly SameSite=Strict cookies identify guests; Vercel cookies are Secure. Guest ownership is not an account or cross-device sync system. On Vercel, research requires explicit enablement, a remote database URL/token and a signing secret. Source and client assets contain no credentials.

Uploads are bounded before parsing, then checked for contents, MIME, extension and size. Original PDF bytes are not persisted. Text extraction is capped at 80 pages/250,000 characters; OCR is capped at six low-text pages with pixel, confidence and time limits. OCR provenance is visible. Exact text matching cannot establish pixel-level transcription accuracy.

Document text is untrusted data. Prompts prohibit following embedded commands, and no document-driven tools or URL fetching exist. Model text renders as escaped text. Same-origin mutation checks, security headers, owner checks and request budgets add boundaries, without claiming immunity to prompt injection. Research has persistent shared/per-guest logical AI request budgets; retries can add billed calls. The curated service's existing process-local budgets remain separate.

See `RESEARCH_INTEGRATION.md` for the deployment variables, function package settings and setup sequence. Hosted storage, OCR packaging and new live inference require configuration and smoke tests before release.
