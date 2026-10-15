import type { Scene, SceneItem } from "@paperquest/contracts";
import type {
  Challenge,
  Lesson,
} from "../../../apps/api/src/research/contracts.js";

// Entirely authored test scenarios. These are not uploaded papers or verified study results.
const refs = {
  design: {
    id: "design",
    page: 1,
    excerpt:
      "The fictional water-use survey compared daily household consumption across three districts using existing meter records. District membership was observed, not randomly assigned.",
  },
  results: {
    id: "results",
    page: 2,
    excerpt:
      "The authored fixture reports district mean daily consumption of 120, 155 and 180 litres per household. These observational averages do not establish that district membership causes water use.",
  },
  accounts: {
    id: "accounts",
    page: 2,
    excerpt:
      "In this authored qualitative fixture, interview accounts describe uncertainty about station signs and asking staff for help. The theme is an interpretation of these accounts, not a population prevalence estimate or a tested intervention.",
  },
  interviews: {
    id: "interviews",
    page: 1,
    excerpt:
      "The authored station study recruited commuters purposively for open-ended interviews, compared accounts and documented interpretive decisions. It did not measure population frequencies or test a signage intervention.",
  },
};
const p = (
  ref: string,
  kind: "source-summary" | "reported" | "authored" = "source-summary",
) => ({
  kind,
  refs: [ref],
  note: "Authored fixture evidence. Not a real publication or live model result.",
});
const n = (
  id: string,
  label: string,
  detail: string,
  ref: string,
): SceneItem => ({ id, label, detail, at: "setup", provenance: p(ref) });
const base = (title: string, ref: string, targets: string[]) => ({
  version: 1 as const,
  title,
  instruction:
    "Inspect the authored evidence and connect a defensible interpretation.",
  description:
    "An explicitly fictional fixture for checking reusable scene rendering.",
  provenance: p(ref, "authored"),
  responses: [
    {
      optionId: "bounded",
      label: "Bounded interpretation",
      targetIds: targets,
    },
    { optionId: "broad", label: "Broader interpretation", targetIds: targets },
  ],
  resolution: null,
});
const challenge = (
  id: string,
  scene: Scene,
  ref: string,
  reveal: Challenge["reveal"],
  prompt: string,
  texts: [string, string],
): Challenge => ({
  id,
  title: scene.title,
  stage: "Authored fixture",
  type: "single",
  prompt,
  options: [
    { id: "bounded", text: texts[0] },
    { id: "broad", text: texts[1] },
  ],
  accepted: ["bounded"],
  alternatives: [],
  hint: "Match the claim to the available evidence.",
  misconceptions: {
    broad: "The supplied evidence does not support that broader claim.",
  },
  explanation: texts[0],
  refs: [ref],
  writtenReasoning: true,
  reveal,
  evidence: [refs[ref as keyof typeof refs].excerpt],
  scene,
});
const lesson = (
  id: string,
  title: string,
  challenges: Challenge[],
  evidence: Lesson["evidence"],
): Lesson => ({
  id,
  title,
  source: "generated",
  briefing: "Authored fixture only. Investigate the evidence and its limits.",
  paper: {
    title,
    authors: "Authored test fixture",
    journal: "Not a publication",
    url: null,
    limitations: [
      "Fictional content for software verification, not a research claim.",
    ],
  },
  evidence,
  challenges,
  bonus: null,
});

