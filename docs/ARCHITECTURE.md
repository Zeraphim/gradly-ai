# Architecture

Gradly keeps the existing React/Vite + Express TypeScript workspaces, shared contracts and Node 22 runtime. `server.ts` exports the Express application for Vercel; `scripts/prepare-vercel.mjs` copies Vite assets into generated `public/`. No Next.js runtime or second application server was added.

## Optional research scenes

`packages/contracts/src/scenes.ts` owns the shared versioned scene schema and
projection. Research challenges carry optional scene content through the existing
job storage and learning routes. The generation and review pipeline uses bounded
scene authoring rules. `publicSession` removes gated content before serialization.
`apps/web/src/research/scenes/` renders four generic families without paper-specific
branches. Selections use existing option identifiers and scoring. Exploration uses
optional tab-draft fields rather than a second progress store.
See [SCENE_AUTHORING.md](SCENE_AUTHORING.md) for a complete integration example.

## Current public experience

`App.tsx` is a small hash router. Root and `#/research/lab` render the upload-first `LegacyApp` entry, which retains the real PDF/processing/learning service. Retired `#/research/lab/{caseId}` URLs also return to the upload home. Research workspace routes keep their original extraction, ownership, consent and saved-state boundaries.

`npm run dev:preview` starts frontend and local API with preview/sample flags and local SQLite, while forcing an empty provider credential. Research points derive from each saved challenge’s successful attempts, once per challenge ID per adventure; session and history responses expose only that computed total. The home sums saved adventure points and existing curated-session points. No new reward ledger or database migration is required.

## Modules

| Module                                              | Responsibility                                                                           |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `apps/web/src/App.tsx`                              | Upload-first entry and hash compatibility routing (entry app eager, research views lazy) |
| `apps/web/src/LegacyApp.tsx`, `components/`         | Preserved original hero, curated flow and API-backed research entry                      |
| `packages/contracts`, `packages/lesson-state`       | Original lesson API contracts and curated progress                                       |
| `apps/api/src/feedback.ts`                          | Guarded curated reasoning assessment with authored teaching text                         |
| `apps/web/src/research/`                            | Lazy-loaded research views, hash navigation and scoped design                            |
| `apps/api/src/research/pdf.ts`, `ocr.ts`            | PDF validation, physical page extraction and bounded English OCR                         |
| `research/provider.ts`, `pipeline.ts`               | Nebius adapter and persisted sequential role workflow                                    |
| `research/contracts.ts`, `engine.ts`, `featured.ts` | Lesson schemas, source checks, learning transitions and eight-challenge reference        |
| `research/store.ts`, `auth.ts`, `router.ts`         | Persistence, guest ownership and Express request adaptation                              |
| `research/routes/`                                  | Config, documents, jobs, learning, feedback and retention maintenance                    |

The research workspace composes `PathPicker`, `UploadPage`, `ProcessingPage`, `HistoryPage` and `SupportPages`. `useDocumentUpload` owns browser-file validation, blob previews, upload cancellation and callback cleanup. `LegacyApp` owns the shared public configuration read and passes its loading/error/retry state to `ResearchApp`; direct research entry defers the inactive classic lesson. A standalone `ResearchApp` uses its own `useResearchConfig` fallback, disabled when the parent supplies configuration. Navigation reuses the result without a second configuration request. Shared display types live in `research/types.ts`. Confirmation dialogs reuse the original native `Dialog` component.

`ReasoningPreview` handles `#/research/reasoning` outside that configuration dependency. `reasoning-preview.ts` is a pure authored-fixture adapter: only an exact method and normalized authored explanation receive a prepared review. Custom text stays unassessed. `reasoning-preview-state.ts` validates draft inputs; verdicts are recomputed rather than trusted from storage. The showcase has no provider, session mutation or scoring calls. It preserves before/after attempts in separate tab storage, with a memory fallback for denied or failed writes. See `REASONING_PREVIEW.md` for the proposed live-review contract; stable attempt/revision binding and full evidence prompting are future backend work.

## Research data flow

PDF selection → local blob preview → explicit server extraction → per-page transcription review → confirmation for external processing → evidence analyst → lesson architect → statistical reviewer → coach reviewer → deterministic verification → learning session → optional explanation feedback → reveal → completion/history.

`#/research/…` routes work with the existing static hosting. `/api/research/…` is a separate API namespace. The original `/api/lesson`, `/api/feedback` and `/api/health` remain available when research dependencies are absent.

## Processing and verification

The provider interface supports distinct role prompts using a configured server-side Nebius endpoint/model. Defaults use the regional endpoint and Nemotron Super 120B. Research requests use JSON Schema, local Zod parsing, expected-model/finish checks, slot-based request sizing (pipeline stages receive the large output budget and long timeout; feedback requests stay compact), typed stage error codes for output-limit and timeout failures, and at most one retry for a timeout or selected transient HTTP errors. Zod's `propertyNames` keyword is removed from the request schema because Nebius rejects it before generation; replies are still parsed with the full Zod schema. The original curated service retains its 45-second timeout.

Jobs persist role, task, status, evidence references, concise summary, error and a stable typed error code. A versioned lease prevents overlapping stage requests; an expired lease permits recovery. The browser dispatches stages and polls saved state. There is no background worker or fabricated time-based completion. The help view describes the sequential architecture and does not claim a parallel Mixture of Agents implementation.

