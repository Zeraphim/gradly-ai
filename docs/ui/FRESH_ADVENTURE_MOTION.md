# Fresh Adventure motion review

## Status

Proposed design evidence. This task extends the existing scene implementation without
claiming a separate design approval or browser visual inspection.

## Owners

Unassigned.

## Interaction inventory before implementation

The existing scene renderer uses Motion 14.3.0 with `domAnimation`: chart bar
transforms, connector emphasis and feedback opacity are animated. Evidence details,
response symbols, pins, comparison replacement and saved-review disclosures change
immediately. The process diagram measures geometry only on renders and resizes,
which cannot keep lines attached throughout transform-based layout animation.

| Code | Trigger                                           | Changing elements                                 | Surrounding layout                                   | Reduced motion                                              |
| ---- | ------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| M1   | Inspect, collapse or switch an evidence card      | Card boundary, detail, provenance, hover/press    | Neighboring cards, response section and scene footer | Immediate settled card with the same accessible description |
| M2   | Hover, press, select or deselect a response       | Surface transform and connection symbol           | No necessary content resize                          | Immediate native checked state and static emphasis          |
| M3   | Pin/unpin evidence, including last removal        | Assembly boundary and individual tokens           | Following response section and footer                | Add/remove immediately without token movement               |
| M4   | Card motion, selected connections, resize         | Flow endpoints and path emphasis                  | Diagram nodes and columns                            | Measure settled geometry once, no tracking loop             |
| M5   | Choose prediction and explicitly reveal findings  | Prediction summary, cover, chart and bars         | Following choices and scene footer                   | Immediate reveal, no entrance replay on resume              |
| M6   | Server feedback, retry or revision                | First-response summary, difference and resolution | Scene and feedback region                            | Immediate update, forbidden content removed synchronously   |
| M7   | Continue to another challenge or enter bonus      | Incoming challenge content                        | Challenge container                                  | Immediate content and focus, no retained outgoing findings  |
| M8   | Open/close saved review or inspect reviewed scene | Disclosure boundary and existing scene primitives | Neighboring review entries                           | Immediate disclosure with native button semantics           |

Noninteractive recap rows should not acquire hover or press behavior. Initial
render, reload and saved drafts should settle without replaying an entrance.

## Constraints

Preserve Gradly's colors, typography, tactile controls, reveal rules, native input
semantics, progress and draft ownership. Immediate input acknowledgement must never
wait for animation or imply an unconfirmed server result. Do not alter the content
contract or require future generated papers to carry motion instructions.

The implementation must remove forbidden feedback immediately on retry, challenge
change or navigation. Exit presence is only appropriate for content that remains
permitted. Exiting interactive content must be inert and hidden from accessibility
navigation, with focus returned to its disclosure control when needed.

## Implementation and verification

The shared layer is `apps/web/src/research/scenes/scene-motion.tsx`. It loads
layout-capable `domMax` once per scene subtree, scopes layout groups by instance,
and shares non-bouncing layout springs, copy, gesture, chart and challenge timing.
Position-only children protect text while their card boundaries resize. Native
selection and expanded state update immediately. No animation delays progression.

| Coverage | Implementation                                                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1       | `EvidenceCard.tsx`: boundary/layout correction, detail/provenance crossfade, immediate accessible description and fine-pointer hover/press                      |
| M2       | `InvestigationScene.tsx`: native radio/checkbox state, gesture surfaces and fixed-size response-symbol presence                                                 |
| M3       | `EvidenceAssembly.tsx`: layout slot, token presence and sibling repositioning, reversible last-item removal                                                     |
| M4       | `FlowDiagram.tsx` / `flow-connectors.ts`: Motion-value paths, same-paint geometry writes and one bounded tracking loop for transformed nodes                    |
| M5       | `ComparisonScene.tsx`: preserved prediction, cover exit, reveal focus, explicit-only bar entrance and coordinated following content                             |
| M6       | `InvestigationScene.tsx` / `SceneFeedback`: layout-aware first response, allowed difference/resolution and feedback entry, immediate restricted-content removal |
| M7       | `SceneTransition` / `ResearchApp.tsx`: incoming-only keyed challenge/bonus entry, immediate outgoing removal and retained workspace focus/draft rules           |
| M8       | `SceneJourney.tsx` / `SceneDisclosure.tsx`: shared review inspection, layout-aware disclosures, inert exits and focus return                                    |

Both motion preferences are observed live; changing either settles active movement
in place and preserves focus, selection and drafts. Hover is limited to fine
pointers. No entrance replays on initial/restored content. Scope markers give Motion
ownership of transforms and suppress competing global press/arrival effects.

Local validation on 2026-10-16: `npm run check` passed type checks, 21 Node
checks, 145 research checks and all production builds. Formatting and diff checks
passed. The context index was regenerated and its audit passed with 46 warnings
for missing reviewed baselines and affected uncommitted changes. These warnings
remain visible; no approval or baseline was fabricated.

Regression evidence lives in `tests/research/scene-motion.test.ts`,
`tests/research/flow-connectors.test.ts` and `tests/research/scenes-workspace.test.ts`,
with retained component, service and fixture checks described in
[TESTING.md](../TESTING.md). Real Motion runs in a simulated document. Connector
checks supply transformed geometry and a controlled frame clock. These checks do
not establish actual rendered layout or perceived animation quality.

Browser inspection is outside the current authorization. Browser layout, animation
smoothness, mobile touch, real responsive connector attachment and assistive-
technology behavior remain unverified. No design approval, live model quality,
learning benefit or hosted deployment is asserted.

## Manual walkthrough

Run `npm run dev`, open `http://127.0.0.1:5173/#/research/learn`, choose **Start
investigation**, then **Begin investigation**. In the first challenge, rapidly
expand/collapse and switch evidence cards, pin/unpin including the last item, and
select responses. Inspect text, borders, sibling movement and focus. Continue
through the flow diagrams, prediction/reveal, feedback/retry, bonus, recap and
saved review. During movement, toggle the saved motion setting and the device's
reduced-motion preference. Repeat at narrow width and confirm connector endpoints
stay attached while cards and columns move, with no draft loss or delayed input.

## Related evidence

- [Scene storyboard](FRESH_ADVENTURE.md)
- [Scene authoring contract](../SCENE_AUTHORING.md)
- [Design conventions](../DESIGN.md)
- [Test commands and limits](../TESTING.md)
