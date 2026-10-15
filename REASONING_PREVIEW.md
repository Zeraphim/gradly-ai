# Research reasoning showcase

The showcase must make Gradly’s learning mechanism visible before live feedback is connected. A learner chooses an analysis, explains why it fits, inspects relevant evidence, revises the explanation, and sees what changed. Matching an answer guide and supporting a decision with evidence are separate outcomes.

The earlier browser showcase implements this preview at `/#/research/reasoning`, reachable from the compatibility home (`/#/classic`) and research path. The current public front door uses the single paper-centered experience in `PRODUCT_DIRECTION.md`; this narrower explanation showcase remains available for existing links. This document separates its verified authored behavior from the proposed future live contract. Checked items have local verification; the live acceptance items remain open.

## Current implementation boundaries

The source audit found these existing behaviors:

- `apps/api/src/research/engine.ts` checks selected option identifiers against the lesson’s accepted responses and alternatives. Written reasoning does not affect this score.
- `reviseReasoning` preserves earlier explanation text and clears the challenge’s previous AI feedback. The selected-answer score stays unchanged.
- `apps/api/src/research/routes/feedback.ts` requests a separate reasoning category, guidance, follow-up question and reference identifiers. It refuses sample lessons and reports provider failure explicitly.
- The feedback route checks that returned references belong to the challenge. Its model input currently contains challenge evidence strings, answer guidance and reference identifiers; it does not include the full referenced evidence records or an explicit attempt/revision identifier.
- `apps/api/src/research/demo.ts` loads a separate authored study after checking an upload. It does not generate questions or assess writing from that upload. Production and Vercel refuse this local demo path.
- The original six-quest feedback service also has a labeled preview path. It uses sample-answer matching and states that it has not assessed the explanation.

The new browser showcase must preserve those boundaries. Its authored example must not be represented as a live model result or as analysis of an uploaded paper.

## The learner moment to demonstrate

Use a concise, authored example based on the reference lesson’s study-design summary. In this study, participants were randomly assigned to texting or no texting, each participant experienced one condition, and the outcome was a numerical comprehension-quiz score. These are curated summaries of the reference content, not newly extracted quotations.

The central example should show a suitable method paired with a flawed explanation. For example, the learner chooses an independent-groups method but writes that the groups are paired because they attended the same lecture. The method can match the answer guide while the explanation still misunderstands independence.

Show the complete loop:

1. Present the decision and the permitted study-design evidence before any findings.
2. Show an authored learner choice and explanation. Label it as an example.
3. Check the choice separately from the explanation. A matching choice must not produce “Well reasoned!” by itself.
4. Identify the specific reasoning gap: a shared lecture does not create paired observations.
5. Open the evidence that supports the distinction. Use the reference identifier and published-page label from the reference fixture.
6. Ask a focused question: does each participant provide a score in both conditions or in one condition?
7. Show an authored revision that connects a numerical outcome and independent groups to a suitable comparison, while acknowledging that distribution and variance assumptions still need inspection.
8. Compare original and revised explanations. State the conceptual improvement. Keep the selected-answer score unchanged.
9. Show an evidence-boundary example where missing design details prevent a reliable judgment. Explain what information is needed next.

The interface should make these examples easy to replay. It should not require an upload, an API credential, or a completed investigation to demonstrate this loop.

## Preview provenance

Keep three facts visible and separate:

| Item                | Browser showcase                  | Existing local upload sample                 | Future live review                                  |
| ------------------- | --------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Content             | Authored demonstration fixture    | Separate authored reference lesson           | Current permitted evidence from the selected lesson |
| Writing             | Authored example or learner draft | Learner draft saved without AI assessment    | Exact submitted explanation revision                |
| Assessment          | Authored example feedback         | Answer-guide matching and reference guidance | Validated provider response                         |
| External processing | None for the showcase             | None in sample mode                          | Nebius after the relevant consent                   |
| Progress            | Separate demonstration state      | Existing sample-session rules                | Existing authoritative session rules                |

The browser showcase may let someone type their own explanation to understand the interaction. It must label custom writing as **not assessed**. Choosing a prepared scenario can load its authored explanation and feedback. Editing that explanation must invalidate its prepared verdict until the person restores or chooses an authored example. Do not use keywords, a random response, or a selected option to fabricate an assessment of arbitrary writing.

Do not show simulated agent activity as completed live work. Reference roles may describe how the intended workflow would help, with an explicit authored-preview label.

## Future live integration contract

Keep the browser fixture adapter separate from the live request adapter. Replacing the fixture adapter must not change lesson scoring, session progression, or sample provenance. The live adapter should reject a sample response supplied as a live result.

The current `/api/research/feedback` request contains a session identifier. A production integration should also bind the review to the server’s exact active challenge and explanation revision. The server should supply authoritative evidence and answer guidance. The client must not supply trusted criteria or an answer key.

Recommended request binding:

```ts
type ReasoningReviewRequest = {
  sessionId: string;
  sessionVersion: number;
  challengeId: string;
  attemptId: string;
  explanationRevision: number;
};
```

Recommended validated result shape:

```ts
type ReasoningReviewResult = {
  binding: ReasoningReviewRequest;
  provenance: {
    mode: "live";
    contentSource: "featured" | "generated";
    lessonId: string;
    lessonVersion: string;
    model: string;
    reviewedAt: string;
  };
  reasoning: {
    category:
      | "Well Supported"
      | "Partially Supported"
      | "Needs Reconsideration"
      | "Defensible Alternative"
      | "Unable to Assess Reliably";
    strength: string | null;
    gap: string | null;
    followup: string;
    refs: string[];
    limitation: string | null;
  };
};
```

