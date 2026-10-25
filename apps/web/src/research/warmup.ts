/**
 * Authored warm-up shown while a paper is prepared. The cards are general
 * research habits, written for Gradly and unrelated to any uploaded paper, so
 * they cannot reveal its findings. Answers are checked here, never scored and
 * never sent anywhere.
 */
export type WarmupCard = {
  id: string;
  skill: string;
  prompt: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
};

export const warmupCards: WarmupCard[] = [
  {
    id: "oat-milk",
    skill: "Association or cause?",
    prompt:
      "A café notices that customers who order oat milk leave bigger tips. What can it say?",
    options: [
      { id: "a", text: "Oat milk makes people more generous." },
      {
        id: "b",
        text: "Oat-milk customers tip more here, but something else could explain it.",
      },
    ],
    answer: "b",
    explanation:
      "That is an association. People who choose oat milk may differ in other ways, such as income or how often they visit.",
  },
  {
    id: "fair-test",
    skill: "Fair comparison",
    prompt:
      "A school wants to test a new study app fairly. Who should get the app?",
    options: [
      { id: "a", text: "The students who ask for it." },
      { id: "b", text: "A randomly chosen half of the class." },
    ],
    answer: "b",
    explanation:
      "Random assignment makes the two groups alike on average, so a later difference points to the app rather than to who volunteered.",
  },
  {
    id: "podcast-survey",
    skill: "Who was asked?",
    prompt:
      "An online survey of 2,000 volunteers finds most people love podcasts. What is the main catch?",
    options: [
      { id: "a", text: "2,000 people is far too few." },
      {
        id: "b",
        text: "People who answer a podcast survey may already like podcasts.",
      },
    ],
    answer: "b",
    explanation:
      "Two thousand is plenty for many questions. Volunteers who choose to answer are often not like everyone else.",
  },
  {
    id: "no-difference",
    skill: "Reading “no difference”",
    prompt:
      "A study finds no significant difference between two groups. Does that prove the groups are the same?",
    options: [
      { id: "a", text: "Yes, the groups are equal." },
      {
        id: "b",
        text: "Not necessarily. The study may have been too small or imprecise to detect a difference.",
      },
    ],
    answer: "b",
    explanation:
      "Absence of evidence is not evidence of absence. Look at the size of the estimate and how uncertain it is.",
  },
];

const predictionKey = (lessonId: string) => `gradly-prediction:${lessonId}`;

/** The learner's own guess about the paper, kept in this browser only. */
export function readPrediction(lessonId: string) {
  try {
    const text = localStorage.getItem(predictionKey(lessonId)) ?? "";
    return text.slice(0, 600);
  } catch {
    return "";
  }
}

export function writePrediction(lessonId: string, text: string) {
  try {
    if (text.trim())
      localStorage.setItem(predictionKey(lessonId), text.slice(0, 600));
    else localStorage.removeItem(predictionKey(lessonId));
  } catch {}
}
