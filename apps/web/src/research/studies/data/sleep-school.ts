import type { SceneItem } from "@paperquest/contracts";
import type { StudyBody, StudyChallenge } from "../types.js";

const summary = (refs: string[], note = "Paraphrase of the cited page.") => ({
  kind: "source-summary" as const,
  refs,
  note,
});
const reported = (
  refs: string[],
  note = "Value as reported in the cited table or text.",
) => ({
  kind: "reported" as const,
  refs,
  note,
});
const illustration = (
  note = "Teaching diagram. Shapes are concepts, not participant records.",
) => ({ kind: "illustration" as const, refs: [] as string[], note });
const item = (
  id: string,
  label: string,
  detail: string,
  refs: string[],
  at: SceneItem["at"] = "setup",
): SceneItem => ({ id, label, detail, at, provenance: summary(refs) });

const challenges: StudyChallenge[] = [
  {
    id: "q1",
    stage: "Frame the question",
    title: "Match the question to the data",
    type: "single",
    prompt:
      "Parents reported children's sleep problems at two ages, and teachers rated school performance at the second age. Nobody changed anything about the children's sleep. Which question can this design address?",
    options: [
      {
        id: "A",
        text: "Are children whose parents report sleep problems more likely to receive a low teacher rating later on?",
      },
      {
        id: "B",
        text: "Does treating children's sleep problems raise their school performance?",
      },
      {
        id: "C",
        text: "How many hours of sleep does a child need to do well at school?",
      },
    ],
    accepted: ["A"],
    alternatives: [],
    hint: "Ask what the researchers did to the children, and what they actually recorded about sleep.",
    explanation:
      "The researchers observed children and recorded parent reports and teacher ratings. They gave no treatment, so they cannot test whether fixing sleep helps. They recorded whether a child had trouble falling or staying asleep, not how long the child slept. The design can ask whether the two things go together over time.",
    misconceptions: {
      B: "No sleep treatment was given. Testing whether treatment helps needs an intervention, ideally randomised.",
      C: "Sleep was recorded as a yes-or-no problem with falling or staying asleep. Sleep duration was not measured.",
    },
    reveal: "design",
    evidence: [
      "Parents answered one question: does the child have problems initiating or maintaining sleep?",
      "Teachers rated academic performance on a four-point scale at the second wave.",
    ],
    refs: ["measures"],
    writtenReasoning: false,
    scene: null,
  },
  {
    id: "q2",
    stage: "Read the design",
    title: "Follow the children through time",
    type: "single",
    prompt:
      "A cohort study can only analyse children it still has data for. Tap the step where the most children were lost.",
    options: [
      { id: "A", text: "Between the invitation and wave 1 consent" },
      { id: "B", text: "Between wave 1 and taking part in both waves" },
      {
        id: "C",
        text: "Between taking part in both waves and the final analysis",
      },
    ],
    accepted: ["B"],
    alternatives: [],
    hint: "Subtract each count from the one before it.",
    explanation:
      "From 7,007 children at wave 1, only 4,028 took part in both waves, a loss of 2,979. The analysed group of 3,453 is about half of the wave 1 sample. The authors checked that the children who stayed had similar wave 1 sleep scores to those who left, but that is one variable. The children who stayed could still differ in health, family circumstances or school performance.",
    misconceptions: {
      A: "9,430 to 7,007 is a loss of 2,423. That is large, but a later step lost more.",
      C: "4,028 to 3,453 is a loss of 575, mostly from incomplete information. A larger loss happened earlier.",
    },
    reveal: "design",
    evidence: [
      "Counts are children with consent or complete data at each step.",
    ],
    refs: ["sample"],
    writtenReasoning: false,
    responseStyle: "tap",
    scene: {
      version: 1,
      kind: "timeline",
      title: "From invitation to analysis",
      instruction:
        "Read each count in order, then tap the step with the biggest drop.",
      description:
        "Five points on a time axis, from children invited in 2002 to the children included in the analysis.",
      provenance: summary(
        ["sample"],
        "Counts taken from the participants section.",
      ),
      events: [
        {
          id: "invited",
          when: "Autumn 2002 · age 7–9",
          n: 9430,
          label: "Children invited",
          detail: "School-aged children in Bergen, Norway, targeted at wave 1.",
          at: "setup",
          provenance: reported(["sample"]),
        },
        {
          id: "wave1",
          when: "Wave 1 · age 7–9",
          n: 7007,
          label: "Wave 1 consent",
          detail: "Parents consented to their child's participation.",
          at: "setup",
          provenance: reported(["sample"]),
        },
        {
          id: "wave2",
          when: "Wave 2 · spring 2006 · age 11–13",
          n: 5661,
          label: "Wave 2 consent",
          detail: "Parents consented at the second wave.",
          at: "setup",
          provenance: reported(["sample"]),
        },
        {
          id: "both",
          when: "Both waves",
          n: 4028,
          label: "Took part in both waves",
          detail: "The longitudinal sample with data at wave 1 and wave 2.",
          at: "setup",
          provenance: reported(["sample"]),
        },
        {
          id: "analysed",
          when: "Analysis",
          n: 3453,
          label: "Included in analysis",
          detail:
            "Children with complete information, after excluding 27 with parent-reported intellectual disability.",
          at: "setup",
          provenance: reported(["sample"]),
        },
      ],
      responses: [
        { optionId: "A", label: "Invited → wave 1", targetIds: ["wave1"] },
        { optionId: "B", label: "Wave 1 → both waves", targetIds: ["both"] },
        {
          optionId: "C",
          label: "Both waves → analysis",
          targetIds: ["analysed"],
        },
      ],
      resolution: {
        id: "attrition",
        label: "About half of wave 1 remains",
        detail:
          "The 3,453 analysed children are 49.3% of the wave 1 sample. Roughly half the wave 1 children are missing from the analysis.",
        at: "resolution",
        provenance: summary(
          ["sample"],
          "Percentage reported in the participants section.",
        ),
      },
    },
  },
  {
    id: "q3",
    stage: "Read the design",
    title: "Sort the sleep groups",
    type: "single",
    prompt:
      "Teachers rated performance only at wave 2. In which group were sleep problems reported only at the same time as that rating, so they cannot be shown to come first?",
    options: [
      { id: "A", text: "Transitory" },
      { id: "B", text: "Concurrent" },
      { id: "C", text: "Persistent" },
    ],
    accepted: ["B"],
    alternatives: [],
    hint: "Read when each group's sleep problems were reported, then compare it with when the rating happened.",
    explanation:
      "The concurrent group had sleep problems reported at wave 2 but not at wave 1. The teacher rating was also made at wave 2, so the order of the two is unknown: poor schoolwork and worry could disturb sleep as easily as the reverse. The transitory and persistent groups had problems already reported at wave 1, three years before the rating.",
    misconceptions: {
      A: "Transitory problems were reported at wave 1 and gone by wave 2, so they came before the rating.",
      C: "Persistent problems were reported at both waves, including wave 1, before the rating.",
    },
    reveal: "design",
    evidence: [
      "Wave 1: parent report of sleep problems.",
      "Wave 2: parent report of sleep problems, teacher rating and child mental health report.",
    ],
    refs: ["measures"],
    writtenReasoning: false,
    responseStyle: "pills",
    scene: {
      version: 1,
      kind: "flow",
      title: "Which reports form each group?",
      instruction:
        "Read the group definitions, then pick the group whose timing matches the rating.",
      description:
        "Two waves of parent sleep reports lead to three sleep-problem groups. The teacher rating sits at wave 2.",
      provenance: summary(
        ["measures"],
        "Group definitions paraphrased from the instruments section.",
      ),
      nodes: [
        {
          ...item(
            "w1",
            "Wave 1 sleep report",
            "Parents report whether the child has problems falling or staying asleep. Age 7–9.",
            ["measures"],
          ),
          column: 0,
        },
        {
          ...item(
            "w2",
            "Wave 2 sleep report",
            "Parents answer the same question again. Age 11–13.",
            ["measures"],
          ),
          column: 1,
        },
        {
          ...item(
            "rating",
            "Teacher rating",
            "Teachers rate performance at wave 2 only. Low or very low counts as poor performance.",
            ["measures"],
          ),
          column: 1,
        },
        {
          ...item(
            "transitory",
            "Transitory",
            "Sleep problems at wave 1 but not at wave 2.",
            ["measures"],
          ),
          column: 2,
        },
        {
          ...item(
            "concurrent",
            "Concurrent",
            "Sleep problems at wave 2 but not at wave 1.",
            ["measures"],
          ),
          column: 2,
        },
        {
          ...item("persistent", "Persistent", "Sleep problems at both waves.", [
            "measures",
          ]),
          column: 2,
        },
      ],
      edges: [
        { from: "w1", to: "w2", label: "three years later", at: "setup" },
        {
          from: "w1",
          to: "transitory",
          label: "reported at wave 1",
          at: "feedback",
        },
        {
          from: "w1",
          to: "persistent",
          label: "reported at wave 1",
          at: "feedback",
        },
        {
          from: "w2",
          to: "concurrent",
          label: "reported at wave 2 only",
          at: "feedback",
        },
        {
          from: "w2",
          to: "persistent",
          label: "reported again",
          at: "feedback",
        },
      ],
      responses: [
        { optionId: "A", label: "Transitory", targetIds: ["transitory"] },
        { optionId: "B", label: "Concurrent", targetIds: ["concurrent"] },
        { optionId: "C", label: "Persistent", targetIds: ["persistent"] },
      ],
      resolution: {
        id: "order",
        label: "Same-time reports cannot set the order",
        detail:
          "When sleep and performance are measured together, either could come first. Earlier sleep reports at least fix that part of the order.",
        at: "resolution",
        provenance: illustration("Methods guidance on temporal order."),
      },
    },
  },
  {
    id: "q4",
    stage: "Read the results",
    title: "Watch the estimate move",
    type: "single",
    prompt:
      "These odds ratios compare the persistent group with children who had no sleep problems. Each row adds more factors to the model. What is the best reading?",
    options: [
      {
        id: "A",
        text: "The estimate shrinks as factors are added, so part of the first link is shared with those factors, but it stays above 1.",
      },
      {
        id: "B",
        text: "The fully adjusted 1.87 is the true causal effect of sleep problems, because adjustment removed everything else.",
      },
      {
        id: "C",
        text: "Because the estimate changes between models, the analysis is unreliable and shows nothing.",
      },
      {
        id: "D",
        text: "The fully adjusted interval includes 1, so no association remains.",
      },
    ],
    accepted: ["A"],
    alternatives: [],
    hint: "Compare the first and last rows, then check whether the last interval crosses the line at 1.",
    explanation:
      "The odds ratio falls from 3.15 to 1.87 as gender, puberty, family economy and mental health are added. Part of the crude link travelled with those factors. The fully adjusted interval, 1.19 to 2.95, stays above 1, so an association remains. Adjustment only handles factors that were measured. Mental health was measured at wave 2, the same time as the rating, so it could be a shared cause or a step between sleep and grades. The drop does not split cleanly into confounding.",
    misconceptions: {
      B: "Adjustment removes only the measured factors. Unmeasured ones, such as chronic or neurological conditions, can still contribute.",
      C: "A shrinking estimate is what adjustment is designed to reveal. It tells you how much of the link was shared with the added factors.",
      D: "The fully adjusted interval runs from 1.19 to 2.95. It sits entirely above 1.",
    },
    reveal: "results",
    evidence: [
      "Model A, sleep only: OR 3.15 (95% CI 2.07–4.78).",
      "Model D, plus gender, puberty and family economy: OR 2.78 (1.81–4.25).",
      "Model E, plus internalizing problems: OR 2.05 (1.32–3.20).",
      "Fully adjusted, plus internalizing and externalizing problems: OR 1.87 (1.19–2.95).",
    ],
    refs: ["table2", "analysis", "limits"],
    writtenReasoning: false,
    responseStyle: "cards",
    scene: {
      version: 1,
      kind: "estimate",
      title: "Persistent sleep problems vs none",
      instruction:
        "Read each interval against the line at 1, from top to bottom.",
      description:
        "Four odds ratios with 95% confidence intervals from successive logistic regression models.",
      provenance: reported(
        ["table2"],
        "Persistent column of the logistic regression table.",
      ),
      measure: "Odds ratio of a low teacher rating",
      min: 0,
      max: 5,
      reference: { value: 1, label: "No difference in odds" },
      band: null,
      estimates: [
        {
          id: "modelA",
          label: "Sleep only",
          detail: "Model A: no other factors.",
          value: 3.15,
          lower: 2.07,
          upper: 4.78,
          at: "setup",
          provenance: reported(["table2"]),
        },
        {
          id: "modelD",
          label: "+ gender, puberty, family economy",
          detail: "Model D.",
          value: 2.78,
          lower: 1.81,
          upper: 4.25,
          at: "setup",
          provenance: reported(["table2"]),
        },
        {
          id: "modelE",
          label: "+ internalizing problems",
          detail:
            "Model E: Model D plus child-reported internalizing problems at wave 2.",
          value: 2.05,
          lower: 1.32,
          upper: 3.2,
          at: "setup",
          provenance: reported(["table2"]),
        },
        {
          id: "full",
          label: "Fully adjusted",
          detail:
            "All factors, including internalizing and externalizing problems.",
          value: 1.87,
          lower: 1.19,
          upper: 2.95,
          at: "setup",
          provenance: reported(["table2"]),
        },
      ],
      prediction: {
        label: "Before reading closely, what happens as factors are added?",
        options: ["It grows", "It stays the same", "It shrinks"],
      },
      responses: [
        {
          optionId: "A",
          label: "Shrinks, stays above 1",
          targetIds: ["modelA", "full"],
        },
        { optionId: "B", label: "Final value is causal", targetIds: ["full"] },
        {
          optionId: "C",
          label: "Changes mean unreliable",
          targetIds: ["modelA", "modelD", "modelE", "full"],
        },
        { optionId: "D", label: "Interval includes 1", targetIds: ["full"] },
      ],
      resolution: {
        id: "shrink",
        label: "Adjusted, not explained away",
        detail:
          "The link weakens with each measured factor yet stays above 1. Factors that were never measured cannot be adjusted for.",
        at: "resolution",
        provenance: summary(["table2", "limits"]),
      },
    },
  },
  {
    id: "q5",
    stage: "Read the results",
    title: "Odds are not risk",
    type: "single",
    prompt:
      "The fully adjusted odds ratio for persistent sleep problems is 1.87. About one child in ten was rated as a poor performer overall. Which sentence describes 1.87 correctly?",
    options: [
      {
        id: "A",
        text: "Children with persistent sleep problems were 87% more likely to be rated as poor performers.",
      },
      {
        id: "B",
        text: "After adjustment, the odds of a low rating were about 1.87 times the odds for children without sleep problems.",
      },
      {
        id: "C",
        text: "1.87% of children with persistent sleep problems received a low rating.",
      },
      {
        id: "D",
        text: "87% of children with persistent sleep problems received a low rating.",
      },
    ],
    accepted: ["B"],
    alternatives: [],
    hint: "An odds ratio compares odds, the chance of the outcome divided by the chance of not having it.",
    explanation:
      "Odds are the chance of an outcome divided by the chance of not having it. An odds ratio of 1.87 compares those odds between groups. It equals the risk ratio only when the outcome is rare. With about one child in ten rated as a poor performer, and more in the persistent group, the risk ratio is closer to 1 than the odds ratio. Reading 1.87 as '87% more likely' overstates the gap. The paper itself describes these results as increased risk, so watch for this slip in the source too.",
    misconceptions: {
      A: "That is a risk-ratio reading. When the outcome is not rare, an odds ratio sits further from 1 than the risk ratio.",
      C: "An odds ratio is a comparison between groups, not the percentage of a group with the outcome.",
      D: "An odds ratio does not tell you what share of the group had the outcome.",
    },
    reveal: "results",
    evidence: [
      "Fully adjusted, persistent vs no sleep problems: OR 1.87 (95% CI 1.19–2.95).",
      "362 children (10.5%) were rated by teachers as poor performers.",
    ],
    refs: ["poor", "table2"],
    writtenReasoning: false,
    responseStyle: "cards",
    scene: {
      version: 1,
      kind: "association",
      title: "What is being compared?",
      instruction:
        "Inspect the reported association before interpreting its scale.",
      description: "What is being compared?",
      provenance: {
        kind: "reported",
        refs: ["poor", "table2"],
        note: "Adjusted odds ratio from the cited table, not a probability ratio.",
      },
      responses: [
        {
          optionId: "A",
          label:
            "Children with persistent sleep problems were 87% more likely to be rated as poor performers.",
          targetIds: ["sleep-poor"],
        },
        {
          optionId: "B",
          label:
            "After adjustment, the odds of a low rating were about 1.87 times the odds for children without sleep problems.",
          targetIds: ["sleep-poor"],
        },
        {
          optionId: "C",
          label:
            "1.87% of children with persistent sleep problems received a low rating.",
          targetIds: ["sleep-poor"],
        },
        {
          optionId: "D",
          label:
            "87% of children with persistent sleep problems received a low rating.",
          targetIds: ["sleep-poor"],
        },
      ],
      resolution: null,
      pairs: [
        {
          id: "sleep-poor",
          label: "Persistent vs no sleep problems",
          detail: "Adjusted OR = 1.87; 95% CI 1.19 to 2.95.",
          at: "setup",
          provenance: {
            kind: "reported",
            refs: ["poor", "table2"],
            note: "Adjusted odds ratio from the cited table, not a probability ratio.",
          },
          x: "Persistent sleep problems",
          y: "Poor teacher-rated performance",
          statistic: "OR",
          value: 1.87,
        },
      ],
    },
  },
  {
    id: "q6",
    stage: "Draw a conclusion",
    title: "Test the headline",
    type: "multiple",
    prompt:
      "A headline reads: 'Sleep problems cause poor grades.' Which features of this study stop that conclusion? Select both.",
    options: [
      {
        id: "A",
        text: "Unmeasured conditions, such as neurological or chronic disorders, could lead to both sleep problems and low ratings.",
      },
      {
        id: "B",
        text: "School performance was not measured at wave 1, so some children may already have been struggling before the sleep reports.",
      },
      {
        id: "C",
        text: "The adjusted estimate stays above 1, which rules out other explanations.",
      },
      {
        id: "D",
        text: "Teachers, not parents, rated performance, which makes the link causal.",
      },
    ],
    accepted: ["A", "B"],
    alternatives: [],
    hint: "Look for causes that were never measured and for a starting point the study did not record.",
    explanation:
      "The authors name both problems. Unmeasured conditions could produce sleep problems and poor performance together, and without wave 1 performance or mental health the study cannot rule out that difficulties came first. Using separate reporters reduces shared-method bias, but it does not establish cause. An odds ratio above 1 after adjustment shows an association that survives the measured factors only.",
    misconceptions: {
      A: "Correct, but a second reason is also in the design.",
      B: "Correct, but a second reason is also in the limitations.",
      C: "Adjustment handles measured factors only. An estimate above 1 cannot rule out unmeasured ones.",
      D: "Separate reporters reduce one kind of bias. They do not turn an observed association into a causal effect.",
    },
    reveal: "interpretation",
    evidence: [
      "Fully adjusted, persistent vs no sleep problems: OR 1.87 (95% CI 1.19–2.95).",
      "Performance, mental health and other factors were not measured at wave 1.",
    ],
    refs: ["limits", "table2"],
    writtenReasoning: false,
    responseStyle: "cards",
    scene: {
      version: 1,
      kind: "flow",
      title: "What else could connect them?",
      instruction:
        "Inspect the paths into the low rating, then choose the reasons that block a causal claim.",
      description:
        "Persistent sleep problems link to a low teacher rating. Other factors sit alongside that link.",
      provenance: summary(
        ["limits", "table2"],
        "Paths paraphrased from the results and limitations.",
      ),
      nodes: [
        {
          ...item(
            "unmeasured",
            "Unmeasured conditions",
            "For example neurological conditions or chronic disorders. Not measured in this study.",
            ["limits"],
          ),
          column: 0,
        },
        {
          ...item(
            "earlier",
            "Earlier performance",
            "School performance at age 7–9 was never recorded.",
            ["limits"],
          ),
          column: 0,
        },
        {
          ...item(
            "sleep",
            "Persistent sleep problems",
            "Reported by parents at both waves.",
            ["table2"],
          ),
          column: 1,
        },
        {
          ...item(
            "mental",
            "Mental health at wave 2",
            "Child-reported, measured at the same time as the rating.",
            ["limits"],
          ),
          column: 1,
        },
        {
          ...item(
            "low",
            "Low teacher rating",
            "Rated at age 11–13. Associated with persistent sleep problems after adjustment.",
            ["table2"],
          ),
          column: 2,
        },
      ],
      edges: [
        { from: "sleep", to: "low", label: "associated", at: "setup" },
        { from: "mental", to: "low", label: "adjusted for", at: "setup" },
        {
          from: "unmeasured",
          to: "sleep",
          label: "could affect",
          at: "feedback",
        },
        {
          from: "unmeasured",
          to: "low",
          label: "could affect",
          at: "feedback",
        },
        { from: "earlier", to: "low", label: "not controlled", at: "feedback" },
      ],
      responses: [
        {
          optionId: "A",
          label: "Hidden shared causes",
          targetIds: ["unmeasured", "sleep", "low"],
        },
        {
          optionId: "B",
          label: "No starting point",
          targetIds: ["earlier", "low"],
        },
        {
          optionId: "C",
          label: "Above 1 rules out others",
          targetIds: ["sleep", "low"],
        },
        {
          optionId: "D",
          label: "Teacher rating is causal",
          targetIds: ["low"],
        },
      ],
      resolution: {
        id: "headline",
        label: "Linked over time, not proven causal",
        detail:
          "Persistent sleep problems went with higher odds of a low rating three years on. Unmeasured causes and the missing starting point keep the causal question open.",
        at: "resolution",
        provenance: summary(["limits", "table2"]),
      },
    },
  },
];

