# Requirements and acceptance evidence

The public entry must start with adding a paper, preserving both PDF upload and visible URL/DOI entry. It restores the earlier learning journey and point system, with a refined desktop hero, concise copy and responsive layout. Local PDF checking and explicitly labeled sample lessons work without an external AI credential. General URL import and live paper-specific generation remain separate integrations.

## Current prototype acceptance

- The home exposes PDF, URL/DOI, sample/resume and practice points; inputs remain visible on a 1366×768 desktop viewport.
- Research points award ten once per solved challenge per adventure and persist across refresh; explanation edits and duplicate requests do not create rewards.
- The authored case flow connects a paper's question, approach, findings, interpretation and limitations. A content choice does not create another interaction mode.
- The curated published case and clearly fictional qualitative case both complete through the same short-note reader, answer check, transfer and recap.
- One note is shown at a time with direct Back/Next controls. Saving notes and personal writing are optional. Answer changes invalidate authored feedback; arbitrary writing never receives fabricated assessment.
- The initial call survives the findings reveal, confidence remains self-reported, and completion never implies mastery.
- Notes, revisions and per-case recovery work in tab storage with safe denial/corruption handling. Local export preserves source and fictional provenance and has a copyable fallback.
- Authored case URLs work with API requests blocked. The upload-first home uses the local PDF/learning service; `npm run dev:preview` starts it without external AI calls.
- Responsive, keyboard, reduced-motion and accessibility checks cover the full five-stage flow, with inspected render evidence. Existing compatibility regressions remain covered.

`PRODUCT_DIRECTION.md` records the product reasoning and future evaluation needs. `TESTING.md` records actual verification and limits.

## Compatibility functional acceptance

The added browser-only reasoning showcase demonstrates separate choice and explanation judgments, a specific misconception, published-page evidence, a targeted question, revision comparison and a gated paper reveal. It remains usable with all API routes unavailable, labels its authored feedback, and refuses to assess custom writing. Its checks and future live requirements are in [REASONING_PREVIEW.md](REASONING_PREVIEW.md).

| Required journey                                               | Implementation                                                                      | Evidence and limits                                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Existing hero, PDF control, link below it, curated lesson      | `App.tsx`, `Welcome.tsx`, original components and APIs                              | Original interface/service/state tests; responsive hero browser test                    |
| Learning path, reference entry and eight ordered challenges    | Research workspace, `featured.ts`, `engine.ts`                                      | Full browser adventure and answer-key unit checks                                       |
| Single/multiple choices, hints, retry, second-miss explanation | Research engine and challenge workspace                                             | Engine tests and retry/multiple-selection browser paths                                 |
| Results timing, bonus complete/skip, final paper reveal        | Public session filtering and legal transitions                                      | Unit/browser checks for withheld answers and staged reveal                              |
| Written reasoning, independent revision and approved fallback  | Learning/feedback routes and revision UI                                            | Revision tests and no-key fallback browser path; new live feedback unverified           |
| Agent evidence/guidance and collaboration explanation          | Expandable research panels and help                                                 | Browser disclosure checks; sequential architecture is labeled accurately                |
| Completion, review, missed concepts and restart confirmation   | Research engine/history UI                                                          | Full completion and recovery browser scenarios                                          |
| Valid/invalid/oversized/corrupt PDF, preview and confirmation  | PDF service, upload UI and bounded router                                           | Real PDF unit/browser tests, preview-byte assertion and compiled server smoke checks    |
| Interrupted upload, replacement, cancellation and retry        | Upload state and XMLHttpRequest                                                     | Browser interruption/retry path and saved file checks                                   |
| Searchable and image-only extraction with page provenance      | PDFParse and bounded English Tesseract                                              | Actual raster-only OCR fixtures, limits/timeouts and compiled server smoke check        |
| Insufficient evidence and generation failure/recovery          | Persisted jobs and pipeline                                                         | Mock-provider tests for missing/fabricated sources, failed review and successful stages |
| Generated lessons of evidence-dependent length                 | Schemas, role prompts and verifier                                                  | Three-challenge mocked pipeline; 3–14 supported; no successful live generation claimed  |
| Explicit external-processing consent and protected storage     | Job consent gate, guest cookies and storage                                         | Browser consent, ownership, version conflict and deletion checks                        |
| Refresh/resume, previous adventures and deletion               | Durable research records and history UI                                             | Browser resume/history/delete paths; remote database unverified                         |
| Unsubmitted drafts, context return and request recovery        | Version-bound tab drafts, retained upload, safe navigation and explicit load states | Final-polish browser scenarios and client-state/request unit tests                      |
| Glossary, help, settings and privacy                           | Connected research routes                                                           | Browser navigation and axe scans                                                        |

## Nonfunctional acceptance

- Keep the existing TypeScript/Vite/Express architecture, self-hosted font and supplied blue logo/mascot.
- Keep model secrets server-side and make endpoint/model configurable. Missing credentials produce explicit unavailable/fallback states, not synthetic AI results.
- Validate generated structures and evidence references before play; AI feedback cannot alter the authored featured answer key.
- Show saved backend processing states and concise role summaries, never hidden chain-of-thought.
- Preserve guest ownership, optimistic concurrency, retention and recoverable errors.
- Support keyboard use, accessible labels, visible focus, reduced motion and responsive desktop/tablet/mobile layouts.
- Pass type checks, unit/service tests, browser scenarios, production/Vercel source builds and dependency checks. See `TESTING.md` for exact coverage.

## Local flow-preview acceptance

With explicit local preview flags, a checked upload must offer a working sample-flow action. Its saved steps, lesson, guidance and history must disclose sample content, never claim findings from the uploaded paper, and make no inference request. It must be rejected on Vercel/in production and cannot silently replace the live path. `demo.test.ts` and the sample-flow browser scenario cover these boundaries.

## Release conditions

Local implementation/testing does not establish hosted persistence, new live generation quality or Vercel OCR execution. The user requested setup instructions because credentials are not configured. Test those paths after setting the documented variables. The PR's automatic Vercel preview is reported blocked, and the current CLI account cannot access that project's details. A release must resolve that external restriction before relying on preview evidence.
