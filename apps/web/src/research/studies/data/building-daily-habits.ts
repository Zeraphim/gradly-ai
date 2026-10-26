// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/vanderweiden-2020-self-control-habit-formation.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about measurement frequency, earlier levels, advice, curve shape, self-control and reach.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-building-daily-habits",
    title: "Designing and Interpreting a Longitudinal Habit‑Formation Study",
    briefing:
      "Decide how to track a new habit forming over three months, and what a smartphone study of volunteers can say about self-control.",
    source: "generated",
    paper: {
      title:
        "How to Form Good Habits? A Longitudinal Field Study on the Role of Self-Control in Habit Formation",
      authors: "van der Weiden, Benjamins & Gillebaart et al. (2020)",
      journal: "Frontiers in Psychology 11: 560",
      url: "https://doi.org/10.3389/fpsyg.2020.00560",
      limitations: [
        "Habit strength was measured only every two weeks, too rarely to fit a curve for most individuals.",
        "Participants were volunteers who chose a personally relevant habit and logged it daily, which may itself have helped.",
        "Self-control was measured as a trait, not in the moments when temptations arose.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 3,
        excerpt:
          "However, the individual patterns fluctuated too much (possibly because bi-weekly measurements were too infrequent; M = 5.73, SD = 1.99, range = 2–9 observations per participant;",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "curve fitting could only be achieved for 4.11% of our participants",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "FIGURE 2 | Number of observations for habit strength (total N = 836) plotted against the number of participants (N = 146).",
      },
      {
        id: "e4",
        page: 5,
        excerpt:
          "In Model 2, lagged habit strength (i.e., habit strength at the previous measurement) was entered to analyze habit formation.",
      },
      {
        id: "e5",
        page: 5,
        excerpt:
          "As can be seen in Model 2, habit strength is rather stable and strongly predicted by lagged habit strength at the previous measurement of habit.",
      },
      {
        id: "e6",
        page: 6,
        excerpt:
          "Lagged habit strength 0.87*** 0.85*** Lagged self-control 0.01",
      },
      {
        id: "e7",
        page: 6,
        excerpt: "Proportion behavior carried out 0.47***",
      },
      {
        id: "e8",
        page: 6,
        excerpt:
          "Contrary to our expectations and previous findings by Galla and Duckworth (2015), however, we did not find support for self-control capacity as a predictor of the habit formation process.",
      },
      {
        id: "e9",
        page: 5,
        excerpt:
          "Figure 3 shows a significant increase of about 0.8 SD (a large effect size according to Cohen, 1992) in habit strength over a period of 110 days with a stronger increase in beginning of the study period, leveling off at the end.",
      },
      {
        id: "e10",
        page: 5,
        excerpt:
          "Both the linear trend (t = 15.30, p < 0.001) and the quadratic trend (t = −3.39, p < 0.001) were significant.",
      },
      {
        id: "e11",
        page: 6,
        excerpt:
          "Yet another reason for not finding an effect of self-control on the habit formation process may be that we focused on trait rather than state self-control.",
      },
      {
        id: "e12",
        page: 6,
        excerpt:
          "Another reason why self-control may not have affected habit formation, is because our instructions to participants may have created an association between the specific, self-chosen behavior and a specific context.",
      },
      {
        id: "e13",
        page: 2,
        excerpt:
          "In total, 146 participants (118 women; Mage = 31.9; SDage = 12.7; range 18–61 years) who completed at least one follow-up assessment of habit strength were included in the analyses.",
      },
      {
        id: "e14",
        page: 3,
        excerpt:
          "It was emphasized that the selected behavior needed to be personally relevant to them, had to be a behavior they did not regularly perform yet, and had to be feasible for them to perform on a daily basis.",
      },
      {
        id: "e15",
        page: 6,
        excerpt:
          "In the current study monitoring was facilitated by specifying a specific context for goal pursuit and registering their behavior daily via the smartphone application, which may have facilitated goal-congruent behavior performance, and hence, habit formation.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Enough Points for a Curve?",
        type: "single",
        prompt:
          "The team wanted to draw each person's own habit curve, which should rise steeply and then level off. What would that have needed that this design lacked?",
        evidence: [
          "Habit strength was asked every two weeks over about three months.",
          "The behaviour itself was logged every day in an app.",
        ],
        scene: {
          version: 1,
          kind: "units",
          title: "People and habit measurements",
          instruction:
            "Compare how many people took part with how many habit measurements were collected.",
          description:
            "Participants analysed and the habit-strength measurements collected from them.",
          provenance: {
            kind: "reported",
            refs: ["e3"],
            note: "Counts from the figure caption.",
          },
          levels: [
            {
              id: "people",
              label: "Participants analysed",
              detail: "Completed at least one follow-up habit assessment.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e3"],
                note: "Count as printed in the paper.",
              },
              count: 146,
              unit: "participants",
              role: "analysed",
            },
            {
              id: "obs",
              label: "Habit-strength measurements",
              detail: "Collected every two weeks.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e3"],
                note: "Count as printed in the paper.",
              },
              count: 836,
              unit: "measurements",
              role: "measured",
            },
          ],
          resolution: {
            id: "resolution",
            label: "About six points per person",
            detail:
              "836 measurements across 146 people is under six each, too few to fit a rise-then-level curve for most individuals.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e1", "e3"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "More habit measurements each",
              targetIds: ["obs"],
            },
            {
              optionId: "o2",
              label: "More participants",
              targetIds: ["people"],
            },
            {
              optionId: "o3",
              label: "Fewer behaviours",
              targetIds: [],
            },
            {
              optionId: "o4",
              label: "A different questionnaire",
              targetIds: ["obs"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "More frequent measurements per person, to trace the rise and flattening of each curve.",
          },
          {
            id: "o2",
            text: "More people at the existing time points, to fit individual curves.",
          },
          {
            id: "o3",
            text: "One common habit for everyone, to supply the missing observations along each person's curve.",
          },
          {
            id: "o4",
            text: "A shorter habit-strength scale, to recover each person's curve from the same few observations.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many points do you need to see a curve rise and then flatten?",
        misconceptions: {
          o2: "More people do not add observations within an individual.",
          o3: "Standardising the habit does not add time points.",
          o4: "A shorter questionnaire does not supply the missing measurements.",
        },
        explanation:
          "Each person gave 2 to 9 habit measurements, and individual patterns fluctuated too much; a curve could be fitted for only 4.11% of participants. The authors suspect the two-week spacing was too infrequent, so they analysed the group instead.",
        refs: ["e1", "e2", "e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Earlier Habit Strength",
        type: "single",
        prompt:
          "To find what helps habits grow, the model included each person's habit strength at the previous measurement. Why include it?",
        evidence: [
          "Habit strength was measured repeatedly in the same people.",
          "Other predictors: self-control, and how often the behaviour was carried out.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "To treat the earlier score as the outcome and later scores as explanations of that outcome.",
          },
          {
            id: "o3",
            text: "To remove all self-control differences before modelling habit growth.",
          },
          {
            id: "o1",
            text: "To ask whether predictors explain change beyond each person's earlier habit strength.",
          },
          {
            id: "o4",
            text: "To combine repeated scores into a single measure with no information about their order.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If someone already had a strong habit two weeks ago, what would you expect now?",
        misconceptions: {
          o2: "The model predicts the later score, adjusting for the earlier one.",
          o3: "Adjusting earlier habit strength does not remove every self-control difference.",
          o4: "The lagged predictor preserves temporal order rather than averaging it away.",
        },
        explanation:
          "Habit strength was rather stable and strongly predicted by its previous value, so entering it means the other predictors are judged on what they add to that change.",
        refs: ["e4", "e5"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Advice for a Coach",
        type: "single",
        prompt:
          "A coach wants to help clients build habits. Which advice is best supported by the results?",
        evidence: [
          "Proportion of days the behaviour was carried out: coefficient 0.47, p < .001.",
          "Self-control at the previous measurement: coefficient 0.01, not significant.",
          "Both models also include earlier habit strength.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Select clients with high self-control, since it best predicted habit growth.",
          },
          {
            id: "o1",
            text: "Support consistent practice; it tracked habit gains while trait self-control did not.",
          },
          {
            id: "o3",
            text: "Promise 47% stronger habits with daily practice, treating the coefficient as a percentage gain.",
          },
          {
            id: "o4",
            text: "Train self-control first, since stronger trait scores explained later habit growth.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which predictor added something after earlier habit strength was taken into account?",
        misconceptions: {
          o2: "Trait self-control did not predict growth here.",
          o3: "A model coefficient cannot be read as that percentage increase.",
          o4: "The analysis does not establish that sequence or mechanism.",
        },
        explanation:
          "Participants who carried out the chosen behaviour more consistently showed stronger increases in habit strength, while lagged self-control did not predict habit strength. Consistency is associated with growth; this is not an experiment on coaching.",
        refs: ["e6", "e7", "e8"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Reading the Shape",
        type: "single",
        prompt:
          "Over the study, the time trend had a significant positive linear term and a significant negative quadratic term. What shape does that describe?",
        evidence: [
          "Linear time trend: t = 15.30, p < 0.001.",
          "Quadratic time trend: t = −3.39, p < 0.001.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Habit strength increases by a constant amount at each time point.",
          },
          {
            id: "o3",
            text: "Habit strength rises, with larger gains at later measurements than at the start.",
          },
          {
            id: "o4",
            text: "Habit strength declines, with the largest drops occurring near the end of the study.",
          },
          {
            id: "o1",
            text: "Habit strength rises, with the rate of increase slowing over the study.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "A negative squared term bends a rising line downward.",
        misconceptions: {
          o2: "A negative quadratic term describes curvature, not constant growth.",
          o3: "The negative quadratic term indicates deceleration rather than acceleration.",
          o4: "The positive linear term describes an initial rise, not a decline.",
        },
        explanation:
          "Habit strength increased by about 0.8 SD over 110 days, with a stronger increase at the start and levelling off at the end, which is what a positive linear and a negative quadratic term describe.",
        refs: ["e9", "e10"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Is Self-Control Irrelevant?",
        type: "single",
        prompt:
          "Self-control did not predict habit growth. Does that show self-control plays no part in forming habits?",
        evidence: [
          "Self-control was measured with a general questionnaire every two weeks.",
          "Each participant chose a specific context for their behaviour, such as eating fruit at breakfast.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Yes; the null estimate rules out an important role for self-control in other habit settings.",
          },
          {
            id: "o3",
            text: "No; a strong self-control effect was hidden only because the model omitted earlier habit strength.",
          },
          {
            id: "o4",
            text: "Yes; improvement in habit strength shows that participants did not use self-control to practise.",
          },
          {
            id: "o1",
            text: "No; a trait measure in a chosen context leaves other roles for self-control open.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What kind of self-control was measured, and when might it matter most?",
        misconceptions: {
          o2: "This setting and measure do not test every role of self-control.",
          o3: "The model included earlier habit strength and found no growth prediction by self-control.",
          o4: "Growth without a trait association does not show absence of momentary self-control.",
        },
        explanation:
          "The authors suggest self-control may not have mattered because they measured trait rather than state self-control, and because tying the behaviour to a specific context may have made it easier. They do not conclude self-control is irrelevant.",
        refs: ["e11", "e12"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Habits for Every Employee?",
        type: "single",
        prompt:
          "A company wants to tell all staff that a new habit forms in about three months, based on this study. What is the best caution?",
        evidence: [
          "Participants were volunteers; each chose a behaviour that mattered to them and was feasible daily.",
          "They logged the behaviour in an app every day.",
          "146 people analysed, 118 of them women.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Motivated volunteers choosing and logging habits may differ from staff assigned one.",
          },
          {
            id: "o2",
            text: "The average increase supplies a reliable deadline for forming any habit in the workplace.",
          },
          {
            id: "o3",
            text: "The follow-up duration identifies the minimum time any employee needs to develop a habit.",
          },
          {
            id: "o4",
            text: "The voluntary sample limits transfer mainly to men, since all participants were women.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who took part, how did they choose their habit, and what did they do every day?",
        misconceptions: {
          o2: "An average trend in volunteers does not establish an individual deadline.",
          o3: "Study duration is not a lower bound on formation time.",
          o4: "The sample was not women only, and motivation and self-selection also matter.",
        },
        explanation:
          "Participants chose a personally relevant, feasible behaviour and registered it daily in the app; the authors note that this monitoring may have helped behaviour and hence habit formation. Assigned habits in less committed people were not tested.",
        refs: ["e13", "e14", "e15"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In 146 volunteers tracked by app for about three months, habit strength rose quickly at first and then levelled off, and growth was linked to carrying out the behaviour consistently, not to trait self-control. Measurements were too sparse to trace individuals, and the motivated, self-monitoring sample limits how far this applies.",
};
