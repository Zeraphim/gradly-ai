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
        stage: "Read the design",
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
            id: "o2",
            text: "To remove appearance differences that make the postures harder to recognise accurately.",
          },
          {
            id: "o1",
            text: "So that ratings reflect posture, not faces or clothing that could suggest status or leadership.",
          },
          {
            id: "o3",
            text: "To standardise the images so participants could infer each model's professional role.",
          },
          {
            id: "o4",
            text: "To ensure the only remaining difference between photos was the poser's gender.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What else in a photo could make someone look more or less capable?",
        misconceptions: {
          o2: "The aim concerns judgements of the poser, not a posture-recognition task.",
          o3: "The clothes and blurred faces reduce such status cues rather than supplying them.",
          o4: "Posture also varied; gender was not the sole remaining difference.",
        },
        explanation:
          "Faces were blurred to avoid confounding effects such as inferring leadership quality from facial features, and clothing was kept plain, so that posture is the main cue that differs.",
        refs: ["e1", "e2", "e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
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
            id: "o2",
            text: "It reduces hypothesis-guessing while preserving the same contrasts as side-by-side viewing.",
          },
          {
            id: "o3",
            text: "It tests changes within each rater by showing that rater every gender and posture combination.",
          },
          {
            id: "o4",
            text: "It reproduces candidate comparison in interviews by keeping each photo on a separate page.",
          },
          {
            id: "o1",
            text: "It avoids direct comparisons that could reveal the hypothesis, but it may also hide contrast effects that appear when people compare candidates side by side.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What happens when you judge two people side by side rather than one after another?",
        misconceptions: {
          o2: "Seeing only one category removes the direct comparisons that side-by-side viewing allows.",
          o3: "Each participant saw one poser gender and one posture category.",
          o4: "A brief isolated photo judgement is not an interview or a direct candidate comparison.",
        },
        explanation:
          "The authors note that posers were assessed one after the other without instructions to compare them, which could have prevented a contrast effect such as women being judged colder when they look more competent.",
        refs: ["e4", "e5"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
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
              optionId: "o1",
              label: "Posture far larger",
              targetIds: ["high", "low", "female", "male"],
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
            id: "o2",
            text: "The gaps matter equally because each passes the same statistical significance threshold.",
          },
          {
            id: "o3",
            text: "Gender matters more because women received higher competence ratings.",
          },
          {
            id: "o1",
            text: "Posture has the larger gap; the large sample can detect even the small gender gap.",
          },
          {
            id: "o4",
            text: "The gaps are too small to detect because ratings use only six possible scale points.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the size of the two gaps, then ask what a very large sample does to small gaps.",
        misconceptions: {
          o2: "Significance does not measure the size of a difference.",
          o3: "Which group is higher does not establish which gap is larger.",
          o4: "The reported tests detected both gaps; scale width does not prevent detection.",
        },
        explanation:
          "High-power posers were rated 4.01 against 3.08 (ηp² = 0.290), while women were rated only slightly higher than men (3.59 against 3.48, ηp² = 0.008). In a sample this large, small effects become significant, so size matters more than the p-value.",
        refs: ["e6", "e7", "e8", "e9"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
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
            text: "Neither gender showed a clear warmth penalty from the powerful posture here.",
          },
          {
            id: "o2",
            text: "Women showed a warmth penalty from powerful poses, while men's warmth stayed stable.",
          },
          {
            id: "o3",
            text: "Both genders gained warmth from powerful poses, alongside the competence advantage.",
          },
          {
            id: "o4",
            text: "Neither gender can face a warmth penalty from posture in other social settings.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which test speaks to “women differently from men”?",
        misconceptions: {
          o2: "The warmth tests did not establish the predicted backlash for women.",
          o3: "The competence effect does not imply a warmth effect.",
          o4: "These null results do not rule out backlash in other settings.",
        },
        explanation:
          "There was no main effect of posture on warmth and no posture × gender interaction, so the predicted backlash did not appear in this design.",
        refs: ["e10", "e11"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
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
            text: "A modest shift within the unlikely range; consider it alongside the other ratings.",
          },
          {
            id: "o2",
            text: "A shift large enough to move the average judgement into the likely-contempt range.",
          },
          {
            id: "o3",
            text: "An uninformative shift because an unexpected finding cannot count as evidence.",
          },
          {
            id: "o4",
            text: "A shift that cancels the competence benefit because both use comparable rating scales.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Where on the 1-to-7 scale do both averages fall?",
        misconceptions: {
          o2: "Both means remain in the unlikely range of the scale.",
          o3: "Unexpected findings deserve caution, not automatic dismissal.",
          o4: "The two outcomes are distinct and cannot simply be subtracted to find a net benefit.",
        },
        explanation:
          "Contrary to predictions, high-power posers drew higher contempt ratings, but the authors note the ratings were predominantly in the unlikely range, so contempt may not be a major concern.",
        refs: ["e12", "e13", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
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
            id: "o2",
            text: "The large sample makes photo judgements a direct estimate of interview hiring outcomes.",
          },
          {
            id: "o3",
            text: "The competence effect is too uncertain to interpret because the models' faces were blurred.",
          },
          {
            id: "o4",
            text: "The main concern is gender coverage, since only male models appeared in the photographs.",
          },
          {
            id: "o1",
            text: "Brief blurred photos omit the faces, speech and candidate comparisons present in interviews.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How similar is a 15-second blurred photo to sitting in a real interview?",
        misconceptions: {
          o2: "More raters do not turn the measured outcome into a different one.",
          o3: "Blurring reduces facial cues; it does not erase the observed posture association.",
          o4: "The study included male and female posers.",
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
