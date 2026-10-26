// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/rennung-2016-power-pose-backlash.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about isolating posture, one condition each, effect size in a large sample, the backlash test, contempt and transfer.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-body-posture-judgments",
    title: "Design Identification",
    briefing:
      "People rated photos of men and women in open or closed postures. Decide how to isolate posture, how to read effects in a very large sample, and how far photo ratings reach.",
    source: "generated",
    paper: {
      title: "To Strike a Pose: No Stereotype Backlash for Power Posing Women",
      authors: "Rennung, Blum & Göritz (2016)",
      journal: "Frontiers in Psychology 7: 1463",
      url: "https://doi.org/10.3389/fpsyg.2016.01463",
      limitations: [
        "Ratings came from blurred photographs shown for 15 seconds, not from real interactions.",
        "Each participant rated posers one after another without comparing them, which may have prevented contrast effects.",
        "Only six young models (aged 30 or under) posed.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 4,
        excerpt:
          "In total, three male and three female models were photographed beforehand, each model posing in seven postures.",
      },
      {
        id: "e2",
        page: 4,
        excerpt:
          "All faces were blurred to avoid confounding effects (e.g., inference of leadership quality based on facial features; Fruhen et al., 2015; van Vugt and Grabo, 2015).",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "Each model was dressed in unostentatious clothes, that is, black shoes, black trousers, and a gray shirt.",
      },
      {
        id: "e4",
        page: 3,
        excerpt:
          "In a 2 (power of posture: high vs. low) × 2 (gender of poser: female vs. male) between-subjects design, participants rated pictures of either female or male persons who adopted either high-power or low-power postures.",
      },
      {
        id: "e5",
        page: 9,
        excerpt:
          "Although participants rated three different posers in our experiment, the facts that the posers were assessed one after the other and instructions did not require participants to compare the posers could have prevented a contrast effect.",
      },
      {
        id: "e6",
        page: 6,
        excerpt:
          "Participants assigned higher competence ratings to high-power posers (M = 4.01, SD = 0.70) compared to low-power posers (M = 3.08, SD = 0.75).",
      },
      {
        id: "e7",
        page: 6,
        excerpt:
          "There was a significant main effect of power, F(1,2469) = 1006.89, p < 0.001, η2 p = 0.290, 90% CI [0.266; 0.313].",
      },
      {
        id: "e8",
        page: 6,
        excerpt:
          "Additionally, there was a small but significant main effect of gender, F(1,2469) = 18.70, p < 0.001, η2 p = 0.008, 90% CI [0.003; 0.014],",
      },
      {
        id: "e9",
        page: 6,
        excerpt:
          "with participants granting slightly higher competence ratings to female posers (M = 3.59, SD = 0.86) than to male posers (M = 3.48, SD = 0.87).",
      },
      {
        id: "e10",
        page: 6,
        excerpt:
          "Warmth There was no main effect of power, F(1,2469) = 0.74, p = 0.39,",
      },
      {
        id: "e11",
        page: 7,
        excerpt:
          "Contrary to H3, the Power × Gender interaction did not reach statistical significance, F(1,2469) = 1.36, p = 0.24 (Figure 4).",
      },
      {
        id: "e12",
        page: 8,
        excerpt:
          "Contrary to predictions, the direction of the effect was such that high- power posers (M = 3.11, SD = 1.16) elicited higher contempt ratings than low-power posers (M = 2.68, SD = 1.16).",
      },
      {
        id: "e13",
        page: 9,
        excerpt:
          "Because contempt ratings were predominately located in the unlikely range of the scale even in the high-power conditions, elicited contempt may not be a major concern though.",
      },
      {
        id: "e14",
        page: 4,
        excerpt:
          "Emotional reactions were assessed by asking participants to rate the likelihood that the depicted person would elicit feelings of admiration, envy, pity, and contempt in most people, using a seven-point Likert scale (1 = extremely unlikely, 7 = extremely likely).",
      },
      {
        id: "e15",
        page: 4,
        excerpt:
          "To ensure that participants based their ratings on their first impression of the depicted models, we displayed each photograph for 15 s.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "Isolating Posture",
        type: "single",
        prompt:
          "Every model wore the same plain clothes, and every face was blurred. Why?",
        evidence: [
          "Three men and three women were each photographed in several postures.",
          "Participants judged how competent and warm each person seemed.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "So that ratings reflect posture, not faces or clothing that could suggest status or leadership.",
          },
          {
            id: "o2",
            text: "To keep the models' identities private.",
          },
          {
            id: "o3",
            text: "To make the photos load faster online.",
          },
          {
            id: "o4",
            text: "So that participants could not tell men from women.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What else in a photo could make someone look more or less capable?",
        misconceptions: {
          o2: "Privacy may be a side benefit, but the stated aim is to avoid confounding cues.",
          o3: "Blurring and clothing do not concern loading speed.",
          o4: "The gender of the poser was meant to be visible; it was one of the factors.",
        },
        explanation:
          "Faces were blurred to avoid confounding effects such as inferring leadership quality from facial features, and clothing was kept plain, so that posture is the main cue that differs.",
        refs: ["e1", "e2", "e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "One Condition Each",
        type: "single",
        prompt:
          "Each participant saw posers of only one gender in only one kind of posture, one photo at a time. What does that choice make less likely, and what might it hide?",
        evidence: [
          "Four groups: women or men, in high-power or low-power postures.",
          "Participants rated three posers in sequence and were not asked to compare them.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It avoids direct comparisons that could reveal the hypothesis, but it may also hide contrast effects that appear when people compare candidates side by side.",
          },
          {
            id: "o2",
            text: "It makes the study within-subjects.",
          },
          {
            id: "o3",
            text: "It guarantees the same result as real job interviews.",
          },
          {
            id: "o4",
            text: "It reduces the sample needed.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What happens when you judge two people side by side rather than one after another?",
        misconceptions: {
          o2: "Each participant saw one condition, which is between-subjects.",
          o3: "Real situations often involve comparing people; that is exactly what this design avoided.",
          o4: "Between-subjects designs usually need more participants, not fewer.",
        },
        explanation:
          "The authors note that posers were assessed one after the other without instructions to compare them, which could have prevented a contrast effect such as women being judged colder when they look more competent.",
        refs: ["e4", "e5"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "Posture Against Gender",
        type: "single",
        prompt:
          "Both posture and the poser's gender had significant effects on competence ratings. Which one matters more, and why are both significant?",
        evidence: [
          "Competence rated on a 1-to-6 scale.",
          "2,473 participants.",
          "Effect sizes (ηp²): posture 0.290, gender 0.008.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Competence ratings",
          instruction: "Compare the gap for posture with the gap for gender.",
          description:
            "Mean competence ratings by posture and by poser gender, on a 1-to-6 scale.",
          provenance: {
            kind: "reported",
            refs: ["e6", "e9"],
            note: "Means as printed in the results.",
          },
          measure: "Competence rating",
          unit: "points",
          decimals: 2,
          min: 1,
          max: 6,
          values: [
            {
              id: "high",
              label: "High-power posture",
              detail: "All posers.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in the results.",
              },
              value: 4.01,
            },
            {
              id: "low",
              label: "Low-power posture",
              detail: "All posers.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Mean as printed in the results.",
              },
              value: 3.08,
            },
            {
              id: "female",
              label: "Female posers",
              detail: "Both postures.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e9"],
                note: "Mean as printed in the results.",
              },
              value: 3.59,
            },
            {
              id: "male",
              label: "Male posers",
              detail: "Both postures.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e9"],
                note: "Mean as printed in the results.",
              },
              value: 3.48,
            },
          ],
          difference: {
            from: "low",
            to: "high",
            label: "Posture gap: 0.93 points",
            at: "feedback",
          },
          prediction: null,
          resolution: null,
          responses: [
            {
              optionId: "o1",
              label: "Posture far larger",
              targetIds: ["high", "low", "female", "male"],
            },
            {
              optionId: "o2",
              label: "Equal",
              targetIds: ["high", "low", "female", "male"],
            },
            {
              optionId: "o3",
              label: "Gender larger",
              targetIds: ["female", "male"],
            },
            {
              optionId: "o4",
              label: "Neither",
              targetIds: [],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "Posture, by far: almost a point against about a tenth of a point. With 2,473 participants, even a tiny gender difference reaches significance.",
          },
          {
            id: "o2",
            text: "They matter equally, since both are significant.",
          },
          {
            id: "o3",
            text: "Gender matters more, since women were rated higher.",
          },
          {
            id: "o4",
            text: "Neither matters, since the scale is only 1 to 6.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the size of the two gaps, then ask what a very large sample does to small gaps.",
        misconceptions: {
          o2: "Significance does not show size; posture's effect size was 0.290 against 0.008.",
          o3: "The gender gap was 0.11 points; the posture gap was 0.93.",
          o4: "A gap of almost a point on a 6-point scale is large.",
        },
        explanation:
          "High-power posers were rated 4.01 against 3.08 (ηp² = 0.290), while women were rated only slightly higher than men (3.59 against 3.48, ηp² = 0.008). In a sample this large, small effects become significant, so size matters more than the p-value.",
        refs: ["e6", "e7", "e8", "e9"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "A Backlash for Women?",
        type: "single",
        prompt:
          "The team expected women in powerful poses to be rated as less warm. Reading the warmth tests, what did they find?",
        evidence: [
          "Warmth, effect of posture: F = 0.74, p = .39.",
          "Warmth, posture × gender interaction: F = 1.36, p = .24.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "No backlash: posture did not change warmth ratings, for women or for men.",
          },
          {
            id: "o2",
            text: "A backlash: powerful-posing women were rated much colder.",
          },
          {
            id: "o3",
            text: "Powerful postures made everyone warmer.",
          },
          {
            id: "o4",
            text: "The result proves a backlash can never happen.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which test speaks to “women differently from men”?",
        misconceptions: {
          o2: "The interaction was not significant (p = .24), so there was no sign of that pattern.",
          o3: "Posture had no significant effect on warmth (p = .39).",
          o4: "A non-significant interaction in one design, which avoided comparisons, cannot rule it out everywhere.",
        },
        explanation:
          "There was no main effect of posture on warmth and no posture × gender interaction, so the predicted backlash did not appear in this design.",
        refs: ["e10", "e11"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "More Contempt",
        type: "single",
        prompt:
          "Unexpectedly, powerful posers were rated as more likely to draw contempt: 3.11 against 2.68 on a 1-to-7 likelihood scale. How should a job-seeker read this?",
        evidence: [
          "Contempt was rated as the likelihood that most people would feel it.",
          "1 = extremely unlikely, 7 = extremely likely.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "A real but modest shift that stayed in the “unlikely” range of the scale; worth knowing, not alarming.",
          },
          {
            id: "o2",
            text: "Power posing makes most people feel contempt.",
          },
          {
            id: "o3",
            text: "The result can be ignored because it was unexpected.",
          },
          {
            id: "o4",
            text: "It shows power posing has no benefits.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Where on the 1-to-7 scale do both averages fall?",
        misconceptions: {
          o2: "Both averages sit below the scale midpoint, in the unlikely range.",
          o3: "Unexpected results still count; the authors report it and suggest it deserves follow-up.",
          o4: "Powerful posers were also rated more competent and more admired.",
        },
        explanation:
          "Contrary to predictions, high-power posers drew higher contempt ratings, but the authors note the ratings were predominantly in the unlikely range, so contempt may not be a major concern.",
        refs: ["e12", "e13", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "From Photos to Interviews",
        type: "single",
        prompt:
          "A career coach tells clients to sit expansively in interviews, citing this study. What is the main caution?",
        evidence: [
          "Each blurred photo was shown for 15 seconds.",
          "Raters judged posers one after another without comparing them.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The study used brief, blurred photos judged one at a time; real interviews involve faces, speech and comparison between candidates, where results could differ.",
          },
          {
            id: "o2",
            text: "None: 2,473 participants make the result certain for interviews.",
          },
          {
            id: "o3",
            text: "The study shows posture has no effect on impressions.",
          },
          {
            id: "o4",
            text: "The caution is only that the models were men.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How similar is a 15-second blurred photo to sitting in a real interview?",
        misconceptions: {
          o2: "A large sample makes estimates precise for this task, not for a different setting.",
          o3: "Posture strongly affected competence ratings in the photos.",
          o4: "There were three men and three women.",
        },
        explanation:
          "Ratings came from first impressions of blurred photographs shown for 15 seconds, without comparison between posers. Interviews add faces, speech and direct comparison, which could change the effects.",
        refs: ["e5", "e15"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In an online experiment with 2,473 people, blurred photos of men and women in open postures were rated as much more competent and admired, and slightly more likely to draw envy and contempt, than closed postures. Posture did not change warmth for either gender. The photo-rating task differs from real encounters, so the results may not transfer directly.",
};
