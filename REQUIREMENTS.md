# Requirements and acceptance evidence

The current repository and blue Gradly branding take priority over the separate prototype. Preserve the existing hero and six-quest curated experience, integrate the useful research capabilities, and submit the changes as a PR to `main`. Live infrastructure setup and public deployment are separate from the requested source preparation.

## Functional acceptance

| Required journey                                               | Implementation                                         | Evidence and limits                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Existing hero, PDF control, link below it, curated lesson      | `App.tsx`, `Welcome.tsx`, original components and APIs | Original interface/service/state tests; responsive hero browser test                    |
| Learning path, reference entry and eight ordered challenges    | Research workspace, `featured.ts`, `engine.ts`         | Full browser adventure and answer-key unit checks                                       |
| Single/multiple choices, hints, retry, second-miss explanation | Research engine and challenge workspace                | Engine tests and retry/multiple-selection browser paths                                 |
| Results timing, bonus complete/skip, final paper reveal        | Public session filtering and legal transitions         | Unit/browser checks for withheld answers and staged reveal                              |
| Written reasoning, independent revision and approved fallback  | Learning/feedback routes and revision UI               | Revision tests and no-key fallback browser path; new live feedback unverified           |
| Agent evidence/guidance and collaboration explanation          | Expandable research panels and help                    | Browser disclosure checks; sequential architecture is labeled accurately                |
| Completion, review, missed concepts and restart confirmation   | Research engine/history UI                             | Full completion and recovery browser scenarios                                          |
| Valid/invalid/oversized/corrupt PDF, preview and confirmation  | PDF service, upload UI and bounded router              | Real PDF unit/browser tests, preview-byte assertion and compiled server smoke checks    |
| Interrupted upload, replacement, cancellation and retry        | Upload state and XMLHttpRequest                        | Browser interruption/retry path and saved file checks                                   |
| Searchable and image-only extraction with page provenance      | PDFParse and bounded English Tesseract                 | Actual raster-only OCR fixtures, limits/timeouts and compiled server smoke check        |
| Insufficient evidence and generation failure/recovery          | Persisted jobs and pipeline                            | Mock-provider tests for missing/fabricated sources, failed review and successful stages |
| Generated lessons of evidence-dependent length                 | Schemas, role prompts and verifier                     | Three-challenge mocked pipeline; 3–14 supported; no successful live generation claimed  |
| Explicit external-processing consent and protected storage     | Job consent gate, guest cookies and storage            | Browser consent, ownership, version conflict and deletion checks                        |
| Refresh/resume, previous adventures and deletion               | Durable research records and history UI                | Browser resume/history/delete paths; remote database unverified                         |
| Glossary, help, settings and privacy                           | Connected research routes                              | Browser navigation and axe scans                                                        |

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
