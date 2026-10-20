// The Texting Study Quest (Gingerich & Lineweaver 2014, Experiment 2), encoded
// from the team's "Gradly Texting Study Quest" script. One task per screen:
// learners recommend a design, then analyse the actual study and its results.
// Copy is the script's; answer keys follow its implementation notes.

export type QuestVisual =
  | "frame"
  | "sample"
  | "plans"
  | "instruments"
  | "inspect"
  | "distribution"
  | "scope"
  | "lecture"
  | "attention"
  | "study"
  | "groups"
  | "results"
  | "variation"
  | "evidence"
  | "reveal"
  | "hypothetical";

/** Option icons are labels for meaning, never a cue to the right answer. */
export type QuestIcon =
  | "grades"
  | "quiz"
  | "confidence"
  | "students"
  | "survey"
  | "random"
  | "choose"
  | "distraction"
  | "groups"
  | "pairs"
  | "anova"
  | "histogram"
  | "percent"
  | "people"
  | "difference"
  | "spread"
  | "target"
  | "range"
  | "probability"
  | "ability"
  | "fail"
  | "experiment"
  | "scale"
  | "certain"
  | "blocked";
export type QuestOption = { id: string; text: string; icon?: QuestIcon };

export type QuestScreen =
  | {
      kind: "story";
      id: string;
      stage: string;
      heading: string;
      paragraphs: { label?: string; text: string }[];
      visual?: QuestVisual;
      button: string;
      /** Optional second action that skips ahead (the final twist is optional). */
      skip?: { label: string; to: string };
    }
  | {
      kind: "choice";
      id: string;
      stage: string;
      /** A two-word name for the decision, used in the summary path. */
      short: string;
      heading: string;
      instruction: string;
      evidence?: string;
      label?: string;
      options: QuestOption[];
      correct: string[];
      hint: string;
      feedback: {
        correct: string;
        byOption?: Record<string, string>;
        other?: string;
        /** Multiple selection that misses one accepted answer. */
        partial?: string;
      };
      visual?: QuestVisual;
      /** Visual shown only after the answer is checked. */
      afterVisual?: QuestVisual;
      continueLabel: string;
      optional?: boolean;
    }
  | { kind: "complete"; id: string; stage: string };

export const questSource = {
  title: "OMG! Texting in Class = U Fail :(",
  subtitle:
    "Empirical Evidence That Text Messaging During Class Disrupts Comprehension",
  citation:
    "Gingerich, A. C., & Lineweaver, T. T. (2014). Teaching of Psychology, 41(1), 44–51.",
  doi: "10.1177/0098628313514177",
};

const options = (...items: [QuestIcon, string][]): QuestOption[] =>
  items.map(([icon, text], i) => ({
    id: String.fromCharCode(65 + i),
    text,
    icon,
  }));

