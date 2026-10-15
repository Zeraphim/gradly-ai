---
name: gradly-motion
description: >-
  Preserve consistent Gradly micro-interactions and transitions across the site
  when adding, changing, or reviewing interactive frontend components, disclosures,
  content replacement, navigation, or motion accessibility. Does not authorize a
  redesign or migration of unrelated screens.
---

# Gradly motion

Read [the site-wide motion convention](../../../docs/DESIGN.md#site-wide-motion-convention)
for interaction intent and [TESTING.md](../../../docs/TESTING.md) for validation.
Apply the same motion language to equivalent interactions across upload, processing,
learning, history, review and settings. Keep static content static unless movement
explains a change. Preserve Gradly's existing visual identity.

## Work on an interaction

- Identify the trigger, immediate semantic state, changing content, neighboring
  layout and reduced-motion result. Match an existing interaction before inventing
  a variation. Work only on the requested surface.
- Reuse shared controls and timings. The current Motion reference is
  [scene-motion.tsx](../../../apps/web/src/research/scenes/scene-motion.tsx),
  including `sceneTiming`, scoped feature ownership and live preference handling.
  Prefer Motion for coordinated layout, presence and gestures. Existing simple
  style transitions can remain when they follow the same policy.
- Within investigation scenes, reuse the existing card, assembly, disclosure and
  transition components. Outside research, inspect styling and provider boundaries
  before reuse: `.research-lab` styles and the projection reset are scoped by the
  current implementation's assumptions. Extract only the shared primitive needed
  by the requested change; do not copy a second timing table, import the entire
  investigation flow, add a parallel animation library or migrate unrelated pages.
- Give each animated property one owner. Audit global press scaling, `data-static`,
  arrival effects and reduced-motion overrides before adding Motion transforms.
  Load layout-capable features for layout work and reuse a subtree's feature owner.
- Keep checked/expanded state, validation, focus and request handling immediate.
  Animate geometry and presentation independently. Avoid text stretching with
  position-only children, and coordinate following content when a container resizes.
- Use stable identities and interruptible transitions. Rapid reversal, resizing,
  pending/disabled controls and navigation must not queue choreography, lose drafts
  or replay entrances for restored content. Hover requires a fine hover-capable
  pointer. Observe both motion preferences live and settle active movement in place.
- Keep exiting controls inert and hidden from accessibility navigation, with safe
  focus return. Remove content immediately if permission or evidence eligibility is
  revoked; an exit animation must never retain forbidden information.

## Investigation-specific details

Read [SCENE_AUTHORING.md](../../../docs/SCENE_AUTHORING.md#motion-and-accessibility)
when working on evidence scenes, findings or connectors. It documents public-response
reveal boundaries, same-paint connector measurements and bounded tracking cleanup.
Motion remains frontend policy, independent of paper content and generated data.
The [Fresh Adventure motion review](../../../docs/ui/FRESH_ADVENTURE_MOTION.md)
is implementation evidence, not site-wide browser verification or design approval.

## Verify and maintain

Exercise the changed interaction with rapid input, keyboard/focus, disabled/pending
states, restore/navigation and live reduced motion as relevant. For scene changes,
use the motion, connector and workspace regressions listed in TESTING.md; for other
screens, choose their relevant checks rather than assuming scene coverage applies.
Follow the current task's computer-use authorization and report simulated-document
checks separately from actual browser layout and perceived smoothness.

Update the shared primitive and this routing when their boundaries change. Maintain
canonical behavior in DESIGN.md, scene mechanics in SCENE_AUTHORING.md and observed
verification in the applicable review record. Do not duplicate those documents here.
