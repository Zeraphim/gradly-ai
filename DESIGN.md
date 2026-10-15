# Gradly design

The deployed repository is the primary reference, as requested in the follow-up brief. Preserve its Gradly logo, blue book mascot, hero headline, paper illustration, Choose PDF control and paper-link field below the control. The user's later blue-palette instruction supersedes the Stitch export's original green primary color.

## Reference inventory

The original export was inspected at `stitch_texting_study_research_adventure` in Downloads. Its four screen folders provide these references:

| Screen                            | Reused design language                                                         | Functional/content correction                                                 |
| --------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `upload_paper_start_adventure`    | Mascot speech bubble, dashed upload area, tactile controls                     | Real PDF validation, preview, confirmation, cancellation and recovery         |
| `ai_agents_crafting_adventure`    | Stacked agent cards, disclosures, status badges                                | Saved backend states and completed-stage counts                               |
| `challenge_6_results_reveal`      | Centered question, large answer cards, study details, hints, fixed action area | Eight-question reference sequence; hide the mean difference until submission  |
| `paper_reveal_adventure_complete` | Celebratory reveal, paper panel, review actions                                | Actual learner metrics; no invented mastery, percentile or open-access claims |

The export is a static design reference. The integrated application uses this repository's approved blue mascot assets rather than importing a second mascot. Academic content follows the supplied lesson specifications rather than erroneous placeholder copy in the export.

## Tokens and interaction

Source tokens live in `apps/web/src/styles.css` and scoped research styles in `apps/web/src/research/styles.css`.

| Purpose                  | Value                         |
| ------------------------ | ----------------------------- |
| Primary action           | `#006B93` with white text     |
| Tactile action shadow    | `#004566`                     |
| Sky-blue accent/progress | `#1CB0F6`                     |
| Pale blue surface        | `#E5F5FF`                     |
| Main ink                 | `#1B1C1C`                     |
| Muted text               | `#4E5B6E`                     |
| Main border              | `#DFE5EC`                     |
| Canvas                   | `#FBF9F8`                     |
| Typeface                 | Self-hosted Plus Jakarta Sans |

Use rounded cards, visible borders, approximately 4px tactile depth, large selection areas, native controls and visible keyboard focus. Retain amber/red for warnings and errors. Existing CSS variable names containing `green` are compatibility aliases whose values now use the blue palette.

Keep challenge content centered and reserve space for the persistent action area. At small widths, the original header places navigation on its own row. Headings scale with the viewport. Research CSS remains inside `.research-lab`, and the module loads only when opened. OS reduced-motion preferences and the learner setting disable nonessential movement.

## Visual verification

Hero and research workspace screenshots were inspected at 1440, 768 and 390 CSS pixels. Browser assertions check overflow, PDF/link order and automated accessibility rules. This establishes responsive behavior for those cases; it is not a claim of pixel-identical Stitch reproduction or complete WCAG conformance. See `TESTING.md` for the checks and remaining limits.
