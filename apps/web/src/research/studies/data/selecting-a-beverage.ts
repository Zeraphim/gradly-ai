// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/mundt-2020-straw-default-nudge.pdf
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-selecting-a-beverage",
    title: "Field Experiment on Reducing Drinking Straw Consumption by Default",
    briefing:
      "Decide how to test whether picking up a straw changes how many people take one, and what a replication needs.",
    source: "generated",
    paper: {
      title:
        "A Field Experiment on Reducing Drinking Straw Consumption by Default",
      authors: "Mundt, Carl & Harhoff (2020)",
      journal: "Frontiers in Psychology 11: 565537",
      url: "https://doi.org/10.3389/fpsyg.2020.565537",
      limitations: [
        "The results paragraph contains a mismatch between the stated outcome coding, coefficient sign, odds ratio and the direction described in Figure 1. Check the analysis script before using the exact directional odds ratio.",
        "Drinks were served in public, where other people could influence choices.",
        "The setting, cups and cover story varied; free lemonade may not generalise to purchased drinks where straws have a functional role.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 1,
        excerpt:
          "Against the background of the pollution of the environment through plastic waste, we conducted a field experiment (N = 195) to test the effectiveness of a default nudge intervention that aimed at reducing the consumption of plastic drinking straws.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "The binomial logistic regression showed a significant difference between both conditions concerning the use of drinking straws [B = 1.129 (SE = 0.30), z = −3.77, p < 0.001 with an odds ratio of OR = 0.32, 95% CI (0.178, 0.577)].",
      },
      {
        id: "e3",
        page: 1,
        excerpt:
          "We hypothesized that individuals would consume straws less frequently when they had to pick straws actively out of a separate straw box for their drink compared to when they could choose between cups already containing and not containing straws.",
      },
      {
        id: "e4",
        page: 4,
        excerpt:
          "In the present field experiment, we examined the effect of an easy-to-implement default-nudge intervention on reducing drinking straw consumption.",
      },
      {
        id: "e5",
        page: 4,
        excerpt:
          "Our results corroborate the findings of Wagner and Toews (2018), who found a reduction in straw consumption after the implementation of a default nudge in restaurants.",
      },
      {
        id: "e6",
        page: 3,
        excerpt:
          "Since both the independent and dependent variables were binary, we conducted a binomial logistic regression.",
      },
      {
        id: "e7",
        page: 4,
        excerpt:
          "To start with, there might be a bias in the straw consumption induced by other participants and the experiment itself. As we offered drinks in public, we could not control any effects of the social norms introduced by the group members that served themselves at the same time.",
      },
      {
        id: "e8",
        page: 2,
        excerpt:
          "In the experimental condition, cups were presented without straws. However, straws could be taken actively out of a coverless box offered beside the cups. In the control condition, the straws were already inside half of the offered cups. The other half of the offered cups did not contain straws. The dependent variable was the choice for or against straw consumption.",
      },
      {
        id: "e9",
        page: 3,
        excerpt:
          "The independent variable Nudge was coded 0 = control condition and 1 = experimental condition. The dependent variable was coded 0 = straw consumption and 1 = straw avoidance.",
      },
      {
        id: "e10",
        page: 3,
        excerpt:
          "Figure 1 visualizes higher probabilities to consume straws in the control condition.",
      },
      {
        id: "e11",
        page: 3,
        excerpt:
          "The converted OR results in Cohen’s d = −0.63, which can be conceived as a medium effect.",
      },
      {
        id: "e12",
        page: 4,
        excerpt:
          "Especially in more typical drink-\nserving contexts (e.g., restaurants, bars), a replication needs\nto be considered. Thus, in our case, people received the drinks\nfor free. Moreover, our lemonades were not drinks for which\ndrinking straws had any important or necessary functional\nrole in consumption. Thus, consumers without specific disabilities\ncould easily renounce the use of straws without losing the\ncapability of consuming their drink. In contrast, straws in\ncocktails or long drinks are also used to stir and separate\nliquids from other ingredients.",
      },
    ],
    challenges: [
      {
        id: "decision1",
        stage: "Read the design",
        title: "Study Design",
        type: "single",
        prompt:
          "Visitors choose a drink with or without a straw. Which analysis fits comparing that choice between serving arrangements?",
        evidence: ["Different visitors choose drinks in the two arrangements."],
        options: [
          {
            id: "o2",
            text: "Linear regression treating straw choice as an unrestricted measurement.",
          },
          {
            id: "o1",
            text: "Binomial logistic regression of straw choice on arrangement.",
          },
          {
            id: "o3",
            text: "A paired test treating the groups as repeat visits by the same people.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which model matches a two-category outcome?",
        misconceptions: {
          o2: "The proposed outcome is a two-category choice, not a continuous score.",
          o3: "The two arrangements do not provide paired observations of the same visitors.",
        },
        explanation:
          "The outcome has two possible values. A binomial logistic model fits that outcome; it does not require every predictor to be binary. Different visitors are not repeated measurements of the same people.",
        refs: ["e8", "e6"],
        writtenReasoning: false,
        reveal: "design",
        scene: {
          version: 1,
          kind: "matrix",
          title: "What gets recorded?",
          instruction:
            "Compare where straws are placed and what each visitor chooses.",
          description: "What gets recorded?",
          provenance: {
            kind: "source-summary",
            refs: ["e8"],
            note: "Serving arrangements from the methods section.",
          },
          responses: [
            {
              optionId: "o2",
              label:
                "Linear regression treating straw choice as an unrestricted measurement.",
              targetIds: ["record", "scale"],
            },
            {
              optionId: "o1",
              label:
                "Binomial logistic regression of straw choice on arrangement.",
              targetIds: ["record", "scale"],
            },
            {
              optionId: "o3",
              label:
                "A paired test treating the groups as repeat visits by the same people.",
              targetIds: ["record", "scale"],
            },
          ],
          resolution: null,
          conditions: [
            {
              id: "placement",
              label: "Straw placement",
            },
            {
              id: "outcome",
              label: "Recorded choice",
            },
          ],
          rows: [
            {
              id: "record",
              label: "Separate box",
              detail: "One arrangement",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e8"],
                note: "Authored summary of the cited paper; no invented measurements.",
              },
              cells: ["Beside cups without straws", "Straw / no straw"],
            },
            {
              id: "scale",
              label: "Straws in cups",
              detail: "Other arrangement",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e8"],
                note: "Authored summary of the cited paper; no invented measurements.",
              },
              cells: ["Inside half of the cups", "Straw / no straw"],
            },
          ],
        },
      },
      {
        id: "decision2",
        stage: "Read the design",
        title: "Research Hypothesis",
        type: "single",
        prompt:
          "A café wants to test whether having to pick up a straw changes behaviour. Which prediction would make that claim testable?",
        evidence: [
          "Straws remain available in both arrangements; only their placement changes.",
        ],
        options: [
          {
            id: "o5",
            text: "Visitors in the box condition have no access to straws at all.",
          },
          {
            id: "o6",
            text: "Visitors choose straws equally often regardless of the serving arrangement.",
          },
          {
            id: "o4",
            text: "A smaller share of visitors takes a straw when it must be picked from the separate box.",
          },
        ],
        accepted: ["o4"],
        alternatives: [],
        hint: "Keep availability separate from the effort needed to choose.",
        misconceptions: {
          o5: "This changes access rather than testing an extra step with straws still available.",
          o6: "That predicts no effect of the extra step rather than the proposed reduction.",
        },
        explanation:
          "The proposed default mechanism predicts a difference in the proportion choosing a straw, while leaving the option available. This is a prediction to test, not an observed result.",
        refs: ["e3", "e8"],
        writtenReasoning: false,
        reveal: "design",
        scene: {
          version: 1,
          kind: "flow",
          title: "Two ways to serve the same drink",
          instruction: "Trace the choice each visitor can make.",
          description: "Two ways to serve the same drink",
          provenance: {
            kind: "source-summary",
            refs: ["e8"],
            note: "Authored summary of the cited paper; no invented measurements.",
          },
          responses: [
            {
              optionId: "o5",
              label:
                "Visitors in the box condition have no access to straws at all.",
              targetIds: ["cup", "box", "inside"],
            },
            {
              optionId: "o6",
              label:
                "Visitors choose straws equally often regardless of the serving arrangement.",
              targetIds: ["cup", "box", "inside"],
            },
            {
              optionId: "o4",
              label:
                "A smaller share of visitors takes a straw when it must be picked from the separate box.",
              targetIds: ["cup", "box", "inside"],
            },
          ],
          resolution: null,
          nodes: [
            {
              id: "cup",
              label: "Lemonade offered",
              detail: "A visitor can choose a drink.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e8"],
                note: "Authored summary of the cited paper; no invented measurements.",
              },
            },
            {
              id: "box",
              label: "Separate box",
              detail:
                "Cups arrive without straws; a straw can be picked up beside them.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e8"],
                note: "Authored summary of the cited paper; no invented measurements.",
              },
            },
            {
              id: "inside",
              label: "Some cups contain straws",
              detail: "Half the cups already contain a straw.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e8"],
                note: "Authored summary of the cited paper; no invented measurements.",
              },
            },
          ],
          edges: [
            {
              from: "cup",
              to: "box",
              label: "One arrangement",
              at: "setup",
            },
            {
              from: "cup",
              to: "inside",
              label: "Other arrangement",
              at: "setup",
            },
          ],
        },
      },
      {
        id: "decision3",
        stage: "Read the results",
        title: "Interpreting the Odds Ratio",
        type: "single",
        prompt:
          "The paragraph codes avoidance as 1, reports B = 1.129 and OR = 0.32, yet Figure 1 describes more consumption in the control condition. What should you do before interpreting the exact directional odds ratio?",
        evidence: [
          "Reported OR: 0.32; 95% CI: 0.178 to 0.577.",
          "Stated coding: control = 0, experimental = 1; consumption = 0, avoidance = 1.",
          "Figure 1 and its accompanying text put consumption higher in the control condition.",
        ],
        options: [
          {
            id: "o7",
            text: "Check the coding and script before assigning direction to the inconsistent odds ratio.",
          },
          {
            id: "o9",
            text: "Read OR = 0.32 as a 32-point reduction, without consulting the coding or figure.",
          },
          {
            id: "o8",
            text: "Read the isolated odds ratio as increased use, without checking the conflicting figure.",
          },
        ],
        accepted: ["o7"],
        alternatives: [],
        hint: "Check whether the coefficient, coding and plotted direction can all be true together.",
        misconceptions: {
          o8: "An isolated statistic does not resolve contradictory coding and reporting.",
          o9: "An odds ratio is not a percentage-point difference, and the reported coding is inconsistent.",
        },
        explanation:
          "The paper reports lower consumption with separate straws, but the printed coding and positive coefficient do not align cleanly with OR = 0.32. An odds ratio is exp(B), so a positive coefficient cannot produce that printed ratio. Keep the authors’ stated finding separate from an unresolved reporting inconsistency; inspect the original analysis before interpreting the exact directional OR.",
        refs: ["e2", "e9", "e10"],
        writtenReasoning: false,
        reveal: "results",
        scene: {
          version: 1,
          kind: "estimate",
          title: "Read the reported interval",
          instruction:
            "Inspect the interval against the no-difference value; the direction still needs a coding check.",
          description: "Read the reported interval",
          provenance: {
            kind: "reported",
            refs: ["e2"],
            note: "Printed odds ratio and interval; the coding/sign mismatch remains unresolved.",
          },
          responses: [
            {
              optionId: "o7",
              label:
                "Check the coding and script before assigning direction to the inconsistent odds ratio.",
              targetIds: ["or"],
            },
            {
              optionId: "o9",
              label:
                "Read OR = 0.32 as a 32-point reduction, without consulting the coding or figure.",
              targetIds: ["or"],
            },
            {
              optionId: "o8",
              label:
                "Read the isolated odds ratio as increased use, without checking the conflicting figure.",
              targetIds: ["or"],
            },
          ],
          resolution: null,
          measure: "Reported odds ratio (coding needs verification)",
          min: 0,
          max: 1.2,
          reference: {
            value: 1,
            label: "No difference in odds",
          },
          band: null,
          estimates: [
            {
              id: "or",
              label: "Printed estimate",
              detail: "OR = 0.32; 95% CI 0.178 to 0.577.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e2"],
                note: "Printed odds ratio and interval; the coding/sign mismatch remains unresolved.",
              },
              value: 0.32,
              lower: 0.178,
              upper: 0.577,
            },
          ],
          prediction: null,
        },
      },
      {
        id: "decision4",
        stage: "Read the results",
        title: "Effect Size",
        type: "single",
        prompt:
          "The authors convert the odds ratio to d = −0.63 and call it medium. Which additional conclusion would go beyond that effect-size label?",
        evidence: ["The reported standardised effect is d = −0.63."],
        options: [
          {
            id: "o11",
            text: "The estimate expresses a difference on a standardised scale, rather than in percentage points.",
          },
          {
            id: "o12",
            text: "The authors describe their estimate using a conventional category for standardised effect size.",
          },
          {
            id: "o10",
            text: "The intervention will have the same effect size in every café, regardless of its setting.",
          },
        ],
        accepted: ["o10"],
        alternatives: [],
        hint: "Does a label about size establish that the result transfers to a new setting?",
        misconceptions: {
          o11: "A standardised scale is what d describes; that statement does not claim transport to a new population.",
          o12: "The paper explicitly calls the converted value medium; the label itself is not a replication.",
        },
        explanation:
          "A size category describes this estimate. It does not establish that the same effect will recur in another setting, and it is not a percentage of visitors. The reporting inconsistency also cautions against relying on the exact converted value.",
        refs: ["e11", "e2"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "decision5",
        stage: "Draw a conclusion",
        title: "Study Limitation",
        type: "single",
        prompt:
          "Visitors chose drinks in public while other group members were nearby. Which change would help test whether other people influenced the choice?",
        evidence: ["Several people could serve themselves at the same time."],
        options: [
          {
            id: "o13",
            text: "Compare otherwise matched sessions where visitors choose alone versus alongside other people.",
          },
          {
            id: "o15",
            text: "Use cup counts as a direct measure of each visitor's beliefs about straw consumption.",
          },
          {
            id: "o14",
            text: "Observe only the box arrangement, without comparing solitary choices with group choices.",
          },
        ],
        accepted: ["o13"],
        alternatives: [],
        hint: "Change the suspected source of social influence while preserving a fair comparison.",
        misconceptions: {
          o14: "Removing the relevant comparison does not isolate other people's influence.",
          o15: "Cup counts do not measure beliefs or isolate social influence.",
        },
        explanation:
          "Varying whether peers are present could probe social influence while keeping the serving arrangement comparable. It is a proposed follow-up, not a result of this paper.",
        refs: ["e7"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: {
          version: 1,
          kind: "connections",
          title: "Who else is choosing?",
          instruction: "Inspect the setting, then choose a useful follow-up.",
          description: "Who else is choosing?",
          provenance: {
            kind: "source-summary",
            refs: ["e7"],
            note: "Authored summary of the cited paper; no invented measurements.",
          },
          responses: [
            {
              optionId: "o13",
              label:
                "Compare otherwise matched sessions where visitors choose alone versus alongside other people.",
              targetIds: ["setting"],
            },
            {
              optionId: "o15",
              label:
                "Use cup counts as a direct measure of each visitor's beliefs about straw consumption.",
              targetIds: ["setting"],
            },
            {
              optionId: "o14",
              label:
                "Observe only the box arrangement, without comparing solitary choices with group choices.",
              targetIds: ["setting"],
            },
          ],
          resolution: null,
          anchors: [
            {
              id: "setting",
              label: "Public serving",
              detail: "Other group members can choose at the same time.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e7"],
                note: "Authored summary of the cited paper; no invented measurements.",
              },
            },
          ],
          actionLabel: "Connect a follow-up",
        },
      },
      {
        id: "decision6",
        stage: "Draw a conclusion",
        title: "Generalisability",
        type: "single",
        prompt:
          "A bar wants to apply the result to paid cocktails, where straws may also stir the drink. What is the strongest next step?",
        evidence: [
          "The original setting offered free lemonade.",
          "Straws can have a functional role in cocktails that they did not have for the lemonade.",
        ],
        options: [
          {
            id: "o18",
            text: "Ban straws completely and interpret the change as a replication of the separate-box default.",
          },
          {
            id: "o16",
            text: "Test the comparable arrangement with paid cocktails before transferring the estimate.",
          },
          {
            id: "o17",
            text: "Transfer the measured reduction directly, since free juice and paid cocktails are both drinks.",
          },
        ],
        accepted: ["o16"],
        alternatives: [],
        hint: "Which follow-up tests transfer while preserving the choice?",
        misconceptions: {
          o17: "Shared liquid form does not establish that context and straw function are irrelevant.",
          o18: "A ban is a different intervention from changing the default while retaining access.",
        },
        explanation:
          "A replication in the target setting tests whether price, expectations and the functional use of a straw change the effect. A ban removes the choice and tests a different intervention.",
        refs: ["e12", "e8"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: {
          version: 1,
          kind: "designs",
          title: "Original setting and proposed replication",
          instruction: "Compare what would change in a test at a bar.",
          description: "Original setting and proposed replication",
          provenance: {
            kind: "authored",
            refs: ["e12"],
            note: "Proposed replication contrasted with the original setting; no new observations.",
          },
          responses: [
            {
              optionId: "o18",
              label:
                "Ban straws completely and interpret the change as a replication of the separate-box default.",
              targetIds: ["free", "original-choice", "paid", "follow-choice"],
            },
            {
              optionId: "o16",
              label:
                "Test the comparable arrangement with paid cocktails before transferring the estimate.",
              targetIds: ["free", "original-choice", "paid", "follow-choice"],
            },
            {
              optionId: "o17",
              label:
                "Transfer the measured reduction directly, since free juice and paid cocktails are both drinks.",
              targetIds: ["free", "original-choice", "paid", "follow-choice"],
            },
          ],
          resolution: null,
          panels: [
            {
              id: "original",
              label: "Original setting",
              steps: [
                {
                  id: "free",
                  label: "Free lemonade",
                  detail: "The original study offered free lemonade.",
                  at: "setup",
                  provenance: {
                    kind: "source-summary",
                    refs: ["e12"],
                    note: "Authored summary of the cited paper; no invented measurements.",
                  },
                },
                {
                  id: "original-choice",
                  label: "Straw remains available",
                  detail: "Placement changes; the choice stays available.",
                  at: "setup",
                  provenance: {
                    kind: "source-summary",
                    refs: ["e8"],
                    note: "Authored summary of the cited paper; no invented measurements.",
                  },
                },
              ],
            },
            {
              id: "followup",
              label: "Proposed follow-up",
              steps: [
                {
                  id: "paid",
                  label: "Paid cocktails",
                  detail:
                    "Test in the target setting rather than assume transfer.",
                  at: "setup",
                  provenance: {
                    kind: "authored",
                    refs: ["e12"],
                    note: "Proposed replication contrasted with the original setting; no new observations.",
                  },
                },
                {
                  id: "follow-choice",
                  label: "Keep the same choice",
                  detail: "Compare placements while leaving straws available.",
                  at: "setup",
                  provenance: {
                    kind: "authored",
                    refs: ["e12"],
                    note: "Proposed replication contrasted with the original setting; no new observations.",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
    bonus: null,
  },
  takeaway:
    "The authors report less straw consumption when straws were offered separately. The printed outcome coding, coefficient and odds ratio contain an unresolved mismatch, so the exact directional odds ratio needs checking against the analysis script. Public group choices and free lemonade limit transfer to paid drinks in bars or restaurants.",
};
