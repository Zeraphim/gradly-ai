// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/stephens-2020-swearing-pain.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about the comparison word, order, tolerance, mechanism, equivalence and a time cap.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-cursing-while-in-pain",
    title:
      "Swearing and Pain: Investigating Hypoalgesic Effects of Novel Swear Words",
    briefing:
      "People held a hand in ice water while repeating a swear word, two made-up words or a neutral word. Decide how the comparison was built, read what changed, and judge what it says about why swearing helps.",
    source: "generated",
    paper: {
      title:
        "Swearing as a Response to Pain: Assessing Hypoalgesic Effects of Novel “Swear” Words",
      authors: "Stephens & Robertson (2020)",
      journal: "Frontiers in Psychology 11: 723",
      url: "https://doi.org/10.3389/fpsyg.2020.00723",
      limitations: [
        "Trials were capped at three minutes, and some participants reached the cap.",
        "The analyses of why swearing helps (mediation) and the equivalence tests were exploratory, not pre-registered.",
        "Pain came from a short ice-water task in a lab, with native English speakers near one university.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 3,
        excerpt:
          "Four manipulations of vocalization were employed: swearing (“fuck”); two new “swear” words; and a neutral word, which was a word chosen by the participants that describes a table (e.g., “solid”).",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "For each cold pressor trial undertaken, the participant was asked to repeat the pertinent word (“fuck,” “fouch,” “twizpipe,” or neutral word) at a normal speech volume and a steady pace, once every 3 s.",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "Condition order was randomized to counter order effects using the Microsoft Excel random number generation command “ = RAND().”",
      },
      {
        id: "e4",
        page: 6,
        excerpt:
          "Pain tolerance (s) Fuck 74.28* 57.53 69.42 79.14 – Fouch 58.44 41.32 53.59 63.3 72nd Twizpipe 52.47 33.41 47.62 57.33 70th Neutral 55.87 38.48 51.01 60.73 65th",
      },
      {
        id: "e5",
        page: 1,
        excerpt:
          "For conventional swearing (“fuck”), confirmatory analyses found a 32% increase in pain threshold and a 33% increase in pain tolerance, accompanied by increased ratings for emotion, humor, and distraction, relative to the neutral word condition.",
      },
      {
        id: "e6",
        page: 4,
        excerpt:
          "Pairwise comparisons for emotion rating showed that fuck, F(1,259.8) = 71.701, p < 0.001, fouch, F(1,259.8) = 5.781, p = 0.017, and twizpipe, F(1,259.8) = 4.658, p = 0.032, gained significantly higher ratings than the neutral word.",
      },
      {
        id: "e7",
        page: 6,
        excerpt:
          "While swearing predicted both pain tolerance, β = 18.411, 95% CI = 11.216:25.605, and emotion, β = 17.891, 95% CI = 13.143:22.640, emotion did not predict pain tolerance, β = 0.266, 95% CI = −0.070:0.602.",
      },
      {
        id: "e8",
        page: 5,
        excerpt:
          "A peer reviewer suggested running equivalence tests assessing whether the null effects for fouch and twizpipe were less than the smallest effect size of interest. These analyses were not specified in the pre-registration document and should be considered exploratory.",
      },
      {
        id: "e9",
        page: 5,
        excerpt:
          "For pain threshold, the TOST procedure indicated that the observed effect size for fouch (dz = 0.07) was significantly within the equivalent bounds of dz = −0.3 and dz = 0.3,",
      },
      {
        id: "e10",
        page: 3,
        excerpt:
          "There was a 3-minute maximum time limit, assessed via a handheld stopwatch, which was not explicitly communicated to the participants; 20 participants reached this maximum on at least one trial, while 10 participants reached it on all four trials.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "A Neutral Word to Compare",
        type: "single",
        prompt:
          "In the comparison condition, each person repeated a word describing a table, such as “solid”, at the same pace as the other words. Why that kind of comparison rather than silence?",
        evidence: [
          "Every word was repeated at normal volume, once every 3 seconds, with the hand in ice water.",
          "Each participant chose their own table word.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "So that speaking at the same rhythm is held constant and only the kind of word differs between conditions.",
          },
          {
            id: "o2",
            text: "Because silence would make the ice water colder.",
          },
          {
            id: "o3",
            text: "To make the neutral condition more painful on purpose.",
          },
          {
            id: "o4",
            text: "So that participants would not notice they were swearing.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If the comparison was silence, what else besides the word would differ?",
        misconceptions: {
          o2: "Water temperature was kept the same; the issue is what else differs between conditions.",
          o3: "The aim is a fair comparison, not to make one condition worse.",
          o4: "Participants said the words aloud and knew what they were saying.",
        },
        explanation:
          "All conditions involved repeating a word at the same steady pace, so differences in pain responses can be linked to the word itself rather than to the act of speaking.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "Four Words, Random Order",
        type: "single",
        prompt:
          "Every participant did all four words, one ice-water trial each, in a random order. Why randomise the order?",
        evidence: [
          "Each person did four ice-water trials, with a warm-water break between them.",
          "Each trial used a different word.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "So that practice, tiredness or getting used to the cold do not systematically favour whichever word came last or first.",
          },
          {
            id: "o2",
            text: "So that participants could not guess the words.",
          },
          {
            id: "o3",
            text: "To make the study shorter.",
          },
          {
            id: "o4",
            text: "Because the swear word must always come first.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Could someone handle the ice water differently on their fourth try than on their first?",
        misconceptions: {
          o2: "Participants knew which word they were saying on each trial.",
          o3: "Order does not change the length.",
          o4: "Random order means no word always comes first.",
        },
        explanation:
          "Condition order was randomised to counter order effects, so that changes across trials are spread evenly across the four words.",
        refs: ["e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "How Long Hands Stayed In",
        type: "single",
        prompt:
          "Here is how long, on average, people kept a hand in the ice water with each word. Which reading fits?",
        evidence: [
          "Seconds of tolerance, 92 participants.",
          "Comparisons were made against the neutral word.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Pain tolerance by word",
          instruction: "Compare each word with the neutral word.",
          description:
            "Mean seconds that participants kept a hand in ice water, by the word repeated.",
          provenance: {
            kind: "reported",
            refs: ["e4"],
            note: "Means as printed in Table 1.",
          },
          measure: "Seconds of tolerance",
          unit: "s",
          decimals: 1,
          min: 0,
          max: 90,
          values: [
            {
              id: "fuck",
              label: "Swear word",
              detail: "Conventional swear word.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4"],
                note: "Mean as printed in Table 1 (after Winsorising some values).",
              },
              value: 74.28,
            },
            {
              id: "fouch",
              label: "Made-up word 1",
              detail: "Chosen to carry emotion.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4"],
                note: "Mean as printed in Table 1 (after Winsorising some values).",
              },
              value: 58.44,
            },
            {
              id: "twiz",
              label: "Made-up word 2",
              detail: "Chosen to be funny or distracting.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4"],
                note: "Mean as printed in Table 1 (after Winsorising some values).",
              },
              value: 52.47,
            },
            {
              id: "neutral",
              label: "Neutral word",
              detail: "A word describing a table.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4"],
                note: "Mean as printed in Table 1 (after Winsorising some values).",
              },
              value: 55.87,
            },
          ],
          difference: {
            from: "neutral",
            to: "fuck",
            label: "Swear word: about 18 seconds longer",
            at: "feedback",
          },
          prediction: null,
          resolution: null,
          responses: [
            {
              optionId: "o1",
              label: "Only the real swear word",
              targetIds: ["fuck", "neutral"],
            },
            {
              optionId: "o2",
              label: "All three words",
              targetIds: ["fuck", "fouch", "twiz"],
            },
            {
              optionId: "o3",
              label: "Made-up words best",
              targetIds: ["fouch", "twiz"],
            },
            {
              optionId: "o4",
              label: "No differences",
              targetIds: [],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "Only the real swear word lengthened tolerance; the made-up words stayed close to the neutral word.",
          },
          {
            id: "o2",
            text: "All three non-neutral words lengthened tolerance.",
          },
          {
            id: "o3",
            text: "The made-up words worked better than the swear word.",
          },
          {
            id: "o4",
            text: "No word made any difference.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare each bar with the neutral word.",
        misconceptions: {
          o2: "The made-up words did not differ significantly from the neutral word.",
          o3: "They were close to neutral; the swear word was clearly longer.",
          o4: "The swear word was about 18 seconds longer than the neutral word, a significant difference.",
        },
        explanation:
          "With the swear word, tolerance averaged 74.28 seconds against 55.87 for the neutral word, a 33% increase. The made-up words did not differ from the neutral word.",
        refs: ["e4", "e5"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "Emotional, But No Relief",
        type: "single",
        prompt:
          "The made-up words were rated as more emotional and funnier than the neutral word, yet did not change pain tolerance. What does that suggest about how swearing helps?",
        evidence: [
          "Emotion and humour ratings were higher than neutral for all three non-neutral words.",
          "In the swear-word comparison, emotion ratings did not predict tolerance.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Raising rated emotion or humour was not enough to reduce pain, and emotion ratings did not explain the swear-word effect, so the mechanism remains open.",
          },
          {
            id: "o2",
            text: "It proves emotion is how swearing reduces pain.",
          },
          {
            id: "o3",
            text: "It shows the made-up words were not rated at all.",
          },
          {
            id: "o4",
            text: "It shows swearing does not reduce pain.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If emotion were the key, what should the made-up words have done?",
        misconceptions: {
          o2: "Emotion ratings did not predict tolerance, and the made-up words raised emotion without relief.",
          o3: "They were rated, and rated higher than the neutral word.",
          o4: "The real swear word did lengthen tolerance.",
        },
        explanation:
          "The made-up words raised emotion and humour ratings without reducing pain, and in the exploratory mediation analysis emotion ratings did not predict tolerance. Emotion remains a possibility, but these data do not show it.",
        refs: ["e6", "e7"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "Do Made-Up Words Do Nothing?",
        type: "single",
        prompt:
          "Exploratory equivalence tests suggested the made-up words' effects were smaller than the team's smallest effect of interest. How strongly can we say they do nothing?",
        evidence: [
          "Smallest effect of interest: dz = 0.30, the effect size the study was powered for.",
          "The equivalence tests were added at a reviewer's request.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Effects larger than that are unlikely for these words in this task, but smaller effects are not ruled out, and the tests were exploratory.",
          },
          {
            id: "o2",
            text: "The words have exactly zero effect.",
          },
          {
            id: "o3",
            text: "The words definitely work, since some estimates were above zero.",
          },
          {
            id: "o4",
            text: "Nothing can be said, since the tests were not planned.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What does an equivalence bound rule out, and what does it leave?",
        misconceptions: {
          o2: "Equivalence tests rule out effects beyond a bound; they do not prove zero.",
          o3: "Small estimates near zero within the bounds do not show a benefit.",
          o4: "Unplanned tests are weaker evidence, but they still inform.",
        },
        explanation:
          "The equivalence tests, not pre-registered and therefore exploratory, indicated that most made-up-word effects were within ±0.3. That makes large effects unlikely, not zero effects certain.",
        refs: ["e8", "e9"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "A Three-Minute Cap",
        type: "single",
        prompt:
          "Trials stopped at three minutes, and 20 participants hit that limit at least once. What does a cap like that do to the comparison?",
        evidence: [
          "The limit was not told to participants.",
          "10 participants reached the cap on all four trials.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It cuts off the longest times, so differences among people who could have gone longer are hidden, which tends to understate true differences.",
          },
          {
            id: "o2",
            text: "It inflates the swear-word effect.",
          },
          {
            id: "o3",
            text: "It makes no difference, since few people hit the cap.",
          },
          {
            id: "o4",
            text: "It means the swear word had no effect.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If someone could have lasted four minutes, what does a three-minute stop record?",
        misconceptions: {
          o2: "Capping shortens the longest times, which compresses differences rather than inflating them.",
          o3: "Twenty participants hit it at least once; for them, real differences could be hidden.",
          o4: "The swear word still produced a significant increase.",
        },
        explanation:
          "Participants who reached three minutes are recorded at the cap whatever word they used, so the test cannot see differences above it. The effect is to compress differences rather than create them.",
        refs: ["e10"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "Repeating a real swear word let 92 participants keep a hand in ice water about a third longer than repeating a neutral word, but two made-up swear words had no such effect even though they felt more emotional and funnier. The study does not show how swearing helps, and a three-minute cap limited the longest trials.",
};
