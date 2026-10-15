# Playable whole-paper understanding

Current implementation note: user feedback favors the earlier guided lesson. The main path now shows one note at a time, short answer choices and one primary next action. Pinning is optional, and the board/dial proposals below document the exploration that informed the design rather than controls still required in the default flow.

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
| Low      | The unavailable AI button is prominent but disabled on a normal reasoning review.                                                                                         | Show the saved-but-unassessed status and make the working authored case lab the useful next action.                                                                                        |

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
