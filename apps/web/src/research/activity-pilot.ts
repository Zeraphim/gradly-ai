import {
  projectScene,
  type Scene,
  type SceneItem,
} from "@paperquest/contracts";

/** Authored source checks for the existing renderer, not generated lessons. */
export type PilotCase = {
  id: string;
  label: string;
  question: string;
  context: string;
  source: { title: string; citation: string; href: string; locator: string };
  options: { id: string; text: string }[];
  accepted: string;
  explanation: string;
  limitation: string;
  scene: Scene;
};
const summary = (refs: string[]) => ({
  kind: "source-summary" as const,
  refs,
  note: "Paraphrase of the linked paper; teaching layout authored by Gradly.",
});
const item = (
  id: string,
  label: string,
  detail: string,
  ref: string,
): SceneItem => ({
  id,
  label,
  detail,
  at: "setup",
  provenance: summary([ref]),
});
const responses = (targets: string[][], labels: string[], order = [0, 1, 2]) =>
  order.map((i) => ({
    optionId: ["bounded", "overreach", "certainty"][i]!,
    label: labels[i]!,
    targetIds: targets[i]!,
  }));

export const activityPilot: PilotCase[] = [
  {
    id: "experiment",
    label: "Experiment",
    question: "Does a higher average mean drawing always works better?",
    context:
      "Students were randomly assigned to draw or write an explanation after a chemical-bonding video. Compare Experiment 2’s delayed post-test means.",
    source: {
      title: "Creating visual explanations improves learning",
      citation: "Bobek & Tversky (2016)",
      href: "https://doi.org/10.1186/s41235-016-0031-6",
      locator: "Experiment 2 · Procedure and Results · Figure 5",
    },
    options: [
      {
        id: "bounded",
        text: "Drawing had the higher group mean in this experiment.",
      },
      {
        id: "overreach",
        text: "Drawing is better for every learner in every subject.",
      },
      {
        id: "certainty",
        text: "Every student who drew scored above every student who wrote.",
      },
    ],
    accepted: "bounded",
    explanation:
      "The reported means favor drawing in this experiment. Group averages do not describe every individual or every teaching context.",
    limitation:
      "These are summary values, not individual scores. The paper’s two experiments should not be treated as identical.",
    scene: {
      version: 1,
      kind: "comparison",
      title: "Predict, then inspect the means",
      instruction:
        "Make an optional prediction, reveal the reported values, then choose an interpretation.",
      description: "Two delayed post-test means on the same zero-to-one scale.",
      provenance: summary(["results"]),
      measure: "Delayed post-test: proportion correct",
      unit: "proportion",
      decimals: 3,
      min: 0,
      max: 1,
      values: [
        {
          ...item(
            "draw",
            "Visual explanation",
            "Reported mean after drawing an explanation.",
            "results",
          ),
          value: 0.822,
          provenance: {
            kind: "reported",
            refs: ["results"],
            note: "Reported delayed post-test mean.",
          },
        },
        {
          ...item(
            "write",
            "Verbal explanation",
            "Reported mean after writing an explanation.",
            "results",
          ),
          value: 0.631,
          provenance: {
            kind: "reported",
            refs: ["results"],
            note: "Reported delayed post-test mean.",
          },
        },
      ],
      prediction: {
        label: "Which group do you expect to have the higher mean?",
        options: ["Visual explanation", "About the same", "Verbal explanation"],
      },
      difference: {
        from: "write",
        to: "draw",
        label: "Difference in mean proportion correct",
        at: "resolution",
      },
      responses: responses(
        [["draw", "write"], ["draw"], ["write"]],
        ["Group comparison", "All subjects", "Individual scores"],
      ),
      resolution: {
        id: "limit",
        label: "Averages have a scope",
        detail:
          "0.822 − 0.631 = 0.191, equivalent to 19.1 percentage points. This is a group comparison in this experiment.",
        at: "resolution",
        provenance: {
          kind: "derived",
          refs: ["results"],
          note: "Difference calculated from the reported means.",
        },
      },
    },
  },
  {
    id: "observational",
    label: "Observational study",
    question:
      "Does following children over time establish what caused their later achievement?",
    context:
      "The marshmallow follow-up links early waiting behavior with later achievement. Inspect what was measured and what the analysis accounted for.",
    source: {
      title:
        "Revisiting the Marshmallow Test: A Conceptual Replication Investigating Links Between Early Delay of Gratification and Later Outcomes",
      citation: "Watts, Duncan & Quan (2018)",
      href: "https://doi.org/10.1177/0956797618761661",
      locator: "Method · Analytic approach · Results · Table 4",
    },
    options: [
      {
        id: "bounded",
        text: "The study reports an association; background factors remain important to its interpretation.",
      },
      {
        id: "overreach",
        text: "Training children to wait longer would necessarily raise later achievement.",
      },
      {
        id: "certainty",
        text: "Adding statistical controls makes this equivalent to random assignment.",
      },
    ],
    accepted: "bounded",
    explanation:
      "The association weakened after adjustment for background and cognitive measures. Observing development over time and adjusting a model do not themselves establish a causal intervention effect.",
    limitation:
      "The arrows show study timing and analysis inputs. They are not a demonstrated causal mechanism.",
    scene: {
      version: 1,
      kind: "flow",
      title: "Trace observations and analysis",
      instruction:
        "Inspect each study element. Choose a claim to see the evidence it connects to.",
      description:
        "Observed waiting precedes later achievement; other measured factors enter the analysis.",
      provenance: summary(["method", "analysis"]),
      nodes: [
        {
          ...item(
            "waiting",
            "Early waiting behavior",
            "A delay-of-gratification task at 54 months.",
            "method",
          ),
          column: 0,
        },
        {
          ...item(
            "achievement",
            "Later achievement",
            "Achievement measured later, including at age 15.",
            "method",
          ),
          column: 1,
        },
        {
          ...item(
            "background",
            "Background and cognition",
            "The analysis included family, home-environment and cognitive measures.",
            "analysis",
          ),
          column: 0,
        },
        {
          ...item(
            "model",
            "Adjusted association",
            "The association became smaller after these adjustments.",
            "analysis",
          ),
          column: 1,
        },
      ],
      edges: [
        {
          from: "waiting",
          to: "achievement",
          label: "measured before",
          at: "setup",
        },
        {
          from: "background",
          to: "model",
          label: "included in analysis",
          at: "setup",
        },
        {
          from: "achievement",
          to: "model",
          label: "analyzed as outcome",
          at: "setup",
        },
      ],
      responses: responses(
        [
          ["waiting", "achievement", "background", "model"],
          ["waiting", "achievement"],
          ["background", "model"],
        ],
        ["Observed association", "Training effect", "Random assignment"],
        [1, 0, 2],
      ),
      resolution: null,
    },
  },
  {
    id: "qualitative",
    label: "Interviews",
    question: "What can students’ accounts tell us about online learning?",
    context:
      "Researchers interviewed 27 third- and fourth-year students at a South African university, selected purposively, and analyzed themes in their accounts.",
    source: {
      title:
        "Synchronous online learning and career readiness in higher education: student perceptions, challenges, and solutions",
      citation: "Lukashe, Chigbu & Umejesi (2024)",
      href: "https://doi.org/10.3389/feduc.2024.1449363",
      locator: "Sections 2.1–2.3 · Findings on career readiness · Section 4",
    },
    options: [
      {
        id: "bounded",
        text: "These accounts identify perceived benefits and difficulties within the studied context.",
      },
      {
        id: "overreach",
        text: "These themes establish how common each experience is among all university students.",
      },
      {
        id: "certainty",
        text: "The interviews prove online learning caused changes in professional skills.",
      },
    ],
    accepted: "bounded",
    explanation:
      "The accounts support a contextual interpretation of participants’ experiences. A purposive interview sample does not establish population prevalence or isolate a causal effect.",
    limitation:
      "Cards paraphrase reported themes, not verbatim quotations. Pinning a card supports your reasoning; it does not make a claim correct.",
    scene: {
      version: 1,
      kind: "connections",
      title: "Connect accounts to a defensible claim",
      instruction:
        "Inspect the evidence cards and optionally pin what matters to your interpretation.",
      description:
        "Interview method and two reported themes, without invented quotations or population estimates.",
      provenance: summary(["method", "themes"]),
      actionLabel: "What do these accounts support?",
      anchors: [
        item(
          "sample",
          "Who was heard?",
          "Purposive interviews with 27 students; not a population probability sample.",
          "method",
        ),
        item(
          "digital",
          "Digital adaptability",
          "Participants described developing familiarity with digital tools.",
          "themes",
        ),
        item(
          "social",
          "Networking concerns",
          "Accounts raised concerns about networking and practical experience.",
          "themes",
        ),
      ],
      responses: responses(
        [["sample", "digital", "social"], ["sample"], ["digital", "social"]],
        ["Contextual themes", "Population frequency", "Causal effect"],
        [1, 2, 0],
      ),
      resolution: null,
    },
  },
];

/** Same release projection used by production scenes; pilot answer keys stay authored. */
export function pilotScene(paper: PilotCase, reviewed: boolean) {
  const refs = paper.scene.provenance.refs;
  const scene = projectScene(
    paper.scene,
    reviewed,
    reviewed,
    paper.options.map((o) => o.id),
    refs,
  );
  if (!scene) throw new Error(`Invalid authored pilot: ${paper.id}`);
  return scene;
}
