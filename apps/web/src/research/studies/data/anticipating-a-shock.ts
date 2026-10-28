// Originally generated 2026-10-25; source-checked question revision 2026-10-28.
// Source paper: docs/research/papers/muller-2022-anxiety-political-attitudes.pdf
// Agent source review is not content-owner approval; see PREPARED_STUDY_REVIEW.md.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-anticipating-a-shock",
    title: "Investigating the Effect of State Anxiety on Political Attitudes",
    briefing:
      "You will examine how the study was designed, what results were obtained, and what those results mean for theories linking anxiety to political conservatism.",
    source: "generated",
    paper: {
      title:
        "State anxiety by itself does not change political attitudes: A threat of shock experiment",
      authors: "Müller, Bahnsen & Alpers (2022)",
      journal: "Frontiers in Psychology 13: 1006757",
      url: "https://doi.org/10.3389/fpsyg.2022.1006757",
      limitations: [
        "The pandemic stopped recruitment before the planned sample size (p. 5).",
        "Few right-leaning participants limited subgroup model sensitivity; arousal also declined across later blocks.",
        "No political-threat comparison was included, so a requirement for political context was not directly tested.",
        "Physiological arousal subsided in the later implicit-measure blocks; those null findings need additional manipulation caution (p. 11).",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 1,
        excerpt:
          "Previous research suggests that state anxiety may sway political attitudes.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "we tested the effects of the anxiety induction not only on explicit but also on implicit measures of political attitudes.",
      },
      {
        id: "e3",
        page: 6,
        excerpt:
          "In sum, there is no evidence for the conservative shift hypothesis.",
      },
      {
        id: "e4",
        page: 7,
        excerpt:
          "We explored further possible evidence for the conservative shift hypothesis.",
      },
      {
        id: "e5",
        page: 9,
        excerpt:
          "summarizing, we found evidence for the absence of a conservative shift and an absence of an ideological intensification.",
      },
      {
        id: "e6",
        page: 11,
        excerpt:
          "our results call a relationship between higher levels of state anxiety and more pronounced conservative political attitudes into question",
      },
      {
        id: "e7",
        page: 9,
        excerpt:
          "Our data show that an anxious state by itself does not change political attitudes.",
      },
      {
        id: "e8",
        page: 9,
        excerpt:
          "In this study, we examined the effect of anxiety on explicit and implicit political attitudes, elicited by threat of shock, a well-established experimental anxiety induction. We used established explicit and implicit measures of political attitudes to assess its effect.",
      },
      {
        id: "e9",
        page: 9,
        excerpt:
          "Our study is the first to use a threat of shock anxiety induction to induce anxiety in this line of research.",
      },
      {
        id: "e10",
        page: 9,
        excerpt:
          "Hence, in addition to the conventional explicit measures of political attitudes deployed in previous research, we utilized implicit measures of political attitudes, specifically, a Single Target Implicit Association Test (ST-IAT; Bluemke and Friese, 2008).",
      },
      {
        id: "e11",
        page: 9,
        excerpt:
          "The successful anxiety induction was confirmed by psychometric and physiological data (skin conductance responses and heart rate).",
      },
      {
        id: "e12",
        page: 10,
        excerpt:
          "null results with respect to implicit attitudes might also be due to a no longer successful manipulation at the end of the experiment (as suggested by the manipulation checks). This specifically only concerned the blocks in which implicit attitudes were assessed.",
      },
      {
        id: "e13",
        page: 10,
        excerpt:
          "Moreover, the Bayesian analytical approach supports the absence of any effect of anxiety on political attitudes. This approach revealed that the non-significance of effects resulted from the circumstance that effects were truly null and not from data insensitivity (e.g., due to large standard errors because of small sample size).",
      },
      {
        id: "e14",
        page: 10,
        excerpt:
          "Our findings contribute to the literature by showing that experimentally induced anxiety does not affect political attitudes, at least not by itself. Specifically, we neither find evidence for the conservative shift hypothesis (Jost et al., 2003) nor the ideological intensification hypothesis (Greenberg and Jonas, 2003).",
      },
      {
        id: "r1",
        page: 8,
        excerpt:
          "the Bayes factors in the direction of the null hypothesis were greater than three for six out of the eight measures. These results provided substantive support for the null hypothesis relative to the conservative shift hypothesis. For the test of the ideological intensification hypothesis among the left-leaning participants, the Bayes factors in the direction of the null hypothesis were greater than three for six out of the eight measures. These results again provided substantive support for the null hypothesis relative to the ideological intensification hypothesis. The Bayes factors for the test of the ideological intensification hypothesis among the few right-leaning participants in our sample indicated, unsurprisingly, data insensitivity for six of the eight measures. Hence, the Bayes factors show that the left-leaning participants did not shift to the left under threat while the data did not provide evidence about Block 4: IAT − Right Block 5: IAT − Econ. Cons. Block 1: Left−Right Placement Block 2: SECS Block 3: IAT − Social Cons.",
      },
      {
        id: "r2",
        page: 11,
        excerpt:
          "we found that physiological arousal\nsubsided in later blocks. Since these blocks contained the implicit\nmeasures of political attitudes, our findings regarding the effects\non implicit political attitudes need to be interpreted with caution.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Unbundle threat and content",
        type: "single",
        prompt:
          "Why use threat of electric shock without political content when testing the anxiety explanation?",
        evidence: [
          "Attitudes were assessed under threat or safety, with condition assigned randomly.",
        ],
        options: [
          {
            id: "c1-opt-a",
            text: "To test induced anxiety while reducing the political meanings bundled with other threats.",
          },
          {
            id: "c1-opt-b",
            text: "To establish that every kind of threat has exactly the same political consequences.",
          },
          {
            id: "c1-opt-c",
            text: "To make participants’ pre-existing political beliefs randomly assigned treatments.",
          },
          {
            id: "c1-opt-d",
            text: "To test whether political news causes anxiety using a news-versus-neutral comparison.",
          },
        ],
        accepted: ["c1-opt-a"],
        alternatives: [],
        hint: "Ask what a politically neutral induction holds apart that political threats may combine.",
        misconceptions: {
          "c1-opt-b":
            "One induction does not establish equivalence across all kinds of threat.",
          "c1-opt-c":
            "Threat condition was assigned; participants’ political histories were not.",
          "c1-opt-d":
            "No political-news manipulation was included in this experiment.",
        },
        explanation:
          "Removing political content helps distinguish the state-anxiety account from content-specific threat explanations, within this particular induction.",
        refs: ["e8", "e9"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Compare measurement methods",
        type: "single",
        prompt:
          "Why measure both explicit self-placement and implicit associations?",
        evidence: [
          "Participants gave direct political ratings and completed an ST-IAT task.",
        ],
        options: [
          {
            id: "c2-opt-a",
            text: "To pool the methods into one attitude score for the threat test.",
          },
          {
            id: "c2-opt-c",
            text: "To examine related attitude outcomes assessed by different methods.",
          },
          {
            id: "c2-opt-b",
            text: "To replace political attitudes with physiological arousal as the sole outcome.",
          },
          {
            id: "c2-opt-d",
            text: "To treat a change in one method as a substitute for evidence on the other method.",
          },
        ],
        accepted: ["c2-opt-c"],
        alternatives: [],
        hint: "Think about what direct ratings and response-association tasks each operationalize.",
        misconceptions: {
          "c2-opt-a":
            "The study assessed distinct explicit and implicit outcomes; their inclusion is not itself a justification for pooling them.",
          "c2-opt-b":
            "Physiology checked arousal; the attitude outcomes remained explicit and implicit.",
          "c2-opt-d":
            "Distinct methods can respond differently; a finding on one is not interchangeable evidence for the other.",
        },
        explanation:
          "Using more than one method broadens the operational tests; it does not guarantee identical constructs or universally validate an attitude shift.",
        refs: ["e2", "e10"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c3",
        stage: "Read the design",
        title: "Interpret model evidence",
        type: "single",
        prompt:
          "What question can a Bayes factor address that a nonsignificant p-value alone cannot settle?",
        evidence: [
          "Conventional tests did not detect the predicted attitude differences. The authors also compared specified null and alternative models.",
        ],
        options: [
          {
            id: "c3-opt-a",
            text: "Whether the null is certainly true in every population and induction.",
          },
          {
            id: "c3-opt-c",
            text: "The posterior probability that the null is true, without any prior odds for the competing models.",
          },
          {
            id: "c3-opt-b",
            text: "How the observed data favour one specified model relative to the other.",
          },
          {
            id: "c3-opt-d",
            text: "Whether random assignment guarantees that anxiety changed every participant’s attitudes.",
          },
        ],
        accepted: ["c3-opt-b"],
        alternatives: [],
        hint: "Keep relative support for specified models distinct from certainty that a hypothesis is universally true.",
        misconceptions: {
          "c3-opt-a":
            "Relative model evidence does not establish universal certainty.",
          "c3-opt-c":
            "A Bayes factor is a relative model-evidence ratio; converting it to posterior model odds also needs prior odds.",
          "c3-opt-d": "Assignment does not guarantee the hypothesized outcome.",
        },
        explanation:
          "The Bayes factors compare relative support for specified models and priors. They should not be described as proving a literally true zero effect everywhere.",
        refs: ["e13"],
        writtenReasoning: false,
        reveal: "design",
        scene: {
          version: 1,
          title: "Two questions after a non-significant result",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "Two questions after a non-significant result",
          provenance: {
            kind: "authored",
            refs: ["e13"],
            note: "Authored guide to two interpretations of a non-significant test.",
          },
          responses: [
            {
              optionId: "c3-opt-a",
              label:
                "Whether the null is certainly true in every population and induction.",
              targetIds: ["observed", "small", "uncertain"],
            },
            {
              optionId: "c3-opt-c",
              label:
                "The posterior probability that the null is true, without any prior odds for the competing models.",
              targetIds: ["observed", "small", "uncertain"],
            },
            {
              optionId: "c3-opt-b",
              label:
                "How the observed data favour one specified model relative to the other.",
              targetIds: ["observed", "small", "uncertain"],
            },
            {
              optionId: "c3-opt-d",
              label:
                "Whether random assignment guarantees that anxiety changed every participant’s attitudes.",
              targetIds: ["observed", "small", "uncertain"],
            },
          ],
          resolution: null,
          kind: "flow",
          nodes: [
            {
              id: "observed",
              label: "No clear difference",
              detail: "The classical test does not reject its null.",
              at: "setup",
              provenance: {
                kind: "authored",
                refs: ["e13"],
                note: "Authored guide to two interpretations of a non-significant test.",
              },
              column: 0,
            },
            {
              id: "small",
              label: "Effect close to zero?",
              detail: "One possibility to evaluate.",
              at: "setup",
              provenance: {
                kind: "authored",
                refs: ["e13"],
                note: "Authored guide to two interpretations of a non-significant test.",
              },
              column: 1,
            },
            {
              id: "uncertain",
              label: "Too uncertain to tell?",
              detail: "Another possibility to evaluate.",
              at: "setup",
              provenance: {
                kind: "authored",
                refs: ["e13"],
                note: "Authored guide to two interpretations of a non-significant test.",
              },
              column: 1,
            },
          ],
          edges: [
            {
              from: "observed",
              to: "small",
              label: "possible interpretation",
              at: "setup",
            },
            {
              from: "observed",
              to: "uncertain",
              label: "possible interpretation",
              at: "setup",
            },
          ],
        },
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Successful induction, null outcome",
        type: "single",
        prompt:
          "When anxiety was induced in the explicit blocks but no explicit-attitude difference was detected, what is the narrow conclusion?",
        evidence: [
          "Physiological arousal subsided in the later blocks that contained the implicit measures.",
        ],
        options: [
          {
            id: "c4-opt-a",
            text: "The induction failed merely because the attitude outcome was nonsignificant.",
          },
          {
            id: "c4-opt-c",
            text: "Anxiety can never affect any political belief under any possible threat.",
          },
          {
            id: "c4-opt-d",
            text: "The explicit null is best explained by an unsuccessful manipulation across the whole session.",
          },
          {
            id: "c4-opt-b",
            text: "No explicit shift was detected here; later implicit outcomes carry additional induction uncertainty.",
          },
        ],
        accepted: ["c4-opt-b"],
        alternatives: [],
        hint: "A manipulation check and its proposed downstream consequence test different links in the account.",
        misconceptions: {
          "c4-opt-a":
            "A successful manipulation check and a null outcome can coexist.",
          "c4-opt-c":
            "The study does not test every induction, setting or population.",
          "c4-opt-d":
            "The explicit blocks had evidence of an effective induction; later decline should not be used to relabel the entire manipulation as unsuccessful.",
        },
        explanation:
          "The explicit-block induction did not yield clear evidence of the predicted explicit-attitude shift. The authors caution that arousal subsided in the later implicit blocks. Physiological habituation need not mean all subjective anxiety disappeared, but the implicit nulls require that additional caution.",
        refs: ["e3", "e14", "r2"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c5",
        stage: "Read the results",
        title: "Orient the Bayes factor",
        type: "single",
        prompt:
          "BF01 exceeds 3 for six of eight measures in the main comparison. What is the careful interpretation?",
        evidence: [
          "The ratio is stated in the direction of the null model; evidence was weaker for the small right-leaning subgroup.",
        ],
        options: [
          {
            id: "c5-opt-a",
            text: "Those measures favour the specified null over its alternative, with subgroup limits.",
          },
          {
            id: "c5-opt-b",
            text: "Every participant and subgroup has a proven zero effect because some ratios exceed 3.",
          },
          {
            id: "c5-opt-c",
            text: "The alternative is three times more likely to generate the data because BF01 exceeds 3.",
          },
          {
            id: "c5-opt-d",
            text: "Every outcome has identical evidence because six of eight pass the same threshold.",
          },
        ],
        accepted: ["c5-opt-a"],
        alternatives: [],
        hint: "Check which model is in the numerator and which participants the comparison includes.",
        misconceptions: {
          "c5-opt-b":
            "Aggregate relative evidence does not establish a universal zero effect.",
          "c5-opt-c":
            "BF01 is oriented toward the null; reversing it reverses the comparison.",
          "c5-opt-d":
            "Two outcomes do not meet that threshold, and ratio magnitudes can differ.",
        },
        explanation:
          "The ratios support a model-relative null interpretation for six measures. They do not resolve the underrepresented right-leaning subgroup or every possible political context.",
        refs: ["r1"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Test a context boundary",
        type: "single",
        prompt:
          "Does this experiment establish that anxiety affects attitudes only when a political threat is present?",
        evidence: [
          "The reported induction did not contain political content. Political and nonpolitical threat contents were not experimentally crossed.",
        ],
        options: [
          {
            id: "c6-opt-a",
            text: "Yes; the nonpolitical null can be used to estimate the contribution of political threat content.",
          },
          {
            id: "c6-opt-b",
            text: "No; political context is a possible explanation that needs a direct comparison.",
          },
          {
            id: "c6-opt-c",
            text: "Yes; earlier political-threat findings and this null form a randomized content comparison.",
          },
          {
            id: "c6-opt-d",
            text: "No; the study instead estimates how attitude differences depend on political content.",
          },
        ],
        accepted: ["c6-opt-b"],
        alternatives: [],
        hint: "A claim that one context is necessary needs a comparison involving that context.",
        misconceptions: {
          "c6-opt-a":
            "Political and nonpolitical contents were not experimentally crossed, so this comparison does not identify that contribution.",
          "c6-opt-c":
            "Cross-study differences do not become a randomized content contrast.",
          "c6-opt-d":
            "The study did not manipulate political content, so it does not estimate that dependency either.",
        },
        explanation:
          "The experiment did not include a political-threat condition. Political context is a proposed boundary condition, not a necessary condition established by the nonpolitical result.",
        refs: ["e6", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: null,
      },
    ],
    bonus: null,
  },
  takeaway:
    "Anxiety induction was supported in the explicit blocks, which showed no clear predicted political-attitude shift. Several Bayes factors favoured specified null models, with limited subgroup evidence. Physiological arousal subsided in later implicit blocks, so their nulls need additional caution. Political context remains a proposed explanation requiring a direct comparison.",
};