This proposed shape requires new stable attempt and revision identifiers; the current research `Attempt` type does not have them. The existing `correct` field remains a deterministic selected-answer result. The reasoning response does not grant points, mark a choice correct, or advance a session.

The server must enforce these rules:

- Resolve the exact submitted text from the session. Reject a stale version, mismatched challenge, changed revision, or request made while retrying. Never display old feedback against new writing.
- Provide only evidence allowed at the current reveal stage, including the matching evidence records rather than identifiers alone. Do not reveal paper identity or future findings in a design-stage assessment.
- Separate the quoted source text, curated summary, and learner explanation in the prompt. Treat the learner’s text as untrusted input.
- Validate the response schema and bounded text lengths. Check every reference against permitted evidence. A valid reference identifier alone does not prove the guidance follows from that source.
- Require “Unable to Assess Reliably” when evidence is missing, ambiguous, or insufficient. Ask for the missing information. Do not invent a study detail to complete an assessment.
- Accept a defensible alternative when it is supported by the permitted criteria. Do not call a choice wrong solely because it differs from a single preferred method.
- Invalidate the review after revision. Preserve previous submitted text for comparison. A new review evaluates the new revision without silently rewriting the first assessment.
- Keep provider failures explicit and retryable where appropriate. Preserve the draft and selected-answer score. Never substitute authored example feedback after a failed live request.
- Keep credentials server-side. Preserve owner checks, same-origin checks, rate limits, input limits and the existing consent boundary.

## Acceptance checklist

### A teammate can see the mechanism without a backend

- [x] A clearly labeled entry opens the browser showcase from the learning path.
- [x] The showcase opens and completes when research API routes are unavailable.
- [x] A visible label states that examples and coaching are authored and no live AI assessment occurs.
- [x] The default example demonstrates a suitable choice with flawed reasoning.
- [x] Choice matching and reasoning quality have distinct labels and presentation.
- [x] The learner can inspect the relevant evidence and its correct source-page label.
- [x] The coaching asks a targeted question rather than only displaying the answer.
- [x] Original and revised explanations can be compared side by side or sequentially on a narrow screen.
- [x] The comparison explains the conceptual improvement and does not award an additional answer score.
- [x] An evidence-boundary scenario shows why a reliable assessment is unavailable and names the missing information.
- [x] Every prepared scenario can be replayed or reset without stale state.

### The preview cannot masquerade as assessment

- [x] Editing an authored explanation removes or invalidates its prepared reasoning verdict.
- [x] Arbitrary writing is marked not assessed; no keyword or selected-choice rule produces a reasoning-quality verdict.
- [x] Preview actions make no call to a live feedback endpoint.
- [x] The preview does not create a generated lesson, mutate a research session, award real progress, or claim that an uploaded document was analyzed.
- [x] Reference excerpts and summaries are labeled accurately. Published page numbers are not relabeled as uploaded PDF pages.
- [x] No reference-study findings or identity are exposed in a pre-findings design example.

### Existing learning and recovery remain accurate

- [x] Choice-only research feedback no longer calls the response “Well reasoned!” or claims the writing was checked.
- [x] Existing answer-guide checking, retries, saved revisions and reveal timing still work.
- [x] Live feedback stays separate from preview feedback and unavailable-provider states remain explicit.
- [x] Navigation, reset and reload cannot attach one example’s feedback to another explanation.
- [x] Mobile layout, keyboard use, focus order, screen-reader status updates and reduced motion are checked for the new flow.

### Required before claiming live integration

- [ ] The server validates attempt and revision binding and refuses stale reviews.
- [ ] Supported reasoning, flawed reasoning, defensible alternatives and missing evidence each pass independent live checks.
- [ ] References resolve to exact permitted evidence and reviewers inspect whether the guidance is supported.
- [ ] Injection, provider failure, malformed output, stale response and revision invalidation are tested.
- [ ] A fresh uploaded paper completes the real processing and learning workflow with explicit provenance.
- [ ] Teaching-quality or learning-benefit claims are supported by learner/instructor evidence, separately from software checks.

## Source map

- `apps/web/src/research/ReasoningPreview.tsx`: browser-only choose, explain, inspect, revise and reflect interface.
- `apps/web/src/research/reasoning-preview.ts`: authored scenarios, exact-match review adapter and gated reference reveal data.
- `apps/web/src/research/reasoning-preview-state.ts`: validated draft restoration; saved feedback is never trusted.
- `tests/browser/reasoning-preview.spec.ts`: backend-unavailable, custom writing, recovery, accessibility and responsive checks.
- `apps/api/src/research/engine.ts`: deterministic selected-answer checks, public session shape and saved reasoning revisions.
- `apps/api/src/research/contracts.ts`: lesson evidence, reveal stages, attempts and stored AI feedback.
- `apps/api/src/research/routes/feedback.ts`: current live coaching prompt, result categories and reference validation.
- `apps/api/src/research/featured.ts`: authored reference-study design, method alternatives, misconceptions and published-page summaries.
- `apps/api/src/research/demo.ts`: explicit local sample mode and sample processing provenance.
- `apps/api/src/feedback.ts`: original curated feedback service and preview boundary.
- `apps/web/src/research/ResearchApp.tsx`: current written-reasoning editor, selected-answer feedback and coaching controls.
