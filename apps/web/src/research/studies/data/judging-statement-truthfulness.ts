// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/bertram-2025-trust-truth-null.pdf
// Revised 26 October 2026: answers were readable from the evidence lines; now decisions about design, intervals, Bayes factors and scope.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-judging-statement-truthfulness",
    title: "Trust and Truth Judgments Null Findings",
    briefing:
      "Decide how to test whether trusting people judge statements as true more often, and how far the answer reaches.",
    source: "generated",
    paper: {
      title:
        "Distrusting minds, skeptical judgments? No evidence for a trust-truth link",
      authors: "Bertram, Lalot, van der Werff et al. (2025)",
      journal: "Frontiers in Psychology 16: 1626047",
      url: "https://doi.org/10.3389/fpsyg.2025.1626047",
      limitations: [
        "All three studies used online crowdsourced adults rather than people judging real sources such as news outlets.",
        "Trust was measured with self-report questionnaires, and truth judgments were made on short statements or mock testimonies.",
        "The courtroom setting may have activated scepticism rather than trust, so a trust effect could be hidden in that setting.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 4,
        excerpt:
          "The first questionnaire (T1) provided a general introduction and assessed participants’ demographics before evaluating their trust propensity and base rate beliefs regarding deception. In the second questionnaire (T2), participants were asked to rate 37 short statements as true or false.",
      },
      {
        id: "e2",
        page: 4,
        excerpt:
          "To avoid response bias, we assessed trust propensity and truth judgments at two separate time points.",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "These were selected based on a pretest (N = 50) that confirmed ambiguity in believability (mean ambiguity value: 0.40–0.60).",
      },
      {
        id: "e4",
        page: 4,
        excerpt:
          "The average truth ratings per statement ranged from M = 0.32 to M = 0.75.",
      },
      {
        id: "e5",
        page: 5,
        excerpt:
          "Contrary to our hypothesis, trust propensity did not reliably predict truth judgments, b = −0.02, SE = 0.03, 95% CI [−0.06, 0.03], z = −0.64, p = 0.52, odds ratio (OR) = 0.98.",
      },
      {
        id: "e6",
        page: 6,
        excerpt:
          "b = 0.003, SE = 0.028, 95% CI [−0.05, 0.05], z = 0.11, p = 0.91, OR = 1.00",
      },
      {
        id: "e7",
        page: 8,
        excerpt:
          "Contrary to our hypothesis, trust propensity did not reliably predict truth judgments, b = −0.003, SE = 0.034, 95% CI [−0.07, 0.06], z = −0.09, p = 0.93, OR = 1.00.",
      },
      {
        id: "e8",
        page: 6,
        excerpt:
          "Under weak and moderate priors, the null model was strongly favored (BF₀₁ = 265.85 and BF₀₁ = 46.46, respectively), whereas the restrictive prior produced a Bayes factor close to 1 (BF₀₁ = 1.05)",
      },
      {
        id: "e9",
        page: 6,
        excerpt:
          "This suggests that the evidence for or against an effect of social trust on truth judgments depends on the prior assumptions",
      },
      {
        id: "e10",
        page: 3,
        excerpt:
          "the first study presented the statements without any context, displayed as text on a blank background. The second study introduced social cues at different visual and descriptive levels. The third study embedded the statements within a courtroom context.",
      },
      {
        id: "e11",
        page: 3,
        excerpt:
          "Participants were recruited from the online crowdsourcing platform Prolific, with the requirements of being at least 18 years old and living in the UK.",
      },
      {
        id: "e12",
        page: 7,
        excerpt:
          "To ensure that participants would be familiar with the US jury system, we recruited US participants from Prolific for a two-part study.",
      },
      {
        id: "e13",
        page: 9,
        excerpt:
          "One possible explanation for the present null findings is that truth judgments depend more strongly on cognitive mechanisms, such as fluency and memory consistency, rather than stable personality traits.",
      },
      {
        id: "e14",
        page: 5,
        excerpt:
          "Trust propensity also showed a strong negative correlation with deception base rate belief, r = −0.52, p < 0.001, 95% CI [−0.60, −0.43].",
      },
      {
        id: "e15",
        page: 5,
        excerpt:
          "The analysis showed no significant predictive effect of deception base rate belief, b = 0.002, SE = 0.002, 95% CI [1.00, 1.01], z = 1.03, p = 0.30, OR = 1.00.",
      },
      {
        id: "e16",
        page: 2,
        excerpt:
          "Statements that feel easier to read, comprehend, or recall are typically judged as more truthful",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Two Sessions",
        type: "single",
        prompt:
          "A colleague wants to save money by running the trust questionnaire and the true-or-false statements in one sitting. What is the strongest reason to keep two sessions?",
        evidence: [
          "Session 1: demographics, then a trust questionnaire and a question about how many people usually lie.",
          "Session 2: 37 short statements, each judged true or false.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Two sessions isolate a causal effect of trust by randomly changing how trusting each person becomes.",
          },
          {
            id: "o1",
            text: "Trust answers could prime people to judge statements consistently with that self-description.",
          },
          {
            id: "o3",
            text: "The statement task is too long to combine with a questionnaire, even if priming is not a concern.",
          },
          {
            id: "o4",
            text: "Trust varies within minutes, so the second session is needed to replace an unreliable first score.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Think about what a person might do after they have just described themselves.",
        misconceptions: {
          o2: "Separating sessions does not manipulate trust.",
          o3: "The rationale is avoiding carryover, not an established time limit.",
          o4: "The stated reason is separating tasks, not remeasuring rapid trait changes.",
        },
        explanation:
          "The authors separated the measures to avoid response bias: self-descriptions made moments earlier can shape later answers. Two sessions do not make the design causal, because trust was still only measured.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Unclear Statements",
        type: "single",
        prompt:
          "The team picked 37 statements that most people could not confidently judge. Why would that choice help a test of the trust idea?",
        evidence: [
          "A pretest of 50 people rated how believable each candidate statement was.",
          "An example statement: “Drinking alcohol decreases core body temperature.”",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Obvious facts make the trust measure experimental, while ambiguous facts preserve its observational status.",
          },
          {
            id: "o3",
            text: "Ambiguous facts force trusting participants to answer true, ensuring the predicted link will appear.",
          },
          {
            id: "o4",
            text: "Ambiguous facts take less time to read, allowing more statements in the same session.",
          },
          {
            id: "o1",
            text: "Obvious facts leave little variation in judgements for trust to explain.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "A trait can only explain differences between people. Where would those differences appear?",
        misconceptions: {
          o2: "Statement ambiguity does not determine whether trust is manipulated.",
          o3: "Ambiguity allows variation; it does not guarantee the hypothesis.",
          o4: "The benefit concerns uncertainty and variation in judgements, not reading length.",
        },
        explanation:
          "The statements were chosen for ambiguity (pretest ambiguity values of 0.40–0.60). Individual truth ratings per statement then ranged from 0.32 to 0.75, so people differed and a trait could in principle show up.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Reading Three Intervals",
        type: "single",
        prompt:
          "Three studies each estimated how trust propensity relates to judging statements as true. The point estimates are tiny and straddle zero. What do the three intervals support?",
        evidence: [
          "Study 1: b = −0.02, 95% CI [−0.06, 0.03].",
          "Study 2: b = 0.003, 95% CI [−0.05, 0.05].",
          "Study 3: b = −0.003, 95% CI [−0.07, 0.06].",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Trust propensity and “true” judgments",
          instruction:
            "Look at where each interval sits against zero, then choose what the three together support.",
          description:
            "Estimated change in the log-odds of judging a statement true per point on the trust scale, with 95% confidence intervals.",
          provenance: {
            kind: "reported",
            refs: ["e5", "e6", "e7"],
            note: "Estimates and intervals as printed for each study.",
          },
          measure: "Change in log-odds per scale point",
          min: -0.1,
          max: 0.1,
          reference: {
            value: 0,
            label: "No relationship",
          },
          band: null,
          estimates: [
            {
              id: "s1",
              label: "Study 1",
              detail: "UK adults, statements shown as plain text.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results text.",
              },
              value: -0.02,
              lower: -0.06,
              upper: 0.03,
            },
            {
              id: "s2",
              label: "Study 2",
              detail: "UK adults, statements attributed to other participants.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results text.",
              },
              value: 0.003,
              lower: -0.05,
              upper: 0.05,
            },
            {
              id: "s3",
              label: "Study 3",
              detail: "US adults acting as jurors on witness testimony.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e7"],
                note: "Estimate and interval as printed in the results text.",
              },
              value: -0.003,
              lower: -0.07,
              upper: 0.06,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "Narrow, centred near zero",
            detail:
              "Every interval includes zero and none reaches beyond about ±0.07 log-odds. Large effects in either direction are unlikely, but very small ones are not excluded.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e5", "e6", "e7"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "Slightly lowers",
              targetIds: ["s1", "s3"],
            },
            {
              optionId: "o3",
              label: "Exactly zero",
              targetIds: ["s2"],
            },
            {
              optionId: "o2",
              label: "No sizeable effect",
              targetIds: ["s1", "s2", "s3"],
            },
            {
              optionId: "o4",
              label: "Too wide to say",
              targetIds: ["s1", "s2", "s3"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "The negative estimates establish a small reduction in true judgements as trust increases.",
          },
          {
            id: "o3",
            text: "Non-significant p-values establish a precisely zero effect.",
          },
          {
            id: "o2",
            text: "Narrow intervals near zero argue against sizeable links while allowing very small ones.",
          },
          {
            id: "o4",
            text: "The intervals allow large effects in either direction.",
          },
        ],
        accepted: ["o2"],
        alternatives: [],
        hint: "Compare where each interval sits against zero, then ask how wide the range of plausible effects is.",
        misconceptions: {
          o1: "Point estimates on either side of zero do not establish that direction.",
          o3: "A non-significant result does not establish an exactly zero effect.",
          o4: "The displayed intervals are narrow rather than compatible with large effects.",
        },
        explanation:
          "All three intervals include zero and stretch only a few hundredths either way, so they rule out sizeable effects but not tiny ones. A p-value above .05 does not prove that the effect is exactly zero.",
        refs: ["e5", "e6", "e7"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "When the Prior Matters",
        type: "single",
        prompt:
          "For social trust in Study 2, the authors report Bayes factors favouring the null under three different priors. How should a careful reader summarise them?",
        evidence: [
          "Bayes factors for the null (BF₀₁) for social trust in Study 2:",
          "265.85 with a weak prior, 46.46 with a moderate prior, 1.05 with a restrictive prior.",
          "Values near 1 mean the data favour neither the null nor an effect.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "The evidence is strong for no effect under two priors but neutral under the most restrictive prior, so the verdict partly depends on the prior assumption.",
          },
          {
            id: "o1",
            text: "All three decisively support no effect, so changing the prior leaves the conclusion unchanged.",
          },
          {
            id: "o3",
            text: "The factor of 1.05 supplies strong evidence for a positive link between social trust and judgement.",
          },
          {
            id: "o4",
            text: "The factors cannot inform the result, because non-significant p-values make model comparisons redundant.",
          },
        ],
        accepted: ["o2"],
        alternatives: [],
        hint: "Look for the one value that does not point the same way as the other two.",
        misconceptions: {
          o1: "A factor near 1 is not decisive support.",
          o3: "A Bayes factor near 1 barely distinguishes the models.",
          o4: "Bayes factors address relative support and dependence on prior assumptions.",
        },
        explanation:
          "The authors note that evidence for or against an effect of social trust depends on the prior assumptions. Under a restrictive prior the data show no clear preference, so “no effect” is supported strongly only for the other two priors.",
        refs: ["e8", "e9"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "How Far the Result Reaches",
        type: "single",
        prompt:
          "A news editor reads that three studies found no link and says: “So whether readers are trusting has nothing to do with whether they believe headlines.” Which reply is best supported?",
        evidence: [
          "Study 1: statements shown as plain text on a blank background (UK adults).",
          "Study 2: statements presented as coming from other participants (UK adults).",
          "Study 3: ten mock witness testimonies judged by US adults acting as jurors.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Three null findings rule out a role for reader trust across headlines, outlets and social contexts.",
          },
          {
            id: "o1",
            text: "These online tasks do not establish how trust affects belief in real news outlets.",
          },
          {
            id: "o3",
            text: "Null findings cannot constrain any relationship, so the studies provide no evidence relevant to the claim.",
          },
          {
            id: "o4",
            text: "Only the courtroom task applies, since statements outside court cannot involve social trust at all.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Ask what kinds of statements, sources and people were actually tested.",
        misconceptions: {
          o2: "The scope of the tasks does not cover all those settings.",
          o3: "Narrow estimates can be informative within the studied scope.",
          o4: "The other tasks also tested trust-related predictions, within their own settings.",
        },
        explanation:
          "The null result is credible for the tasks and samples used. The studies did not test headlines from sources readers already know and trust, so extending the claim to real news goes beyond the evidence.",
        refs: ["e10", "e11", "e12"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Choosing a Follow-Up",
        type: "single",
        prompt:
          "More trusting people also said fewer people lie, yet that belief did not predict their judgments either. Which follow-up best tests the explanation the authors raise?",
        evidence: [
          "Trust propensity and expected lying were correlated (r = −0.52 in Study 1).",
          "Expected lying did not predict truth judgments (p = 0.30 in Study 1).",
          "Reading ease and memory of earlier statements are known to change truth judgments.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Repeat the same tasks with a larger sample, keeping readability constant throughout.",
          },
          {
            id: "o3",
            text: "Use expected lying in place of trust, since it was the strongest predictor of true judgements.",
          },
          {
            id: "o1",
            text: "Test reading fluency and trust together to compare their predictions in the same people.",
          },
          {
            id: "o4",
            text: "Measure trust alone without statement judgements, to see whether trusting people report similar scores.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "The authors suggest that something other than a trait drives these judgments. Which option measures that something?",
        misconceptions: {
          o2: "This improves precision but does not directly test the proposed fluency explanation.",
          o3: "Expected lying did not predict judgements either.",
          o4: "That removes the outcome needed to test the explanation.",
        },
        explanation:
          "The authors suggest that truth judgments depend more on cognitive mechanisms such as fluency and memory than on stable traits. A follow-up that varies fluency and compares its effect with trust tests that idea directly.",
        refs: ["e13", "e14", "e15", "e16"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "Across three studies with 679 adults, neither trust propensity nor social trust predicted whether people judged statements as true. Bayesian analyses mostly favoured no effect, though one result for social trust depended on the prior. The tasks used ambiguous statements and mock testimonies, so the finding does not cover real news from known sources.",
};
