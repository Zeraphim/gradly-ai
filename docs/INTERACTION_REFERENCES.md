# Playable whole-paper understanding

## 21 October 2026: animation and dynamic-paper review

**Status: source audit with an authorized local implementation follow-up.**
Follow-up: Marc authorized the repair pass and one study-design activity on
21 October. Those changes are implemented and passed automated and Chromium
checks; no visual acceptance is recorded. See the
[implementation description](DESIGN.md#authored-quest-motion-and-study-design-activity).
The audit below describes the original `d474f6e` source, including issues addressed
by that follow-up; its broader paper-type expansion remains a recommendation.
The [21 October verification record](ui/INTAKE_PROCESSING.md#verification-history)
records the checks and their limits.
Reviewed `marc` at `d474f6e`. The three Paper Brief files were then untracked and
not part of the integrated application; they have since been removed. Current sources and public
reference material were inspected; no new browser session, production build,
frame recording, live generation or learning study was run for this review.
Earlier measurements later in this document are historical evidence.

### Recommendation in plain language

Build a small library of excellent learning activities that different papers can
fill with their own supported facts. Start by improving one complete activity and
trying it with unrelated papers. Gradly already has much of the required machinery.

The largest opportunity is the relationship between the learner's action and the
visual explanation. Keep the study on screen, let a choice change something
meaningful, and show why it changed. Faster, more consistent transitions will help,
but they cannot supply that learning design by themselves.

Three separate questions need separate evidence:

| Question                               | Finding from this review                                                                                       | What remains to establish                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Does an action feel responsive?        | Several transitions add waiting that the existing shared controls avoid.                                       | Actual response time on a phone and under load.                 |
| Does the visual make the idea clearer? | Some existing activities already show consequences; others replace a picture or play a sequence automatically. | Whether learners understand the intended distinction.           |
| Does this work for a different paper?  | The richer sample quest and the generated-paper player have different capabilities.                            | Reliable selection and filling of templates across paper types. |

### What Brilliant's published work supports

Brilliant describes substantial human work on the learning objective, progression
and moment of discovery. AI helps create and vary activities inside that design,
and generated problems receive human review. Its account is evidence of its
workflow, not a guarantee of results for Gradly.
[Brilliant's learning-game workflow](https://blog.brilliant.org/hand-crafted-machine-made/)

Its image-processing course uses a recurring activity whose output changes
immediately as the learner builds a filter. That is a useful pattern for Gradly:
reuse one understandable working surface, then deepen the task on that surface.
[Brilliant's decomposition example](https://blog.brilliant.org/decomposition-and-abstraction/)

Brilliant also evaluates whether generated activities are solvable, visually clear
and consistent across possible states. Gradly needs equivalent checks for truthful
evidence, understandable controls and defensible interpretations; successful code
generation alone cannot establish those properties.
[Brilliant's evaluation framework](https://blog.brilliant.org/when-almost-right-is-catastrophically-wrong-evals-for-ai-learning-games/)

Rive's interview with Brilliant concerns learning paths, streaks and motivational
animation. It demonstrates a successful design workflow for those uses; it does
not establish that every instructional visualization uses Rive, or that installing
Rive would reproduce the lesson quality.
[Rive's Brilliant case study, May 2024](https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations)

An older research analysis of animation for complex systems found that apparent
advantages can be confounded with extra information or interaction, and that fast,
complex movement can be difficult to follow. Its scope is narrower than all online
learning, but it supports making important states inspectable and giving learners
control. It does not provide a percentage improvement prediction for this product.
[Tversky, Morrison and Bétrancourt, 2002, author-hosted paper](https://www.tc.columbia.edu/faculty/bt2158/faculty-profile/files/_Morrison_Betrancourt_AnimationCanitfacilitate.pdf)

### Current foundation and the gap between the two players

The application already has shared timing and preference handling in
[`scene-motion.tsx`](../apps/web/src/research/scenes/scene-motion.tsx), bounded
connector tracking in
[`flow-connectors.ts`](../apps/web/src/research/scenes/flow-connectors.ts), native
selection controls and server filtering of unreleased evidence. These are useful
foundations to retain. The source inspection did not establish a general frame-rate
problem or a need to replace the animation engine.

The two learning players serve different purposes:

| Surface                       | Current behavior                                                                                                                                                                             | Implication                                                                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Authored texting quest        | `TextingQuest.tsx:47` describes browser-checked answers from `texting-quest.ts`; progress is stored for the visit. `ResearchApp.tsx:676` supplies a session key, not a new paper's content.  | Its richer illustrations are a showcase for one prepared study. A different URL identifier does not turn it into a different paper. |
| Generated-paper investigation | `ResearchApp.tsx:907` renders `InvestigationScene` from the shared scene contract and server session.                                                                                        | This is the foundation for paper-specific content, progress and evidence gates.                                                     |
| Shared scene contract         | `packages/contracts/src/scenes.ts` defines ten families: process, evidence connections, numerical comparison, contrasting designs, timeline, association, estimate, tests, units and matrix. | Improve these reusable families before creating another player. Extend the contract only where a real learning activity needs it.   |

Several sample interactions are already promising: selecting a research question
changes what varies and what is measured (`quest-visuals.tsx:96`); recruitment rules
change who is included (`:132`); study-plan choices change the visible procedure
(`:239`). Generalize these patterns carefully. Their current labels, fixed
illustrative people and answer maps are specific to the sample.

### Vetted issues, ordered for the first improvement pass

All locations below are relative to `apps/web/src/` unless another root is named.
Timings are read from code, not measured input latency or rendering benchmarks.

| Priority | Location                                                                               | Finding and consequence                                                                                                                                                                    | Proposed direction                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | `research/TextingQuest.tsx:828`                                                        | Enabling reduced motion in the first 450 ms cancels the assignment timer while leaving `split=false`. The final two-group illustration can remain unfinished.                              | Show the final explanatory state immediately whenever reduced motion is enabled.                                                                                           |
| High     | `research/TextingQuest.tsx:104`, `:218`, `:364`                                        | Heading focus is requested on the next frame, while the next heading waits for a 240 ms exit. The request can focus the outgoing heading.                                                  | Move focus when the incoming heading mounts. Make outgoing content inert, following the existing `PresenceBlock` approach. Confirm with keyboard and assistive technology. |
| Medium   | `research/TextingQuest.tsx:479`                                                        | Press scaling shares a 250 ms entrance transition and an option-dependent delay. The third option has a 150 ms configured delay.                                                           | Give presses the shared 120 ms gesture timing with no entrance delay; keep selection immediate.                                                                            |
| Medium   | `research/quest-visuals.tsx:73`, `:207`, `:279`                                        | A 220 ms exit precedes a new preview; its five-step flow then staggers by 100 ms per item with 250 ms entrances. The last step can finish about 870 ms after a settled previous selection. | Retain the working diagram and update its objects. Avoid stacking a whole-panel swap and a new list entrance on every choice.                                              |
| Medium   | `research/TextingQuest.tsx:940`; `research/quest.css:493`                              | Numeric labels are children of the bar being scaled vertically for 600 ms, so the numbers scale with it.                                                                                   | Animate the bar fill separately and keep labels at their normal size.                                                                                                      |
| Medium   | `research/TextingQuest.tsx:791`                                                        | The attention slider immediately changes state but its bars take 200 ms to catch up. The formula is explicitly an illustration.                                                            | Make the visible response track the control directly. Keep its hypothetical status clear and never reuse the formula as a paper-derived effect.                            |
| Medium   | `LegacyApp.tsx:101`, `:134`, `:163`; `research/useResearchConfig.ts:12`                | A direct research entry requests configuration in both players and also loads the inactive classic lesson.                                                                                 | Share the public configuration result and defer the classic lesson until needed. Preserve resumption and points.                                                           |
| Low      | `research/TextingQuest.tsx:855`, `:943`, `:574`; `research/scenes/scene-motion.tsx:27` | Assignment, charts and completion introduce separate durations and bounce settings alongside the shared vocabulary.                                                                        | Use shared timings for ordinary controls and document intentional exceptions for teaching sequences. Longer explanatory motion is not automatically a defect.              |
| Low      | `research/play.css:94`, `:131`, `:320`; `research/styles.css:159`, `:1544`, `:2004`    | Styling is spread across base rules and later override layers; response padding is redefined in the same stylesheet.                                                                       | Consolidate rules by component and express focus mode as a deliberate variant. This is a maintenance gain; speed savings have not been measured.                           |

The preview timing estimate is 220 ms outgoing motion + 400 ms final-item delay +
250 ms entrance. Parent and child entrances overlap; adding another 220 ms would
overstate it. Press delays are 50, 100 and 150 ms for the first three options.
Neither calculation establishes that answer selection is blocked for that period.

The broader source review also found repeated sample facts in
`TextingQuest.tsx:924`, `ResearchApp.tsx:871` and `:1388`, and
`apps/api/src/research/featured-scenes.ts:324`. A small public sample-facts module
could reduce drift. It must keep answer keys and gated results out of early public
responses. This is proposed cleanup, not a reason to put assessment data in the
browser.

### A concrete pilot that would feel different

Use the study-design activity as the first pilot:

1. Keep one study diagram visible with the question above it.
2. Ask the learner to compare random assignment with participants choosing groups.
3. Move the same conceptual group shapes and change the relevant relationship;
   leave labels and the question in place.
4. Ask what conclusion that design can support. Selection changes a proposed
   interpretation; it must not silently mark it correct.
5. After submission, highlight the relevant source and explain the limitation.
6. Give a new setting that tests the same distinction without copying the answer.

The groups are a schematic, not a recreation of individual participants. Published
values enter only when the existing server gate permits them. A source panel stays
available beside the activity, with detail on demand. Important end states remain
readable after movement stops.

Other useful opportunities are a prediction kept beside a revealed result, and a
before/after claim connected to the evidence that motivated revision. These are
candidate learning activities, not additional decorations to apply everywhere.

### How this can adapt to different papers

The model should select an approved activity and supply structured facts with
source references. The application owns the drawing, interaction and animation.
Current `sceneAuthoringInstructions` already prohibits generated scripts and
invented measurements; `projectScene` already filters information by reveal stage.
Retain those boundaries.

| Paper or question                            | Suitable activity                                                      | Required evidence and limits                                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Controlled experiment                        | Group formation, procedure, prediction, reported comparison            | Actual assignment method, measurement and reported values; do not invent people or individual scores.                    |
| Observational study                          | Compare observed groups and inspect alternative explanations           | Show association and design limits; moving a control must not imply a verified causal effect.                            |
| Qualitative interviews                       | Connect accounts, themes and interpretations; compare a counterexample | Preserve context and defensible alternatives. A theme is not a population percentage.                                    |
| Review or meta-analysis                      | Evidence-selection process and supported study comparisons             | Effect estimates, intervals and study differences need richer types than the current single-value chart.                 |
| Theoretical or methods paper                 | Trace an argument or algorithm; inspect a worked example               | Separate assumptions, demonstrations and observations. A genuine numerical simulation needs an explicitly defined model. |
| Incomplete extraction or unsuitable evidence | Short explanation with source excerpts and an explicit limitation      | Use the existing no-scene fallback. An honest static explanation is an acceptable result.                                |

Two contract gaps deserve attention before richer generated charts: there is no
typed uncertainty interval or distinction between SD, SE and confidence intervals;
the renderer prints all values with two decimal places
(`ComparisonScene.tsx:148`). Preserve source precision, units, denominator,
measurement time and interval meaning. Do not infer missing information from the
appearance of a published figure. A fixed bar display also needs a deliberate
choice of scale for negative values and unlike measures.

Prefer a bounded first release: improve the four existing scene families, pilot
three different paper types, and add a new family only after the existing choices
cannot explain a verified teaching need. Arbitrary-paper coverage remains an open
evaluation problem. Schema-valid content is not proof of factual or educational
correctness.

### Tools, performance and the role of REA

**Keep React, HTML/SVG and the existing Motion layer for the pilot.** They already
support dynamic labels, diagrams, bars and native controls. The proposed pilot
requires no new paid animation tool or model call per interaction. Motion's core
library is free and MIT licensed; design and development time remain real costs.
[Motion's official library description](https://motion.dev/)

Use Rive selectively if an original mascot or reusable illustrated object needs
designer-authored states. Its web runtime introduces a JavaScript/WASM rendering
layer and renderer choices, plus an asset-authoring workflow. That cost should be
justified by a specific visual; it is not necessary for the first evidence diagram.
[Rive web runtime documentation](https://rive.app/docs/runtimes/web/web-js)

The REA skill explicitly directs ordinary complete-source analysis to normal
repository tools. That fits this checkout. Another broad REA pass over public
landing pages would leave the lesson-design question unresolved. The historical
captures below never established authenticated lesson behavior.

If a specific interaction remains unclear, a later focused observation of one
accessible real lesson could record the learner's action, the changed objects,
feedback, reversal and small-screen behavior. Its deliverable should be a behavioral
storyboard. Access and the inspected lesson must be stated; a marketing animation
cannot establish how assessment behaves. No REA installation or harness change was
needed for this review.

For performance, prefer transform and opacity for ordinary movement, keep text out
of scaled fills, and record what actually happens under load before changing the
engine. Chrome can identify non-composited animation in a performance trace.
[Chrome's animation diagnostic](https://developer.chrome.com/docs/lighthouse/performance/non-composited-animations)

One correction to older generic advice matters here: current Motion documentation
says independent transforms such as `x` and `scale` can also be hardware accelerated.
They are not, by themselves, defects. Browser conditions and the actual animation
still matter. Preserve the existing batched, bounded connector work instead of
replacing it with React state updates on every frame.
[Motion's current performance guide](https://motion.dev/docs/performance)

Candidates for later load optimization are deferring the statically imported sample
quest in `ResearchApp.tsx:24` and consolidating CSS. Measure route payload and request
timing first. `App.tsx:9` deliberately keeps the first meaningful upload screen eager;
preserve that intent. Renaming or deleting `LegacyApp` would not itself improve speed.

### Expected improvement, effort and cost

These are planning estimates for one developer familiar with the code, expressed
in focused working days. They include relevant verification and exclude deployment,
new provider integration and unpredictable content-review effort. They are not
delivery promises or measured gains.

| Sequence                                                                 | Estimated effort     | Expected visible result                                             | Boundary                                                                       |
| ------------------------------------------------------------------------ | -------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Repair responsiveness, focus, reduced-motion completion and chart labels | 1–3 days             | Clearer controls and fewer distracting defects                      | Improves polish; the activity structure stays similar.                         |
| Design and implement one persistent study-design activity                | 3–5 additional days  | The strongest likely improvement in perceived instructional quality | One reviewed activity, not broad paper coverage.                               |
| Apply and evaluate that approach across three paper types                | 5–10 additional days | Tests whether the design genuinely generalizes                      | Assumes the existing generation path works and source material is extractable. |

The combined initial range is **9–18 focused days**. More complex simulations,
figure extraction and domain expert review can expand it substantially. A timing
cleanup alone is a smaller investment if the immediate need is presentation polish.

The proposed approach adds **$0 in required animation-library licence fees** and
**zero model requests for each local selection, slider movement or diagram update**.
Existing paper generation, hosting and storage still have their own costs. A total
cash or per-paper estimate needs a labor rate and measured provider usage; neither
was established here. No model, provider or quality setting was changed.

There is no defensible claim that Gradly will become a particular percentage more
beautiful, faster or more effective at teaching. There are concrete opportunities:
remove configured press delays up to 150 ms for the first three choices, replace
the cited preview's roughly 870 ms settling sequence with one short response, and eliminate one duplicate
configuration request plus an irrelevant classic lesson fetch on direct research
entry. These are source-derived opportunities, not observed end-to-end savings.

### How to decide whether the next version is better

- Compare the current and proposed activity with **5–8 learners** as an initial
  usability check. Ask them to explain the paper's question, design and conclusion,
  then answer a new example. This small check can expose confusion; it cannot
  establish a general learning effect.
- Record the same interactions on a representative phone, desktop and Safari,
  including rapid reversals and a live reduced-motion change. At 60 Hz there is
  about **16.7 ms per frame**; at 120 Hz, **8.3 ms**. These are budgets, not current
  Gradly measurements. See the
  [Motion performance guide](https://motion.dev/docs/performance).
- Verify immediate selection, correct heading focus, inert outgoing controls,
  stable labels, correct evidence gates and resumption. Reduced motion must retain
  the explanation's final state.
- Keep tap/click and keyboard alternatives for any dragging enhancement. W3C's
  dragging guidance requires a simple pointer alternative; keyboard support alone
  does not supply it.
  [W3C dragging guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)
- Retain the system preference and saved motion setting. W3C identifies disabling
  nonessential interaction-triggered movement as an accessibility practice.
  [W3C animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- Evaluate a fixed, varied set of papers before claiming broad support: missing
  values, long labels, contradictory findings, null results and defensible
  alternative interpretations matter as much as an attractive sample.

These are proposed acceptance checks for future implementation. For this review,
formatting and `git diff --check` passed; `npm run context:index` completed and
`npm run context:check` passed with 46 review/authority warnings. Those warnings
include unreviewed baselines and affected uncommitted files; no baselines were
advanced. No application tests, builds or browser checks were run.

## Historical research and reference observations

The remaining sections retain earlier exploration and inspection records. Their
design proposals and measurements are scoped to the dates and surfaces stated.

Historical implementation note (15 October): user feedback favored the earlier guided lesson. That path showed one note at a time, short answer choices and one primary next action. Pinning was optional, and the board/dial proposals below document the exploration that informed that design.

Reference inspection: 15 October 2026. This document records design observations and recommendations, not evidence that Gradly improves learning or will win a hackathon. The case lab implementation and its tests remain the authority for what actually works.

## Product direction

Make a paper something the learner investigates. A case should connect the question, design, observations, interpretation and limits in one small evidence board. The learner should leave able to explain the paper's central claim and its scope without reading every line first. The original paper remains available for depth and verification.

The immediate loop is **predict a claim → uncover the case → pin evidence → encounter a challenge → revise the claim → try a new context**. Statistical analysis is one part of this broader practice. Qualitative interpretation, causal inference, generalization and evidence synthesis need distinct cases and case-specific feedback.

## Primary references inspected

### PhET: Density

[Density simulation and learning goals](https://phet.colorado.edu/en/simulations/density) · [Playable simulation](https://phet.colorado.edu/sims/html/density/latest/density_all.html)

Direct browser inspection reached the Intro experiment, including its accessible controls. The home screen separates Intro, Compare and Mystery. The board puts the object, water measurement, density representation and mass/volume controls together. A keyboard change to the wood block's Mass slider changed the displayed accessible values from 2 kg/5 L to 2.2 kg/5.5 L. The relationship is observable through manipulation rather than a subsequent answer screen. Reset and screen navigation remain available.

**Adaptation for Gradly:** put a claim and its supporting evidence on the same board. Opening or pinning a source card must visibly affect the working claim or evidence trail. A clear reset supports exploration. Begin with a constrained case and finish with an independent transfer task. These are design inferences, not claims that manipulating text is equivalent to a physics simulation.

PhET's [official design principles](https://phet.colorado.edu/en/about) describe inquiry, visual models, multiple representations, limited controls and immediate feedback. Gradly can apply those principles with ordinary accessible HTML controls.

### Vi Hart and Nicky Case: Parable of the Polygons

[Playable post](https://ncase.me/polygons/) · [Author's process notes](https://blog.ncase.me/how-i-make-an-explorable-explanation/)

Direct browser inspection showed a short premise, a concrete move rule, draggable characters, and a reset before the longer explanation. The visible interaction is embedded beside the idea it explains. Later sections introduce automatic behavior, a parameter slider and different starting conditions, then end with a sandbox. The experience moves from a local action to a surprising aggregate result and invites another experiment.

**Adaptation for Gradly:** let learners make a plausible initial claim, then reveal an evidence card that changes what that claim can support. The meaningful surprise is a counterexample, missing comparison or contradictory interview—not a decorative celebration. Each reveal advances the same paper story. Avoid copying the canvas-only interaction: Gradly's evidence actions need labeled keyboard-operable controls as well as pointer affordances.

The author's process notes recommend starting with a question and a concrete experience, building abstraction gradually and ending with questions learners can explore. That supports a transfer challenge rather than ending immediately after a verdict.

### Brilliant: targeted guidance beside the working surface

[Official product description](https://brilliant.org/) · [Official interactive coding description](https://brilliant.org/topics/coding/)

The current public pages describe a shared interactive working environment, guiding questions, hints and help aimed at a learner's difficulty. This is a source-description reference; no signed-in Brilliant lesson, adaptive tutor or mastery assessment was exercised during this inspection.

**Adaptation for Gradly:** show one useful next question beside the evidence under discussion. Keep the learner's artifact visible while coaching it. An authored case can demonstrate that pattern now; it must not imply that custom writing received a live diagnosis or that Gradly has measured mastery.

## A board that behaves differently from a quiz

| Mechanic                   | Immediate visible behavior                                                                                                   | Learning purpose                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Case envelope              | A question and small paper map appear before detailed findings. Real and fictional cases carry persistent provenance.        | Gives a reason to investigate and a coherent whole-paper destination.                     |
| Progressive evidence cards | The learner opens question/design/findings/limits cards in a deliberate order. Open state is visible and survives a return.  | Connects the research story while keeping reading manageable.                             |
| Pin to the claim           | A labeled Pin control adds a compact source chip beneath the working claim; unpin reverses it.                               | Makes support inspectable rather than asking only for an answer.                          |
| Calibrated claim           | A native claim selector or labeled strength control changes a complete sentence, not just a number.                          | Shows the distinction between what happened, what may explain it and what is established. |
| Counterexample card        | A targeted challenge appears beside the current claim. It names which inference it tests.                                    | Creates an intelligible reason to reconsider.                                             |
| Claim revision             | Before and after claims stay together with the pinned evidence that motivated the change.                                    | Makes reasoning change tangible without inventing a learning score.                       |
| Whole-paper recap          | A compact map connects question, approach, central finding, bounded conclusion and remaining uncertainty.                    | Delivers understanding of the paper rather than an isolated skill drill.                  |
| Transfer                   | A new setting changes a relevant feature. The learner applies the distinction with feedback separate from the original case. | Checks a new decision rather than rewarding copied wording.                               |

The board is a representation of reasoning, not a simulation of a scientific result. Do not animate invented participants, sampling outcomes or effect sizes. Fictional teaching cases must never look like published studies. A claim-strength change is the learner's position, not a computed probability.

## Concrete polish priorities from the inspected source

| Priority | Location and issue                                                                                                                                                        | Required direction                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| High     | `ReasoningPreview.tsx` hard-codes analysis and method vocabulary throughout its single study. `SupportPages.tsx` names the glossary and review process around statistics. | Give the new case lab general research vocabulary and case-specific decisions. Retain the original statistical investigation accurately as one path.                                       |
| Medium   | `Welcome.tsx` opens a six-quest original experience; `PathPicker.tsx` offers eight challenges; the separate authored preview forms another unnamed journey.               | Explain the paths concretely: quick paper case lab, full guided paper investigation, and upload availability. State duration/scope separately. Keep the differentiating loop easy to find. |
| Medium   | `ReasoningPreview.tsx` puts the evidence sidebar after the primary area; the mobile single-column layout therefore places it after the revision action.                   | Put the relevant evidence beside or before the coaching/revision action. Use one compact briefing with expandable detail instead of repeating all facts.                                   |
| Medium   | Original preview's authored revision always loads an independent-samples t-test, including from alternative or uncertainty scenarios.                                     | Use an appropriate revision for each case/attempt. If a decision changes, show that change explicitly.                                                                                     |
| Medium   | Large submissions, verdicts, coaching, full briefing and sources create long mobile scroll.                                                                               | Show one claim, one problem, one next question and nearby evidence first. Fold lengthy originals and detailed source descriptions. Preserve access to all content.                         |
| Medium   | The original five-step preview has no return to explanation from review or to revision from summary.                                                                      | Add Back/Revise controls that preserve local work. A deliberate case switch should not silently overwrite another draft.                                                                   |
| Low      | Standalone preview lacks its own document title. `.preview-live-contract > summary` overrides the normal 44px target.                                                     | Set a route-specific title and retain a usable target. On case/stage changes, focus the relevant heading and announce the new state.                                                       |
| Low      | The unavailable AI button is prominent but disabled on a normal reasoning review.                                                                                         | Show the saved-but-unassessed status and make the working authored reasoning preview the useful next action.                                                                               |

These are source inspection findings. Historical rendered artifacts were used to understand hierarchy, not as proof of current runtime behavior. The lab needs new rendered verification after integration.

## Responsive and accessible execution

- At desktop widths, pair the case board with a compact claim tray. At mobile widths, show the question, working claim, evidence action and next step before peripheral explanations.
- Prefer click/tap-to-pin with a text label; dragging may be an enhancement, never the only way to build the board. Native radios and buttons should remain operable with a keyboard.
- Keep the current stage and source provenance visible through static labels. Never rely on motion, color or a 3D position to communicate the result.
- Keep important actions at least 44 CSS pixels high. A mobile action dock must reserve content space and respect the safe area; it must not obscure evidence or focused controls.
- Use the existing blue Gradly palette, tactile controls, supplied artwork and type scale. No extra 3D or motion package is needed for this reasoning problem. The authored counterexample should provide the surprise.
- On small screens, collapse background briefing before collapsing feedback. Avoid nested scrolling for ordinary case text. Show a source's identifier and section/page label next to its excerpt.
- Persist drafts separately from server adventure progress. Show what is saved, allow a deliberate replay, and avoid false scores, fabricated mastery or automated assessments of free text.

## Verification still required after implementation

The reference inspection proves that those public designs expose the described controls and structures. It does not validate Gradly's implementation. Verify each new case end to end with the backend unavailable; check source-before-verdict ordering, reset/back/refresh behavior, transfer feedback, provenance and custom-writing limits. Render at 1440, 768 and 390 CSS pixels, test keyboard focus and reduced motion, and run automated accessibility checks. Whole-paper understanding and engagement still require learner observation; passing interface checks cannot establish those outcomes.

Requested skill material inspected: the local `jmo-skills` checkout at commit `6082bf2c472857d6cfda48995ab985b69345aac6`, particularly [`better-ui`](https://github.com/23jmo/jmo-skills/tree/6082bf2c472857d6cfda48995ab985b69345aac6/skills/better-ui). The checkout refers to separate layout/accessibility/typography skills that are not present in it. Their absent instructions were not treated as available verification.

## 19 October 2026: public runtime study for the paper workspace

This pass used the already installed REA skill and cached `rea-agents` 6.7.0 CLI.
No second skill, MCP server or analysis engine was installed. Chromium needed the
host's normal process access because the sandbox prevented macOS browser startup.
Reference screenshots and full Evidence records were kept in a temporary folder
on the reviewer's machine, outside the repository, rather than copying third-party
assets into the application. They are not available from this repository. These are public-page observations, not an audit of either
product's authenticated lessons or internal implementation.

| Reference                             | Declared scenario and observed state                                                                                                                                                                                                                     | REA Evidence                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Brilliant](https://brilliant.org/)   | Open homepage; choose learner; dismiss notice; Continue; select Math; Continue. A focused question and two large choices precede a radio-group question. Continue is disabled until a subject is selected. Back and segmented progress remain available. | `ev_f98df82f431752179c235cbbfa6deddd971c98637c2f5fd004ef94929e7d16d2` |
| [Duolingo](https://www.duolingo.com/) | Open homepage; Get started; inspect language choices; select Spanish. Cards have large labeled targets and a visible lower edge. The recorded Spanish destination was still an intermediate state; a complete lesson was not observed.                   | `ev_ec934e39e28695f06179d745d5b157cc343180d21f65adf2fd4294c9d098b0e2` |

Additional initial-page records: Brilliant
`ev_33bd77b09391aee933a72a4c3e82f2185a2f7fb00330b95f698aae97b068b529`;
Duolingo course choices
`ev_421be745a7cea320707ee24d3834a48f3e8cba9afe13b7872caf044da09cab36`.
The providers confirmed termination of their owned browser processes. One initial
Duolingo click was ambiguous because two Get started links existed; the successful
capture selected the observed unique top-entry attribute.

**Gradly adaptations (design choices):** retain a stable working canvas while a
short explanation changes; make selection immediate; keep one primary next action;
use the supplied mascot as a guide; preserve tactile control feedback and clear
pending/disabled states. The paper context tells the study as four short chapters on
one stage — question, setup, measure, edge — where the same objects stay on the
canvas and rearrange, with the published citation beside it and the deeper
paraphrase behind one disclosure per chapter. It does not manufacture participant
data, findings, AI output or mastery. Exact reference easing, animation performance
and authenticated lesson behavior were not established by these captures. Gradly
uses its own shared Motion timings and original blue artwork, with no copied
reference code or assets.

## 20 October 2026: measured motion values from the public pages

A second, narrower pass measured the public landing pages directly in headless
Chromium and read the computed styles of every element, without logging in and
without copying assets or code. The REA MCP server was registered for OpenCode in
this pass (`rea-agents` 6.7.0, skill v42); its tools need a new session, so these
values come from the same browser the REA browser route uses.

| Reference                             | Observed motion vocabulary                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Brilliant](https://brilliant.org/)   | 1,235 elements. Transition durations 0.2s (40 elements), 0.3s (33), 0.25s, 0.4s, 0.15s, 1.5s. Easings `ease` (63) and `ease-out` (22). Transitioned properties: opacity, background-color, color, transform, visibility, border-color, box-shadow. Radii 9999px (pills), 50%, 20px, 17px. Shadows `0 0 15px rgba(0,0,0,0.1)` (20 elements). |
| [Duolingo](https://www.duolingo.com/) | 4,288 elements. Only four elements carry a CSS transition (0.2s–0.5s, `ease`, `ease-in-out`, `cubic-bezier(0.22,…)` on transform/border-color/filter). The public page is nearly motion-free: the app's motion is script-driven and was not observable here.                                                                                |

Two lessons were taken from these values, and they are Gradly design decisions,
not reproductions: a short, consistent vocabulary (0.2s–0.3s, one ease-out
curve, transform and opacity) produces the smoothness people read as "premium";
and a reference that animates its _app_ rather than its _marketing page_ cannot
be imitated from the marketing page alone. Gradly therefore keeps its own Motion
timings, its own artwork and its own reduced-motion contract.

The paper story applies the first lesson directly: chapter changes are one
0.24-second eased swap over `transform` and `opacity` on a measured canvas, with no
per-chapter timing of their own and no animated progression. The second lesson is
why the story was designed as an interactive canvas rather than copied from any
observed page: neither public page exposed an authenticated lesson to measure.

The limits are explicit: these are public pages, not the authenticated lessons of
either product; no easing curve, spring, asset or code was copied; and nothing
here establishes the perceived quality of either product's learning flow.

## 21 October 2026 follow-up: three-paper pilot

The bounded reuse recommendation now has an authored implementation at
`#/research/activities`; see [the design record](DESIGN.md#three-paper-activity-pilot)
and [source checks](research/PAPER_SELECTION.md#three-design-activity-pilot--21-october-2026).
It reuses comparison, flow and connections scenes with three prepared papers.
The numerical-precision gap identified above is partially addressed by optional
`decimals` (0–6). Typed uncertainty remains open. No automatic generation, live model
quality, independent content approval or learner-benefit result is established.
