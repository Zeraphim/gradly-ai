import type { ResearchCase } from "./case-types.js";

export const referenceCase: ResearchCase = {
  id: "texting-lecture",
  title: "One lecture. One distraction.",
  topic: "Psychology · experiment",
  hook: "Can a classroom experiment tell us what a text costs your attention?",
  question: "Does texting during a lecture change comprehension?",
  context:
    "A team asks students to watch a lecture with or without texting. Before you see the results, decide what this kind of study could tell us. Then open the evidence and build a careful account of the paper.",
  provenance: "reference-paper",
  sourceNote:
    "Curated, paraphrased evidence from a published paper. This is an authored exploration, not a new AI analysis.",
  paper: {
    title:
      "OMG! Texting in Class = U Fail :( Empirical Evidence That Text Messaging During Class Disrupts Comprehension",
    authors: "Amanda C. Gingerich & Tara T. Lineweaver · 2014",
    url: "https://doi.org/10.1177/0098628313514177",
  },
  design:
    "56 undergraduates were randomly assigned to texting or no texting. Each experienced one condition, watched an approximately 30-minute lecture, completed a distractor task, then took a nine-item comprehension quiz.",
  findings:
    "The no-texting group averaged 83.00% correct and the texting group 73.41%, a difference of 9.59 percentage points. The authors reported a one-way between-groups ANOVA: F(1,54) = 4.33, p < .05.",
  limitations: [
    "One university and a short comprehension quiz do not represent every student, setting or long-term outcome.",
    "Prescribed texting may differ from everyday phone use. Group testing and texting partners deserve scrutiny for possible dependence.",
    "An average group difference does not mean every texting student scored lower or that texting determines overall GPA.",
  ],
  evidence: [
    {
      id: "assignment",
      label: "Who experienced what?",
      kind: "design",
      summary:
        "56 students were randomly assigned to text or not text during a lecture. Each student tried one condition.",
      text: "56 undergraduates were randomly assigned to texting or no texting. Each student experienced one condition. Random assignment supports a causal comparison under these study conditions; it is not random sampling of all students.",
      sourceLabel: "Published page 47 · Methods summary",
    },
    {
      id: "outcome",
      label: "What did learning mean here?",
      kind: "design",
      summary:
        "Learning meant a score on a nine-question lecture quiz. GPA and long-term learning were not measured.",
      text: "The outcome was the percentage correct on a nine-item comprehension quiz after a lecture and distractor task. The researchers did not measure overall GPA or long-term retention with this outcome.",
      sourceLabel: "Published page 47 · Procedure and outcome summary",
    },
    {
      id: "difference",
      label: "What did the groups score?",
      kind: "finding",
      summary:
        "The no-texting group averaged 83.00%; the texting group averaged 73.41%. That is a 9.59 percentage-point gap.",
      text: "Average quiz scores were 83.00% without texting and 73.41% with texting. The observed difference is 9.59 percentage points, not a 9.59% relative change.",
      sourceLabel: "Published page 47 · Results summary",
    },
    {
      id: "comparison",
      label: "What did the analysis show?",
      kind: "finding",
      summary:
        "The analysis found a difference between group averages. It does not tell us that every texting student scored lower.",
      text: "The reported one-way ANOVA was F(1,54) = 4.33, p < .05. This comparison concerns group averages under the study design. A p-value does not measure the size or practical importance of an effect.",
      sourceLabel: "Published page 47 · Analysis summary",
    },
    {
      id: "scope",
      label: "Where does the claim stop?",
      kind: "limitation",
      summary:
        "This was one university, prescribed texting and a short quiz. Broader claims need more evidence.",
      text: "Participants came from one university, texting was prescribed, and the outcome was a short comprehension quiz. These boundaries matter before extending the finding to everyday phone use, all students or long-term achievement.",
      sourceLabel: "Curated study limitations · published discussion",
    },
  ],
  claims: [
    {
      id: "too-cautious",
      text: "This study tells us nothing useful about texting.",
      feedback:
        "Random assignment and the quiz results do tell us something useful. The limits narrow the conclusion rather than erase it.",
    },
    {
      id: "bounded",
      text: "Texting lowered average quiz scores here. Broader effects need more evidence.",
      feedback:
        "The randomized comparison supports an effect on average quiz scores here. It does not settle effects in other settings.",
    },
    {
      id: "overreach",
      text: "Texting makes every student fail and lowers their GPA.",
      feedback:
        "The study measured average quiz scores, not everyone’s outcome or GPA. This claim reaches too far.",
    },
  ],
  supportedClaimId: "bounded",
  overview: {
    approach:
      "56 students were randomly assigned to text or not text during a lecture, then took a nine-question quiz.",
    finding:
      "Average scores were 83.00% without texting and 73.41% with texting: a 9.59 percentage-point gap.",
    limit:
      "One university and one short quiz. This does not establish effects on every student, GPA or long-term learning.",
  },
  usefulEvidenceIds: ["assignment", "outcome", "difference"],
  competingEvidenceId: "scope",
  coachingQuestion:
    "What exactly was measured, and which words in your claim extend beyond those people, conditions or outcomes?",
  revision: {
    claim:
      "Texting reduced average comprehension under these study conditions; broader effects need more evidence.",
    explanation:
      "Different students were randomly assigned to the two conditions, and the texting group scored lower on the lecture quiz on average. This supports an effect under these study conditions, while one setting, prescribed texting and a short quiz limit broader claims. It does not show that every student failed or that overall GPA changed.",
  },
  transfer: {
    context:
      "Fictional transfer case: two classes choose whether to use laptops. The laptop class later earns higher exam marks, but students selected their own class and prior attainment is unknown.",
    prompt: "Can we carry the same causal interpretation into this study?",
    options: [
      {
        id: "cause",
        text: "Yes. Laptops caused the higher marks.",
        feedback:
          "An observed difference alone does not establish the cause. Class selection and prior attainment could explain the pattern.",
      },
      {
        id: "association",
        text: "No. Class choice and prior attainment could explain the difference.",
        feedback:
          "The outcome pattern is useful evidence of an association. Unlike the original experiment, this comparison lacks random assignment and does not resolve selection differences.",
      },
      {
        id: "no-effect",
        text: "No. This proves laptops have no effect.",
        feedback:
          "An unresolved causal effect is not evidence of no effect. The design leaves the question open.",
      },
    ],
    supportedOptionId: "association",
  },
  takeaway:
    "Understand a paper by connecting its question, design, actual finding and claim boundaries. The headline alone cannot do that work.",
};
