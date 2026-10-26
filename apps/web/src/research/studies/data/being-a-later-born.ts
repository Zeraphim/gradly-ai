// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/stannard-2019-birth-order-wellbeing.pdf
// Revised 26 October 2026: answers were copied from table rows; now decisions about design, intervals, attrition and era.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-being-a-later-born",
    title: "Study design",
    briefing:
      "Decide how to test whether birth order shapes midlife wellbeing, and what a missing half of the cohort means.",
    source: "generated",
    paper: {
      title:
        "Associations between birth order with mental wellbeing and psychological distress in midlife: Findings from the 1970 British Cohort Study (BCS70)",
      authors: "Stannard, Berrington & Alwan (2019)",
      journal: "PLOS ONE 14(9): e0222184",
      url: "https://doi.org/10.1371/journal.pone.0222184",
      limitations: [
        "Only about half of the original cohort had outcome data at age 42, and dropout was higher among later-born children and disadvantaged families.",
        "The cohort was born in 1970, when families were shrinking and childhood mortality was low, so the findings may not apply to other eras.",
        "Wellbeing and distress were self-reported, and weights for lost cases were not used.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 5,
        excerpt:
          "The measure was derived by subtracting the total number of miscarriages and stillbirths from the total number of pregnancies, to produce the number of live births prior to the participant’s birth. This information was self-reported, collected at the time of the participants birth.",
      },
      {
        id: "e2",
        page: 4,
        excerpt:
          "Gender is therefore hypothesised to be an effect modifier resulting in differences in outcomes for men and women, stemming from the unequal distribution of parental resources and investment.",
      },
      {
        id: "e4",
        page: 6,
        excerpt:
          "Model 1 tested the unadjusted association between birth order, mental wellbeing, psychological distress and doctor",
      },
      {
        id: "e5",
        page: 6,
        excerpt:
          "Model 5 additionally included confounders at age forty-two (partnership status,",
      },
      {
        id: "e6",
        page: 10,
        excerpt:
          "4+ -0.79 (-1.57, -0.02) -0.90 (-1.82, 0.02) -0.86 (-1.78, 0.07) -1.19 (-2.28, -0.09) -1.04 (-2.11, 0.03)",
      },
      {
        id: "e7",
        page: 9,
        excerpt:
          "Including conduct disorder at age ten attenuated the relationship between birth order and mental wellbeing at age 42.",
      },
      {
        id: "e8",
        page: 9,
        excerpt:
          "4+ 1.11 (0.88, 1.40) 1.11 (0.84, 1.47) 1.09 (0.83, 1.44) 1.11 (0.80, 1.54) 1.10 (0.79, 1.53)",
      },
      {
        id: "e9",
        page: 9,
        excerpt:
          "4+ 0.87 (0.68, 1.12) 0.76 (0.57, 1.02) 0.74 (0.55, 1.05) 0.75 (0.53, 1.06) 0.75 (0.53, 1.07)",
      },
      {
        id: "e10",
        page: 9,
        excerpt:
          "There was little evidence to indicate differences in effect estimates when stratified by gender.",
      },
      {
        id: "e11",
        page: 4,
        excerpt:
          "Within the BCS70 there were 8,578 respondents with valid data on the Malaise Index at and 8,070 with valid data on the WEMWBS at forty-two.",
      },
      {
        id: "e12",
        page: 4,
        excerpt:
          "whose parents were single at birth, who were of birth order four and above, and those whose parents were unskilled or partly skilled.",
      },
      {
        id: "e13",
        page: 4,
        excerpt: "Weights were therefore not used within this study.",
      },
      {
        id: "e14",
        page: 9,
        excerpt:
          "The results did not support the resource depletion hypothesis.",
      },
      {
        id: "e15",
        page: 9,
        excerpt:
          "Investing increased resources into the surviving eldest child might have been a ‘Darwinist best bet’ in an historical era when childhood mortality was high and sibship sizes were large.",
      },
    ],
    challenges: [
      {
        id: "q1",
        stage: "Read the design",
        title: "When Birth Order Was Recorded",
        type: "single",
        prompt:
          "Birth order was recorded by parents when the child was born, and wellbeing was measured at age 42. What does recording it at birth protect against?",
        evidence: [
          "Birth order: the number of live births before the participant, reported at the time of birth.",
          "Wellbeing and distress: questionnaires at age 42.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It prevents adult mood or memory from changing the birth-order report.",
          },
          {
            id: "o2",
            text: "It removes confounding by family income across birth-order groups.",
          },
          {
            id: "o3",
            text: "It prevents later-born children from being more likely to leave the cohort.",
          },
          {
            id: "o4",
            text: "It prevents family size from needing adjustment in the adult analysis.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Think about when each fact was written down and who wrote it.",
        misconceptions: {
          o2: "Recording early does not remove confounding by family circumstances.",
          o3: "Early measurement does not prevent selective dropout.",
          o4: "Timing of measurement does not remove the need to consider family size.",
        },
        explanation:
          "Because birth order was reported at birth, the outcome at age 42 cannot have coloured it. The design cannot remove other differences between families or the later loss of participants.",
        refs: ["e1"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "q2",
        stage: "Read the design",
        title: "Men and Women Separately",
        type: "single",
        prompt:
          "The team ran every analysis separately for men and for women. What is the best reason to do that rather than pool everyone?",
        evidence: [
          "Earlier work on other outcomes found birth-order patterns that differed between men and women.",
          "One sex might receive more parental investment than the other, depending on its place in the family.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Pooling would turn an observational comparison into an experimental one.",
          },
          {
            id: "o1",
            text: "Pooling could hide a birth-order pattern that differs between men and women.",
          },
          {
            id: "o3",
            text: "Separate analyses put men's and women's scores onto a common wellbeing scale.",
          },
          {
            id: "o4",
            text: "Separate analyses make each estimate more precise by using a smaller group.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What could go wrong if opposite patterns in men and women were averaged?",
        misconceptions: {
          o2: "Pooling does not change how birth order was assigned or recorded.",
          o3: "They already use the same scale; splitting is not a rescaling procedure.",
          o4: "Splitting usually reduces precision rather than increasing it.",
        },
        explanation:
          "The authors treated gender as a possible effect modifier, meaning birth order might work differently for men and women. Separate models let each pattern show, at the cost of smaller samples.",
        refs: ["e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "q3",
        stage: "Read the results",
        title: "Five Models, One Group",
        type: "single",
        prompt:
          "The authors say adjusting for adult circumstances “attenuated” the link for men born fourth or later. Looking at all five models, what actually changed?",
        evidence: [
          "Group: men born fourth or later, compared with first-born men.",
          "Outcome: wellbeing score (WEMWBS), where higher means better; difference in points, 95% interval.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Men born fourth or later, five models",
          instruction:
            "Compare each model's interval with zero and with the others, then choose what changed.",
          description:
            "Difference in wellbeing score from first-born men, with 95% confidence intervals, as more variables are added.",
          provenance: {
            kind: "reported",
            refs: ["e6"],
            note: "Estimates and intervals as printed in the regression table.",
          },
          measure: "Wellbeing points below first-born men",
          min: -2.5,
          max: 0.5,
          reference: {
            value: 0,
            label: "No difference from first-born men",
          },
          band: null,
          estimates: [
            {
              id: "m1",
              label: "Model 1",
              detail: "Unadjusted.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -0.79,
              lower: -1.57,
              upper: -0.02,
            },
            {
              id: "m2",
              label: "Model 2",
              detail: "Adjusted for birth characteristics.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -0.9,
              lower: -1.82,
              upper: 0.02,
            },
            {
              id: "m3",
              label: "Model 3",
              detail: "Plus birthweight and breastfeeding.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -0.86,
              lower: -1.78,
              upper: 0.07,
            },
            {
              id: "m4",
              label: "Model 4",
              detail:
                "Plus parental separation and conduct disorder at age 10.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -1.19,
              lower: -2.28,
              upper: -0.09,
            },
            {
              id: "m5",
              label: "Model 5",
              detail: "Plus employment, education and partnership at 42.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: -1.04,
              lower: -2.11,
              upper: 0.03,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "Interval moved, estimate did not shrink",
            detail:
              "The estimate stays between about −0.8 and −1.2 points. Only the interval changes sides of zero, so what was lost is statistical significance.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e6"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "Estimate fell toward zero",
              targetIds: ["m1", "m5"],
            },
            {
              optionId: "o3",
              label: "Model 4 proves cause",
              targetIds: ["m4"],
            },
            {
              optionId: "o2",
              label: "Estimate stable, interval crosses zero",
              targetIds: ["m1", "m5"],
            },
            {
              optionId: "o4",
              label: "Same as first-born",
              targetIds: ["m5"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "The estimate moved closer to zero after adjustment; the gap itself became smaller.",
          },
          {
            id: "o3",
            text: "The estimate grew because childhood conduct problems were shown to cause the gap.",
          },
          {
            id: "o2",
            text: "The estimate stayed about the same or grew a little; what changed is that its interval now includes zero, so it no longer reaches significance.",
          },
          {
            id: "o4",
            text: "The estimate settled at zero, showing equal wellbeing in both birth-order groups.",
          },
        ],
        accepted: ["o2"],
        alternatives: [],
        hint: "Compare the size of the estimate in Model 1 and Model 5 before looking at the intervals.",
        misconceptions: {
          o1: "The estimate went from −0.79 to −1.04, which is slightly larger, not smaller.",
          o3: "Adjustment estimates associations; it does not establish this causal explanation.",
          o4: "A confidence interval containing zero does not establish equality.",
        },
        explanation:
          "The estimate moved from −0.79 to −1.04 points, so the gap did not shrink. In Model 5 the interval (−2.11 to 0.03) just includes zero. “Attenuated” describes lost significance, not a smaller difference.",
        refs: ["e4", "e5", "e6", "e7"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "q4",
        stage: "Read the results",
        title: "Opposite Directions?",
        type: "single",
        prompt:
          "In the fully adjusted model, men born fourth or later have an odds ratio above 1 for high distress and women below 1. Do these figures show that birth order works in opposite ways for the sexes?",
        evidence: [
          "Men, birth order 4+ versus first-born, high distress, Model 5: OR 1.10 (95% CI 0.79 to 1.53).",
          "Women, birth order 4+ versus first-born, high distress, Model 5: OR 0.75 (95% CI 0.53 to 1.07).",
          "An odds ratio of 1 means no difference from first-born.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Yes: estimates on opposite sides of 1 establish different effects in men and women.",
          },
          {
            id: "o3",
            text: "Yes: the estimate further from 1 identifies the sex with the stronger birth-order effect.",
          },
          {
            id: "o4",
            text: "No: odds ratios lose their interpretation when the same model is fitted separately by sex.",
          },
          {
            id: "o2",
            text: "No: these uncertain estimates do not establish a sex difference; test that directly.",
          },
        ],
        accepted: ["o2"],
        alternatives: [],
        hint: "Check whether each interval includes 1, and whether the two intervals overlap.",
        misconceptions: {
          o1: "Both intervals include 1 and overlap heavily, so the data are compatible with no difference in either group and with no difference between groups.",
          o3: "Distances from 1 alone do not test the difference between sexes.",
          o4: "Odds ratios remain interpretable; the issue is uncertainty and a direct comparison.",
        },
        explanation:
          "The point estimates differ, but both intervals span 1 and overlap (0.79 to 1.53 and 0.53 to 1.07). The authors summarise that there was little evidence of differences between men and women.",
        refs: ["e8", "e9", "e10"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "q5",
        stage: "Draw a conclusion",
        title: "Half the Cohort Missing",
        type: "single",
        prompt:
          "Only about half of the original cohort had outcome data at age 42, and the dropouts were more often later-born and from disadvantaged families. What does that mean for the no-association conclusion?",
        evidence: [
          "Respondents with valid Malaise Index data: 8,578; with valid WEMWBS data: 8,070.",
          "The original cohort had 17,096 participants.",
          "The authors did not use weights to adjust for lost cases.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The loss affects precision, but cannot bias the birth-order estimate.",
          },
          {
            id: "o3",
            text: "The missing later-born adults must have lower wellbeing, so the null hides a real effect.",
          },
          {
            id: "o4",
            text: "Losing half the cohort makes even associations among the remaining adults uninterpretable.",
          },
          {
            id: "o2",
            text: "Selective dropout could distort the pattern, so the null needs caution.",
          },
        ],
        accepted: ["o2"],
        alternatives: [],
        hint: "Ask who is most likely to be missing, and whether they are the people a birth-order effect would show up in.",
        misconceptions: {
          o1: "If the missing people differ in birth order and background, the remaining sample can distort the comparison, not just shrink it.",
          o3: "Their missing outcomes are unknown; a possible bias is not proof of its direction.",
          o4: "Attrition limits inference without making all observed data useless.",
        },
        explanation:
          "Attrition was greatest among later-born children and disadvantaged families, exactly the groups a birth-order effect might involve. The null result describes people who stayed, and it should be read with that caveat.",
        refs: ["e11", "e12", "e13"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "q6",
        stage: "Draw a conclusion",
        title: "Would Another Era Differ?",
        type: "single",
        prompt:
          "The authors say this cohort was born when childhood mortality was low and families were getting smaller, so resources may have been shared more evenly. Which follow-up best tests whether the era matters?",
        evidence: [
          "Resource-depletion idea: eldest children get more investment when families are large and survival is uncertain.",
          "This cohort: everyone born in one week of 1970.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Measure more outcomes in this cohort and select those with the clearest birth-order gaps.",
          },
          {
            id: "o3",
            text: "Remove adult adjustments and compare significance within this same cohort.",
          },
          {
            id: "o1",
            text: "Study a cohort from a different family-size and mortality era using the same measures.",
          },
          {
            id: "o4",
            text: "Compare first-born adults across eras while leaving later-born adults out of the analysis.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which comparison would change the one condition the authors say may matter?",
        misconceptions: {
          o2: "Selecting significant outcomes does not test whether historical context matters.",
          o3: "This tests model choices, not a different historical era.",
          o4: "Testing birth-order patterns requires comparing birth orders in each era.",
        },
        explanation:
          "The authors argue that resource depletion may matter more where families are large and child survival is uncertain. A cohort from such an era, with the same measures, would test that directly.",
        refs: ["e14", "e15"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In a British cohort followed to age 42, birth order showed no clear link with wellbeing, distress or consulting a doctor for mental health, for men or women. One association in later-born men lost significance after adjustment although its size did not shrink. About half the cohort was missing, so the finding applies most safely to those who stayed.",
};
