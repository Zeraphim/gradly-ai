# Gradly design

The deployed repository supplies the Gradly logo, blue book mascot, Plus Jakarta Sans, rounded surfaces and tactile actions. The public home uses the original centered Gradly upload composition, refined in the blue design system. A compact mascot/speech introduction leads into one dashed document area, a direct upload heading, the PDF action and the visible URL/DOI field. Sample and resume actions sit in a compact row below. There is no outer hero frame, split-column layout, nested upload panel, decorative evidence diagram or extra disclosure. The URL/DOI field accepts any entry and the following screen says plainly that the link was noted rather than fetched.

Typography, whitespace and a single tactile upload action establish the hierarchy. At 1366×768 and 1440×900, both document inputs remain above the fold. The centered layout stacks naturally on tablet and mobile while keeping points and document navigation in the header.

The upload home, curated adventure, and research workspace share a flexible shell
with a dynamic viewport minimum height. Main content grows to keep the footer at
the bottom of taller screens; short screens and expanded content scroll naturally
without a fixed height or header-height subtraction. Home help and link-submit
controls retain 44px targets on narrow screens, including 320px widths.

The header shows My documents, practice points and help. Research adventures display their server-derived points and retain the original challenge sequence. Ten points are awarded once per solved challenge per adventure, with no claim of mastery. Root and the previously shared lab index now lead to upload. The detailed paper-example flow described below remains available at its saved case URLs.

## Fresh Adventure visual scenes

Research challenges now support optional data-driven flow, connection, comparison
and design-comparison scenes. The featured eight challenges and bonus use these
shared renderers. Evidence inspection, reasoning pins and optional predictions are
exploration; submitted selections use the existing assessment and progress system.
The scene layer uses shared Motion layout, presence and gesture behavior for card
expansion, selection, pins, reveals, feedback and saved review, extending the earlier
no-additional-animation-dependency convention below. Input state remains immediate,
server-forbidden content is removed immediately, and live reduced-motion preferences
settle movement without resetting exploration. The canonical visual tokens remain
in effect. [The motion review](ui/FRESH_ADVENTURE_MOTION.md) records the interaction
inventory, shared timings and verification limits.
See [the scene review](ui/FRESH_ADVENTURE.md) for the storyboard and verification
limits, and [SCENE_AUTHORING.md](SCENE_AUTHORING.md) for content and reveal contracts.

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

## Site-wide motion convention

Apply one interaction language across upload, processing, learning, history, review
and settings as those surfaces are changed. Motion should acknowledge input,
explain a state change or maintain spatial continuity. Equivalent interactions use
shared behavior; static or disabled elements should not suggest extra interactivity.
This is the ongoing contributor convention, not evidence that every existing screen
has already been migrated or visually verified.

| Interaction                | Consistent behavior                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Hover and press            | Restrained tactile feedback on enabled controls; hover only on fine hover-capable pointers; keyboard focus stays immediately visible         |
| Expand and collapse        | Coordinate the boundary, detail/provenance and neighboring content; protect text/icons from scaling distortion and final lines from clipping |
| Selection and validation   | Native state updates immediately; a subtle indicator may transition without delaying input or implying an unsaved success                    |
| Insert, remove and replace | Brief interruptible presence and layout changes with stable identity; no replay for restored content; remove revoked content immediately     |
| Navigation and disclosure  | Preserve orientation, focus and drafts; make exiting controls inert and return focus safely when their content closes                        |

The shared `sceneTiming` in
`apps/web/src/research/scenes/scene-motion.tsx` is the current timing reference for
copy, gestures, non-bouncing layout springs, challenge arrivals, charts and connection
emphasis. Reuse these choices through shared primitives rather than accumulating
per-screen timing variants. Prefer Motion for coordinated layout, presence and
gestures. Simple existing style transitions can remain when they follow this
convention. Avoid decorative loops, long staggers, artificial input delays and
animation-driven progression.

