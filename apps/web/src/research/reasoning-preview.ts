/**
 * Authored interaction fixtures for the browser-only reasoning showcase.
 *
 * These fixtures demonstrate a review contract. They do not classify free text,
 * call a model, or represent feedback generated from an uploaded document.
 */
export const PREVIEW_FIXTURE_VERSION = "1.0.0";

export type PreviewChoiceId =
  "independent-t" | "between-anova" | "paired-t" | "unsure";

export type PreviewReasoningCategory =
  | "needs-revision"
  | "well-supported"
  | "defensible-alternative"
  | "needs-evidence"
  | "not-assessed";

export type PreviewChoiceJudgment =
  | "suitable"
  | "defensible-alternative"
  | "does-not-fit"
  | "not-selected"
  | "not-assessed";

export type PreviewEvidence = Readonly<{
  id: string;
  page: number;
  text: string;
}>;

export type PreviewReview = Readonly<{
  provenance: "authored-preview";
  fixtureVersion: string;
  fixtureId: string | null;
  choice: Readonly<{
    judgment: PreviewChoiceJudgment;
    label: string;
    explanation: string;
  }>;
  reasoning: Readonly<{
    category: PreviewReasoningCategory;
    label: string;
    claim: string;
    issue: string | null;
    coachingQuestion: string;
    evidence: readonly PreviewEvidence[];
    nextStep: string;
  }>;
}>;

export type PreviewExample = Readonly<{
  id: string;
  label: string;
  description: string;
  choiceId: PreviewChoiceId;
  text: string;
  review: PreviewReview;
  revisionExampleId?: string;
}>;

const assignment: PreviewEvidence = {
  id: "method-assignment",
  page: 47,
  text: "56 undergraduates were randomly assigned to either texting or no texting. Each participant experienced one condition.",
};

const procedure: PreviewEvidence = {
  id: "method-procedure",
  page: 47,
  text: "Participants watched an approximately 30-minute lecture, followed by an approximately 10-minute distractor task.",
};

const outcome: PreviewEvidence = {
  id: "method-outcome",
  page: 47,
  text: "Comprehension was measured with a nine-item quiz. The outcome is the percentage of questions answered correctly.",
};

/** Safe method facts only. Source identity and findings belong to previewReveal. */
export const previewStudyContext = {
  title: "One lecture. Two groups. Your analysis.",
  summary:
    "A research team asks whether texting during a lecture changes comprehension. Recommend an analysis before seeing the findings, then defend why it fits the design.",
  question:
    "Which analysis would you recommend to compare the groups’ average comprehension quiz scores?",
  evidence: [assignment, procedure, outcome] as readonly PreviewEvidence[],
  unknowns: [
    "This briefing does not show score distributions, unusual scores, or group variances.",
    "The design and testing arrangement still need scrutiny for possible dependence, including texting partners.",
  ] as readonly string[],
} as const;

export const previewChoices: readonly Readonly<{
  id: PreviewChoiceId;
  label: string;
  description: string;
}>[] = [
  {
    id: "independent-t",
    label: "Independent-samples t-test",
    description: "Compare the means of two separate groups.",
  },
  {
    id: "between-anova",
    label: "One-way between-groups ANOVA",
    description: "Compare means across the levels of one grouping variable.",
  },
  {
    id: "paired-t",
    label: "Paired-samples t-test",
    description: "Compare linked observations or repeated scores.",
  },
  {
    id: "unsure",
    label: "I need more information",
    description: "Explain what is known and what evidence you still need.",
  },
];

function review(
  fixtureId: string,
  choice: PreviewReview["choice"],
  reasoning: PreviewReview["reasoning"],
): PreviewReview {
  return {
    provenance: "authored-preview",
    fixtureVersion: PREVIEW_FIXTURE_VERSION,
    fixtureId,
    choice,
    reasoning,
  };
}

