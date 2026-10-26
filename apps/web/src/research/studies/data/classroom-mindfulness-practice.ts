// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/janz-2019-mindfulness-calmspace.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about randomising classes, waitlist timing, score trends, what the effect sizes compare and bias.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-classroom-mindfulness-practice",
    title: "Investigating the CalmSpace Mindfulness Program",
    briefing:
      "Teachers ran a daily mindfulness programme in some early-years classes while others waited a term. Decide how classes were compared, read how a card-sorting score changed, and judge which results could be biased.",
    source: "generated",
    paper: {
      title:
        "Mindfulness-Based Program Embedded Within the Existing Curriculum Improves Executive Functioning and Behavior in Young Children: A Waitlist Controlled Trial",
      authors: "Janz, Dawe & Wyllie (2019)",
      journal: "Frontiers in Psychology 10: 2052",
      url: "https://doi.org/10.3389/fpsyg.2019.02052",
      limitations: [
        "Only five classes in one school were randomised, and the groups differed in gender.",
        "The waitlist group started the programme in Term 4, so only the Term 3 comparison is against no programme.",
        "Teachers knew which children had the programme and rated their behaviour, and the person who tested the children also supported the teachers.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 4,
        excerpt:
          "Classes within the participant primary school were randomly allocated via a hat draw to participate in CalmSpace in both",
      },
      {
        id: "e2",
        page: 4,
        excerpt:
          "Classes randomly allocated to CalmSpace Terms 3 and 4 consisted of a single preparatory class of 18 children; a Grade 1 class of 24 children and a composite Grades 1 and 2 class of 26 children. Classes randomly allocated to the waitlist control group consisted of a single preparatory class of 17 children and a Grade 2 class of 28,",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "∗Significant gender differences at baseline, t(89) = 2.737, p = 0.007.",
      },
      {
        id: "e4",
        page: 1,
        excerpt:
          "Thirty-six students in the waitlist control condition, Mage = 80.53 months, SD = 13.04, participated in the intervention in Term 4.",
      },
      {
        id: "e5",
        page: 1,
        excerpt:
          "The start of Term 3 served as baseline (Time 1), and measures were obtained at the end of Term 3 (Time 2) and the end of Term 4 (Time 3).",
      },
      {
        id: "e6",
        page: 9,
        excerpt:
          "DCCS DCCS score Intervention 95.49 (13.28) 103.76 (10.41) 108.79 (10.08) 4.34∗ (0.05) −6.84∗∗ (0.71) −4.03∗∗ (0.48) −7.60∗∗ (1.10) Waitlist 98.61 (16.29) 99.44 (11.93) 107.58 (10.39) −0.41 (0.06) −5.69∗∗ (0.73) −3.82∗∗ (0.66)",
      },
      {
        id: "e7",
        page: 8,
        excerpt:
          "Simple effects of the significant interaction of DCCS Score revealed that the intervention group (M = 103.76; SD = 10.41) scored significantly higher at Post1 than the waitlist group (M = 99.44; SD = 11.93) at Post1, F(1,83) = 8.94, p = 0.004.",
      },
      {
        id: "e8",
        page: 1,
        excerpt:
          "Children who received the CalmSpace program showed improvements on the DCCS relative to waitlist control at Time 2 (Cohen’s d = 0.48) and Time 3 (Cohen’s d = 1.10).",
      },
      {
        id: "e9",
        page: 15,
        excerpt:
          "As with any waitlist-controlled trial only short-term benefits can be ascertained. Longer term studies are required to ensure that the gains found in this study were not simply a slight escalation in a normal developmental process.",
      },
      {
        id: "e10",
        page: 14,
        excerpt:
          "The researcher who collected the data (PJ) was also directly involved with supporting the teachers to implement CalmSpace.",
      },
      {
        id: "e11",
        page: 15,
        excerpt:
          "As teachers were the primary deliverers of CalmSpace it was also not possible for them to be unaware of the group to which children were allocated.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Drawing Classes From a Hat",
        type: "single",
        prompt:
          "Whole classes, not individual children, were drawn from a hat to start the programme first or wait. What does that mean for how comparable the two groups are?",
        evidence: [
          "Five classes in one school: three started in Term 3, two waited until Term 4.",
          "91 children took part.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Random assignment balances gender and grade closely enough to remove the need for adjustment.",
          },
          {
            id: "o1",
            text: "Random assignment helps, but five classes can still differ substantially by chance.",
          },
          {
            id: "o3",
            text: "Each child was independently assigned, balancing class differences.",
          },
          {
            id: "o4",
            text: "The teachers' preferences determined which classes started, making this a self-selected comparison.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many separate units were actually drawn?",
        misconceptions: {
          o2: "With only five classes, baseline imbalance can remain substantial.",
          o3: "Whole classes, not individual children, were assigned.",
          o4: "Classes were drawn from a hat rather than chosen by preference.",
        },
        explanation:
          "Classes were randomly allocated by a hat draw. With five classes, the groups ended up differing in gender (38% against 67% girls), so the analyses adjusted for gender and grade.",
        refs: ["e1", "e2", "e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "When the Waitlist Starts",
        type: "single",
        prompt:
          "Scores were taken at the start of Term 3, the end of Term 3 and the end of Term 4. The waitlist classes began the programme in Term 4. Which time point gives the clean comparison with no programme?",
        evidence: [
          "Programme group: mindfulness activities throughout Terms 3 and 4.",
          "Waitlist group: no programme in Term 3, programme in Term 4.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "End of Term 4: the later follow-up retains an untreated waitlist.",
          },
          {
            id: "o3",
            text: "Start of Term 3: the baseline scores already compare programme effects with an untreated group.",
          },
          {
            id: "o1",
            text: "End of Term 3: one group had the programme and the waitlist had not started.",
          },
          {
            id: "o4",
            text: "Either term end: random assignment preserves an untreated group even after it starts the programme.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "At each time point, what had each group received?",
        misconceptions: {
          o2: "The waitlist received the programme in Term 4.",
          o3: "Neither group had yet received the programme at baseline.",
          o4: "Randomisation does not preserve an untreated comparison after crossover.",
        },
        explanation:
          "The waitlist group joined the programme in Term 4, so the comparison of programme against no programme is only clean at the end of Term 3. Later differences compare two terms of programme with one.",
        refs: ["e4", "e5"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Card-Sort Scores Over Time",
        type: "single",
        prompt:
          "Here are the card-sorting scores, a measure of flexible thinking, for both groups. Which reading fits?",
        evidence: [
          "Scores at baseline, end of Term 3 and end of Term 4.",
          "Group × time interaction: F(1,83) = 4.34, p = .040.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Card-sorting (DCCS) scores",
          instruction:
            "Follow each group across the three time points, then compare them at the end of Term 3.",
          description: "Mean DCCS scores by group and time point.",
          provenance: {
            kind: "reported",
            refs: ["e6"],
            note: "Means as printed in Table 4.",
          },
          measure: "DCCS score",
          unit: "points",
          decimals: 2,
          min: 80,
          max: 115,
          values: [
            {
              id: "i1",
              label: "Programme, baseline",
              detail: "Start of Term 3.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in Table 4.",
              },
              value: 95.49,
            },
            {
              id: "i2",
              label: "Programme, end of Term 3",
              detail: "One term of programme.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in Table 4.",
              },
              value: 103.76,
            },
            {
              id: "i3",
              label: "Programme, end of Term 4",
              detail: "Two terms of programme.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in Table 4.",
              },
              value: 108.79,
            },
            {
              id: "w1",
              label: "Waitlist, baseline",
              detail: "Start of Term 3.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in Table 4.",
              },
              value: 98.61,
            },
            {
              id: "w2",
              label: "Waitlist, end of Term 3",
              detail: "No programme yet.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in Table 4.",
              },
              value: 99.44,
            },
            {
              id: "w3",
              label: "Waitlist, end of Term 4",
              detail: "One term of programme.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in Table 4.",
              },
              value: 107.58,
            },
          ],
          difference: {
            from: "w2",
            to: "i2",
            label: "End of Term 3: programme ahead by about 4 points",
            at: "feedback",
          },
          prediction: null,
          resolution: null,
          responses: [
            {
              optionId: "o2",
              label: "Waitlist never improved",
              targetIds: ["w3"],
            },
            {
              optionId: "o3",
              label: "Programme lower",
              targetIds: ["i2", "w2"],
            },
            {
              optionId: "o4",
              label: "Same throughout",
              targetIds: ["i1", "w1"],
            },
            {
              optionId: "o1",
              label: "Programme ahead in Term 3; both rise later",
              targetIds: ["i2", "w2", "i3", "w3"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o2",
            text: "The programme group improved in both terms, while the waitlist scores stayed near baseline throughout.",
          },
          {
            id: "o3",
            text: "The waitlist group led at the end of Term 3, before the programme group caught up in Term 4.",
          },
          {
            id: "o4",
            text: "The groups improved together in Term 3, then separated only when the waitlist started treatment.",
          },
          {
            id: "o1",
            text: "In Term 3 the programme group rose while the waitlist barely moved; once the waitlist had the programme, both groups rose.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the two groups' change during Term 3 only.",
        misconceptions: {
          o2: "The waitlist improved after gaining access in Term 4.",
          o3: "The displayed trajectory does not show that reversal.",
          o4: "The observed separation occurred before the waitlist began the programme.",
        },
        explanation:
          "During Term 3 the programme group rose from 95.49 to 103.76 while the waitlist moved from 98.61 to 99.44, and the programme group was significantly higher at the end of Term 3. After the waitlist started, both groups rose.",
        refs: ["e6", "e7"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "What the Effect Sizes Describe",
        type: "single",
        prompt:
          "The abstract reports card-sorting improvements “relative to waitlist control” of d = 0.48 and d = 1.10. In the results table, those two values sit in the programme group's own rows. How should d = 1.10 be read?",
        evidence: [
          "Programme group, within-group changes: baseline to end of Term 3, d 0.71; Term 3 to Term 4, d 0.48; baseline to end of Term 4, d 1.10.",
          "Waitlist group, within-group changes: baseline to end of Term 3, d 0.06; baseline to end of Term 4, d 0.66.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "As the programme group's own improvement over two terms, not its advantage over the waitlist, which also improved as the children grew.",
          },
          {
            id: "o2",
            text: "The programme group's final advantage over the waitlist, after accounting for both groups' growth.",
          },
          {
            id: "o3",
            text: "A small difference between groups, since an effect must exceed 2 to be considered substantial.",
          },
          {
            id: "o4",
            text: "The waitlist group's two-term change, which the abstract attributes to receiving the programme later.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which two scores does each d compare: two groups, or one group at two times?",
        misconceptions: {
          o2: "The table labels this as within-group change, not the between-group advantage.",
          o3: "The value is not a between-group effect and 2 is not a threshold for meaningful size.",
          o4: "The value occurs in the programme group's rows.",
        },
        explanation:
          "In the table, 0.48 and 1.10 are within-group changes for the programme group. The waitlist group also improved (d 0.66 from baseline to the end of Term 4). The authors note that only short-term benefits can be judged and that gains may partly be normal development.",
        refs: ["e6", "e8", "e9"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Where Bias Could Enter",
        type: "single",
        prompt:
          "Teachers ran the programme and also rated children's behaviour, and the researcher who tested the children also supported the teachers. Which results are most open to bias?",
        evidence: [
          "Behaviour was rated by teachers on a questionnaire.",
          "Card sorting and attention were measured with computer tasks given by the researcher.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Computer tasks are most exposed because software receives the same expectations as teachers do.",
          },
          {
            id: "o1",
            text: "Teacher ratings are most exposed to expectations; the tester also knew the groups.",
          },
          {
            id: "o3",
            text: "Neither outcome is exposed to expectations because class randomisation also blinds the assessors.",
          },
          {
            id: "o4",
            text: "Both outcomes have identical exposure because using a score makes all judgements equally subjective.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who knew which children had the programme, and who produced each score?",
        misconceptions: {
          o2: "Standardised tasks are less directly affected by teachers' subjective judgements.",
          o3: "Randomisation does not blind teachers or the researcher.",
          o4: "Teacher ratings and standardised computer tasks have different bias pathways.",
        },
        explanation:
          "Teachers could not be unaware of the groups and were keen on the programme, which raises concerns about their behaviour ratings. The researcher who collected the data also supported the teachers, so some bias in testing cannot be ruled out.",
        refs: ["e10", "e11"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In one school, children in three classes that started a teacher-led mindfulness programme improved more on a card-sorting task during the first term than two classes still waiting. Once the waitlist started, both groups improved. With five classes, unblinded teacher ratings and possible normal development, the evidence is preliminary.",
};