The operating-system and saved application preferences both apply live. Enabling
reduced motion must settle active movement without remounting controls, moving focus
or losing state. Information stays usable without animation. Give transforms one
owner so global press rules, arrival effects and Motion do not multiply each other.

Authored quest choices use a borderless soft blue fill and deeper blue text when
selected, with a filled letter badge and a small badge emphasis. The existing
shared hover/press gesture supplies tactile feedback; selection never implies
correctness before checking. Pointer selection has no extra outline, keyboard
focus stays visible, and reduced motion removes the badge transition.

The current Motion implementation and its style selectors are research-scoped.
Adopting it on another screen requires checking feature-provider ownership, styling
scope and projection-reset assumptions. Share the smallest appropriate primitive
within that task; this convention does not call for a site migration on every edit.
See [gradly-motion](../.agents/skills/gradly-motion/SKILL.md) for the working procedure
and [scene mechanics](SCENE_AUTHORING.md#motion-and-accessibility) for evidence-specific
reveal and connector rules. No motion may retain newly forbidden findings, access-
restricted content or a result that the server has withdrawn.

## Existing motion and icon implementation

### Authored quest motion and study-design activity

The authored texting quest replaces outgoing task content immediately and focuses
the incoming heading after it mounts. Its brief entrance uses the shared copy
timing. Answer controls stay available immediately and use the shared gesture
timing without an entrance stagger. Question and measurement previews update
within a retained surface; the attention slider tracks the learner's input directly.
Chart labels sit outside the animated bar fill so their text keeps its normal size.
Routine motion reuses the existing 120 ms gesture, 160 ms copy, 220 ms connection
and 300 ms chart timings. Active vertical chart marks settle to their full size
when reduced motion is enabled, without replaying when it is disabled again.

The design choice now uses `scenes/StudyDesignVisual.tsx`. One schematic stays
mounted as the learner compares observing groups, random assignment and
self-selection. Its route changes through the selected grouping rule while group
labels and the outcome update immediately. The same diagram remains after an
answer check; the source procedure summary appears only with resolved feedback.
Desktop pairs the diagram with the answer choices, while smaller screens stack
them. The diagram is illustrative, has no participant counts or early findings,
and has a live textual equivalent. The older timed assignment illustration and
replaced plan-list styles were removed.

The renderer accepts structured plan text, but its current integration is the
authored sample. It does not add a new generated scene family or establish support
for arbitrary papers.

### Choices remain visible beside visuals

All visual questions in the authored quest share one desktop layout: the heading
and source note above, visual on the left, and answer controls on the right.
The layout starts at 1000 CSS pixels, with shorter-window spacing and a bounded
chart height. It removes the old single-column arrangement that pushed choices
below the pinned action bar. No answer text is clipped, scaled down to fit, or
placed in an inner scrolling panel. Smaller screens retain a readable stacked
flow and normal page scrolling. Portrait windows at least 1000 pixels wide also
stack when their height exceeds 1.25 times their width, because they have
the height for it.

Each quest screen is centered between the progress bar and the action bar
instead of leaving an empty band above the actions. Desktop windows 940, 1200
and 1400 pixels tall scale quest type, spacing and visuals by 1.18, 1.25 and
1.4 through the `--qs` property, so taller windows fill with content. Shorter
windows and screens under 1000 pixels wide keep their original sizes.

The chart's duplicate table is available through the native "View values as a
table" disclosure. Opening it keeps the desktop choices in place. The SD caution
appears when variation is actually shown. The diagram-specific desktop rules now
use the same question layout rather than maintaining a second layout in its CSS.

The browser regression derives its cases from every authored choice in
`textingQuest`, so newly added questions enter the layout check automatically.
It checks full label rectangles, minimum target height and pointer coverage above
the action bar, without page scrolling, both before and after Help is opened.
Window sizes and verification limits are recorded in [TESTING.md](TESTING.md).

Research controls use the same Lucide SVG family as the original application, including actions, agent roles, selection marks and page navigation. Icons remain decorative beside descriptive text; icon-only controls retain accessible labels.

Use short transform-based arrivals for route/question changes, immediate response-choice states, and a one-off mascot flourish at the paper reveal. Real pending actions show a loading icon; status icons correspond to saved backend states. Buttons press to scale 0.96 over 150ms with ease-out, alongside the existing tactile extrusion, without changing layout size or moving neighboring controls. Disabled and keyboard-focused actions do not scale; data-static opts out. Hover cues apply to fine pointers. No background decorative loops are introduced. The later Fresh Adventure layer uses Motion as described above; the 150-millisecond scale treatment describes existing style-based controls, not a second timing standard for new shared components.

OS reduced-motion preferences and the saved interface setting disable entrances, spinners and hover/press movement. Text labels and progress values remain available when motion is disabled.

## Visual verification

Hero and research workspace screenshots were inspected at 1440, 768 and 390 CSS pixels. Browser assertions check overflow, PDF/link order and automated accessibility rules. This establishes responsive behavior for those cases; it is not a claim of pixel-identical Stitch reproduction or complete WCAG conformance. See `TESTING.md` for the checks and remaining limits.

## Skill-guided refinement

The final pass applies the supplied [jmo-skills better-ui guidance](https://github.com/23jmo/jmo-skills/tree/6082bf2c472857d6cfda48995ab985b69345aac6/skills/better-ui) and clear technical English guidance. It retains Gradly’s structural borders, blue palette, density, mascot and extrusion. Inline SVG icons use absolute stroke widths, with a stronger stroke beside action labels. Hover styles require a fine, hover-capable pointer. Frequent answer changes have no entrance animation, while occasional view and progress feedback remains brief. Native confirmation dialogs contain scrolling and return focus. See `UI_POLISH_REVIEW.md` for inspected scope and remaining verification limits.

## Brand asset delivery

The original PNG artwork remains unchanged. `scripts/optimize-brand.mjs` generates lossless WebP crops for the logo and individual mascot poses with optional local `cwebp`; builds use the committed derivatives and need no image tooling. All ten decoded crops were compared pixel for pixel with their original source regions. The library's brand-image payload fell from 5,755,210 to 718,904 bytes (87.5% smaller), without resampling the artwork. The browser check confirms the front door no longer requests the large PNG sheets.

## Paper workspace

The upload-first home keeps the original centered Gradly composition: mascot and
speech above one upload card, the PDF action, the visible URL/DOI field and the
sample/resume row. The interim editorial hero, its decorative paper schematic and
the separate "Preview details" disclosure were removed: they competed with the
single upload action and repeated what the flow already says. The prepared study's
DOI opens its authored quest. Other links stay on intake with a limitation message
and choices to upload a PDF or open the prepared-study library. They never
silently substitute another study.

The home is styled by `styles.css` alone. The interim `paper-home.css` and
`paper-context.css` were deleted, and the shared paper surfaces now live in
`paper-story.css`, imported once in `main.tsx`.

PDF preparation and processing share Upload → Review → Prepare → Play, using actual local/server state.
After extraction, desktop places the original PDF beside extracted text and the
explicit processing decision. Mobile puts text review and the decision first.
Replacement, cancellation, OCR notices and the original-PDF link remain available.
The original viewer is browser-provided; a blank embedded viewer has a labeled
open-original fallback.

### Paper identity, story and source

`PaperIdentity.tsx` shows the reference study's published identity — title,
authors, journal issue and DOI — from the authored `paperCitation` in
`research/paper-context.ts`. The sample job exposes no citation, so this identity
is authored, never upload-derived. It remains part of curated preparation.
Uploaded live and sample jobs now share `ProcessingPage` and `PreparationTrack`.
The texting quest (`TextingQuest.tsx`) introduces and tests the prepared sample after preparation, one decision per screen (the four-chapter
`PaperStory` remains on the classic curated route), and the upload-first home's
sample entry opens the prepared-study library.
The upload's source, consent and saved stages stay separate from authored
study context. Read the [intake notes](ui/INTAKE_PROCESSING.md) for scope,
state behavior, integration proposals and verification limits.

`PaperStory.tsx` replaces the four-tab context map. It is one persistent stage with
four chapters — the question, the setup, the measure and the edge. One set of
objects (the question, the cohort, both conditions, the session strip and the scope
chips) carries across the chapters that use them, so the learner watches one study
take shape instead of reading four panels. An object a later chapter no longer
needs leaves the frame at zero opacity instead of lingering as faded, unreadable
copy; the chapters are short enough that nothing has to be remembered from a
shrunken miniature. Each chapter carries a kicker, one
mascot line, a heading, one sentence and one optional disclosure holding the deeper
paraphrase, its caution and its source. The chapter rail, Back/Next, left/right
arrows and a horizontal swipe all move the same chapter index; `aria-pressed`,
`aria-controls` and one polite live region carry the state for assistive
technology. The stage itself is `aria-hidden`: it is a qualitative schematic, not
participant-level data, and the caption is the readable record.

Numerical findings remain behind the investigation's existing gates, and the paper
identity stays outside the story region. Authored reference context stays separate
from the upload's real extracted text. Source text and stage audits have separate
disclosures on the preparation screen. The context appears in curated preparation;
uploaded sample jobs use the shared preparation screen and the existing player.

### Story geometry and motion

Chapter layouts are described in a 0–100 grid per stage node, with scale and
opacity, in `PaperStory.tsx`. The stage measures itself with a `ResizeObserver` and
converts the grid to pixels, so chapter changes animate `transform` and `opacity`
only. This avoids animating layout dimensions; browser performance still requires
measurement. Narrow
stages use a second, vertical layout for the same objects; the session strip turns
into a vertical timeline below 620 CSS pixels. The stage is clipped, so objects that
leave a chapter's composition leave the frame.

Emphasis is carried by scale and position, never by fading text. Every object that
is on the stage keeps full opacity and a white card, so its text holds the same
contrast at any scale; the inactive set is either fully present or fully out of the
frame. Node boxes scale from their own centre, which is also where the layout point
sits (`transform-origin: 0 0` on the node), so an object lands exactly on its grid
coordinate at every scale instead of drifting as it grows or shrinks. A fully
transparent node is
outside the accessibility tree for the axe contrast audit, while any partially
faded copy would be measured and could fail — which is why the layouts never use a
faded middle state.

The story reuses `SceneMotion`, `sceneTiming`, `motion.swap`, `motion.page`,
`motion.gestures` and `PresenceBlock` rather than adding a second timing table.
Chapter changes are a 0.24-second eased swap; the caption replaces through the
existing presence block with exiting content inert and hidden. Controls answer a
press with the shared 0.97 scale and 2-pixel hover lift on a fine pointer. With OS
or saved reduced motion, chapters change instantly and controls sit at rest; the
preference is observed live, and turning it on settles active movement without
remounting the stage, moving focus or changing the selected chapter.

Chapter changes use functional state updates, so batched, reversed activations land
on the last pressed chapter instead of queueing choreography. A stroke-width-free
decoration (the cohort's connector legs) is a CSS transition keyed off the current
chapter, and it is removed under reduced motion by the existing global rule.

### Adopted and rejected reference guidance

The `high-end-visual-design` skill was used as a visual reference for this pass.
Adopted: one dominant action per screen, double-bezel depth (border plus soft
shadow) instead of hairlines, generous whitespace with a tighter type scale,
staggered entrance kept short, transform/opacity-only motion, and a trailing icon
that shifts on hover. Rejected: banned-font substitution (Gradly keeps its
self-hosted Plus Jakarta Sans), dark glass overlays and full-screen menu morphs
(they do not fit a light, single-purpose learning flow), and long scroll-reveal
choreography (it fights the "no decorative loops, no animation-driven progression"
rule in the motion convention above).

The public reference study and its boundaries are recorded in
[INTERACTION_REFERENCES.md](INTERACTION_REFERENCES.md#19-october-2026-public-runtime-study-for-the-paper-workspace).
Local browser evidence and verification limits are recorded in the [intake verification history](ui/INTAKE_PROCESSING.md#verification-history).

Live document preparation also leads with the actual filename and extracted text
before consent, followed by saved stage summaries. Its visual changes do not add
paper-specific generated context or change the generation pipeline.

Local implementation snapshots: [home](ui/paper-workspace/home-desktop.png),
[home on a phone](ui/paper-workspace/home-mobile.png),
[PDF review](ui/paper-workspace/pdf-review-desktop.png),
[paper story](ui/paper-workspace/paper-context-desktop.png) and
[paper story on a phone](ui/paper-workspace/paper-context-mobile.png).

## Quest vocabulary and copy

The learner-facing journey used five words for one thing — adventure,
investigation, challenge, checkpoint and quest — and gave the number of
decisions as eight, eight and six. The authored quest-flow reference (one guided
path, eight core decisions, one optional transfer decision) settles both. These
rules govern wording only: no screen, route, layout or count of work changed.

**Glossary.** _Quest_ is the whole journey, _decision_ is one learner turn, and
_investigate_ stays a verb for the activity. "Adventure", "challenge",
"checkpoint" and "investigation" no longer name the container anywhere in the
interface. The header navigation, history, dialogs and completion screen follow
the same glossary, and buttons use the reference labels: "Build my quest",
"Start quest", "Try another quest", "Give me a hint", "Save and exit quest".

**Counts are derived, never typed.** The completion recap reads
"8 decisions · 1 bonus" from `lesson.questions` instead of the hard-coded "Six
completed checkpoints". The path-picker pill counts the texting quest's required decisions (currently
10), because Start quest opens that quest, and the legacy
home no longer offers a "six-quest adventure". A number in prose is treated as a
claim that the data must be able to produce.

**Provenance is stated once per screen.** Step 2 had accumulated four overlapping
claims ("no AI calls" in the banner, the citation line and twice in the source
card) plus two step counters six lines apart. The banner now reads "Reference
study · authored · no AI calls"; the line under the citation is the only place
that says the context is not an analysis of the upload; the source card keeps a
single step count. The duplicate action note and preparation paragraph were
removed. Nothing became
less honest: the banner still marks every sample screen, live uploads keep their
own stage count, and the findings gate is still named under the story.

### Source review sheet

The upload and review screen had grown into a stack of nested boxes: a progress
bar, a mascot line, a card, a dashed drop target, a file strip, a preview frame,
a checked-document panel, an extracted-text panel and a filled blue "Your next
step" panel — each with its own micro-label. Two states were also telling the
learner the same thing at the same time (the mascot and the next-step panel both
explained the sample).

**One column width.** Every block on the page now shares a 980px sheet: steps,
speech, card, privacy line and reference card. The empty card and the reference
row no longer drift to different widths.

**One statement per state.** Before a file, the mascot explains what will happen;
the card adds the file limits and the primary button. After a check, the mascot
line disappears, the header loses its eyebrow and subtitle, and the review heading
becomes a single row — check, "Document checked", page count — instead of a
heading plus a sentence. "Extracted text" and "Embedded text · compare with your
original PDF" are gone; the page selector already names the page, and the OCR line
still appears when OCR was used. The preview help line is gone because
"Open original PDF" sits in the same frame header.

**One action.** The filled blue panel became a hairline rule, one sentence and one
button. Its sentence is the honest one that matters — that the sample study is
authored and the upload is not analysed — and the storage footnote stays. The
primary button now spans the column, so it reads as the single next step rather
than a card inside a card.

**Text that scrolls, not text that cuts.** The extracted text keeps its scroll
container but gains a soft bottom fade and extra bottom padding, so the edge reads
as "there is more" instead of a sentence sliced in half. The PDF frame asks the
built-in viewer to fit the page width (`#view=FitH`) and tops out at 440px, which
keeps both columns close to the same height. The reference-study row is a single
line: icon, title, description, action — its label no longer wraps into a column
of words at narrow widths.

## Authored results exploration

The sample quiz-results decision begins with an ungraded prediction (Text lower,
About the same, No text lower). The score plot, numerical table and assessed
interpretations stay absent until the learner selects a prediction and explicitly
reveals the reported means. The chart keeps its axes and group positions; its
fills enter using the shared chart timing. Reduced motion settles them immediately.
Revealing returns focus to the question heading, and native radios support keyboard
selection without the assessment shortcuts capturing prediction input.

The prediction remains visible beside the answer choices after reveal and is saved
with the quest in tab session storage. It awards no points and never marks an
assessment correct. Refresh retains both prediction and reveal; older saved resolved
results reopen as resolved. Restart clears this exploration with the quest.

Compare means adds a bracket between the two reported heights and a calculation
prompt. The worked 9.59 percentage-point difference appears only after the existing
answer feedback. The next decision reveals ±1 SD on request and distinguishes score
spread from confidence intervals or min/max. No individual observations are invented.
Resolved variation decisions restore their visible SD bars on refresh. The SD marks
use a dedicated `quest-sd` class, avoiding the shared error-message padding, margin
and rounded border that previously distorted their geometry.

Desktop retains the shared plot/answer grid through prediction, reveal and comparison.
Narrow screens retain natural scrolling. This implementation is the authored texting
sample; arbitrary-paper generation and its evidence-release contract are unchanged.

## Three-paper activity pilot

`#/research/activities` is a local, authored practice area, linked from learning
paths. It loads the existing `InvestigationScene` renderer with three source-backed
cases: a randomized experiment (Bobek & Tversky, Experiment 2), longitudinal
observations (Watts et al.) and purposive interviews (Lukashe et al.). It reuses
comparison, flow and evidence-connection scenes. This pilot does not generate
content from uploads or award server points.

The experiment uses an optional prediction and explicit reveal; its worked mean
difference waits for interpretation feedback. The observational diagram labels
measurement timing and analysis inputs, without presenting a causal mechanism.
The interview activity uses paraphrased accounts and contextual themes, with no
invented quotations or population rates. Each activity links to its paper and
section locator. Response headings are neutral and the supported interpretation
occupies a different position in each case.

The page now uses the quest frame: a three-step paper progress row replaces the
tabs, and Check, feedback, Try again and Next paper sit in the fixed bottom bar
(Enter checks, then continues; letter keys stay with the scene). A checked
answer is locked until Try again. The limitation appears in the feedback as
"Keep in mind". Source details, the optional note and Reset fold into one "About
this paper · your notes" disclosure. After the third paper, a summary lists which
interpretations fit on the first check, with Review links, Start over and Back to
studies. On desktop, response sentences sit beside the evidence and above the
bar, including short 1000×640 windows; narrow screens scroll naturally.
Switching papers retains separate tab drafts, notes, inspected cards and pins.
Reset affects only the active paper. Custom writing
is explicitly unassessed; storage failures show a warning. The shared live motion
preferences, native controls, heading focus and feedback focus remain in use.

The pilot exposed two reusable-component issues: the outer `scene-flow` class
collided with the inner diagram's layout, and a fixed two-decimal chart rounded
reported proportions. Container variants now use `scene-kind-*`. Comparison data
may specify `decimals` from zero to six; existing scenes default to two. Generic
reveal copy now refers to reported values instead of assuming every chart shows
group means. These changes do not establish arbitrary-paper or live generation
quality. The next evaluation is independent content review and observed learner use.