export const previewExamples: readonly PreviewExample[] = [
  {
    id: "right-method-weak-reason",
    label: "Right method, weak explanation",
    description:
      "A suitable method can still rest on a mistaken view of the observations.",
    choiceId: "independent-t",
    text: "I would use an independent-samples t-test because everyone watched the same lecture, so each student’s score is paired with a score in the other group.",
    revisionExampleId: "right-method-supported-reason",
    review: review(
      "right-method-weak-reason",
      {
        judgment: "suitable",
        label: "Method fits the comparison",
        explanation:
          "An independent-samples comparison can fit two separate groups with a numerical outcome, subject to the relevant assumptions.",
      },
      {
        category: "needs-revision",
        label: "Explanation needs revision",
        claim: "A shared lecture makes the two groups’ scores paired.",
        issue:
          "The shared lecture is a common experience. It does not create a matched pair of observations. Each student contributes a score in only one condition, so the explanation conflicts with the selected method.",
        coachingQuestion:
          "Does each student provide a score in both conditions, or are there different students in each group? What would make two scores a pair?",
        evidence: [assignment, procedure],
        nextStep:
          "Keep the method if you can support it. Revise the explanation to connect the separate groups and numerical outcome, then identify the assumptions you would check.",
      },
    ),
  },
  {
    id: "right-method-supported-reason",
    label: "Same method, stronger explanation",
    description:
      "The method stays the same. The explanation now follows the design and names checks still needed.",
    choiceId: "independent-t",
    text: "I would use an independent-samples t-test because different students were randomly assigned to the texting and no-texting groups, and the outcome is a numerical quiz score. I would inspect the score distributions, unusual scores, and possible dependence before analysis, and consider a Welch approach if equal variances are not justified.",
    review: review(
      "right-method-supported-reason",
      {
        judgment: "suitable",
        label: "Method fits the comparison",
        explanation:
          "An independent-samples t-test can compare the two group means. The design supports separate groups; the data and study arrangement still determine whether the analysis assumptions are reasonable.",
      },
      {
        category: "well-supported",
        label: "Explanation is well supported",
        claim:
          "Different students in two conditions and a numerical outcome support an independent-samples comparison.",
        issue: null,
        coachingQuestion:
          "Which checks could change the version of the test you use, or reveal dependence that needs a different analysis?",
        evidence: [assignment, outcome],
        nextStep:
          "Compare your recommendation with the researchers’ analysis. A supported recommendation can differ from the reported method without being wrong.",
      },
    ),
  },
  {
    id: "defensible-anova",
    label: "A defensible alternative",
    description:
      "Another method can address the same comparison when its assumptions are considered.",
    choiceId: "between-anova",
    text: "A one-way between-groups ANOVA can compare the average numerical quiz scores of the texting and no-texting groups. There is one grouping variable with two levels, and different students experienced each level. I would examine distributions, unusual scores, variance assumptions, and possible dependence before settling on the analysis.",
    review: review(
      "defensible-anova",
      {
        judgment: "defensible-alternative",
        label: "Alternative method is defensible",
        explanation:
          "A one-way between-groups ANOVA can compare two independent means. ANOVA does not require three or more groups.",
      },
      {
        category: "defensible-alternative",
        label: "Alternative is well justified",
        claim:
          "One condition variable with two separate groups and a numerical outcome can support a between-groups ANOVA.",
        issue: null,
        coachingQuestion:
          "What assumptions would make the usual equal-variance ANOVA appropriate, and what would you reconsider if those assumptions were doubtful?",
        evidence: [assignment, outcome],
        nextStep:
          "Keep the justification tied to the design. Compare it with the reported analysis after reviewing the evidence; agreement with the authors is not the only test of a sound recommendation.",
      },
    ),
  },
  {
    id: "supported-uncertainty",
    label: "Name the evidence you still need",
    description:
      "Careful uncertainty identifies a specific gap instead of inventing an assumption check.",
    choiceId: "unsure",
    text: "The two conditions use different students and the quiz outcome is numerical, so an independent-samples comparison looks plausible. This briefing does not show the score distributions, unusual scores, group variances, or whether texting partners create dependence. I need those checks before choosing the exact version of the analysis.",
    review: review(
      "supported-uncertainty",
      {
        judgment: "not-selected",
        label: "Exact analysis is still open",
        explanation:
          "The method facts support a comparison of separate group means. The learner has correctly identified additional checks rather than claiming that those checks have passed.",
      },
      {
        category: "needs-evidence",
        label: "Uncertainty is grounded in a real evidence gap",
        claim:
          "The design suggests an independent-samples comparison, but the briefing does not establish the needed data and dependence checks.",
        issue:
          "The available method facts do not show whether distributions, unusual scores, variance assumptions, or possible dependence would change the analysis.",
        coachingQuestion:
          "Which evidence would you inspect first, and how would different findings change your choice of analysis?",
        evidence: [assignment, outcome],
        nextStep:
          "State a provisional method and the conditions under which you would use it. Request the missing evidence rather than asserting that all assumptions are met.",
      },
    ),
  },
  {
    id: "paired-method-mismatch",
    label: "A method that does not fit",
    description:
      "The review can question both the selected method and the reasoning behind it.",
    choiceId: "paired-t",
    text: "I would use a paired-samples t-test because both groups watched the same lecture. The shared lecture gives each score a matching score in the other group.",
    review: review(
      "paired-method-mismatch",
      {
        judgment: "does-not-fit",
        label: "Method does not fit these observations",
        explanation:
          "A paired-samples t-test requires linked observations, such as repeated scores from the same student or an explicit matching scheme. The briefing provides neither.",
      },
      {
        category: "needs-revision",
        label: "Explanation needs revision",
        claim:
          "Watching the same lecture supplies a matching score in the other group.",
        issue:
          "A common lecture does not identify which observations form a pair. Each participant experienced one condition, and the briefing does not describe matched pairs.",
        coachingQuestion:
          "What is the unit being measured, and where would a second linked score for that same unit come from?",
        evidence: [assignment, procedure],
        nextStep:
          "Reconsider the method using the relationship between the observations. Then explain how the chosen analysis compares the two groups’ numerical scores.",
      },
    ),
  },
];

