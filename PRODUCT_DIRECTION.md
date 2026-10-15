# One paper, one connected experience

The public prototype now has one mode: **Start → Read → Choose → Try → Recap**. Its purpose is to help someone explain a paper’s question, approach, findings and boundaries after interacting with its evidence. Choosing a different study changes the content, not the interface or the learning mechanism.

The original quantitative paper is a curated source-backed case. The qualitative garden case is explicitly fictional. It shows that the same mechanism can handle interpretations, different participant accounts and analytic limits without forcing statistical tests onto every paper. Neither case is represented as a new live AI analysis. Custom writing remains unassessed.

The older six-quest, research-upload and reasoning-showcase routes remain available for existing saved links and engineering compatibility. They are not promoted as additional modes in the public front door. The old home is at `/#/classic`; the current paper experience opens at `/` or `/#/research/lab`.

## What makes the interaction useful

1. **An initial commitment survives the reveal.** The learner makes a provisional claim; a starting note and confidence are optional. Once evidence is opened, that initial call is kept for comparison rather than silently rewritten.
2. **Evidence is something the learner works with.** One note is shown at a time, with a short summary and expandable source detail. Previous/next actions and a compact note list support navigation. Saving evidence is optional; saved-note checks still distinguish support from limitations and counterexamples.
3. **A conclusion gets an explicit check.** Short radio choices compare excessive caution, a bounded interpretation and overreach. Check answer reveals concise authored feedback; changing the choice removes that check. Explanation writing and detailed evidence review remain optional.
4. **The distinction must travel.** A fictional transfer setting changes a critical feature. The guide explains the structured choice; a completed trail is not a mastery certificate.
5. **Understanding has a portable artifact.** The recap connects question, approach, findings and limits, preserves the initial and revised claims, and exports evidence, reflection and transfer guidance as local notes.

This is the proposed differentiation: an inspectable path from a claim to evidence, revision and transfer. It is a product hypothesis, not proof of an established competitive moat or learning effect. More decorative interaction would not establish that proof.

## Why these interface references mattered

The directly inspected PhET simulation and Polygons explorable show how a small set of purposeful controls can make a relationship visible. The current adaptation is progressive evidence and visible answer feedback in a guided lesson. User feedback led to removing the free-form board and duplicate dial controls from the main path. Details, verification limits and original links are in [INTERACTION_REFERENCES.md](INTERACTION_REFERENCES.md). The learning rationale and methodological boundaries are in [RESEARCH_LEARNING_DESIGN.md](RESEARCH_LEARNING_DESIGN.md).

## A concise hackathon demonstration

Open the reference study and choose a starting answer. Read five short notes with Next note. Choose a conclusion and check it; inspect Why only if useful. Try the changed setting, then download the recap. The qualitative study uses the same flow. The earlier guided lesson at commit `9ab53f1` is the navigation reference: one central task, familiar answer cards and a persistent next action.

This targets the official judging dimensions of coherent design, demonstrated usefulness and idea quality. The technical criterion still requires a working application using NVIDIA models through eligible Nebius infrastructure. An authored frontend does not establish that runtime integration. See the [official criteria and requirements](https://nebiusglobalaihackathon.devpost.com/) and the separate setup and live acceptance guides. No award outcome is implied.

## Evidence still needed beyond software verification

- Ask research learners to explain the paper’s question, approach, findings and one limitation before and after exploration, without copying the recap.
- Inspect whether they can apply the critical distinction to a new study and whether it persists after a delay. Opening cards or reporting higher confidence is insufficient evidence.
- Have a methods instructor review both case content and the authored guide, including alternative interpretations.
- Before replacing authored guidance with AI, bind the review to the exact paper, permitted evidence, current claim and submitted explanation revision. Reject stale or unsupported reviews; keep failure explicit.

These are future evaluation and integration tasks. The prototype does not present them as completed research.
