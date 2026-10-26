// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/imaizumi-2020-fluid-movements-creativity-replication.pdf
// Revised 26 October 2026: scene text that restated the answer and lookup questions replaced by decisions about matching, mood timing, effect size, power, baseline and culture.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-tracing-shapes-while-brainstorming",
    title: "Fluid movements enhance creative fluency: A replication",
    briefing:
      "Decide how to test whether tracing smooth shapes changes brainstorming, and how far a smaller result in a new sample can be pushed.",
    source: "generated",
    paper: {
      title:
        "Fluid movements enhance creative fluency: A replication of Slepian and Ambady (2012)",
      authors: "Imaizumi, Tagami & Yang (2020)",
      journal: "PLOS ONE 15(7): e0236825",
      url: "https://doi.org/10.1371/journal.pone.0236825",
      limitations: [
        "There was no baseline condition without arm movements, so it is unclear whether fluid movements help or angular movements hinder.",
        "All 60 participants analysed were Japanese female students of about 17, unlike the American undergraduates of the original study.",
        "Flexibility in divergent thinking was not examined.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 3,
        excerpt:
          "In the fluid condition, the line drawings consisted of curves. In the non-fluid condition, the line drawings had the same shape as the fluid condition except that they consisted of straight lines and vertices.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "To control motor trajectories, the word “Start” alongside each drawing indicated where to start tracing.",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "Following the tracing, participants wrote down as many alternative uses for newspapers as possible within one minute (i.e., the alternative uses task [21, 23]). Subsequently, participants responded to two questions. The first asked them to rate their current mood (How do you feel right now?) on a nine-point scale ranging from 1 (very bad) to 9 (very good).",
      },
      {
        id: "e4",
        page: 6,
        excerpt:
          "Self-reported mood after the alternative uses task, subjective difficulty of the tracing task, and daily experiences with newspapers did not predict the fluency or interact with the effect of arm movement fluidity.",
      },
      {
        id: "e5",
        page: 5,
        excerpt:
          "Fluency 4.17 (1.37) 3.33 (1.40) Originality 2.86 (0.52) 2.69 (0.58)",
      },
      {
        id: "e6",
        page: 6,
        excerpt: "Fluency 7.24 (1.21) 2.38 5.65 (1.07) 1.86",
      },
      {
        id: "e7",
        page: 6,
        excerpt:
          "Values are approximate as they were drawn from the figure by a digitizer.",
      },
      {
        id: "e8",
        page: 5,
        excerpt:
          "The fluency score was significantly higher for the fluid condition than non-fluid condition (t(58) = 2.34, p = 0.023, d = 0.60, 95% CI [0.12, 1.55])",
      },
      {
        id: "e9",
        page: 5,
        excerpt:
          "while the originality score did not differ between conditions (t(58) = 1.16, p = 0.250, d = 0.30, 95% CI [-0.12, 0.45])",
      },
      {
        id: "e10",
        page: 3,
        excerpt:
          "The present study assumed the smaller d of 0.87 in the two-sided unpaired t-test, an alpha of 0.05, and statistical power of 0.90.",
      },
      {
        id: "e11",
        page: 3,
        excerpt: "at least 29 participants were required for each group.",
      },
      {
        id: "e12",
        page: 6,
        excerpt:
          "The original study [23] reported larger effect sizes of fluidity on fluency and originality (ds = 1.04, 0.87, respectively) than did the present study (ds = 0.60, 0.30, respectively).",
      },
      {
        id: "e13",
        page: 8,
        excerpt:
          "First, like Slepian and Ambady [23], we did not include a baseline condition (e.g., without arm movements). Thus, it remains unclear whether fluid arm movements increase or non-fluid arm movements decrease fluency in divergent thinking.",
      },
      {
        id: "e14",
        page: 3,
        excerpt:
          "In total, 63 Japanese female students participated in this study.",
      },
      {
        id: "e15",
        page: 7,
        excerpt:
          "Given that the original study employed American undergraduates, cultural differences could have affected divergent creative thinking.",
      },
      {
        id: "e16",
        page: 7,
        excerpt:
          "However, note that findings on Eastern–Western differences in creativity are currently mixed [43] and even reversed in some studies [44].",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Matched Drawings",
        type: "single",
        prompt:
          "The two groups traced drawings with the same shapes, sizes and start points, one set curved and one set angular. Why match them so closely?",
        evidence: [
          "Fluid group: drawings made of curves.",
          "Non-fluid group: the same shapes drawn with straight lines and corners.",
          "Each drawing had a marked starting point.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "To conceal which paths were curved or angular, making participants blind to their condition.",
          },
          {
            id: "o3",
            text: "To hold idea counts constant by ensuring every participant generated the same number before measurement.",
          },
          {
            id: "o4",
            text: "To replace random assignment, since matching stimuli guarantees comparable people in the two conditions.",
          },
          {
            id: "o1",
            text: "To isolate curvature from other drawing features that might affect idea generation.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What else could differ between curved and angular drawings besides curvature?",
        misconceptions: {
          o2: "Participants could see and trace the drawings; matching was not blinding to curvature.",
          o3: "Idea count was an outcome, not a feature fixed by matching drawings.",
          o4: "Matching materials does not assign or balance participants.",
        },
        explanation:
          "Matching shape, size and starting point leaves curvature as the intended difference, so a difference in the ideas written afterwards is easier to attribute to fluid versus angular movement.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "When Mood Was Asked",
        type: "single",
        prompt:
          "The team checked that mood did not explain the result. Mood was rated after the idea task. How much does that weaken the check?",
        evidence: [
          "Order: trace three drawings, write uses for a newspaper for one minute, then rate mood and difficulty.",
          "Mood scale: 1 (very bad) to 9 (very good).",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "The later rating recovers earlier mood exactly.",
          },
          {
            id: "o3",
            text: "The timing invalidates the main comparison.",
          },
          {
            id: "o1",
            text: "The later rating may reflect the idea task rather than mood during tracing.",
          },
          {
            id: "o4",
            text: "The timing strengthens the mechanism test.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Could doing well or badly on the idea task change how someone says they feel?",
        misconceptions: {
          o2: "Mood can change during or after the task.",
          o3: "A weaker mechanism check does not automatically invalidate the experimental contrast.",
          o4: "Later measurement may itself be influenced by task experience.",
        },
        explanation:
          "Mood, difficulty and newspaper use did not predict fluency or interact with condition, which is reassuring. But mood was asked after the task, so it may partly reflect the task, and the check is weaker than a measure taken before or between tasks.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Fewer Uses Than Before",
        type: "single",
        prompt:
          "The new study found more uses in the fluid group, like the original. Comparing the averages with the original study's, which description is best?",
        evidence: [
          "Average number of uses in one minute, fluid versus non-fluid.",
          "Original-study averages were read off a figure, so they are approximate.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Uses per participant",
          instruction:
            "Compare the gap inside each study, then the levels across studies.",
          description:
            "Average number of alternative uses written in one minute. Original-study values are approximate.",
          provenance: {
            kind: "reported",
            refs: ["e5", "e6", "e7"],
            note: "Averages as printed; the original study's values were estimated from its figure.",
          },
          measure: "Average number of uses",
          unit: "uses",
          decimals: 1,
          min: 0,
          max: 8,
          values: [
            {
              id: "new-f",
              label: "New study, fluid",
              detail: "30 participants.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Mean as printed in the descriptive table.",
              },
              value: 4.17,
            },
            {
              id: "new-n",
              label: "New study, non-fluid",
              detail: "30 participants.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Mean as printed in the descriptive table.",
              },
              value: 3.33,
            },
            {
              id: "old-f",
              label: "Original study, fluid",
              detail: "15 participants, approximate.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6", "e7"],
                note: "Mean estimated from the original study's figure.",
              },
              value: 7.24,
            },
            {
              id: "old-n",
              label: "Original study, non-fluid",
              detail: "15 participants, approximate.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6", "e7"],
                note: "Mean estimated from the original study's figure.",
              },
              value: 5.65,
            },
          ],
          difference: {
            from: "new-n",
            to: "new-f",
            label: "New study gap: about 0.8 uses",
            at: "feedback",
          },
          prediction: null,
          resolution: null,
          responses: [
            {
              optionId: "o2",
              label: "Exact replication",
              targetIds: ["new-f", "old-f"],
            },
            {
              optionId: "o1",
              label: "Same direction, smaller gap, lower levels",
              targetIds: ["new-f", "new-n", "old-f", "old-n"],
            },
            {
              optionId: "o3",
              label: "Gap reversed",
              targetIds: ["new-n"],
            },
            {
              optionId: "o4",
              label: "No fluid advantage",
              targetIds: ["new-f", "new-n"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o2",
            text: "The effect replicated in size, because the same ordering of group means establishes the same magnitude.",
          },
          {
            id: "o1",
            text: "The direction replicated, but the gap was about half the original (roughly 0.8 uses against 1.6), and both groups wrote fewer uses overall.",
          },
          {
            id: "o3",
            text: "The effect reversed, because lower overall idea counts mean the angular group now exceeded the fluid group.",
          },
          {
            id: "o4",
            text: "The advantage vanished, because a gap smaller than the original cannot count as a positive difference.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the size of the gap in each study, then the height of the bars across studies.",
        misconceptions: {
          o2: "Matching direction does not imply matching size.",
          o3: "Lower overall means do not imply a reversal between conditions.",
          o4: "A smaller positive difference remains a positive difference.",
        },
        explanation:
          "The new fluid group averaged 4.17 uses against 3.33, a gap of about 0.8. The original study's approximate figures, 7.24 against 5.65, show a gap of about 1.6 at a higher level. So the effect replicated in direction but was smaller.",
        refs: ["e5", "e6", "e7", "e8", "e12"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "No Effect on Originality?",
        type: "single",
        prompt:
          "Originality did not differ significantly between the groups. Does that show fluid movements do not affect originality?",
        evidence: [
          "Originality: d = 0.30, p = 0.250, in the same direction as in the original study.",
          "Group size was planned for the original study's smaller effect size, d = 0.87.",
          "30 participants per group.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "No; power for a large effect can miss a smaller originality effect.",
          },
          {
            id: "o2",
            text: "Yes; a p-value above .05 establishes that the originality effect is exactly zero in the population.",
          },
          {
            id: "o3",
            text: "Yes; the null identifies unreliable ratings as the sole reason originality differed from idea count.",
          },
          {
            id: "o4",
            text: "No; the originality comparison passed the significance threshold despite being described as non-significant.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How big an effect was the study designed to detect, and how big was the observed one?",
        misconceptions: {
          o2: "Non-significance leaves a range of effects compatible with the data.",
          o3: "The null alone does not establish unreliable measurement.",
          o4: "The originality comparison was not significant.",
        },
        explanation:
          "The team planned 29 participants per group to detect d = 0.87 with 90% power. An observed d of 0.30 is much smaller, so the study could easily miss a real effect of that size. The authors treat the originality result as a failure to find an effect, not proof of none.",
        refs: ["e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Which Group Is Missing?",
        type: "single",
        prompt:
          "Fluid tracing produced more uses than angular tracing. Which extra condition would show whether fluid movement helps or angular movement hurts?",
        evidence: [
          "Conditions run: fluid tracing and angular tracing only.",
          "The question: is the gap due to a boost, a drag, or both?",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Add a more angular drawing, testing two degrees of angularity without a no-movement reference.",
          },
          {
            id: "o3",
            text: "Increase both existing groups, estimating their difference more precisely without adding a baseline.",
          },
          {
            id: "o1",
            text: "A baseline group that makes no tracing movements, compared with each of the two tracing groups.",
          },
          {
            id: "o4",
            text: "Measure mood before tracing, replacing the comparison of idea counts with an earlier mood check.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "To say whether something goes up or down, you need a point of reference.",
        misconceptions: {
          o2: "Another tracing condition alone does not locate either effect relative to no tracing.",
          o3: "Precision does not distinguish benefit from harm relative to an absent baseline.",
          o4: "Mood timing does not supply a no-tracing creativity baseline.",
        },
        explanation:
          "The authors note that, like the original study, they included no baseline condition. Without one, it is unclear whether fluid arm movements increase fluency or non-fluid movements decrease it.",
        refs: ["e13"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Is It Culture?",
        type: "single",
        prompt:
          "A colleague says the smaller effect shows Japanese students are less affected by arm movements. What is the best reply?",
        evidence: [
          "Original study: American undergraduates, 15 per group.",
          "New study: 60 Japanese female students, about 17 years old, 30 per group.",
          "Originality raters were Japanese volunteers.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Culture is one explanation the authors raise, but the study did not test it, and sample, size, raters and chance could also explain the smaller effect.",
          },
          {
            id: "o2",
            text: "Culture is established as the cause, since a difference between national samples isolates cultural influence.",
          },
          {
            id: "o3",
            text: "Culture is ruled out, since the same creativity task must have identical effects in every population.",
          },
          {
            id: "o4",
            text: "Mood explains the difference, since the new study found a clear mood gap between tracing conditions.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many things differ between the original and the new study?",
        misconceptions: {
          o2: "Other study and sampling differences remain mixed with culture.",
          o3: "A common task does not establish identical effects across populations.",
          o4: "The study did not establish that mood difference or mechanism.",
        },
        explanation:
          "The authors suggest that cultural differences could have affected divergent thinking, and that raters may judge originality differently across cultures. They also note the evidence on cultural differences is mixed. Culture was not tested, so it stays a possibility.",
        refs: ["e14", "e15", "e16"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In 60 Japanese female students, those who traced curved shapes wrote more alternative uses for a newspaper than those who traced angular shapes, though the gap was smaller than in the original study, and originality did not differ. With no no-movement group and a small sample, it is unclear whether fluid movement helps or angular movement hinders.",
};
