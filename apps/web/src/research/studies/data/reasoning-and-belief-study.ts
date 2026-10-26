// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/sanchez-2017-analytic-thinking-religion-replication.pdf
// Revised 26 October 2026: answers were copied from the evidence lines; now decisions about sample size, a positive control, intervals, one odd site, the limits of a null and exclusions.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-reasoning-and-belief-study",
    title: "Analytic Thinking and Religious Belief Replication",
    briefing:
      "A famous experiment said a picture could weaken religious belief. Decide how a repeat of it should be planned, read the results across four sites, and judge what the failure to repeat it does and does not show.",
    source: "generated",
    paper: {
      title:
        "Direct replication of Gervais & Norenzayan (2012): No evidence that analytic thinking decreases religious belief",
      authors: "Sanchez, Sundermeier, Gray et al. (2017)",
      journal: "PLOS ONE 12(2): e0172636",
      url: "https://doi.org/10.1371/journal.pone.0172636",
      limitations: [
        "The replication tested one experiment from the original paper, using one picture prime.",
        "Religious belief was strongly bimodal, mostly believers and non-believers.",
        "Samples were students at three US schools and US online workers, not a random sample of people.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 2,
        excerpt:
          "We set a sample-size target of 227 participants per condition. This was based on the largest sample size used by G&N (Study 5, n = 91 in the analytic group) and the recommendation of achieving at least 2.5 times the original sample size [9].",
      },
      {
        id: "e2",
        page: 5,
        excerpt:
          "Original Study 31/26 61.6 (35.7) 41.4 (31.5) -0.59 [-1.12, -0.06]",
      },
      {
        id: "e3",
        page: 3,
        excerpt:
          "To help indicate the overall quality of our replication we included as a positive control an additional experiment with a well-defined effect size.",
      },
      {
        id: "e4",
        page: 5,
        excerpt:
          "we detected an expected effect in an additional positive control study with the same partici- pants (F(1,963) = 21.2, p < .001, Table 3).",
      },
      {
        id: "e5",
        page: 5,
        excerpt:
          "Direct Replication U.S. Online 199/212 50.6 (43.5) 48.1 (42.3) -0.06 [-0.25, 0.14] Community college 110/109 66.7 (36.8) 65.9 (36.9) -0.02 [-0.29, 0.24] Private Catholic 81/85 76.6 (32.6) 78.8 (31.2) 0.06 [-0.24, 0.36] Private Lutheran 83/73 76.9 (29.5) 87.4 (26.1) 0.38 [0.07, 0.70] All Replication Sites 473/479 0.07 [-0.12, 0.25]",
      },
      {
        id: "e6",
        page: 5,
        excerpt:
          "A test for heterogeneity of effect sizes was not significant (Q(3) = 5.73, p = 0.13).",
      },
      {
        id: "e7",
        page: 5,
        excerpt:
          "We did note that the largest effect we observed (in the wrong direction) was at the site with the highest level of religious belief in the control group. This could represent normal sampling variability.",
      },
      {
        id: "e8",
        page: 6,
        excerpt:
          "We found that average belief in each control group is not a statistically significant predictor of effect size (β = .38, 95% CI [-0.04, 0.80], p = 0.08, N = 5 study sites; see S1 Fig).",
      },
      {
        id: "e9",
        page: 6,
        excerpt:
          "a much larger study [15] estimates that this manipulation produces little to no change in scores on the Cognitive Reflection Test (CRT), another measure of analytic thinking (Study 5: d = -0.04, 95% CI[-0.29, .21], N = 247).",
      },
      {
        id: "e10",
        page: 4,
        excerpt:
          "Excluded participants are not represented in any of the results presented here, but essen- tially identical results are obtained without these exclusions.",
      },
      {
        id: "e11",
        page: 2,
        excerpt:
          "In the online study, 491 completed the study. Of these, 80 failed one or more of our pre-registered quality controls (see below), leaving 411 for analysis.",
      },
      {
        id: "e12",
        page: 1,
        excerpt:
          "We observed little to no effect of the experimental manipulation on religious belief (d = 0.07 in the wrong direction, 95% CI[-0.12, 0.25], N = 941).",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "How Many Is Enough?",
        type: "single",
        prompt:
          "The original result came from 57 people in two small groups. The team recruited at least 227 per condition. Why so many more?",
        evidence: [
          "Original study: 31 and 26 people per group; effect d = −0.59, interval −1.12 to −0.06.",
          "Replication target: at least 227 per condition, about 2.5 times the largest original group.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "A result from small groups can overstate the true effect, so a fair test needs enough people to detect a smaller effect and to estimate it precisely.",
          },
          {
            id: "o2",
            text: "More people always make a result significant.",
          },
          {
            id: "o3",
            text: "The original authors required it.",
          },
          {
            id: "o4",
            text: "To make it easier to hide a failed replication.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How wide was the original interval, and what does that say about how precisely the effect was known?",
        misconceptions: {
          o2: "More people give a clearer answer, not a significant one; if there is no effect, a bigger sample shows that.",
          o3: "The target was set by the replicators based on the original sample sizes and a published recommendation.",
          o4: "A larger, pre-registered sample makes a replication more informative, not easier to explain away.",
        },
        explanation:
          "The original interval (−1.12 to −0.06) ran from huge to nearly zero. The team aimed for at least 2.5 times the largest original sample so they could estimate the effect precisely, including a smaller one.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "A Task With a Known Effect",
        type: "single",
        prompt:
          "Every participant also did an unrelated gambling-estimate task with a well-known effect. What does including it let the team argue?",
        evidence: [
          "Positive control: a retrospective gambler's task with a well-defined effect size, given in the same session.",
          "Group assignment to it was random and independent of the picture condition.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "If the known effect shows up, the procedure and participants can detect a real effect, so a null on religious belief is less likely to be due to sloppy data collection.",
          },
          {
            id: "o2",
            text: "It shows that analytic thinking does not affect religious belief.",
          },
          {
            id: "o3",
            text: "It increases the chance of finding an effect on religious belief.",
          },
          {
            id: "o4",
            text: "It lets the team pick the best-looking result across tasks.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If a null result could come from careless data, what would you want to check?",
        misconceptions: {
          o2: "The control says nothing about religious belief; it checks the quality of the data.",
          o3: "An unrelated task cannot raise the chance of an effect on belief.",
          o4: "A pre-registered, planned control is not a menu for picking results.",
        },
        explanation:
          "The team ran a task with a well-defined effect to show the quality of the replication. The known effect was found (F(1,963) = 21.2, p < .001), so poor data quality is an unlikely explanation for the null.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "Original Against Four Sites",
        type: "single",
        prompt:
          "Here are the original result and the four replication sites. Which reading of the intervals is best?",
        evidence: [
          "Cohen's d for religious belief, Thinker group minus Discobolus group.",
          "The original predicted lower belief after the Thinker, which is a negative d.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Original and replication",
          instruction:
            "Compare each interval with zero and with the original, then choose the best reading.",
          description:
            "Effect on religious belief with 95% confidence intervals. Negative means lower belief after seeing The Thinker.",
          provenance: {
            kind: "reported",
            refs: ["e2", "e5"],
            note: "Effects and intervals as printed in Table 2.",
          },
          measure: "Cohen's d",
          min: -1.3,
          max: 0.9,
          reference: {
            value: 0,
            label: "No effect",
          },
          band: null,
          estimates: [
            {
              id: "orig",
              label: "Original study",
              detail: "31 and 26 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e2"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -0.59,
              lower: -1.12,
              upper: -0.06,
            },
            {
              id: "online",
              label: "Online sample",
              detail: "199 and 212 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -0.06,
              lower: -0.25,
              upper: 0.14,
            },
            {
              id: "college",
              label: "Community college",
              detail: "110 and 109 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -0.02,
              lower: -0.29,
              upper: 0.24,
            },
            {
              id: "catholic",
              label: "Private Catholic",
              detail: "81 and 85 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.06,
              lower: -0.24,
              upper: 0.36,
            },
            {
              id: "lutheran",
              label: "Private Lutheran",
              detail: "83 and 73 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.38,
              lower: 0.07,
              upper: 0.7,
            },
            {
              id: "all",
              label: "All replication sites",
              detail: "473 and 479 people, combined.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.07,
              lower: -0.12,
              upper: 0.25,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "Centred near zero, far from the original",
            detail:
              "The combined interval (−0.12 to 0.25) is centred near zero and lies far from the original estimate. One site went the opposite way, and the combined result does not match the original.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e2", "e5"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "Near zero, not the original",
              targetIds: ["orig", "all"],
            },
            {
              optionId: "o2",
              label: "Confirms the original",
              targetIds: ["orig", "all"],
            },
            {
              optionId: "o3",
              label: "Priming raises belief",
              targetIds: ["lutheran"],
            },
            {
              optionId: "o4",
              label: "Exactly zero",
              targetIds: ["all"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "The combined interval is centred near zero and far from the original estimate; one site went the other way.",
          },
          {
            id: "o2",
            text: "The replication confirms the original, since the overall estimate is not significantly different from zero.",
          },
          {
            id: "o3",
            text: "The Lutheran site shows that The Thinker raises religious belief.",
          },
          {
            id: "o4",
            text: "The combined interval proves the true effect is exactly zero.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Look at where the combined interval sits relative to zero and to the first interval.",
        misconceptions: {
          o2: "The original reported a moderate-to-large negative effect; a combined estimate near zero is a different result.",
          o3: "That is one of four sites and it is not supported across the others; the authors treat it as likely sampling variability.",
          o4: "The interval is compatible with tiny effects in either direction, not exactly zero.",
        },
        explanation:
          "The combined d is 0.07 with an interval of −0.12 to 0.25, far from the original −0.59. The authors say the interval is consistent with no more than a very small effect in the expected direction.",
        refs: ["e2", "e5"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "One Site Went the Other Way",
        type: "single",
        prompt:
          "At the Lutheran site, belief was significantly higher after The Thinker (p = 0.02), the opposite of the original. How should that be treated?",
        evidence: [
          "Four sites were tested; one reached p < .05, in the opposite direction.",
          "That site also had the highest belief among its control group, 76.9 out of 100.",
          "Test that effects differed across sites: Q(3) = 5.73, p = 0.13.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Cautiously: among four sites one can reach p < .05 by chance, the sites did not differ significantly, and belief level did not significantly predict the effects.",
          },
          {
            id: "o2",
            text: "As proof that The Thinker increases belief.",
          },
          {
            id: "o3",
            text: "As a reason to drop that site and report only the others.",
          },
          {
            id: "o4",
            text: "As evidence the original was right but only for religious students.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many sites were tested, and did the sites differ from each other beyond chance?",
        misconceptions: {
          o2: "One site out of four, in the opposite direction to the original, cannot establish a new effect.",
          o3: "Dropping the one inconvenient site would bias the result; all sites are reported and combined.",
          o4: "The other sites, including a Catholic one, showed nothing, and belief level was not a significant predictor.",
        },
        explanation:
          "The authors note the largest effect was at the highest-belief site and could be normal sampling variability. The heterogeneity test was not significant (p = 0.13), and average control-group belief did not significantly predict effect size (p = 0.08).",
        refs: ["e6", "e7", "e8"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "What the Null Does Not Show",
        type: "single",
        prompt:
          "The replication found no effect. A commentator concludes: “So thinking analytically has no effect on belief.” What is the best-supported statement?",
        evidence: [
          "The experiment used one picture, The Thinker, to prompt analytic thinking.",
          "A larger study found The Thinker produced little change on a standard analytic-thinking test (d = −0.04).",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The experiment does not support the claim, and the picture itself may not change analytic thinking; neither shows analytic thinking can never affect belief.",
          },
          {
            id: "o2",
            text: "The result proves analytic thinking has no effect on belief anywhere.",
          },
          {
            id: "o3",
            text: "The result shows the original authors falsified their data.",
          },
          {
            id: "o4",
            text: "The result shows religious belief cannot be measured.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Ask what was actually manipulated, and whether it did what it was supposed to do.",
        misconceptions: {
          o2: "This tested one prime and one outcome; it cannot rule out every possible link.",
          o3: "Nothing here suggests that; a smaller true effect in a small study is a simpler explanation.",
          o4: "The measure worked as intended, and the positive control showed the procedure could detect a real effect.",
        },
        explanation:
          "The authors conclude that the original experiments do not provide strong evidence that analytic thinking causes a reduction in religious belief, and note that the picture prime may not change analytic thinking. That is narrower than saying the link can never exist.",
        refs: ["e9", "e12"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "Did the Exclusions Matter?",
        type: "single",
        prompt:
          "Of 491 online participants, 80 were excluded for quality reasons. Could those exclusions explain the null?",
        evidence: [
          "Exclusion rules were written down before data were collected.",
          "Online sample: 491 took part and 411 were analysed.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Unlikely: the rules were pre-registered, and the authors report essentially identical results without the exclusions.",
          },
          {
            id: "o2",
            text: "Yes: excluding 16% of people always creates a null result.",
          },
          {
            id: "o3",
            text: "No, because no one was excluded.",
          },
          {
            id: "o4",
            text: "Yes, because the exclusions were chosen after seeing the data.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "When were the rules decided, and what happens when they are not applied?",
        misconceptions: {
          o2: "Exclusions do not automatically create a null; the check here is that results are the same with and without them.",
          o3: "80 online participants were excluded.",
          o4: "They were pre-registered before the data were seen.",
        },
        explanation:
          "The additional online exclusions were pre-registered, and the authors state that essentially identical results are obtained without them. That makes it unlikely the exclusions drive the null.",
        refs: ["e10", "e11"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "A large, pre-registered replication at four sites found little to no effect of a picture prime on religious belief (d = 0.07, interval −0.12 to 0.25), where the original reported d = −0.59 from small groups. One site went the other way, probably by chance. The result undermines that experiment's evidence; it does not show analytic thinking can never affect belief.",
};
