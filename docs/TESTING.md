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

| Suite                                     | Coverage                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/*.test.ts`                         | Curated learner journey, feedback guards, unique rewards, resumption and stale PDF callbacks                                                                                                                                                                                                                           |
| `tests/research/`                         | Learning engine, points, PDF/OCR, provider validation, processing, sample-mode gates, ownership, retention, drafts and authored reasoning fixtures                                                                                                                                                                     |
| `tests/research/stored-papers.test.ts`    | Stored `papers/` PDFs carry the DOI and title, and have an entry, matching `papers/README.md`                                                                                                                                                                                                                          |
| `tests/browser/upload-home.spec.ts`       | PDF/DOI entry, retired-link recovery, responsive/axe checks, upload → review → sample lesson → persisted points                                                                                                                                                                                                        |
| `tests/browser/viewport-layout.spec.ts`   | Shared viewport shell across home, preparation, curated lessons, research and reasoning preview; narrow-screen controls and expanded/error content                                                                                                                                                                     |
| `tests/browser/research.spec.ts`          | Full research journey, uploads/OCR, consent, ownership, history, deletion, responsive views and classic compatibility                                                                                                                                                                                                  |
| `tests/browser/final-polish.spec.ts`      | Draft recovery, failed requests, late navigation, dialogs, configuration reuse and accurate support copy                                                                                                                                                                                                               |
| `tests/browser/reasoning-preview.spec.ts` | API-free reasoning/revision flow, custom-text abstention, storage failure, keyboard, responsive and axe checks                                                                                                                                                                                                         |
| `tests/browser/quest-motion.spec.ts`      | Shared bootstrap configuration, classic deferral, quest heading focus, direct slider response, persistent design/reveal state, rapid reversal, reduced motion, touch, resumption and stable chart labels                                                                                                               |
| `tests/browser/intake-flow.spec.ts`       | Home PDF straight to preparation and the sample quest, pasted links labelled as not fetched, rejected and interrupted checks, home sample entry, Play letter keys, keyboard-only quest with retry/resume/completion and axe, and the phone check that every quest question shows its first answer above the action bar |
| `tests/browser/preparation.spec.ts`       | Preparation waits for saved state, stops on failure, retries and resumes without fake progress, reduced motion, axe at 375/768/1366, and history keeping a failed job with its reason                                                                                                                                  |
| `tests/browser/activity-pilot.spec.ts`    | Three-paper `/activities` pilot: shared scene renderer, separate drafts and notes, no assessment requests, desktop fit of choices and Check, narrow screens, reduced motion, and a keyboard run to the summary                                                                                                         |
| `tests/research/activity-pilot.test.ts`   | Pilot data keeps three-decimal means and gates the derived difference, uses no fabricated outcome values, and bounds restored drafts to their own paper                                                                                                                                                                |
| `tests/browser/studies.spec.ts`           | Learn-page library link by keyboard with axe; every study opens and checks its first challenge with axe at 375; prepared-study library and player: axe and overflow at 375/768/1366, refresh/back restore, double-click, reduced motion                                                                                |

The retired standalone paper-case implementation and its dedicated tests are removed together. The retained reasoning preview still blocks API requests during its browser tests. Provider tests use synthetic outputs; these are not live model verification. Live model behaviour is measured separately by the dev-only, billed `npm run eval:nemotron`, which is not part of `check` (see [research/NEMOTRON_EVALUATION.md](research/NEMOTRON_EVALUATION.md)). Only its pure checks run in `check`, through `tests/research/eval-nemotron-checks.test.ts`. `npm run diagnose:nebius` (evidence and lesson stages on one stored paper) and `npm run test:flow` (all five stages, a learner session and one feedback request on a local server) are also dev-only billed live probes outside `check`. Their results vary between runs and are evidence for one revision only. PDF and OCR tests process synthetic PDFs. Sample-mode tests verify no inference calls and rejection on Vercel/in production.

Format changed files with Prettier and run `git diff --check`. Browser traces are retained on failure. Automated accessibility checks cover exercised states; Safari/Firefox, assistive-technology sessions and arbitrary uploaded-document layouts remain outside this matrix.

## Authored quest and activity checks

Run one browser suite with `npx playwright test tests/browser/<name>.spec.ts`.
Suites that cover the challenge player open it through
`tests/browser/journey-helpers.ts`, which sends the same `start` request as the
app, rather than through the library button.

- The desktop layout sweep in `quest-motion.spec.ts` derives every choice step
  from the authored `textingQuest` script, so new questions are checked
  automatically. It runs under reduced motion at 1366×768, 1440×900, 1920×1080,
  1280×720, 1024×768, 1280×640, 1000×640 and portrait 1024×1366, with Help
  closed and open, and checks no page scrolling, no horizontal overflow,
  complete label rectangles above the action bar, 44px minimum targets and
  pointer coverage. It also covers
  revealed result choices, Compare means and the optional result table.
- The results cases check that a prediction creates no answer record, numerical
  marks stay hidden until an explicit reveal, the worked difference waits for
  feedback, and SD markers match mean ± SD.
- The activity pilot checks all three papers at 1366×768, 1000×640 and 1440×900,
  axe at 320, 390, 768 and 1366 CSS pixels, and runs with API requests blocked.
- The phone check in `intake-flow.spec.ts` runs every quest question at 375×812.

Do not run `npm run check` against a development server that the browser suite is
using: rebuilding shared contracts restarts the API and fails unrelated cases.
Two cases have failed once and then passed alone, so treat them as intermittent:
`final-polish.spec.ts` "unfinished choices and explanations survive help, refresh
and exit", and `research.spec.ts` "no-key sample flow is explicit, resumable and
separate from uploaded evidence". The embedded PDF viewer is blank in headless
Chromium; the tests exercise the open-original link and extracted text instead.

These checks cover the authored sample and prepared pilot cases in Chromium. They
do not establish live Nebius generation, study-design selection for arbitrary
papers, Safari/Firefox or WebKit (its Playwright runtime was unavailable locally),
real iOS/Android phones or frame rates, screen-reader use, hosted delivery,
learning benefit, or perceived quality. The quest's reported F(1, 54) = 4.33
comes from the team's quest script and has not been checked against the paper.
Dated local results are recorded in the
[intake verification history](ui/INTAKE_PROCESSING.md#verification-history).

## Historical consolidated verification

Pull request 2 reported passing TypeScript, 127 unit/service checks, all 36 retained Chromium scenarios, production builds, Vercel packaging, formatting and diff checks. These are the replacement branch's historical reports, not current hosted verification. This includes retired-link recovery, real PDF review through a labeled sample lesson, saved points, responsive accessibility and the API-free reasoning/revision loop.

## Merge and integration checks

Use [MERGE_GUARDRAILS.md](MERGE_GUARDRAILS.md) to select checks for the actual
candidate and resulting integration revision. Its evidence catalog covers the
post-request-2 declaration, canvas-runtime and static-asset fixes, and the separate
preview access restriction. `npm run check` does not run the actual Vercel function
builder, browser suite or hosted checks. Documentation-only guardrail edits do not
require rerunning unrelated application tests.

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
- `tests/research/prepared-studies.test.ts`: one lesson body per card with matching
  challenge ids, slugs and pre-reveal text free of author names, banned
  research-line teasers, non-school studies listed first, the proof set, answer
  guides, scene mappings, gating, scene-kind variety, a stored PDF for every study
  except the texting study, and verbatim evidence excerpts. The per-study checks
  live in `scripts/prepared-study-checks.ts`, which the Nemotron generator also
  uses as its gate. `study-player.test.ts` exercises the full library list, filters,
  check/retry/explain, points once per solve, reload, keyboard, unknown slugs and
  saved progress for removed studies.
- `tests/research/papers-setup.ts` is Vitest's global setup: it parses every stored
  PDF once per run and shares the page text with `stored-papers.test.ts` and
  `prepared-studies.test.ts`, so more studies do not add PDF parsing.
- `npm run generate:studies` (dev-only, billed, not part of `check`) generates
  lessons with Nemotron. See [research/GENERATED_STUDIES.md](research/GENERATED_STUDIES.md).
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
