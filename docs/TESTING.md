# Testing

Use Node 22 and run from the repository root:

```sh
npm ci
npm run check
npm run test:e2e
npm run build:vercel
```

`check` runs TypeScript, Node/interface tests, Vitest research tests and production builds. Playwright starts both services with local SQLite, explicit sample flags and an empty model key. Chromium is required. Stop an existing development server before running the browser suite.

## Retained coverage

| Suite                                     | Coverage                                                                                                                                           |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/*.test.ts`                         | Curated learner journey, feedback guards, unique rewards, resumption and stale PDF callbacks                                                       |
| `tests/research/`                         | Learning engine, points, PDF/OCR, provider validation, processing, sample-mode gates, ownership, retention, drafts and authored reasoning fixtures |
| `tests/research/stored-papers.test.ts`    | Stored `papers/` PDFs carry the DOI and title, and have an entry, matching `papers/README.md`                                                      |
| `tests/browser/upload-home.spec.ts`       | PDF/DOI entry, retired-link recovery, responsive/axe checks, upload → review → sample lesson → persisted points                                    |
| `tests/browser/viewport-layout.spec.ts`   | Shared viewport shell across home, preparation, curated lessons, research and reasoning preview; narrow-screen controls and expanded/error content |
| `tests/browser/research.spec.ts`          | Full research journey, uploads/OCR, consent, ownership, history, deletion, responsive views and classic compatibility                              |
| `tests/browser/final-polish.spec.ts`      | Draft recovery, failed requests, late navigation, dialogs, configuration reuse and accurate support copy                                           |
| `tests/browser/reasoning-preview.spec.ts` | API-free reasoning/revision flow, custom-text abstention, storage failure, keyboard, responsive and axe checks                                     |

The retired standalone paper-case implementation and its dedicated tests are removed together. The retained reasoning preview still blocks API requests during its browser tests. Provider tests use synthetic outputs; these are not live model verification. PDF and OCR tests process synthetic PDFs. Sample-mode tests verify no inference calls and rejection on Vercel/in production.

Format changed files with Prettier and run `git diff --check`. Browser traces are retained on failure. Automated accessibility checks cover exercised states; Safari/Firefox, assistive-technology sessions and arbitrary uploaded-document layouts remain outside this matrix.

## Consolidated verification

The replacement branch passes TypeScript, 127 unit/service checks, all 36 retained Chromium scenarios, production builds and Vercel packaging. Formatting and diff checks pass. This includes retired-link recovery, real PDF review through a labeled sample lesson, saved points, responsive accessibility and the API-free reasoning/revision loop.

## Hosted/live acceptance

After configuring the intended environment with [RESEARCH_INTEGRATION.md](RESEARCH_INTEGRATION.md):

1. Verify remote libSQL persistence and signed guest isolation across function invocations.
2. Upload searchable and scanned English papers; inspect transcription and packaged OCR behavior.
3. Confirm consent, run generation with actual Nebius responses, inspect evidence and rejected reviews, and complete an approved lesson.
4. Verify explanation feedback, provider-failure recovery, history, deletion and retention cleanup.

The existing automatic Vercel preview was blocked by project access restrictions. A successful hosted deployment, new live generation quality and learning benefit are not established by local test results. Earlier dated feedback evidence in README refers to the original curated service.

## Fresh Adventure scene checks

- `tests/research/scenes.test.ts`: scene validation, source/option mappings, gated
  payloads, legacy/future fallback, invalid generation, numerical checks, and both
  unrelated authored fixtures through the mocked generation/learning pipeline.
- `tests/research/scenes-service.test.ts`: real temporary local learning server,
  signed guest ownership, stale-version rejection, submission, retry and resume.
- `tests/research/scenes-ui.test.ts`: component rendering for all nine featured
  scenes and both fixtures, keyboard/multiple selection, evidence pins, branching,
  prediction/reveal and disabled submitted controls.
- `tests/research/scenes-workspace.test.ts`: actual research workspace integration
  with mocked transport, failed-save draft retention, retry, saved-version resume,
  and late-response protection, plus challenge/bonus transitions and heading focus.

- `tests/research/scene-motion.test.ts`: real Motion in a simulated document,
  rapid card reversal, fine/coarse-pointer gestures, disabled controls, native
  selection, assembly reversal, reveal focus, forbidden-result withdrawal,
  disclosure focus/exits, challenge replacement and live reduced-motion changes.
  Includes all scene families and the unrelated quantitative/qualitative fixtures.
- `tests/research/flow-connectors.test.ts`: simulated transformed node geometry,
  ancestor scaling, same-paint Motion-value/path updates, bounded frame coalescing,
  reduced-motion samples and observer/frame cleanup. This verifies geometry logic,
  not actual browser transform scheduling.

Run `npm run check` for type checks, all service/research checks and production
builds. Local service checks need permission to bind a temporary loopback port.
Component/workspace checks use a simulated document environment, not a browser.
Do not treat previous Chromium reports as verification of these new scene layouts.
Browser layout, animation smoothness, mobile touch and assistive-technology review
remain unverified unless separately performed and reported. No live model or
production deployment is required or established by the authored fixtures.
