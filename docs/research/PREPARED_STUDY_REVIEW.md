# Prepared-study review register

Last updated: 26 October 2026. Covers the 53 prepared studies for issues
[#31](https://github.com/Zeraphim/nebius-hackathon-submission/issues/31) and
[#32](https://github.com/Zeraphim/nebius-hackathon-submission/issues/32).

## Read this first

**No prepared study is content-reviewed.** Every card in `cards.ts` is `reviewed: false`.
Forty-five studies were written in bulk by Nemotron from stored PDFs and eight were
hand-authored as a proof set. Excerpts were checked word for word against the PDF; the
other text shown to learners (evidence lines, prompts, options, explanations, takeaways)
was not. Some of it is wrong, not just easy: one question stated that a study had a
no-warning control group that the paper says was left out on purpose.

Until a study is reviewed by a person who has read its paper, treat it as a draft and do
not present it to JC or others as accurate teaching content. "Rewritten and checked
against the PDF" below means the agent compared each fact it kept or wrote with the
stored PDF. It is not approval by the content-review owner.

## What changed in this pass

| Measure                                                                         | Before (`main`) | Now       |
| ------------------------------------------------------------------------------- | --------------- | --------- |
| Studies rewritten and checked against the PDF                                   | 0               | 21        |
| Questions flagged as answerable from their own evidence (detector, lower bound) | 67 of 305       | 23 of 305 |
| Questions with a scene                                                          | 43              | 67        |
| Studies with no limitations recorded                                            | 30              | 13        |
| Questions with a garbled step label (for example "2 of 6 · , ")                 | 181             | 0         |

The detector misses paraphrased giveaways, so the flagged counts understate the problem.
For example `judging-statement-truthfulness` scored 3 of 6 before the rewrite when all six
questions were copy-from-evidence. Fewer flags is therefore a good sign, not proof.

## Confirmed errors in the original text

Verified against the stored PDF or the data file, not inferred.

| Study                                                                                                                          | Problem                                                                                                                                                             | State                                                           |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| food-warning-labels                                                                                                            | Evidence line said a no-warning control group was included. The paper says it "omitted a control group".                                                            | Fixed                                                           |
| food-warning-labels, judging-statement-truthfulness, being-a-later-born, hand-washing-in-restrooms, daily-conversation-hearing | Takeaway or limitations said none were noted; each paper states several.                                                                                            | Fixed in these five                                             |
| judging-statement-truthfulness                                                                                                 | Funding, conflict-of-interest and citation lines stored as evidence excerpts.                                                                                       | Fixed                                                           |
| selecting-a-beverage                                                                                                           | Lesson reported the opposite direction to the paper's figure and discussion.                                                                                        | Fixed earlier; see [GENERATED_STUDIES.md](GENERATED_STUDIES.md) |
| recalling-personal-details                                                                                                     | c2 asks which variables were manipulated; every option is a task order.                                                                                             | **Open**                                                        |
| daily-gratitude-and-well-being                                                                                                 | c1 scene was a placeholder: one node, a self-loop, every option pointing at it.                                                                                     | Fixed (study rewritten)                                         |
| stroop-task-performance                                                                                                        | c1 scene node text restates the accepted answer.                                                                                                                    | **Open**                                                        |
| tracing-shapes-while-brainstorming                                                                                             | c5 scene node text restated the accepted answer.                                                                                                                    | Fixed (study rewritten)                                         |
| imagining-survival-scenarios                                                                                                   | c1 asks for "factor(s)" and accepts one, while its own evidence names two manipulated factors.                                                                      | **Open**                                                        |
| walking-speed-test                                                                                                             | An evidence line contains "F(1,119) = ?" (c3).                                                                                                                      | **Open**                                                        |
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

## Audit leads checked and not confirmed

A cheaper model audited all studies read-only. Its output is a set of leads, not findings.
Two were checked against the PDF:

- `cursing-while-in-pain` takeaway "about one-third": **refuted**. The paper reports a 32%
  increase in pain threshold and 33% in tolerance.
- `dog-ownership-among-seniors` "CI 0.37–0.78 versus 0.37–0.79": **the paper itself prints
  both** for the same odds ratio (in different models). Not a study error; worth a footnote.

## Unverified leads still to read against the paper

Each needs a person to read the paper. None is a finding yet.

| Study                               | Lead                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| classroom-seatmates                 | c6 "doubled from under 2 to 4 percentage points" is not in any excerpt                                       |
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

| Study                                 | Origin    | Review state                                                      | Flagged    | Not word for word | Open items                                                                            |
| ------------------------------------- | --------- | ----------------------------------------------------------------- | ---------- | ----------------- | ------------------------------------------------------------------------------------- |
| texting-lecture                       | featured  | Hand-authored proof set; no independent content review            | n/a        | n/a               | not checked automatically (special format)                                            |
| exercise-focus                        | featured  | Hand-authored proof set; no independent content review            | 0 → 0 of 6 | n/a               | —                                                                                     |
| conformity-replication                | featured  | Hand-authored proof set; no independent content review            | 1 → 1 of 6 | n/a               | —                                                                                     |
| natural-light-at-work                 | generated | Rewritten and checked against the PDF                             | 2 → 0 of 5 | 10 of 10          | —                                                                                     |
| dog-ownership-among-seniors           | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 6 of 13           | —                                                                                     |
| hand-washing-in-restrooms             | generated | Rewritten and checked against the PDF                             | 0 → 0 of 6 | 13 of 13          | —                                                                                     |
| memory-training                       | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 1 of 11           | no limitations recorded                                                               |
| stress-affirmation                    | featured  | Hand-authored proof set; no independent content review            | 0 → 0 of 7 | n/a               | —                                                                                     |
| recalling-personal-details            | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 4 of 8            | c2 asks for the manipulated variables but offers task orders (confirmed)              |
| television-viewing-habits             | generated | Draft: not reviewed                                               | 1 → 1 of 5 | 8 of 16           | —                                                                                     |
| teen-social-media-use                 | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 4 of 11           | no limitations recorded                                                               |
| kids-eating-when-not-hungry           | generated | Draft: not reviewed                                               | 0 → 0 of 5 | 8 of 11           | —                                                                                     |
| clicking-phishing-links               | generated | Rewritten and checked against the PDF                             | 2 → 0 of 5 | 11 of 11          | —                                                                                     |
| music-and-mood-perception             | generated | Draft: not reviewed                                               | 0 → 0 of 7 | 6 of 7            | no limitations recorded                                                               |
| food-warning-labels                   | generated | Rewritten and checked against the PDF                             | 2 → 0 of 6 | 13 of 13          | —                                                                                     |
| imagining-survival-scenarios          | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 7 of 10           | c1 asks for "factor(s)" but accepts one while its own evidence names two (confirmed)  |
| stroop-task-performance               | generated | Draft: not reviewed                                               | 1 → 1 of 5 | 3 of 8            | c1 scene text states the answer (confirmed); c5 reference unconfirmed                 |
| morning-people-and-life-satisfaction  | generated | Rewritten and checked against the PDF                             | 3 → 0 of 6 | 13 of 13          | —                                                                                     |
| daily-gratitude-and-well-being        | generated | Rewritten and checked against the PDF                             | 4 → 1 of 6 | 13 of 13          | —                                                                                     |
| bus-ridership-behavior                | generated | Rewritten and checked against the PDF                             | 1 → 0 of 6 | 12 of 12          | —                                                                                     |
| anticipating-a-shock                  | generated | Draft: not reviewed                                               | 0 → 0 of 6 | 1 of 10           | —                                                                                     |
| parents-viewing-vaccine-safety-info   | generated | Draft: not reviewed                                               | 0 → 0 of 6 | 10 of 12          | —                                                                                     |
| reading-words-aloud                   | generated | Draft: not reviewed                                               | 0 → 0 of 6 | 6 of 8            | no limitations recorded                                                               |
| holding-a-warm-drink                  | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 3 of 7            | —                                                                                     |
| managing-personal-debt                | generated | Rewritten and checked against the PDF                             | 2 → 0 of 5 | 10 of 10          | —                                                                                     |
| clinton-voter-activism                | generated | Draft: not reviewed                                               | 0 → 0 of 5 | 4 of 9            | no limitations recorded                                                               |
| selecting-a-beverage                  | generated | Rewritten 26 Oct (earlier pass); excerpts checked against the PDF | 4 → 1 of 6 | 9 of 9            | —                                                                                     |
| body-posture-judgments                | generated | Rewritten and checked against the PDF                             | 1 → 0 of 6 | 11 of 13          | —                                                                                     |
| science-video-trust                   | generated | Rewritten and checked against the PDF                             | 2 → 1 of 6 | 14 of 14          | —                                                                                     |
| phone-use-while-driving               | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 2 of 6            | —                                                                                     |
| tracing-shapes-while-brainstorming    | generated | Rewritten and checked against the PDF                             | 4 → 0 of 6 | 15 of 15          | —                                                                                     |
| daily-conversation-hearing            | generated | Rewritten and checked against the PDF                             | 3 → 0 of 6 | 12 of 12          | —                                                                                     |
| building-daily-habits                 | generated | Rewritten and checked against the PDF                             | 2 → 0 of 6 | 14 of 14          | —                                                                                     |
| judging-statement-truthfulness        | generated | Rewritten and checked against the PDF                             | 3 → 1 of 6 | 16 of 16          | —                                                                                     |
| remembering-doctor-appointments       | generated | Rewritten and checked against the PDF                             | 2 → 0 of 6 | 12 of 12          | —                                                                                     |
| music-and-attention                   | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 4 of 6            | no limitations recorded                                                               |
| sharing-money-in-public               | generated | Draft: not reviewed                                               | 0 → 0 of 6 | 5 of 6            | no limitations recorded                                                               |
| social-media-and-sleep                | generated | Rewritten and checked against the PDF                             | 3 → 1 of 6 | 13 of 13          | —                                                                                     |
| being-a-later-born                    | generated | Rewritten and checked against the PDF                             | 4 → 0 of 6 | 14 of 14          | —                                                                                     |
| online-charity-giving                 | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 16 of 19          | no limitations recorded                                                               |
| vaccine-misinformation-correction     | generated | Draft: not reviewed                                               | 1 → 1 of 5 | 7 of 8            | no limitations recorded                                                               |
| cursing-while-in-pain                 | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 0 of 10           | no limitations recorded                                                               |
| walking-speed-test                    | generated | Draft: not reviewed                                               | 0 → 0 of 6 | 10 of 10          | no limitations recorded; takeaway says none; c3 evidence line contains "F(1,119) = ?" |
| using-scented-air-while-brainstorming | generated | Draft: not reviewed                                               | 0 → 0 of 6 | 6 of 10           | —                                                                                     |
| puzzle-solving-after-motivation       | generated | Rewritten and checked against the PDF                             | 2 → 0 of 6 | 12 of 12          | —                                                                                     |
| reasoning-and-belief-study            | generated | Rewritten and checked against the PDF                             | 3 → 1 of 6 | 13 of 13          | —                                                                                     |
| understanding-how-pumps-work          | generated | Draft: not reviewed                                               | 0 → 0 of 6 | 8 of 9            | no limitations recorded                                                               |
| breakfast-grades                      | featured  | Hand-authored proof set; no independent content review            | 0 → 0 of 6 | n/a               | —                                                                                     |
| sleep-school                          | featured  | Hand-authored proof set; no independent content review            | 0 → 0 of 6 | n/a               | —                                                                                     |
| basketball-maths                      | featured  | Hand-authored proof set; no independent content review            | 1 → 1 of 6 | n/a               | —                                                                                     |
| learning-styles                       | featured  | Hand-authored proof set; no independent content review            | 1 → 1 of 6 | n/a               | —                                                                                     |
| classroom-seatmates                   | generated | Draft: not reviewed                                               | 1 → 1 of 6 | 3 of 11           | no limitations recorded                                                               |
| classroom-mindfulness-practice        | generated | Rewritten and checked against the PDF                             | 1 → 0 of 5 | 10 of 10          | —                                                                                     |

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
- **Not checked.** Whether an accepted answer is correct, whether a rewritten question
  is a good one, and any claim in a prompt, option or explanation without a number.

## Next steps

1. A reader with the paper open works through the "Open" rows and the leads table.
2. Rewrite the remaining 24 drafts in order of
   flagged count, checking every kept fact against the PDF, as the rewritten studies were.
3. Set `reviewed: true` only after the content-review owner approves a study.
