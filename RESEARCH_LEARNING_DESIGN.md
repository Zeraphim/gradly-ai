# Research judgment, beyond statistics

Gradly should help a learner understand a paper’s core question, design, findings and limits without requiring a cover-to-cover reading first. Learners should then practise the judgments that make that understanding useful: connect a claim to evidence, examine a competing explanation and revise the claim. Statistics is one example of research, rather than the definition of the product.

The distinguishing interaction is **orient to the study → commit → explain → inspect evidence → revise → transfer**, with the original thinking still visible after revision. The goal is one coherent paper-centered experience, with a different study as a content choice rather than another product mode. A summary is a route into the evidence, not a substitute for every detail of the full paper.

This design note grounds that experience in the existing browser showcase and `REASONING_PREVIEW.md`. It does not establish learning benefits. `research-cases.ts` supplies one fictional qualitative case, **A shared garden. Different experiences.**, for the shared `ResearchCase` engine. The workshop and planning-app concepts below are future content proposals, not implemented activities.

## Evidence informing the interaction

- Prompted self-explanation improved understanding in Chi and colleagues’ particular text-learning experiment. This supports asking learners to explain connections rather than treating an answer match as understanding; it does not establish Gradly’s effectiveness. [Original study, Chi et al., 1994](https://onlinelibrary.wiley.com/doi/abs/10.1207/s15516709cog1803_3).
- Schwartz and Bransford investigated analysing contrasting cases before instruction. Use a meaningful contrast to make the coaching relevant after a learner commits, with explicit instruction after inspection. [Original paper, 1998](https://aaalab.stanford.edu/papers/time_for_telling.pdf).
- Butler’s four experiments compared repeated testing and studying and included inferential transfer questions. A new-context check is a stronger product demonstration than replaying the corrected example; passing it once still does not establish durable learning. [Original study abstract, 2010](https://pubmed.ncbi.nlm.nih.gov/20804289/).
- Agee describes research-question development and refinement as part of shaping qualitative inquiry. A question should be revisable as its purpose and evidence become clearer. [Original methodological paper, 2009](https://www.tandfonline.com/doi/pdf/10.1080/09518390902736512).
- Braun and Clarke describe reflexive thematic analysis as interpretive and recursive, with candidate themes checked against coded material and the dataset. Their approach does not make frequency a substitute for meaning or importance. Use bounded interpretation and competing readings, not a single universally correct theme. [Authors’ process guidance](https://www.thematicanalysis.net/doing-reflexive-ta/), [authors’ FAQ](https://www.thematicanalysis.net/faqs/).
- Hernán and Robins distinguish association from causal effects and explain the assumptions needed for causal identification. A large sample or group difference alone does not solve self-selection; observational evidence can support causal inference when appropriate assumptions and design justify it. [Authors’ free book and materials](https://miguelhernan.org/whatifbook), [book, chapters 2–3 and 7](https://miguelhernan.org/s/hernanrobins_WhatIf_2jan25.pdf).

The activity design below is an inference from these sources. It combines their ideas rather than reproducing an intervention from any one paper.

## Recommended learner journey

1. Open one paper casefile experience. Start with the real reference study; allow switching the study to the fictional qualitative case to show that the same learning mechanism works beyond statistical analysis.
2. State each study’s provenance. The garden is a **Fictional learning scenario · authored guidance · no AI calls**. The real reference study keeps its distinct curated-study attribution and real source link. Do not put invented studies in a list of published papers.
3. Orient the learner with a compact paper map: question, design, finding and limits. Then ask for a consequential claim and explanation. If an authored explanation is offered for a quick team demonstration, make loading it explicit.
4. Review the decision and its justification separately. A suitable design paired with an overclaim is the central teachable moment. Feedback names a particular gap and asks one question.
5. Open two or three evidence cards, including a counterexample or limit. Let the learner choose which record to inspect first; no drag-only interaction and no points for opening panels.
6. Save an explicit revision. Compare the original decision/explanation with the revision. Explain the conceptual change in the structured claim, or between authored fixtures, while custom writing stays **Not assessed**. Evidence selection records what was inspected; it cannot prove why a learner chose it.
7. Offer a short **New situation** decision with a changed critical feature. Show a deterministic explanation of that structured choice; never claim to have assessed its optional free-text justification.
8. Finish with a local **Decision journal**: what was chosen, which evidence mattered, what changed, and one unanswered question. Reward completion of the thinking loop without calling it mastery or claiming an AI evaluation.

Keep the main action and progress visible without giant text blocks. Use a small evidence tray and readable extracts; the learner should not have to scroll past nine full-page accordions to continue. Show only the active step and one clear next action. A case switch restores that case’s draft or asks for an explicit reset; feedback can never follow a different case or revised text.

## Future content proposal: Ask a better question

**Skill:** align a research question, purpose and evidence. **Fictional setting:** a campus library wants to understand why commuters miss optional evening research workshops. The initial aim is understanding experiences, not estimating campus prevalence or testing an intervention.

**Brief cards:**

- `question-brief` / **Scenario brief:** The library wants to understand how commuting students experience access to evening workshops.
- `question-access` / **Access plan:** Twelve volunteers can be interviewed about their decisions. Volunteers can describe experiences; this recruitment does not establish a representative campus sample.
- `question-gap` / **Not yet known:** No campus-wide sampling frame, attendance comparison, or intervention allocation is supplied.

**Decision:** What question and first study would serve this aim?

| Choice                                                                                                               | Authored judgment                              | Why                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| “How do commuting students describe decisions about attending evening workshops?” + semi-structured interviews       | Suitable for this purpose                      | Elicits experience and context without treating interviews as a prevalence estimate.                                                  |
| “What share of all students miss workshops because of transport?” + the same volunteer interviews                    | Does not answer the stated population question | The target is a population proportion and the recruitment/evidence do not establish it. A suitable survey could be a different study. |
| “How do observed travel and scheduling constraints shape attendance decisions?” + interviews and focused observation | Defensible alternative                         | Can examine decisions and context if the additional access and consent are feasible.                                                  |
| Ask whether the aim is understanding experiences, estimating prevalence, or testing a change                         | Needs a clarified aim                          | Appropriate uncertainty when a stakeholder’s goal is ambiguous; do not invent that missing aim.                                       |

**Suitable choice, flawed explanation:** “I would interview commuting students about their decisions because twelve detailed interviews will tell us the percentage of all students who face transport barriers.”

**Coaching:** “Would rich accounts from volunteers establish how common a barrier is across the campus, or explain how it is experienced?”

**Authored revision:** “Interviews fit the aim of understanding how commuters experience workshop access and decide whether to attend. I would ask open questions about particular occasions and actively seek different experiences. These volunteer accounts do not estimate the proportion of all students facing a barrier.”

**Counterexample:** A student with a short commute misses workshops because of paid work. Transport is an inquiry, not a conclusion to insert into every question.

**Transfer:** The library now asks how common each barrier is across campus. Choose a clearly defined population and a sampling/recruitment plan suited to estimating proportions, while retaining interviews for explaining the barriers. The check is question–evidence fit, not “interviews bad, surveys good.”

## Current authored qualitative case: Read between the lines

`apps/web/src/research/research-cases.ts` supplies **A shared garden. Different experiences.** as content for the shared casefile engine. Its question is how people with different levels of participation experience belonging in a neighbourhood garden. Ten fictional local people were purposefully recruited to include regular volunteers and less active people. The casefile includes an authored interpretation and selected accounts, rather than full transcripts or a verified finished analysis.

**Paper map:** The question concerns belonging; the method seeks varied experiences through interviews; the authored finding connects belonging with recognition and workable forms of participation; its limits include selected extracts, one setting, no prevalence estimate and other defensible interpretations.

**Evidence cards, all fictional:**

- `garden-design` / **Method and question:** Ten interviews include regular volunteers and people who rarely joined in.
- `garden-invitation` / **Interview A summary:** Being asked for advice about seedlings connects participation with being recognised as someone who can contribute.
- `garden-quiet` / **Interview B summary:** Quiet gardening after work is valued; more organised social events are not wanted. This challenges a universal recommendation for more group activity.
- `garden-access` / **Interview C summary:** A narrow route and inaccessible tasks constrain someone who wants to take part. Low participation is not equivalent to low interest.
- `garden-boundary` / **Analytic limits:** These selected accounts do not establish a final theme or prevalence; interpretations must explain the question, material and differences.

**Commit to a claim:**

| Claim level       | Authored response                                                                                                                                              | Why                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Overly dismissive | “Because these are personal accounts, no meaningful interpretation is possible.”                                                                               | The evidence fits a question about experience; interpretation can be rigorous without a mechanical single answer.          |
| Bounded           | “These accounts suggest that belonging involves recognition and workable forms of participation, while the garden means different things to different people.” | A defensible provisional interpretation that preserves differences and permits other coherent readings.                    |
| Overreach         | “The garden makes everyone feel connected, so more group events will benefit every resident.”                                                                  | The supplied accounts do not establish a universal experience or a tested solution; B and C complicate the recommendation. |

**Coaching:** “What meaning connects these accounts, and which account stops your interpretation from becoming a claim about everyone?”

**Authored revision:** “Belonging in these accounts depends partly on recognition and ways of participating that people can and want to use.” The accompanying explanation links A, B and C, retains difference, and calls for the full dataset before a final theme. This is one defensible reading, not a vote or a frequency estimate. Custom explanations must remain unassessed.

**Transfer:** A new fictional interview values exchanging seedlings one to one but finds organised welcome events uncomfortable. Revisit how invitation and preferred forms of participation create belonging; retain the difference and review the wider dataset. Do not discard the new account to preserve a fixed interpretation, or call whichever activity occurs most often the true theme.

## Future content proposal: Challenge a causal claim

**Skill:** separate an observed pattern, a causal explanation, and the population to which a claim applies. **Fictional setting:** students at one campus voluntarily use a study-planning app; users later submit more assignments on time than non-users. No effect size, statistical significance or real product result is implied.

**Evidence cards:**

- `claim-observation` / **Scenario record:** App use was voluntary. The recorded user group had a higher later rate of on-time submission than the non-user group.
- `claim-baseline` / **Baseline gap:** Prior submission habits, workload and access to support were not measured in the supplied record. These are possible alternative explanations, not established differences.
- `claim-scope` / **Study scope:** The record comes from one campus over one term. Other settings, long-term outcomes and recruitment details are not supplied.

**Decision:** What may the team say from this record?

| Choice                                                                      | Authored judgment           | Why                                                                                                                                 |
| --------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| “App use was associated with more on-time submissions in this record”       | Supported descriptive claim | States the observed pattern and its scope without assigning its cause.                                                              |
| “The app caused better submission habits for all students”                  | Overclaim                   | Self-selection and unmeasured common causes remain unresolved; one-campus observation does not establish all-student applicability. |
| “This is a hypothesis worth a comparison designed around a causal question” | Defensible next step        | Names a next study rather than inventing a treatment effect from the present record.                                                |
| “We cannot estimate the causal effect from the supplied evidence”           | Grounded uncertainty        | Names the absent design/assumption support while preserving the observed association.                                               |

**Suitable choice, flawed explanation:** “I would report an association because voluntary app use proves the app had no effect; only experiments can ever support causal claims.”

**Coaching:** “Does an unresolved alternative explanation prove there is no effect, or mean the supplied evidence cannot identify it?”

**Authored revision:** “Users had more on-time submissions in this record, but use was voluntary and the supplied evidence does not resolve self-selection or other common causes. I cannot identify the app’s causal effect from this record. A carefully designed experiment, or an observational analysis with justified causal assumptions and relevant measurements, could address a causal question. Any conclusion would still need a stated target population and context.”

**Transfer:** The new scenario randomly assigns an offer of access; some offered students do not use the app. Choose a claim about the effect of the **offer/assignment**, conditional on the trial’s other validity requirements, rather than silently equating it with the effect of actual use. Also distinguish random assignment from representative sampling: better causal identification does not make a one-campus sample universal.

## Shared paper-casefile contract

`apps/web/src/research/case-types.ts` defines the shared `ResearchCase` content shape. The engine should consume that shape for both the real reference paper and the garden case, with the same sequence and controls:

- Core study fields: `question`, `context`, `design`, `findings`, `limitations` and a short `takeaway`. The learner should be able to reconstruct what the study asked, did, found and did not establish.
- Provenance: `reference-paper` or `fictional-study`, explicit `sourceNote`, and paper metadata. Real sources can have a verified URL; fictional casefiles have no fabricated publication, author identity, DOI or PDF page.
- Evidence: stable `id`, `kind`, `label`, `text` and `sourceLabel`. Use real published-page labels for the reference study, and human labels such as “Fictional case · Interview B summary” for invented records.
- Three ordered structured claims: overly dismissive, bounded, overreach. The middle position is a content-authored claim rather than an AI verdict. All three have authored explanations, including why uncertainty does not equal proof of no effect or meaning.
- `usefulEvidenceIds` connect the bounded claim to records; `competingEvidenceId` highlights a counterexample or limitation. Opening a card or selecting an ID cannot establish reading comprehension.
- `coachingQuestion` asks one focused question. `revision` is labelled an authored example; it must never be attached as assessment of a learner’s custom writing.
- `transfer` contains one fresh context, three explicit options and an authored explanation for each. The check assesses the structured choice only. It is a new-context exercise, not proof of durable transfer.

Store the case identity and version with its phase, structured choices, inspected evidence and submitted text revisions. Namespace drafts per case. Keep prior writing for comparison, and never restore a trusted verdict against edited text or a different case. Current UI code and tests, rather than this design note, establish what persistence and invalidation have actually been implemented.

The older reasoning showcase uses exact authored text **and** choice matching before displaying a prepared reasoning verdict. Preserve that rule wherever it remains available. For the new paper casefile, keep structured-claim guidance visibly separate from unassessed custom explanations. Future live feedback requires the stronger binding and evidence safeguards in `REASONING_PREVIEW.md`; the browser-only adapter must not silently become a provider fallback.

## What makes the demonstration differentiated

The product hypothesis is a **traceable change in judgment**: a learner commits before the explanation is shown, examines evidence that can undermine that commitment, revises with a visible reason, then applies the distinction in a changed context. Different disciplines share this loop without being flattened into a statistics quiz. The journal makes that change reviewable by the learner or instructor.

The loop is a demonstrable interaction, not a proven moat or learning benefit. Validate the hypothesis with learners: can they distinguish a suitable decision from an unsupported reason; can they identify the evidence that changed their claim; can they handle a fresh case without the sample explanation? Later study retention, transfer, and the quality of evidence-linked revisions against appropriate comparisons. A polished demo, completion counter or authored review is not evidence of those outcomes.