export const textingQuest: QuestScreen[] = [
  {
    kind: "story",
    id: "ready",
    stage: "Start",
    heading: "Can students text and still keep up?",
    visual: "lecture",
    paragraphs: [
      {
        text: "Based on Gingerich and Lineweaver’s OMG! Texting in Class = U Fail :( (2014). This paper contains two experiments. For this quest, we’ll explore Experiment 2.",
      },
      {
        label: "Mission",
        text: "Investigate whether texting during a lecture affects learning.",
      },
      {
        label: "You will practice",
        text: "Choosing a comparison design, selecting an analysis for two groups, and writing a conclusion that fits the evidence.",
      },
    ],
    button: "Let’s investigate",
  },
  {
    kind: "story",
    id: "why",
    stage: "Start",
    heading: "Why investigate texting during lectures?",
    visual: "attention",
    paragraphs: [
      {
        text: "A student listens to a lecture while messaging a friend. They may feel they’re following along, but how much of the material will they remember?",
      },
      {
        label: "Background",
        text: "The researchers approached this problem through divided attention: when two activities compete for attention, performance may suffer. Their challenge was to test whether texting interferes with learning from a lecture.",
      },
      {
        label: "Your turn",
        text: "How would you investigate it? You’ll make a few design decisions before seeing what the researchers did.",
      },
    ],
    button: "Plan the study",
  },
  {
    kind: "choice",
    id: "question",
    short: "Research question",
    stage: "Frame",
    heading: "Which question best captures what we want to investigate?",
    visual: "frame",
    instruction: "Choose one.",
    options: options(
      [
        "grades",
        "Is habitual texting during lectures associated with students’ overall university grades?",
      ],
      [
        "quiz",
        "Does texting during a lecture affect performance on a subsequent quiz about that lecture?",
      ],
      [
        "confidence",
        "Is perceived distraction during lectures associated with students’ confidence in their learning?",
      ],
    ),
    correct: ["B"],
    hint: "Think about the specific activity and learning outcome this study could directly compare.",
    feedback: {
      correct:
        "A focused starting point. This question connects texting during a particular lecture to performance on a quiz about its content. It gives us an activity to vary and an outcome to measure.",
      other:
        "A worthwhile question, but a different study. Overall grades reflect experiences beyond one lecture. Perceived distraction and confidence concern students’ judgments. Here, we’re testing performance on material from a specific lecture.",
    },
    continueLabel: "Next: Who should participate?",
  },
  {
    kind: "choice",
    id: "participants",
    short: "Participants",
    stage: "Design",
    heading: "Who would help us study learning in a university lecture?",
    visual: "sample",
    instruction: "Choose the most appropriate starting sample.",
    options: options(
      [
        "students",
        "University students who report that texting usually harms their concentration.",
      ],
      [
        "students",
        "University students who report that they can text without affecting their learning.",
      ],
      [
        "students",
        "University students recruited without selecting them for their beliefs about texting.",
      ],
    ),
    correct: ["C"],
    hint: "Would selecting people because of their views about texting affect whom the study represents?",
    feedback: {
      correct:
        "A stronger starting sample. Recruiting without screening for those beliefs avoids restricting the study to students who already expect a particular outcome. We still need to consider which students our recruitment reaches.",
      other:
        "That would narrow the sample. Students selected for their beliefs may differ from the wider student population. We could measure those beliefs separately.",
    },
    continueLabel: "Next: Set up the comparison",
  },
  {
    kind: "choice",
    id: "approach",
    short: "Approach",
    stage: "Design",
    heading: "How would you test whether texting affects quiz performance?",
    visual: "plans",
    instruction:
      "Choose the approach that most directly addresses the question.",
    options: options(
      [
        "survey",
        "Ask students whether they usually text, then compare their latest course grades.",
      ],
      [
        "random",
        "Randomly assign students to text or refrain from texting during the same lecture, then give them the same quiz.",
      ],
      [
        "choose",
        "Let students choose whether to text during a lecture, then compare their scores on the same quiz.",
      ],
    ),
    correct: ["B"],
    hint: "Students who choose to text might already differ from students who choose not to.",
    feedback: {
      correct:
        "You’ve strengthened the comparison. Random assignment helps reduce systematic differences between groups before the lecture. The same lecture and quiz also make their experiences more comparable.",
      byOption: {
        A: "That could reveal an association. However, course grades reflect many influences, and students who text frequently may differ from other students.",
        C: "The comparison could contain selection bias. Students who choose to text might differ in motivation or prior knowledge. Random assignment helps address that problem.",
      },
    },
    // Keep the selected design on its working surface after feedback.
    continueLabel: "Next: Measure learning",
  },
  {
    kind: "choice",
    id: "measure",
    short: "Measure",
    stage: "Design",
    heading: "What should we measure to answer our question?",
    visual: "instruments",
    instruction: "Choose the most direct primary outcome.",
    options: options(
      ["confidence", "Students’ confidence that they understood the lecture."],
      [
        "distraction",
        "Students’ ratings of how distracted they felt during the lecture.",
      ],
      ["quiz", "Students’ scores on a quiz covering the lecture material."],
    ),
    correct: ["C"],
    hint: "Feeling that you learned something and demonstrating that learning are different outcomes.",
    feedback: {
      correct:
        "That measures performance directly. A quiz assesses how well students answer questions about the lecture material. Confidence and perceived distraction could provide additional information.",
      other:
        "Useful information, but it answers a different question. Students’ judgments may not match their performance. To test learning, use a quiz about the lecture.",
    },
    continueLabel: "See the researchers’ design",
  },
  {
    kind: "story",
    id: "study",
    stage: "Analyze",
    heading: "Here’s what the researchers actually did.",
    visual: "study",
    paragraphs: [
      {
        label: "Participants",
        text: "56 undergraduate students at Butler University, recruited from psychology courses.",
      },
      {
        label: "Assignment",
        text: "Participants were randomly assigned to text or refrain from texting. Those in the text condition texted a scripted conversation during the lecture.",
      },
      {
        label: "Procedure",
        text: "Both groups watched the same recorded lecture and were instructed to take notes. After a short intervening task, participants completed a nine-item quiz about the lecture.",
      },
      {
        text: "From here on, you’ll analyze this actual study. Your earlier choices were recommendations. The results you’re about to see come from the researchers’ design.",
      },
    ],
    button: "Choose an analysis",
  },
  {
    kind: "choice",
    id: "analysis",
    short: "Analysis",
    stage: "Analyze",
    heading:
      "We have two separate groups and a numerical quiz score. What fits?",
    instruction:
      "Select all suitable approaches for comparing their mean scores, subject to checking assumptions.",
    visual: "groups",
    options: options(
      ["groups", "An independent-samples t-test."],
      ["pairs", "A paired-samples t-test."],
      ["anova", "A one-way between-groups ANOVA."],
    ),
    correct: ["A", "C"],
    hint: "Each participant belongs to one condition. There are no matched pairs or repeated quiz scores in this comparison.",
    feedback: {
      correct:
        "Both can fit this comparison. Under the same equal-variance assumptions, the independent-samples t-test and two-group ANOVA produce the same two-sided significance result.",
      byOption: {
        B: "Check how observations are connected. A paired test requires paired observations, such as the same students measured twice or explicitly matched pairs.",
      },
      partial:
        "That approach can fit. There’s another suitable option too. Both methods can compare two separate group means.",
    },
    continueLabel: "Next: Check the analysis",
  },
  {
    kind: "choice",
    id: "checks",
    short: "Checks",
    stage: "Analyze",
    heading: "Which checks would help you evaluate this comparison?",
    visual: "inspect",
    instruction: "Select two.",
    options: options(
      [
        "histogram",
        "Examine score distributions, unusual observations, and whether group variances differ substantially.",
      ],
      ["percent", "Confirm that every participant scored below 100%."],
      [
        "people",
        "Examine whether shared testing sessions or texting partners could make participants’ scores dependent.",
      ],
    ),
    correct: ["A", "C"],
    hint: "Consider both the numerical scores and how the observations were collected.",
    feedback: {
      correct:
        "Good checks. Distributions and variances help assess the analysis. Participants attended group sessions, and texting involved another person. Those details deserve attention when evaluating possible dependence.",
      other:
        "Look beyond whether scores seem reasonable. We should assess the score distributions and whether data collection could connect participants’ outcomes. The paper alone does not establish that every diagnostic check was satisfied.",
    },
    continueLabel: "Reveal the results",
  },
  {
    kind: "choice",
    id: "results",
    short: "Mean difference",
    stage: "Interpret",
    heading: "The quiz scores are in.",
    evidence:
      "Text: mean 73.41%, SD 16.95 percentage points. No text: mean 83.00%, SD 17.26 percentage points.",
    instruction: "How would you describe the observed difference?",
    visual: "results",
    options: options(
      [
        "difference",
        "The texting group’s mean score was 9.59 percentage points lower than the no-text group’s.",
      ],
      [
        "people",
        "Every texting participant scored 9.59 percentage points below every no-text participant.",
      ],
      [
        "percent",
        "Texting reduced the average score by 9.59% relative to the no-text group.",
      ],
    ),
    correct: ["A"],
    hint: "Subtract the means. Are you describing averages, individuals, or a relative percentage change?",
    feedback: {
      correct:
        "Correct: 9.59 percentage points. 83.00 − 73.41 = 9.59. This describes the difference between group means; individual scores varied.",
      byOption: {
        B: "Group means don’t describe every participant. The averages differ, but the groups’ individual scores may overlap.",
        C: "Watch the units. A difference between percentage scores is expressed in percentage points. A relative change also requires dividing by the reference mean.",
      },
    },
    continueLabel: "Look beyond the averages",
  },
  {
    kind: "choice",
    id: "variation",
    short: "Error bars",
    stage: "Interpret",
    heading: "Did everyone score near their group’s average?",
    instruction:
      "Tap Show variation, then decide: what do these error bars describe?",
    visual: "variation",
    options: options(
      [
        "spread",
        "Variation in individual quiz scores around each group’s mean.",
      ],
      ["target", "A 95% confidence interval for each group’s population mean."],
      ["range", "The lowest and highest observed score in each group."],
    ),
    correct: ["A"],
    hint: "Read the error-bar label. Error bars can represent different quantities.",
    feedback: {
      correct:
        "These bars show one standard deviation above and below the mean. They describe score variability, not the full range or a confidence interval.",
      other:
        "Check the label: ±1 standard deviation. These are not confidence intervals or observed minimum and maximum scores.",
    },
    continueLabel: "Examine the statistical evidence",
  },
  {
    kind: "choice",
    id: "evidence",
    short: "p-value",
    stage: "Interpret",
    heading: "Which interpretation is most accurate?",
    evidence: "The researchers reported F(1, 54) = 4.33, p < .05.",
    instruction: "Choose one.",
    visual: "distribution",
    options: options(
      [
        "probability",
        "There is less than a 5% probability that texting has no effect.",
      ],
      [
        "scale",
        "If the population means were equal and the test assumptions held, an F statistic at least this large would occur with probability below 5%.",
      ],
      [
        "people",
        "Fewer than 5% of participants would perform differently if they switched conditions.",
      ],
    ),
    correct: ["B"],
    hint: "A p-value concerns the test result under a specified null hypothesis. It does not give the probability that the hypothesis is true.",
    feedback: {
      correct:
        "That’s the appropriate interpretation. The result provides evidence against the equal-means null hypothesis under the analysis assumptions. It doesn’t establish practical importance by itself.",
      byOption: {
        A: "The probability concerns the result, given the null hypothesis. It is not the probability that the null hypothesis is true.",
        C: "The p-value doesn’t describe a proportion of participants or how individuals would respond to switching conditions.",
      },
    },
    continueLabel: "Next: Write the conclusion",
  },
  {
    kind: "choice",
    id: "conclusion",
    short: "Conclusion",
    stage: "Interpret",
    heading: "Which sentence belongs in a careful research report?",
    visual: "scope",
    instruction: "Choose one.",
    options: options(
      [
        "ability",
        "Students who text during lectures are less academically capable than students who refrain from texting.",
      ],
      [
        "fail",
        "Texting during lectures causes university students to fail their courses.",
      ],
      [
        "experiment",
        "In this experiment, students assigned to text during a lecture scored lower on a subsequent quiz than students assigned not to text.",
      ],
    ),
    correct: ["C"],
    hint: "Match the claim to the assignment, outcome, and setting the study examined.",
    feedback: {
      correct:
        "A conclusion that fits the evidence. Random assignment strengthens a causal interpretation within this setting. Claims about academic ability, course failure, or all lectures require more evidence.",
      byOption: {
        A: "That goes beyond the evidence. The study examined performance under assigned conditions, not differences in academic ability between habitual texters and other students.",
        B: "The outcome was a quiz, not course failure. We cannot extend it directly to passing or failing a course.",
      },
    },
    continueLabel: "Compare with the paper",
  },
  {
    kind: "story",
    id: "reveal",
    stage: "Reflect",
    heading: "Compare your decisions with the paper.",
    visual: "reveal",
    paragraphs: [
      {
        label: "Takeaway",
        text: "Keep your researcher’s judgment switched on. The experiment supports a focused claim about the tested conditions. It doesn’t establish effects for every student, every lecture, or long-term academic performance.",
      },
      {
        label: "Alternative",
        text: "Choosing a defensible t-test earlier was also reasonable. Your analysis doesn’t need to copy the authors’ choice to make sense.",
      },
    ],
    button: "Try one final twist",
    skip: { label: "Finish quest", to: "complete" },
  },
  {
    kind: "choice",
    id: "twist",
    short: "Final twist",
    stage: "Reflect",
    optional: true,
    label: "Hypothetical variation. This is not what happened in Experiment 2.",
    heading: "What if students had chosen their own condition?",
    evidence:
      "Imagine the same result, but students decided for themselves whether to text.",
    instruction: "What would change about your conclusion?",
    visual: "hypothetical",
    options: options(
      [
        "scale",
        "The mean difference would still describe the groups, but pre-existing differences would make a causal interpretation harder to support.",
      ],
      [
        "certain",
        "A statistically significant difference would establish causation despite the lack of random assignment.",
      ],
      [
        "blocked",
        "Comparing the group means would become impossible without random assignment.",
      ],
    ),
    correct: ["A"],
    hint: "You could still compare scores. The challenge is explaining why they differ.",
    feedback: {
      correct:
        "Design changes what a result can support. Students choosing to text might differ in motivation or prior knowledge. The difference remains informative, but attributing it to texting becomes harder.",
      byOption: {
        B: "Statistical significance doesn’t remove selection bias. A small p-value cannot resolve pre-existing differences between self-selected groups.",
        C: "You can still compare means. The limitation concerns causal interpretation.",
      },
    },
    continueLabel: "Finish quest",
  },
  { kind: "complete", id: "complete", stage: "Done" },
];

/** Feedback for a checked selection, following the script's display rules. */
export function feedbackFor(
  screen: Extract<QuestScreen, { kind: "choice" }>,
  selected: string[],
): { correct: boolean; message: string } {
  const picked = [...selected].sort().join(",");
  const accepted = [...screen.correct].sort().join(",");
  if (picked === accepted)
    return { correct: true, message: screen.feedback.correct };
  const wrong = selected.find((id) => !screen.correct.includes(id));
  if (wrong && screen.feedback.byOption?.[wrong])
    return { correct: false, message: screen.feedback.byOption[wrong]! };
  if (!wrong && screen.feedback.partial)
    return { correct: false, message: screen.feedback.partial };
  return {
    correct: false,
    message: screen.feedback.other ?? screen.feedback.partial ?? "",
  };
}
