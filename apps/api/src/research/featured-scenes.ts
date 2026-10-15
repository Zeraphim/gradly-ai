import type { Scene, SceneItem } from "@paperquest/contracts";

const summary = (refs = ["method"]) => ({
  kind: "source-summary" as const,
  refs,
  note: "Authored summary of the reference study, not a verbatim quotation.",
});
const illustration = {
  kind: "illustration" as const,
  refs: [] as string[],
  note: "Teaching diagram. Shapes are concepts, not participant records or group counts.",
};
const node = (
  id: string,
  label: string,
  detail: string,
  refs = ["method"],
): SceneItem => ({ id, label, detail, at: "setup", provenance: summary(refs) });
const resolution = (
  label: string,
  detail: string,
  refs = ["method"],
): SceneItem => ({
  ...node("resolution", label, detail, refs),
  at: "resolution",
});
const responses = (labels: string[], targets: string[]) =>
  labels.map((label, i) => ({
    optionId: String.fromCharCode(65 + i),
    label,
    targetIds: targets,
  }));

export const featuredScenes: Record<string, Scene> = {
  q1: {
    version: 1,
    kind: "connections",
    title: "What does this study connect?",
    instruction:
      "Connect the study setup to the research question you would investigate.",
    description:
      "A study condition and a measurement frame the investigation. Select a question to connect it to the setup.",
    provenance: illustration,
    actionLabel: "Connect a research question",
    anchors: [
      node(
        "condition",
        "During a lecture",
        "Participants experienced a texting or no-texting condition.",
      ),
      node(
        "measurement",
        "After the lecture",
        "Researchers measured performance on a comprehension quiz.",
      ),
    ],
    responses: responses(
      [
        "Lecture comprehension",
        "Overall college grades",
        "Semester study time",
      ],
      ["condition", "measurement"],
    ),
    resolution: resolution(
      "Keep the question within the measurement",
      "Lecture comprehension was measured. Overall grades and semester-long study habits were not.",
    ),
  },
  q2: {
    version: 1,
    kind: "flow",
    title: "Trace one participant’s path",
    instruction:
      "Inspect the branches. Does one person contribute an outcome to one condition, or both?",
    description:
      "Random assignment branches into texting and no texting. Both conditions involve a lecture and later comprehension measurement.",
    provenance: illustration,
    nodes: [
      {
        ...node(
          "assignment",
          "Random assignment",
          "Participants were assigned to one condition.",
        ),
        column: 0,
      },
      {
        ...node(
          "texting",
          "Texting",
          "One condition involved texting during the lecture.",
        ),
        column: 1,
      },
      {
        ...node(
          "no-texting",
          "No texting",
          "The other condition involved no texting during the lecture.",
        ),
        column: 1,
      },
      {
        ...node(
          "lecture",
          "Lecture",
          "An approximately 30-minute lecture, followed by an approximately 10-minute distractor activity.",
        ),
        column: 2,
      },
      {
        ...node(
          "quiz",
          "Comprehension",
          "A nine-item quiz measured comprehension. The shared measurement does not imply the same people were in both conditions.",
        ),
        column: 3,
      },
    ],
    edges: [
      {
        from: "assignment",
        to: "texting",
        label: "one condition",
        at: "setup",
      },
      {
        from: "assignment",
        to: "no-texting",
        label: "other condition",
        at: "setup",
      },
      { from: "texting", to: "lecture", label: "during", at: "setup" },
      { from: "no-texting", to: "lecture", label: "during", at: "setup" },
      { from: "lecture", to: "quiz", label: "later measured", at: "setup" },
    ],
    responses: responses(
      [
        "Same people, both conditions",
        "Separate people, one condition",
        "Observe usual habits",
      ],
      ["assignment", "texting", "no-texting"],
    ),
    resolution: resolution(
      "Separate conditions, separate observations",
      "Each participant experienced one condition. The study used a between-participants experiment, not repeated measurements of both conditions on the same people.",
    ),
  },
  q3: {
    version: 1,
    kind: "connections",
    title: "Build an analysis that fits",
    instruction:
      "Inspect the ingredients, then connect every method you would recommend.",
    description:
      "A numerical outcome and two independently assigned groups form the context for selecting statistical methods.",
    provenance: illustration,
    actionLabel: "Connect your analysis methods",
    anchors: [
      node(
        "outcome",
        "Numerical outcome",
        "Percentage correct on a comprehension quiz.",
      ),
      node(
        "groups",
        "Two separate groups",
        "Participants were assigned to texting or no texting, not measured in both conditions.",
      ),
    ],
    responses: responses(
      [
        "Independent-samples t-test",
        "Between-groups analysis of variance",
        "Paired-samples t-test",
        "Correlation of repeated scores",
      ],
      ["outcome", "groups"],
    ),
    resolution: resolution(
      "More than one method can fit",
      "Both an independent-samples t-test and a one-way between-groups analysis of variance can compare two independent means. Appropriate assumptions and variants still matter.",
    ),
  },
  q4: {
    version: 1,
    kind: "connections",
    title: "Construct your reasoning",
    instruction:
      "Pin the study ingredients you would use in your explanation, then choose the justification they support.",
    description:
      "An evidence assembly area connects the measured outcome, group structure and checks to a proposed justification.",
    provenance: illustration,
    actionLabel: "Connect a justification",
    anchors: [
      node(
        "measure",
        "What was measured?",
        "The outcome is a percentage-correct comprehension score.",
      ),
      node(
        "structure",
        "How were scores related?",
        "Participants experienced one condition each. Shared lecture material does not make scores paired.",
      ),
      {
        ...node(
          "checks",
          "What needs checking?",
          "The numerical outcome and design motivate checks of distributions, variance and possible dependence.",
        ),
        provenance: {
          kind: "authored",
          refs: ["method"],
          note: "Methodological teaching guidance, not a claim that assumptions were tested in this source summary.",
        },
      },
    ],
    responses: responses(
      [
        "A small probability is enough",
        "Outcome + design + assumptions",
        "Shared lecture means paired",
      ],
      ["measure", "structure", "checks"],
    ),
    resolution: resolution(
      "Justification follows the study",
      "Connect the numerical outcome and separate observations to the method, then examine relevant assumptions. A low probability value cannot validate an unsuitable analysis.",
    ),
  },
  q5: {
    version: 1,
    kind: "connections",
    title: "Open the assumption checks",
    instruction:
      "Inspect each checkpoint. These are questions to investigate, not checks the supplied evidence has already passed.",
    description:
      "Three inspection checkpoints cover distribution, variance and independence. No raw score distribution is available here.",
    provenance: {
      ...illustration,
      note: "Methodological inspection guide. No raw scores, distributions or passed checks are implied.",
    },
    actionLabel: "Connect the checks that matter",
    anchors: [
      {
        ...node(
          "distribution",
          "Distribution & unusual scores",
          "Inspect observed scores when available. The summary provides no raw scores from which to draw a distribution.",
        ),
        provenance: {
          kind: "authored",
          refs: ["method"],
          note: "A recommended check, not a reported test result.",
        },
      },
      {
        ...node(
          "variance",
          "Variance & method choice",
          "Consider the variance requirements of the chosen method and suitable alternatives.",
        ),
        provenance: {
          kind: "authored",
          refs: ["method"],
          note: "A recommended check, not a reported test result.",
        },
      },
      {
        ...node(
          "independence",
          "Independence & arrangement",
          "Consider whether group testing or texting partners could introduce dependence. Random assignment alone does not settle this.",
        ),
        provenance: {
          kind: "authored",
          refs: ["method"],
          note: "A possible design concern to inspect, not established dependence.",
        },
      },
    ],
    responses: responses(
      [
        "Inspect scores & variance",
        "Check independence",
        "Require identical scores",
        "Random assignment guarantees normality",
      ],
      ["distribution", "variance", "independence"],
    ),
    resolution: resolution(
      "Assignment does not settle every assumption",
      "Distribution, unusual scores, variance and independence deserve examination. The supplied summary does not establish that these checks passed.",
    ),
  },
  q6: {
    version: 1,
    kind: "comparison",
    title: "See the group difference",
    instruction:
      "Record an optional expectation, reveal the reported means, and connect the interpretation you can defend.",
    description:
      "Two group mean quiz scores on a zero-to-one-hundred scale. These are averages, not individual student results.",
    provenance: {
      kind: "reported",
      refs: ["results"],
      note: "Reported group means from the reference summary. No individual scores or distributions are shown.",
    },
    measure: "Mean comprehension quiz score",
    unit: "% correct",
    min: 0,
    max: 100,
    values: [
      {
        ...node(
          "text-mean",
          "Texting",
          "Group average, not every participant’s score.",
          ["results"],
        ),
        value: 73.41,
        provenance: {
          kind: "reported",
          refs: ["results"],
          note: "Reported mean, as retained in the reference study summary.",
        },
      },
      {
        ...node(
          "no-text-mean",
          "No texting",
          "Group average, not every participant’s score.",
          ["results"],
        ),
        value: 83,
        provenance: {
          kind: "reported",
          refs: ["results"],
          note: "Reported mean, as retained in the reference study summary.",
        },
      },
    ],
    prediction: {
      label: "Before inspecting the means, what do you expect?",
      options: [
        "Texting group higher",
        "Similar group means",
        "No-texting group higher",
      ],
    },
    difference: {
      from: "text-mean",
      to: "no-text-mean",
      label: "No-texting minus texting · percentage points",
      at: "feedback",
    },
    responses: responses(
      [
        "A difference between means",
        "A difference for every person",
        "A relative percentage increase",
      ],
      ["text-mean", "no-text-mean"],
    ),
    resolution: {
      ...resolution(
        "An absolute difference between averages",
        "83.00 minus 73.41 is 9.59 percentage points. This does not describe every student or a relative percentage increase.",
        ["results"],
      ),
      provenance: {
        kind: "derived",
        refs: ["results"],
        note: "Subtraction of the two reported means on the same percentage scale.",
      },
    },
  },
  q7: {
    version: 1,
    kind: "flow",
    title: "Build a reading of the statistical result",
    instruction:
      "Inspect the reported result, then propose what the probability describes. This is a conceptual diagram, not a simulated distribution.",
    description:
      "The reported test statistic and probability threshold form the context for proposing an interpretation.",
    provenance: {
      ...illustration,
      note: "Conceptual guide to the reported statistical result. No simulated data, exact probability or distribution is implied.",
    },
    nodes: [
      {
        ...node(
          "model",
          "Reported test",
          "The reference reports F(1,54) = 4.33. This is a test statistic, not an individual score.",
          ["results"],
        ),
        provenance: {
          kind: "authored",
          refs: ["results"],
          note: "Statistical interpretation guidance.",
        },
      },
      {
        ...node(
          "extreme",
          "Interpretation",
          "What does the probability concern? Propose a reading while considering the model and assumptions.",
          ["results"],
        ),
        provenance: {
          kind: "authored",
          refs: ["results"],
          note: "Statistical interpretation guidance.",
        },
      },
      node(
        "reported",
        "Reported: p < .05",
        "The reference summary reports F(1,54) = 4.33 and p < .05. It supplies no exact probability.",
        ["results"],
      ),
    ],
    edges: [
      { from: "model", to: "extreme", label: "propose a reading", at: "setup" },
      {
        from: "extreme",
        to: "reported",
        label: "respect the reported threshold",
        at: "setup",
      },
    ],
    responses: responses(
      [
        "Probability the null is true",
        "Probability of results under the null",
        "Proof of a large universal effect",
      ],
      ["model", "extreme"],
    ),
    resolution: resolution(
      "Keep the condition attached",
      "The probability concerns results under a null model and assumptions. It is not the probability the null hypothesis is true, an effect-size measure, or a guarantee about every person.",
      ["results"],
    ),
  },
  q8: {
    version: 1,
    kind: "connections",
    title: "Draw the boundary of the claim",
    instruction:
      "Connect the design and outcome to a conclusion. Inspect what remains outside the study’s scope.",
    description:
      "Random assignment and comprehension measurement support a bounded interpretation; broader populations and long-term outcomes require further evidence.",
    provenance: illustration,
    actionLabel: "Connect a conclusion",
    anchors: [
      node(
        "assignment",
        "Assigned conditions",
        "Random assignment strengthens causal interpretation under these study conditions.",
      ),
      node(
        "measured",
        "Lecture comprehension",
        "The measured outcome was a short comprehension quiz, not overall academic performance.",
        ["method", "results"],
      ),
      node(
        "scope",
        "One university setting",
        "Broader settings, populations and long-term outcomes need additional evidence.",
      ),
    ],
    responses: responses(
      [
        "All students, every course, overall grades",
        "These conditions & measured outcome",
        "Two groups prevent causal inference",
      ],
      ["assignment", "measured", "scope"],
    ),
    resolution: resolution(
      "A stronger design still has a boundary",
      "Random assignment supports a causal interpretation for the measured outcome under these conditions. It does not establish an effect on every student, every course or long-term grades.",
      ["method", "results"],
    ),
  },
  q9: {
    version: 1,
    kind: "designs",
    title: "Same result question. Different group formation.",
    instruction:
      "Compare how the groups were formed. Could a statistical result change that earlier decision?",
    description:
      "Two study-design paths contrast nonrandom selection with random assignment. They do not imply equivalent participants or identical procedures.",
    provenance: illustration,
    panels: [
      {
        id: "first",
        label: "Experiment 1",
        steps: [
          node(
            "selection",
            "Nonrandom selection",
            "Volunteers with unlimited texting were selected into the texting condition.",
            ["exp1"],
          ),
          node(
            "concern",
            "Inspect selection bias",
            "Ask whether the way groups formed could introduce differences. A significance result cannot reassign participants.",
            ["exp1"],
          ),
        ],
      },
      {
        id: "second",
        label: "Experiment 2",
        steps: [
          node(
            "random",
            "Random assignment",
            "Participants were randomly assigned to texting or no texting.",
          ),
          node(
            "boundary",
            "Inspect remaining limits",
            "Random assignment better addresses this group-formation concern, while broader generalization still requires evidence.",
          ),
        ],
      },
    ],
    responses: responses(
      [
        "Significance proves starting equivalence",
        "Group formation still matters",
        "A bigger difference proves causation",
      ],
      ["selection", "random"],
    ),
    resolution: resolution(
      "A result cannot rewrite the design",
      "Statistical significance cannot remove nonrandom selection. Experiment 2’s assignment addresses that concern more directly, while other design and scope questions remain.",
      ["exp1", "method"],
    ),
  },
};
