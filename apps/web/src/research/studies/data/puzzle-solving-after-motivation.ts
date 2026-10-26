// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/harris-2013-goal-priming-failures.pdf
// Revised 27 October 2026: answers were copied from the evidence lines, and one mixed Experiment 1's test with Experiment 2's means; now decisions about blinding, puzzle versions, two replications, scoring, power and explanations.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-puzzle-solving-after-motivation",
    title: "Evaluating a Failed Replication of High-Performance-Goal Priming",
    briefing:
      "A well-known study said hidden achievement words made people better at word puzzles. Decide how a repeat should guard against bias, read two replications, and judge what their failure means.",
    source: "generated",
    paper: {
      title: "Two Failures to Replicate High-Performance-Goal Priming Effects",
      authors: "Harris, Coburn, Rohrer et al. (2013)",
      journal: "PLOS ONE 8(8): e72467",
      url: "https://doi.org/10.1371/journal.pone.0072467",
      limitations: [
        "The original priming materials were no longer available, so some details had to be recreated.",
        "Both replications used undergraduate students at one university.",
        "The replications could miss a much smaller true effect, for example one of d = 0.20.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 3,
        excerpt:
          "Careful steps were taken to ensure that the experimenter would remain blind to condition.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "The participants were instructed to reach into the box and select their sealed paper to prevent the experimenter from handling any of the forms and inadvertently become aware of the condition.",
      },
      {
        id: "e3",
        page: 3,
        excerpt:
          "To ensure that the word search task was not inadvertently easier in one condition (e.g. the location or arrangement of the target words might help or hinder finding words), we had 5 puzzle matrix orders for each condition.",
      },
      {
        id: "e4",
        page: 6,
        excerpt:
          "If there was more positive transfer from one puzzle than another, their design could misconstrue this as a priming effect.",
      },
      {
        id: "e5",
        page: 4,
        excerpt:
          "This corresponds to an effect size of d = -0.24 (95% confidence interval ranging from 0.15 to -0.64).",
      },
      {
        id: "e6",
        page: 4,
        excerpt:
          "participants tended towards locating fewer words in the high-performance-goal priming condition (M = 17.81, SD = 3.97) than in the neutral condition (M = 19.36, SD = 3.58).",
      },
      {
        id: "e7",
        page: 6,
        excerpt:
          "The effect size for priming was -0.03, with a 95% confidence interval ranging from 0.45 to -.52.",
      },
      {
        id: "e8",
        page: 7,
        excerpt: "we estimate that the observed effect size is .70",
      },
      {
        id: "e9",
        page: 4,
        excerpt:
          "Participants sometimes circled words that were thematically correct but comprised only part of the longer target word.",
      },
      {
        id: "e10",
        page: 4,
        excerpt:
          "(Bargh et al. make no mention of how they dealt with this issue, although presumably it would have arisen in their study as well given that the same stimuli were used.)",
      },
      {
        id: "e11",
        page: 4,
        excerpt:
          "Again, the results showed no main effect for priming condition (nor were the means in the correct direction)",
      },
      {
        id: "e12",
        page: 7,
        excerpt:
          "Experiment 1 had 98 valid subjects, which affords a power of .93 to detect an effect of d = .70",
      },
      {
        id: "e13",
        page: 7,
        excerpt:
          "Experiment 2 had 66 subjects, which corresponds to a power of .80 (2-tailed).",
      },
      {
        id: "e14",
        page: 7,
        excerpt:
          "For example, if the true effect were d = .20, neither of our experiments would have even a 20% chance of detecting the effect.",
      },
      {
        id: "e15",
        page: 6,
        excerpt:
          "Thus, it seems likely that experimenter expectancy effects in the original study are not the reason for the difference in outcomes.",
      },
      {
        id: "e16",
        page: 6,
        excerpt:
          "Another obvious possibility is that the high-performance-goal prime results of Bargh et al. [27] are invalid, and may be due, for example, to Type 1 errors.",
      },
      {
        id: "e17",
        page: 7,
        excerpt:
          "Finally, the experimenter was not in the room with the participant in our experiments, which might have differed from the original experiments, and might for some reason be important",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "Keeping the Experimenter Blind",
        type: "single",
        prompt:
          "Participants drew a sealed puzzle from a box and told the experimenter only its number. Why go to that trouble?",
        evidence: [
          "The first puzzle contained either achievement words or neutral words.",
          "Someone not otherwise involved prepared and shuffled the sealed puzzles in advance.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "So the experimenter could not know who saw achievement words, and so could not, even unintentionally, treat the groups differently.",
          },
          {
            id: "o2",
            text: "So participants would not know they were in a study.",
          },
          {
            id: "o3",
            text: "To make the puzzles harder.",
          },
          {
            id: "o4",
            text: "To save time between sessions.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who might affect the result if they knew which group each person was in?",
        misconceptions: {
          o2: "Participants knew they were in a study; the procedure hides the condition from the experimenter.",
          o3: "Sealing a puzzle does not change its difficulty.",
          o4: "The steps add time; their purpose is to keep the experimenter blind.",
        },
        explanation:
          "Careful steps kept the experimenter blind to condition, so expectancy effects could not produce an artificial priming effect in the replication.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "Five Versions of Each Puzzle",
        type: "single",
        prompt:
          "The original used one priming puzzle per condition. The replication made five arrangements of each. What does that protect against?",
        evidence: [
          "The priming task and the test were both word-search puzzles.",
          "A puzzle's layout could make words easier or harder to find.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "A difference caused by one particular puzzle being easier, or practising skills that suit the test, rather than by the words themselves.",
          },
          {
            id: "o2",
            text: "Participants copying from each other.",
          },
          {
            id: "o3",
            text: "Running out of puzzles.",
          },
          {
            id: "o4",
            text: "Making the effect larger.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If each group always gets the same single puzzle, what else besides the words differs between groups?",
        misconceptions: {
          o2: "Participants worked alone in separate rooms.",
          o3: "The point is not supply but avoiding a confound tied to one puzzle.",
          o4: "Varying layouts is meant to remove a confound, not to enlarge an effect.",
        },
        explanation:
          "With one puzzle per condition, positive transfer from one layout could be mistaken for priming. Several arrangements per condition make sure neither condition is easier by accident.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "Two Replications",
        type: "single",
        prompt:
          "The original study's effect was estimated at d = 0.70 in favour of achievement words. What do the two replications show?",
        evidence: [
          "Positive d would mean more words found after achievement words.",
          "Replication 1: 98 students. Replication 2, with a 5-minute delay: 66 students.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Effect of achievement words",
          instruction:
            "Compare each interval with zero and with the original estimate of 0.70.",
          description:
            "Effect size d with 95% confidence intervals in the two replications. The original study's estimated d was 0.70.",
          provenance: {
            kind: "reported",
            refs: ["e5", "e7", "e8"],
            note: "Effect sizes and intervals as printed in the results.",
          },
          measure: "Cohen's d",
          min: -0.8,
          max: 0.9,
          reference: {
            value: 0,
            label: "No effect",
          },
          band: {
            lower: 0.69,
            upper: 0.71,
            label: "Original estimate, 0.70",
            at: "setup",
          },
          estimates: [
            {
              id: "r1",
              label: "Replication 1",
              detail: "Words found right after the priming puzzle.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -0.24,
              lower: -0.64,
              upper: 0.15,
            },
            {
              id: "r2",
              label: "Replication 2",
              detail: "Words found after a 5-minute delay.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e7"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -0.03,
              lower: -0.52,
              upper: 0.45,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "No advantage, and far from 0.70",
            detail:
              "Both intervals include zero, and neither reaches the original estimate of 0.70.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e5", "e7", "e8"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "No advantage; far from 0.70",
              targetIds: ["r1", "r2"],
            },
            {
              optionId: "o2",
              label: "Confirms original",
              targetIds: ["r1", "r2"],
            },
            {
              optionId: "o3",
              label: "Words hurt performance",
              targetIds: ["r1"],
            },
            {
              optionId: "o4",
              label: "Delay made it work",
              targetIds: ["r2"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "Neither replication found an advantage; both intervals include zero and stop well short of the original 0.70.",
          },
          {
            id: "o2",
            text: "They confirm the original, since replication 2 points slightly the right way.",
          },
          {
            id: "o3",
            text: "They show achievement words make people worse.",
          },
          {
            id: "o4",
            text: "The 5-minute delay made the effect appear.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Check each interval against zero and against 0.70.",
        misconceptions: {
          o2: "Replication 2 is −0.03, essentially zero, and its interval excludes 0.70.",
          o3: "Replication 1 leaned that way, but its interval includes zero.",
          o4: "With the delay, the effect was −0.03, essentially zero.",
        },
        explanation:
          "Replication 1 found d = −0.24 (−0.64 to 0.15) and replication 2 d = −0.03 (−0.52 to 0.45). Both include zero and both exclude the original estimate of 0.70.",
        refs: ["e5", "e6", "e7", "e8"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "PEA Inside PEACH",
        type: "single",
        prompt:
          "Some participants circled shorter words hidden in target words, such as PEA inside PEACH. The original paper said nothing about this. Why score the results two ways?",
        evidence: [
          "Strict scoring: only full target words count.",
          "Lenient scoring: a fitting shorter word counts if the full word was missed.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "To show that the null result does not depend on a scoring choice the original paper never specified.",
          },
          {
            id: "o2",
            text: "To pick whichever scoring gives a significant effect.",
          },
          {
            id: "o3",
            text: "Because strict scoring is always wrong.",
          },
          {
            id: "o4",
            text: "To double the sample size.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If the original never said how these words were counted, what should a careful replication do?",
        misconceptions: {
          o2: "Reporting both, with the same conclusion, is the opposite of choosing a favourable one.",
          o3: "Neither is wrong; the point is that results should not hinge on the choice.",
          o4: "Scoring the same answers twice does not add participants.",
        },
        explanation:
          "The original did not say how overlapping words were handled. Under lenient scoring there was again no effect of priming, and the means were not in the predicted direction, so the conclusion does not depend on the rule.",
        refs: ["e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "Just Bad Luck?",
        type: "single",
        prompt:
          "Could both replications have failed by chance even though the effect is real?",
        evidence: [
          "Power to detect d = .70: .93 with 98 students, .80 with 66 students.",
          "Chance of detecting d = 0.20: under 20% in either study.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Unlikely if the effect were as large as originally reported, but quite possible if the true effect is much smaller.",
          },
          {
            id: "o2",
            text: "Yes, very likely, whatever the effect size.",
          },
          {
            id: "o3",
            text: "No, the replications prove there is no effect at all.",
          },
          {
            id: "o4",
            text: "Power does not matter for replications.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Power depends on the size of the effect you are looking for.",
        misconceptions: {
          o2: "With power of .93 and .80 for d = .70, missing an effect that size twice would be unlikely.",
          o3: "They had low power for small effects, so a small real effect is not ruled out.",
          o4: "Power is central to judging what a null result means.",
        },
        explanation:
          "If the effect were as large as reported in the original Experiment 1, both replications would very likely have found it. A much smaller effect, such as d = 0.20, would usually be missed.",
        refs: ["e12", "e13", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "Which Explanation Is Least Likely?",
        type: "single",
        prompt:
          "Several explanations could account for the different results. Which one does the replication's own procedure make least likely?",
        evidence: [
          "The replication kept experimenters blind to condition.",
          "In the replication, the experimenter waited outside the room during the tasks.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "That the experimenter's expectations created the original result, since the replication's blinding removed that route.",
          },
          {
            id: "o2",
            text: "That the original result was a false positive.",
          },
          {
            id: "o3",
            text: "That the experimenter's absence from the room matters.",
          },
          {
            id: "o4",
            text: "That failed replications tend to go unpublished.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which explanation does the blinding procedure speak to?",
        misconceptions: {
          o2: "The replication cannot rule that out; the authors raise it as a possibility.",
          o3: "That difference is untested here; the authors note it as a possibility.",
          o4: "That is a feature of the literature, not something this procedure tests.",
        },
        explanation:
          "Because the replication kept experimenters blind, the authors think expectancy effects in the original are unlikely to explain the difference. A false positive, publication bias and the experimenter's presence remain possibilities.",
        refs: ["e15", "e16", "e17"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "Two careful replications with 98 and 66 students found no advantage for people who first searched for achievement words, with effects of −0.24 and −0.03 against the original 0.70. They were well powered for an effect that large but could miss a much smaller one, so the original finding is not confirmed.",
};
