// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/bonsaksen-2025-social-media-sleep-problems.pdf
// Revised 26 October 2026: answers were copied from the evidence lines; now decisions about recruitment, bands, adjustment, comparing odds ratios, wording and follow-up.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-social-media-and-sleep",
    title:
      "Interpreting a Cross‑National Study of Social Media Use and Sleep Problems",
    briefing:
      "A survey of adults in four countries asked about social media time and sleep. Decide who such a survey reaches, read what happens to a link when other factors are added, and judge how far the answer goes.",
    source: "generated",
    paper: {
      title:
        "Sleep problems were unrelated to social media use in the late COVID-19 pandemic phase: A cross-national study",
      authors: "Bonsaksen, Price, Lamph et al. (2025)",
      journal: "PLOS ONE 20(1): e0318507",
      url: "https://doi.org/10.1371/journal.pone.0318507",
      limitations: [
        "The survey was cross-sectional, so it cannot show cause and effect.",
        "Participants were recruited through social media and were mostly women, so the sample is best described as users of social media.",
        "Only total time on social media was recorded, not which platforms, why, or when they were used.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 3,
        excerpt:
          "Information about the study was disseminated through several social media channels, including Facebook, Twitter, and LinkedIn, and post- ings on these social media included a direct link to the survey website.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "The survey relied on convenience sampling by self-selection and recruited a total number of 1649 participants.",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "There was a larger proportion of females than males (n = 1105, 78.6% versus n = 300, 21.4%).",
      },
      {
        id: "e4",
        page: 8,
        excerpt:
          "Thus, the population should be specified as ‘users of social media’ as a subset of the general population.",
      },
      {
        id: "e5",
        page: 4,
        excerpt:
          "response options were less than 10 minutes, 10–30 minutes, 31–60 minutes, 1–2 hours, 2–3 hours, and more than three hours.",
      },
      {
        id: "e6",
        page: 7,
        excerpt:
          "Note. On continuous variables, OR refers to the change in likelihood for having sleep problems for each unit increase in the predictor variable.",
      },
      {
        id: "e7",
        page: 4,
        excerpt:
          "Sleep problems was assessed with the following question: “In the past weeks, do you have difficulty sleeping?”",
      },
      {
        id: "e8",
        page: 7,
        excerpt: "Female 1.91 1.48–2.47 <0.001 1.69 1.27–2.25 <0.001",
      },
      {
        id: "e9",
        page: 7,
        excerpt:
          "GHQ scores 1.20 1.17–1.23 <0.001 1.20 1.17–1.23 <0.001 Time on social media 1.17 1.08–1.27 <0.001 1.06 0.96–1.16 0.25",
      },
      {
        id: "e10",
        page: 5,
        excerpt:
          "Time spent on social media was no longer significantly associated with sleep problems after adjustment (OR: 1.06, ns).",
      },
      {
        id: "e11",
        page: 6,
        excerpt:
          "this relationship was likely the result of one or more variables being related to both social media use and sleep problems (confounding).",
      },
      {
        id: "e12",
        page: 4,
        excerpt: "(possible score range 0–36)",
      },
      {
        id: "e13",
        page: 8,
        excerpt:
          "The study had a cross-sectional design, thus the results cannot be used to imply cause and effect relationships.",
      },
      {
        id: "e14",
        page: 8,
        excerpt:
          "We do not have information about the specific social media people used, and we do not know how, why, or when they were used, since this study only collected data on time spent using social media.",
      },
      {
        id: "e15",
        page: 1,
        excerpt:
          "other aspects of social media use (eg, time of the day, content of interactions, associated stress experience) may be more relevant for understanding sleep problems",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "Who Sees the Survey?",
        type: "single",
        prompt:
          "The survey was advertised on Facebook, Twitter and LinkedIn, and 78.6% of respondents were women. Why is that a problem for a study of social media use?",
        evidence: [
          "Invitations were posted on social media with a link to the survey.",
          "Participants chose themselves; 1,649 took part, 1,405 were analysed.",
          "Women were 78.6% of the analysed sample.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Only people who already use social media can be reached, and the sample is skewed, so it describes users of social media rather than all adults.",
          },
          {
            id: "o2",
            text: "It makes the sample random, which is a strength.",
          },
          {
            id: "o3",
            text: "It only matters for the oldest age groups.",
          },
          {
            id: "o4",
            text: "It has no effect because the sample is large.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who cannot possibly answer a survey that is advertised only on social media?",
        misconceptions: {
          o2: "Self-selection from a social media invitation is the opposite of random sampling.",
          o3: "The skew covers who can be reached at all, not just age.",
          o4: "A large self-selected sample is still self-selected.",
        },
        explanation:
          "The authors say the population should be described as users of social media, a subset of the general population, and that the sample is skewed in age, gender and education, limiting how far results transfer.",
        refs: ["e1", "e2", "e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "Bands, Not Hours",
        type: "single",
        prompt:
          "Social media time was recorded in six bands, from under 10 minutes to over three hours. What does an odds ratio of 1.17 per “unit” of social media time refer to?",
        evidence: [
          "Bands: under 10 min, 10–30 min, 31–60 min, 1–2 h, 2–3 h, over 3 h.",
          "For continuous variables, the odds ratio is for each unit increase in the predictor.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "A one-step move up the bands, for example from 1–2 hours to 2–3 hours, not a rise of one hour.",
          },
          {
            id: "o2",
            text: "One extra hour on social media each day.",
          },
          {
            id: "o3",
            text: "One extra minute of daily use.",
          },
          {
            id: "o4",
            text: "A comparison between users and non-users.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Look at how the answer options were set out.",
        misconceptions: {
          o2: "The measure was not hours; it was six bands of unequal width.",
          o3: "Minutes were not recorded.",
          o4: "Everyone in the sample used social media at least some of the time.",
        },
        explanation:
          "Each unit is one step on the six-band scale, and the bands are of unequal width. The result describes a step up in the bands, not a fixed number of hours.",
        refs: ["e5", "e6"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "Adding Other Factors",
        type: "single",
        prompt:
          "Before adjustment, more social media time went with more sleep problems. After adjusting for age, gender, employment and distress, what happened to that link?",
        evidence: [
          "Odds ratios for having sleep problems, with 95% intervals.",
          "An odds ratio of 1 means no difference in the odds.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Social media and sleep problems",
          instruction:
            "Compare the interval for social media time before and after adjustment, then choose the best reading.",
          description:
            "Odds ratios for sleep problems with 95% confidence intervals; 1 means no association.",
          provenance: {
            kind: "reported",
            refs: ["e8", "e9"],
            note: "Odds ratios and intervals as printed in the regression table.",
          },
          measure: "Odds ratio",
          min: 0.8,
          max: 2.6,
          reference: {
            value: 1,
            label: "No association",
          },
          band: null,
          estimates: [
            {
              id: "sm-un",
              label: "Social media, unadjusted",
              detail: "Per step on the six time bands.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e9"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 1.17,
              lower: 1.08,
              upper: 1.27,
            },
            {
              id: "sm-adj",
              label: "Social media, adjusted",
              detail: "After age, gender, employment, distress.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e9"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 1.06,
              lower: 0.96,
              upper: 1.16,
            },
            {
              id: "distress",
              label: "Psychological distress, adjusted",
              detail: "Per point on the 0–36 scale.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e9"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 1.2,
              lower: 1.17,
              upper: 1.23,
            },
            {
              id: "female",
              label: "Female, adjusted",
              detail: "Compared with male.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e8"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 1.69,
              lower: 1.27,
              upper: 2.25,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "The link shrank and now includes 1",
            detail:
              "The social media odds ratio fell from 1.17 to 1.06 and its interval now includes 1. Gender and distress stay clear of 1.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e8", "e9"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "Shrank; other factors share it",
              targetIds: ["sm-un", "sm-adj"],
            },
            {
              optionId: "o2",
              label: "Proves no effect",
              targetIds: ["sm-adj"],
            },
            {
              optionId: "o3",
              label: "Grew stronger",
              targetIds: ["sm-adj"],
            },
            {
              optionId: "o4",
              label: "Distress irrelevant",
              targetIds: ["distress"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "It shrank from 1.17 to 1.06 and its interval now includes 1, so the earlier link was probably carried by other factors, though a small effect is not ruled out.",
          },
          {
            id: "o2",
            text: "It disappeared, which proves social media has no effect on sleep.",
          },
          {
            id: "o3",
            text: "It grew stronger once the other factors were added.",
          },
          {
            id: "o4",
            text: "Distress stopped mattering after adjustment.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the two social media intervals with each other and with the line at 1.",
        misconceptions: {
          o2: "The adjusted interval (0.96 to 1.16) still allows small effects in either direction.",
          o3: "It shrank, from 1.17 to 1.06.",
          o4: "Distress stayed clear of 1 after adjustment (1.20, 1.17 to 1.23).",
        },
        explanation:
          "Unadjusted, social media time had an odds ratio of 1.17 (1.08 to 1.27). Adjusted, it was 1.06 (0.96 to 1.16). The authors say the earlier link was likely the result of confounding, such as gender and distress.",
        refs: ["e8", "e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "Is Gender the Bigger Factor?",
        type: "single",
        prompt:
          "Female gender had an odds ratio of 1.69 and distress 1.20. A reader says gender matters more than distress. Why can't you tell from those two numbers?",
        evidence: [
          "Gender: female compared with male.",
          "Distress: a score from 0 to 36; the odds ratio is for each unit increase.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "They describe different kinds of difference: one compares two groups, the other is the change for a single step on a 36-step scale.",
          },
          {
            id: "o2",
            text: "Odds ratios can never be compared with each other.",
          },
          {
            id: "o3",
            text: "A larger number always means the factor matters less.",
          },
          {
            id: "o4",
            text: "Distress was not significant, so it cannot be compared.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What does one unit of each predictor mean?",
        misconceptions: {
          o2: "They can be, when the predictors are measured on comparable terms; these are not.",
          o3: "A larger odds ratio means a bigger difference in odds for that comparison; the issue here is that the comparisons differ.",
          o4: "Distress was clearly significant (p < 0.001).",
        },
        explanation:
          "An odds ratio of 1.20 for distress is per unit on a 0-to-36 score, so a many-point difference in distress produces a much larger change in odds than one step. Gender is a two-group comparison, so the two figures are not directly comparable.",
        refs: ["e6", "e12"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "“Unrelated”?",
        type: "single",
        prompt:
          "The paper's title says sleep problems were “unrelated” to social media use. Which wording is best supported by the study?",
        evidence: [
          "Adjusted odds ratio for social media time: 1.06, interval 0.96 to 1.16.",
          "Design: one survey; sleep measured by one yes/no question; use measured as total time.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Not significantly associated after adjustment in this sample; a cross-sectional survey with rough measures cannot rule out a small effect or an effect of how social media is used.",
          },
          {
            id: "o2",
            text: "Proven to be unrelated for everyone.",
          },
          {
            id: "o3",
            text: "Related, because the unadjusted link was significant.",
          },
          {
            id: "o4",
            text: "Not measurable, because sleep problems were not recorded.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which limits would stop you from saying 'unrelated' for everyone?",
        misconceptions: {
          o2: "A single non-significant result in a self-selected sample cannot prove no relation.",
          o3: "The unadjusted link was likely confounded; after adjustment it was not significant.",
          o4: "Sleep problems were recorded with a yes/no question, which is rough but usable.",
        },
        explanation:
          "The authors report no significant association after adjustment, but list a cross-sectional design, a social-media-recruited sample, and no information about which platforms or when and why they were used. That supports a narrower statement than 'unrelated'.",
        refs: ["e10", "e13", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "A Better Follow-Up",
        type: "single",
        prompt:
          "Which follow-up study would best address what this one could not?",
        evidence: [
          "This study recorded only total daily time on social media.",
          "The authors suggest time of day, content and stress may matter more.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Follow the same people over time, recording when in the day they use social media, what they do there and how stressful it is, alongside their sleep.",
          },
          {
            id: "o2",
            text: "Ask a larger group the same single time question.",
          },
          {
            id: "o3",
            text: "Remove psychological distress from the analysis.",
          },
          {
            id: "o4",
            text: "Survey only women, who reported more sleep problems.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which limits did the authors name, and which design would address them?",
        misconceptions: {
          o2: "More people answering the same question cannot reveal timing, content or direction.",
          o3: "Distress was strongly linked to sleep problems; removing it would reintroduce confounding.",
          o4: "That narrows the sample further and does not address timing, content or order.",
        },
        explanation:
          "The authors say other aspects of social media use, such as time of day, content of interactions and associated stress, may matter more than total hours, and that this study cannot show cause and effect. A longitudinal study with those measures fits.",
        refs: ["e13", "e14", "e15"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In a self-selected survey of 1,405 adults from four countries, social media time was linked to sleep problems before adjustment, but the link shrank to a non-significant 1.06 once age, gender, employment and distress were included, while female gender, distress, age and employment stayed linked. The design is cross-sectional with a rough time measure, so it cannot show cause or rule out a small effect.",
};