Exact excerpt/page matching, valid answer guides, known reference identifiers and reviewer approvals gate generated lessons. Live lesson drafts hold 3–8 challenges, cite the verified stage-0 evidence identifiers, and receive those excerpts server-side instead of re-emitting them. A challenge may add up to three excerpts for details its references do not state; only verbatim ones are attached and cited. Drafts carry no alternative answers, every challenge needs a hint, and a scene that fails validation is removed before review. When no drafted scene remains, the server builds one from a challenge's evidence. A `paper.url` without a usable host is stored as unavailable (`null`). Reasoning feedback is rejected if it names the paper. Model reviews assess semantic support; deterministic checks alone cannot prove that every inference is correct. A reviewer rejection sends the lesson back for one redraft against its issues, and both reviewers check the new draft. A reviewer reply with no readable reason is asked again once. Missing evidence or a second rejection blocks play. Statistical results and paper metadata remain hidden in research session responses until permitted by the learning engine. The preserved curated entry independently exposes its original study metadata.

## Explicit local sample mode

`research/demo.ts` advances saved sample stages without an AI provider. It uses the separate reference study, preserves uploaded pages, and marks its lessons `source=demo`. Both `DEMO_MODE=true` and `PREVIEW_MODE=true` are required, and hosted/production execution is rejected. Document mode is immutable after consent; sample records cannot become live lessons. Live failures never switch into this path. See the setup guide for the flag transition and fresh-upload requirement.

## Storage and security

Local SQLite and remote libSQL share `store.ts`. Records have guest owner, kind, version and 30-day expiry. Compare-and-swap updates reject stale submissions. Deleting a document atomically removes its linked learner sessions. Protected maintenance removes expired records and stale request counters.

`research/client-state.ts` keeps unsubmitted choices, explanations, revisions and reflections in tab-scoped session storage, with an in-memory fallback when storage is denied. Drafts require matching session version and challenge; submitted decisions remain authoritative on the server. Selected PDFs and checked-document results stay in browser memory across research navigation. Route loads are abortable, upload callbacks are detached on departure, and late mutations cannot redirect a learner away from their chosen screen. `research/request.ts` presents recoverable connection/response errors without exposing raw diagnostics.

HMAC-signed HttpOnly SameSite=Strict cookies identify guests; Vercel cookies are Secure. Guest ownership is not an account or cross-device sync system. On Vercel, research requires explicit enablement, a remote database URL/token and a signing secret. Source and client assets contain no credentials.

Uploads are bounded before parsing, then checked for contents, MIME, extension and size. Original PDF bytes are not persisted. Text extraction is capped at 80 pages/250,000 characters; OCR is capped at six low-text pages with pixel, confidence and time limits. OCR provenance is visible. Exact text matching cannot establish pixel-level transcription accuracy.

Document text is untrusted data. Prompts prohibit following embedded commands, and no document-driven tools or URL fetching exist. Model text renders as escaped text. Same-origin mutation checks, security headers, owner checks and request budgets add boundaries, without claiming immunity to prompt injection. Research has persistent shared/per-guest logical AI request budgets; retries can add billed calls. The curated service's existing process-local budgets remain separate.

See `RESEARCH_INTEGRATION.md` for the deployment variables, function package settings and setup sequence. Hosted storage, OCR packaging and new live inference require configuration and smoke tests before release.

## Paper-review presentation

`components/PaperStory.tsx` presents authored reference context during curated
preparation. It uses shared motion and has no assessment or provider calls.

`components/SiteChrome.tsx` is the header and footer for the upload-first home,
library, history and support routes; its styles load globally from `main.tsx`.
The paper journey (review, preparation, the authored texting quest
`TextingQuest.tsx` at `/meet/:id`, and the player) runs in focus mode instead:
`FocusBar.tsx` with the journey stepper, styled by `journey.css`, `quest.css` and
`play.css`. From the
home page in sample mode, a PDF or any link (made into a "link note" document by
`link-note.ts`) skips the consent review and goes straight to preparation.

`UploadPage.tsx` retains the document-bound upload hook and consent API, with
Check/Review presentation in `upload-review.css`. A file chosen on home or on the
review route is checked immediately (`UploadDraft.autoCheck`). `useDocumentUpload`
classifies failures by where they happened: client checks and 4xx validation
responses are `rejected`; network, timeout, cancel and 5xx are `interrupted`.
`FailureRecovery.tsx` renders both, and failed preparation stages, offering retry
or the prepared-study library as a choice. `ProcessingPage.tsx` uses one layout
for live and sample jobs. `PreparationTrack.tsx` reads saved audit roles,
statuses and summaries; its document advances only when the saved stage
advances. A ready sample job, and the library's Start quest, open the texting quest
(`texting-quest.ts` script, `quest-visuals.tsx` visuals). It checks answers in the
browser against the authored key and keeps progress in `sessionStorage`; it calls
no API. A ready live job starts a session with `lessonId` and opens
`#/research/play/<sessionId>`: the prepared-study `JourneyPlayer` driven by the
saved session (`studies/UploadedJourney.tsx`, adapter `studies/uploaded.ts`).
The browser receives one public challenge at a time and no answer keys.
`publicJob` adds count-only `outline`; `publicSession` adds `lessonId`, the
identity-safe `study` card from `study-card.ts`, `takeaway` at the reveal and
`feedback.accepted` under the explanation gate. Failed stages are classified by
their saved `errorCode`. Samples stay explicitly separate from uploaded
text. `HistoryPage.tsx` fetches persisted errors for failed jobs through the
existing job endpoint and links generated sessions to `/play`. The scene contract
is unchanged. See the
[intake integration proposal](ui/INTAKE_PROCESSING.md) for unresolved fields.


## Authored multi-paper scene pilot

`PaperActivityPilot.tsx` and `activity-pilot.ts` provide the lazy `/activities`
research preview with three source-backed datasets, reusing `InvestigationScene`
and the shared scene projection. Review and per-paper drafts stay in session
storage, separately from server assessment. It makes no assessment or inference
calls. The comparison contract adds optional bounded decimal places; existing
scenes retain their two-decimal default. See DESIGN.md and SCENE_AUTHORING.md.