export const initialPreviewExample = previewExamples[0]!;
export const revisedPreviewExample = previewExamples[1]!;

const unassessedReview: PreviewReview = {
  provenance: "authored-preview",
  fixtureVersion: PREVIEW_FIXTURE_VERSION,
  fixtureId: null,
  choice: {
    judgment: "not-assessed",
    label: "Method has not been reviewed",
    explanation:
      "This browser preview reviews only its authored examples. It has not evaluated this selection and explanation.",
  },
  reasoning: {
    category: "not-assessed",
    label: "Custom writing has not been assessed",
    claim:
      "No review is generated for custom or edited writing in this preview.",
    issue: null,
    coachingQuestion:
      "How does your method fit the outcome, number of groups, and relationship between the observations?",
    evidence: [],
    nextStep:
      "Load an authored example to explore the expected feedback. Custom writing will need a live review service before Gradly can assess it.",
  },
};

/** Normalize presentation only. No keyword scoring or inference is performed. */
function normalizedText(text: string): string {
  return text.normalize("NFKC").trim().replace(/\s+/gu, " ").toLowerCase();
}

/**
 * Return an authored review only for its exact choice and normalized example.
 * Any edit that changes the text beyond case/spacing returns not-assessed.
 */
export function evaluatePreview(choiceId: string, text: string): PreviewReview {
  if (typeof text !== "string" || typeof choiceId !== "string") {
    return unassessedReview;
  }
  const normalized = normalizedText(text);
  const fixture = previewExamples.find(
    (example) =>
      example.choiceId === choiceId &&
      normalizedText(example.text) === normalized,
  );
  return fixture?.review ?? unassessedReview;
}

/**
 * Render only in the final comparison stage. This is an interaction gate, not a
 * secure assessment boundary; a static browser bundle can be inspected.
 */
export const previewReveal = {
  title: "Compare with the published study",
  paper: {
    title:
      "OMG! Texting in Class = U Fail :( Empirical Evidence That Text Messaging During Class Disrupts Comprehension.",
    authors: "Amanda C. Gingerich and Tara T. Lineweaver (2014)",
    journal: "Teaching of Psychology, 41(1), 44–51",
    url: "https://doi.org/10.1177/0098628313514177",
  },
  reportedMethod:
    "The researchers reported a one-way between-groups ANOVA for this comparison.",
  methodComparison:
    "A well-justified independent-samples t-test is also defensible for two groups. Under the same equal-variance assumptions, the usual two-group ANOVA and pooled t-test give equivalent tests, with F = t². Different assumptions can call for different variants or a different analysis.",
  finding:
    "The no-texting group averaged 83.00% correct; the texting group averaged 73.41%. The reported test was F(1,54) = 4.33, p < .05.",
  page: 47,
  interpretation:
    "The observed difference is 9.59 percentage points in lecture comprehension. Random assignment supports a causal interpretation under these study conditions. It does not establish an effect on every student, long-term achievement, or overall GPA.",
  limits: [
    "Participants came from one university.",
    "Prescribed text conversations may differ from everyday texting.",
    "The outcome was a short comprehension quiz rather than long-term achievement.",
  ] as readonly string[],
  takeaway:
    "A sound explanation connects the research question, design, outcome, and assumptions. Matching the authors’ method alone does not demonstrate that reasoning.",
} as const;
