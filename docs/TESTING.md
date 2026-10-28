# Testing

Use Node 22 and run from the repository root:

```sh
npm ci
npm run check
npm run test:e2e
npm run build:vercel
```

`check` runs TypeScript, Node tests, Vitest research tests and production builds. Playwright starts both services with local SQLite, explicit sample flags and an empty model key. Chromium is required. Stop an existing development server before running the browser suite.

## Retained coverage

| Suite                                     | Coverage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/*.test.ts`                         | Curated service feedback guards, unique rewards, resumption and API/state checks. The retired classic UI walkthrough is removed.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `tests/research/`                         | Learning engine, points, PDF/OCR, provider validation, processing, sample-mode gates, ownership, retention, drafts and authored reasoning fixtures                                                                                                                                                                                                                                                                                                                                                                                                                |
| `tests/research/stored-papers.test.ts`    | Stored `papers/` PDFs carry the DOI and title, and have an entry, matching `papers/README.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `tests/browser/upload-home.spec.ts`       | PDF/DOI entry, retired-link recovery, responsive/axe checks, upload → review → sample lesson → persisted points                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `tests/browser/viewport-layout.spec.ts`   | Shared viewport shell across home, preparation, curated lessons, research and reasoning preview; narrow-screen controls and expanded/error content                                                                                                                                                                                                                                                                                                                                                                                                                |
| `tests/browser/research.spec.ts`          | Full research journey, uploads/OCR, consent, ownership, history, deletion, responsive views and saved-session compatibility                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `tests/browser/final-polish.spec.ts`      | Draft recovery, failed requests, late navigation, dialogs, configuration reuse and accurate support copy                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `tests/browser/reasoning-preview.spec.ts` | API-free reasoning/revision flow, custom-text abstention, storage failure, keyboard, responsive and axe checks                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `tests/browser/intake-flow.spec.ts`       | PDF/link sample handoff, upload rejection, interrupted-check retry, direct library entry and shared-player keyboard response.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `tests/browser/preparation.spec.ts`       | Preparation waits for saved state, stops on failure, retries and resumes without fake progress, reduced motion, axe at 375/768/1366, and history keeping a failed job with its reason                                                                                                                                                                                                                                                                                                                                                                             |
| `tests/browser/activity-pilot.spec.ts`    | Three-paper `/activities` pilot: shared scene renderer, separate drafts and notes, no assessment requests, desktop fit of choices and Check, narrow screens, reduced motion, and a keyboard run to the summary                                                                                                                                                                                                                                                                                                                                                    |
| `tests/research/activity-pilot.test.ts`   | Pilot data keeps three-decimal means and gates the derived difference, uses no fabricated outcome values, and bounds restored drafts to their own paper                                                                                                                                                                                                                                                                                                                                                                                                           |
| `tests/browser/studies.spec.ts`           | Direct Learn library and keyboard entry with axe; every study opens and checks its first challenge with axe at 375; prepared-study library and player: axe and overflow at 375/768/1366, refresh/back restore, double-click, reduced motion                                                                                                                                                                                                                                                                                                                       |
| `tests/browser/upload-journey.spec.ts`    | Mocked live preparation: every waiting state at 375 and 1366 without overflow (screenshots to `.data/screenshots/upload-journey/`, or `UPLOAD_JOURNEY_SHOTS`), stage-driven progress and live celebration, resume after reload and from home, `errorCode` recovery copy with axe, reduced motion, and an uploaded lesson played in the study player against the real engine with retry, written reasoning, AI coach and reveal, the intro's hunch, route and practice steps, and a long one-block generated briefing that stays folded with Skip to study in view |
| `tests/research/briefing.test.ts`         | Study-intro briefing split: every prepared briefing shown whole, a long one-block briefing folded behind a lead of whole sentences up to 60 words with no text lost                                                                                                                                                                                                                                                                                                                                                                                               |
| `tests/research/upload-journey.test.ts`   | Session-to-study adapter (no keys before a check, scene-less challenges, phases), the upload player with server scoring, draft restore and a stale-tab conflict, outline counts, slow-step copy, warm-up and prediction storage, ready hand-off and resume storage                                                                                                                                                                                                                                                                                                |
| `tests/research/study-card.test.ts`       | Server card fields: identity hiding (title, close variants, authors), first-question rule, design inference without null results, minutes, takeaway, and the public session and job gates for keys, takeaway and outline counts                                                                                                                                                                                                                                                                                                                                   |

The retired standalone paper-case implementation and its dedicated tests are removed together. The retained reasoning preview still blocks API requests during its browser tests. Provider tests use synthetic outputs; these are not live model verification. Live model behaviour is measured separately by the dev-only, billed `npm run eval:nemotron`, which is not part of `check` (see [research/NEMOTRON_EVALUATION.md](research/NEMOTRON_EVALUATION.md)). Only its pure checks run in `check`, through `tests/research/eval-nemotron-checks.test.ts`. `npm run diagnose:nebius` (evidence and lesson stages on one stored paper) and `npm run test:flow` (all seven stages, a learner session and one feedback request on a local server) and `npm run test:scenes` (the full pipeline on eight stored papers, reporting interactive and model-written scene shares per paper) are also dev-only billed live probes outside `check`. Their results vary between runs and are evidence for one revision only. PDF and OCR tests process synthetic PDFs. Sample-mode tests verify no inference calls and rejection on Vercel/in production.

`tests/browser/prepared-review.spec.ts` checks the revised beverage journey at
375/768/1366px, old-answer isolation, feedback, final reveal, overflow and axe.
The proof-set content checks require scenes on a majority of required challenges;
semantic question quality still needs source-based review.

`tests/research/prepared-visuals.test.ts` checks that every prepared study has at least
one required visual and verifies the issue-32 additions against their source excerpts,
numerical validation and reveal contract. The original eight-study majority guard remains
in `prepared-studies.test.ts`. `tests/browser/prepared-visuals.spec.ts` walks the other
21 studies at 375/768/1366, exercising every added scene before and after checking,
explicit numerical reveals, feedback, overflow and axe. Coverage and the separately
approved live-production probe are recorded in
[PREPARED_VISUAL_COVERAGE.md](research/PREPARED_VISUAL_COVERAGE.md).

`tests/research/prepared-choice-quality.test.ts` guards the 26 studies revised in
PR #33 against fixed-position and shortest/longest-answer shortcuts, disproportionate
choice lengths, scene response ordering drift and one-word stage labels. Its scope
is listed in `tests/fixtures/rewritten-studies.ts`; `scripts/audit-prepared-choices.ts`
prints reproducible required-question counts, including ties. These checks do not
verify that distractors are plausible or that teaching claims are correct.

`tests/browser/remaining-question-review.spec.ts` walks the final 21 generated
studies (122 required questions) at 375×812 and 1366×768. It selects the accepted
responses, opens reported-value scenes where required, checks feedback and final
paper reveal, and checks horizontal overflow and axe after every response. Each
phone case also misses its first question once and verifies the question-specific
hint after retry. The walkthrough waits for the supplied font before layout checks. The
fixture is `tests/fixtures/remaining-studies.ts`. This exercises the content in the
player; it does not independently approve its accuracy or learning benefit.
`rewritten-studies.ts` includes this batch in the answer-position, length-cue and
scene-order regression checks alongside the earlier 26 revised studies.

Prepared-study browser saves retain a per-card question revision (legacy saves are
revision 1). Bump the card revision when question or answer meaning changes; keep it
for copy-only edits. Old attempts do not count toward revised questions. The intro
explains that a fresh attempt is needed; the old save remains stored until Begin,
and other studies are preserved. Uploaded sessions retain their server-owned version
and are unaffected. `study-player.test.ts` covers revision restore, explicit restart,
unrelated saves and damaged cached attempts. `study-revisions.spec.ts` exercises
that restart at 375×812, 1024×600 and 1366×768. The saved-answer regression covers both legacy saves without a revision and the previous revision 2. The final 21-study batch uses revision 3.

`tests/browser/prepared-rewrites.spec.ts` walks all 26 revised studies at 375×812 and
1366×768 through the paper reveal, including optional bonuses and multiple-answer
selection. It exercises numeric-result disclosure before assessment, scene taps,
answer feedback, horizontal overflow and axe for each checked question.

`tests/research/terms.test.ts` covers the term checks (caps, term in challenge text, source and reference rules, design-stage results references, quoted accepted answers), the explanation gate, the Terms Guide stage order, the answer-leak removal, reviewer rejection and the upgrade of five-stage jobs. `tests/research/terms-ui.test.ts` covers segmentation, popover placement and the popover's click, chip, Escape and reset behaviour. `prepared-studies.test.ts` requires a saved terms file for every prepared study and runs every saved definition through the same checks. `tests/browser/terms.spec.ts` exercises hover, click, keyboard focus and Escape, tapping on a phone, presses through an open popover and closing on Check. It runs axe with the popover open in light and dark colour preferences and saves screenshots to `test-results/terms/`. The saved definitions come from `npm run define:terms`, a billed dev-only run of the production terms stage and Research Methods Reviewer; unit tests do not establish their quality.

`tests/research/scene-stage.test.ts` covers the Scene Designer stage: written, redrafted, evidence-built and plain outcomes, the time budget, alternating kind sets and kept neighbours, results references on design questions, quoted accepted options, the leak check, response repairs, reviewer scene rejection and the upgrade of six-stage jobs. `tests/research/scene-kinds.test.ts` covers the ladder, sort and spot contracts, their checks and reveal gating. `tests/research/reasoning-scenes-ui.test.ts` renders the three kinds and covers sorting, highlighting and tap answers. `prepared-studies.test.ts` requires a scene on at least 90% of every prepared study's challenges, no back-to-back kinds apart from the evidence scene, and runs every saved scene through the stage's checks. `tests/browser/reasoning-scenes.spec.ts` picks one prepared challenge per new kind from the saved scene files, then exercises it on desktop and phone: pressing, the keyboard, axe, overflow and screenshots in `test-results/scenes/`. The saved scenes come from `npm run define:scenes`, a billed dev-only run of the production Scene Designer stage and Research Methods Reviewer; unit tests do not establish their quality.

`tests/browser/choice-focus.spec.ts` checks mouse and touch selection of prepared
cards, pills, multi-answer checkboxes, interval predictions and diagram answers,
plus shared research-activity responses. Pointer selections and restored drafts
must have no extra outline; keyboard focus retains a visible 3px ring. The
first card case was observed failing before the 26 October focus fix.

Format changed files with Prettier and run `git diff --check`. Browser traces are retained on failure. Automated accessibility checks cover exercised states; Safari/Firefox, assistive-technology sessions and arbitrary uploaded-document layouts remain outside this matrix.

## Authored quest and activity checks

`tests/browser/quest-navigation.spec.ts` contains one mocked generated-session
case: an uploaded paper receives its distinct commuter-study briefing before
questions. It verifies the UI handoff, not live generation or provider quality.
`intake-flow.spec.ts` covers PDF/link sample handoff, rejection recovery,
browser-history return without replaying a previously selected upload,
interrupted-check retry, direct library entry and shared-player letter keys.
The retired bespoke-quest keyboard completion/resume run and full 375×812 phone
sweep are no longer present; prepared-player walkthroughs cover the current flow.

Run one browser suite with `npx playwright test tests/browser/<name>.spec.ts`.
Suites that cover the challenge player open it through
`tests/browser/journey-helpers.ts`, which sends the same `start` request as the
app, rather than through the library button.

- `learn-flow.spec.ts` checks direct sample entry, alias recovery with history
  replacement, unchanged individual links, header geometry/active state, no legacy
  lesson requests, eleven uploaded-intro window sizes, expanded route details,
  practice feedback, source disclosure, prediction restore and accessibility.
  It sweeps all 53 prepared intros at 1366×768 and 1024×600, checking complete
  Begin-button geometry and no horizontal overflow. These checks detect the
  reported viewport regression; they do not prove every possible content/zoom fits.
- The retired classic and bespoke meet-quest browser cases have been removed.
  Active prepared-player restoration, reveal and motion stay covered by `studies`,
  `prepared-rewrites`, `choice-focus`, scene suites and `upload-journey`.
- The results cases check that a prediction creates no answer record, numerical
  marks stay hidden until an explicit reveal, the worked difference waits for
  feedback, and SD markers match mean ± SD.
- The activity pilot checks all three papers at 1366×768, 1000×640 and 1440×900,
  axe at 320, 390, 768 and 1366 CSS pixels, and runs with API requests blocked.

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
learning benefit, or perceived quality. Historical bespoke-quest results are not current shared-player coverage.
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
3. Confirm consent, run generation with actual Nebius responses, inspect evidence and any advisory review notes, and complete the lesson.
4. Verify explanation feedback, provider-failure recovery, history, deletion and retention cleanup.

The existing automatic Vercel preview was blocked by project access restrictions. A successful hosted deployment, new live generation quality and learning benefit are not established by local test results. Earlier dated feedback evidence in README refers to the original curated service.

## Fresh Adventure scene checks

- `tests/research/scenes.test.ts`: scene validation, source/option mappings, gated
  payloads, legacy/future fallback, invalid generation, numerical checks, and three
  unrelated authored fixtures (water survey, station interviews, clinic field trial
  with units, tests and matrix scenes and tap answers) through the mocked
  generation/learning pipeline.
- `tests/research/scene-library.test.ts`: every prepared scene parses against the
  shared contract, each promoted or new kind appears in two design groups,
  relationship checks and gating per kind, tap eligibility, the generated-lesson
  scene requirement, reported-number matching, `responseStyle` reaching the
  player, and rendering of the tests, units and matrix scenes.
- `tests/research/pipeline.test.ts` also checks that a draft without a valid scene
  fails at drafting with a retry message and passes after the retry redrafts.
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

- `question-help.spec.ts` covers keyboard and phone term popovers/help dialogs, focus return,
  preserved answer selection, no help-triggered requests, options-only terms not
  influencing definitions, first-miss hint gating, and Research terms under Help.
- `research-terms.test.ts` checks complete-term matching, original text ranges,
  repeated terms, untrusted text, and example coverage for the reference.
- `library-filters.spec.ts` checks all design/topic options, combined filtering,
  empty results and Reset, result counts, keyboard order, overflow and axe at
  320/390/768/1366px. It retains screenshots of the quieter toolbar.

- `upload-guide.spec.ts` checks changing frames and a stable pose after one 4.8-second cycle, upload-home-only
  mounting, a static header logo, live system preference and persisted user reduced
  motion, plus unchanged guide dimensions. The existing Gradly guide artwork is retained with a finite animation count;
  no additional animation library is involved.

`learn-flow.spec.ts` checks that the reasoning preview returns to the most recent
learning route after moving from intake to Learn, while retaining an active-paper
return link when the preview was opened from intake.

`tests/welcome.test.ts` retains both delayed-PDF unmount regressions: a late header
check and a successful late curated digest cannot navigate after leaving Welcome.
The public home uses only the upload-first presentation; the bounded curated
validator remains covered while the classic-retirement decision is pending.
