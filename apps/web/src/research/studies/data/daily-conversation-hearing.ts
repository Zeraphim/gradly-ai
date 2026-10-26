// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/fu-2022-hearing-loss-loneliness.pdf
// Revised 26 October 2026: answers were copied from the evidence lines; now decisions about measures, two links, explanations, causation and reach.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-daily-conversation-hearing",
    title: "Study Design Identification",
    briefing:
      "Decide what hearing tests and loneliness scales can show about older adults' mood, and what they cannot.",
    source: "generated",
    paper: {
      title:
        "The impact of untreated hearing loss on depression, anxiety, stress, and loneliness in tonal language-speaking older adults in China",
      authors: "Fu, Eikelboom, Liu, Wang & Jayakody (2022)",
      journal: "Frontiers in Psychology 13: 917276",
      url: "https://doi.org/10.3389/fpsyg.2022.917276",
      limitations: [
        "All measures were taken at one time point, so the order of hearing loss, loneliness and mental health cannot be established.",
        "The sample was small, had more women than men, and included few people with severe-to-profound hearing loss.",
        "Participants were volunteers in good general health who had never worn hearing aids.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 3,
        excerpt:
          "The nature of tonal languages also suggests further investigation is required into hearing sensitivity in the different bands of frequencies.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "Tonal languages employ lexical tones or pitch variations to indicate different meanings at the suprasegmental level",
      },
      {
        id: "e3",
        page: 3,
        excerpt:
          "Furthermore, high frequencies (6–8 kHz) show a decrease in sensitivity at least a decade earlier than for the speech frequencies",
      },
      {
        id: "e4",
        page: 4,
        excerpt:
          "Hearing loss data were summarized by two different methods: four frequency average of hearing thresholds at 0.5, 1, 2, and 4 kHz (speech frequencies), and the three high-frequency average of hearing thresholds at 4, 6, and 8 kHz (high frequencies), noted, respectively, as 4FA and 3HFA.",
      },
      {
        id: "e5",
        page: 4,
        excerpt:
          "In this six-item scale, three statements are made about emotional loneliness and three about social loneliness",
      },
      {
        id: "e6",
        page: 1,
        excerpt:
          "four-frequency average hearing loss (β=0.149, p=0.010) and DASS stress scores (β=0.123, p=0.034) significantly predicted social loneliness scale",
      },
      {
        id: "e7",
        page: 1,
        excerpt:
          "emotional loneliness (β=0.303, p<0.001) and living status (β=0.110, p=0.048) significantly predicted DASS depression scores",
      },
      {
        id: "e8",
        page: 1,
        excerpt:
          "emotional loneliness (β=0.341, p<0.001) and a history of vascular disease (β=0.129, p=0.019) significantly predicted DASS stress scores",
      },
      {
        id: "e9",
        page: 7,
        excerpt:
          "The analysis showed that only speech-frequency hearing was associated with loneliness, not with the high frequency.",
      },
      {
        id: "e10",
        page: 7,
        excerpt:
          "It is difficult to explain why this was not found in this study, but it may be because only speech frequencies substantially impact daily conversation, and lead to potential loneliness.",
      },
      {
        id: "e11",
        page: 7,
        excerpt:
          "One of the limitations of the current study is that results are based on cross-sectional analyses rather than longitudinal assessments of hearing, loneliness, and mental health over time.",
      },
      {
        id: "e12",
        page: 7,
        excerpt:
          "previous studies have demonstrated that stress is causally related to loneliness",
      },
      {
        id: "e13",
        page: 6,
        excerpt:
          "The mean hearing threshold in the better ear in this current study was 36.94 dB HL. Therefore, whether more severe levels of hearing loss contribute to clinically significant depression, anxiety, or stress levels needs to be explored.",
      },
      {
        id: "e14",
        page: 7,
        excerpt:
          "Another limitation is that there were relatively fewer participants with untreated severe-to-profound hearing loss.",
      },
      {
        id: "e15",
        page: 7,
        excerpt:
          "The study had a gender imbalance and had a relatively small sample size.",
      },
      {
        id: "e16",
        page: 3,
        excerpt:
          "Participants were recruited at the Beijing Institute of Otolaryngology, through social media advertisements, flyers, and community events.",
      },
      {
        id: "e17",
        page: 1,
        excerpt:
          "four-frequency average hearing loss (β=0.149, p=0.010) and DASS stress scores (β=0.123, p=0.034) significantly predicted social loneliness scale",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Two Hearing Measures",
        type: "single",
        prompt:
          "Most earlier studies averaged hearing thresholds from 0.5 to 4 kHz only. Why would the team also measure high-frequency hearing in Mandarin speakers?",
        evidence: [
          "In Mandarin, a word's meaning changes with the pitch pattern of its tone.",
          "Hearing at the highest frequencies declines earlier with age than at speech frequencies.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "High-frequency loss might affect tonal speech in ways the usual average misses.",
          },
          {
            id: "o2",
            text: "High-frequency thresholds can replace speech-frequency tests because they measure the same range.",
          },
          {
            id: "o3",
            text: "Mandarin speakers should show no loss at speech frequencies.",
          },
          {
            id: "o4",
            text: "Two averages double the independent sample, improving precision without recruiting anyone.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Ask what is different about the speech these listeners must decode.",
        misconceptions: {
          o2: "These measures cover different frequency ranges and need not capture the same loss.",
          o3: "The rationale does not establish absence of speech-frequency loss.",
          o4: "Repeated measures on the same people do not double the sample.",
        },
        explanation:
          "The authors note that tonal languages rely on pitch changes and that the perception of tone depends on hearing ability, while high frequencies decline a decade earlier. They therefore compared a speech-frequency average (4FA) with a high-frequency average (3HFA).",
        refs: ["e1", "e2", "e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Two Kinds of Loneliness",
        type: "single",
        prompt:
          "The loneliness scale gives a total score, an emotional score and a social score. Why analyse the two subscores as well as the total?",
        evidence: [
          "Six items: three about emotional loneliness and three about social loneliness.",
          "Outcomes of interest: hearing loss and depression, anxiety and stress.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Each subscore must be more reliable than the total because it contains fewer, more focused items.",
          },
          {
            id: "o1",
            text: "Different outcomes might relate to different kinds of loneliness, and a total score could blur that.",
          },
          {
            id: "o3",
            text: "The total cannot be used for older adults because combining dimensions changes the age of the sample.",
          },
          {
            id: "o4",
            text: "Separate subscores identify which kind of loneliness causes distress when both are measured together.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What could be hidden if two different patterns were averaged into one number?",
        misconceptions: {
          o2: "A narrower measure is not automatically more reliable.",
          o3: "Combining scores does not make the total unusable for that age group.",
          o4: "Splitting dimensions does not establish causal direction.",
        },
        explanation:
          "The results show why this mattered: hearing loss tracked with social loneliness, while emotional loneliness tracked with depression, anxiety and stress. A single total would have mixed the two patterns.",
        refs: ["e5"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Two Separate Links",
        type: "single",
        prompt:
          "Hearing loss tracked with one kind of loneliness, and a different kind of loneliness tracked with mood scores. Which statement fits the coefficients?",
        evidence: [
          "Standardised coefficients (β) from the final regression models, 293 participants.",
          "Hearing loss was not itself a significant predictor of depression, anxiety or stress.",
        ],
        scene: {
          version: 1,
          kind: "association",
          title: "Which links appeared?",
          instruction:
            "Read each reported coefficient, then choose what the pattern does and does not show.",
          description:
            "Standardised regression coefficients for hearing loss and emotional loneliness, from the final models.",
          provenance: {
            kind: "reported",
            refs: ["e6", "e7", "e8"],
            note: "Coefficients as printed in the abstract's results.",
          },
          pairs: [
            {
              id: "hear-social",
              label: "Hearing loss and social loneliness",
              detail: "Four-frequency average hearing loss.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Coefficient as printed in the abstract's results.",
              },
              x: "Hearing loss (4FA)",
              y: "Social loneliness",
              statistic: "beta",
              value: 0.149,
              n: 293,
            },
            {
              id: "emo-dep",
              label: "Emotional loneliness and depression",
              detail: "Final model.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e7"],
                note: "Coefficient as printed in the abstract's results.",
              },
              x: "Emotional loneliness",
              y: "Depression score",
              statistic: "beta",
              value: 0.303,
              n: 293,
            },
            {
              id: "emo-stress",
              label: "Emotional loneliness and stress",
              detail: "Final model.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e8"],
                note: "Coefficient as printed in the abstract's results.",
              },
              x: "Emotional loneliness",
              y: "Stress score",
              statistic: "beta",
              value: 0.341,
              n: 293,
            },
          ],
          resolution: {
            id: "resolution",
            label: "Two separate links, not a chain",
            detail:
              "Hearing loss was tied to social loneliness, and emotional loneliness to mood scores. Nothing here shows hearing loss leading to distress through loneliness.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e6", "e7", "e8"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o2",
              label: "Hearing leads to distress",
              targetIds: ["hear-social", "emo-dep"],
            },
            {
              optionId: "o3",
              label: "Social loneliness drives mood",
              targetIds: ["hear-social"],
            },
            {
              optionId: "o4",
              label: "No links",
              targetIds: [],
            },
            {
              optionId: "o1",
              label: "Two separate links",
              targetIds: ["hear-social", "emo-dep", "emo-stress"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o2",
            text: "Hearing loss caused mood symptoms through the loneliness pathway.",
          },
          {
            id: "o3",
            text: "Social loneliness was the strongest mood predictor, explaining the hearing-loss association with distress.",
          },
          {
            id: "o4",
            text: "Neither hearing measure related to loneliness, although emotional loneliness tracked mood symptoms.",
          },
          {
            id: "o1",
            text: "Hearing loss tracked social loneliness; emotional loneliness tracked mood symptoms.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Check which loneliness measure each outcome was tied to, and whether hearing appears next to any mood score.",
        misconceptions: {
          o2: "The separate associations do not establish a mediation pathway or causation.",
          o3: "Emotional loneliness, not social loneliness, tracked those mood scores.",
          o4: "Speech-frequency hearing loss did relate to social loneliness.",
        },
        explanation:
          "The coefficients show two separate links. Hearing loss was a significant predictor of social loneliness, and emotional loneliness predicted depression, anxiety and stress. Nothing shows hearing loss leading to distress through loneliness.",
        refs: ["e6", "e7", "e8"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Speech Versus High Frequencies",
        type: "single",
        prompt:
          "The team expected high-frequency loss to matter, yet only the speech-frequency average entered the loneliness models. What is the most defensible reading?",
        evidence: [
          "Both averages were measured in the better ear and analysed as continuous variables.",
          "Result: the speech-frequency average predicted loneliness; the high-frequency average did not.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "High-frequency loss has no role in speech understanding because 3HFA did not enter these models.",
          },
          {
            id: "o3",
            text: "Speech-frequency loss causes loneliness because its measure was retained after the others were dropped.",
          },
          {
            id: "o1",
            text: "Only 4FA entered the models; the daily-conversation explanation remains a hypothesis.",
          },
          {
            id: "o4",
            text: "The high-frequency measure must be invalid, since the final model did not retain it.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what the models show from why the authors think it happened.",
        misconceptions: {
          o2: "A model-selection result cannot rule out every role in speech.",
          o3: "Retention in a cross-sectional model does not establish causation.",
          o4: "Non-selection does not establish a faulty measurement.",
        },
        explanation:
          "The authors write that it is difficult to explain why high frequencies were not associated, and suggest that only speech frequencies substantially affect daily conversation. That is a possible explanation, not a tested result.",
        refs: ["e9", "e10"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Treat Loneliness First?",
        type: "single",
        prompt:
          "A clinic reads that emotional loneliness is strongly linked to depression, anxiety and stress and decides that reducing loneliness will lower all three. What most limits that conclusion?",
        evidence: [
          "Hearing tests, the loneliness scale and the DASS-21 were completed at baseline.",
          "Earlier work cited by the authors suggests stress can lead to loneliness.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "One-time measurements leave open whether loneliness precedes or follows distress.",
          },
          {
            id: "o2",
            text: "Current hearing-aid users were mixed with non-users, so treatment explains the mood link.",
          },
          {
            id: "o3",
            text: "The emotional subscore had only one item, so it could not separate types of loneliness.",
          },
          {
            id: "o4",
            text: "Negative coefficients imply that less loneliness predicted more distress, reversing the clinic's claim.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which came first, the loneliness or the distress? Could the study tell?",
        misconceptions: {
          o2: "The study excluded hearing-aid experience; that is not the stated design limitation.",
          o3: "Emotional loneliness was not measured by a single item.",
          o4: "The reported links were not negative in that sense.",
        },
        explanation:
          "The authors state that their results come from cross-sectional analyses rather than longitudinal assessments, so time order cannot be established. They also cite work in which stress leads to loneliness, so the direction could run the other way.",
        refs: ["e11", "e12"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "How Far Does It Reach?",
        type: "single",
        prompt:
          "A hearing-aid maker claims: “This study shows hearing loss does not harm older adults' mental health.” What is the best reply?",
        evidence: [
          "293 volunteers in good general health, 62% women, none of whom had worn hearing aids.",
          "Average better-ear hearing loss was mild to moderate; only 34 people had severe or profound loss.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "The non-significant mood tests support the claim across older adults, including those with severe loss.",
          },
          {
            id: "o3",
            text: "The social-loneliness association directly proves that hearing loss worsens depression and stress.",
          },
          {
            id: "o1",
            text: "The sample was small, healthy and had few people with severe loss, so mild to moderate losses showed no link here but severe loss was barely tested.",
          },
          {
            id: "o4",
            text: "The cross-sectional design prevents interpreting even the measured associations in this sample.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who was in the sample, and who was barely in it?",
        misconceptions: {
          o2: "A null in this selected sample does not establish absence of harm across severity levels.",
          o3: "Social loneliness and mood symptoms were separate outcomes with different associations.",
          o4: "It limits causal claims without erasing descriptive associations.",
        },
        explanation:
          "The mean better-ear threshold was 36.94 dB HL, and the authors say it needs to be explored whether more severe loss matters for mood. They also list the small sample, the gender imbalance and the few participants with severe-to-profound loss.",
        refs: ["e13", "e14", "e15", "e16", "e17"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In 293 older Mandarin speakers tested at one time point, hearing loss tracked with social loneliness but not with depression, anxiety or stress, and emotional loneliness tracked with all three mood scores. The study cannot show cause or order, had few participants with severe loss, and its volunteers were relatively healthy.",
};
