// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/shevlin-2022-debt-mental-health.pdf
// Revised 27 October 2026: answers were copied from the evidence lines, and one evidence line cited another study's odds ratios as this study's; now decisions about caseness, a small group, adjustment, causation and transfer.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-managing-personal-debt",
    title: "Study Design",
    briefing:
      "Decide what a questionnaire cut-off can show about debt and mental health, and how far one national survey can go.",
    source: "generated",
    paper: {
      title:
        "Perceived manageability of debt and mental health during the COVID-19 pandemic: A UK population analysis",
      authors: "Shevlin, Redican, Hyland et al. (2022)",
      journal: "PLOS ONE 17(9): e0274052",
      url: "https://doi.org/10.1371/journal.pone.0274052",
      limitations: [
        "The data are cross-sectional, so it cannot be said whether debt worries came before mental health difficulties or the reverse.",
        "Depression and anxiety were defined by questionnaire cut-offs, not clinical diagnoses.",
        "Very few people reported debt they could not manage at all, so estimates for that group are imprecise.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 5,
        excerpt:
          "Possible scores range from 0–27 with higher scores reflecting higher symp- tomatology.",
      },
      {
        id: "e2",
        page: 5,
        excerpt:
          "This cut-off score has been shown to have adequate sensitiv- ity (.85) and specificity (.89)",
      },
      {
        id: "e3",
        page: 7,
        excerpt:
          "My debt is easily manageable 840 (40.8%) 123 (14.6%) 1.26 (.93–1.68) 1.13 (.82–1.54)",
      },
      {
        id: "e4",
        page: 7,
        excerpt:
          "I have some problems managing my debt 335 (16.3%) 114 (34.0%) 3.78 (2.74–5.19) 2.28 (1.62–3.20)",
      },
      {
        id: "e5",
        page: 7,
        excerpt:
          "I have quite serious problems managing my debt 90 (4.4%) 52 (57.8%) 10.02 (6.23–16.10) 5.18 (3.11–8.61)",
      },
      {
        id: "e6",
        page: 7,
        excerpt:
          "I have very serious problems managing my debt 54 (2.6%) 41 (75.9%) 23.09 (11.90–44.80) 11.18 (5.55–22.51)",
      },
      {
        id: "e7",
        page: 7,
        excerpt:
          "I cannot manage my debt at all 15 (.7%) 8 (53.3%) 8.37 (2.96–23.64) 5.23 (1.70–16.08)",
      },
      {
        id: "e8",
        page: 8,
        excerpt:
          "This may be attributable to the fewer number of participants in this group reducing power to detect any present effects.",
      },
      {
        id: "e9",
        page: 7,
        excerpt: "146 (43.6%) 4.45 (3.30–6.00) 2.80 (2.03–3.86)",
      },
      {
        id: "e10",
        page: 7,
        excerpt: "61 (67.8%) 12.13 (7.45–19.74) 6.56 (3.89–11.05)",
      },
      {
        id: "e11",
        page: 7,
        excerpt:
          "Note: aOR = adjusted odds ratio, adjusted for age (years), gender, education, 2019 household income band, receipt of benefits.",
      },
      {
        id: "e12",
        page: 8,
        excerpt:
          "This is important given that dose-response is widely accepted as a factor to consider when judging whether an effect is causal [27].",
      },
      {
        id: "e13",
        page: 9,
        excerpt:
          "the data utilized in the current study was cross-sectional and thus, inferences regarding causality are prohibited. Thus, it is not possible to ascertain whether concerns regarding debt manageability preceded mental health difficulties and mental health help seek- ing or vice versa.",
      },
      {
        id: "e14",
        page: 8,
        excerpt:
          "This is especially relevant given that in the UK, the National Health Service (NHS) provides free access to general practitioners, medical pre- scriptions, and talking therapies, and thus mental health services may be more accessible for individuals affected by debt problems.",
      },
      {
        id: "e15",
        page: 8,
        excerpt:
          "However, in other countries, such services must be paid for privately.",
      },
    ],
    challenges: [
      {
        id: "c1d",
        stage: "design",
        title: "What Counts as a Case?",
        type: "single",
        prompt:
          "Depression was counted when someone scored 10 or more on a nine-question symptom checklist. What does being a “case” mean here?",
        evidence: [
          "Checklist scores range from 0 to 27; 10 or more counted as a likely case.",
          "Anxiety was handled the same way with a seven-question checklist.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "A screening score above a cut-off that usually, but not always, matches a clinical diagnosis; it is not a diagnosis itself.",
          },
          {
            id: "o2",
            text: "A diagnosis made by a doctor.",
          },
          {
            id: "o3",
            text: "Someone currently receiving treatment.",
          },
          {
            id: "o4",
            text: "A guaranteed case of depression, since the cut-off is validated.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who decided whether each person was a case, and how?",
        misconceptions: {
          o2: "No clinician assessed participants; the score comes from a self-completed checklist.",
          o3: "Treatment was a separate question about help-seeking.",
          o4: "The cut-off has good but imperfect accuracy, so some cases are missed and some are false alarms.",
        },
        explanation:
          "Caseness came from questionnaire cut-offs with adequate but imperfect sensitivity (.85) and specificity (.89). It identifies likely cases, not diagnoses.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2r",
        stage: "results",
        title: "A Dip at the Top",
        type: "single",
        prompt:
          "The adjusted odds of anxiety rose with more serious debt problems, then dipped for people who “cannot manage at all”. How should that dip be read?",
        evidence: [
          "Adjusted odds ratios for anxiety compared with having no debt, with 95% intervals.",
          "Only 15 people were in the “cannot manage at all” group.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Odds of anxiety by debt problems",
          instruction:
            "Compare the intervals across levels, paying attention to how wide the last one is.",
          description:
            "Adjusted odds ratios for anxiety compared with having no debt, with 95% confidence intervals.",
          provenance: {
            kind: "reported",
            refs: ["e3", "e4", "e5", "e6", "e7"],
            note: "Adjusted odds ratios and intervals as printed in Table 2.",
          },
          measure: "Adjusted odds ratio",
          min: 0,
          max: 24,
          reference: {
            value: 1,
            label: "Same odds as no debt",
          },
          band: null,
          estimates: [
            {
              id: "easy",
              label: "Easily manageable",
              detail: "840 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e3"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 1.13,
              lower: 0.82,
              upper: 1.54,
            },
            {
              id: "some",
              label: "Some problems",
              detail: "335 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 2.28,
              lower: 1.62,
              upper: 3.2,
            },
            {
              id: "quite",
              label: "Quite serious problems",
              detail: "90 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 5.18,
              lower: 3.11,
              upper: 8.61,
            },
            {
              id: "very",
              label: "Very serious problems",
              detail: "54 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 11.18,
              lower: 5.55,
              upper: 22.51,
            },
            {
              id: "cannot",
              label: "Cannot manage at all",
              detail: "15 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e7"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 5.23,
              lower: 1.7,
              upper: 16.08,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "A wide interval from a small group",
            detail:
              "The last group's interval runs from 1.70 to 16.08 and overlaps its neighbours, so the dip may be chance.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e7", "e8"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "Small group, wide interval",
              targetIds: ["cannot", "very"],
            },
            {
              optionId: "o2",
              label: "Debt stops mattering",
              targetIds: ["cannot"],
            },
            {
              optionId: "o3",
              label: "Pattern is fake",
              targetIds: ["easy", "some", "quite", "very"],
            },
            {
              optionId: "o4",
              label: "Easy debt harms",
              targetIds: ["easy"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "With only 15 people, the interval is very wide and overlaps the neighbouring groups, so the dip may be chance rather than a real reversal.",
          },
          {
            id: "o2",
            text: "Once debt is completely unmanageable, it stops affecting anxiety.",
          },
          {
            id: "o3",
            text: "The dip shows the whole rising pattern is not real.",
          },
          {
            id: "o4",
            text: "Easily manageable debt also raises anxiety clearly.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many people stand behind the last estimate, and how wide is its interval?",
        misconceptions: {
          o2: "One small group with a wide interval cannot show that; anxiety odds were still above those with no debt.",
          o3: "The rise across the first four levels has fairly narrow intervals; one imprecise group does not erase it.",
          o4: "Its interval (0.82 to 1.54) includes 1, so no clear difference from having no debt.",
        },
        explanation:
          "The authors suggest the lower odds in this group may be due to the small number of participants reducing power. They also offer other possibilities, such as depression being more common in this group.",
        refs: ["e3", "e4", "e5", "e6", "e7", "e8"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c3r",
        stage: "results",
        title: "After Adjustment",
        type: "single",
        prompt:
          "For depression, the odds for “some problems” fell from 4.45 to 2.80 after adjustment, and for “quite serious problems” from 12.13 to 6.56. What does that suggest?",
        evidence: [
          "Adjusted for age, gender, education, household income band and receipt of benefits.",
          "Both adjusted intervals stay well above 1.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Part of the raw link reflects those background factors, such as income, but a sizeable link remains after taking them into account.",
          },
          {
            id: "o2",
            text: "The background factors explain the whole link.",
          },
          {
            id: "o3",
            text: "Adjustment made the link stronger.",
          },
          {
            id: "o4",
            text: "Adjustment proves debt causes depression.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the size before and after adjustment, and check where the adjusted values sit relative to 1.",
        misconceptions: {
          o2: "The adjusted odds ratios are still well above 1, so a link remains.",
          o3: "The odds ratios got smaller after adjustment.",
          o4: "Adjustment removes the influence of measured factors only; it cannot establish cause.",
        },
        explanation:
          "Adjusting roughly halved the odds ratios, showing some of the raw link ran through background factors like income and benefits. The remaining odds ratios of 2.80 and 6.56 still indicate a strong association.",
        refs: ["e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4i",
        stage: "interpretation",
        title: "A Graded Pattern",
        type: "single",
        prompt:
          "The more serious the debt problems, the higher the odds of depression and anxiety. The authors note that such a graded pattern is used when judging cause. What is the best-supported reading?",
        evidence: [
          "Each person was surveyed once, in August or September 2021.",
          "Debt problems and mental health were reported in the same survey.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The graded pattern fits a causal role for debt, but with one survey the reverse is also possible: poor mental health could make debt harder to manage.",
          },
          {
            id: "o2",
            text: "The graded pattern proves debt problems cause depression.",
          },
          {
            id: "o3",
            text: "There is no relationship between debt and mental health.",
          },
          {
            id: "o4",
            text: "The pattern proves poor mental health causes debt problems.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "With one survey, can you tell which came first?",
        misconceptions: {
          o2: "A graded pattern is one consideration in judging cause; it does not prove it, especially from a single survey.",
          o3: "Strong associations were found at every level of debt problems.",
          o4: "The data cannot establish direction either way.",
        },
        explanation:
          "The authors call the graded pattern important for judging cause, but state that because the data are cross-sectional it is not possible to say whether debt concerns came before mental health difficulties or the other way round.",
        refs: ["e12", "e13"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c5i",
        stage: "interpretation",
        title: "Would It Hold Elsewhere?",
        type: "single",
        prompt:
          "People with debt problems were more likely to be receiving mental health treatment in this UK sample. Would you expect the same in a country where treatment must be paid for?",
        evidence: [
          "In the UK, GP visits, prescriptions and talking therapies are free through the NHS.",
          "The help-seeking measure asked whether people were currently receiving treatment.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Not necessarily: where treatment costs money, people with debt problems may be less able to get help, so the help-seeking link could be weaker or reversed.",
          },
          {
            id: "o2",
            text: "Yes, exactly the same, because debt affects everyone equally.",
          },
          {
            id: "o3",
            text: "No link at all would appear anywhere else.",
          },
          {
            id: "o4",
            text: "The help-seeking result is wrong because it was self-reported.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What made treatment easier to get for these participants?",
        misconceptions: {
          o2: "Access to care differs between countries, which can change who receives treatment.",
          o3: "The study cannot predict that; it can only say the UK result may not transfer.",
          o4: "Self-report is a limitation, but the question here is about transfer to other health systems.",
        },
        explanation:
          "The authors point out that free NHS access may make treatment more accessible for people in debt, whereas in other countries services must be paid for privately, making help-seeking less likely for those with financial problems.",
        refs: ["e14", "e15"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In a UK survey of 2,058 adults in 2021, problems managing debt were linked to higher odds of likely depression, anxiety and current mental health treatment, in a graded pattern that remained after adjusting for income and benefits. The survey was cross-sectional, so the direction is unknown, and estimates for the smallest group are imprecise.",
};
