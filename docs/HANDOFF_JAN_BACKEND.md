# Handoff: backend issues #5–#9 and the stage-1 Nebius failure

Date: 2026-10-25 · Branch: `feat/jan-backend-resolution` · Base: `0658ab3` (PR #20, which contains PRs #17–#19, rebased onto `main` at `fc360c3`). All changes below are uncommitted. Nothing was pushed, deployed or changed on Vercel.

Supersedes the open blocker in [HANDOFF_ISSUE_6_MODEL_RESILIENCE.md](HANDOFF_ISSUE_6_MODEL_RESILIENCE.md).

## What changed

| Change                                                                                                                                                                               | Why                                                                       | Where                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| Verified Jan's committed tiering: Super is the default for both tiers, the pipeline gets 32,000 tokens/110 s, feedback 8,000/45 s, chosen by caller                                  | Handoff A1                                                                | `nebius-config.ts`, `provider.ts` (already in `0658ab3`) |
| Verified `ProviderError` codes `output_limit`/`timeout`, usage logging, and the empty-findings fallback                                                                              | Handoff A2/A3                                                             | `provider.ts`, `pipeline.ts` (already in `0658ab3`)      |
| Verified `propertyNames` stripping from the request schema                                                                                                                           | Stage-1 500 (evaluation guard 1)                                          | `provider.ts` (already in `0658ab3`)                     |
| A `paper.url` that fails URL validation becomes `null`; the wire schema still asks for a host                                                                                        | Live failure "paper.url: Invalid URL" (evaluation guard 2)                | `contracts.ts`                                           |
| Live drafts are capped at 3–8 challenges and must have a title and briefing, with a brief-fields directive                                                                           | Output-limit risk; one live draft returned an empty title and briefing    | `contracts.ts` (`generatedLessonSchema`), `pipeline.ts`  |
| Stage-1 references are limited to an enum of stage-0 ids; verified evidence is attached on the server and not re-emitted                                                             | Live failure "unknown evidence reference" at stage 4 (evaluation guard 4) | `pipeline.ts` (`lessonDraftSchema`)                      |
| Prompt asks for at least one written-reasoning challenge                                                                                                                             | Two live lessons had none, so feedback was unreachable on uploaded papers | `pipeline.ts`                                            |
| Feedback is rejected if it names the paper                                                                                                                                           | #7 "no paper identity leaks"                                              | `routes/feedback.ts`                                     |
| HTTP 529 is retried once like other transient errors                                                                                                                                 | Live Nebius 529 "System is overloaded" on feedback                        | `provider.ts`                                            |
| `diagnose:nebius` prints failing schema paths; `test:flow` stops on review instead of mislabelling later stages, and marks challenge 1 for written reasoning (logged as `[harness]`) | Diagnostics                                                               | `scripts/`                                               |
| `.env.example` no longer forces Ultra through `NEBIUS_MODEL_ID`                                                                                                                      | It overrode the Super default for both tiers                              | `.env.example`, docs                                     |

## Checks run in this worktree

| Command                                      | Result                                                                                 |
| -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `npm run typecheck` (inside `check`)         | pass                                                                                   |
| `npm run check`                              | exit 0: 21 original tests, 29 research files / 643 tests, production build             |
| `npm run test:e2e`                           | 74 passed (local, preview/sample mode, no model calls)                                 |
| `npm run build:vercel`                       | exit 0 (local Vercel asset preparation; not a hosted deployment)                       |
| `git diff --check`                           | clean                                                                                  |
| `npm run test:issue5`, `npm run test:issue6` | all PASS (local SQLite; #6 script uses a mocked provider)                              |
| `npm run context:check`                      | passed with 48 warnings (uncommitted affected changes; acknowledgement needs a commit) |

New tests: `provider.test.ts` (lesson-schema `propertyNames` stripping plus Zod still rejecting bad values, typed timeout with one retry and log line, 529 retry), `pipeline.test.ts` (`paper.url` coercion, challenge cap and directives, guard 4 enum and server-side evidence, `errorCode` persisted, exposed and cleared for both codes), `feedback-route.test.ts` (no paper identity or unrelated evidence in model input, an identity leak is rejected without saving). Caller-based limits and length-usage logging were already covered by Jan's tests.

## Live evidence (mocked results are separate, above)

Model `nvidia/nemotron-3-super-120b-a12b`, endpoint `https://api.tokenfactory.us-central1.nebius.com/v1`, stored paper `docs/research/papers/doyen-2012-behavioral-priming.pdf` (7 pages). Local process and local SQLite, not a hosted preview. Key passed per command, never stored.

`npm run diagnose:nebius` (evidence, then lesson stage):

| Run | Stage 0                                                  | Stage 1                                              | Outcome                                                                                                                     |
| --- | -------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | 19.1 s, 3,954 completion (3,587 reasoning), 9,948 prompt | 12.6 s, HTTP 200, 2,640 completion (1,249 reasoning) | Stage-1 500 gone. Schema mismatch. Ladder: full schema 500, without scenes 500, **without `record` OK**, without unions 500 |
| 2   | 8.8 s, 1,726 (1,641)                                     | 15.3 s, 2,986 (1,296)                                | `paper.url: Invalid URL`, fixed by coercion                                                                                 |
| 3   | 5.1 s, 1,276 (1,073)                                     | 9.8 s, 1,941 (1,056)                                 | Pass, 3 challenges, empty title/briefing, fixed by `min(1)`                                                                 |

`npm run test:flow` (6 stages, learner session, one feedback request, local server):

| Run | Outcome                                                                                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Stage 0 malformed JSON (not reproduced in later runs)                                                                                                                                                                                          |
| 2   | Stages 0–3 passed. Stage 4 "unknown evidence reference", fixed by guard 4                                                                                                                                                                      |
| 3   | `ready` (0 written-reasoning challenges). Feedback 400 because the harness used a non-reasoning challenge, fixed in harness                                                                                                                    |
| 4   | **`ready`, exit 0.** Stage 0 17.5 s. Stage 1 timed out at 110 s, the retry passed (143 s total, 2 requests). Stages 2–3 3.0/5.9 s. Live feedback round trip 4.2 s (category "Unable to Assess Reliably" for the harness's off-topic reasoning) |
| 5   | Stage 3 coach rejected with no issues → `review` (correctly blocked)                                                                                                                                                                           |
| 6   | **`ready`**, 1 written-reasoning challenge. Feedback got Nebius 529; reasoning was kept with the fallback notice. 529 retry added after this run, not live-verified                                                                            |

Across the 6 flow runs, 3 reached `ready` (runs 3, 4 and 6), and none of those lessons contained a scene. Live output varies between runs. Structure passing these checks is not proof of scientific correctness or learning benefit.

## Acceptance status

Status: **Done** (evidence given), **Needs hosted/live check** (exact action and owner), **Blocked** (reason).

### #5 Hosted persistence, extraction, guest isolation

| Item                                                                  | Status                                         | Evidence / action                                                                                                                                     |
| --------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hosted saved answers and job state survive a request and reload       | Needs hosted check                             | Local PASS in `test:issue5`. JC: deploy this revision with remote libSQL, then run `node verify-preview.mjs <preview-url>` and reload a saved session |
| Guest B cannot read or mutate Guest A's data                          | Done (local)                                   | `test:issue5`, `feedback-route.test.ts` IDOR test. Hosted repeat in JC's preview check                                                                |
| Searchable and scanned inputs, honest provenance                      | Done (local); hosted OCR packaging needs check | `test:issue5`: text method, OCR at 95% confidence, PDF bytes not stored. JC: upload one scan on the preview                                           |
| Invalid/stale requests keep saved work                                | Done                                           | `test:issue5` (409 stale, invalid file)                                                                                                               |
| Deletion removes document and linked sessions                         | Done                                           | `test:issue5`                                                                                                                                         |
| Retention removes only expired records and rejects unauthorized calls | Done (local); hosted cron needs JC             | `test:issue5`, `maintenance.test.ts`. JC: set `CRON_SECRET` and the cron in `RESEARCH_INTEGRATION.md`                                                 |
| Record revision, fixtures, results, limits                            | Done                                           | This document                                                                                                                                         |

### #6 Nebius adapter, structured output, failure handling

| Item                                                       | Status                             | Evidence / action                                                                              |
| ---------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| Intended-model success evidenced separately from mocks     | Done (local live); hosted needs JC | Live tables above. JC: repeat `test:flow` evidence on the preview                              |
| Malformed output, truncation, access errors, timeouts      | Done                               | `provider.test.ts`                                                                             |
| No raw provider response or secret in user-visible errors  | Done                               | `provider.test.ts` leakage test. Upstream bodies go to server logs only (300 characters)       |
| Failed inference keeps work, awards no progress            | Done                               | `pipeline.test.ts`, `pipeline-scene-integration.test.ts`, `feedback-route.test.ts`, live run 6 |
| Record revision, model, endpoint, duration, usage, retries | Done                               | Live section above                                                                             |

### #7 Grounded, revision-bound reasoning feedback

| Item                                                                            | Status             | Evidence / action                                                                                                                                                |
| ------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model gets permitted excerpts and readable option labels                        | Done               | `feedback-route.test.ts`                                                                                                                                         |
| Foreign session, stale version, changed challenge, superseded revision rejected | Done               | `feedback-route.test.ts`                                                                                                                                         |
| A revision during inference blocks the old result                               | Done               | `feedback-route.test.ts` concurrency test                                                                                                                        |
| No future finding, paper identity, answer key or unrelated evidence leaks       | Done, with a limit | Model input holds only the challenge's own excerpts and no paper metadata. A reply naming the paper is rejected. Code cannot detect a paraphrased future finding |
| Provider failure keeps reasoning, points and progression                        | Done               | `feedback-route.test.ts`, live run 6 (529)                                                                                                                       |
| Caller/contract checks pass, one real feedback request on JC's preview          | Needs hosted check | Local live request passed (run 4). JC: one feedback request on the preview                                                                                       |

### #8 Live paper generation with scenes

| Item                                                                                         | Status            | Evidence / action                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A real uploaded-paper job reaches `ready` with real model output                             | Done (local live) | Runs 4 and 6. Stages ran through `runStage`, not the HTTP job route, which is covered by mocked tests                                                                                       |
| A generated scene passes storage, projection and the featured renderer                       | Blocked           | None of the 3 live lessons that reached `ready` included a scene. Needs the scene-authoring owner to decide whether scenes are expected from live drafts, then a live run that produces one |
| Rejected review, malformed scene, unsupported version, provider failure have tested outcomes | Done              | `pipeline-scene-integration.test.ts`, `scenes.test.ts:109`, live run 5                                                                                                                      |
| Refresh/retry resumes without becoming a demo lesson                                         | Done              | `pipeline-scene-integration.test.ts`, `test:issue6`                                                                                                                                         |
| Record revision, model, durations, request counts, limits                                    | Done              | Live section above                                                                                                                                                                          |

### #9 Integrated preview and production handoff

| Item                                                                  | Status                       | Evidence / action                                                                                                                                                                            |
| --------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preview address, tested revision, config checklist, commands, results | Needs hosted check           | Commands and results above. Config names: [HANDOFF_ISSUE_1.md](HANDOFF_ISSUE_1.md), [RESEARCH_INTEGRATION.md](RESEARCH_INTEGRATION.md). JC deploys after this branch is committed and pushed |
| Local checks pass, hosted reported separately                         | Done (local); hosted pending | Checks table above                                                                                                                                                                           |
| Featured, uploaded and classic routes usable                          | Done (local)                 | `npm run check`, `test:e2e` 74 passed. Hosted pending                                                                                                                                        |
| Failures keep work, award no false points, reveal nothing hidden      | Done                         | Research tests listed above                                                                                                                                                                  |
| Vercel variables, deployments, logs, rollback assigned to JC          | Done                         | JC owns all hosted environment variables, deployments, log access and production rollback. Jan and agents prepare revisions only                                                             |
| Remaining limits explicit, no learning-outcome claim                  | Done                         | Limits below                                                                                                                                                                                 |

## Limits and follow-ups

- Stage 1 with thinking on can take more than 110 s, as in run 4. Two attempts fit the 230 s lease, but a slow retry fails as `timeout`. The evaluation suggests thinking off for stage 1 now that guard 4 is in place. That needs its own measured run.
- `errorCode` reaches the API payload, but the frontend doesn't read it yet (Marc's work). `apps/web/.../FailureRecovery.tsx` has its own set of reasons to reconcile first.
- A 0-issue rejection from a reviewer (run 5) blocks the lesson with "This lesson needs review." That is safe but unhelpful to learners.
- Several files Jan committed were already not Prettier-formatted (`routes/feedback.ts`, `scripts/*`, `tests/research/*`, some docs). They were left as-is to keep this diff scoped.
- Jan's root scratch scripts (`test-db.mjs`, `test-nebius.mjs`, `verify-preview.mjs`) contain no hardcoded secrets. They were left in place.

## Next actions

1. JC reviews the diff in this worktree, then commits and pushes (deferred by this task).
2. JC deploys the pushed revision to a preview with remote libSQL, `SESSION_SECRET`, `CRON_SECRET` and `NEBIUS_API_KEY`, and runs the hosted checks marked above.
3. The scene-authoring owner settles whether live drafts should produce scenes (#8 blocker).