const waterFlow: Scene = {
  ...base("Where did these observations come from?", "design", [
    "records",
    "districts",
  ]),
  kind: "flow",
  nodes: [
    n(
      "records",
      "Meter records",
      "Existing household records provide observations.",
      "design",
    ),
    n(
      "districts",
      "Three observed districts",
      "The survey did not randomly assign district membership.",
      "design",
    ),
  ],
  edges: [
    {
      from: "records",
      to: "districts",
      label: "compare by location",
      at: "setup",
    },
  ],
};
const waterComparison: Scene = {
  ...base("Compare daily consumption", "results", [
    "north",
    "central",
    "south",
  ]),
  kind: "comparison",
  measure: "Mean daily household consumption",
  unit: "litres / household / day",
  min: 0,
  max: 200,
  values: [
    ["north", "North district", 120],
    ["central", "Central district", 155],
    ["south", "South district", 180],
  ].map(([id, label, value]) => ({
    ...n(
      String(id),
      String(label),
      "Authored district average, not an individual household record.",
      "results",
    ),
    value: Number(value),
    provenance: p("results", "reported"),
  })),
  prediction: null,
  difference: {
    from: "north",
    to: "south",
    label: "South minus north · litres per household per day",
    at: "feedback",
  },
};
const waterClaim: Scene = {
  ...base("What can an observed difference support?", "results", ["averages"]),
  kind: "connections",
  actionLabel: "Connect a conclusion",
  anchors: [
    n(
      "averages",
      "Different observed averages",
      "Differences across observed districts do not by themselves identify a cause.",
      "results",
    ),
  ],
};
export const quantitativeSceneLesson = lesson(
  "authored-water-fixture",
  "Authored water-use survey",
  [
    challenge(
      "water-design",
      waterFlow,
      "design",
      "design",
      "How were the observations obtained?",
      [
        "Observe existing records by district.",
        "Randomly assign households to districts.",
      ],
    ),
    challenge(
      "water-results",
      waterComparison,
      "results",
      "results",
      "Which reading respects these district averages?",
      [
        "The averages differ across observed districts.",
        "Every household in the south uses more than every household in the north.",
      ],
    ),
    challenge(
      "water-limits",
      waterClaim,
      "results",
      "interpretation",
      "Do the records identify a district-membership effect?",
      [
        "Further evidence is needed for that causal claim.",
        "A larger average automatically proves the cause.",
      ],
    ),
  ],
  [refs.design, refs.results],
);

const interviewFlow: Scene = {
  ...base("Follow the interview inquiry", "interviews", [
    "recruitment",
    "accounts",
    "interpretation",
  ]),
  kind: "flow",
  nodes: [
    n(
      "recruitment",
      "Purposeful recruitment",
      "Seek accounts relevant to the inquiry.",
      "interviews",
    ),
    n(
      "accounts",
      "Open-ended interviews",
      "Explore commuter descriptions rather than population frequencies.",
      "interviews",
    ),
    n(
      "interpretation",
      "Compare and interpret",
      "Document interpretive decisions rather than count a universal truth.",
      "interviews",
    ),
  ],
  edges: [
    {
      from: "recruitment",
      to: "accounts",
      label: "invite accounts",
      at: "setup",
    },
    {
      from: "accounts",
      to: "interpretation",
      label: "interpret material",
      at: "setup",
    },
  ],
};
const accountScene: Scene = {
  ...base("Connect an account to a claim", "accounts", ["uncertainty", "help"]),
  kind: "connections",
  actionLabel: "Connect an interpretation",
  anchors: [
    n(
      "uncertainty",
      "Uncertainty about signs",
      "A pattern described in the authored accounts.",
      "accounts",
    ),
    n(
      "help",
      "Asking staff for help",
      "Another part of the interpreted pattern.",
      "accounts",
    ),
  ],
};
export const qualitativeSceneLesson = lesson(
  "authored-station-fixture",
  "Authored station interview inquiry",
  [
    challenge(
      "station-design",
      interviewFlow,
      "interviews",
      "design",
      "Which inquiry fits the available material?",
      [
        "Explore commuter accounts through interviews.",
        "Estimate the proportion of all commuters who need help.",
      ],
    ),
    challenge(
      "station-accounts",
      accountScene,
      "accounts",
      "results",
      "What can the interpreted accounts support?",
      [
        "Some accounts connect sign uncertainty and help-seeking.",
        "Most commuters everywhere need staff assistance.",
      ],
    ),
    challenge(
      "station-boundary",
      {
        ...accountScene,
        title: "Separate an interpretation from an intervention",
      },
      "accounts",
      "interpretation",
      "Do the accounts establish that replacing signs improves navigation?",
      [
        "They motivate further investigation, not a tested intervention effect.",
        "The theme proves new signs will improve navigation.",
      ],
    ),
  ],
  [refs.interviews, refs.accounts],
);
export const sceneFixturePages = (value: Lesson) =>
  value.evidence.map((ref) => ({ page: ref.page, text: ref.excerpt }));
