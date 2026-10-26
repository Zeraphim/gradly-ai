// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/tsang-2024-stereotype-threat-prospective-memory.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about the comparison story, an uneven quiz, the scoring window, a small subgroup, age claims and transfer.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-remembering-doctor-appointments",
    title:
      "Effects of Age-Based Stereotype Threat on Time-Based Prospective Memory",
    briefing:
      "Older adults read a news story and then had to remember to press a key every two minutes. Decide how the comparison was built, how the scoring choice matters, and how far a small subgroup result can go.",
    source: "generated",
    paper: {
      title:
        "Effects of age-based stereotype threat on time-based prospective memory",
      authors: "Tsang, Chan, Lu & Wong (2024)",
      journal: "Frontiers in Psychology 15: 1379160",
      url: "https://doi.org/10.3389/fpsyg.2024.1379160",
      limitations: [
        "No younger adults were tested, so it is unclear whether the effect is specific to older people.",
        "The standard scoring window gave floor-level scores, so the main analyses used a more lenient window.",
        "The age-subgroup analysis was an added analysis in small groups (23 people aged 70–80).",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 3,
        excerpt:
          "They were given fictitious news articles related to either dementia (in the stereotyped condition) or the importance of English oral skills (in the neutral condition).",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "To evaluate their understanding of our experimental manipulation, they were required to complete a reading comprehension exercise consisting of 10 questions related to the article’s content.",
      },
      {
        id: "e3",
        page: 3,
        excerpt:
          "The mean scores for the stereotyped and neutral conditions were 9.40 (SD = 0.85) and 8.47 (SD = 1.35), respectively.",
      },
      {
        id: "e4",
        page: 4,
        excerpt:
          "Considering that reading comprehension ability is required in the LDT, which may in turn affect TBPM performance, we controlled for their mean reading comprehension scores in subsequent analyses.",
      },
      {
        id: "e5",
        page: 3,
        excerpt:
          "A correct response in TBPM was defined by a time window of ±2,500 ms of each PM target interval (2 min).",
      },
      {
        id: "e6",
        page: 3,
        excerpt:
          "However, this scoring revealed a flooring effect for both stereotyped (M = 0.36, SD = 0.31) and neutral conditions (M = 0.45, SD = 0.33)",
      },
      {
        id: "e7",
        page: 3,
        excerpt:
          "Considering the slowness of older participants, we adopted a more lenient scoring of ±15,000 ms in subsequent analyses",
      },
      {
        id: "e8",
        page: 4,
        excerpt:
          "The ANCOVA results indicated a significant main effect of ABST on the proportion of correct responses in TBPM, F(1, 70) = 6.157, p < 0.05, ηp2 = 0.08",
      },
      {
        id: "e9",
        page: 4,
        excerpt:
          "we conducted additional stratified analyses to examine whether ABST had differential effects on TBPM performance among younger participants (aged 60–69 years) and older participants (aged 70–80 years).",
      },
      {
        id: "e10",
        page: 7,
        excerpt:
          "Younger participants (n = 50) Older Participants (n = 23) Stereotyped condition (n = 22) Neutral condition (n = 28) Stereotyped condition (n = 13) Neutral condition (n = 10)",
      },
      {
        id: "e11",
        page: 7,
        excerpt:
          "Proportion of correct responses 0.81 ± 0.32 0.87 ± 0.24 0.39 (0.01) 0.66 ± 0.40 0.91 ± 0.15 <0.05 (0.19)",
      },
      {
        id: "e12",
        page: 6,
        excerpt:
          "First, the present study did not include younger participants, and therefore, it is difficult to delineate whether the observed ABST effect on TBPM is exclusive to older adults.",
      },
      {
        id: "e13",
        page: 2,
        excerpt:
          "Participants were recruited using convenience and snowball sampling",
      },
      {
        id: "e14",
        page: 5,
        excerpt:
          "The present study aimed to investigate the impact of ABST on TBPM in older adults, particularly when ABST is blatantly activated.",
      },
      {
        id: "e15",
        page: 3,
        excerpt:
          "In this paradigm, TBPM commands were embedded in an OT, i.e., LDT. Specifically, participants were instructed to press the button “T” at a two-minute interval while performing the LDT.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "A Story for Both Groups",
        type: "single",
        prompt:
          "One group read a made-up news story about dementia. Why did the comparison group read a story too, about English speaking skills, rather than nothing?",
        evidence: [
          "Participants aged 60–80 were randomly assigned to one of two stories.",
          "Both groups answered 10 questions about their story before the memory task.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "So both groups did the same reading activity and differed only in whether the story was about ageing and dementia.",
          },
          {
            id: "o2",
            text: "So the comparison group would also feel anxious about memory.",
          },
          {
            id: "o3",
            text: "To make the comparison group's task harder on purpose.",
          },
          {
            id: "o4",
            text: "Because reading improves memory, so both groups needed it.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What would differ between groups if one group read something and the other did nothing?",
        misconceptions: {
          o2: "The comparison story was chosen to avoid ageing themes, not to create anxiety.",
          o3: "The aim was to match the activity; the difficulty difference that appeared was unintended.",
          o4: "The purpose is to equalise the activity, not to train memory.",
        },
        explanation:
          "Giving both groups a story and the same comprehension questions keeps the activity equal, so the comparison isolates the content about dementia.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "An Uneven Quiz",
        type: "single",
        prompt:
          "The comprehension quiz turned out harder for the comparison story: 8.47 against 9.40 out of 10. Why might that matter for the memory result?",
        evidence: [
          "The memory task was embedded in a word-recognition task on screen.",
          "Reading ability is needed for that word task.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "If the groups differed in reading skill, that could affect the memory task, so the team adjusted for quiz scores in the analysis.",
          },
          {
            id: "o2",
            text: "It shows the dementia story worked better.",
          },
          {
            id: "o3",
            text: "It makes no difference, since the quiz was only a check.",
          },
          {
            id: "o4",
            text: "It means the study must be discarded.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Does the main task depend on reading?",
        misconceptions: {
          o2: "The quiz checks understanding of the story; a higher score does not show the manipulation worked better.",
          o3: "A group difference on a reading measure could affect a reading-based task, so it needed handling.",
          o4: "Adjusting for the scores is a standard way to handle such a difference.",
        },
        explanation:
          "Because reading comprehension is needed in the word task, which may affect memory performance, the authors controlled for quiz scores in later analyses.",
        refs: ["e3", "e4", "e15"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "Changing the Scoring Window",
        type: "single",
        prompt:
          "With the standard window of ±2.5 seconds around each two-minute mark, both groups scored near the floor. The team then used a ±15-second window for the main analyses. What should a reader keep in mind?",
        evidence: [
          "Standard window: 0.36 correct (dementia story) against 0.45 (comparison story).",
          "Lenient window: 0.76 against 0.88, the basis of the reported significant effect.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The main result rests on a scoring rule chosen after seeing floor-level scores; it would be more convincing if the effect also held under the standard rule.",
          },
          {
            id: "o2",
            text: "The lenient window is always correct for older adults, so nothing changes.",
          },
          {
            id: "o3",
            text: "The standard window proves there was no effect.",
          },
          {
            id: "o4",
            text: "Changing windows doubled the sample size.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "When was the scoring rule chosen, relative to seeing the results?",
        misconceptions: {
          o2: "The reason is plausible, but choosing a rule after seeing the data adds flexibility a reader should note.",
          o3: "Floor-level scores make differences hard to detect; they do not prove there is none.",
          o4: "The window changes how responses are scored, not how many people took part.",
        },
        explanation:
          "The authors explain that the standard window produced a floor effect and that older participants are slower, so they used a ±15-second window. The reasoning is plausible, but the significant result depends on that choice.",
        refs: ["e5", "e6", "e7", "e8"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "Only the Oldest?",
        type: "single",
        prompt:
          "An added analysis split participants by age. The difference was significant only for those aged 70–80. How much weight should that get?",
        evidence: [
          "Proportion correct by age group and story, lenient scoring.",
          "Aged 70–80: 13 read the dementia story and 10 the comparison story.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Correct responses by age group",
          instruction:
            "Compare the gap in each age group, and note how many people are in each.",
          description:
            "Mean proportion of correct responses by age group and story.",
          provenance: {
            kind: "reported",
            refs: ["e10", "e11"],
            note: "Means and group sizes as printed in Table 2.",
          },
          measure: "Proportion of correct responses",
          unit: "proportion",
          decimals: 2,
          min: 0,
          max: 1,
          values: [
            {
              id: "y-s",
              label: "Aged 60–69, dementia story",
              detail: "22 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e10", "e11"],
                note: "Mean proportion as printed in Table 2.",
              },
              value: 0.81,
            },
            {
              id: "y-n",
              label: "Aged 60–69, comparison story",
              detail: "28 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e10", "e11"],
                note: "Mean proportion as printed in Table 2.",
              },
              value: 0.87,
            },
            {
              id: "o-s",
              label: "Aged 70–80, dementia story",
              detail: "13 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e10", "e11"],
                note: "Mean proportion as printed in Table 2.",
              },
              value: 0.66,
            },
            {
              id: "o-n",
              label: "Aged 70–80, comparison story",
              detail: "10 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e10", "e11"],
                note: "Mean proportion as printed in Table 2.",
              },
              value: 0.91,
            },
          ],
          difference: {
            from: "o-s",
            to: "o-n",
            label: "Gap of 0.25 in the oldest group",
            at: "feedback",
          },
          prediction: null,
          resolution: null,
          responses: [
            {
              optionId: "o1",
              label: "Exploratory, small groups",
              targetIds: ["o-s", "o-n"],
            },
            {
              optionId: "o2",
              label: "Proven for over-70s",
              targetIds: ["o-s", "o-n"],
            },
            {
              optionId: "o3",
              label: "No effect under 70",
              targetIds: ["y-s", "y-n"],
            },
            {
              optionId: "o4",
              label: "Younger group larger effect",
              targetIds: ["y-s", "y-n"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "Treat it as exploratory: it was an added analysis in only 23 people, so it needs confirming in a larger study.",
          },
          {
            id: "o2",
            text: "It proves the effect only exists after age 70.",
          },
          {
            id: "o3",
            text: "It proves there is no effect at all under 70.",
          },
          {
            id: "o4",
            text: "The younger group showed the larger gap.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many people are in the oldest group, and was this split planned from the start?",
        misconceptions: {
          o2: "A significant result in 23 people from an added analysis cannot establish that.",
          o3: "A non-significant gap in 50 people is not proof of no effect.",
          o4: "The younger gap was 0.06; the older gap was 0.25.",
        },
        explanation:
          "The split was described as an additional analysis, and the oldest subgroup had 13 and 10 people. The gap was large (0.66 against 0.91), but a result from such small groups needs confirmation.",
        refs: ["e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "Specific to Older Adults?",
        type: "single",
        prompt:
          "Can this study say that reading about dementia harms memory for future tasks only in older people?",
        evidence: [
          "All participants were aged 60 to 80.",
          "The dementia story was about ageing, so it targeted older readers.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "No: no younger adults were tested, so the study cannot compare older people with younger ones.",
          },
          {
            id: "o2",
            text: "Yes: the effect appeared in the 70–80 group but not the 60–69 group.",
          },
          {
            id: "o3",
            text: "Yes: dementia stories cannot affect young people.",
          },
          {
            id: "o4",
            text: "No: the study found no effect at all.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who was in the sample?",
        misconceptions: {
          o2: "Comparing two older age bands is not the same as comparing older and younger adults.",
          o3: "The study did not test young people, and the authors note such stories might affect them too.",
          o4: "There was a significant effect overall under lenient scoring.",
        },
        explanation:
          "The authors note that because no younger participants were included, it is difficult to say whether the effect is exclusive to older adults, and they recommend a design that crosses age group with condition.",
        refs: ["e12"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "From Lab to Daily Life",
        type: "single",
        prompt:
          "A care home wants to keep residents away from news about dementia so they remember appointments better. How well does this study support that?",
        evidence: [
          "One session: a made-up news story, then a 15-minute computer task with a key press every two minutes.",
          "Participants were recruited by convenience and referral in Hong Kong.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Weakly: a single blatant story and a short timing task in a convenience sample are far from real appointments and everyday news.",
          },
          {
            id: "o2",
            text: "Strongly: the study shows news about dementia makes people miss appointments.",
          },
          {
            id: "o3",
            text: "Not at all: the study found no effect.",
          },
          {
            id: "o4",
            text: "Strongly, because participants were randomly assigned.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How similar is the lab task to remembering a doctor's appointment?",
        misconceptions: {
          o2: "No appointments were measured; the outcome was pressing a key on time in a short lab task.",
          o3: "It found an effect, under lenient scoring.",
          o4: "Random assignment supports the comparison within the study, not its transfer to daily life.",
        },
        explanation:
          "The study tested a blatant activation of age stereotypes in one session with a lab task in a convenience sample. That is a long way from everyday news and real appointments.",
        refs: ["e13", "e14", "e15"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "Older adults in Hong Kong who read a made-up story about dementia were less accurate at pressing a key every two minutes than those who read a neutral story, under a lenient scoring window chosen after the standard one gave floor-level scores. The effect appeared mainly in a small group aged 70–80, no younger adults were tested, and the task is far from real appointments.",
};