const bonus: StudyChallenge = {
  id: "bonus",
  stage: "Draw a conclusion",
  title: "When the interval crosses 1",
  type: "single",
  prompt:
    "For children whose sleep problems appeared only at wave 2, the odds ratio drops from 2.12 to 1.19 after full adjustment, with an interval from 0.82 to 1.73. What is the safest reading?",
  options: [
    {
      id: "A",
      text: "Sleep problems at age 11–13 have no link with school performance.",
    },
    {
      id: "B",
      text: "After adjustment, the data fit anything from slightly lower to clearly higher odds, so this study cannot settle the question for this group.",
    },
    {
      id: "C",
      text: "The crude 2.12 is the true effect, and adjustment hid it.",
    },
  ],
  accepted: ["B"],
  alternatives: [],
  hint: "An interval that crosses 1 contains both 'no difference' and real differences.",
  explanation:
    "An interval from 0.82 to 1.73 includes 1 but also includes odds 73% higher. Not significant is not the same as no link. The adjustment also included mental health measured at the same time as the rating. If sleep problems affect performance partly through mental health, adjusting for it removes part of a real pathway. The authors' mediation analysis treats mental health this way.",
  misconceptions: {
    A: "Crossing 1 means the study could not distinguish a link from no link. It does not show the link is absent.",
    C: "The crude estimate includes the influence of factors that adjustment accounts for. It is not automatically the true effect either.",
  },
  reveal: "bonus",
  evidence: [
    "Concurrent group, Model A: OR 2.12 (95% CI 1.51–2.98).",
    "Concurrent group, fully adjusted: OR 1.19 (0.82–1.73).",
  ],
  refs: ["table2"],
  writtenReasoning: false,
  responseStyle: "cards",
  scene: {
    version: 1,
    kind: "estimate",
    title: "Sleep problems at wave 2 only vs none",
    instruction: "Compare where each interval sits relative to the line at 1.",
    description:
      "Crude and fully adjusted odds ratios for the concurrent group.",
    provenance: reported(
      ["table2"],
      "Concurrent column of the logistic regression table.",
    ),
    measure: "Odds ratio of a low teacher rating",
    min: 0,
    max: 5,
    reference: { value: 1, label: "No difference in odds" },
    band: null,
    estimates: [
      {
        id: "crude",
        label: "Sleep only",
        detail: "Model A.",
        value: 2.12,
        lower: 1.51,
        upper: 2.98,
        at: "setup",
        provenance: reported(["table2"]),
      },
      {
        id: "adjusted",
        label: "Fully adjusted",
        detail: "Including mental health measured at wave 2.",
        value: 1.19,
        lower: 0.82,
        upper: 1.73,
        at: "setup",
        provenance: reported(["table2"]),
      },
    ],
    prediction: null,
    responses: [
      { optionId: "A", label: "No link", targetIds: ["adjusted"] },
      { optionId: "B", label: "Cannot settle it", targetIds: ["adjusted"] },
      { optionId: "C", label: "Crude is true", targetIds: ["crude"] },
    ],
    resolution: {
      id: "crosses",
      label: "Inconclusive, not absent",
      detail:
        "The adjusted interval spans 1, so this group's result is uncertain in both directions.",
      at: "resolution",
      provenance: summary(["table2"]),
    },
  },
};

