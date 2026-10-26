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
        stage: "Read the design",
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
            id: "o2",
            text: "To match the emotional meaning of the words while leaving speech frequency free to vary.",
          },
          {
            id: "o3",
            text: "To measure pain without distraction while letting only the swear-word trial involve speaking.",
          },
          {
            id: "o1",
            text: "To hold speaking and rhythm constant while changing the kind of word.",
          },
          {
            id: "o4",
            text: "To keep participants unaware of which word condition they were experiencing during each trial.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If the comparison was silence, what else besides the word would differ?",
        misconceptions: {
          o2: "The neutral word was not emotionally matched, and repetition pace was held constant.",
          o3: "All conditions involved speaking, including the neutral comparison.",
          o4: "Participants spoke the words themselves and knew which they were saying.",
        },
        explanation:
          "All conditions involved repeating a word at the same steady pace, so differences in pain responses can be linked to the word itself rather than to the act of speaking.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
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
            id: "o2",
            text: "To conceal which word each participant was saying during a trial.",
          },
          {
            id: "o3",
            text: "To shorten the task by giving different participants different subsets of the four word conditions.",
          },
          {
            id: "o4",
            text: "To make each participant begin with their most effective word before moving to the weaker ones.",
          },
          {
            id: "o1",
            text: "To spread practice and fatigue across words rather than confound them with order.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Could someone handle the ice water differently on their fourth try than on their first?",
        misconceptions: {
          o2: "Random order does not conceal the word a participant says aloud.",
          o3: "Each participant completed every condition; order randomisation did not shorten the set.",
          o4: "Randomisation does not sort conditions by their effects.",
        },
        explanation:
          "Condition order was randomised to counter order effects, so that changes across trials are spread evenly across the four words.",
        refs: ["e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
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
              optionId: "o2",
              label: "All three words",
              targetIds: ["fuck", "fouch", "twiz"],
            },
            {
              optionId: "o1",
              label: "Only the real swear word",
              targetIds: ["fuck", "neutral"],
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
            id: "o2",
            text: "All non-neutral words raised tolerance similarly, fitting a general novelty benefit.",
          },
          {
            id: "o1",
            text: "Only the real swear word lengthened tolerance; the made-up words stayed close to the neutral word.",
          },
          {
            id: "o3",
            text: "The made-up words raised tolerance more than swearing, though all three exceeded neutral speech.",
          },
          {
            id: "o4",
            text: "The word conditions had similar mean tolerance, with differences appearing only in emotion ratings.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare each bar with the neutral word.",
        misconceptions: {
          o2: "The made-up words did not show the real swear word's increase.",
          o3: "Their means were close to neutral rather than above the real swear word.",
          o4: "Mean pain tolerance was higher for the real swear word.",
        },
        explanation:
          "With the swear word, tolerance averaged 74.28 seconds against 55.87 for the neutral word, a 33% increase. The made-up words did not differ from the neutral word.",
        refs: ["e4", "e5"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
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
            text: "Higher emotion ratings established mediation, even though the made-up words did not alter tolerance.",
          },
          {
            id: "o3",
            text: "The made-up words failed because they did not raise emotion or humour ratings above neutral speech.",
          },
          {
            id: "o4",
            text: "The emotional ratings invalidate the tolerance difference, leaving no evidence that swearing helped.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If emotion were the key, what should the made-up words have done?",
        misconceptions: {
          o2: "The mediation analysis did not establish emotion as the explanation.",
          o3: "They did raise those ratings, without the tolerance effect.",
          o4: "The tolerance finding remains; its mechanism is the uncertain part.",
        },
        explanation:
          "The made-up words raised emotion and humour ratings without reducing pain, and in the exploratory mediation analysis emotion ratings did not predict tolerance. Emotion remains a possibility, but these data do not show it.",
        refs: ["e6", "e7"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
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
            text: "The exploratory tests argue against effects beyond the bounds, not all smaller effects.",
          },
          {
            id: "o2",
            text: "The tests establish zero effect by placing estimates inside the bounds.",
          },
          {
            id: "o3",
            text: "The positive point estimates establish a benefit, even when the estimates lie inside the equivalence bounds.",
          },
          {
            id: "o4",
            text: "The exploratory status leaves the effect wholly unknown, so the bounds provide no information at all.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What does an equivalence bound rule out, and what does it leave?",
        misconceptions: {
          o2: "Equivalence bounds allow nonzero effects smaller than the chosen threshold.",
          o3: "A positive estimate alone does not demonstrate a useful benefit.",
          o4: "Exploratory tests can inform judgement while requiring caution.",
        },
        explanation:
          "The equivalence tests, not pre-registered and therefore exploratory, indicated that most made-up-word effects were within ±0.3. That makes large effects unlikely, not zero effects certain.",
        refs: ["e8", "e9"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
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
            id: "o2",
            text: "It increases the observed contrast by assigning especially long times to participants in the swear trial.",
          },
          {
            id: "o3",
            text: "It preserves the full contrast because everyone who hits the limit must have the same true tolerance.",
          },
          {
            id: "o1",
            text: "It hides differences above three minutes and may compress the observed contrast.",
          },
          {
            id: "o4",
            text: "It removes the swear-word effect because capped observations cannot contribute to a group comparison.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If someone could have lasted four minutes, what does a three-minute stop record?",
        misconceptions: {
          o2: "The cap truncates long times rather than extending them.",
          o3: "Recorded equality at a cap does not imply equal uncapped tolerance.",
          o4: "The comparison still uses the observations; the limit reduces information above the cap.",
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
