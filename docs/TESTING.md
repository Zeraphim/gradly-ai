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

| Suite                                     | Coverage                                                                                                                                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/*.test.ts`                         | Curated learner journey, feedback guards, unique rewards, resumption and stale PDF callbacks                                                                                                             |
| `tests/research/`                         | Learning engine, points, PDF/OCR, provider validation, processing, sample-mode gates, ownership, retention, drafts and authored reasoning fixtures                                                       |
| `tests/research/stored-papers.test.ts`    | Stored `papers/` PDFs carry the DOI and title, and have an entry, matching `papers/README.md`                                                                                                            |
| `tests/browser/upload-home.spec.ts`       | PDF/DOI entry, retired-link recovery, responsive/axe checks, upload → review → sample lesson → persisted points                                                                                          |
| `tests/browser/viewport-layout.spec.ts`   | Shared viewport shell across home, preparation, curated lessons, research and reasoning preview; narrow-screen controls and expanded/error content                                                       |
| `tests/browser/research.spec.ts`          | Full research journey, uploads/OCR, consent, ownership, history, deletion, responsive views and classic compatibility                                                                                    |
| `tests/browser/final-polish.spec.ts`      | Draft recovery, failed requests, late navigation, dialogs, configuration reuse and accurate support copy                                                                                                 |
| `tests/browser/reasoning-preview.spec.ts` | API-free reasoning/revision flow, custom-text abstention, storage failure, keyboard, responsive and axe checks                                                                                           |
| `tests/browser/quest-motion.spec.ts`      | Shared bootstrap configuration, classic deferral, quest heading focus, direct slider response, persistent design/reveal state, rapid reversal, reduced motion, touch, resumption and stable chart labels |

The retired standalone paper-case implementation and its dedicated tests are removed together. The retained reasoning preview still blocks API requests during its browser tests. Provider tests use synthetic outputs; these are not live model verification. PDF and OCR tests process synthetic PDFs. Sample-mode tests verify no inference calls and rejection on Vercel/in production.

Format changed files with Prettier and run `git diff --check`. Browser traces are retained on failure. Automated accessibility checks cover exercised states; Safari/Firefox, assistive-technology sessions and arbitrary uploaded-document layouts remain outside this matrix.

## Quest motion and study-design activity · 21 October 2026

Local implementation on `marc`, authorized for implementation and local preview;
visual acceptance, commit and push remain pending. The unrelated untracked Paper
Brief files were preserved.

- `npm run check` passed: 21 Node/interface checks, 209 research checks in 22
  files, TypeScript checks and production builds. After the final vertical-chart
  adjustment, root/web type checks and the frontend production build passed again.
- All 55 unique Chromium scenarios across the eight browser suites passed in
  two batches (38 and 22, with five overlapping quest cases). The five focused
  quest regressions also passed on the final presentation changes.
- The new regressions exercise one completed configuration read and no classic
  lesson read on direct research entry, retained classic loading, heading focus,
  immediate slider updates, retained diagram/group identities, rapid A/B/C changes,
  server-free sample interaction, post-answer source disclosure, restored answers,
  live reduced motion, emulated mobile touch and stable chart-label height over
  20 frames. The chart is entered through the preceding decision, then its marks
  are checked at their full size after enabling reduced motion.
- The design activity was checked for overflow and axe violations at 320, 390,
  768 and 1366 CSS pixels. None were observed in these exercised states. Desktop
  (1440×1000) and mobile (390×844) screenshots were inspected. The browser test
  retains screenshots in its ignored Playwright output directory.
- Formatting, `git diff --check` and the context audit passed. The context audit
  reports 48 review/authority warnings; no review baselines were advanced.

These checks establish local behavior for the authored sample and retained
application journeys. They do not establish new live model output, automatic
study-design selection for arbitrary papers, hosted delivery, learning benefit,
Safari/Firefox behavior, assistive-technology usability or physical-phone frame
rates. The new template's current integration is the sample quest.

## Desktop choice visibility follow-up · 21 October 2026

The reported results-screen defect was caused by a vertical chart/table/choices
stack. All authored visual questions now share the desktop visual/answer grid,
and chart data tables use a native disclosure. The narrower-screen flow retains
normal page scrolling and full-size reading controls.

- Root/web type checks, the frontend production build, formatting and
  `git diff --check` passed.
- The seven quest browser cases passed against the existing local preview using
  an isolated browser context, without restarting the user's server or modifying
  their browser session. The final two layout cases passed again after adding
  the tightest desktop breakpoint.
- The layout guard derives all 11 choice steps from the authored script and
  checks seven sizes: 1366×768, 1440×900, 1920×1080, 1280×720, 1024×768,
  1280×640 and 1000×640. It verifies zero page scrolling, no horizontal overflow,
  complete label rectangles above the action bar, at least 44px target height
  and pointer coverage, before and after Help opens. It also checks expanded
  variation controls. That covers 77 question/viewport combinations.
- The separate result-table case checks that opening the accessible table
  preserves the choices' vertical position and keeps them above the dock.
  Its screenshot was inspected, and axe found no violations in that state.

The geometry sweep uses reduced motion to measure settled layout. It does not
establish every possible window, zoom level or arbitrary generated-paper layout.
Native Safari/WebKit was not exercised in this pass; the installed Playwright
package's matching WebKit runtime was unavailable. No browser was installed.

## Results prediction and comparison · 21 October 2026

Local implementation on `marc`, uncommitted. Root/web type checks, frontend
production build, formatting and `git diff --check` passed. Six focused Chromium
cases passed against the existing preview: full authored quest with keyboard,
retry and resume; chart label stability; the 77-combination desktop layout sweep;
optional table layout; prediction/reveal persistence and feedback gating; and
prediction/comparison accessibility at 320, 390 and 768px widths.

The viewport sweep now measures both prediction choices and revealed assessment
choices, with Compare means and Help open. The results case checks that prediction
creates no answer record, shortcuts cannot submit hidden interpretations, numerical
marks/table remain absent before explicit reveal, reveal restores heading focus,
the worked calculation waits for feedback, and the next SD question still works.
Axe found no violations in the exercised prediction/comparison states. Screenshots
of the settled comparison and score-spread states were inspected locally. A final
focused rerun passed after isolating the SD marker class from error-message styles;
it measures both marker endpoints against mean ± SD and rejects inherited padding,
bottom margin and border rounding.

This is Chromium and the authored sample, with no inference requests or new
packages. Safari, real screen-reader use, physical-phone performance, arbitrary
paper generation, learning gains and hosted delivery are unverified.

## Three-paper activity pilot · 21 October 2026

Local, uncommitted work on `marc`. The authored `/activities` preview uses the
same renderer and scene projection as the learning workspace.

- Root/web type checks and the complete contracts/web/API build passed. Formatting,
  `git diff --check` and the context audit passed; the audit retains 51 review/authority
  warnings and no review baselines were advanced.
- All 21 Node tests and 215 research tests passed. Server-binding cases were
  rerun with the necessary local-server permission after sandbox `EPERM` failures.
- All 15 Chromium cases in `activity-pilot.spec.ts` and `research.spec.ts` passed
  using separate ports and a temporary test database. The first temporary-server
  run lacked its alternate frontend origin; configuring that test origin resolved
  the request rejection without changing application security behavior.
- The three pilot cases passed again against the existing preview after final
  copy/provenance and screenshot adjustments. No user browser state was modified.
- Desktop geometry covers all three papers at 1366×768, 1000×640 and 1440×900:
  three complete choices and their Check control remain in view, with 44px minimum
  targets and no horizontal overflow. Narrower layouts scroll naturally.
- Axe scans found no violations across the three activities at widths 320, 390,
  768 and 1366. Checks include prediction/reveal, original three-decimal means,
  feedback-gated difference, card inspection, pins, revision, independent notes,
  refresh, per-paper reset, focus and reduced motion. Pilot interactions issue no
  assessment POST requests and remain usable with API requests blocked.
- Full experiment/interview screenshots were inspected. The inherited container
  class collision was fixed by distinguishing `scene-kind-*` from inner diagram
  classes; the existing learning journey passed after that change.

These checks establish renderer reuse for three prepared source-backed cases.
Independent academic review, observed learning benefit, arbitrary-paper generation,
Safari/Firefox, real assistive-technology use, physical-phone frame rates and hosted
delivery remain unverified. The original local preview stays running.

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

## Paper workspace verification · 19 October 2026

Local implementation on `marc`, after transferring the five application files from
the OpenCode `dev` worktree at shared base `829e07f`. The source worktree and the
existing untracked feedback note were preserved. REA was already installed; this
pass changed no harness/skill configuration or dependency versions.

- `npm run check`: 21 Node/interface tests and 153 research tests in 20 files,
  plus both TypeScript checks and production builds, passed.
- `npm run build:vercel` passed; every asset referenced by the generated HTML
  exists in `public/`. This is local static preparation, not hosted function or
  production verification.
- Formatting and `git diff --check` passed. The context audit passed with 47
  warnings about unreviewed/uncommitted context and existing authority overlap;
  no baselines were advanced to conceal those warnings.
- All 41 Chromium scenarios passed across upload-home, research, final-polish,
  viewport-layout and reasoning-preview suites. The paper-context case additionally
  passed a final focused rerun after saved-motion preference assertions were added.
- The tests use the current scene radio/checkbox controls, including explicit
  comparison reveal, rather than the retired `.choice`/`.keycap` quiz markup.
  Full journey/retry/bonus/reveal/history, durable points, source boundaries,
  draft/revision recovery, genuine mobile touch, keyboard and reduced-motion checks
  remain exercised. Axe waits for finite entrance animations to settle.
- New component regressions cover saved reduced-motion changes/focus outside the
  research shell, request-error retry in the sample briefing, live uploaded-source
  separation, consent order, page navigation and pending controls. The connector
  regression checks the native browser receiver for animation scheduling/cleanup;
  the browser journey confirmed the former `Illegal invocation` crash is resolved.
- Separate browser inspection used real synthetic-PDF extraction and sample
  preparation at 1440, 1366, 768, 390 and 320 pixels. The live-processing layout used
  clearly synthetic responses at 1440, 768, 390 and 320 pixels: no browser errors,
  horizontal overflow or axe violations were observed in those fixture states.
  This verifies layout and controls, not real provider generation.
- A 60-frame desktop sample during repeated study-map selection recorded a maximum
  frame interval of 17.4 milliseconds and no intervals above 34 milliseconds on this
  machine. This small sample is not a cross-device performance guarantee.
- Preview servers used isolated ports 3003/5175 and a separate test database because
  the OpenCode worktree already owned 3001/5173. Temporary test configs were removed
  after checks. No existing preview process was stopped.

Local screenshots: [desktop home](ui/paper-workspace/home-desktop.png),
[mobile home](ui/paper-workspace/home-mobile.png),
[PDF review](ui/paper-workspace/pdf-review-desktop.png),
[paper context](ui/paper-workspace/paper-context-desktop.png), and
[live-layout fixture](ui/paper-workspace/live-source-fixture-mobile.png).
These are implementation evidence, not a separate design approval event.
The embedded browser PDF viewer was blank in headless Chromium; the labeled
open-original fallback and extraction/page-review path were exercised. Real
Nebius generation, hosted delivery, Safari/Firefox, assistive-technology sessions
and broad device performance were not verified in this pass.

## Paper context simplification and motion pass · 20 October 2026

Local implementation on `marc`, continuing the paper-workspace work. The REA MCP
server was registered for OpenCode during this pass (`rea-agents` 6.7.0, skill
v42, backup at `~/.config/opencode/opencode.jsonc.rea.backup`); its tools appear
only in a new session, so the reference measurements in
[INTERACTION_REFERENCES.md](INTERACTION_REFERENCES.md#20-october-2026-measured-motion-values-from-the-public-pages)
were taken with the same browser the REA browser route drives.

**Changed:** the interactive paper context now appears once per journey. The
upload flow keeps it at step 2, where the schematic and its reading share one
field on wide screens and stack below 900 CSS pixels. The investigation
briefing that follows carries a short recap and, for a prepared sample, a link
back to the map. The selected section now changes what the schematic
emphasises, and inactive parts keep their text contrast. Research surfaces
gained one shared entrance (10-pixel rise, 0.34s, 45ms stagger) and a 0.97
press response; investigation content keeps its stricter "no entrance for
restored work" rule. The curated home keeps its entrance in CSS — 10-pixel
rise, 0.42s, 60ms stagger — because it sits outside the research shell and its
interface test renders it without a browser. No server, generation, storage,
reward or provider contract changed.

**Verified locally:**

- `npm run typecheck` passed for the root and web workspaces.
- `npm test` (21 Node/interface tests) and `npm run test:research` (153 tests in
  20 files) passed.
- All 41 Chromium scenarios passed across upload-home, research, final-polish,
  viewport-layout and reasoning-preview. The paper-context case now asserts that
  the briefing shows the recap and no second map, and the accessibility audit
  waits for finite entrance animations to settle before auditing contrast.
- Measured in a real browser on this machine: the home entrance staggers as
  designed (kicker, heading, schematic and upload card each start at a different
  offset and settle at full opacity); a context tab change produced 26 distinct
  opacity frames over roughly 400ms while the schematic animated from 0.82 to
  1.0 opacity. A sweep of six screens found no element left invisible.
- One defect was found this way and fixed: a prop spread placed after the
  entrance animation replaced the tab row's `animate` target, so the four
  context buttons stayed at zero opacity. The change is covered by the browser
  assertions and by the invisible-content sweep.
- The interface test's DOM stub did not expose the `Element` and `SVGElement`
  constructors that Motion's browser-animation check reads, so an animated
  legacy screen ended with an unhandled rejection. The stub now exposes them,
  and the curated home's entrance was moved to CSS so the legacy shell does not
  depend on Motion's browser path at all.

**Not verified:** Safari, Firefox, real iOS/Android devices, assistive-technology
sessions, sustained frame-rate profiling, hosted delivery, and live Nebius
generation. The public reference pages were observed without logging in; their
authenticated lessons were not observed. Perceived smoothness and engagement
still need human review — passing interface checks do not establish them.

Local screenshots: [study map](ui/paper-workspace/paper-context-desktop.png) and
[study map on a phone](ui/paper-workspace/paper-context-mobile.png).

## Paper story refinement and contrast fix · 20 October 2026

Local pass on `marc`, uncommitted. It follows the paper-workspace work: the home
returns to the shipped composition, step 2 gains the authored citation, and the
four-tab context map becomes a four-chapter story.

**Changed:** `PaperStory.tsx` replaces the tabbed map on both entry points. One
persistent stage carries the question, the cohort, both conditions, the session
strip and the scope chips through four chapters; a chapter changes only
`transform` and `opacity`. The stage is decorative and `aria-hidden`; the caption
(kicker, mascot line, heading, one sentence, one disclosure) is the readable
record. "Your adventure is ready" chrome was removed from step 2 and from live
preparation, and `PaperIdentity` now shows the reference study's title, authors,
issue and DOI. The context still appears once per journey, and its numbers stay
outside the story region. No server, generation, storage or provider contract
changed.

**Verified locally:**

- `npm run typecheck` passed for the root and web workspaces.
- `npm test` (21 Node/interface tests) and `npm run test:research` (153 tests in
  20 files) passed.
- All 41 Chromium scenarios passed (2.3 minutes) across upload-home, research,
  final-polish, viewport-layout and reasoning-preview.
- The step-2 accessibility audit passes axe `color-contrast` again. The first run
  of this pass reported 46 failing stage nodes: a local probe against axe-core
  showed that fully transparent text is excluded from the rule while any partial
  opacity is measured, so the layouts now keep every present object at full
  opacity on a white card and take superseded objects fully out of the frame.
  Emphasis is carried by scale and position only.
- Chapter geometry was measured in a real browser at 1440 and 390 pixels for all
  four chapters: no object overlaps another and nothing is clipped by the stage.
  This check found a real defect — node boxes scaled around their own centre
  instead of the layout point, so every off-1x object drifted away from its grid
  coordinate. `transform-origin: 0 0` on the node fixed it, and the measured
  positions now match the declared grid.
- The narrow-screen route test opened "How Gradly works" after navigating away
  from the home, where that control is not in the accessibility tree at 320
  pixels; it now opens the dialog before navigating.

**Not verified:** hosted delivery, Safari, Firefox, real iOS/Android devices,
screen-reader sessions, sustained frame-rate profiling and live Nebius generation.
Perceived storytelling quality still needs human review; passing contrast and
layout checks do not establish it.

Local screenshots: [home](ui/paper-workspace/home-desktop.png),
[home on a phone](ui/paper-workspace/home-mobile.png),
[story](ui/paper-workspace/paper-context-desktop.png) and
[story on a phone](ui/paper-workspace/paper-context-mobile.png).

## Quest copy pass · 20 October 2026

Local pass on `marc`, uncommitted. Copy and labels only: no route, layout,
completion count, storage, extraction or generation behaviour changed.

**Changed:** the learner flow now uses one vocabulary (quest = the journey,
decision = one learner turn) instead of adventure, investigation, challenge,
checkpoint and quest. Buttons follow the authored reference: "Build my quest",
"Start quest", "Try another quest", "Give me a hint", "Save and exit quest",
"Restart quest". The completion recap derives "8 decisions · 1 bonus" from
`lesson.questions` (it previously claimed "Six completed checkpoints"), and step
2 states its provenance once instead of repeating "no AI calls" four times.

**Tests updated, not weakened,** where they asserted old labels: "Open paper
adventure", "Begin investigation", "Start investigation", "Finish adventure",
"Restart Adventure", "Resume investigation", "Save and exit investigation",
"Investigation complete", "Upload your Research Paper", the old provenance
sentence, the old history error text and the "Adventures" navigation link.

**Verified locally:**

- `npm run typecheck` passed for the root and web workspaces.
- `npm test` (21 Node/interface tests) and `npm run test:research` (154 tests in
  20 files) passed. One new test pins the featured quest at eight decisions plus
  one bonus, so the copied numbers and the data cannot drift apart silently.
- All 41 Chromium scenarios passed (2.4 minutes) after the copy changes.
- Step 2 re-measured in the browser: 245 → 208 visible words, "no AI" once,
  "of 5" once, and the duplicated action note gone.

**Not verified:** hosted delivery, screen readers, and whether the new wording
reads well to learners — that needs human review, not a passing suite.

## Source review simplification · 20 October 2026

Local pass on `marc`, uncommitted. Visual composition and copy only: upload,
extraction, consent, storage and generation behaviour are unchanged.

**Changed:** upload and review now share one 980px column. The review state drops
the mascot line, the header eyebrow/subtitle, the checked-document sentence, the
"Extracted text" label, the embedded-text meta line, the blank-preview help, and
the "Your next step" eyebrow/heading/paragraph. The action is one sentence, one
full-width button and the storage footnote, separated by a hairline instead of a
filled panel. The extracted text gains a bottom fade and padding so a scrolled
edge no longer looks like clipped text; the PDF frame requests `#view=FitH` and is
capped at 440px. The reference-study card is a single row with a short label
("Start a sample quest") that cannot wrap.

**Verified locally:** `npm run typecheck` passed; `npm test` (21) and
`npm run test:research` (154 tests in 20 files) passed; all 41 Chromium scenarios
passed (2.3 minutes). The review column measures 125 visible words at 1440px
(115 on a phone). Screenshots were checked at 1900, 1440 and 390 pixels.

**Tests updated:** the page-count assertion now reads the `.review-count` chip
("1 page") instead of the removed sentence, and the sample-preview honesty check
reads "Opens the authored sample study." instead of the removed paragraph.

**Not verified:** hosted delivery, Safari and Firefox (the `FitH` hint and the
mask fade are Chrome-verified only), real iOS/Android devices and screen readers.

## Intake flow consistency pass (issue 12) · 20 October 2026

Local implementation on `marc`, uncommitted. Scope: shared site chrome, immediate
PDF checking from home, preparation layout, failure recovery, study introduction
on the ready sample screen and the one-click handoff into the first decision.
See [intake notes](ui/INTAKE_PROCESSING.md).

**Verified locally (sample mode, `npm run dev:preview`, no API key):**

- `npm run typecheck`, `npm test` (21 passed), `npm run test:research` (154
  passed in 20 files) and `npm run build` passed.
- All 47 Chromium scenarios passed, including the new
  `tests/browser/intake-flow.spec.ts` (one-shell journey from home upload to the
  first decision with refresh during preparation, rejected file with prepared
  studies offered, interrupted check with retry, home sample entry opening the
  library) and the updated `preparation.spec.ts` (slow stage holds, failure
  stops and retries, refresh resumes, reduced motion, axe at 375/768/1366).
- Existing specs were updated only where behaviour intentionally changed:
  no "Check this document" step after choosing a file, shared header names,
  "Start the first challenge" replacing the briefing for prepared samples, and
  the curated DOI and home sample entry opening the library.
- Two defects were found and fixed during the pass: short header labels had no
  accessible name at narrow widths, and a reduced-motion preference saved in
  another tab did not reach the research shell's motion scope.

Not verified: live Nebius generation, structured failure reasons (pending the
proposal), hosted preview (#4), Safari/Firefox, and the embedded PDF viewer in
headless Chromium (blank there; the open-original link was exercised).

## Focus journey redesign · 20 October 2026

Local, uncommitted, on `marc`. Review, preparation, the new "Meet the study"
introduction and Play run in a lesson-style focus shell (see
[intake notes](ui/INTAKE_PROCESSING.md#focus-journey-second-pass-20-october-2026)).

**Verified locally (sample mode, `npm run dev:preview`):**

- `npm run typecheck`, `npm test` (21 passed), `npx vitest run` (154 passed in
  20 files), `npm run build` and `npm run context:check` (no errors).
- Full Chromium suite: 46 of 47 passed in one complete run. The remaining case,
  `final-polish.spec.ts` "unfinished choices and explanations survive help,
  refresh and exit", timed out once at its first response selection and then
  passed 3 of 3 when repeated alone. Treat it as intermittent, not resolved.
- Updated tests follow intended changes: the journey stepper replaces the site
  menu on focus screens, stage details sit behind "Details", ready samples pass
  through "Meet the study", the study-map story test runs on the classic route,
  and the review privacy note is checked at its new location at every width.
- Found and fixed during the pass: faint upcoming-step labels failed contrast;
  the focus bar overflowed at 375px; the mobile check bar wrapped one word per
  line; the brand link during Play went to history instead of home.
- Screenshots of every journey screen were reviewed at 1366 and 375 pixels,
  including the checking, failure and feedback states.

Not verified: live generation, hosted preview, Safari/Firefox, and perceived
smoothness on lower-powered devices.

## Texting quest and journey tests · 20 October 2026

The authored texting quest (`/meet/:id`) replaced the paper brief, and the
library's Start quest now opens it (see [intake notes](ui/INTAKE_PROCESSING.md)).

**Verified locally (sample mode, `npm run dev:preview`, Chromium):**

- `npm run check`: typecheck, 21 Node tests, 159 Vitest tests in 22 files, and
  production builds passed. `npm run context:check` passed with warnings for
  uncommitted affected changes.
- Full browser suite: 50 of 50 passed in one complete run. An earlier run had
  failures caused by the dev API restarting while `npm run check` rebuilt shared
  contracts at the same time; do not run both together against one dev server.
- After merging `main` (50 stored studies) into `marc`: `npm run check` passed
  (209 Vitest tests); the browser suite passed 49 of 50. "no-key sample flow is
  explicit, resumable and separate from uploaded evidence" failed once on a
  lingering `.feedback` element in the shared player, then passed 3 of 3 alone.
  Treat it as intermittent, not resolved.
- New: a keyboard-only quest run (Enter on story screens, letter and number keys,
  one retry, refresh resume, completion), with no horizontal scroll and axe
  passing at 375, 768 and 1366 px.
- Suites that cover the challenge player now open it through
  `tests/browser/journey-helpers.ts` (the same `start` request the app sends)
  instead of the library button. The library-start race test became a check
  that the library start sends no saved-session request. The briefing's Start
  quest gained a visible loading state, which the tactile test now covers.
- Found and fixed: a refresh reopened an answered quest decision as unanswered.

Not verified: live generation, hosted preview (#4), Safari/Firefox, and whether
the quest format can be driven by the scene contract (needs agreement with JC).

## Phone fit and keyboard pass · 21 October 2026

Local, uncommitted, on `marc` after `434a9d0`.

- **Phone fit:** at 375×812, the first answer started below the action bar on
  4 of 11 quest questions, and all answers fitted on 1. A phone-only compact
  layout (`quest.css`, `study-design.css`) now shows the first answer on 11 of 11
  and all answers on 5 of 11. The design tree keeps its row heights because its
  connecting lines are drawn for them. A new test in `intake-flow.spec.ts`
  checks every question; it fails on the previous CSS.
- **Prediction keys:** A/B/C and 1/2/3 now choose a prediction on the results
  step, with key badges like the other questions. `quest-motion.spec.ts` covers
  it; nothing is graded.
- **Copy:** the phone header shows the step name (the count is read by screen
  readers only), the library pill counts the quest's 10 decisions, and the
  activity pilot's first question is reworded.

Checks run: `npm run check` (21 Node, 215 Vitest in 23 files, builds) and the
full Chromium suite, 62 of 62, before the new phone test was added. The new
test was then run on its own and passed.
Not verified: Safari/Firefox, real devices, hosted preview.

## Activities, library and copy pass · 21 October 2026

Local on `marc`, after the phone-fit pass above.

- **Activities page** (`PaperActivityPilot.tsx`, `activity-pilot.css`) now uses
  the quest frame: three-step progress, a bottom check bar, Try again, Next paper
  and a summary. `activity-pilot.spec.ts` was updated (notes now sit in a
  disclosure, and a checked answer is locked until Try again), plus a new
  keyboard run to the summary with axe and Start over. The short 1000×640 window
  initially hid the last answer behind the bar by 30px; tighter spacing on
  short desktop windows fixed it.
- **Library** (`PathPicker.tsx`): one intro line, the two main paths, then a
  "More practice" row with the reasoning preview and the activities. The link
  names are unchanged for existing tests.
- **Quest copy:** "recorded lecture", "intervening task", "nine-item quiz" and
  "9 questions" could not be confirmed from public sources (the full text was
  unavailable), so the text now says "the same lecture" and "a quiz about the
  lecture". The reported F(1, 54) = 4.33 is kept from the team's quest script
  and still needs a check against the paper.
- **Hosted preview:** Vercel shows "Deployment was blocked" for every commit
  authored by `marcxxv` and success for JC's. That points to team access, not
  the build; it remains unverified.
