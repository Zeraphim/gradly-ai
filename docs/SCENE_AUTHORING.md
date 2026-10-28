# Reusable research scenes

Scenes are versioned, data-only visuals in one shared contract. Prepared studies,
generated lessons and uploaded papers use the same ten families. The study player
(`apps/web/src/research/studies/scenes/StudySceneView.tsx`) renders all ten. The
Fresh Adventure workspace renderer (`InvestigationScene`) draws the first four and
falls back to plain choices for the rest. The featured texting investigation uses
those four across eight required challenges and a bonus. Challenges without a scene
keep the original choice interface.

## Choose a scene

| Kind          | Teaching task                                                | Required support                                                        | Avoid                                                                            |
| ------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `flow`        | Trace a process or branching research design                 | Supported nodes and labeled relationships                               | Invented mechanisms, pairing or participant records                              |
| `connections` | Assemble evidence, select methods, connect a claim           | Evidence anchors and candidate response mappings                        | Treating an interpretation as uniquely correct without support                   |
| `comparison`  | Inspect reported numerical measurements on a shared scale    | Values, units, scale and references for each measurement                | Invented raw data, distributions or causal effects                               |
| `designs`     | Compare group formation or evidence-gathering processes      | At least two supported steps per panel                                  | Suggesting equivalent participants or identical procedures without evidence      |
| `timeline`    | Order waves or events and show attrition                     | Reported `when` labels and optional reported n                          | Implying causal order from timing alone                                          |
| `association` | Judge strength versus significance or causation              | A reported r, β or OR, exactly as stated, optional n                    | Deriving coefficients the paper does not state                                   |
| `estimate`    | Read precision, null and equivalence results                 | Reported estimates with interval bounds on one scale                    | Treating a nonsignificant interval as evidence of no effect                      |
| `tests`       | Weigh multiple comparisons and marginal results              | Every reported p in the family and the threshold α                      | Listing only the significant tests                                               |
| `units`       | Compare what was assigned or sampled with what was counted   | Reported counts per level and a role for each                           | Treating nested records as independent participants                              |
| `matrix`      | Spot what else differs between conditions                    | One short, supported cell per condition and feature                     | Inventing features the method does not describe                                  |
| `ladder`      | Judge how far a claim may go: overreach, causation, scope    | Claims worded as claims, modest to strong; reach at resolution          | Wording a rung as what the study found, or marking the answer before it is given |
| `sort`        | Sort statements into two or three bins before answering      | Short neutral cards; placements at resolution                           | Card details that judge a statement, or bins named for the answer                |
| `spot`        | Find the step of a procedure or argument a decision turns on | Consecutive passages retelling the cited method, read as numbered lines | Passages that add steps the paper does not describe                              |

