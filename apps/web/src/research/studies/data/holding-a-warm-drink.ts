// Originally generated 2026-10-25; source-checked question revision 2026-10-28.
// Source paper: docs/research/papers/schilder-2014-warmth-perceptual-focus-replication.pdf
// Agent source review is not content-owner approval; see PREPARED_STUDY_REVIEW.md.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-holding-a-warm-drink",
    title:
      "Physical Warmth and Perceptual Focus: A Replication of IJzerman and Semin (2009)",
    briefing:
      "Read the excerpt below about a replication study examining whether physical warmth influences perceptual focus. You will answer a series of challenges about the study’s design, results, and interpretation.",
    source: "generated",
    paper: {
      title:
        "Physical Warmth and Perceptual Focus: A Replication of IJzerman and Semin (2009)",
      authors: "Schilder, IJzerman & Denissen (2014)",
      journal: "PLOS ONE 9(11): e112772",
      url: "https://doi.org/10.1371/journal.pone.0112772",
      limitations: [
        "No neutral-temperature cup condition separates warm increases from cold decreases (pp. 2–3).",
        "The replication changed some procedures and used a campus/public-space sample; broader population and task transfer need testing.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 1,
        excerpt:
          "We sought to replicate a study from our own lab (IJzerman & Semin, 2009), to investigate the reproducibility of the reported effect that physical warmth leads to a greater focus on perceptual relations.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "determine whether differences are due to the effect of the cold mug (temperature decrease), the warm mug (temperature increase), or",
      },
      {
        id: "e3",
        page: 2,
        excerpt:
          "After completing an attachment\nquestionnaire, participants read on their screen that they had to\nhold the paper cup, but were not allowed to drink from the cup (to\navoid any confounding influences). In keeping our cover story\ncredible, participants had to evaluate the attractiveness of the cup\nby answering three statements (e.g., ‘I find this an attractive mug’;\neffects were not significant, all ps..33) and one open question\n(‘What would you like to change about his mug’). After answering\nthese ‘consumer questions’, a perceptual focus task was presented.\nThe perceptual focus task was modeled after Kimchi and Palmer’s\n[21], as used by IJ&S, see Figure 1.",
      },
      {
        id: "e4",
        page: 1,
        excerpt:
          "We chose to replicate a study of our own lab that deals with a\nreal warm cue, namely IJ&S’ Study 3.",
      },
      {
        id: "e5",
        page: 2,
        excerpt:
          "A limitation is that neither study included a neutral condition (e.g., a mug with water that has room temperature). This way, it is not possible to",
      },
      {
        id: "r1",
        page: 2,
        excerpt:
          "attractiveness of the cup by answering three statements (e.g., ‘I find this an attractive mug’; effects were not significant, all ps..33) and one open question (‘What would you like to change about his mug’). After answering these ‘consumer questions’, a perceptual focus task was presented. The perceptual focus task was modeled after Kimchi and Palmer’s [21], as used by IJ&S, see Figure 1. We tested participants’ suspicion towards the manipulation with one open question at the end. Finally, the experimenter thanked and debriefed participants upon completing the questionnaire. Results Data were analyzed with the use of SPSS 19.",
      },
      {
        id: "r2",
        page: 2,
        excerpt:
          "The analysis confirmed that ‘‘warm’’ partic- ipants had a greater relational perspective than ‘‘cold’’ partici- pants, sr = .33, t(125) = 3.84, p,.01, B = 0.34. We found similar results without gender as a covariate (Cohen’s d = .60, t(126) = 3.54, p,.01). Controlling for gender, the residualized means and standard errors were M = 1.69, SE = .03, 95% CI [1.63, 1.76] for the ‘warm’ participants and M = 1.51, SE = .03, 95% CI [1.44; 1.58] for the ‘cold’ participants. In the original IJ&S study, residualized means and standard errors (controlling for gender) were, M = 1.69, SE = .03, 95% CI [1.64, 1.75] for the ‘warm’ participants and M = 1.61, SE = .02, 95% CI [1.56, 1.66], for the ‘cold’ participants. Our findings thus replicate IJ&S’ findings that a simple cue of warmth makes people more likely to adopt a relational perspective.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Purpose of blinding",
        type: "single",
        prompt:
          "Why keep the participant-facing experimenter unaware of the mug temperature?",
        evidence: [
          "One experimenter prepared the temperature condition; a second gave instructions without that information.",
        ],
        options: [
          {
            id: "o2",
            text: "To stop participants from feeling whether their own cup was warm or cold.",
          },
          {
            id: "o3",
            text: "To make the first experimenter unaware of which temperature was prepared.",
          },
          {
            id: "o4",
            text: "To guarantee that every remaining source of measurement bias was absent.",
          },
          {
            id: "o1",
            text: "To reduce condition-linked cues in the participant-facing instructions.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which route for condition-linked cues is reduced when the person giving instructions lacks that information?",
        misconceptions: {
          o2: "Experimenter blinding does not remove participants’ sensory experience.",
          o3: "The preparer knew the temperature; the second experimenter was blind.",
          o4: "One blinding safeguard does not eliminate all possible bias.",
        },
        explanation:
          "The procedure reduces a route for experimenter expectancy cues. It is not double-blinding of both experimenters and participants.",
        refs: ["e3"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Purpose of assignment",
        type: "single",
        prompt:
          "Why does random temperature assignment matter for interpreting a warm–cold contrast?",
        evidence: [
          "The preparer allocated participants to warm or cold cups out of the other experimenter’s sight.",
        ],
        options: [
          {
            id: "o5",
            text: "It reduces systematic pre-existing differences between the temperature groups.",
          },
          {
            id: "o6",
            text: "It controls expectancy cues in the participant instructions without requiring blinding.",
          },
          {
            id: "o7",
            text: "It addresses volunteer-to-population selection in the same way as random sampling.",
          },
          {
            id: "o8",
            text: "It makes the post-assignment exclusion procedure a baseline balance check.",
          },
        ],
        accepted: ["o5"],
        alternatives: [],
        hint: "Randomization concerns pre-existing group differences, not the range of settings to which results transfer.",
        misconceptions: {
          o6: "Assignment targets pre-existing group differences; blinding separately reduces condition-linked instruction cues.",
          o7: "Random assignment and probability sampling address different problems.",
          o8: "Exclusions occur after recruitment and require their own assessment; assignment does not turn them into a balance check.",
        },
        explanation:
          "Random assignment strengthens the within-study comparison while leaving sampling, exclusions and population transfer as separate concerns.",
        refs: ["e3"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "What a null check leaves open",
        type: "single",
        prompt:
          "Cup-attractiveness comparisons had all p > .33. Does that prove attractiveness played no role?",
        evidence: [
          "The consumer questions preceded the perceptual-focus task. The reported attractiveness contrasts were nonsignificant.",
        ],
        options: [
          {
            id: "o10",
            text: "Yes; p above .33 proves the temperature groups had exactly equal attractiveness ratings.",
          },
          {
            id: "o9",
            text: "No; no difference was detected, but equivalence or mediation was not established.",
          },
          {
            id: "o11",
            text: "Yes; a null contrast is a direct test ruling out every possible mediator.",
          },
          {
            id: "o12",
            text: "No; those p-values instead demonstrate a significant attractiveness effect at .05.",
          },
        ],
        accepted: ["o9"],
        alternatives: [],
        hint: "Distinguish an undetected contrast from a test of equivalence or a causal mediator.",
        misconceptions: {
          o10: "Nonsignificance does not establish equivalence.",
          o11: "A group contrast is not a complete causal mediation analysis.",
          o12: "Values above .33 are not below the .05 threshold.",
        },
        explanation:
          "The attractiveness comparisons did not detect a difference (all p > .33). That does not establish equivalence or rule out every possible role of attractiveness in a causal pathway.",
        refs: ["r1"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Disclose the exclusions",
        type: "single",
        prompt:
          "Why should the report disclose that 17 of 145 recruits were excluded?",
        evidence: [
          "Six were excluded for suspicion and eleven for not being native Dutch speakers, leaving 128.",
        ],
        options: [
          {
            id: "o14",
            text: "Because any exclusion proves that the randomization was deliberately fraudulent.",
          },
          {
            id: "o15",
            text: "Because the final 128 are automatically a nationally representative probability sample.",
          },
          {
            id: "o13",
            text: "Readers need to know the analysed population and assess the exclusion procedure.",
          },
          {
            id: "o16",
            text: "Because excluded participants can be counted as if their outcomes confirmed the effect.",
          },
        ],
        accepted: ["o13"],
        alternatives: [],
        hint: "Ask what readers need to assess about the analysed population and how it was selected.",
        misconceptions: {
          o14: "Exclusions need scrutiny, but their presence alone does not establish misconduct.",
          o15: "Exclusions and a final sample count do not create representative recruitment.",
          o16: "Unanalysed outcomes cannot simply be assumed to support a result.",
        },
        explanation:
          "Clear exclusions let readers assess the analysed sample and possible selection issues. The reasons and counts do not themselves prove the result true or false.",
        refs: ["e3"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Goal versus observed result",
        type: "single",
        prompt:
          "What supports the claimed replication beyond the fact that the researchers intended to replicate it?",
        evidence: [
          "The results report a higher relational-focus score after a warm cup than after a cold cup; without the gender covariate, d = .60.",
        ],
        options: [
          {
            id: "o18",
            text: "The stated replication aim alone establishes the predicted result before any data analysis.",
          },
          {
            id: "o19",
            text: "A result in one perceptual task establishes that all warm experiences improve social behaviour.",
          },
          {
            id: "o20",
            text: "The contrast establishes that cold must reduce focus below a neutral baseline.",
          },
          {
            id: "o17",
            text: "The observed warm–cold contrast supports the tested directional prediction in this task.",
          },
        ],
        accepted: ["o17"],
        alternatives: [],
        hint: "Identify the empirical contrast rather than treating a stated research aim as its own confirmation.",
        misconceptions: {
          o18: "An aim is not an empirical result.",
          o19: "The outcome and induction do not cover every behaviour or warmth experience.",
          o20: "No neutral condition was present to identify that component.",
        },
        explanation:
          "The actual results report a higher relational-focus score after warm than cold cups. This supports the directional prediction in that task, while the missing neutral cup leaves the components of the contrast unresolved.",
        refs: ["r2"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: null,
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Add a neutral reference",
        type: "single",
        prompt:
          "Which extra comparison would separate a warm-cup increase from a cold-cup decrease?",
        evidence: [
          "Participants briefly held an assigned cup before completing a perceptual-focus task.",
        ],
        options: [
          {
            id: "o21",
            text: "Add a room-temperature cup under otherwise comparable procedures.",
          },
          {
            id: "o22",
            text: "Increase the sample at the same two temperatures, keeping the design.",
          },
          {
            id: "o23",
            text: "Compare the warm group to the grand mean and call that a neutral untreated condition.",
          },
          {
            id: "o24",
            text: "Remove blinding so the experimenter can infer the direction of each temperature effect.",
          },
        ],
        accepted: ["o21"],
        alternatives: [],
        hint: "Which additional condition would locate both tested temperatures relative to the same baseline?",
        misconceptions: {
          o22: "More precision in the same contrast does not identify either temperature’s change from neutral.",
          o23: "A mean of treated groups is not an independently observed neutral condition.",
          o24: "Unblinding does not supply the missing reference condition.",
        },
        explanation:
          "A neutral condition would locate each tested temperature relative to a common reference. The current warm–cold difference does not identify which component drives it.",
        refs: ["e5", "e2", "e3"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: {
          version: 1,
          title: "The temperature comparison",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "The temperature comparison",
          provenance: {
            kind: "source-summary",
            refs: ["e2", "e3", "e5"],
            note: "Study information paraphrased from the cited source.",
          },
          responses: [
            {
              optionId: "o21",
              label:
                "Add a room-temperature cup under otherwise comparable procedures.",
              targetIds: ["row0", "row1"],
            },
            {
              optionId: "o22",
              label:
                "Increase the sample at the same two temperatures, keeping the design.",
              targetIds: ["row0", "row1"],
            },
            {
              optionId: "o23",
              label:
                "Compare the warm group to the grand mean and call that a neutral untreated condition.",
              targetIds: ["row0", "row1"],
            },
            {
              optionId: "o24",
              label:
                "Remove blinding so the experimenter can infer the direction of each temperature effect.",
              targetIds: ["row0", "row1"],
            },
          ],
          resolution: null,
          kind: "matrix",
          conditions: [
            {
              id: "condition0",
              label: "Warm cup",
            },
            {
              id: "condition1",
              label: "Cold cup",
            },
          ],
          rows: [
            {
              id: "row0",
              label: "Exposure",
              detail: "Reported features of each condition.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e2", "e3", "e5"],
                note: "Study information paraphrased from the cited source.",
              },
              cells: ["Hold without drinking", "Hold without drinking"],
            },
            {
              id: "row1",
              label: "Later task",
              detail: "Reported features of each condition.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e2", "e3", "e5"],
                note: "Study information paraphrased from the cited source.",
              },
              cells: ["Perceptual focus", "Perceptual focus"],
            },
          ],
        },
      },
    ],
    bonus: null,
  },
  takeaway:
    "The study reported a greater relational focus after warm versus cold cups, consistent with its directional replication prediction. That contrast is supported by results, not merely by the stated aim. Without a neutral cup, it cannot separate a warm-induced increase from a cold-induced decrease.",
};
