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
  trial: {
    id: "trial",
    page: 1,
    excerpt:
      "The authored field trial assigned 4 clinics to a text reminder or no reminder and analysed 2,400 appointment records. Reminder clinics also opened on weekends.",
  },
  outcomes: {
    id: "outcomes",
    page: 2,
    excerpt:
      "The authored fixture reports three outcome tests: attendance p = .03, punctuality p = .41 and rebooking p = .27.",
  },
  records: {
    id: "records",
    page: 1,
    excerpt: "analysed 2,400 appointment records",
  },
  // Stage 0 needs three excerpts, so each lesson cites one narrower passage too.
  observed: {
    id: "observed",
    page: 1,
    excerpt: "District membership was observed, not randomly assigned.",
  },
  decisions: {
    id: "decisions",
    page: 1,
    excerpt: "compared accounts and documented interpretive decisions",
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
  [refs.design, refs.results, refs.observed],
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
  [refs.interviews, refs.accounts, refs.decisions],
);
const trialUnits: Scene = {
  ...base("What was assigned, what was counted?", "trial", []),
  responses: [
    { optionId: "bounded", label: "Clinics", targetIds: ["clinics"] },
    { optionId: "broad", label: "Records", targetIds: ["records"] },
  ],
  kind: "units",
  levels: [
    {
      ...n(
        "clinics",
        "Clinics assigned",
        "Each clinic got one condition.",
        "trial",
      ),
      provenance: p("trial", "reported"),
      count: 4,
      unit: "clinics",
      role: "assigned",
    },
    {
      ...n(
        "records",
        "Records analysed",
        "Appointments from those clinics.",
        "trial",
      ),
      provenance: p("trial", "reported"),
      count: 2400,
      unit: "records",
      role: "analysed",
    },
  ],
};
const trialTests: Scene = {
  ...base("Three outcomes, one threshold", "outcomes", [
    "attendance",
    "punctuality",
    "rebooking",
  ]),
  responses: [
    { optionId: "bounded", label: "One of three", targetIds: ["attendance"] },
    {
      optionId: "broad",
      label: "All outcomes",
      targetIds: ["attendance", "punctuality", "rebooking"],
    },
  ],
  kind: "tests",
  alpha: 0.05,
  tests: [
    {
      ...n("attendance", "Attendance", "Kept appointments.", "outcomes"),
      provenance: p("outcomes", "reported"),
      p: 0.03,
    },
    {
      ...n("punctuality", "Punctuality", "Arrived on time.", "outcomes"),
      provenance: p("outcomes", "reported"),
      p: 0.41,
    },
    {
      ...n("rebooking", "Rebooking", "Booked a follow-up.", "outcomes"),
      provenance: p("outcomes", "reported"),
      p: 0.27,
    },
  ],
  prediction: {
    label: "How many will cross .05?",
    options: ["None", "One", "All three"],
  },
};
const trialMatrix: Scene = {
  ...base("What else differed?", "trial", []),
  responses: [
    { optionId: "bounded", label: "Weekend opening", targetIds: ["weekend"] },
    { optionId: "broad", label: "The reminder", targetIds: ["message"] },
  ],
  kind: "matrix",
  conditions: [
    { id: "reminder", label: "Reminder clinics" },
    { id: "none", label: "No-reminder clinics" },
  ],
  rows: [
    {
      ...n("message", "Text reminder", "The planned manipulation.", "trial"),
      cells: ["Sent", "Not sent"],
    },
    {
      ...n("weekend", "Weekend opening", "Opening hours.", "trial"),
      cells: ["Yes", "No"],
    },
  ],
  resolution: {
    id: "matrix-resolution",
    label: "Two rows differ",
    detail: "Weekend opening changed along with the reminder.",
    at: "resolution",
    provenance: p("trial", "authored"),
  },
};
export const fieldTrialSceneLesson = lesson(
  "authored-field-trial-fixture",
  "Authored clinic reminder trial",
  [
    {
      ...challenge(
        "trial-units",
        trialUnits,
        "trial",
        "design",
        "Which count limits how independent the evidence is?",
        [
          "The 4 clinics that received a condition.",
          "The 2,400 records analysed.",
        ],
      ),
      responseStyle: "tap",
    },
    challenge(
      "trial-tests",
      trialTests,
      "outcomes",
      "results",
      "What do the three outcome tests show?",
      [
        "One of three outcomes crossed .05.",
        "The reminder improved every outcome.",
      ],
    ),
    {
      ...challenge(
        "trial-matrix",
        trialMatrix,
        "trial",
        "interpretation",
        "Which difference stops the attendance gain being credited to the reminder alone?",
        [
          "Reminder clinics also opened on weekends.",
          "The reminder was the only difference.",
        ],
      ),
      responseStyle: "tap",
    },
  ],
  [refs.trial, refs.outcomes, refs.records],
);
/** One page per cited page number; narrower excerpts sit inside a longer one. */
export const sceneFixturePages = (value: Lesson) =>
  [...new Set(value.evidence.map((ref) => ref.page))].map((page) => ({
    page,
    text: value.evidence
      .filter((ref) => ref.page === page)
      .map((ref) => ref.excerpt)
      .join(" "),
  }));