A paper need not use every family. When no honest visual fits a challenge, the
server's evidence scene stands in, and a generated lesson needs a valid scene on
at least 90% of its required challenges (see
[Required scenes and response styles](#required-scenes-and-response-styles)). For
qualitative work, prefer processes, accounts and bounded interpretations. Themes do
not establish prevalence. A conceptual argument is not an observed mechanism.

## Required scenes and response styles

The Lesson Architect no longer drafts scenes. The Scene Designer stage
(`apps/api/src/research/scene-stage.ts`) drafts one per challenge, in parallel,
from the challenge's prompt, hint, options and the excerpts it cites. A
design-stage challenge sees no results-side excerpt, and no call sees the answer
key. Each call may use only its position's kind set (`sceneKindSets`), minus kinds
a kept neighbouring scene uses, so neighbours never repeat a kind.

Each draft is settled without a model call. Responses are matched to the options,
unknown targets and references dropped, the resolution removed and a ladder reach
that marks only a wrong option dropped. An instruction that says how to answer or
names another kind's controls takes the kind's default, a source note naming
evidence ids takes a plain one, trailing JSON debris is trimmed from bin labels,
and an unusable `tap` or `pills` style turns into cards. The draft must then pass
`stageSceneProblems`: the shared validation, no results-side reference on a
design question, no accepted option quoted in setup text that the prompt and
evidence lines do not already quote, no repeated element and no garbled or
meta text. A failing draft is redrafted with its problems listed. A "Scene Leak
Check" call then reads every written scene beside the answer key and the
evidence lines the learner already reads. A flagged scene is redrafted once with
the reason, while the budget allows, and checked again. Whatever still fails
gets the server-built evidence scene: the challenge's cited excerpts as anchors
with one response per option, titled "Connect the evidence" (`isEvidenceScene`).
A prepared challenge that cites no excerpt shows its evidence lines instead,
marked as the lesson's summary. It is the same for any challenge, so the no-repeat rule exempts it.

`sceneCoverageProblems` in `apps/api/src/research/contracts.ts` requires a valid
scene on at least 90% of required challenges (`SCENE_COVERAGE`), and
`verifyLesson` repeats the check for generated lessons. Demo and featured lessons
are exempt. The Methods Reviewer and Learning Coach may list leaking scenes in
`rejectedScenes`, which are replaced with the evidence scene.

Prepared studies get the same stage once through
`npm run define:scenes` (dev-only, billed). It drafts scenes only for
challenges without an authored one and saves them to
`apps/web/src/research/studies/data/scenes/<slug>.ts`, which `catalog.loadStudy`
merges. `--fill` redrafts only the evidence scenes the stage stood in with,
`settle` reapplies the model-free repairs and `coverage` prints the share of
challenges with a scene per study. Scenes replaced after a human read are listed with reasons in
`scripts/prepared-scene-review.ts`.

`responseStyle` is optional on every challenge: `cards` (default), `pills` for
short labels, or `tap`. `tap` needs a `flow`, `designs`, `timeline`, `tests`,
`units`, `matrix`, `ladder` or `spot` scene whose responses each target exactly one distinct element
that is visible before the first attempt. `tapTargets` in the contract package is
the single rule. The server rejects anything else in `responseStyleProblems`, and
the player falls back to cards if a stored scene stops qualifying. The public
challenge carries `responseStyle`, and `studies/uploaded.ts` passes it to the
player.

Every number on a `reported` element (comparison value, timeline n, association
value and n, estimate value and bounds, tests p, units count) must appear in that
element's referenced excerpts. `numbersIn` reads thousands separators, leading-dot
decimals (`p = .04`) and typographic minus signs as printed. Derived elements, such
as interval midpoints, say so in their provenance note. The renderers add only
labelled derived teaching values after an attempt: r², tests × α, and the ratio
between unit levels.

## Authored sample results interaction

`TextingQuest.tsx` retains the sample's reported mean/SD chart and adds an ungraded
prediction before explicit reveal. Its session-bound `exploration` stores only the
prediction and reveal state, independently of assessed answer records. The existing
feedback still gates the worked difference. Compare means is a local geometric
bracket and prompt; the following variation decision reveals summary SD bars.
This is authored browser content, not a new generated scene schema, raw score data,
or a relaxation of the server release gates below.

## Contract and boundaries

The authored sample's study-design activity also uses
`apps/web/src/research/scenes/StudyDesignVisual.tsx`. It accepts a bounded grouping
rule, group labels, outcome and description from `quest-visuals.tsx`, retains the
same diagram across choices and resolves active paths immediately for reduced
motion. Its source procedure summary is supplied only after the sample decision is
resolved. The diagram has a textual equivalent and is explicitly schematic.
This is a reusable presentation pilot, **not** a `sceneSchema` family or an
automatic template-selection feature for generated papers. The shared scene
contract and its evidence gates below remain the authority for generation.

`packages/contracts/src/scenes.ts` exports `sceneSchema`, `Scene`, `sceneProblems`
and `projectScene`. `apps/api/src/research/contracts.ts` adds optional `scene` to
research challenges. A scene is serializable data, not generated application code.

All elements have bounded identifiers, labels, details, provenance and an `at` gate.
Flow nodes can specify `column` to express parallel branches. Responses map each
challenge option exactly once through `optionId`; `targetIds` identify the evidence
or process elements a learner is connecting. Connections convey a proposed response,
not correctness. Actual assessment remains in the existing server answer guide.

Provenance has `kind`, `refs`, and `note`. Use `source-summary` for paraphrases,
`reported` for source measurements, `derived` for supported calculations,
`illustration` for conceptual teaching shapes, and `authored` for teaching guidance.
Source-based elements require references. The featured reference summaries remain
summaries, not newly verified verbatim excerpts. All content renders as escaped React
text; the strict schema accepts no scripts, styling or arbitrary markup fields.

The gates are:

- `setup`: available with the current challenge before submission.
- `feedback`: available with feedback after a submitted attempt.
- `resolution`: available only with the full explanation after a correct answer or
  a second attempt. An optional `resolution` element must use this gate.

`publicSession` calls `projectScene` before serializing a response. Hidden elements,
relationships and response target identifiers are removed. Retry suppresses feedback
content again. Paper identity still follows the existing final-reveal boundary.
Unknown versions or unsafe stored scenes fall back to the legacy choice interface.
Malformed model output fails generation explicitly, while reference/relationship
errors prevent the lesson from passing final verification.

A gate applies to its element, not to surrounding metadata. Authors and reviewers
must also inspect scene titles, instructions, provenance notes and response labels
for answer or findings leakage. Structural validation cannot prove semantic truth.

## One challenge from generation to submission

The following is an **authored contract example**, not a real study. It can sit within
a generated lesson containing at least three challenges. Its lesson evidence contains
`{"id":"method","page":1,"excerpt":"The authored example uses interviews to explore commuters’ accounts of navigating a station."}`.

```json
{
  "id": "inquiry-method",
  "stage": "Research approach",
  "title": "Connect the inquiry to the evidence",
  "type": "single",
  "prompt": "Which approach fits exploring commuters’ experiences?",
  "evidence": [
    "Interviews explore commuters’ accounts of navigating a station."
  ],
  "options": [
    { "id": "accounts", "text": "Explore experiences through interviews." },
    {
      "id": "frequency",
      "text": "Estimate population frequencies from these accounts alone."
    }
  ],
  "accepted": ["accounts"],
  "alternatives": [],
  "hint": "Consider the kind of understanding the inquiry seeks.",
  "misconceptions": {
    "frequency": "These accounts do not estimate population frequencies."
  },
  "explanation": "Interviews can explore accounts of experience without establishing population prevalence.",
  "refs": ["method"],
  "writtenReasoning": true,
  "reveal": "design",
  "scene": {
    "version": 1,
    "kind": "connections",
    "title": "What kind of evidence fits?",
    "instruction": "Inspect the inquiry, then connect a response.",
    "description": "An experience-focused inquiry connected to two candidate approaches.",
    "provenance": {
      "kind": "authored",
      "refs": ["method"],
      "note": "Authored contract example, not a real paper."
    },
    "actionLabel": "Connect an approach",
    "anchors": [
      {
        "id": "inquiry",
        "label": "Understand commuters’ experiences",
        "detail": "The question concerns accounts of navigating a station.",
        "at": "setup",
        "provenance": {
          "kind": "source-summary",
          "refs": ["method"],
          "note": "Paraphrase of the authored evidence."
        }
      }
    ],
    "responses": [
      {
        "optionId": "accounts",
        "label": "Explore accounts",
        "targetIds": ["inquiry"]
      },
      {
        "optionId": "frequency",
        "label": "Estimate prevalence",
        "targetIds": ["inquiry"]
      }
    ],
    "resolution": {
      "id": "inquiry-resolution",
      "label": "Match the approach to the question",
      "detail": "Accounts can explain experience without estimating prevalence.",
      "at": "resolution",
      "provenance": {
        "kind": "authored",
        "refs": ["method"],
        "note": "Authored methods guidance."
      }
    }
  }
}
```

1. The Lesson Architect drafts the challenge and the Scene Designer drafts its
   scene from `challengeSceneInstructions`. A backend developer adds no new route
   for this paper.
2. The existing provider parses the result. The methods and learning reviewers
   inspect scenes as well as the lesson text. Final verification checks source
   excerpts, reference membership, response mappings, scale validity and reported
   numerical values against referenced evidence. Numerical matching alone does not
   establish that a value was assigned the correct meaning or units.
3. The ready lesson is stored inside the existing job record. Start it with
   `POST /api/research/learning` using `{"action":"start","lessonId":"<job-id>"}`,
   then send `begin` with the returned session identifier and current version.
4. The public challenge includes the scene but `resolution` is `null`. It does not
   include `accepted`, `alternatives`, or `misconceptions`.
5. `InvestigationScene` renders the evidence anchor and response connections. A
   selected response calls the same selection handler as the old radio controls.
6. Submit `{"action":"submit","id":"<session-id>","version":1,
"selected":["accounts"],"reasoning":"The inquiry asks about experience."}`.
   Always use the actual returned version rather than this example's `1`.
7. The existing server guide assesses `accounts`. A matching response unlocks the
   resolution and awards the existing once-per-solved-challenge practice points.
   A first miss receives feedback and a retry without the full resolution.

Complete, materially different three-challenge lessons are executable in
`tests/research/fixtures/scene-lessons.ts`: an authored observational water-use
survey with three district means and an authored qualitative station inquiry.
`scenes.test.ts` passes them through mocked generation, reviews, verification,
projection and learning transitions. These fixtures do not prove live model quality.

## Exploration, state and recovery

Inspecting nodes, pinning evidence, and making a prediction are exploratory. They
never submit, advance a lesson or award points. They use optional bounded fields in
the existing tab draft, tied to session identifier, saved version and challenge.
They survive failed saves and are carried forward when a submission or retry returns
the same challenge. Server-saved submitted answers remain authoritative.

For comparisons, an explicit reveal opens the already-permitted results. A prediction
remains visible and locks after reveal. The server still controls which values are
permitted for that challenge. The browser cover is an interaction affordance, not a
security boundary. The difference label waits for server feedback, even if someone
could calculate it from the means themselves.

## Motion and accessibility

Motion 14.3 supports this project's React 19 through its published peer range.
The [installation documentation](https://motion.dev/docs/react-installation) covers
React and Vite support. [Reduced-motion guidance](https://motion.dev/docs/react-accessibility)
informs the combined operating-system and saved-app preference.

The shared `apps/web/src/research/scenes/scene-motion.tsx` owns Motion's
layout-capable `domMax` features through scoped `LazyMotion`, identity-scoped layout
groups, timing and gestures. Nested scenes reuse the feature owner. Cards resize
with a 280-millisecond non-bouncing spring; copy fades in 160 milliseconds, gestures
use 120 milliseconds, challenge arrivals use 220 milliseconds and explicit chart
reveals use 300 milliseconds. Position-only children protect text from stretching.
Native checked/expanded state and server feedback update immediately. No animation
controls assessment, progress, focus timing or a backend request.

Evidence cards, pins, response symbols and permitted disclosures use interruptible
presence transitions. Outgoing challenges, results, difference summaries and server
resolutions are removed immediately when their eligibility changes. Never add exit
presence around restricted evidence. Exiting permitted disclosure content is inert
and hidden from accessibility navigation; closing a focused disclosure returns
focus to its trigger. First mount and restored drafts do not replay entrances.

Both saved-app and operating-system preferences are observed live. Motion 14.3's
mounted reduction policy is cached, so the shared layer explicitly disables layout
and gestures and settles active transforms/opacity without remounting state or
focus. It resets projection when reduction is enabled; keep any future Motion
surfaces within this policy or revisit that shared reset. Hover requires a fine
pointer that supports hover. Disabled assessment controls have no gesture movement.

`FlowDiagram.tsx` uses Motion values for paths and `flow-connectors.ts` samples actual
transformed button bounds, accounting for scaled ancestors. Batched reads precede
path writes in the same paint. Interaction/layout events open one coalesced,
bounded 450-millisecond tracking window, with no React state per frame. Resize and
post-commit samples handle settled geometry. Unmount cancels frames and observers.
Reduced motion uses settled samples rather than a continuous tracking window.

These rules are frontend behavior. Future generated papers supply the same scene
data and public-response gates, without model-generated motion instructions, new
backend fields or an additional progress system. There are no decorative loops,
video renderers, drag-only actions or generated animation programs. Native controls
support touch and keyboard, and meaning stays available without motion.

See [the motion inventory and implementation review](ui/FRESH_ADVENTURE_MOTION.md),
[the scene storyboard](ui/FRESH_ADVENTURE.md) and [TESTING.md](TESTING.md) for
verification coverage and remaining visual checks.

## Three-paper reuse pilot

`activity-pilot.ts` supplies three bounded, authored examples to the production
`InvestigationScene` renderer through `pilotScene`, which uses `projectScene` with
explicit feedback/resolution gates. `PaperActivityPilot.tsx` owns local review and
per-paper tab drafts; it does not use the server learning engine. Optional
`responseFooter` supplies caller-owned local review controls inside the response
column. Leaving it absent preserves the production caller's existing controls;
the pilot now leaves it absent and places its controls in the quest-style bar.

Comparisons accept optional integer `decimals` (0–6, default 2) for rendered values
and differences. Supply precision justified by the paper and units: the pilot's
0.822 and 0.631 proportions use three places and subtract to 0.191. This field is
backward compatible with existing version-1 scenes. It does not model uncertainty,
denominators, unlike measures or arbitrary precision. The generic reveal control
says “Reveal reported results.” Container variants use `scene-kind-*` to avoid
colliding with the inner `.scene-flow` and `.scene-comparison` class names.

The qualitative example uses contextual summaries instead of a frequency chart;
the observational example shows timing and model inputs. These are teaching choices
for these tasks. They do not prohibit an appropriately sourced numerical display
in another qualitative or observational task.
