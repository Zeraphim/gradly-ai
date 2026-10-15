# Gradly UI polish review

This pass uses the requested [jmo-skills](https://github.com/23jmo/jmo-skills/tree/6082bf2c472857d6cfda48995ab985b69345aac6) source at commit `6082bf2c472857d6cfda48995ab985b69345aac6`. The relevant skills are `better-ui`, its surface/icon/motion/performance recipes, `animate`'s frequency and feedback gates, and `ste` for precise support and recovery copy. The repository was inspected locally; no installation script, unrelated service integration or new animation dependency was needed.

Gradly's blue palette, supplied artwork, rounded forms, structural borders and tactile extrusion are deliberate project conventions. They remain intact. Motion serves action feedback, state indication or occasional arrival; routine answer choices remain immediate.

## Interaction and recovery

| Severity | Location                                             | Before                                                                                         | After                                                                                                                                                      | Why                                                                           |
| -------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| HIGH     | `research/ResearchApp.tsx`, `client-state.ts`        | Unsubmitted choices and writing vanished on support navigation.                                | Version- and challenge-bound tab drafts survive help, exit and refresh. Submitted progress stays authoritative.                                            | Broken interactions take priority over visual polish.                         |
| HIGH     | `research/UploadPage.tsx`, `useDocumentUpload.ts`    | Departed workspaces could receive late upload/consent results.                                 | Guarded callbacks, request detachment/cancellation, file-scoped preview URLs and retained parent drafts.                                                   | A delayed response must not redirect or overwrite a learner's current screen. |
| HIGH     | `research/HistoryPage.tsx`, `ResearchApp.tsx`        | Failed deletion feedback could sit behind the native modal; refresh failures left stale cards. | Dialog-local errors and pending labels, safe initial focus, disabled duplicate delete actions, explicit history retry and immediate document invalidation. | Failure and progress must be visible where the action happens.                |
| MEDIUM   | `research/HistoryPage.tsx`, `SupportPages.tsx`       | Initial empty arrays and unknown configuration looked like confirmed empty/unavailable states. | Distinct loading, ready and error states; neutral recovery copy; explicit availability check/retry.                                                        | Clear English separates confirmed behavior from unknown state.                |
| MEDIUM   | `research/ResearchApp.tsx`, `components/Welcome.tsx` | Submission refocused the long question; completed hero sessions appeared unfinished.           | New feedback receives focus, support returns to context, completed sessions offer review, and incomplete links recover.                                    | Keep attention on the result of an action.                                    |

## Surfaces, icons and motion

| Severity | Location                                          | Before                                                                                               | After                                                                                                                               | Why                                                                   |
| -------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| HIGH     | `styles.css`, `research/styles.css`               | Some hover styles also applied to touch; the original surface could still move under reduced motion. | Hover-capable pointer gates and explicit system/manual movement overrides across both surfaces.                                     | Hover must not latch on touch; movement respects learner preference.  |
| MEDIUM   | `styles.css`, `research/styles.css`               | Comparable entry actions had different press behavior and routine choice entrances.                  | 150ms ease-out scale 0.96 on enabled pointer actions, keyboard/static opt-outs, immediate choice states and no layout movement.     | Consistent, interruptible feedback; frequent interactions stay quick. |
| MEDIUM   | `research/icon.tsx`, `styles.css`                 | Small icons became thin beside bold action labels.                                                   | One Lucide SVG family, currentColor, absolute stroke width and stronger action strokes.                                             | Match icon weight to adjacent text and preserve small-size clarity.   |
| MEDIUM   | `research/UploadPage.tsx`, `research/styles.css`  | Embedded PDF failure left a blank area with no clear alternative.                                    | A named original-preview surface and usable open-original link; page-selected extracted text and viewport-prioritized confirmation. | Keep the next action clear when browser preview support varies.       |
| LOW      | `research/HistoryPage.tsx`, `research/styles.css` | Records and source documents had little hierarchy.                                                   | Separate semantic sections, timestamps, actual returned record counts and purposeful empty states.                                  | Group information around the learner's decisions.                     |

## Verification

- 73 unit/service checks; 21 Chromium browser scenarios.
- TypeScript, production build and Vercel source packaging.
- Full reference and local no-key sample flows, draft restoration, upload extraction/OCR, ownership, review/history, deletion and recovery.
- Viewports at 1440, 768 and 390 CSS pixels, plus touch emulation; automated accessibility checks on tested primary/supporting states.
- Press-scale/layout checks, request-bound loading, reduced-motion controls, native-dialog focus/Escape/scroll containment and configuration reuse.
- Normal-speed rendered review of the learning paths, history, challenge and document review. Exported images accompany the local deliverable.

Not verified: a 10%-speed DevTools animation-panel review, physical-device tactile feel, Safari/Firefox, assistive-technology sessions, new live Nebius generation, remote libSQL and hosted OCR. Local sample mode remains clearly labeled and rejected in production/Vercel. These checks do not certify accessibility or academic quality.

**Approve** for the inspected local source and browser scope. No known HIGH finding remains in that scope. Hosted/live acceptance remains separate in `TESTING.md`.
