import {
  LESSON_VERSION,
  type Assessment,
  type Evidence,
  type FeedbackMode,
  type Lesson,
  type Question,
} from "@paperquest/contracts";
const SOURCE = "https://doi.org/10.1177/0098628313514177";
interface TeachingQuestion {
  public: Question;
  rubric: string;
  correctChoice: string;
  feedback: Record<Assessment, { strength: string; correction: string }>;
  nextStep: string;
  evidence: Evidence[];
  insufficient?: boolean;
}
const missing = {
  strength: "",
  correction:
    "Add a reason that connects your choice to the information provided. A choice alone does not explain your thinking.",
};
function question(
  publicQuestion: Question,
  correctChoice: string,
  rubric: string,
  strength: string,
  correction: string,
  nextStep: string,
  evidence: Evidence[],
  insufficient = false,
): TeachingQuestion {
  return {
    public: publicQuestion,
    correctChoice,
    rubric,
    nextStep,
    evidence,
    insufficient,
    feedback: {
      sound_reasoning: { strength, correction: "" },
      incorrect_reasoning: { strength: "", correction },
      missing_reasoning: missing,
    },
  };
}
const evidence = (ref: string, text: string, location: string): Evidence => ({
  ref,
  text,
  location,
  sourceUrl: SOURCE,
});
const synthetic = (ref: string, text: string): Evidence => ({
  ref,
  text,
  location: "Original teaching scenario, not a finding from the paper",
  sourceUrl: "",
});
export const teachingQuestions: TeachingQuestion[] = [
  question(
    {
      id: "study-design",
      title: "Who is being compared?",
      stage: "Study design",
      prompt:
        "Should the quiz scores be compared as separate groups or paired measurements?",
      study:
        "In Experiment 2, 56 students were randomly assigned to texting or no-text conditions. Each student experienced one condition, listened to a short lecture, and completed a quiz.",
      choices: [
        "Separate groups",
        "Paired measurements",
        "Not enough information",
      ],
      hint: "Follow one participant. How many conditions did that person experience?",
      transfer: false,
    },
    "Separate groups",
    "Different people contribute the quiz scores in each condition. Explain that each participant contributes to only one condition. Shared lectures or texting partners do not make this a within-person paired comparison. Do not assert that every independence assumption has been verified.",
    "You connected the comparison to which people contributed the scores.",
    "Each person completed one condition. The quiz comparison concerns different groups of people, rather than two measurements from the same people.",
    "Describe what would need to change for these scores to be paired.",
    [
      evidence(
        "design",
        "Students were randomly assigned to one of two conditions, followed by a comprehension quiz.",
        "Experiment 2, printed page 47",
      ),
    ],
  ),
  question(
    {
      id: "method-choice",
      title: "Choose your comparison",
      stage: "Method choice",
      prompt:
        "Which approach could compare the average quiz scores of these two groups?",
      study:
        "The two conditions contain different participants. The outcome is a numerical quiz score. You have group summaries, but no individual records or assumption checks.",
      choices: [
        "A separate-groups comparison, with assumptions checked",
        "A paired comparison of each student with themselves",
        "Any test is valid because assignment was random",
      ],
      hint: "A design can suggest a comparison without proving every assumption.",
      transfer: false,
    },
    "A separate-groups comparison, with assumptions checked",
    "Accept a justified independent-groups t-test, Welch comparison, or one-way analysis of variance. Different participants supply scores. Distribution and possible session dependence still require checking. Random assignment does not establish all test assumptions.",
    "You matched the comparison to the design and kept the assumptions open.",
    "Different people supply the two sets of scores. A separate-groups comparison can be defensible, but random assignment alone does not verify its distribution or dependence assumptions.",
    "Name one assumption that individual records would help you assess.",
    [
      evidence(
        "method",
        "The authors compared quiz scores using a one-way analysis of variance with condition as a between-participants factor.",
        "Experiment 2, printed page 47",
      ),
    ],
  ),
  question(
    {
      id: "quiz-gap",
      title: "Read the real difference",
      stage: "Results reveal",
      prompt:
        "How would you describe the difference between the group averages?",
      study:
        "The texting group averaged 73.41% on the quiz. The no-text group averaged 83.00%. These are averages, not individual scores.",
      choices: [
        "No-text scored 9.59 percentage points higher on average",
        "Every no-text student scored higher than every texting student",
        "No-text scored 9.59 percent higher relative to texting",
      ],
      hint: "Subtract the two percentages. Then distinguish an absolute difference from a relative change.",
      transfer: false,
      chart: {
        labels: ["Texting", "No texting"],
        values: [73.41, 83],
        caption: "Average comprehension quiz score · Experiment 2",
      },
    },
    "No-text scored 9.59 percentage points higher on average",
    "The no-text mean minus texting mean is 9.59 percentage points. Percentage points are an absolute difference, not relative percent. Averages do not establish each individual outcome.",
    "You kept the direction, units, and group-average meaning clear.",
    "83.00 minus 73.41 is 9.59 percentage points. This describes a difference between averages. It does not say every student scored higher, and it is not a 9.59 percent relative increase.",
    "Explain why a difference between averages cannot describe every student.",
    [
      evidence(
        "quiz",
        "Mean quiz scores were 73.41% in the texting condition and 83.00% in the no-text condition.",
        "Experiment 2, printed page 47",
      ),
    ],
  ),
  question(
    {
      id: "evidence-limit",
      title: "Know when to stop",
      stage: "Evidence boundary",
      prompt:
        "Can these group summaries tell you the exact quiz score of every student?",
      study:
        "You have two group averages and their reported comparison. Individual quiz records are not included in this teaching excerpt.",
      choices: [
        "We need the individual score records",
        "Everyone received their group average",
        "We can reconstruct all scores from the averages",
      ],
      hint: "Many different sets of individual scores can have the same average.",
      transfer: false,
    },
    "We need the individual score records",
    "The excerpt does not include individual records. Return an insufficient evidence boundary rather than inventing exact scores.",
    "",
    "Group averages do not identify each person’s score. Individual score records are needed before making that claim.",
    "Name the missing evidence before attempting a more specific conclusion.",
    [
      evidence(
        "limit",
        "This teaching excerpt contains group summaries only. It does not supply individual score records.",
        "Teaching adaptation of Experiment 2",
      ),
    ],
    true,
  ),
  question(
    {
      id: "transfer-paired",
      title: "A new study, your reasoning",
      stage: "Transfer challenge",
      prompt: "Should this new comparison account for pairing?",
      study:
        "A fictional study asks the same 30 students to estimate their confidence before a workshop and again after it. Each student provides both estimates.",
      choices: [
        "Account for paired measurements",
        "Treat the estimates as two unrelated groups",
        "Treat all 60 estimates as unrelated people",
      ],
      hint: "The important link is the person, not the label “before” or “after”.",
      transfer: true,
    },
    "Account for paired measurements",
    "The same participants supply both measurements. The analysis must account for within-person pairing. Timing alone does not establish pairing, the repeated people do. Test assumptions still need checking.",
    "You identified the same-person link in an unfamiliar study.",
    "Each student contributes two estimates. Those measurements are linked within the person, so the comparison must account for pairing.",
    "Explain why changing the workshop topic would not remove the pairing.",
    [
      synthetic(
        "workshop",
        "The same 30 students each provide a before and an after confidence estimate.",
      ),
    ],
  ),
  question(
    {
      id: "transfer-gap",
      title: "Put the numbers in context",
      stage: "Transfer challenge",
      prompt:
        "What does the difference between these fictional group averages tell you?",
      study:
        "In a new fictional experiment, a quiet-room group averages 80% and a background-music group averages 72% on a short quiz. Course grades were not measured.",
      choices: [
        "Quiet-room scores average 8 percentage points higher",
        "Music makes every student fail their course",
        "Quiet-room scores are 8 percent higher relative to music",
      ],
      hint: "State the units and the outcome the study actually measured.",
      transfer: true,
      chart: {
        labels: ["Background music", "Quiet room"],
        values: [72, 80],
        caption: "Fictional teaching example · Average short-quiz score",
      },
    },
    "Quiet-room scores average 8 percentage points higher",
    "The absolute mean difference is 8 percentage points, not 8 percent relative increase. This describes group quiz averages, not each individual or course failure. A relative increase against 72 would be about 11.11 percent.",
    "You applied the units and outcome limits to a new example.",
    "80 minus 72 is 8 percentage points. The outcome is average quiz performance, not course failure or the performance of every person.",
    "Write one conclusion the supplied results support and one they do not.",
    [
      synthetic(
        "quiet-room",
        "Quiet-room average: 80%. Background-music average: 72%. Course grades were not measured.",
      ),
    ],
  ),
];
export const questionById = new Map(
  teachingQuestions.map((q) => [q.public.id, q]),
);
export function publicLesson(mode: FeedbackMode | "unconfigured"): Lesson {
  return {
    version: LESSON_VERSION,
    title: "Can you text and still learn?",
    subtitle: "One study. Six small quests. A better way to read research.",
    authors: "Amanda C. Gingerich & Tara T. Lineweaver",
    year: 2014,
    sourceUrl: SOURCE,
    sourceTitle: "Text messaging during class and comprehension",
    reviewStatus:
      "Draft teaching content. Expert review and learning-outcome validation pending.",
    mode,
    questions: teachingQuestions.map((q) => q.public),
  };
}
