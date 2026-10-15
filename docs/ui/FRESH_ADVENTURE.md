# Fresh Adventure visual scenes

## Status

Proposed design evidence. The local implementation exists, but no separate design
approval or browser visual inspection is asserted by this document.

## Owners

Unassigned.

## Affected surfaces

The eight research adventure challenges, optional bonus, final journey recap and
saved-decision review. Upload, processing, history and the separate authored
reasoning preview retain their existing routes and behavior.

## Direction and local implementation evidence

The interface inherits Gradly's blue palette, supplied book mascot, Plus Jakarta
Sans and tactile actions. A prompt leads to one evidence workspace, candidate
connections, contextual resolution and the existing save/continue dock.

| Challenge            | Visual treatment                                                            | Interaction                                                                    |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| V1 Research question | Condition and measurement anchors                                           | Inspect and pin evidence, connect a proposed question                          |
| V2 Design            | Assignment branching into parallel conditions, then lecture and measurement | Inspect supported relationships, propose a design                              |
| V3 Methods           | Outcome and group-structure anchors                                         | Connect multiple analysis methods                                              |
| V4 Justification     | Outcome, observation structure and assumption ingredients                   | Pin an evidence assembly and connect a justification                           |
| V5 Assumptions       | Distribution, variance and independence checkpoints                         | Inspect recommended checks without pretending they passed                      |
| V6 Results           | Reported means on one labeled scale                                         | Predict optionally, reveal means, interpret, then inspect the gated difference |
| V7 Significance      | Conceptual test-result and interpretation path                              | Propose a conditional reading without fabricated distributions                 |
| V8 Conclusion        | Design, outcome and scope anchors                                           | Connect a bounded claim                                                        |
| V9 Bonus             | Two group-formation process panels                                          | Compare selection and assignment before judging the claim                      |

Candidate connections use one neutral selection treatment. Correctness appears only
with saved server feedback. The original submitted response remains visible during
revision. The final recap reuses scene titles and recorded attempt counts; saved
reviews reopen the same scene renderer with assessed controls disabled.
[The motion review](FRESH_ADVENTURE_MOTION.md) records shared expansion, gesture,
layout, connector, reveal and disclosure behavior across these surfaces.

Local evidence is the data and components rather than a manually recreated mockup:

- `apps/api/src/research/featured-scenes.ts`
- `apps/web/src/research/scenes/InvestigationScene.tsx`
- `apps/web/src/research/scenes/SceneJourney.tsx`
- `apps/web/src/research/scenes/scenes.css`
- `tests/research/scenes-ui.test.ts`
- `tests/research/scenes-workspace.test.ts`

## Required states

- Setup: source context and unselected candidate responses.
- Exploration: inspected nodes, pinned evidence and optional prediction.
- Saving: existing pending dock blocks duplicate submission.
- Failure: answer and exploration drafts remain available for retry.
- Feedback: original response retained, resolution gated by the server.
- Revision: first response remains visible while a revised response is assembled.
- Resume: matching version/challenge drafts restore exploration; incompatible drafts
  are ignored and server answers remain authoritative.
- Unsupported scenes: usable original answer controls.
- Reduced motion: no essential information depends on movement. Explicit reveals
  remain accessible, and controls use native keyboard/touch behavior.
- Long/narrow content: wrapping labels, stacked flow columns and response choices.
- Unauthorized or stale writes: existing server ownership/version checks remain.

## Verification limits

Component tests exercise native control behavior, evidence assembly, reveal ordering,
parallel branch structure and rendering of every featured scene plus both unrelated
fixtures. Workspace tests exercise failed saves, retry, resume and late navigation.
Service tests exercise the real local learning endpoints. These are not screenshots
or evidence of browser layout, animation smoothness, mobile touch behavior, full
accessibility conformance or learner benefit. Those visual/manual checks remain to
be performed under the project's computer-use authorization rules.

## Related documents

- [Scene authoring and integration](../SCENE_AUTHORING.md)
- [Requirements](../REQUIREMENTS.md)
- [Design system and historical references](../DESIGN.md)
- [Verification commands](../TESTING.md)

No previous approved design artifact is superseded by this unapproved review record.
