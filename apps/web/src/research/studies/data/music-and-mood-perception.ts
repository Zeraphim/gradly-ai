// Originally generated 2026-10-25; source-checked question revision 2026-10-28.
// Source paper: docs/research/papers/smit-2022-major-minor-png.pdf
// Agent source review is not content-owner approval; see PREPARED_STUDY_REVIEW.md.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-music-and-mood-perception",
    title:
      "Emotional responses in Papua New Guinea show negligible evidence for a universal effect of major versus minor music",
    briefing: "",
    source: "generated",
    paper: {
      title:
        "Emotional responses in Papua New Guinea show negligible evidence for a universal effect of major versus minor music",
      authors: "Smit, Milne, Sarvasy et al. (2022)",
      journal: "PLOS ONE 17(6): e0269597",
      url: "https://doi.org/10.1371/journal.pone.0269597",
      limitations: [
        "Listener groups differed in existing experience; culture and exposure were not randomly assigned (pp. 5–6).",
        "Questionnaire data could not reliably separate musical familiarity from learned emotional associations (p. 12).",
        "Uncertain estimates in the minimally exposed group do not rule out a universal effect (p. 3).",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 1,
        excerpt:
          "Bayesian analyses show that, for cadences, there is strong evidence that greater happiness was reported for major than minor in every community except one: the community with minimal exposure to Western-like music. For melodies, there is strong evidence that greater happiness was reported for those with higher mean pitch (major melodies) than those with lower mean pitch (minor melodies) in only one of the three PNG communities and in both Sydney groups.",
      },
      {
        id: "e2",
        page: 3,
        excerpt:
          "To ascertain whether any of these features are mediated through universal mecha-\nnisms, we conducted an identical experiment in five remote PNG communities (with partici-\npants from seven different villages) with limited but differential experience of Western music,\nand in two Sydney cohorts with considerable, but still differing, levels of experience with West-\nern or Western-like music.",
      },
      {
        id: "e3",
        page: 5,
        excerpt:
          "Negligible evidence for a universal effect of major versus minor music",
      },
      {
        id: "e4",
        page: 7,
        excerpt:
          "Negligible evidence for a universal effect of major versus minor music",
      },
      {
        id: "e5",
        page: 9,
        excerpt:
          "Negligible evidence for a universal effect of major versus minor music",
      },
      {
        id: "e6",
        page: 11,
        excerpt:
          "Negligible evidence for a universal effect of major versus minor music",
      },
      {
        id: "e7",
        page: 15,
        excerpt:
          "H1—Cadence type: The effect of Maj to Min compared to Min to Maj, adjusting for mean pitch and timbre.",
      },
      {
        id: "e8",
        page: 17,
        excerpt:
          "they are smaller in the Lutheran and SDA groups, which have some exposure to Western or Western-like music but not its conventional associations; and smaller still in the group with minimal exposure to Western-like music.",
      },
      {
        id: "e9",
        page: 4,
        excerpt:
          "The first participant group completing the experiment comprised inhabitants of Towet vil-\nlage, in the Uruwa River Valley, Saruwaged Mountains, Morobe Province, PNG, and were\ntested during a three-week field trip to the area. After the research team left, local research\nassistants hiked to the villages of Mup, Mitmit, Kotet, and Yawan, and repeated the experiment\non participants from those villages as well as from Bembe and Worin.",
      },
      {
        id: "e10",
        page: 16,
        excerpt:
          "In sum, we find no evidence for a universal effect of major harmony or melody inducing greater reported happiness than minor.",
      },
      {
        id: "r1",
        page: 7,
        excerpt:
          "They were presented in these different keys to disambiguate any effect of mean pitch from any effect of cadence type (major versus minor). Out of all possible ordered pairs from the above set, each participant heard one of two subsets of 12, each of which ensured every key was heard the same number of times. Three melodic subjects (melodies specified by scale degree rather than pitch) were presented in 6 different modes of the diatonic scale (Phry- gian, Æolian, Dorian, Mixolydian, Ionian, Lydian, listed from lowest to highest mean pitch or, equivalently, from most minor to most major) to test whether mean pitch impacts valence in a melodic context. Every mode had the same tonic, which was asserted with a low C octave sounding simultaneously with the melodies, and every melody ending on that pitch class. Each trial was a sequence of two versions of the same melodic subject, each in one of those modes. All 30 ordered pairs of distinct modes were used.",
      },
      {
        id: "r2",
        page: 5,
        excerpt:
          "Based on these predictions, we tested the following hypotheses on self-reported happiness for each group of participants: 1. A positive effect of major versus minor for cadences only, adjusting for mean pitch. 2. A positive effect of an increase in mean pitch for cadences only, adjusting for major versus minor. 3. A positive effect of an increase in mean pitch for melodies only. 4. A positive effect of an increase in mean pitch on cadences and melodies combined. Methods Participants (Uruwa River Valley, Papua New Guinea) The first participant group consisted of adults (above 18 years old) tested in the Uruwa River Valley, Saruwaged Mountains, Morobe Province, Papua New Guinea.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Stimulus versus listener history",
        type: "single",
        prompt:
          "Why should differences between the listening-history groups be treated differently from differences between the musical stimuli?",
        evidence: [
          "People from PNG communities and Sydney groups judged pairs of musical examples. Groups differed in prior exposure to Western-like music.",
        ],
        options: [
          {
            id: "optB",
            text: "Every observed community difference is a randomized effect of Western musical exposure.",
          },
          {
            id: "optA",
            text: "Stimuli can be varied within the task; people’s cultural histories were not randomly assigned.",
          },
          {
            id: "optC",
            text: "Listening-history differences can be estimated as within-person changes by comparing the existing groups.",
          },
          {
            id: "optD",
            text: "All group differences must be caused by age because cultural exposure cannot vary.",
          },
        ],
        accepted: ["optA"],
        alternatives: [],
        hint: "Ask which features the experiment could vary and which participants brought with them.",
        misconceptions: {
          optB: "The researchers did not randomly assign lifetime musical exposure.",
          optC: "The groups differ between people and communities; comparing them does not observe a person’s change in listening history.",
          optD: "Exposure histories varied; no single measured group characteristic is proven causal.",
        },
        explanation:
          "The study varies stimulus properties experimentally but compares existing listener groups. Its exposure gradient cannot by itself isolate cultural learning as the cause.",
        refs: ["e2"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Separate musical features",
        type: "single",
        prompt:
          "Why distinguish the cadence major/minor hypothesis from a mean-pitch hypothesis?",
        evidence: [
          "A cadence’s mode and the average pitch of its notes can vary together. The paper specifies separate adjusted hypotheses.",
        ],
        options: [
          {
            id: "optA",
            text: "They are mathematically identical descriptions, so separating them adds no information.",
          },
          {
            id: "optB",
            text: "Separating hypotheses makes the listeners’ cultural backgrounds randomly assigned.",
          },
          {
            id: "optD",
            text: "An apparent mode effect could partly reflect pitch unless the two are distinguished.",
          },
          {
            id: "optC",
            text: "A preregistered hypothesis guarantees that the corresponding result will be significant.",
          },
        ],
        accepted: ["optD"],
        alternatives: [],
        hint: "Two properties can covary even when researchers want to explain their effects separately.",
        misconceptions: {
          optA: "The hypotheses and stimulus construction distinguish mode from mean pitch.",
          optB: "Stimulus contrasts cannot randomize participants’ prior histories.",
          optC: "Preregistration states an intended test, not a guaranteed outcome.",
        },
        explanation:
          "The paper tests major/minor and mean-pitch effects separately, including adjustment in the cadence models. They are related stimulus features, not interchangeable explanations.",
        refs: ["r2"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c3",
        stage: "Read the design",
        title: "Avoid a stimulus confound",
        type: "single",
        prompt:
          "What problem would arise if all major cadences were higher-pitched than all minor cadences?",
        evidence: [
          "The actual design used several keys and balanced their occurrences across paired comparisons.",
        ],
        options: [
          {
            id: "optA",
            text: "Randomizing trial order would automatically separate mode from mean pitch.",
          },
          {
            id: "optC",
            text: "More participants would separate mode from pitch in these stimuli.",
          },
          {
            id: "optD",
            text: "The design would then test only participants’ age rather than musical properties.",
          },
          {
            id: "optB",
            text: "Mode and mean pitch would be confounded in that simplified stimulus set.",
          },
        ],
        accepted: ["optB"],
        alternatives: [],
        hint: "Would trial order or a larger sample break a fixed pairing of mode and pitch?",
        misconceptions: {
          optA: "Order randomization does not undo a fixed relation between stimulus features.",
          optC: "More observations do not repair a confounded stimulus design.",
          optD: "The confound concerns musical properties, not a new age manipulation.",
        },
        explanation:
          "Different, balanced keys help disentangle mean pitch from major/minor cadence type. A perfectly aligned pair of stimulus features would not identify their separate contributions.",
        refs: ["r1"],
        writtenReasoning: false,
        reveal: "design",
        scene: null,
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Assess a universal claim",
        type: "single",
        prompt:
          "Which report distinguishes differing evidence strength from a demonstrated absence of a mode effect?",
        evidence: [
          "Major-cadence estimates varied in precision across existing listener groups, including a minimally exposed group.",
        ],
        options: [
          {
            id: "optB",
            text: "Evidence differed across groups; the uncertain minimally exposed estimate does not establish an absent effect.",
          },
          {
            id: "optA",
            text: "The less decisive estimate is evidence that the minimally exposed population has a negligible mode effect.",
          },
          {
            id: "optC",
            text: "The different evidence strengths constitute a direct test that the mode effects differ between groups.",
          },
          {
            id: "optD",
            text: "Differences in group history turn the manipulated musical mode into an unmeasured observational predictor.",
          },
        ],
        accepted: ["optB"],
        alternatives: [],
        hint: "Distinguish an imprecise estimate from a precise estimate of a small effect.",
        misconceptions: {
          optA: "An uncertain estimate does not establish a practically negligible effect without an appropriate precision or equivalence assessment.",
          optC: "Comparing evidence labels is not a direct comparison of the group effects.",
          optD: "Musical stimuli were varied in the task; observational cultural-history grouping does not make the stimulus mode unmeasured.",
        },
        explanation:
          "Evidence strength differed among the sampled groups, but the minimally exposed estimate remained uncertain. Neither absence there nor a direct between-group difference follows just from contrasting evidence labels.",
        refs: ["e1"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c5",
        stage: "Read the results",
        title: "Compare group effects",
        type: "single",
        prompt:
          "Would finding a melody-pitch effect in one PNG group but not the others establish a difference between those groups?",
        evidence: [
          "The reported evidence for higher-pitch melodies is strong in one PNG group and both Sydney groups.",
        ],
        options: [
          {
            id: "optA",
            text: "Yes; significant in one group and not another is itself a significant interaction.",
          },
          {
            id: "optB",
            text: "Not by that contrast alone; a difference between group effects needs a direct comparison.",
          },
          {
            id: "optC",
            text: "Yes; the pattern demonstrates that every member of one community hears music differently.",
          },
          {
            id: "optD",
            text: "No; analysing different groups prevents any possible group-effect comparison.",
          },
        ],
        accepted: ["optB"],
        alternatives: [],
        hint: "Evidence for an effect within one group is a different question from the contrast between two effects.",
        misconceptions: {
          optA: "Different evidence labels are not a direct test of the difference between effects.",
          optC: "Group estimates are not deterministic claims about every community member.",
          optD: "Group contrasts are possible, but must be analysed directly with uncertainty.",
        },
        explanation:
          "Evidence for an effect within groups and evidence for differences between effects answer distinct questions. A direct group contrast is needed for the latter.",
        refs: ["e1"],
        writtenReasoning: false,
        reveal: "results",
        scene: null,
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Pattern versus mechanism",
        type: "single",
        prompt:
          "Which interpretation of the exposure gradient best separates observation from explanation?",
        evidence: [
          "The mode-related pattern tended to be stronger in the Sydney groups and weaker with less Western-like musical exposure.",
        ],
        options: [
          {
            id: "optA",
            text: "The gradient estimates the exposure effect after holding demographic and acoustic differences constant.",
          },
          {
            id: "optC",
            text: "It identifies prior exposure as the mediator of the community contrast.",
          },
          {
            id: "optB",
            text: "It is compatible with learning and familiarity, but does not isolate either mechanism.",
          },
          {
            id: "optD",
            text: "The gradient separates a timbre explanation from familiarity because mode varied within the task.",
          },
        ],
        accepted: ["optB"],
        alternatives: [],
        hint: "Consider other differences that might travel with an existing group’s listening history.",
        misconceptions: {
          optA: "Exposure histories were not randomly assigned or isolated from the other differences between communities.",
          optC: "A gradient across existing groups does not isolate a mediating pathway.",
          optD: "Varying mode does not by itself distinguish timbre and familiarity accounts of the between-group pattern.",
        },
        explanation:
          "Familiarity and learned emotional associations are proposed explanations. The existing-group comparison does not uniquely identify their causal contribution.",
        refs: ["e8"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: {
          version: 1,
          title: "Interpreting a pattern across communities",
          instruction:
            "Inspect the visual, then choose the interpretation supported by the study.",
          description: "Interpreting a pattern across communities",
          provenance: {
            kind: "source-summary",
            refs: ["e8"],
            note: "Study information paraphrased from the cited source.",
          },
          responses: [
            {
              optionId: "optA",
              label:
                "The gradient estimates the exposure effect after holding demographic and acoustic differences constant.",
              targetIds: ["experience", "ratings", "inference"],
            },
            {
              optionId: "optC",
              label:
                "It identifies prior exposure as the mediator of the community contrast.",
              targetIds: ["experience", "ratings", "inference"],
            },
            {
              optionId: "optB",
              label:
                "It is compatible with learning and familiarity, but does not isolate either mechanism.",
              targetIds: ["experience", "ratings", "inference"],
            },
            {
              optionId: "optD",
              label:
                "The gradient separates a timbre explanation from familiarity because mode varied within the task.",
              targetIds: ["experience", "ratings", "inference"],
            },
          ],
          resolution: null,
          kind: "flow",
          nodes: [
            {
              id: "experience",
              label: "Different listening histories",
              detail: "Groups differ in exposure to Western-like music.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e8"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 0,
            },
            {
              id: "ratings",
              label: "Happiness judgements",
              detail: "Reported effects vary across groups.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e8"],
                note: "Study information paraphrased from the cited source.",
              },
              column: 0,
            },
            {
              id: "inference",
              label: "Compare explanations",
              detail:
                "A cross-community pattern does not randomly assign culture.",
              at: "resolution",
              provenance: {
                kind: "authored",
                refs: ["e8"],
                note: "Authored reasoning guidance based on the source; not a measured causal mechanism.",
              },
              column: 0,
            },
          ],
          edges: [
            {
              from: "experience",
              to: "ratings",
              label: "compare across groups",
              at: "setup",
            },
            {
              from: "ratings",
              to: "inference",
              label: "interpret cautiously",
              at: "resolution",
            },
          ],
        },
      },
      {
        id: "c7",
        stage: "Draw a conclusion",
        title: "What would establish smallness?",
        type: "single",
        prompt:
          "What additional evidence would most strengthen a claim that the minimally exposed population has a negligible effect?",
        evidence: [
          "Its effect estimate is uncertain, and the paper says a universal effect cannot be ruled out.",
        ],
        options: [
          {
            id: "optA",
            text: "A p-value above .05, treated by itself as proof of exactly zero effect.",
          },
          {
            id: "optC",
            text: "A larger effect estimate in Sydney, treated as the missing PNG population estimate.",
          },
          {
            id: "optD",
            text: "Dropping the uncertain group and calling the remaining sample culturally universal.",
          },
          {
            id: "optB",
            text: "A more precise estimate assessed against a stated range of practically small effects.",
          },
        ],
        accepted: ["optB"],
        alternatives: [],
        hint: "Think about both precision and what effect sizes would count as practically negligible.",
        misconceptions: {
          optA: "Failure to reject a point null does not establish negligibility or equivalence.",
          optC: "An estimate from another group does not identify the uncertain group’s effect.",
          optD: "Removing the key uncertainty narrows the sample rather than supporting universality.",
        },
        explanation:
          "A claim of negligible effect requires precision and an explicit small-effect criterion. The current uncertainty does not settle presence or absence of a universal effect.",
        refs: ["e1", "e3"],
        writtenReasoning: false,
        reveal: "interpretation",
        scene: null,
      },
    ],
    bonus: null,
  },
  takeaway:
    "Happiness judgements for major/minor cadences and melodic pitch varied across listener groups. The exposure gradient is consistent with learning and familiarity but does not isolate those mechanisms. Limited precision in the minimally exposed group leaves universal accounts unresolved; the task does not establish changes in participants’ overall happiness.",
};
