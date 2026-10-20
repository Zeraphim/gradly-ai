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

| Where it fails                                    | Classification                                   | Offer                                                                     |
| ------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| Client checks, or the upload endpoint answers 4xx | File can't be used (the message names the limit) | Prepared studies or a different paper, as a choice                        |
| Network error, timeout, cancel, 5xx               | Interrupted                                      | Check again; file stays selected                                          |
| Failed or review job                              | Unclassified until a structured reason exists    | Retry this stage; prepared studies inside "Explore another study instead" |
| Unsupported link on home                          | Inaccessible link                                | Upload the PDF or view prepared studies                                   |

Classification uses where the failure happened, never the error wording. If a
job later carries `reason` (proposal below), `readFailureReason` uses it and
permanent reasons switch to the prepared-study choice.

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

## Proposal for Jan and JC — not yet agreed or implemented

`publicJob()` has error text but no structured failure category. Add a nullable
reason to failed jobs and upload error responses:
`inaccessible | invalid_file | unreadable_scan | not_applicable | temporary`,
with a safe explanation (missing evidence or the actual limit), persisted with
the document for history. Validation failures before a job exists need a
retention decision. Until agreed, "not applicable" pipeline failures can't be
told apart from temporary ones and both offer retry first.

Handoff today: `onStart(job.id)` → `start` with `lessonId` → `begin` →
`/adventure/:sessionId`. Agree with JC before replacing that boundary. Jake's
measured durations and size limits are still needed; no countdown, average
duration or tested size recommendation is shown.

## Local Evidence

Screenshots were reviewed during implementation at 375, 768 and 1366 px; they
are not stored in the repository. Browser checks:
`tests/browser/intake-flow.spec.ts` (including a keyboard-only quest run with
axe at 375/768/1366 px) and `tests/browser/preparation.spec.ts`. Suites that
cover the challenge player open it through `tests/browser/journey-helpers.ts`.

## Implementation References

- `apps/web/src/components/SiteChrome.tsx`, `site-chrome.css`
- `apps/web/src/research/UploadPage.tsx`, `useDocumentUpload.ts`
- `apps/web/src/research/ProcessingPage.tsx`, `PreparationTrack.tsx`,
  `preparation-track.css`, `FailureRecovery.tsx`, `IntakeSteps.tsx`
- `apps/web/src/research/TextingQuest.tsx`, `texting-quest.ts`,
  `quest-visuals.tsx`, `quest.css`
- `apps/web/src/research/ResearchApp.tsx` (`startFirstChallenge`, `/meet` route)
- `apps/web/src/LegacyApp.tsx` (home chrome and sample entry)

Verification is local sample mode only. No live generation or hosted preview
(#4) has been checked for this change.

## Related Decisions

- [REQUIREMENTS.md](../REQUIREMENTS.md), [DESIGN.md](../DESIGN.md#site-wide-motion-convention)

## Supersession

- Supersedes: None
- Superseded by: None
