// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/taillie-2022-red-meat-warnings.pdf
// Revised 26 October 2026: removed an invented control-group claim and answer-copying; questions now ask about design limits, effect size, wording and policy reach.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-food-warning-labels",
    title: "Study Design Identification",
    briefing:
      "Researchers tested warning messages about eating red meat. Decide what a design without a no-warning group can and cannot answer, why they chose an effectiveness rating, how big a difference in ratings really is, and how far a study like this can be pushed into policy.",
    source: "generated",
    paper: {
      title:
        "Developing health and environmental warning messages about red meat: An online experiment",
      authors: "Taillie, Prestemon, Hall et al. (2022)",
      journal: "PLOS ONE 17(6): e0268121",
      url: "https://doi.org/10.1371/journal.pone.0268121",
      limitations: [
        "The study had no control group that saw no warning, so it cannot show whether any warning beats none.",
        "It was exploratory with no a priori power calculation, and the sample was a convenience sample of US red meat consumers.",
        "It measured perceived effectiveness and intentions, not purchases or eating.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 5,
        excerpt:
          "Eligible participants were randomized to view a series of either health or envi- ronmental warning messages (between-subjects factor).",
      },
      {
        id: "e2",
        page: 6,
        excerpt:
          "this study omitted a control group, because the main purpose was to understand whether health or environmental messages were perceived as more effective relative to each other.",
      },
      {
        id: "e3",
        page: 3,
        excerpt:
          "with the overarching goal of identifying which messages hold the most promise for use in future studies to test behavioral impact.",
      },
      {
        id: "e4",
        page: 7,
        excerpt:
          "Average PME (the primary outcome) was calculated by averaging responses across all three items.",
      },
      {
        id: "e5",
        page: 10,
        excerpt:
          "Health warning messages (mean PME 2.66, SD 1.18) were perceived as more effective than environmental warning messages (mean PME 2.26, SD 1.14) (p<0.001) (Table 4).",
      },
      {
        id: "e6",
        page: 10,
        excerpt:
          "participants who viewed the health warning messages had stronger intentions to reduce red meat consumption in the next seven days (mean 2.45, SD 1.22) compared to those who viewed the environmental warning messages (mean 2.19, SD 1.17) (p<0.001).",
      },
      {
        id: "e7",
        page: 10,
        excerpt:
          "Specific health harms elicited PME scores ranging from 2.46 to 2.75 (Table 5).",
      },
      {
        id: "e8",
        page: 10,
        excerpt:
          "A narrower range of PME was observed across different environmental messages (range, 2.20 to 2.32).",
      },
      {
        id: "e9",
        page: 10,
        excerpt:
          "The diabetes message elic- ited lower PME ratings than all other messages (p<0.001 for all 7 comparisons).",
      },
      {
        id: "e10",
        page: 10,
        excerpt:
          "After adjusting for multiple comparisons, there were three statistically significant differences between environmental harms (p<0.05).",
      },
      {
        id: "e11",
        page: 11,
        excerpt:
          "Messages also elicited higher PME among participants who had reduced their red meat consumption over the past year compared to those who had not reduced their consumption (b = 0.57 and 0.68 for health and environment, respectively, p < .001).",
      },
      {
        id: "e12",
        page: 7,
        excerpt:
          "After completing the experiment, participants answered a series of questions on demo- graphic characteristics as well as political affiliation and change in red meat consumption over the past 12 months.",
      },
      {
        id: "e13",
        page: 5,
        excerpt:
          "No a priori power calculations were conducted for this exploratory study.",
      },
      {
        id: "e14",
        page: 1,
        excerpt:
          "A national convenience sample of US red meat consumers (n = 1,199; mean age 45 years) completed an online survey in 2020 for this exploratory study.",
      },
      {
        id: "e15",
        page: 17,
        excerpt:
          "Although perceived effectiveness is a marker for messages’ potential to change behavior, more research is needed to assess whether red meat warnings influence red meat purchasing and consumption behaviors.",
      },
      {
        id: "e16",
        page: 2,
        excerpt:
          "Future studies should measure the impact of these messages on behavioral outcomes.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "No Control Group",
        type: "single",
        prompt:
          "Every participant saw red meat warnings; nobody saw a no-warning version. Which question can this design answer, and which can it not?",
        evidence: [
          "Participants were randomly shown a series of either health warnings or environmental warnings.",
          "No group was shown a no-warning version.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It can compare health and environmental warnings with each other, but it cannot show whether any warning beats having none.",
          },
          {
            id: "o2",
            text: "It can show whether warnings reduce how much red meat people buy.",
          },
          {
            id: "o3",
            text: "It can show whether any warning beats no warning.",
          },
          {
            id: "o4",
            text: "It can show which individual people will change what they eat.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What would a no-warning group have given you to compare with?",
        misconceptions: {
          o2: "Nobody's purchases were measured; ratings were collected.",
          o3: "Without a no-warning group there is nothing to compare a warning against.",
          o4: "The study asked for ratings and short-term intentions, not what people did.",
        },
        explanation:
          "The authors left out a control group because the aim was to compare health and environmental messages with each other. That makes the comparison between message types fair, but it says nothing about whether warnings beat no warning.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "Why Rate Effectiveness?",
        type: "single",
        prompt:
          "This early study asked people to rate how effective each warning would be, instead of tracking purchases. Why is that a sensible choice for this stage, and what does it cost?",
        evidence: [
          "Each participant rated every message they saw on three items, averaged into one score from 1 to 5.",
          "Goal of the study: find the most promising messages to test later.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Ratings let the team compare many messages quickly, but they are opinions about messages, not evidence of behaviour.",
          },
          {
            id: "o2",
            text: "Ratings are exactly as strong as purchase data.",
          },
          {
            id: "o3",
            text: "Ratings are used because purchase data cannot be collected online.",
          },
          {
            id: "o4",
            text: "Ratings remove the need for random assignment.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Think about how many messages had to be compared and what a rating can tell you.",
        misconceptions: {
          o2: "A rating of a message is not a purchase; the authors list the lack of behaviour data as a limitation.",
          o3: "The issue is stage and speed, not impossibility; future work is meant to test behaviour.",
          o4: "Random assignment is still what makes the health-versus-environment comparison fair.",
        },
        explanation:
          "The goal was to find which messages hold the most promise for later tests of behaviour. Ratings are quick for many messages, but the authors state that more research is needed on actual purchasing and consumption.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "How Big Is the Gap?",
        type: "single",
        prompt:
          "Health messages averaged 2.66 and environmental messages 2.26 on a 1-to-5 scale, with p < 0.001. Which description of that result is best?",
        evidence: [
          "Scale: 1 (low) to 5 (high) perceived effectiveness.",
          "Standard deviations: about 1.2 for each message type.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Ratings by message type",
          instruction:
            "Compare the four averages with the middle of the scale, then choose the best description.",
          description:
            "Average rating of perceived effectiveness and average intention to cut red meat, on the same 1-to-5 scale.",
          provenance: {
            kind: "reported",
            refs: ["e5", "e6"],
            note: "Means as printed in the results text.",
          },
          measure: "Average rating, 1 (low) to 5 (high)",
          unit: "points",
          decimals: 2,
          min: 1,
          max: 5,
          values: [
            {
              id: "hpme",
              label: "Health, perceived effectiveness",
              detail: "Average over eight health messages.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Mean as printed in the results text.",
              },
              value: 2.66,
            },
            {
              id: "epme",
              label: "Environmental, perceived effectiveness",
              detail: "Average over ten environmental messages.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Mean as printed in the results text.",
              },
              value: 2.26,
            },
            {
              id: "hint",
              label: "Health, intention to cut red meat",
              detail: "Next seven days.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in the results text.",
              },
              value: 2.45,
            },
            {
              id: "eint",
              label: "Environmental, intention to cut red meat",
              detail: "Next seven days.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in the results text.",
              },
              value: 2.19,
            },
          ],
          difference: {
            from: "epme",
            to: "hpme",
            label: "Health ahead by 0.40 points",
            at: "feedback",
          },
          prediction: null,
          resolution: null,
          responses: [
            {
              optionId: "o1",
              label: "Modest gap, both low",
              targetIds: ["hpme", "epme"],
            },
            {
              optionId: "o2",
              label: "Large gap",
              targetIds: ["hpme", "epme"],
            },
            {
              optionId: "o3",
              label: "Both highly effective",
              targetIds: ["hpme", "epme"],
            },
            {
              optionId: "o4",
              label: "Environmental ahead",
              targetIds: ["epme"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "A reliable but modest gap of about 0.4 points, with both message types rated below the middle of the scale.",
          },
          {
            id: "o2",
            text: "A very large gap, because p is below 0.001.",
          },
          {
            id: "o3",
            text: "Both types were rated as highly effective.",
          },
          {
            id: "o4",
            text: "Environmental messages did better, because their lower average means fewer people were put off.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the gap with the spread, and each average with the middle of the scale.",
        misconceptions: {
          o2: "A small p-value says the gap is unlikely to be chance, not that it is large. 0.4 points is modest next to a spread of about 1.2.",
          o3: "Both averages are below 3, the middle of a 1-to-5 scale.",
          o4: "A lower average means the messages were rated as less effective, not better.",
        },
        explanation:
          "The 0.40-point gap is statistically reliable but small next to a standard deviation of about 1.2, and both averages sit below the scale midpoint of 3. A tiny p-value does not make a gap large.",
        refs: ["e5", "e6"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "Does Wording Matter?",
        type: "single",
        prompt:
          "A campaign designer must pick which specific harm to name. From the ranges of ratings, where does the choice of harm matter more?",
        evidence: [
          "Eight health harms were tested, for example diabetes, several types of cancer and early death.",
          "Ten environmental harms were tested, for example climate change, water pollution and deforestation.",
          "Averages per harm, health: 2.46 to 2.75. Environmental: 2.20 to 2.32.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Among health messages: ratings spread more widely, and one message, diabetes, was rated lower than all the others.",
          },
          {
            id: "o2",
            text: "Among environmental messages: they spread more widely and many differed significantly.",
          },
          {
            id: "o3",
            text: "Equally in both: any harm gives the same rating.",
          },
          {
            id: "o4",
            text: "Neither: ratings of individual harms are meaningless.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the width of the two ranges, and note any message that stood out.",
        misconceptions: {
          o2: "Environmental ratings spanned only 2.20 to 2.32, and only three pairs differed after adjustment.",
          o3: "The ranges differ, and the diabetes message stood out among health harms.",
          o4: "The authors report significant differences among health harms after correcting for multiple comparisons.",
        },
        explanation:
          "Health ratings ranged from 2.46 to 2.75 and the diabetes message was rated lower than every other health message. Environmental ratings spanned only 2.20 to 2.32. The authors conclude that many harms perform similarly, giving policymakers a wide choice.",
        refs: ["e7", "e8", "e9", "e10"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "Those Who Had Already Cut Back",
        type: "single",
        prompt:
          "People who said they had reduced red meat over the past year rated the warnings as more effective (b = 0.57 for health, 0.68 for environmental). What is the best-supported reading?",
        evidence: [
          "Participants reported their change in red meat eating in a questionnaire after rating the messages.",
          "The change they reported covered the past 12 months.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "People already moving away from red meat find the warnings more convincing; the data cannot show whether warnings move people who have not already changed.",
          },
          {
            id: "o2",
            text: "The warnings caused these participants to cut back on red meat.",
          },
          {
            id: "o3",
            text: "The warnings will work best on people who eat the most red meat.",
          },
          {
            id: "o4",
            text: "The finding shows that warnings make no difference to behaviour.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which came first, the change in eating or the rating of the warning?",
        misconceptions: {
          o2: "The cutback they reported came before they saw the warnings in this study, so the warnings cannot have caused it.",
          o3: "Ratings were lower, not higher, in several heavier-eating groups, and the study measured no behaviour.",
          o4: "The study did not measure behaviour at all, so it cannot say that.",
        },
        explanation:
          "The change in eating covered the previous 12 months and was reported after the ratings, so it cannot be an effect of these warnings. The association shows who finds the messages convincing, not who would be moved by them.",
        refs: ["e11", "e12"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "From Study to Policy",
        type: "single",
        prompt:
          "A policy adviser wants to require health warnings on red meat because they scored significantly higher in this study. What is the most defensible position?",
        evidence: [
          "Exploratory study; no power calculation; online convenience sample of 1,199 red meat consumers.",
          "Outcomes: ratings of messages and intention to cut red meat over the next week.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Treat it as a screen for promising wording: it supports testing health warnings on real purchases, not yet requiring them.",
          },
          {
            id: "o2",
            text: "The p-values below 0.001 settle that warnings change what people buy.",
          },
          {
            id: "o3",
            text: "Nothing can be learned because the sample was not random.",
          },
          {
            id: "o4",
            text: "Drop environmental warnings from all future research because they scored lower.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What would a regulator need to see that this study did not measure?",
        misconceptions: {
          o2: "Statistical significance of ratings does not show that behaviour changes; none was measured.",
          o3: "A convenience sample limits generality, but the study still shows which messages look most promising.",
          o4: "The authors point out that environmental messages still offer an opportunity and that more research is needed.",
        },
        explanation:
          "The authors call the study exploratory, list the missing power calculation, the convenience sample and the absence of behaviour measures, and say future studies should measure behavioural impact. It narrows down what to test next.",
        refs: ["e13", "e14", "e15", "e16"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In an online experiment with 1,199 US red meat consumers, health warnings were rated modestly more effective than environmental ones, and ratings varied more among health harms than environmental ones. With no no-warning group, no behaviour measures and a convenience sample, the study identifies messages worth testing and nothing more.",
};
