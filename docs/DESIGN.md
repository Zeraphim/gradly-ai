# Gradly design

The deployed repository supplies the Gradly logo, blue book mascot, Plus Jakarta Sans, rounded surfaces and tactile actions. The public home uses the original centered Gradly upload composition, refined in the blue design system. A compact mascot/speech introduction leads into one dashed document area, a direct upload heading, the PDF action and the visible URL/DOI field. Sample and resume actions sit in a compact row below. There is no outer hero frame, split-column layout, nested upload panel or decorative evidence diagram. Preview limits remain expandable.

Typography, whitespace and a single tactile upload action establish the hierarchy. At 1366×768 and 1440×900, both document inputs remain above the fold. The centered layout stacks naturally on tablet and mobile while keeping points and document navigation in the header.

The upload home uses a flexible shell with a dynamic viewport minimum height.
Its main content grows to keep the footer at the bottom of taller screens;
short screens and expanded content scroll naturally without a fixed height.
This shell applies only to the upload home.

The header shows My documents, practice points and help. Research adventures display their server-derived points and retain the original challenge sequence. Ten points are awarded once per solved challenge per adventure, with no claim of mastery. Root and the previously shared lab index now lead to upload. The detailed paper-example flow described below remains available at its saved case URLs.

## Paper exploration

**Start → Read → Choose → Try → Recap** replaces the free-form evidence board. Reading presents one short note at a time; full detail and source information remain available. Saving notes is optional. The duplicate claim dial, evidence filters, required pinning, repeated instructions and visible writing/confidence forms are removed from the main path. Feedback appears after an explicit answer check, and editing an answer invalidates that check.

The five numbered steps are actual navigation controls; unavailable future steps are disabled. Desktop reading has a compact note list; mobile keeps the note counter and Back/Next controls without a second row of numbered navigation. All stages reserve space for the persistent action dock. The recap shows four short ideas with personal notes and full source detail collapsed. Existing tab drafts are retained.

Native radios, buttons, checkboxes and disclosures support keyboard use. Answer feedback receives focus, help/reset controls restore focus, touch actions are at least 44px high, and text fields use 16px input text. OS and saved reduced-motion preferences disable nonessential movement. The 14 prototype browser scenarios cover both complete trails, state recovery, less than 300 visible main-content words per tested default stage, overflow and axe checks at 1440, 768 and 390 CSS pixels. These checks do not establish learning benefit or full WCAG conformance.

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

## Viewport refinements

Research learning-path pages reset the original hero's inherited width/padding within `.research-lab`. The path choice is more compact, mobile navigation stays on one row below the brand, and document review uses a single page selector with previous/next actions. Text stays left-aligned at a readable size. Desktop pairs the original PDF with the review/confirmation area; mobile prioritizes the review before the PDF. Secondary privacy/format details are expandable. The ready action appears above the audit stack.

## Motion and icon system

Research controls use the same Lucide SVG family as the original application, including actions, agent roles, selection marks and page navigation. Icons remain decorative beside descriptive text; icon-only controls retain accessible labels.

Use short transform-based arrivals for route/question changes, immediate response-choice states, and a one-off mascot flourish at the paper reveal. Real pending actions show a loading icon; status icons correspond to saved backend states. Buttons press to scale 0.96 over 150ms with ease-out, alongside the existing tactile extrusion, without changing layout size or moving neighboring controls. Disabled and keyboard-focused actions do not scale; data-static opts out. Hover cues apply to fine pointers. No background decorative loops or additional animation dependency are introduced.

OS reduced-motion preferences and the saved interface setting disable entrances, spinners and hover/press movement. Text labels and progress values remain available when motion is disabled.

## Visual verification

Hero and research workspace screenshots were inspected at 1440, 768 and 390 CSS pixels. Browser assertions check overflow, PDF/link order and automated accessibility rules. This establishes responsive behavior for those cases; it is not a claim of pixel-identical Stitch reproduction or complete WCAG conformance. See `TESTING.md` for the checks and remaining limits.

## Skill-guided refinement

The final pass applies the supplied [jmo-skills better-ui guidance](https://github.com/23jmo/jmo-skills/tree/6082bf2c472857d6cfda48995ab985b69345aac6/skills/better-ui) and clear technical English guidance. It retains Gradly’s structural borders, blue palette, density, mascot and extrusion. Inline SVG icons use absolute stroke widths, with a stronger stroke beside action labels. Hover styles require a fine, hover-capable pointer. Frequent answer changes have no entrance animation, while occasional view and progress feedback remains brief. Native confirmation dialogs contain scrolling and return focus. See `UI_POLISH_REVIEW.md` for inspected scope and remaining verification limits.

## Brand asset delivery

The original PNG artwork remains unchanged. `scripts/optimize-brand.mjs` generates lossless WebP crops for the logo and individual mascot poses with optional local `cwebp`; builds use the committed derivatives and need no image tooling. All ten decoded crops were compared pixel for pixel with their original source regions. The library's brand-image payload fell from 5,755,210 to 718,904 bytes (87.5% smaller), without resampling the artwork. The browser check confirms the front door no longer requests the large PNG sheets.
