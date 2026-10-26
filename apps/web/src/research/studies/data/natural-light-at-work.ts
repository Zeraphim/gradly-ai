// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/an-2016-nature-sunlight-work.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about single-source data, merging countries, four outcomes, an unexpected sign and policy reach.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-natural-light-at-work",
    title:
      "Why We Need More Nature at Work: Design, Results, and Interpretation",
    briefing:
      "Decide what an online survey of workers can show about plants, pictures and sunlight at work, and how far its advice can go.",
    source: "generated",
    paper: {
      title:
        "Why We Need More Nature at Work: Effects of Natural Elements and Sunlight on Employee Mental Health and Work Attitudes",
      authors: "An, Colarelli, O'Brien & Boyajian (2016)",
      journal: "PLOS ONE 11(5): e0155614",
      url: "https://doi.org/10.1371/journal.pone.0155614",
      limitations: [
        "The design was cross-sectional, so causal conclusions cannot be drawn.",
        "All measures were self-reported by the same people in one survey.",
        "Workers were online panel members from the United States and India.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 5,
        excerpt:
          "Respondents were asked to indicate the extent to which they agreed to each statement, for example, “There are potted plants in my workspace”",
      },
      {
        id: "e2",
        page: 13,
        excerpt: "We also used self-reported, single source data.",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "Data were collected from a bi-national sample from the United States and India.",
      },
      {
        id: "e4",
        page: 6,
        excerpt:
          "The results of multi-group CFAs for exposure to sun- light and natural elements, however, found that both the US and Indian samples had approxi- mately the same strength between items and their latent constructs, thereby justifying merging the groups into a single sample.",
      },
      {
        id: "e5",
        page: 7,
        excerpt:
          "Depression Sex a -.04 -.05 .02** .05** Age -.15** -.17** Natural elements -.17** .03** Anxiety Sex -.17** -.17** .04** .04** Age -.13** -.14** Natural elements -.03 .00 Job satisfaction Sex -.09 -.07 .00 .14** Age .02 .06 Natural elements .37** .13** Organizational commitment Sex -.03 -.00 .01 .09** Age .11* .14** Natural elements .30** .09**",
      },
      {
        id: "e6",
        page: 10,
        excerpt:
          "Contrary to our expectations, natural elements exposure did not have a direct effect on anxiety,",
      },
      {
        id: "e7",
        page: 8,
        excerpt:
          "Hypothesis 4 stated that sunlight exposure (i.e., direct sunlight and indirect sunlight) would be negatively related to depressed mood and anxiety and positively related to work attitudes.",
      },
      {
        id: "e8",
        page: 8,
        excerpt:
          "Direct sunlight was positively related to anxiety (β = .21, p < .01), job satisfaction (β = .20, p < .01), and organizational commitment (β = .18, p < .01).",
      },
      {
        id: "e9",
        page: 13,
        excerpt:
          "We used a cross-sectional design, which precludes the ability to draw causal inferences.",
      },
      {
        id: "e10",
        page: 9,
        excerpt:
          "The overall R 2s accounted for by the three predictors were .06 for depression, .07 for anxiety, .20 for job satisfaction, and .14 for organizational commitment.",
      },
      {
        id: "e11",
        page: 13,
        excerpt:
          "These small and inexpensive changes could result in noticeably better mental health and work attitudes.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "One Survey, One Source",
        type: "single",
        prompt:
          "Workers rated how many plants and nature pictures they had, and in the same survey rated their mood and job satisfaction. What problem can that create?",
        evidence: [
          "Nature exposure: agreement with statements such as “There are potted plants in my workspace”.",
          "Mood, anxiety, job satisfaction and commitment: questionnaires in the same online survey.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "A person's general outlook could colour both how they describe their workspace and how they rate their mood and job, making the links look stronger than they are.",
          },
          {
            id: "o2",
            text: "None, because questionnaires are always accurate.",
          },
          {
            id: "o3",
            text: "It makes the links look weaker than they are, always.",
          },
          {
            id: "o4",
            text: "It means plants were not actually present.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If someone feels good, might they also describe their surroundings more positively?",
        misconceptions: {
          o2: "Self-reports from one source can share biases; the authors list this as a limitation.",
          o3: "Shared biases usually inflate links between self-reported measures, not weaken them.",
          o4: "The issue is how the ratings relate to each other, not whether plants existed.",
        },
        explanation:
          "The authors note they used self-reported, single-source data, which can produce common method variance: shared response tendencies that inflate associations between measures.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "Two Countries, One Sample",
        type: "single",
        prompt:
          "Before merging workers from the United States and India into one sample, the team checked that the questionnaire items worked the same way in both. Why?",
        evidence: [
          "Workers came from two countries with different economies and workplaces.",
          "The same nature and sunlight items were used in both.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "So that a given score means roughly the same thing in both countries; otherwise merging would mix measures that are not comparable.",
          },
          {
            id: "o2",
            text: "To make the two countries' average scores identical.",
          },
          {
            id: "o3",
            text: "To double the effect sizes.",
          },
          {
            id: "o4",
            text: "To prove the results apply to every country.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Can you add up scores from two groups if the questions meant different things to each?",
        misconceptions: {
          o2: "The check concerns how items relate to what they measure, not equal averages.",
          o3: "Merging does not change effect sizes by design.",
          o4: "Two countries cannot show that; the check only justifies combining these two.",
        },
        explanation:
          "Multi-group analyses showed the items related to their constructs with approximately the same strength in both samples, which the authors used to justify merging them.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "Which Outcomes Moved?",
        type: "single",
        prompt:
          "Exposure to natural elements was used to predict four outcomes. Which statement fits the coefficients?",
        evidence: [
          "Standardised coefficients controlling for age and sex.",
          "Negative means less of the outcome with more nature exposure.",
        ],
        scene: {
          version: 1,
          kind: "association",
          title: "Natural elements and four outcomes",
          instruction:
            "Read each coefficient, then choose the statement that fits all four.",
          description:
            "Standardised coefficients for exposure to natural elements, controlling for age and sex.",
          provenance: {
            kind: "reported",
            refs: ["e5"],
            note: "Coefficients as printed in Table 2.",
          },
          pairs: [
            {
              id: "dep",
              label: "Depressed mood",
              detail: "Controlling for age and sex.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Standardised coefficient as printed in Table 2.",
              },
              x: "Exposure to natural elements",
              y: "Depressed mood",
              statistic: "beta",
              value: -0.17,
            },
            {
              id: "anx",
              label: "Anxiety",
              detail: "Controlling for age and sex.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Standardised coefficient as printed in Table 2.",
              },
              x: "Exposure to natural elements",
              y: "Anxiety",
              statistic: "beta",
              value: -0.03,
            },
            {
              id: "sat",
              label: "Job satisfaction",
              detail: "Controlling for age and sex.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Standardised coefficient as printed in Table 2.",
              },
              x: "Exposure to natural elements",
              y: "Job satisfaction",
              statistic: "beta",
              value: 0.37,
            },
            {
              id: "com",
              label: "Organisational commitment",
              detail: "Controlling for age and sex.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Standardised coefficient as printed in Table 2.",
              },
              x: "Exposure to natural elements",
              y: "Organisational commitment",
              statistic: "beta",
              value: 0.3,
            },
          ],
          resolution: {
            id: "resolution",
            label: "Three outcomes, not anxiety",
            detail:
              "Nature exposure went with better job attitudes and lower depressed mood, but its coefficient for anxiety was near zero.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e5", "e6"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "Not anxiety",
              targetIds: ["dep", "anx", "sat", "com"],
            },
            {
              optionId: "o2",
              label: "All four",
              targetIds: ["dep", "anx", "sat", "com"],
            },
            {
              optionId: "o3",
              label: "Mood only",
              targetIds: ["dep", "anx"],
            },
            {
              optionId: "o4",
              label: "None",
              targetIds: [],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "Nature exposure went with higher job satisfaction and commitment and lower depressed mood, but not with anxiety.",
          },
          {
            id: "o2",
            text: "Nature exposure went with lower depressed mood and lower anxiety, and better job attitudes.",
          },
          {
            id: "o3",
            text: "Nature exposure only mattered for mood, not for job attitudes.",
          },
          {
            id: "o4",
            text: "Nature exposure was unrelated to every outcome.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Check which coefficient is close to zero.",
        misconceptions: {
          o2: "The anxiety coefficient was −.03 and not significant.",
          o3: "The largest coefficients were for job satisfaction (.37) and commitment (.30).",
          o4: "Three of the four coefficients were significant.",
        },
        explanation:
          "The coefficients were −.17 for depressed mood, .37 for job satisfaction and .30 for commitment, all significant, but −.03 for anxiety. The authors note that, contrary to their expectations, natural elements had no direct effect on anxiety.",
        refs: ["e5", "e6"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "Sunlight and Anxiety",
        type: "single",
        prompt:
          "The team predicted that sunlight would go with less anxiety. For direct sunlight from being outside during work, the coefficient for anxiety was +.21. What is the best reading?",
        evidence: [
          "Direct sunlight: items about being exposed to sunlight while outside at work.",
          "Coefficient for anxiety: β = .21, p < .01, controlling for age and sex.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It goes against the prediction: more direct sunlight went with more anxiety, and a one-time survey cannot say why.",
          },
          {
            id: "o2",
            text: "It supports the prediction, since the result is significant.",
          },
          {
            id: "o3",
            text: "It shows that direct sunlight causes anxiety.",
          },
          {
            id: "o4",
            text: "It is too small to mean anything.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the sign of the coefficient with the direction the team predicted.",
        misconceptions: {
          o2: "Significance is not direction; a positive coefficient means more anxiety, not less.",
          o3: "A cross-sectional association cannot show cause; jobs that keep people outdoors might differ in other ways.",
          o4: "It is significant and the largest predictor of anxiety among the three exposures.",
        },
        explanation:
          "The hypothesis was that sunlight would relate negatively to anxiety, but direct sunlight related positively (β = .21). The study design cannot tell whether sunlight, outdoor work or something else explains it.",
        refs: ["e7", "e8"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "Plants for Everyone?",
        type: "single",
        prompt:
          "The authors suggest that cheap changes such as office plants “could result in noticeably better mental health”. How well does this study support that?",
        evidence: [
          "Natural elements and both kinds of sunlight together explained 6% of the variance in depressed mood and 7% in anxiety.",
          "All data came from one online survey.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Weakly: the links were cross-sectional, self-reported and modest for mental health; an experiment adding plants would be needed to show improvement.",
          },
          {
            id: "o2",
            text: "Strongly: the study shows plants improve mental health.",
          },
          {
            id: "o3",
            text: "Not at all: the study found no link with depressed mood.",
          },
          {
            id: "o4",
            text: "Strongly, because the sample covered two countries.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the advice with the design and with how much of mood the exposures explained.",
        misconceptions: {
          o2: "Cross-sectional data cannot show improvement; the authors list this limitation themselves.",
          o3: "There was a link with depressed mood (β = −.17), but it was modest.",
          o4: "Two countries widen the sample but do not turn associations into effects.",
        },
        explanation:
          "The authors acknowledge that the cross-sectional design precludes causal inference and that data were self-reported from one source. Exposures explained only 6% of depressed mood. The policy suggestion goes beyond what the design can show.",
        refs: ["e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In an online survey of 444 workers in the United States and India, reported exposure to plants, nature pictures and sunlight went with better job attitudes and somewhat lower depressed mood, but natural elements were unrelated to anxiety and direct sunlight went with more anxiety. The data are cross-sectional and self-reported, so the study cannot show that adding nature improves mental health.",
};
