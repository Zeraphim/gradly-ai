// Originally generated 2026-10-25; source-checked question revision 2026-10-28.
// Source paper: docs/research/papers/meyers-2020-survival-processing-context.pdf
// Agent source review is not content-owner approval; see PREPARED_STUDY_REVIEW.md.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-imagining-survival-scenarios",
    title: "Effects of Survival Processing on Item and Context Memory",
    briefing:
      "Read the excerpts below and answer the following challenges about the study’s design, results, and interpretation.",
    source: "generated",
    paper: {
      title:
        "Effects of Survival Processing on Item and Context Memory: Enhanced Memory for Survival-Relevant Details",
      authors: "Meyers, McCurdy, Leach et al. (2020)",
      journal: "Frontiers in Psychology 11: 2244",
      url: "https://doi.org/10.3389/fpsyg.2020.02244",
      limitations: [
        "Source context was tied to the encoding-task judgement; other source tasks could behave differently (p. 8).",
        "Implausible colours may introduce distinctiveness; some objects do not clearly convey survival fitness (p. 8).",
        "The design was not built to jointly analyse condition, plausibility and relevance ratings with adequate observations (p. 8).",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 1,
        excerpt:
          "Results indicated better item memory for materials processed in the survival relative to\nmoving condition. Critically, for color context, there was a condition by plausibility interaction,\nwhere memory was best for plausibly colored items in the survival processing condition.\nThere was no difference, however, in source context memory between the survival and\nmoving conditions.",
      },
      {
        id: "e2",
        page: 4,
        excerpt:
          "For item memory, this analysis revealed a marginal main effect for condition, F(1, 19) = 3.92, p = 0.06, η2 = 0.172, that showed that survival items (M = 0.91, SD = 0.08) were better remembered than moving items (M = 0.87, SD = 0.11), regardless of how participants responded to those items.",
      },
      {
        id: "e3",
        page: 7,
        excerpt:
          "an important question is whether these effects may in part\nbe attributable to known memory mechanisms.",
      },
      {
        id: "e4",
        page: 7,
        excerpt:
          "Thus far, we have discussed the item memory and color context survival processing advantage we observed in these data",
      },
      {
        id: "e5",
        page: 7,
        excerpt:
          "Past work on survival processing effects have focused on understanding potential memory mechanisms (e.g., “proximate” mechanisms) that might partially account for the survival processing memory advantage.",
      },
      {
        id: "r1",
        page: 3,
        excerpt:
          "Trials were presented in four alternating mini-blocks of the survival task and moving task (12 items per mini-block; half plausible and half implausible). Within a mini-block, plausible and implausible items were randomly intermixed. Immediately following encoding, participants completed the retrieval phase of the experiment. A total of 72 objects were presented. Of those, 48 were old (studied at encoding), and 24 were new (unstudied) items5. Because we were interested in memory for the color associated with studied items, all items were shown in grayscale during retrieval.",
      },
      {
        id: "r2",
        page: 3,
        excerpt:
          "At encoding, participants were shown a total of 48 objects. Participants studied these objects in one of two encoding conditions: a survival condition and a moving (control) condition. For items presented in the survival processing condition, participants were instructed to rate how relevant each object would be to help them survive in a remote, foreign land without any basic supplies3. For items presented in the moving (control) condition, participants were instructed to judge how relevant each object would be to help them move to, and get settled in, a foreign land4.",
      },
      {
        id: "r3",
        page: 5,
        excerpt:
          "Color context memory estimates for both encoding conditions (survival, moving) were calculated as the proportion of color hits (correct color recognition) out of item hits (correct item recognition), which removes the influence of item memory on the context memory measures (Murnane and Bayen, 1996), as we have done before (Leshikar et al., 2014, 2016; Leshikar and Gutchess, 2015). Results of the color context analysis revealed no main effect of condition, F(1, 26) = 1.17, p = 0.288, η2 = 0.04. There was, however, a main effect of plausibility, F(1, 26) = 23.98, p =< 0.001, η2 = 0.48, reflecting better color memory for high-plausibility items (M = 0.48, SD = 0.28) compared to low (M = 0.21, SD = 0.18). Critically, this main 8We also analyzed item memory by subtracting the false alarm rate to all new items from the hit rate in each encoding condition (i.e., hit rate for each condition minus the overall proportion of new items responded to as “old”). We performed this analysis because it is a more traditional approach to estimating item memory. Results of this analysis showed the same pattern of results.",
      },
      {
        id: "r4",
        page: 5,
        excerpt:
          "Results of the item recognition analysis revealed a main effect of condition, F(1, 26) = 11.09, p = 0.003, η2 = 0.30. This effect was driven by better memory for items processed in the survival (M = 0.92, SD = 0.07) compared to the moving condition (M = 0.86, SD = 0.11) consistent with previous studies (Nairne et al., 2007; Scofield et al., 2018). There was no main effect for plausibility or interaction, Fs < 2.54, ps > 0.128.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Identify both factors",
        type: "single",
        prompt:
          "Which analysis matches the assignment of encoding tasks and colours in this experiment?",
        evidence: [
          "People alternated survival and moving task blocks; objects of both colour-plausibility levels were mixed through the blocks.",
        ],
        options: [
          {
            id: "c1b",
            text: "Model encoding scenario within participants but colour plausibility between independent groups.",
          },
          {
            id: "c1c",
            text: "Model the scenario–colour combinations as independent participant groups.",
          },
          {
            id: "c1a",
            text: "Model encoding scenario and colour plausibility as repeated factors within participants.",
          },
          {
            id: "c1d",
            text: "Model relevance ratings as assigned groups and colour memory as the encoding manipulation.",
          },
        ],
        accepted: ["c1a"],
        alternatives: [],
        hint: "Separate the encoding conditions set by the researcher from the responses measured afterward.",
        misconceptions: {
          c1b: "Participants encountered both plausibility levels as well as both encoding tasks.",
          c1c: "Condition observations repeat within the same participants rather than come from four independent participant groups.",
          c1d: "Ratings and memory responses are measured outcomes, not the two encoding assignments.",
        },
        explanation:
          "The encoding task and colour-plausibility factors both repeat within participants. An analysis should preserve that repeated structure rather than treat the condition observations as independent groups.",
        refs: ["r1", "r2"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Separate memory outcomes",
        type: "single",
        prompt:
          "A participant remembers that an apple was shown but cannot recall its colour or study task. How should these responses be separated?",
        evidence: [
          "The test recorded whether an object was old, its original colour, and its original encoding condition.",
        ],
        options: [
          {
            id: "c2a",
            text: "Success on all three measures, since identifying the object supplies its context.",
          },
          {
            id: "c2b",
            text: "Successful source memory with unsuccessful item memory because an apple was named.",
          },
          {
            id: "c2c",
            text: "Successful colour memory because the apple has a plausible colour in everyday life.",
          },
          {
            id: "c2d",
            text: "Successful item recognition with unsuccessful colour and source context memory.",
          },
        ],
        accepted: ["c2d"],
        alternatives: [],
        hint: "Remembering an object’s identity need not include remembering the context in which it appeared.",
        misconceptions: {
          c2a: "Item recognition does not establish that the contextual details were remembered.",
          c2b: "Source memory concerns the encoding condition, not the identity of the object.",
          c2c: "Knowing a typical colour is not recall of the colour actually presented.",
        },
        explanation:
          "Item identity, colour context and source context are separate outcomes. Context scores were conditionalized on recognized items in the reported analysis.",
        refs: ["e1"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Keep analyses distinct",
        type: "single",
        prompt:
          "A supplementary relevance-rating analysis gives p = .06 for item memory. Which interpretation is warranted?",
        evidence: [
          "This analysis reports means .91 and .87 and F(1,19) = 3.92. It is distinct from the paper’s primary corrected-memory analysis.",
        ],
        options: [
          {
            id: "c3b",
            text: "It falls short of .05 in this analysis; it does not negate every other analysis.",
          },
          {
            id: "c3a",
            text: "It proves no memory advantage because any p-value above .05 establishes zero.",
          },
          {
            id: "c3c",
            text: "It proves a reliable advantage because any numerical mean difference is significant.",
          },
          {
            id: "c3d",
            text: "It is the only item-memory analysis, so the paper’s full conclusion must be a trend.",
          },
        ],
        accepted: ["c3b"],
        alternatives: [],
        hint: "Check what this supplementary test conditions on before treating it as the whole experiment.",
        misconceptions: {
          c3a: "A nonsignificant result is not proof of a zero population difference.",
          c3c: "A difference in means does not by itself meet the stated statistical threshold.",
          c3d: "The paper also reports primary corrected-memory results; those should not be conflated.",
        },
        explanation:
          "The .06 value comes from the supplementary analysis conditioning on relevance-rating categories. The primary corrected-memory analysis reports a significant item-memory effect. The two analyses answer different questions and should be reported separately.",
        refs: ["e2"],
        writtenReasoning: false,
        reveal: "results",
        scene: {
          version: 1,
          title: "Supplementary relevance-rating analysis",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description:
            "Item-memory hit rates in the supplementary relevance-rating analysis",
          provenance: {
            kind: "reported",
            refs: ["e2"],
            note: "Values as printed in the cited excerpt; not individual participant records.",
          },
          responses: [
            {
              optionId: "c3b",
              label:
                "It falls short of .05 in this analysis; it does not negate every other analysis.",
              targetIds: ["survival", "moving"],
            },
            {
              optionId: "c3a",
              label:
                "It proves no memory advantage because any p-value above .05 establishes zero.",
              targetIds: ["survival", "moving"],
            },
            {
              optionId: "c3c",
              label:
                "It proves a reliable advantage because any numerical mean difference is significant.",
              targetIds: ["survival", "moving"],
            },
            {
              optionId: "c3d",
              label:
                "It is the only item-memory analysis, so the paper’s full conclusion must be a trend.",
              targetIds: ["survival", "moving"],
            },
          ],
          resolution: null,
          kind: "comparison",
          measure: "Supplementary item-memory hit rate",
          unit: "proportion",
          min: 0,
          max: 1,
          decimals: 2,
          values: [
            {
              id: "survival",
              label: "Survival processing",
              detail: "Mean item-memory score",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e2"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              value: 0.91,
            },
            {
              id: "moving",
              label: "Moving scenario",
              detail: "Mean item-memory score",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e2"],
                note: "Values as printed in the cited excerpt; not individual participant records.",
              },
              value: 0.87,
            },
          ],
          difference: null,
          prediction: {
            label: "Before inspecting the values, what pattern do you expect?",
            options: ["Similar values", "Different values", "Not sure"],
          },
        },
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Read an interaction",
        type: "single",
        prompt: "What does the colour-memory interaction compare?",
        evidence: [
          "The paper reports high- and low-plausibility colour memory under both survival and moving encoding.",
        ],
        options: [
          {
            id: "c4b",
            text: "Whether both main effects reach significance when the interaction does.",
          },
          {
            id: "c4a",
            text: "Whether the high-versus-low plausibility gap differs between the encoding tasks.",
          },
          {
            id: "c4c",
            text: "Whether colour-memory scores equal item-recognition scores for every participant.",
          },
          {
            id: "c4d",
            text: "Whether all low-plausibility objects are remembered better in the moving condition.",
          },
        ],
        accepted: ["c4a"],
        alternatives: [],
        hint: "An interaction compares differences across levels of another factor, rather than one overall average.",
        misconceptions: {
          c4b: "An interaction is a contrast of differences, not a requirement for two main effects.",
          c4c: "The interaction concerns condition and plausibility within colour memory.",
          c4d: "The reported interaction alone does not establish that specific simple-effect claim.",
        },
        explanation:
          "The paper describes a plausibility advantage in both conditions that is larger in survival. This difference in gaps does not itself establish a zero encoding-condition difference for implausible items.",
        refs: ["r3"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Limit a memory claim",
        type: "single",
        prompt:
          "Can the colour finding be advertised as a benefit for every contextual detail?",
        evidence: [
          "Colour memory showed a condition-by-plausibility interaction; source-context analyses detected no significant effects.",
        ],
        options: [
          {
            id: "c5a",
            text: "Use the colour interaction as the best estimate of a common improvement in contextual memory.",
          },
          {
            id: "c5c",
            text: "Use the null source result to treat source memory as practically equivalent across encoding tasks.",
          },
          {
            id: "c5b",
            text: "No; the measured context outcomes showed different patterns under these conditions.",
          },
          {
            id: "c5d",
            text: "Use the source null to infer a colour-specific mechanism rather than test competing accounts.",
          },
        ],
        accepted: ["c5b"],
        alternatives: [],
        hint: "Compare the outcomes that showed a pattern with those that did not; avoid extending beyond both.",
        misconceptions: {
          c5a: "A colour interaction does not estimate a shared benefit across differently measured context outcomes.",
          c5c: "A nonsignificant source test without equivalence evidence does not establish practical equality.",
          c5d: "The differing outcome pattern does not isolate a unique mechanism for the colour finding.",
        },
        explanation:
          "The results limit a blanket claim of context improvement. They do not establish that survival relevance is the sole causal mechanism or that every source effect is zero.",
        refs: ["e1"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: null,
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Investigate a memory mechanism",
        type: "single",
        prompt:
          "The authors propose item-specific and relational processing as possible explanations. What would distinguish a mechanism test from this pattern alone?",
        evidence: [
          "The study measures memory across encoding tasks and colours; it discusses known memory processes as explanatory possibilities.",
        ],
        options: [
          {
            id: "c6a",
            text: "Rename the observed memory advantage as relational processing and treat the label as evidence.",
          },
          {
            id: "c6c",
            text: "Infer an evolved adaptation solely because survival-themed instructions improved one measure.",
          },
          {
            id: "c6d",
            text: "Ignore plausible alternative processes because an effect appeared in the predicted direction.",
          },
          {
            id: "c6b",
            text: "Directly manipulate or measure a proposed process and test its explanatory role.",
          },
        ],
        accepted: ["c6b"],
        alternatives: [],
        hint: "Which proposal directly examines a process rather than simply renaming the outcome?",
        misconceptions: {
          c6a: "Labelling a pattern does not identify the mechanism producing it.",
          c6c: "This task does not isolate the evolutionary origin of the observed effect.",
          c6d: "A predicted outcome can be compatible with more than one process.",
        },
        explanation:
          "The pattern is compatible with proposed processes, but does not uniquely identify them. A direct process-focused study would address that explanatory gap.",
        refs: ["e3"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: {
          version: 1,
          title: "From an observed pattern to a mechanism",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "From an observed pattern to a mechanism",
          provenance: {
            kind: "source-summary",
            refs: ["e3"],
            note: "Study information paraphrased from the cited source.",
          },
          responses: [
            {
              optionId: "c6a",
              label:
                "Rename the observed memory advantage as relational processing and treat the label as evidence.",
              targetIds: ["pattern", "candidate", "test"],
            },
            {
              optionId: "c6c",
              label:
                "Infer an evolved adaptation solely because survival-themed instructions improved one measure.",
              targetIds: ["pattern", "candidate", "test"],
            },
            {
              optionId: "c6d",
              label:
                "Ignore plausible alternative processes because an effect appeared in the predicted direction.",
              targetIds: ["pattern", "candidate", "test"],
            },
            {
              optionId: "c6b",
              label:
                "Directly manipulate or measure a proposed process and test its explanatory role.",
              targetIds: ["pattern", "candidate", "test"],
            },
          ],
          resolution: null,
          kind: "flow",
          nodes: [
            {
              id: "pattern",
              label: "Observed memory pattern",
              detail:
                "The experiment reports a difference under its conditions.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e3"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 0,
            },
            {
              id: "candidate",
              label: "Candidate memory processes",
              detail:
                "Known memory mechanisms are a question for further work.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e3"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 0,
            },
            {
              id: "test",
              label: "A mechanism test",
              detail: "Teaching proposal: directly test a candidate process.",
              at: "resolution",
              provenance: {
                kind: "authored",
                refs: ["e3"],
                note: "Authored reasoning guidance based on the source; not a measured causal mechanism.",
              },
              column: 0,
            },
          ],
          edges: [
            {
              from: "pattern",
              to: "candidate",
              label: "raises a question",
              at: "setup",
            },
            {
              from: "candidate",
              to: "test",
              label: "requires further evidence",
              at: "resolution",
            },
          ],
        },
      },
    ],
    bonus: null,
  },
  takeaway:
    "The primary analyses supported an item-memory advantage and a colour-memory interaction, but not a source-context advantage. The p = .06 relevance-rating analysis is supplementary and should not replace the primary findings. Different memory measures and potential processing explanations require separate, cautious claims.",
};
