# UI Evidence: Intake, review, preparation and player handoff

## Status

Proposed

## Owners

- Marc (@marcxxv), per [issue 12](https://github.com/Zeraphim/nebius-hackathon-submission/issues/12)

## Affected Surfaces

- Upload-first home (`#/`), source review (`#/research/upload`), preparation
  (`#/research/processing/:id`), failure recovery, and the handoff into the
  existing player (`#/research/adventure/:id`).
- Shared site header and footer on the home page and every research screen.

## Problem and Constraints

Issue 12 and its ownership comment take precedence over the supplementary quest
scripts. Marc owns upload, source review, consent, processing, recovery and the
player handoff. [Issue 14](https://github.com/Zeraphim/nebius-hackathon-submission/issues/14)
owns the study library, shared player and scene kit, so this work renders the
first challenge through that player instead of building a second challenge
screen. It does not change the scene contract, `contracts.ts` or pipeline prompts.

Before this change the journey switched site chrome after the home page, asked
for the same PDF twice, stacked preparation details around a mid-page button,
required a second "Start quest" on a briefing, and sent the home sample entry
to the retired classic quest instead of the prepared-study library.

The quest scripts support an evidence-grounded story and a clear separation
between learner recommendations and the actual study. Their always-visible
citation conflicts with the issues' final-reveal rule; the engine's reveal
boundary is preserved. Multi-study selection needs backend data not exposed
today, so intake does not fabricate it.

## Approved Direction

Not approved. Implemented direction:

**One shell.** `components/SiteChrome.tsx` renders the same header (Upload a
paper · Prepared studies · My quests · Glossary, settings, help) and footer on
the home page and every research route. `aria-current` marks the section; on
narrow screens labels shorten and the nav wraps to its own row.

**Flow.** Choose PDF on home → the file is checked immediately (`autoCheck` on
the upload draft) → "Check what we read": PDF beside extracted text, OCR pages
named → consent ("Confirm AI processing", or the labelled "Start sample
preview") → preparation → "Start the first challenge" → first decision. The
handoff calls `start` then `begin`, so preparation replaces the old briefing;
if `begin` fails the briefing still offers Start. Home "Try a sample paper" and
the curated DOI open the prepared-study library (`#/research/learn`).

**Preparation.** One card holds the document line (pages, OCR count, sample
chip), the five-stop track, the caption and the single next action. The
document moves between stops with the shared layout spring only when the saved
`stage` changes, and the rail fill follows it. While a stage runs, the paper
bobs and the current stop pings (transform/opacity only); these signal
activity, not progress, and stop under reduced motion. Stop labels and the
caption come from `audits[stage]`. Details (all stages, extracted text,
evidence) sit in one uniform group below the card.

**Recovery.** `FailureRecovery.tsx` is shared by intake and preparation.

| Where it fails                                    | Classification                                    | Offer                                                                     |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| Client checks, or the upload endpoint answers 4xx | File can't be used (the message names the limit)  | Prepared studies or a different paper, as a choice                        |
| Network error, timeout, cancel, 5xx               | Interrupted                                       | Check again; file stays selected                                          |
| Failed or review job                              | The failed stage's `errorCode`, else unclassified | Retry this stage; prepared studies inside "Explore another study instead" |
| Failed or review job with `not_applicable`        | The paper may not suit a lesson                   | Prepared studies shown openly; retry stays available                      |
| Unsupported link on home                          | Inaccessible link                                 | Upload the PDF or view prepared studies                                   |

Classification uses where the failure happened, never the error wording. A failed
stage's saved `errorCode` (`timeout`, `output_limit`, `not_applicable`) is read
first by `jobFailureReason`. The first two are retryable reasons with their own
heading and plain explanation, and the provider text moves into a "Technical
detail" disclosure. The server saves `not_applicable` when stage 0 reports missing
evidence (not retried automatically), when content checks fail through every
automatic retry, or when the final check rejects the lesson again after its
automatic redraft.
If a job later carries `reason` (proposal below), it is used next, and permanent
reasons switch to the prepared-study choice.

### Focus journey (second pass, 20 October 2026)

After review feedback that the screens were still cluttered, the paper journey
was rebuilt around a lesson-style focus shell (`FocusBar.tsx`, `journey.css`):

- **Focus bar.** Review, preparation, Meet the study and Play replace the site
  header and footer with a slim bar: brand, the Upload · Review · Prepare · Play
  stepper top-left (a compact "2/4 · Review" label on narrow screens), a sample
  chip, glossary and help icons, and exit. During Play the exit is "Save and exit
  quest" to history, replacing the player's second close button.
- **Review.** No outer card: one heading, a single file line (name, size, pages,
  status, Replace/Remove), the PDF and the extracted-text reader side by side,
  and a pinned action bar holding the consent copy, the always-visible privacy
  note and the one primary button. Checking is a centred scanning-paper state.
- **Prepare.** A centred loader: a paper whose lines fill as saved stages
  finish (a scan passes over it while a stage runs), five agent badges on a rail
  with a travelling paper token, and one caption (the running agent's task, or
  its summary when complete). Everything else sits behind one "Details"
  disclosure. Ready sample jobs offer "Meet the study"; live jobs open their
  generated briefing.
- **Study intro.** The shared intro (`StudyIntro` in `JourneyStages.tsx`) shows a
  briefing of up to 80 words whole, as every prepared study's is. A longer
  generated briefing, which can arrive as one block, shows a lead of whole
  sentences up to 60 words and folds the rest into a native "Read more
  background" disclosure (`studies/briefing.ts`), so "Begin study" stays in view.
  Added 27 October 2026 after a 250-word generated briefing pushed it off screen.
  Uploaded papers fold the whole briefing behind "Read the full briefing" under
  three tap steps (`studies/StudyOrientation.tsx`), with "Skip to study" in view
  on the first screen.
- **Meet the study** (`MeetTheStudy.tsx`, route `#/research/meet/:jobId`). Four
  parts with segmented progress: the question (animated lecture/phone
  illustration), divided attention (an interactive slider, labelled as an
  illustration, not data), four research words with plain definitions and
  everyday examples, and the mission. Authored from the texting quest script's
  introduction; it never shows design answers, findings or the paper's identity.
  Its last button starts the first challenge (`start` then `begin`).
- **Play.** Segmented decision progress, one guide line, a kicker with the
  stage and response type, one heading and prompt, the scene on a single soft
  surface (no card inside a card), borderless response tiles, and a check bar
  that turns green or orange and carries the short feedback message. Engine
  rules, scene components and reveal gates are unchanged. The player belongs to
  #14; Marc approved this restyle and JC still needs to be told so #14 builds on
  it rather than redoing it.

Third pass (same day): Play responses show letter keys (A, B, C) and accept
A–Z or 1–9 as shortcuts when no text field has focus; a link strip between the
study and the responses names the study parts the chosen response connects to
(from scene `targetIds`, never implying correctness); after checking, the chosen
tile turns green with a tick or orange; the guide pose reacts only to the checked
answer; "Use in my reasoning" renders as a chip. Review adds "Sections we
spotted", a local heading check (`paper-signals.ts`) labelled as a quick text
check, not an analysis, with a gentle prepared-study suggestion when fewer than
three sections appear; heading-like lines are emphasised in the text reader.
Pages no longer bounce past their edges (`overscroll-behavior-y: none`).

Fourth pass: Review was simplified after feedback that it felt too dense. It is
now one centred reading card with a "What we read / Original PDF" switch, the
file line carries Replace, Remove and Open original PDF, and the section check is
one sentence under the card instead of a row of chips.

Fifth pass: Upload → Prepare → Understand → Play.

- **Intake.** Home accepts a PDF or any link. The link field's placeholder and
  note say links are not fetched in this preview. A link becomes a small "link
  note" PDF (`link-note.ts`) stating it was noted but not fetched, so it uses the
  same saved preparation; the preparation screen labels it "Link · host · link
  noted, not fetched".
- **No review step from home in sample mode.** Sample mode calls no AI, so the
  consent review is skipped and the checked document goes straight to
  preparation. With live AI configured, the consent review still appears, as
  issue 12 requires. The review page stays reachable at `#/research/upload`.
- **Paper brief** (fifth pass) was replaced by the quest below and is no longer
  routed.

Sixth pass (current flow): Upload → Prepare → Investigate. Library entry:
Choose a study → Investigate.

- **Texting quest** (`TextingQuest.tsx`, script in `texting-quest.ts`, visuals in
  `quest-visuals.tsx`, styles in `quest.css`, route `#/research/meet/:id`). A
  teammate's step-by-step quest document replaced the long brief: two short story
  screens, then one decision per screen with its own small interactive visual,
  Duolingo/Brilliant style. Answers are checked in the browser against the
  document's answer key; no AI is called and the screen is labelled as a sample.
  A wrong answer gets one hint-led retry, then the explanation. The visual
  updates in place after an answer, so nothing is pushed below the fold.
- **Keyboard:** A/B/C or 1/2/3 choose, Enter checks, tries again and continues.
- **Resume:** progress is kept per tab (`sessionStorage`); a refresh reopens a
  resolved decision as resolved.
- **Completion** shows first-try score, the decision path and a review list, with
  Play again and Try another quest.
- **Paper facts** were checked against public sources (56 participants in
  Experiment 2, random assignment, 73.41% vs 83%, scripted texting). Recorded
  lecture, nine-item quiz, intervening task and the F value could not be
  confirmed without the full text.
- **Entry points:** the library's Start quest and a ready sample both open the
  quest. Live generated lessons still open the shared challenge player
  (`/adventure/:sessionId`), which remains reachable from history.
- **Limit:** the quest is authored for one paper. It is not yet driven by the
  scene contract, so it does not meet issue 12's "one renderer for curated and
  generated lessons" on its own; agree with JC (#14) whether the quest format
  becomes data in the shared player.

### Seventh pass (25 October 2026): waiting and the study player

Live preparation takes minutes, so the Prepare step now carries the patterns
recorded in [DESIGN.md](../DESIGN.md#upload-waiting-and-uploaded-study-player)
(U1–U8 adopted, X1–X7 rejected). Upload → Prepare → Play:

- **Drop and extract.** While a file is held over the upload area, the document
  icon lifts and becomes an upload arrow, and the size line reads "Drop it here and
  we'll check it right away". When text extraction finishes, the "Document
  checked" tick pops once.
- **Consent.** After "Confirm AI processing", the preparation track enters once.
  A reopened job starts settled.
- **Stages (U1, U2).** The rail still moves only with the saved `stage`. A stage
  finished on this page pops its stop and shows "<agent> finished" for about
  2.6 seconds, announced through the caption's live region.
- **Your study so far (U3).** Count-only chips from the saved job: evidence
  passages after stage 1, then "N challenges drafted + a bonus" and "N ask you to
  explain your thinking" from `publicJob().outline`, then methods checked and
  quotes matched. Only the next pending item shows, with a dashed border and a
  slow breath. The evidence analyst's summary is never shown here because it
  states the paper's findings.
- **Warm-up (U4, U5).** Four authored cards and an optional prediction sit below
  the track while a stage runs, labelled "Warm-up · not scored". The current card
  is kept per tab and the prediction per job in this browser. It hides when
  preparation pauses or finishes.
- **Slow steps.** After 30 seconds on one step the caption shows "On this step for
  m:ss", measured in this browser since the step was first seen and kept across a
  reload. After 60 seconds it explains that long papers take minutes, that Gradly
  retries once by itself and that leaving is safe. After 180 seconds it says the
  step will finish, start again by itself, or offer a retry. It never estimates time remaining.
- **Leaving and returning.** An unfinished preparation is remembered in this
  browser, and the home page offers "Return to your paper". Reopening the job
  resumes from its saved state, without replaying celebrations.
- **Ready (U6, U7).** Live jobs show the celebrating mascot, the single burst and
  tiles (challenges, bonus, evidence passages, reasoning prompts), then one
  "Start your study" action. Sample jobs keep "Start the quest".
- **Play.** "Start your study" starts a session and opens
  `#/research/play/<sessionId>`, the prepared-study player driven by the saved
  session (see [PREPARED_STUDIES.md](PREPARED_STUDIES.md#uploaded-papers)).
  History links generated sessions there; older `/adventure/:id` links still work.

Reference evidence: Brilliant's public onboarding (`/welcome/`) uses the same
lesson shell. Measured in headless Chromium: screen swaps complete in under
0.1s, progress width transitions over 0.2s `ease`, a choice press animates
`transform`/`box-shadow` over 0.1s `ease-out`, and content fades in over 0.5s
`ease-out`. Gradly's own timings stay in `sceneTiming`; no asset or code was
copied. REA was not needed: its tooling targets shipped binaries and bundles,
and a live browser gives the direct evidence for a web interface.

## Required States

- Ideal: review, preparing at each stage, ready, first challenge.
- Loading: checking (upload percentage, then extraction), loading saved job.
- Empty: no file on the review route shows the dropzone and reference study.
- Error and recovery: rejected file, interrupted check, failed stage, review
  status, unsupported link, history keeps a failed job with its saved error.
- Disabled or unavailable: live AI unconfigured and no sample mode offers the
  reference investigation; sample mode is labelled as an authored study.
- Restore: refresh resumes preparation from the saved job without replaying.
- Waiting: slow step (30, 60 and 180 seconds), warm-up card and prediction,
  stage finished while open, ready hand-off.

## Proposal for Jan and JC — not yet agreed or implemented

`publicJob()` has error text but no structured failure category. Add a nullable
reason to failed jobs and upload error responses:
`inaccessible | invalid_file | unreadable_scan | not_applicable | temporary`,
with a safe explanation (missing evidence or the actual limit), persisted with
the document for history. Validation failures before a job exists need a
retention decision.

The stage codes `timeout` and `output_limit` from #6, and `not_applicable`, are now
read from the failed audit; the other four proposed reasons remain unsent by the
server.

Handoff for live jobs (seventh pass): `onStart(job.id)` → `start` with `lessonId`
→ `#/research/play/:sessionId`, where the study intro's Begin calls `begin`. The
featured quest still opens `/adventure/:sessionId`. Jake's
measured durations and size limits are still needed; no countdown, average
duration or tested size recommendation is shown.

## Local Evidence

Screenshots were reviewed during implementation at 375, 768 and 1366 px; they
are not stored in the repository. Browser checks:
`tests/browser/intake-flow.spec.ts` (including a keyboard-only quest run with
axe at 375/768/1366 px) and `tests/browser/preparation.spec.ts`. Suites that
cover the challenge player open it through `tests/browser/journey-helpers.ts`.

### Verification history

Local results on the `marc` branch, in sample mode with Chromium and no model key.
None of these passes verified live Nebius generation, hosted delivery,
Safari/Firefox, real phones or screen-reader use. Durable suite coverage and
limits are in [TESTING.md](../TESTING.md).

- **19 October 2026, paper workspace.** `npm run check` (21 Node, 153 research
  tests), `npm run build:vercel` and 41 Chromium scenarios passed. Synthetic-PDF
  and fixture layouts at 320 to 1440 pixels showed no browser errors, overflow or
  axe violations. A 60-frame desktop sample peaked at a 17.4 ms frame interval on
  one machine, which is not a cross-device guarantee. The headless PDF viewer was
  blank; the open-original fallback was exercised. Screenshots:
  [desktop home](paper-workspace/home-desktop.png),
  [mobile home](paper-workspace/home-mobile.png),
  [PDF review](paper-workspace/pdf-review-desktop.png),
  [paper context](paper-workspace/paper-context-desktop.png) and
  [live-layout fixture](paper-workspace/live-source-fixture-mobile.png).
- **20 October 2026, paper context and motion.** The context map appears once per
  journey, and research surfaces share one entrance. 41 Chromium scenarios passed.
  Browser measurement found and fixed a prop spread that left the context tabs
  at zero opacity. Screenshots: [study map](paper-workspace/paper-context-desktop.png)
  and [study map on a phone](paper-workspace/paper-context-mobile.png).
- **20 October 2026, paper story and contrast.** `PaperStory.tsx` replaced the
  tabbed map. Axe `color-contrast` passed again after partially faded stage nodes
  were removed. Chapter geometry measured at 1440 and 390 pixels showed no
  overlap or clipping after the `transform-origin: 0 0` fix.
- **20 October 2026, quest copy and source review.** Copy moved to one
  vocabulary (quest and decision), and step-2 visible copy fell from 245 to 208
  words. Upload and review share one 980px column. 41 Chromium scenarios passed
  after each pass, with tests updated only for changed labels.
- **20 October 2026, intake flow (issue 12).** 47 Chromium scenarios passed,
  including new `intake-flow.spec.ts` and updated `preparation.spec.ts`. Missing
  accessible names on short header labels and a cross-tab reduced-motion gap were
  fixed.
- **20 October 2026, focus journey.** 46 of 47 Chromium cases passed in one run.
  The `final-polish.spec.ts` draft-recovery case timed out once, then passed 3 of
  3 alone. Contrast of upcoming step labels and narrow-screen overflow were fixed.
- **20 October 2026, texting quest.** 50 of 50 Chromium cases passed. After
  merging `main`, 49 of 50 passed, and the no-key sample flow case then passed 3
  of 3 alone. A refresh reopening an answered decision as unanswered was fixed.
- **21 October 2026, quest motion and study-design activity.** `npm run check`
  (21 Node, 209 research tests) and 55 Chromium scenarios passed. The design
  activity showed no overflow or axe violations at 320, 390, 768 and 1366 pixels.
- **21 October 2026, desktop choice visibility.** The 77 question and viewport
  combinations and the optional result table case passed. WebKit was not run.
- **21 October 2026, results prediction.** Six focused Chromium cases passed,
  including prediction and comparison axe checks at 320, 390 and 768 pixels.
- **21 October 2026, three-paper activity pilot.** 21 Node and 215 research
  tests and 15 Chromium cases passed. Fixing a `scene-flow` class collision did
  not break the existing learning journey.
- **21 October 2026, phone fit and activities.** At 375×812 the first answer is
  above the action bar on 11 of 11 quest questions (previously 7 of 11). 62 of
  62 Chromium cases passed before the phone test was added, which then passed
  alone. The activities page adopted the quest frame. Vercel blocked deployments
  for commits authored by `marcxxv` while JC's succeeded, which points to team
  access, so the hosted preview remains unverified.

## Implementation References

- `apps/web/src/components/SiteChrome.tsx`, `site-chrome.css`
- `apps/web/src/research/UploadPage.tsx`, `useDocumentUpload.ts`
- `apps/web/src/research/ProcessingPage.tsx`, `PreparationTrack.tsx`,
  `preparation-track.css`, `FailureRecovery.tsx`, `IntakeSteps.tsx`
- `apps/web/src/research/TextingQuest.tsx`, `texting-quest.ts`,
  `quest-visuals.tsx`, `quest.css`
- `apps/web/src/research/ResearchApp.tsx` (`startFirstChallenge`, `/meet` and
  `/play` routes)
- `apps/web/src/research/PreparationOutline.tsx`, `PreparationWarmup.tsx`,
  `warmup.ts`, `ReadyHandoff.tsx`, `studies/Burst.tsx`
- `apps/web/src/research/studies/UploadedJourney.tsx`, `uploaded.ts`,
  `ReasoningCoach.tsx`, `uploaded-journey.css`
- `apps/api/src/research/study-card.ts`; `publicJob().outline` and
  `publicSession()` `study`, `takeaway`, `lessonId` and `feedback.accepted`
- `apps/web/src/LegacyApp.tsx` (home chrome and sample entry)

Verification is local sample mode only. No live generation or hosted preview
(#4) has been checked for this change. The seventh pass was checked with mocked
live jobs and the real learning engine on a fixture lesson
(`tests/browser/upload-journey.spec.ts`, `tests/research/upload-journey.test.ts`,
`tests/research/study-card.test.ts`). Screenshots of every waiting state at 375
and 1366 pixels were reviewed locally and are not stored in the repository.

## Related Decisions

- [REQUIREMENTS.md](../REQUIREMENTS.md), [DESIGN.md](../DESIGN.md#site-wide-motion-convention)

## Supersession

- Supersedes: None
- Superseded by: None
