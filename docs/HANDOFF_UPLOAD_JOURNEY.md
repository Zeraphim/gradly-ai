# Handoff: upload waiting experience and uploaded-study player

Branch `feat/upload-journey`, based on `main` at `6e3d716`. The changes are local
and uncommitted. Nothing has been pushed, deployed or run against a live model.

The upload journey now has a waiting screen that feels alive without making
false claims. Progress moves only when a real stage finishes, each finished stage
gets a small celebration, a count-only preview builds up, and a warm-up keeps the
learner busy. A ready lesson now plays in Marc's prepared-study player, with the
server still checking every answer and providing AI feedback. The pattern choices
are recorded in [DESIGN.md](DESIGN.md#upload-waiting-and-uploaded-study-player).
Surface details are in
[INTAKE_PROCESSING.md](ui/INTAKE_PROCESSING.md#seventh-pass-25-october-2026-waiting-and-the-study-player)
and [PREPARED_STUDIES.md](ui/PREPARED_STUDIES.md#uploaded-papers).

## What changed

| Area              | Change                                                                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Preparation       | A stop pops and an "<agent> finished" chip appears when a stage finishes on this page. "Your study so far" chips show counts only. The warm-up has four cards plus a prediction. Slow-step copy appears at 30, 60 and 180 seconds. The ready hand-off shows the mascot, a burst and count tiles. |
| Recovery          | `FailureRecovery` reads the failed audit's `errorCode`. `timeout` and `output_limit` are retryable reasons with their own heading, a plain explanation and a "Technical detail" disclosure.                                                                                                      |
| Upload and resume | Drop lifts the icon and swaps its label. The extraction tick pops once. Home offers "Return to your paper" while a preparation is unfinished in this browser.                                                                                                                                    |
| Player            | `#/research/play/<sessionId>` renders `JourneyPlayer` with a server driver (`UploadedJourney.tsx`). It includes written reasoning and the AI coach (`ReasoningCoach.tsx`), and the reveal shows the learner's prediction. History links generated sessions there.                                |
| Marc's player     | Optional props only: `driver`, `closeHref`/`closeLabel`, `backHref`/`backLabel`/`busy`, `extra`/`actions`, `PreparedStudy.kicker`. `Burst` moved to `studies/Burst.tsx`. `/studies` behaviour is unchanged.                                                                                      |

## Backend changes and why each was needed

The goal limited backend changes to what was blocking. Each of these provides
something the browser cannot derive safely by itself:

| Code | Change                                                                      | Why it blocks without it                                                                                                                                                                                                       |
| ---- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| B1   | `publicJob().outline`: challenge, bonus and reasoning counts                | The "challenges drafted" preview needs the lesson's size. The only other source is parsing the stage summary text.                                                                                                             |
| B2   | `publicSession().study` from `study-card.ts`                                | The player needs a teaser, question, minutes, art group and topic. Hiding the paper's identity needs `lesson.paper`, which the browser must not receive before the reveal. Live generated titles often repeat the paper title. |
| B3   | `publicSession().takeaway` at the reveal only                               | The player's reveal has a takeaway line; it comes from the last interpretation (else results) explanation.                                                                                                                     |
| B4   | `publicSession().challenge.feedback.accepted`, same gate as the explanation | Marc's "best answer" tag after two misses (P7) needs the keyed answer, which is released only once the explanation is.                                                                                                         |
| B5   | `publicSession().lessonId`                                                  | The reveal finds the learner's prediction by the job's ID.                                                                                                                                                                     |

The answer keys still never reach the browser before a check. The upload player
works from the public session and not the whole lesson. Sending the whole lesson
would let the browser read results-stage scenes and evidence before the design
decisions, which the server's one-challenge-at-a-time gate prevents. Keep that
boundary if anyone proposes shipping the lesson so the adapter can work offline.

## Decisions for Marc to review

| Code | Decision                                                                                                                                                                                                                    |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1   | The `driver` seam on `JourneyPlayer`: checks, retries and steps go to the server, and the player keeps only the draft. Focus moves to feedback when the saved result arrives, and the dock shows "Checking…" while pending. |
| M2   | The intro's design-group chip reads "Your paper · AI-generated" for uploads. The inferred group and topic only choose the decorative art, so no design claim is shown.                                                      |
| M3   | Uploads show the study intro (the generated briefing) before the first challenge, so there is one screen between "Start your study" and the first decision. Issue 12's earlier hand-off went straight to the decision.      |
| M4   | Written reasoning and the AI coach sit under the answer choices, not in the dock, because coach replies can be several lines.                                                                                               |
| M5   | Reaching the reveal sends `finish` automatically so history marks the run complete. Replay starts a new server session; the finished one stays in history.                                                                  |
| M6   | `FailureRecovery` now owns the `errorCode` copy (it was earlier left to Marc). The five proposed reasons are unchanged.                                                                                                     |
| M7   | Copy: "Start your study" replaces "Open your investigation", and live jobs say "Your study is ready". Sample jobs keep their wording.                                                                                       |
| M8   | The four warm-up cards are authored, general research habits. They need the same content review as the prepared studies.                                                                                                    |
| M9   | The Prepare-step stepper in `FocusBar` still names the last step "Investigate". The uploaded player has its own chrome, so the stepper is not shown there.                                                                  |

## Open risks

| Code | Risk                                                                                                                                                                                                                                                                                                                                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1   | None of the three live lessons that reached `ready` had a scene (#8), so most uploaded challenges show plain choices. The fallback is tested with a scene-less challenge.                                                                                                                                                            |
| R2   | `LearningSession.title` is still the generated lesson title. History and the older `/adventure` player show it, and it may repeat the paper title. This existed before this change and was left in place.                                                                                                                            |
| R3   | Design and topic inference use keywords, so the decorative art can mismatch a paper.                                                                                                                                                                                                                                                 |
| R4   | The slow-step clock starts when this browser first sees a step running. A step that started before the page opened shows less time than it has really run.                                                                                                                                                                           |
| R5   | The browser drives stages, so leaving the page pauses preparation after the current stage. The home link brings the learner back, and the job resumes.                                                                                                                                                                               |
| R6   | Checked in headless Chromium only, with mocked jobs. No live model run, hosted preview, Safari, Firefox, real phone or screen-reader session.                                                                                                                                                                                        |
| R7   | The warm-up step, prediction and draft live in this browser only and are not synced across devices.                                                                                                                                                                                                                                  |
| R8   | The main clone has uncommitted files from 20 October, including `ResearchApp.tsx`, `scenes/flow-connectors.ts` and an untracked older copy of `studies/`. They predate `main`'s version of the player. Whoever owns them should rebase or discard them before merging, because `ResearchApp.tsx` and `studies/` overlap this branch. |
| R9   | The home link to an unfinished preparation is cleared when the job is ready or no longer loads (4xx). A job that keeps failing keeps the link until it becomes ready or is deleted.                                                                                                                                                  |

## Checks

| Check                                      | Result                                                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                        | Passed                                                                                                   |
| `npm run check`                            | Passed: 21 Node tests, 666 Vitest tests in 31 files, production build                                    |
| `npm run test:e2e`                         | Passed: 81 Chromium tests, including the 7 new ones                                                      |
| New unit and service tests                 | `tests/research/upload-journey.test.ts` (14), `tests/research/study-card.test.ts` (9)                    |
| New browser tests                          | `tests/browser/upload-journey.spec.ts` (7)                                                               |
| `npm run context:check`                    | Passed with warnings for uncommitted affected files                                                      |
| `npm run build:vercel`, `git diff --check` | Both passed                                                                                              |
| Screenshots                                | `.data/screenshots/upload-journey/` (gitignored), 375 and 1366 px for every waiting state and the player |

No billed live run was made. Every waiting state and the player were exercised
with mocked jobs and the real learning engine on a fixture lesson.

## Deferred

- Commit, pull request and merge (JC).
- Hosted preview check of the full upload flow with a live model (JC, Vercel and environment).
- Visual acceptance of the waiting screen and the uploaded-study player (JC and Marc).
- Content review of the warm-up cards.
- One live run on Super to confirm `outline` counts and the hand-off on a real job.
