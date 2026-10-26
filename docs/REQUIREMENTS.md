# Requirements and acceptance evidence

The public entry must start with adding a paper, preserving both PDF upload and visible URL/DOI entry. It restores the earlier learning journey and point system, with a refined desktop hero, concise copy and responsive layout. Local PDF checking and explicitly labeled sample lessons work without an external AI credential. General URL import and live paper-specific generation remain separate integrations.

## Current prototype acceptance

- The home exposes PDF, URL/DOI, sample/resume and practice points; inputs remain visible on a 1366×768 desktop viewport.
- Research points award ten once per solved challenge per adventure and persist across refresh; explanation edits and duplicate requests do not create rewards.
- The reasoning preview demonstrates choice → explanation → evidence → revision, works without API access and labels authored guidance. Custom explanations remain unassessed.
- Retired paper-case links return to the upload home instead of loading another application.
- Saved progress, PDF review and drafts survive supported navigation and refresh; storage failure has a recoverable fallback.
- Home sample entry and upload-recovery prepared-study actions open the authored quest directly, without the intermediate path chooser. The prepared-study navigation page remains available separately.
- Before answering, learners receive a concise study briefing with background and plain-language terms. Generated-paper briefings come from the verified lesson’s own context. Results, conclusions and answer keys stay gated.
- The authored quest offers Back after its opening screen, preserves unfinished choices during in-session navigation, and restores resolved answers without another attempt or score change. Pointer selection uses the filled choice state without an extra outline; keyboard focus remains visible.
- Responsive, keyboard, reduced-motion and automated accessibility checks cover the retained upload and learning paths.

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

## Authored results exploration

The authored sample must offer an ungraded prediction before deliberately revealing
reported quiz means. Prediction and reveal survive refresh within the current tab;
restarting clears them. Prediction controls must not submit or grade an answer.
Comparison may show the reported heights and prompt a calculation, while the worked
difference remains behind answer feedback. Preserve the following SD inspection,
interpretation, retry and completion path, source values and reduced-motion behavior.
Do not imply this sample interaction automatically supports arbitrary research papers.

## Nonfunctional acceptance

For the authored quest's desktop question layout, the full answer choices must
be visible above the pinned action bar without scrolling at the supported
viewport sizes in `tests/browser/quest-motion.spec.ts`. An illustration or an
always-expanded duplicate data table must not displace those controls. Keep long
answer text readable and complete; preserve natural scrolling on narrow screens,
enlarged text and deliberately expanded source material.

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

## Fresh Adventure scene requirements

Eight featured challenges and the bonus receive meaningful visual scenes. Scene
renderers must be independent of paper content, and generated papers use the same
validated contract. Preserve legacy lessons, server-side reveal gates, ownership,
versioning, retries, drafts, reasoning revisions and once-per-solved-challenge
points. Exploration does not establish correctness or learning benefit.
See [scene authoring](SCENE_AUTHORING.md) and [local design evidence](ui/FRESH_ADVENTURE.md).

## Paper context before the investigation

The upload and sample entries must introduce the study before assessment begins.
Reference context narrates the question, assignment, measurement and limitations in
four chapters without revealing numerical findings early. Learners move through the
chapters by pointer, keyboard, the story's own Back/Next controls or a horizontal
swipe; exploration is not an assessment and awards no points. In the upload sample journey
and from the library, the texting quest follows: short story screens, then one
decision per screen with a hint-led retry and an explanation. Numerical results
and the authors' conclusion stay hidden until the quest reaches them. The reference study's
published identity (title, authors, journal issue, DOI) is shown as authored
citation text, never as an AI analysis of an arbitrary PDF. Generated paper
briefings and extraction/consent remain tied to their own document. In sample
mode any pasted link is accepted as a labelled "link note" (not fetched) and
continues to the sample journey; nothing claims the linked paper was analysed.

A journey shows the story once. In the upload sample flow the quest follows
preparation directly; where the player's briefing is shown, it recaps the same
points briefly instead of repeating the story.
The context must stay readable at every supported width: the stage and its caption
share one card, the chapter rail wraps on narrow screens, the schematic switches to
a vertical composition, and the caption carries the meaning when the stage is hidden
from assistive technology.

## Three-paper authored activity pilot

The activity pilot must demonstrate existing scene families using three distinct
research designs and linked source evidence. Preserve the experiment's proportions
and their precision, label observational relationships without causal overreach,
and keep interview themes contextual. Prepared feedback and custom unassessed
writing must be distinguishable. Each paper retains its own tab draft and reset.
Practice must work without assessment or inference requests and must not affect
server progress or points. Desktop choices stay above the fixed check bar at
the supported pilot viewport sizes; narrow screens retain natural scrolling. The
pilot follows the quest's rhythm: check, feedback, then the next paper, ending
in a short summary.
This pilot is evidence of authored rendering reuse, not automatic generation from
arbitrary papers, proven learning benefit or production delivery.
