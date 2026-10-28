// Originally generated 2026-10-25; source-checked question revision 2026-10-28.
// Source paper: docs/research/papers/marciano-2023-social-media-flourishing.pdf
// Agent source review is not content-owner approval; see PREPARED_STUDY_REVIEW.md.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-teen-social-media-use",
    title: "Investigating Social Media and Adolescent Flourishing",
    briefing:
      "You will examine how the study was designed, what variables were controlled, which results emerged, and what those results mean and cannot show.",
    source: "generated",
    paper: {
      title:
        "Social media use and adolescents' well-being: A note on flourishing",
      authors: "Marciano & Viswanath (2023)",
      journal: "Frontiers in Psychology 14: 1092109",
      url: "https://doi.org/10.3389/fpsyg.2023.1092109",
      limitations: [
        "One-wave self-reports cannot establish direction, and reverse associations remain possible (p. 9).",
        "The model adjusts measured covariates, not all possible confounding influences. The Swiss adolescent sample limits wider generalization (pp. 1, 9–10).",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 1,
        excerpt:
          "After applying Bonferroni’s correction, results of the hierarchical regression analyses showed that positive social media experiences (β=0.112, p<0.001) and social media inspirations from others (β=0.072, p<0.001) and for others (β=0.060, p=0.003) were positively associated with flourishing. Flourishing was inversely associated with negative social media experiences (β=−0.076, p<0.001).",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "Due to the paucity of literature on flourishing and social media use in adolescents, the present study aims to investigate which social media experiences are related to flourishing.",
      },
      {
        id: "e3",
        page: 6,
        excerpt:
          "Results of the hierarchical regression analysis explained more than half of the variance in the Flourishing scale (R2 = 0.553). After applying Bonferroni’s correction (p < 0.003) and controlling for all covariates, the following social media activities positively predicted flourishing: positive social media experiences (β = 0.112, p < 0.001) and social media inspirations from others (β = 0.072, p < 0.001) and partially for others (β = 0.060, p = 0.003).",
      },
      {
        id: "e4",
        page: 9,
        excerpt:
          "Second, our results showed that inspiration through social media content (i.e., being inspired by others’ posts and activities and being an inspiration for others) improves flourishing levels in adolescents.",
      },
      {
        id: "e5",
        page: 3,
        excerpt:
          "guided by the developmental needs pointed out by the SDT, we included positive and negative social media experiences, self-disclosure on social media, and social media inspiration as proxies of the online fulfillment of SDT needs, to investigate how they were associated with flourishing.",
      },
      {
        id: "e6",
        page: 4,
        excerpt:
          "It was measured using the Harvard Adolescent Flourishing Measure (ages 12–18; 48).",
      },
      {
        id: "r1",
        page: 9,
        excerpt:
          "Limitations and future directions Some methodological limitations should be acknowledged. First, due to the cross-sectional design of our study, we cannot draw any conclusions on the causes and effects of flourishing. In this regard, we cannot exclude the reverse associations and directionality, that is, flourishing can predict a specific use of social media. Indeed, it is somewhat possible that flourishing causes productive and positive uses of social media, as well as previously shown in other studies focusing on ill-being outcomes (Marciano et al., 2022d), although the effect from ill-being to media use was stronger. Also, we included items as proxies for SDT constructs. Hence future studies should include direct measures of relatedness, autonomy, and competence that have been developed and adapt them to the social media context. Although we considered personality traits such as extraversion and neuroticism as covariates, future studies should consider all Big Five personality traits and look at differences between high vs. low levels of such traits. Additionally, we did not measure the extent of social media use.",
      },
      {
        id: "r2",
        page: 1,
        excerpt:
          "Methods: The study is drawn on cross-sectional data collected from 1,429 Swiss adolescents (58.8% females, Mage=15.84, SDage=0.83) as part of the HappyB project in Spring 2022. Self-reported measures included the Harvard Adolescent Flourishing scale, positive and negative online social experiences, self-disclosure on social media, and social media inspiration. Control variables included, among others, self-esteem, ill-being, and personality. Results: After applying Bonferroni’s correction, results of the hierarchical regression analyses showed that positive social media experiences (β=0.112, p<0.001) and social media inspirations from others (β=0.072, p<0.001) and for others (β=0.060, p=0.003) were positively associated with flourishing.",
      },
      {
        id: "r3",
        page: 6,
        excerpt:
          "Results of the hierarchical regression analysis explained more than half of the variance in the Flourishing scale (R2 = 0.553). After applying Bonferroni’s correction (p < 0.003) and controlling for all covariates, the following social media activities positively predicted flourishing: positive social media experiences (β = 0.112, p < 0.001) and social media inspirations from others (β = 0.072, p < 0.001) and partially for others (β = 0.060, p = 0.003). Self-disclosure on social media with close friends (β = 0.057, p = 0.005) and with acquaintances or famous people (β = −0.018, p = 0.365) were not significant predictors. Conversely, flourishing levels were inversely associated with negative social media experiences (β = −0.076, p < 0.001). Among covariates, self-esteem (β = 0.350, p < 0.001), ill-being (β = −0.252, p < 0.001), perceived school environment (β = 0.138, p < 0.001), self-reported level of physical activity (β =0.109, p < 0.001), and perceived SES (β = −0.059, p = 0.001) were all related to flourishing.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Classify this analysis",
        type: "single",
        prompt:
          "The survey belongs to a longitudinal project, but this analysis uses only its first wave. Which design describes this analysis?",
        evidence: [
          "Adolescents completed the reported measures during the Spring 2022 wave; later waves are not analysed here.",
        ],
        scene: null,
        options: [
          {
            id: "opt_correct",
            text: "A cross-sectional analysis of measurements from one wave.",
          },
          {
            id: "opt_distractor1",
            text: "A longitudinal analysis using the project’s planned waves.",
          },
          {
            id: "opt_distractor2",
            text: "A randomized intervention because the questionnaire was completed during school.",
          },
        ],
        accepted: ["opt_correct"],
        alternatives: [],
        hint: "Use the observations actually analysed here, rather than the long-term name of the parent project.",
        misconceptions: {
          opt_distractor1:
            "A project label does not add repeated observations to this particular analysis.",
          opt_distractor2:
            "The school setting does not randomly assign social-media experiences.",
        },
        explanation:
          "The paper explicitly analyses cross-sectional first-wave data. It cannot establish within-person changes over time.",
        refs: ["r2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "What adjustment does",
        type: "single",
        prompt:
          "Why include self-esteem, ill-being and other covariates in the social-media regression?",
        evidence: [
          "The model includes demographic, psychological and school-related measures alongside social-media experiences.",
        ],
        scene: null,
        options: [
          {
            id: "opt_distractor1",
            text: "To convert self-selected social-media experiences into randomly assigned treatments.",
          },
          {
            id: "opt_correct",
            text: "To estimate associations conditional on those measured variables, while confounding may remain.",
          },
          {
            id: "opt_distractor2",
            text: "To isolate the social-media contribution by assigning the full model’s explanatory power to it.",
          },
        ],
        accepted: ["opt_correct"],
        alternatives: [],
        hint: "Distinguish variables recorded in the model from other differences that were never measured.",
        misconceptions: {
          opt_distractor1:
            "Regression adjustment does not change how exposure was assigned.",
          opt_distractor2:
            "A covariate-adjusted coefficient and the explanatory power of the entire model are different quantities.",
        },
        explanation:
          "Covariates can address measured differences. They do not establish causal independence from unmeasured variables or rule out reverse direction.",
        refs: ["e1", "e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Handle the correction boundary",
        type: "single",
        prompt:
          "The corrected threshold is p < .003. Which interpretation handles the reported p-values carefully?",
        evidence: [
          "Positive experiences and inspiration from others have p < .001. Inspiration for others is reported as p = .003 after rounding.",
        ],
        scene: null,
        options: [
          {
            id: "opt_distractor1",
            text: "All three clearly pass a strict threshold because .003 is less than .003.",
          },
          {
            id: "opt_distractor2",
            text: "Prefer the rounded .003 result over the < .001 results because it is closest to the cutoff.",
          },
          {
            id: "opt_correct",
            text: "The first two clearly pass; the rounded .003 result lies at the stated boundary.",
          },
        ],
        accepted: ["opt_correct"],
        alternatives: [],
        hint: "Compare the displayed value with the strict inequality, and remember that reported values are rounded.",
        misconceptions: {
          opt_distractor1:
            "Equality at the displayed precision is not strictly below the threshold.",
          opt_distractor2:
            "Closeness to a threshold is not stronger evidence; a strict boundary also requires care with rounding.",
        },
        explanation:
          "The paper describes inspiration for others as partially predictive. Its displayed p = .003 is on the stated p < .003 boundary, so the rounded value does not unambiguously fall below that strict threshold.",
        refs: ["r3"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Interpret full-model R²",
        type: "single",
        prompt:
          "Can R² = .553 be described as the share of flourishing explained by social media alone?",
        evidence: [
          "The reported regression includes social-media variables plus demographic, personality and well-being covariates.",
        ],
        scene: null,
        options: [
          {
            id: "opt_correct",
            text: "No; it is the explained variance of the combined model, not social media alone.",
          },
          {
            id: "opt_distractor1",
            text: "Yes; final-step R² is the variance added by social-media predictors.",
          },
          {
            id: "opt_distractor2",
            text: "Yes; R² is the percentage of participants whose flourishing social media caused.",
          },
        ],
        accepted: ["opt_correct"],
        alternatives: [],
        hint: "Check which predictors are included before assigning the model’s explained variation to one subset.",
        misconceptions: {
          opt_distractor1:
            "The full model R² includes predictors entered earlier; the increment requires a separate model comparison.",
          opt_distractor2:
            "R² concerns outcome variation fitted by a model, not causal improvement in participants.",
        },
        explanation:
          "The full model accounts for 55.3% of variation in this sample. A unique or incremental contribution requires a specified comparison of models, not assigning the full R² to social media.",
        refs: ["e3"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Association after adjustment",
        type: "single",
        prompt:
          "What does the positive adjusted association with positive online experiences leave unresolved?",
        evidence: [
          "The association remains in a model containing the listed covariates. The data are measured at one wave.",
        ],
        scene: {
          version: 1,
          title: "Adjusted links with flourishing",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "Adjusted links with flourishing",
          provenance: {
            kind: "reported",
            refs: ["e1", "e3"],
            note: "Values as printed in the cited excerpt; not individual participant records.",
          },
          responses: [
            {
              optionId: "opt_distractor1",
              label:
                "Mainly sampling error, since covariate adjustment addresses shared causes.",
              targetIds: ["positive", "negative", "from", "for"],
            },
            {
              optionId: "opt_correct",
              label:
                "Direction and unmeasured shared causes remain unresolved despite adjustment.",
              targetIds: ["positive", "negative", "from", "for"],
            },
            {
              optionId: "opt_distractor2",
              label:
                "The adjusted coefficient estimates how much flourishing would change after a social-media intervention.",
              targetIds: ["positive", "negative", "from", "for"],
            },
          ],
          resolution: null,
          kind: "association",
          pairs: [
            {
              id: "positive",
              label: "Positive experiences / Flourishing",
              detail: "Coefficient from the covariate-adjusted regression.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e1", "e3"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              x: "Positive experiences",
              y: "Flourishing",
              statistic: "beta",
              value: 0.112,
            },
            {
              id: "negative",
              label: "Negative experiences / Flourishing",
              detail: "Coefficient from the covariate-adjusted regression.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e1", "e3"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              x: "Negative experiences",
              y: "Flourishing",
              statistic: "beta",
              value: -0.076,
            },
            {
              id: "from",
              label: "Inspiration from others / Flourishing",
              detail: "Coefficient from the covariate-adjusted regression.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e1", "e3"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              x: "Inspiration from others",
              y: "Flourishing",
              statistic: "beta",
              value: 0.072,
            },
            {
              id: "for",
              label: "Inspiration for others / Flourishing",
              detail: "Coefficient from the covariate-adjusted regression.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e1", "e3"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              x: "Inspiration for others",
              y: "Flourishing",
              statistic: "beta",
              value: 0.06,
            },
          ],
        },
        options: [
          {
            id: "opt_distractor1",
            text: "Mainly sampling error, since covariate adjustment addresses shared causes.",
          },
          {
            id: "opt_correct",
            text: "Direction and unmeasured shared causes remain unresolved despite adjustment.",
          },
          {
            id: "opt_distractor2",
            text: "The adjusted coefficient estimates how much flourishing would change after a social-media intervention.",
          },
        ],
        accepted: ["opt_correct"],
        alternatives: [],
        hint: "Ask whether observing all variables at one wave identifies which one changed first.",
        misconceptions: {
          opt_distractor1:
            "Measured covariates do not settle direction or unmeasured shared causes in a one-wave analysis.",
          opt_distractor2:
            "An observational adjusted coefficient is not an intervention effect.",
        },
        explanation:
          "The coefficient is conditional on the fitted model. Flourishing could shape online experiences, shared factors could shape both, or both directions could operate.",
        refs: ["e1", "e3"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Improve temporal evidence",
        type: "single",
        prompt:
          "Which follow-up would best address the direction-of-change gap in this survey?",
        evidence: [
          "Online experiences and flourishing were observed at the same wave.",
        ],
        scene: {
          version: 1,
          title: "A regression is not a time sequence",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "A regression is not a time sequence",
          provenance: {
            kind: "source-summary",
            refs: ["e1", "e3"],
            note: "Study information paraphrased from the cited source.",
          },
          responses: [
            {
              optionId: "opt_distractor1",
              label:
                "Increase the same-wave sample and treat a smaller p-value as proof of temporal order.",
              targetIds: ["experience", "flourishing", "covariates"],
            },
            {
              optionId: "opt_distractor2",
              label:
                "Remove all covariates and treat the unadjusted correlation as an intervention effect.",
              targetIds: ["experience", "flourishing", "covariates"],
            },
            {
              optionId: "opt_correct",
              label:
                "Measure both repeatedly to examine temporal order, while still considering confounding.",
              targetIds: ["experience", "flourishing", "covariates"],
            },
          ],
          resolution: null,
          kind: "flow",
          nodes: [
            {
              id: "experience",
              label: "Social-media experiences",
              detail: "Reported characteristics of use.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e1", "e3"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 0,
            },
            {
              id: "flourishing",
              label: "Flourishing",
              detail: "Outcome measured in the study.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e1", "e3"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 1,
            },
            {
              id: "covariates",
              label: "Measured covariates",
              detail: "Included in the adjusted statistical model.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e1", "e3"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 2,
            },
          ],
          edges: [
            {
              from: "experience",
              to: "flourishing",
              label: "modelled association",
              at: "setup",
            },
            {
              from: "covariates",
              to: "flourishing",
              label: "adjustment",
              at: "setup",
            },
          ],
        },
        options: [
          {
            id: "opt_distractor1",
            text: "Increase the same-wave sample and treat a smaller p-value as proof of temporal order.",
          },
          {
            id: "opt_distractor2",
            text: "Remove all covariates and treat the unadjusted correlation as an intervention effect.",
          },
          {
            id: "opt_correct",
            text: "Measure both repeatedly to examine temporal order, while still considering confounding.",
          },
        ],
        accepted: ["opt_correct"],
        alternatives: [],
        hint: "Which proposal adds information about ordering rather than simply more same-wave observations?",
        misconceptions: {
          opt_distractor1:
            "More cross-sectional observations do not establish what changed first.",
          opt_distractor2:
            "Dropping adjustment does not create randomized exposure or temporal information.",
        },
        explanation:
          "Repeated observations would improve evidence about temporal order. Longitudinal measurement alone would still not automatically establish causality.",
        refs: ["r1", "e1", "e3"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "Positive online experiences and inspiration from others were positively associated with flourishing, and negative experiences inversely associated, after adjustment. Inspiration for others was at the reported correction boundary. The full model, including the covariates, had R² = .553; this is not the contribution of social media alone. Direction and causality remain unresolved.",
};
