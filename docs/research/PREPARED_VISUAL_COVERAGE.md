# Prepared-study visual coverage — issue #32

Verified source baseline: `a112873` (PR #33). This separate branch adds scene data
without changing the 26 studies revised in PR #33. PR #33 was merged while this
work was underway; this branch is checked against the updated main and can target
main directly. The source baseline below preserves the before/after comparison.
Future changes still require a fresh conflict check.

## Scope and counts

The library has **53 studies and 313 required questions**. Optional bonuses are not
included in these counts. Forty source-backed scenes were added to the other 21
generated studies, reusing seven existing scene families and their existing controls.
No player, renderer, motion code, schema, pipeline prompt, provider or billing setting
was changed. Existing scene data and study text are preserved; source references are
only appended where a visual needs another already-stored excerpt.

| Measure                                 | Before (`a112873`) | After |
| --------------------------------------- | ------------------ | ----- |
| Required questions with a scene         | 77                 | 117   |
| Required questions without a scene      | 236                | 196   |
| Studies with no required-question scene | 18                 | 0     |

These are coverage counts, not learning-benefit scores. A diagram is not mandatory
on every question. Numerical plots use reported summary values, not invented raw
records or distributions. Optional predictions are unscored and use the existing
explicit-result reveal. Interpretive scaffolds are marked authored, and conclusions
or follow-up guidance are gated to resolution where appropriate.

The remaining generated questions still need their #31 content review. Adding a
visual does not approve their answer keys, repair unrelated question defects or
mark their cards `reviewed: true`. In particular, the known malformed question in
`recalling-personal-details` c2, the ambiguous factors in `imagining-survival-scenarios`
c1, and the over-strong conclusion in `anticipating-a-shock` c6 were not used to
invent new findings or silently rewritten in this scene-only pass.

## Eight priority studies

All eight proof-set studies already met the majority criterion at this branch's
baseline. They are retained unchanged; exercise-focus and sleep-school's earlier
numerical additions belong to PR #33.

| Study                  | Before | After |
| ---------------------- | ------ | ----- |
| texting-lecture        | 8/8    | 8/8   |
| stress-affirmation     | 4/7    | 4/7   |
| exercise-focus         | 5/6    | 5/6   |
| conformity-replication | 5/6    | 5/6   |
| breakfast-grades       | 6/6    | 6/6   |
| sleep-school           | 5/6    | 5/6   |
| basketball-maths       | 5/6    | 5/6   |
| learning-styles        | 5/6    | 5/6   |

## Additional source-backed scenes

Each count is required questions with a scene / required questions in the study.
The executable inventory is `tests/fixtures/prepared-visuals.ts`.

| Study                                 | Before | After | New scenes                         |
| ------------------------------------- | ------ | ----- | ---------------------------------- |
| anticipating-a-shock                  | 0/6    | 2/6   | c4 (`matrix`), c3 (`flow`)         |
| clinton-voter-activism                | 0/5    | 2/5   | c2 (`timeline`), c5 (`comparison`) |
| holding-a-warm-drink                  | 0/6    | 2/6   | c1 (`flow`), c6 (`matrix`)         |
| imagining-survival-scenarios          | 0/6    | 2/6   | c3 (`comparison`), c6 (`flow`)     |
| kids-eating-when-not-hungry           | 0/5    | 2/5   | c1 (`timeline`), c5 (`estimate`)   |
| memory-training                       | 0/6    | 2/6   | c1 (`flow`), c3 (`tests`)          |
| music-and-attention                   | 0/6    | 2/6   | c1 (`matrix`), c6 (`flow`)         |
| music-and-mood-perception             | 0/7    | 2/7   | c1 (`matrix`), c6 (`flow`)         |
| online-charity-giving                 | 0/6    | 2/6   | c1 (`matrix`), c6 (`flow`)         |
| parents-viewing-vaccine-safety-info   | 0/6    | 2/6   | c1 (`matrix`), c6 (`flow`)         |
| phone-use-while-driving               | 1/6    | 2/6   | c3 (`comparison`)                  |
| reading-words-aloud                   | 0/6    | 2/6   | c1 (`matrix`), c4 (`comparison`)   |
| recalling-personal-details            | 0/6    | 2/6   | c1 (`matrix`), c6 (`comparison`)   |
| sharing-money-in-public               | 0/6    | 2/6   | c2 (`flow`), c5 (`comparison`)     |
| stroop-task-performance               | 2/5    | 3/5   | c2 (`comparison`)                  |
| teen-social-media-use                 | 0/6    | 2/6   | c5 (`association`), c6 (`flow`)    |
| television-viewing-habits             | 0/5    | 2/5   | c1 (`flow`), c3 (`estimate`)       |
| understanding-how-pumps-work          | 0/6    | 2/6   | c4 (`comparison`), c5 (`flow`)     |
| using-scented-air-while-brainstorming | 0/6    | 2/6   | c1 (`matrix`), c6 (`matrix`)       |
| vaccine-misinformation-correction     | 1/5    | 3/5   | c3 (`comparison`), c5 (`flow`)     |
| walking-speed-test                    | 0/6    | 2/6   | c2 (`matrix`), c5 (`flow`)         |

Source excerpts remain in each study's `lesson.evidence`, with PDF page references
checked by `tests/research/prepared-studies.test.ts`. New numeric scene values are
checked against their cited excerpts using the same `sceneFaults` validator as live
lessons. Every existing question prompt, option, accepted key, explanation, excerpt,
metadata field and existing reference was compared with the baseline; only scene
objects and appended source references differ in the 21 study files.

## Production check — 27 October 2026

The public production config reported live AI and storage enabled, using
`nvidia/nemotron-3-super-120b-a12b`. Marc explicitly approved one upload of the stored,
public `harris-2013-goal-priming-failures.pdf`, and then one replacement check.
**Two generations total; no third run and no manual generation retry.** Both
completed all five stages. The first API test did not retain its guest access,
so it did not establish learner playback.

The replacement test used an isolated browser and retained only its own anonymous
test access outside Git. Its resulting lesson had three challenges. The initial
ready-to-player handoff showed the app's “Your study couldn’t load” fallback.
Reopening the **same saved session**, without another model call, loaded its intro
and first question. A visible `connections` scene titled “Connect the evidence”
rendered on the production question at 1366×768 and 375×812; the phone check had no
horizontal overflow. This confirms a scene in this generated production lesson,
not a scene on every question or an assessment of its teaching accuracy.

The transient first-handoff failure remains an unresolved observation; no cause or
production repair is claimed. The first run's advisory audits also flagged briefing
and hint leakage despite the job reaching ready. Those are separate player-reliability
and generated-content follow-ups, not reasons to change teammates' prompts here.

Local QA artifacts (ignored, not committed): `.data/visual-review/production-browser-result.json`,
`production-visible-scene-1366.png`, `production-visible-scene-375.png`, and runtime logs.
Guest access/state files stay local with mode 0600 and are never copied into docs or
published. The new prepared-study scenes themselves are not deployed by this check.

## Validation and delivery

- `npm run check` on the initial PR-33 baseline plus these additions: types,
  21 Node/interface tests, 748 research checks and builds pass. Final checks against
  the updated main are recorded in the PR body.
- New scene/source tests plus existing study checks: 420 pass.
- `tests/browser/prepared-visuals.spec.ts`: all 21 studies played through at
  375×812, 768×812 and 1366×768; new scene presence, result disclosure, answer feedback,
  horizontal overflow and axe before/after checks. Screenshots were visually inspected.
- Final browser, integration and publication results are recorded in the PR body.
- Original PR #33 files remain unchanged in this branch's diff. No merge, rebase of
  another branch, production configuration change, or issue closure is performed.

Remaining work is content-owner review, the observed initial production handoff failure,
and normal PR integration/deployment. Neither a successful local build nor the separate
production generation proves the new prepared scenes are already hosted.
