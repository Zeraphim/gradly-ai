// Originally generated 2026-10-25; source-checked question revision 2026-10-28.
// Source paper: docs/research/papers/doyen-2012-behavioral-priming.pdf
// Agent source review is not content-owner approval; see PREPARED_STUDY_REVIEW.md.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-walking-speed-test",
    title: "Behavioral Priming Replication Lesson",
    briefing:
      "Examine the evidence from the replication attempts of the age‑stereotype walking‑speed priming effect and answer questions about design, results, and interpretation.",
    source: "generated",
    paper: {
      title: "Behavioral Priming: It's All in the Mind, but Whose Mind?",
      authors: "Doyen, Klein, Pichon & Cleeremans (2012)",
      journal: "PLoS ONE 7(1): e29081",
      url: "https://doi.org/10.1371/journal.pone.0029081",
      limitations: [
        "Debriefing raised concerns about awareness of age-related primes, limiting an unconscious-only interpretation.",
        "The study used a student context and specific measurement/procedure choices; replication boundaries need scrutiny.",
        "Experimenter-expectation dependence does not uniquely establish the proposed mimicry mechanism.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 1,
        excerpt:
          "Here, we present two experiments aimed at replicating the original study.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "Despite our large sample of 120 participants (vs. 60 in Bargh et al.’s study 2a and 2b combined), and despite our precise measurement methods, we were unable to replicate the effects observed by Bargh et al. [1].",
      },
      {
        id: "e3",
        page: 5,
        excerpt:
          "Can Bargh et al.’s [1] striking finding that walking speed can be influenced by unconscious primes associated with the stereotype of ‘‘old age’’ be replicated?",
      },
      {
        id: "e4",
        page: 2,
        excerpt:
          "In Experiment 1, we sought to replicate the original study but used automated rather than manual chronometry.",
      },
      {
        id: "e5",
        page: 3,
        excerpt:
          "funnel questionnaire [1,18] assessing participants’ awareness of the manipulation on three levels: 1-Awareness of the prime was assessed by asking participants increasingly specific questions about the presence of primes in the scrambled sentences. One particular question was a four-alternative forced-choice task (4-AFC) in which participants were required to choose between four pictures representing four social categories that could have been used as primes (i.e.: athletic person, Arabic person, handicapped person and elderly).",
      },
      {
        id: "e6",
        page: 2,
        excerpt:
          "In Experiment 2, we directly manipulated\nexperimenters’ expectancies by making half of the experimenters\nthink their participants would slow down after exposure and the\nother half think that their participants would speed up after\nexposure.",
      },
      {
        id: "e7",
        page: 3,
        excerpt:
          "The results show no significant difference between the Prime (M = 6.270 SD = 2.15) and the No-Prime group (M = 6.390 SD = 1.11) in the time necessary to walk along the hallway after the priming manipulation (F (1, 119),1, g2 = .01).",
      },
      {
        id: "e8",
        page: 1,
        excerpt:
          "Bargh, Chen, and Burrows’ (1996) famous study, in which participants unwittingly exposed to the stereotype of age walked slower when exiting the laboratory, was instrumental in defining this perspective.",
      },
      {
        id: "e9",
        page: 3,
        excerpt:
          "Based on these negative results, we decided to push the investigation further and elucidate the factors that could potentially promote Bargh et al’s [1] effect on walking speed. A first possibility is simply that the effects observed by Bargh et al. results from a methodological artifact originating from the lack of accuracy of their time measurement method. There is also a second, more intriguing possibility. Studies [22] on automatic behavior have suggested that participants tend to mimic the experimenter’s behavior. Therefore, it seemed plausible that experimenters’ expectations about primed participants’ behavior may have altered their own behavior (e.g.: slower interaction pace with the participants and gesture) and that these changes were communicated unconsciously by experimenters to the participants.",
      },
      {
        id: "e10",
        page: 1,
        excerpt:
          "Despite the use of automated timing methods and a larger sample, our first experiment failed to show priming. Our second experiment was aimed at manipulating the beliefs of the experimenters: Half were led to think that participants would walk slower when primed congruently, and the other half was led to expect the opposite. Strikingly, we obtained a walking speed effect, but only when experimenters believed participants would indeed walk slower. This suggests that both priming and experimenters’ expectations are instrumental in explaining the walking speed effect. Further, debriefing was suggestive of awareness of the primes. We conclude that unconscious behavioral priming is real, while real, involves mechanisms different from those typically assumed to cause the effect.",
      },
      {
        id: "e11",
        page: 3,
        excerpt:
          "Despite our large sample of 120 participants (vs. 60 in Bargh et al.’s study 2a and 2b combined)",
      },
      {
        id: "e12",
        page: 1,
        excerpt:
          "Despite the use of automated timing methods and a larger sample, our first experiment failed to show priming.",
      },
      {
        id: "e13",
        page: 1,
        excerpt: "debriefing was suggestive of awareness of the primes.",
      },
      {
        id: "r1",
        page: 3,
        excerpt:
          "The results show no significant difference between the Prime (M = 6.270 SD = 2.15) and the No-Prime group (M = 6.390 SD = 1.11) in the time necessary to walk along the hallway after the priming manipulation (F (1, 119),1, g2 = .01). Awareness of the prime. No participant reported having noticed anything unusual about the scrambled sentences task. Four participants (6.66%) in the Prime condition reported that the sentences were related to the stereotype of old persons.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Compare the design",
        type: "single",
        prompt:
          "What does automated timing change about the first priming comparison?",
        evidence: [
          "Participants received an age-related or neutral sentence task, and walking time was measured by infrared timing.",
        ],
        options: [
          {
            id: "o1",
            text: "It reduces reliance on a human’s timing judgement without itself assigning the prime.",
          },
          {
            id: "o2",
            text: "It makes experimenter expectations impossible in every part of the study.",
          },
          {
            id: "o3",
            text: "It changes the treatment from sentence content to a randomized age of participants.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "Automating timing does not remove all possible experimenter–participant interactions.",
          o3: "Timing is measurement; the prime contrast concerns the sentence task.",
        },
        explanation:
          "The independent contrast is sentence priming; the infrared device is an outcome-measurement safeguard, not the treatment.",
        refs: ["e1", "e4"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Compare the design",
        type: "single",
        prompt:
          "Why separately manipulate the experimenter’s expectation of slower or faster walking?",
        evidence: [
          "In Experiment 2, experimenters were given different directional expectations before testing participants.",
        ],
        options: [
          {
            id: "o2",
            text: "To ensure participants deliberately selected their own experimental prime condition.",
          },
          {
            id: "o1",
            text: "To test whether the observed prime contrast depends on experimenter expectations.",
          },
          {
            id: "o3",
            text: "To prove that any observed walking effect must be an unconscious mimicry mechanism.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "The manipulation concerns experimenters’ expectations, not participant self-assignment.",
          o3: "Expectation dependence does not uniquely identify how cues reached participants.",
        },
        explanation:
          "This probes an experimenter-related boundary on the prime contrast. The precise interpersonal mechanism still needs evidence.",
        refs: ["e6", "e10"],
        writtenReasoning: false,
        reveal: "design",
        scene: {
          version: 1,
          title: "Experimenters receive different expectations",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "Experimenters receive different expectations",
          provenance: {
            kind: "source-summary",
            refs: ["e6"],
            note: "Study information paraphrased from the cited source.",
          },
          responses: [
            {
              optionId: "o2",
              label:
                "To ensure participants deliberately selected their own experimental prime condition.",
              targetIds: ["row0", "row1"],
            },
            {
              optionId: "o1",
              label:
                "To test whether the observed prime contrast depends on experimenter expectations.",
              targetIds: ["row0", "row1"],
            },
            {
              optionId: "o3",
              label:
                "To prove that any observed walking effect must be an unconscious mimicry mechanism.",
              targetIds: ["row0", "row1"],
            },
          ],
          resolution: null,
          kind: "matrix",
          conditions: [
            {
              id: "condition0",
              label: "Expect slower walking",
            },
            {
              id: "condition1",
              label: "Expect faster walking",
            },
          ],
          rows: [
            {
              id: "row0",
              label: "Instruction",
              detail: "Reported features of each condition.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e6"],
                note: "Study information paraphrased from the cited source.",
              },
              cells: [
                "Primed participants may slow down",
                "Primed participants may speed up",
              ],
            },
            {
              id: "row1",
              label: "Outcome",
              detail: "Reported features of each condition.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e6"],
                note: "Study information paraphrased from the cited source.",
              },
              cells: ["Walking performance", "Walking performance"],
            },
          ],
        },
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Interpret the result",
        type: "single",
        prompt:
          "Experiment 1 reports mean walking times 6.270 and 6.390 seconds, with F < 1. Which reading is justified?",
        evidence: [
          "The Prime and No-Prime comparison was not statistically significant. These values measure time, not speed units.",
        ],
        options: [
          {
            id: "o2",
            text: "The prime reliably slowed walking because its displayed walking time is larger.",
          },
          {
            id: "o3",
            text: "The groups are proven identical because a nonsignificant F test is an equivalence test.",
          },
          {
            id: "o1",
            text: "No clear difference was detected; the small point difference is not proof of equivalence.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "Its point mean is actually lower, and the contrast was not significant.",
          o3: "Nonsignificance alone does not establish equivalence.",
        },
        explanation:
          "The paper prints F(1,119) < 1 and η² = .01, not a missing F statistic. A lower time would mean faster, not slower, walking; this contrast did not detect a reliable difference.",
        refs: ["r1"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Interpret the result",
        type: "single",
        prompt:
          "An effect appeared under slower-walking expectations but not universally across expectations. What does that challenge?",
        evidence: [
          "Experiment 1 did not detect the effect; Experiment 2 introduced directional experimenter expectations.",
        ],
        options: [
          {
            id: "o1",
            text: "A claim that the same prime works independently of the testing context.",
          },
          {
            id: "o2",
            text: "A claim that every participant’s behaviour was necessarily driven by conscious deception.",
          },
          {
            id: "o3",
            text: "A claim that precise timing can ever be useful in a behavioural experiment.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "The result does not establish conscious motives in each participant.",
          o3: "Timing safeguards remain useful even when the effect depends on context.",
        },
        explanation:
          "The conditional pattern limits a context-independent priming interpretation. It does not resolve the mechanism or every expectancy condition.",
        refs: ["e10"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Bound the conclusion",
        type: "single",
        prompt:
          "What would be a reasonable response to the failed first replication?",
        evidence: [
          "The first experiment used automated timing and did not reproduce the expected slowing pattern.",
        ],
        options: [
          {
            id: "o2",
            text: "Declare all behavioural priming false from one outcome and one attempted replication.",
          },
          {
            id: "o1",
            text: "Test robustness and procedural boundaries rather than declare every priming effect impossible.",
          },
          {
            id: "o3",
            text: "Discard the null and report only the original positive result as established fact.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "One study cannot disprove every effect in a broader research class.",
          o3: "Ignoring contrary evidence prevents a fair assessment of robustness.",
        },
        explanation:
          "The null is evidence about replicability under these procedures. It neither settles every priming claim nor justifies suppressing the failed replication.",
        refs: ["e2", "e3", "e4"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: {
          version: 1,
          title: "Two changes in the replication",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "Two changes in the replication",
          provenance: {
            kind: "source-summary",
            refs: ["e2", "e4"],
            note: "Study information paraphrased from the cited source.",
          },
          responses: [
            {
              optionId: "o2",
              label:
                "Declare all behavioural priming false from one outcome and one attempted replication.",
              targetIds: ["earlier", "replication", "inference"],
            },
            {
              optionId: "o1",
              label:
                "Test robustness and procedural boundaries rather than declare every priming effect impossible.",
              targetIds: ["earlier", "replication", "inference"],
            },
            {
              optionId: "o3",
              label:
                "Discard the null and report only the original positive result as established fact.",
              targetIds: ["earlier", "replication", "inference"],
            },
          ],
          resolution: null,
          kind: "flow",
          nodes: [
            {
              id: "earlier",
              label: "Earlier experiments",
              detail: "Smaller combined sample and manual timing.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e2", "e4"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 0,
            },
            {
              id: "replication",
              label: "Replication safeguards",
              detail: "Larger sample and automated timing.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e2", "e4"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 0,
            },
            {
              id: "inference",
              label: "Interpreting a difference",
              detail: "Both sampling variation and methods need consideration.",
              at: "resolution",
              provenance: {
                kind: "authored",
                refs: ["e2", "e4"],
                note: "Authored reasoning guidance based on the source; not a measured causal mechanism.",
              },
              column: 0,
            },
          ],
          edges: [
            {
              from: "earlier",
              to: "replication",
              label: "compare methods",
              at: "setup",
            },
            {
              from: "replication",
              to: "inference",
              label: "weigh the evidence",
              at: "resolution",
            },
          ],
        },
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Bound the conclusion",
        type: "single",
        prompt:
          "Does the expectation-dependent result identify unconscious mimicry as the unique mechanism?",
        evidence: [
          "The discussion proposes that experimenters’ expectations may be communicated through their behaviour.",
        ],
        options: [
          {
            id: "o2",
            text: "Yes; once a result depends on expectations, no other interpersonal pathway is possible.",
          },
          {
            id: "o3",
            text: "Yes; forced-choice awareness checks prove every participant had no awareness of the primes.",
          },
          {
            id: "o1",
            text: "No; it motivates testing that pathway rather than proving it uniquely.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Separate what was measured from the conclusion the question asks you to draw.",
        misconceptions: {
          o2: "Dependence on expectations does not uniquely identify the mediating process.",
          o3: "The debriefing raised awareness concerns rather than eliminating them.",
        },
        explanation:
          "The paper discusses possible expectancy communication and awareness. A mechanism claim requires more than observing a condition-dependent outcome.",
        refs: ["e9", "e10"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: null,
      },
    ],
    bonus: null,
  },
  takeaway:
    "Experiment 1 did not reproduce a clear prime-related walking-time difference. Experiment 2 found a pattern dependent on experimenter expectations. That challenges a context-independent priming account while leaving expectancy communication and awareness as issues to investigate. The paper’s discussion does contain substantive caveats.",
};
