// Originally generated 2026-10-25; source-checked question revision 2026-10-28.
// Source paper: docs/research/papers/icht-2014-production-effect-distinctiveness.pdf
// Agent source review is not content-owner approval; see PREPARED_STUDY_REVIEW.md.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-reading-words-aloud",
    title:
      "Understanding Statistical Distinctiveness and the Production Effect",
    briefing:
      "This lesson guides you through the design, results, and interpretation of a study examining how statistical distinctiveness influences the production effect in memory.",
    source: "generated",
    paper: {
      title:
        "The production effect in memory: multiple species of distinctiveness",
      authors: "Icht, Mama & Algom (2014)",
      journal: "Frontiers in Psychology 5: 886",
      url: "https://doi.org/10.3389/fpsyg.2014.00886",
      limitations: [
        "The recall reversal in the mostly-aloud condition involved only eight silent items (p. 5).",
        "The study did not include a pure-list between-subjects manipulation to test a memory-strength account (p. 5).",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 4,
        excerpt:
          "In the 50–50% group, participants remem-\nbered words that were read aloud better (27%) than words which\nwere read silently (19%), t(19) = 2.018, p < 0.05.",
      },
      {
        id: "e2",
        page: 5,
        excerpt:
          "Our goal in this study was to demonstrate the potency of sta-\ntistical distinctiveness.",
      },
      {
        id: "e3",
        page: 5,
        excerpt:
          "A mixed-\nmeasures ANOVA with subset-size (20, 50, 80% aloud) as a\nbetween subjects variable and type of learning (vocal production,\nsilent reading) as a within subjects variable revealed again a sig-\nnificant interaction between the two main factors [F(2,57) = 7.55,\np < 0.001].",
      },
      {
        id: "e4",
        page: 5,
        excerpt:
          "In the 50–50% group, participants recog-\nnized correctly words that were read aloud better (69.2%) than\nthey did words that were read silently (54.2%), t(19) = 3.961,\np < 0.001.",
      },
      {
        id: "e5",
        page: 5,
        excerpt:
          "The PE vanished altogether in the 80% aloud condition with comparable recognition of aloud and silent words (65.3 and 63.1%, respectively), t(19) = 0.444, p > 0.3.",
      },
      {
        id: "e6",
        page: 5,
        excerpt:
          "We must be circumspect though as, numerically, the reversal entailed eight items only.",
      },
      {
        id: "r1",
        page: 5,
        excerpt:
          "We must be circumspect though as, numerically, the reversal entailed eight items only. Replication and extension are clearly invited in future research. Because we did not attempt to test a memory strength account here, our study did not include a between-subjects pure lists manipulation. Fortunately though, the critical data do exist in the literature. The original experiments and data are construed along different lines, of course, but, upon new scrutiny augmented by the present results, they support statistical distinctiveness. In Experi- ments 1 and 2 of the Ozubko and MacLeod (2010) study, different groups of participants were presented with an all aloud or an all silent list of words, respectively. Subsequently, the participants in each group were presented with a mixed-list entailing 50–50% of aloud and silent words.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Compare the design",
        type: "single",
        prompt:
          "Why is the 20/50/80% comparison between participants but aloud versus silent learning within participants?",
        evidence: [
          "Each person completed one word-list proportion condition, containing both aloud and silent words.",
        ],
        options: [
          {
            id: "o2",
            text: "Every participant completed all proportion groups but learned only in one mode.",
          },
          {
            id: "o1",
            text: "Proportion groups contain different people; learning modes repeat within each person.",
          },
          {
            id: "o3",
            text: "Both contrasts use independent people because each word can be recalled only once.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "The allocation and learning-mode structure are the reverse of that description.",
          o3: "Repeated words or trials remain clustered within the same learner.",
        },
        explanation:
          "The mixed design combines a between-person proportion manipulation with a within-person learning-mode contrast.",
        refs: ["e3"],
        writtenReasoning: false,
        reveal: "design",
        scene: {
          version: 1,
          title: "How the word lists differ",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "How the word lists differ",
          provenance: {
            kind: "source-summary",
            refs: ["e3"],
            note: "Study information paraphrased from the cited source.",
          },
          responses: [
            {
              optionId: "o2",
              label:
                "Every participant completed all proportion groups but learned only in one mode.",
              targetIds: ["row0", "row1"],
            },
            {
              optionId: "o1",
              label:
                "Proportion groups contain different people; learning modes repeat within each person.",
              targetIds: ["row0", "row1"],
            },
            {
              optionId: "o3",
              label:
                "Both contrasts use independent people because each word can be recalled only once.",
              targetIds: ["row0", "row1"],
            },
          ],
          resolution: null,
          kind: "matrix",
          conditions: [
            {
              id: "condition0",
              label: "20% aloud",
            },
            {
              id: "condition1",
              label: "50% aloud",
            },
            {
              id: "condition2",
              label: "80% aloud",
            },
          ],
          rows: [
            {
              id: "row0",
              label: "List allocation",
              detail: "Reported features of each condition.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e3"],
                note: "Study information paraphrased from the cited source.",
              },
              cells: [
                "Different participants",
                "Different participants",
                "Different participants",
              ],
            },
            {
              id: "row1",
              label: "Within a list",
              detail: "Reported features of each condition.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e3"],
                note: "Study information paraphrased from the cited source.",
              },
              cells: [
                "Aloud and silent words",
                "Aloud and silent words",
                "Aloud and silent words",
              ],
            },
          ],
        },
      },
      {
        id: "c2",
        stage: "Read the results",
        title: "Interpret the result",
        type: "single",
        prompt:
          "Recall is 27% aloud versus 19% silent in the balanced group. Which quantity describes the raw gap?",
        evidence: ["The comparison reports t(19) = 2.018, p < .05."],
        options: [
          {
            id: "o2",
            text: "Eight percent relative improvement because subtraction and division are interchangeable.",
          },
          {
            id: "o3",
            text: "Forty-six percentage points because recall rates for the two modes should be added.",
          },
          {
            id: "o1",
            text: "Eight percentage points; statistical significance is a separate property of the test.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "A relative change uses the silent baseline as a denominator.",
          o3: "Adding rates does not measure the contrast between them.",
        },
        explanation:
          "27 minus 19 is 8 percentage points. The p-value describes the evidence under the test, not the size of this raw gap.",
        refs: ["e1"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Interpret the result",
        type: "single",
        prompt:
          "Recognition is 69.2% versus 54.2%. Does its smaller p-value prove that its advantage exceeds the recall advantage?",
        evidence: [
          "The balanced-group recognition contrast has p < .001; its recall contrast has p < .05.",
        ],
        options: [
          {
            id: "o1",
            text: "No; comparing p-values is not a direct comparison of the two outcome effects.",
          },
          {
            id: "o2",
            text: "Yes; a smaller p-value always identifies the larger practical benefit across tests.",
          },
          {
            id: "o3",
            text: "No; significance makes it impossible to compare the outcomes in any analysis.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "P-values depend on variability and design as well as effect size.",
          o3: "Outcome contrasts can be compared with an appropriate direct analysis, not by p-value ordering.",
        },
        explanation:
          "The two outcomes have different scales and variability. Neither relative p-values nor isolated significance labels directly test the difference between their effects.",
        refs: ["e4"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Interpret the result",
        type: "single",
        prompt:
          "Recognition in the 80%-aloud group is 65.3% aloud versus 63.1% silent (p > .3). Which conclusion stays within that test?",
        evidence: [
          "The visual compares recognition, not the separate recall-reversal result.",
        ],
        options: [
          {
            id: "o1",
            text: "The test establishes that silent and aloud recognition are exactly equal in the population.",
          },
          {
            id: "o3",
            text: "No clear recognition advantage was detected; exact equality was not established.",
          },
          {
            id: "o2",
            text: "The test establishes a statistically significant recognition reversal in favour of silent words.",
          },
        ],
        accepted: ["o3"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o1: "Nonsignificance is not an equivalence result.",
          o2: "The aloud mean is slightly higher and the contrast is not significant.",
        },
        explanation:
          "The recognition contrast does not detect a clear difference. The paper’s separate reversal discussion concerns recall, not this recognition comparison.",
        refs: ["e5", "e4"],
        writtenReasoning: false,
        reveal: "results",
        scene: {
          version: 1,
          title: "Recognition across two list compositions",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "Recognition across two list compositions",
          provenance: {
            kind: "reported",
            refs: ["e4", "e5"],
            note: "Values as printed in the cited excerpt; not individual participant records.",
          },
          responses: [
            {
              optionId: "o1",
              label:
                "The test establishes that silent and aloud recognition are exactly equal in the population.",
              targetIds: [
                "half-aloud",
                "half-silent",
                "most-aloud",
                "most-silent",
              ],
            },
            {
              optionId: "o3",
              label:
                "No clear recognition advantage was detected; exact equality was not established.",
              targetIds: [
                "half-aloud",
                "half-silent",
                "most-aloud",
                "most-silent",
              ],
            },
            {
              optionId: "o2",
              label:
                "The test establishes a statistically significant recognition reversal in favour of silent words.",
              targetIds: [
                "half-aloud",
                "half-silent",
                "most-aloud",
                "most-silent",
              ],
            },
          ],
          resolution: null,
          kind: "comparison",
          measure: "Words recognised correctly",
          unit: "%",
          min: 0,
          max: 100,
          decimals: 1,
          values: [
            {
              id: "half-aloud",
              label: "50% list · aloud",
              detail: "Words recognised correctly",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4", "e5"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              value: 69.2,
            },
            {
              id: "half-silent",
              label: "50% list · silent",
              detail: "Words recognised correctly",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4", "e5"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              value: 54.2,
            },
            {
              id: "most-aloud",
              label: "80% list · aloud",
              detail: "Words recognised correctly",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4", "e5"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              value: 65.3,
            },
            {
              id: "most-silent",
              label: "80% list · silent",
              detail: "Words recognised correctly",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4", "e5"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              value: 63.1,
            },
          ],
          difference: null,
          prediction: {
            label: "Before inspecting the values, what pattern do you expect?",
            options: ["Similar values", "Different values", "Not sure"],
          },
        },
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Bound the conclusion",
        type: "single",
        prompt:
          "What does an interaction between list proportion and learning mode add beyond an overall aloud advantage?",
        evidence: [
          "The aloud–silent contrast changes across the 20%, 50% and 80% list-proportion conditions.",
        ],
        options: [
          {
            id: "o2",
            text: "An average aloud effect must be identical in every list because the same words are used.",
          },
          {
            id: "o3",
            text: "The experiment directly identifies a single mental mechanism from the interaction alone.",
          },
          {
            id: "o1",
            text: "The learning-mode difference depends on how common each mode is in the list.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "The interaction specifically contradicts a constant-gap interpretation.",
          o3: "The pattern can support a theoretical account without uniquely isolating a mental process.",
        },
        explanation:
          "The interaction is consistent with a role for relative distinctiveness. It does not, by itself, identify one exclusive memory mechanism.",
        refs: ["e2", "e3"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: null,
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Bound the conclusion",
        type: "single",
        prompt:
          "Why replicate the recall reversal in the mostly-aloud condition before making a broad rule?",
        evidence: [
          "The authors note that the numerical reversal involved only eight silent items.",
        ],
        options: [
          {
            id: "o1",
            text: "Few items leave the reversal sensitive to item sampling and in need of replication.",
          },
          {
            id: "o2",
            text: "Eight items establish that silently studying always produces superior memory.",
          },
          {
            id: "o3",
            text: "The uncertainty means the separate balanced-list findings must also be discarded automatically.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "A limited item subset cannot establish a universal memory rule.",
          o3: "A limitation of one result does not invalidate every different condition and outcome.",
        },
        explanation:
          "The paper calls for replication and extension. Keep the item-limited recall reversal separate from the nonsignificant recognition contrast.",
        refs: ["r1"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: null,
      },
    ],
    bonus: null,
  },
  takeaway:
    "Aloud words had higher recall and recognition in the balanced lists. When most words were aloud, recognition showed no clear aloud advantage, while recall showed an item-limited reversal. These are separate outcomes; the pattern is consistent with relative distinctiveness but calls for replication rather than a universal study rule.",
};