export const body: StudyBody = {
  takeaway:
    "Children whose parents reported sleep problems at both ages had higher odds of a low teacher rating at 11–13 (odds ratio 3.15 unadjusted, 1.87 after adjusting for gender, puberty, family economy and mental health). This is an association in about half of the original wave 1 sample, not proof that sleep problems cause poor grades, and an odds ratio is not a risk ratio.",
  lesson: {
    id: "prepared-sleep-school",
    title: "Restless Nights and Grades",
    source: "featured",
    briefing:
      "A research team followed a large group of schoolchildren across two ages, asking parents about sleep and teachers about schoolwork. You will read how the study was built before seeing any results, then decide what its numbers can and cannot support.",
    paper: {
      title:
        "The association between sleep problems and academic performance in primary school-aged children: Findings from a Norwegian longitudinal population-based study",
      authors:
        "Kjell Morten Stormark, Hedvik Elisabeth Fosse, Ståle Pallesen and Mari Hysing (2019)",
      journal: "PLOS ONE, 14(11), e0224139",
      url: "https://doi.org/10.1371/journal.pone.0224139",
      limitations: [
        "Sleep problems and school performance were each measured with a single question, and sleep problems were reported by parents only.",
        "School performance and mental health were not measured at wave 1, so earlier differences could not be controlled.",
        "The analysed sample is about half of the wave 1 sample.",
        "Unmeasured factors, such as neurological or chronic conditions, could explain the association.",
      ],
    },
    evidence: [
      {
        id: "sample",
        page: 3,
        excerpt:
          "In all, 9430 school-aged children were targeted at T1 when they were 7–9 year olds. Parents of 7007 children consented to their child’s participation in the BCS. At T2 (when the children were 11–13 year olds), parents of 5661 children consented to their child’s participation, comprising a longitudinal sample of 4028 children who participated at both T1 and T2. The longitudinal sample did not differ from the sample that was lost to follow-up on their DIMS scores at T1, according to results from the Kruskal-Wallis test, with mean DIMS scores of 0.09 and 0.11 for the longitudinal sample and the sample lost to follow-up, respec- tively. Complete information was available for 3480 children. An additional 27 children were excluded from the analysis due to parent-reported intellectual disability. Thus, the total current study population comprised 3453 children (47.2% boys), which constituted 35.1% of the origi- nal target population, and 49.3% and 61.0% of the study population at T1 and T2, respectively.",
      },
      {
        id: "measures",
        page: 3,
        excerpt:
          "Concurrent sleep problems were defined as having DIMS at T2, but not on T1. Transitory sleep problems were defined as having DIMS at T1, but not on T2. Persistent sleep problems were defined as having DIMS at both T1 and T2. At T2 the teachers indexed the children’s academic performance by answering the question: “How do you evaluate the child’s academic performance?” on a four-point scale (very high, high/average, low and very low).",
      },
      {
        id: "analysis",
        page: 4,
        excerpt:
          "A logistic regression analysis was used to explore the association between DIMS and academic performance. Both unadjusted/crude (analyzing the bivariate relationships between the single possible confounding variables and academic performance) and analyses where all potential explanatory variables were entered simultaneously (adjusted) were conducted. The confounders we adjusted for were: Gender, Pubertal status, SES, Inter- nalizing and Externalizing mental health problems. Finally, we conducted a fully adjusted anal- ysis controlling for all potential confounders. Results are presented as odds ratios (OR) with 95% confidence intervals (95% CI).",
      },
      {
        id: "poor",
        page: 5,
        excerpt:
          "A total of 362 children (10.5% of the current study population) were reported by their teacher to evidence poor academic performance.",
      },
      {
        id: "table2",
        page: 6,
        excerpt:
          "Table 2. Sleep problems and school performance. Logistic regression models analyzing the relationship between sleep problems and poor school performance at T2 in children transitory, concurrent or persistent DIMS (Difficulties initiating and maintaining sleep; N = 3543). Transitory (only at T1) Concurrent (only at T2) Persistent (both at T1 and T2) OR(95% CI) p (95% CI) p (95% CI) P Model A: DIMS 0.69(0.35–1.36) .28 2.12(1.51–2.98) < .001 3.15(2.07–4.78) < .001 Model B: Model A+Gender 0.69(0.35–1.37) .28 2.11(1.50–2.97) < .001 3.09(2.03–4.70) < .001 Model C: Model B+Pubertal status 0.69(0.35–1.38) .29 2.05(1.45–2.89) < .001 3.04(1.99–4.63) < .001 Model D: Model C+SES (Perceived family economy) 0.64(0.32–1.28) .21 1.97(1.40–2.70) < .001 2.78(1.81–4.25) < .001 Model E: Model D+ SDQ Internalizing problems 0.51(0.25–1.04) .06 1.37(0.95–1.98) .09 2.05(1.32–3.20) < .01 Model F: Model D+ SDQ Externalizing problems 0.55(0.27–1.12) .10 1.36(0.95–1.96) .10 2.07(1.32–3.25) < .01 Model F: Fully adjusted model (Model A+B+C+D 0.50(0.25–1.02) .06 1.19(0.82–1.73) .35 1.87(1.19–2.95) < .05",
      },
      {
        id: "limits",
        page: 8,
        excerpt:
          "Third, as we have no information about neither the child’s academic performance, mental health prob- lems nor any of the mediating factors at T1 we could not control for these in the analyses. Self- report on the SDQ was not available for the age range of the study sample at T1. Another important limitation was that we did not obtain any measure of sleep duration, and thus can- not determine the extent to which this variable overlap with sleep quality [80], and test the direct and indirect [81] effects on school performance [82]. Finally, unmeasured and poten- tially confounding factors could account for the association between sleep and academic per- formance for the group of children with persistent DIMS. They may have other characteristics such as neurological conditions or chronic disorders that both are risk factors for sleep prob- lems in general as well as poor academic performance [83].",
      },
    ],
    challenges,
    bonus,
  },
};
