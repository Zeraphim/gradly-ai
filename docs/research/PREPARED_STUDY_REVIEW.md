# Prepared-study review register

Last updated: 28 October 2026. Covers the 53 prepared studies for issues
[#31](https://github.com/Zeraphim/nebius-hackathon-submission/issues/31) and
[#32](https://github.com/Zeraphim/nebius-hackathon-submission/issues/32).

## Read this first

**No prepared study has content-owner approval.** Every card in `cards.ts` is `reviewed: false`.
Forty-five studies were written in bulk by Nemotron from stored PDFs and eight were
hand-authored as a proof set. In the original bulk output, excerpts were checked word
for word against the PDF; the other text shown to learners (evidence lines, prompts, options, explanations, takeaways)
was not. Some of it is wrong, not just easy: one question stated that a study had a
no-warning control group that the paper says was left out on purpose.

Until a study is reviewed by a person who has read its paper, treat it as a draft and do
not present it to JC or others as accurate teaching content. "Rewritten and checked
against the PDF" below means the agent compared each fact it kept or wrote with the
stored PDF. It is not approval by the content-review owner.

## Earlier rewrite pass (through `67e87d5`)

| Measure                                                                         | Before (`main`) | At `67e87d5` |
| ------------------------------------------------------------------------------- | --------------- | ------------ |
| Generated studies rewritten and checked against the PDF                         | 0               | 24           |
| Questions flagged as answerable from their own evidence (detector, lower bound) | 67 of 305       | 21 of 305    |
| Questions with a scene                                                          | 43              | 69           |
| Studies with no limitations recorded                                            | 30              | 11           |
| Questions with a garbled step label (for example "2 of 6 · , ")                 | 181             | 0            |

The detector misses paraphrased giveaways, so the flagged counts understate the problem.
For example `judging-statement-truthfulness` scored 3 of 6 before the rewrite when all six
questions were copy-from-evidence. Fewer flags is therefore a good sign, not proof.

## PR #33 review corrections — 27 October 2026

Scope: **26 studies** — the **24 rewritten generated studies** listed below plus the
revised featured studies `exercise-focus` and `sleep-school`. They contain **152
required questions**: **151 single-answer** and one multiple-answer question. The
remaining **21 generated drafts** and six other featured studies are outside this
review-fix pass. At that review point both issues remained open; this was not a claim that all 53 studies
are fixed or approved.

### F1: answer-position and length shortcuts

Correct-answer positions now vary within each study. Wrong choices describe specific
misreadings (for example, treating percentage points as a relative percentage,
confusing randomisation with blinding, or interpreting a null as proof of zero),
with feedback explaining the error. Choice text and ordering are kept in sync with
scene responses; option IDs, accepted IDs, scene targets and source excerpts are
preserved. This is an authored content correction, not a player-shuffling change.

The following audit counts **required single-answer questions only**, with length
ties counted as wins. This explains the small difference from the review's counts,
which used all 152 questions and reported 145 longest answers. The audited source
baseline is the reviewed commit `67e87d5`.

| Guessing strategy               | Reviewed commit    | After correction  |
| ------------------------------- | ------------------ | ----------------- |
| Always choose the first option  | 137 of 151 (90.7%) | 42 of 151 (27.8%) |
| Always choose a longest option  | 146 of 151 (96.7%) | 48 of 151 (31.8%) |
| Always choose a shortest option | 2 of 151 (1.3%)    | 52 of 151 (34.4%) |

Final correct positions are 42 / 38 / 37 / 34 across slots 1–4. Three-option questions
have no fourth slot. These are superficial-cue counts, not a learning-benefit or
factual-accuracy score. Reproduce the current counts without model calls:

```sh
node --import tsx scripts/audit-prepared-choices.ts
```

The content regression tests cover fixed-position strategies, both length extremes,
comparable explanatory-choice lengths (including bonuses), scene response order,
and phrase-style stage labels across all 53 studies. Short entity labels such as
“Running” and “Seated rest” are not padded to equal character counts.

`exercise-focus` q3 now asks what becomes confounded if the matching treadmill walk
is removed, instead of asking learners to repeat its stated purpose. The rest of
the shared evidence/reveal behaviour is unchanged. The puzzle-priming study's c6
also now distinguishes the replication's own blinding safeguard from explanations
of differences between studies; its stored paper describes blinding on pages 3–4.

**Example: `cursing-while-in-pain` c2.** Previously the correct answer was first and
119 characters long, beside wrong choices of 47, 26 and 46 characters. The revised
choices are 63–97 characters long and the correct answer is fourth. Wrong choices
now concern blinding, fewer trials and ordering by effectiveness, rather than a
bare “To make the study shorter.” No choice is a factual claim outside this question;
feedback explains why each wrong inference fails.

### F2: accurate scope

The register now distinguishes 24 generated rewrites from the two revised featured
studies. The PR title/body must describe all 26, identify the remaining drafts,
and report validation for the final revision rather than the original six-study batch.

### F3: consistent stage labels

The 181 one-word labels added by the rewrites now use “Read the design”, “Read the
results” or “Draw a conclusion”, matching the existing phrase style. Existing
phrases such as “Frame the question” and “Check the report” remain.

### Verification and limits

Final local commands and results are recorded in the PR body after verification.
The browser walkthrough covers all 26 studies through final paper reveal at
375×812 and 1366×768, including the two optional bonuses and the multiple-answer
question. It checks feedback, overflow and axe on every checked question. The
separate prepared-review suite retains its 375/768/1366 checks. Stored-paper tests
continue to require every source excerpt to appear verbatim on its cited PDF page.

The non-blocking evidence-label concern remains a shared-player/content-owner
decision: authored summaries must not be presented as verbatim paper quotations.
This pass does not change that UI or mark any study `reviewed: true`. Hosted preview
verification remains separate; the PR currently has a failed Vercel deployment
check and a prior team-membership warning, which a local build cannot resolve.

## Confirmed errors in the original text

Verified against the stored PDF or the data file, not inferred.

| Study                                                                                                                          | Problem                                                                                                                                                             | State                                                           |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| food-warning-labels                                                                                                            | Evidence line said a no-warning control group was included. The paper says it "omitted a control group".                                                            | Fixed                                                           |
| food-warning-labels, judging-statement-truthfulness, being-a-later-born, hand-washing-in-restrooms, daily-conversation-hearing | Takeaway or limitations said none were noted; each paper states several.                                                                                            | Fixed in these five                                             |
| judging-statement-truthfulness                                                                                                 | Funding, conflict-of-interest and citation lines stored as evidence excerpts.                                                                                       | Fixed                                                           |
| selecting-a-beverage                                                                                                           | Lesson reported the opposite direction to the paper's figure and discussion.                                                                                        | Fixed earlier; see [GENERATED_STUDIES.md](GENERATED_STUDIES.md) |
| recalling-personal-details                                                                                                     | c2 asks which variables were manipulated; every option is a task order.                                                                                             | Fixed in 28 Oct source review                                   |
| daily-gratitude-and-well-being                                                                                                 | c1 scene was a placeholder: one node, a self-loop, every option pointing at it.                                                                                     | Fixed (study rewritten)                                         |
| stroop-task-performance                                                                                                        | c1 scene node text restates the accepted answer.                                                                                                                    | Fixed in 28 Oct source review                                   |
| tracing-shapes-while-brainstorming                                                                                             | c5 scene node text restated the accepted answer.                                                                                                                    | Fixed (study rewritten)                                         |
| imagining-survival-scenarios                                                                                                   | c1 asks for "factor(s)" and accepts one, while its own evidence names two manipulated factors.                                                                      | Fixed in 28 Oct source review                                   |
| walking-speed-test                                                                                                             | An evidence line contains "F(1,119) = ?" (c3).                                                                                                                      | Fixed in 28 Oct source review                                   |
| 31 studies                                                                                                                     | Step labels were punctuation fragments (181 questions). Replaced by "Read the design", "Read the results" or "Draw a conclusion" from each question's reveal stage. | Fixed                                                           |

## Found while rewriting

Facts checked against the stored PDF during the rewrites. Some are errors in the old lesson text; others are inconsistencies inside the paper itself, which the rewrites work around.

| Study                           | Finding                                                                                                                                                                                                                                            | State                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| managing-personal-debt          | old c5i evidence line quoted odds ratios (2.36, 2.51) from a different study cited in the discussion as if they were this study's                                                                                                                  | Fixed (study rewritten)                                            |
| managing-personal-debt          | paper prints 16.21 (abstract) and 16.22 (Table 2) for the same odds ratio                                                                                                                                                                          | paper's own inconsistency                                          |
| natural-light-at-work           | the paper's abstract says sunlight related negatively to anxiety and that natural elements buffered stressors' link with depressed mood, but its results report direct sunlight positively related to anxiety and no moderation for depressed mood | paper's own inconsistency; the rewrite follows the results section |
| puzzle-solving-after-motivation | old c3 combined Experiment 1's F test with Experiment 2's group means as if they were one result                                                                                                                                                   | Fixed (study rewritten)                                            |
| remembering-doctor-appointments | the paper's text says the stereotyped group made fewer clock checks but prints M = 65.24 against 47.57 (the reverse); its own age-group table shows fewer checks in the stereotyped groups                                                         | paper's own inconsistency; the rewrite does not rely on it         |
| body-posture-judgments          | an earlier version of this register listed the old c3 answer "0.93" as a number not in the paper; it is 4.01 − 3.08, correctly computed from the paper's means                                                                                     | Register corrected; study rewritten                                |
| classroom-mindfulness-practice  | the paper's abstract reports DCCS gains "relative to waitlist control" of d = 0.48 and 1.10, but its Table 4 lists these as the programme group's own change over time; the old lesson repeated the abstract's framing                             | paper's own inconsistency; the rewrite asks learners to spot it    |
| classroom-seatmates             | the paper's abstract gives N = 2,966 students while its results report N = 2,996 analysed                                                                                                                                                          | paper's own inconsistency; the rewrite uses the results figure     |
| cursing-while-in-pain           | the paper reports an indirect effect of β = 4.767 with a 95% CI of −0.093 to 4.282, so the point estimate lies outside its own interval                                                                                                            | paper's own inconsistency; the rewrite does not use that figure    |

## Audit leads checked and not confirmed

A cheaper model audited all studies read-only. Its output is a set of leads, not findings.
Two were checked against the PDF:

- `cursing-while-in-pain` takeaway "about one-third": **refuted**. The paper reports a 32%
  increase in pain threshold and 33% in tolerance.
- `dog-ownership-among-seniors` "CI 0.37–0.78 versus 0.37–0.79": the paper's table gives 0.37–0.78
  (Model 1) and 0.38–0.79 (Model 2); its abstract mixes the two as 0.37–0.79. Not a study error.

## Unverified leads still to read against the paper

Each needs a person to read the paper. None is a finding yet.

| Study                               | Lead                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| clinton-voter-activism              | c3/c4 recall; one misconception note appears garbled                                                         |
| holding-a-warm-drink                | c5 states a result no shown excerpt supports                                                                 |
| music-and-mood-perception           | c2 and c3 evidence not in the excerpt list                                                                   |
| online-charity-giving               | c5 evidence bullets enumerate the accepted options                                                           |
| parents-viewing-vaccine-safety-info | an excerpt is garbled and contradicts a later one                                                            |
| sleep-school                        | the N printed in a table differs from the N in the analysis (likely the paper's own typo)                    |
| stroop-task-performance             | c5 may cite the wrong excerpt for the power limitation                                                       |
| teen-social-media-use               | c1 "cross-sectional" versus an evidence line calling it the first wave of a longitudinal project (ambiguous) |
| understanding-how-pumps-work        | c2 answer format not in the excerpts; malformed stage text (now fixed)                                       |
| vaccine-misinformation-correction   | an excerpt is garbled (a digit missing)                                                                      |
| walking-speed-test                  | an excerpt is garbled                                                                                        |

## Every study

"Flagged" is the detector count before → now. "Not word for word" counts evidence lines
shown before Check that are not found verbatim in the PDF; they are the reading queue,
because a paraphrase can be right or wrong and only a reader can tell which.

| Study                                 | Origin    | Review state                                                      | Flagged    | Not word for word | Open items                                                |
| ------------------------------------- | --------- | ----------------------------------------------------------------- | ---------- | ----------------- | --------------------------------------------------------- |
| texting-lecture                       | featured  | Hand-authored proof set; no independent content review            | n/a        | n/a               | not checked automatically (special format)                |
| exercise-focus                        | featured  | Hand-authored proof set; no independent content review            | 0 → 0 of 6 | n/a               | —                                                         |
| conformity-replication                | featured  | Hand-authored proof set; no independent content review            | 1 → 1 of 6 | n/a               | —                                                         |
| natural-light-at-work                 | generated | Rewritten and checked against the PDF                             | 2 → 0 of 5 | 10 of 10          | —                                                         |
| dog-ownership-among-seniors           | generated | Rewritten and checked against the PDF                             | 1 → 1 of 6 | 12 of 12          | —                                                         |
| hand-washing-in-restrooms             | generated | Rewritten and checked against the PDF                             | 0 → 0 of 6 | 13 of 13          | —                                                         |
| memory-training                       | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| stress-affirmation                    | featured  | Hand-authored proof set; no independent content review            | 0 → 0 of 7 | n/a               | —                                                         |
| recalling-personal-details            | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| television-viewing-habits             | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| teen-social-media-use                 | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| kids-eating-when-not-hungry           | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| clicking-phishing-links               | generated | Rewritten and checked against the PDF                             | 2 → 0 of 5 | 11 of 11          | —                                                         |
| music-and-mood-perception             | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| food-warning-labels                   | generated | Rewritten and checked against the PDF                             | 2 → 0 of 6 | 13 of 13          | —                                                         |
| imagining-survival-scenarios          | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| stroop-task-performance               | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| morning-people-and-life-satisfaction  | generated | Rewritten and checked against the PDF                             | 3 → 0 of 6 | 13 of 13          | —                                                         |
| daily-gratitude-and-well-being        | generated | Rewritten and checked against the PDF                             | 4 → 1 of 6 | 13 of 13          | —                                                         |
| bus-ridership-behavior                | generated | Rewritten and checked against the PDF                             | 1 → 0 of 6 | 12 of 12          | —                                                         |
| anticipating-a-shock                  | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| parents-viewing-vaccine-safety-info   | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| reading-words-aloud                   | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| holding-a-warm-drink                  | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| managing-personal-debt                | generated | Rewritten and checked against the PDF                             | 2 → 0 of 5 | 10 of 10          | —                                                         |
| clinton-voter-activism                | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| selecting-a-beverage                  | generated | Rewritten 26 Oct (earlier pass); excerpts checked against the PDF | 4 → 1 of 6 | 9 of 9            | —                                                         |
| body-posture-judgments                | generated | Rewritten and checked against the PDF                             | 1 → 0 of 6 | 11 of 13          | —                                                         |
| science-video-trust                   | generated | Rewritten and checked against the PDF                             | 2 → 1 of 6 | 14 of 14          | —                                                         |
| phone-use-while-driving               | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| tracing-shapes-while-brainstorming    | generated | Rewritten and checked against the PDF                             | 4 → 0 of 6 | 15 of 15          | —                                                         |
| daily-conversation-hearing            | generated | Rewritten and checked against the PDF                             | 3 → 0 of 6 | 12 of 12          | —                                                         |
| building-daily-habits                 | generated | Rewritten and checked against the PDF                             | 2 → 0 of 6 | 14 of 14          | —                                                         |
| judging-statement-truthfulness        | generated | Rewritten and checked against the PDF                             | 3 → 1 of 6 | 16 of 16          | —                                                         |
| remembering-doctor-appointments       | generated | Rewritten and checked against the PDF                             | 2 → 0 of 6 | 12 of 12          | —                                                         |
| music-and-attention                   | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| sharing-money-in-public               | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| social-media-and-sleep                | generated | Rewritten and checked against the PDF                             | 3 → 1 of 6 | 13 of 13          | —                                                         |
| being-a-later-born                    | generated | Rewritten and checked against the PDF                             | 4 → 0 of 6 | 14 of 14          | —                                                         |
| online-charity-giving                 | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| vaccine-misinformation-correction     | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| cursing-while-in-pain                 | generated | Rewritten and checked against the PDF                             | 1 → 0 of 6 | 12 of 12          | —                                                         |
| walking-speed-test                    | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| using-scented-air-while-brainstorming | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| puzzle-solving-after-motivation       | generated | Rewritten and checked against the PDF                             | 2 → 0 of 6 | 12 of 12          | —                                                         |
| reasoning-and-belief-study            | generated | Rewritten and checked against the PDF                             | 3 → 1 of 6 | 13 of 13          | —                                                         |
| understanding-how-pumps-work          | generated | Rewritten and source-checked (28 Oct agent pass)                  | not rerun  | not rerun         | See 28 Oct register below; content-owner approval pending |
| breakfast-grades                      | featured  | Hand-authored proof set; no independent content review            | 0 → 0 of 6 | n/a               | —                                                         |
| sleep-school                          | featured  | Hand-authored proof set; no independent content review            | 0 → 0 of 6 | n/a               | —                                                         |
| basketball-maths                      | featured  | Hand-authored proof set; no independent content review            | 1 → 1 of 6 | n/a               | —                                                         |
| learning-styles                       | featured  | Hand-authored proof set; no independent content review            | 1 → 1 of 6 | n/a               | —                                                         |
| classroom-seatmates                   | generated | Rewritten and checked against the PDF                             | 1 → 0 of 6 | 12 of 12          | —                                                         |
| classroom-mindfulness-practice        | generated | Rewritten and checked against the PDF                             | 1 → 0 of 5 | 10 of 10          | —                                                         |

## How the numbers were produced

Local review scripts (not committed) read each study body and its stored PDF, extracted
the same way as `tests/research/papers-setup.ts`.

- **Giveaway detector.** Flags a question when its accepted answer's words, or a run of
  five or more words, appear in the evidence shown before Check, and the wrong options do
  not. It ignores scene response labels. It misses paraphrase and bare-number lookups
  that share no wording, so it gives a lower bound.
- **Evidence support.** Normalises hyphenation and quotes, then looks for each evidence line
  in the PDF text. Lines containing numbers are checked number by number, allowing rounding.
  Claims without numbers cannot be checked this way, which is why the control-group error
  needed a reader.
- **Not checked by those scripts.** Whether an accepted answer is correct, whether a
  rewritten question is a good one, and claims without a number. Those need source-based
  reading. The old detector also includes cited excerpts and full scene data (including
  gated resolutions); its flags are leads, not a count of what is currently visible
  before Check. The historical 67 → 21 figures above have not been relabelled as a fresh
  semantic audit. The newer choice audit measures position and length only.

## Remaining-study question review — 28 October 2026

All **21 previously untouched generated studies / 122 required questions** now
have an agent source-check and authored revision. This completes the agent rewrite
pass over all **45 generated studies**. With the two revised featured studies,
**47 studies / 274 questions** have revised content. Six other hand-authored featured
studies remain outside these batches. **All 53 cards remain `reviewed: false`;
no content-owner approval is claimed.**

Question IDs, types and accepted option IDs remain stable. Choice order varies
within each study, and scene response labels/order follow it. Existing numerical
scenes and source links are retained; survival’s scene now identifies its
supplementary analysis and the activism timeline places identification before
the election. This changes content, not player, scoring, excerpt timing or
provider configuration. Added excerpts are verbatim on their cited PDF pages. Saved definitions that no
longer match the revised question wording or its permitted citations are removed;
surviving definitions retain their original provenance. Five otherwise-empty
studies receive a neutral, source-derived operational definition for the new
wording. General glossary fallback remains available; no term generation was run.

The 119 single-answer questions in this batch have correct positions of
36 / 37 / 29 / 17 across slots 1–4 (some questions have fewer options).
Counting ties as wins, always choosing a shortest option succeeds on 52/119
(43.7%) and a longest option on 38/119 (31.9%). The three multiple-answer questions
are excluded. These are cue checks, not factual-accuracy or learning scores;
regressions protect this batch separately so earlier work cannot mask a new cue.

Historical detector and word-match counts above have **not** been rerun on the
new questions. `not rerun` replaces obsolete counts for these 21 rows; no automatic
count establishes factual accuracy, content-owner approval or learning benefit.

The page column lists the revised questions’ cited PDF pages, including retained
scene sources. Each study’s entire required-question set was reviewed.

| Study                                 | Questions                  | Cited PDF pages      | Corrections and interpretation                                                                                                                                                          |
| ------------------------------------- | -------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| memory-training                       | c1, c2, c3, c4, c5, c6     | 1, 2, 3, 4, 5, 7     | Measured mindset is not randomized; distinguish pre/post change, near versus far transfer, unmeasured expectancy and a missing recruitment-message contrast.                            |
| recalling-personal-details            | c1, c2, c3, c4, c5, c6     | 3, 13, 14, 15, 18    | Correct factors versus task-order mismatch; interpret percentage points and pooled effects; rehearsal mechanism remains speculative.                                                    |
| television-viewing-habits             | c1, c2, c3, c4, c5         | 1, 3, 7, 8, 12       | Questionnaire errors are not necessarily firmly held beliefs; sampling age and education do not imply a single bias direction.                                                          |
| teen-social-media-use                 | c1, c2, c3, c4, c5, c6     | 1, 6, 9              | First-wave analysis is cross-sectional; full-model R² is not social media’s unique contribution; rounded p = .003 lies at the strict correction boundary.                               |
| kids-eating-when-not-hungry           | c1, c2, c3, c4, c5         | 3, 5, 7, 8           | Longitudinal order is not randomization; distinguish slope and moderation; report the joint-adjustment null rather than invent an unmeasured feeding explanation.                       |
| music-and-mood-perception             | c1, c2, c3, c4, c5, c6, c7 | 1, 3, 5, 7, 17       | Separate stimulus manipulation from cultural history and mode from pitch; between-group effect comparisons and universal mechanisms remain uncertain.                                   |
| imagining-survival-scenarios          | c1, c2, c3, c4, c5, c6     | 1, 3, 4, 5, 7        | Both factors varied within people. The p = .06 relevance-rating analysis is supplementary; the primary corrected-memory finding is p = .003. Correct interaction and mechanism scope.   |
| stroop-task-performance               | c1, c2, c3, c4, c5         | 1, 5, 13, 14         | Interpret power rather than copy a threshold; reversed significant error interaction is not the target moderation. Repair power citation.                                               |
| anticipating-a-shock                  | c1, c2, c3, c4, c5, c6     | 3, 6, 8, 9, 10, 11   | Bayes factors compare specified models, not universal certainty. Political context is proposed, not an established necessary condition; subgroup sensitivity differs.                   |
| parents-viewing-vaccine-safety-info   | c1, c2, c3, c4, c5, c6     | 1, 3, 5, 6, 8        | 4.09/4.02 is female-subgroup trust, not overall information receipt. Separate statistical size, survey ratings and actual uptake; adjusted policy support also differs from the t-test. |
| reading-words-aloud                   | c1, c2, c3, c4, c5, c6     | 4, 5                 | Distinguish recall reversal from recognition null at 80% aloud; interpret raw gaps and the eight-item caution.                                                                          |
| holding-a-warm-drink                  | c1, c2, c3, c4, c5, c6     | 2, 3                 | Use actual results rather than the replication aim. Correct the readable attractiveness-statistic summary; explain blinding, exclusions and missing neutral comparison.                 |
| clinton-voter-activism                | c1, c2, c3, c4, c5         | 1, 3, 5, 7, 9, 10    | Remove the true distractor, distinguish conditional prediction from treatment effects and later scores from demonstrated change; identification precedes election.                      |
| phone-use-while-driving               | c1, c2, c3, c4, c5, c6     | 1, 3, 6, 8, 9        | Restore missing links, compute the .24-second contrast, separate outcomes and candidate mechanisms from safety. Follow Methods where abstract pacing differs.                           |
| music-and-attention                   | c1, c2, c3, c4, c5, c6     | 5, 6, 9, 10          | Null age and stimulating/silence contrasts do not prove equivalence. Music bundles arousal and valence; add ceiling, stimulus and sensory caveats.                                      |
| sharing-money-in-public               | c1, c2, c3, c4, c5, c6     | 5, 6, 7, 9, 11, 12   | A successful observation check can coexist with a null giving outcome. SVO is measured; exploratory moderation was underpowered with incomplete matching.                               |
| online-charity-giving                 | c1, c2, c3, c4, c5, c6     | 1, 4, 6, 7, 8, 9     | Distinguish start/completion and bounded equivalence; speculative explanations are not proven causes. Replace unranked most-likely remedy with direct test designs.                     |
| vaccine-misinformation-correction     | c1, c2, c3, c4, c5         | 1, 7, 8, 12, 13, 18  | Random assignment does not make students representative; reliability/satisfaction are perceived outcomes; package components and durability remain unresolved.                          |
| walking-speed-test                    | c1, c2, c3, c4, c5, c6     | 1, 2, 3, 5           | Time is not speed units; repair F < 1 prose and include Experiment 2 in takeaway. Expectation dependence does not isolate unconscious mimicry.                                          |
| using-scented-air-while-brainstorming | c1, c2, c3, c4, c5, c6     | 3, 5, 6, 7, 8, 9, 11 | Restore missing links; D is not an individual improvement rate. Remove invented TTCT inhibition explanation; reason for different task outcomes is unclear.                             |
| understanding-how-pumps-work          | c1, c2, c3, c4, c5, c6     | 4, 5, 8, 11          | Pump post-test is not chemical pre/post gain; spatial ability is measured, component counts differ from test scores and do not establish mediation.                                     |

Primary-page passages were compared with the lesson data. Ambiguous tables/glyphs
for parental trust, cup attractiveness and survival memory were also inspected
as rendered PDF pages. The pump paper itself prints F(1,124) = 4.094 with p < .01;
the revised question describes the reported qualitative interaction instead of
presenting that inconsistent pair as a newly verified statistic.

## Next steps

1. The content-review owner reads the revised studies with their papers and
   approves or requests further changes. Set `reviewed: true` only after approval.
2. Review the six other hand-authored featured studies independently; they were
   outside the 45-generated-study revision work.
3. The shared-player summary/quotation-label decision remains separate; these
   content changes do not alter excerpt timing.
