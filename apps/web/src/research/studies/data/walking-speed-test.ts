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
        title: "Measurement versus treatment",
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
            text: "It reduces expectation effects by controlling how the sentence task is assigned.",
          },
          {
            id: "o3",
            text: "It provides a within-person estimate by comparing each person’s prime and no-prime outcomes.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "A timing device records an outcome; ask what was assigned to create the prime comparison.",
        misconceptions: {
          o2: "Infrared timing concerns outcome measurement, not assignment of sentence content.",
          o3: "An automated outcome measure does not give each participant both treatment conditions.",
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
        title: "Test expectancy dependence",
        type: "single",
        prompt:
          "Why separately manipulate the experimenter’s expectation of slower or faster walking?",
        evidence: [
          "In Experiment 2, experimenters were given different directional expectations before testing participants.",
        ],
        options: [
          {
            id: "o2",
            text: "To compare stopwatch accuracy while keeping experimenters unaware of a predicted direction.",
          },
          {
            id: "o1",
            text: "To test whether the observed prime contrast depends on experimenter expectations.",
          },
          {
            id: "o3",
            text: "To estimate the average sentence-prime effect after pooling over experimenter expectations.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Identify whose expectations were changed and which contrast that manipulation makes possible.",
        misconceptions: {
          o2: "Experimenters were given directional expectations; that manipulation was not simply a blinded stopwatch check.",
          o3: "The separate expectation conditions test dependency on expectations; pooling can obscure that dependency.",
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
                "To compare stopwatch accuracy while keeping experimenters unaware of a predicted direction.",
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
                "To estimate the average sentence-prime effect after pooling over experimenter expectations.",
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
        title: "Read time and uncertainty",
        type: "single",
        prompt:
          "Experiment 1 reports Prime = 6.270 seconds and No-Prime = 6.390 seconds, with F < 1. Which reading is justified?",
        evidence: [
          "The outcome is the time taken to traverse the hallway, measured with infrared timing.",
        ],
        options: [
          {
            id: "o2",
            text: "The Prime group walked more slowly because its reported time was higher than the No-Prime group.",
          },
          {
            id: "o3",
            text: "The nonsignificant difference supports treating the groups as equivalent for practical purposes.",
          },
          {
            id: "o1",
            text: "No clear difference was detected; the small point difference is not proof of equivalence.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "A smaller time means faster travel; a nonsignificant comparison is not proof of equivalence.",
        misconceptions: {
          o2: "The displayed Prime mean is lower, not higher; less time over the same distance corresponds to faster travel.",
          o3: "A nonsignificant difference test without a stated equivalence range does not establish practical equivalence.",
        },
        explanation:
          "The reported F(1,119) < 1 and small η² do not establish a clear difference. A lower walking time would mean faster, not slower, travel; the point contrast is not an equivalence result.",
        refs: ["r1"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Check context independence",
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
            text: "A claim that manual timing error alone accounts for the expectation-dependent result.",
          },
          {
            id: "o3",
            text: "A claim that experimenter expectations have the same consequence in prime and no-prime conditions.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Would a result conditional on testing context justify a claim that context never matters?",
        misconceptions: {
          o2: "The finding limits a context-independent prime interpretation, while it does not isolate manual timing error as the sole explanation.",
          o3: "An overall consequence of expectations is different from the question of whether a prime effect is independent of testing context.",
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
        title: "Respond to a failed replication",
        type: "single",
        prompt:
          "What would be a reasonable response to the failed first replication?",
        evidence: [
          "The first experiment used automated timing and did not reproduce the expected slowing pattern.",
        ],
        options: [
          {
            id: "o2",
            text: "Treat the larger replication as a replacement for the original and conclude the effect has reversed.",
          },
          {
            id: "o1",
            text: "Test robustness and procedural boundaries rather than declare every priming effect impossible.",
          },
          {
            id: "o3",
            text: "Average the two reports’ p-values and use the result to decide whether priming is reliable.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Keep this protocol’s evidence separate from a universal claim about all priming effects.",
        misconceptions: {
          o2: "The reported null does not establish a reversal; comparing results and testing procedural boundaries is more defensible.",
          o3: "Averaging p-values is not a robustness analysis or an effect-size synthesis.",
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
                "Treat the larger replication as a replacement for the original and conclude the effect has reversed.",
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
                "Average the two reports’ p-values and use the result to decide whether priming is reliable.",
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
        title: "Test an interpersonal mechanism",
        type: "single",
        prompt:
          "Does the expectation-dependent result identify unconscious mimicry as the unique mechanism?",
        evidence: [
          "The discussion proposes that experimenters’ expectations may be communicated through their behaviour.",
        ],
        options: [
          {
            id: "o2",
            text: "Yes; the direction-specific result separates mimicry from other forms of expectancy communication.",
          },
          {
            id: "o3",
            text: "Yes; the awareness check distinguishes an unconscious effect from any demand-related explanation.",
          },
          {
            id: "o1",
            text: "No; it motivates testing that pathway rather than proving it uniquely.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Dependence on expectations does not uniquely identify how they reached participants.",
        misconceptions: {
          o2: "Expectation dependency can motivate mimicry as a hypothesis without distinguishing it from alternative pathways.",
          o3: "An awareness measure does not by itself isolate the mechanism behind the conditional outcome.",
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
