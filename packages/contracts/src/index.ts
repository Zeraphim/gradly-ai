export const LESSON_VERSION = "texting-study-v1";
export const assessmentCodes = [
  "sound_reasoning",
  "incorrect_reasoning",
  "missing_reasoning",
] as const;
export type Assessment = (typeof assessmentCodes)[number];
export type Outcome = "correct" | "needs_revision" | "insufficient_evidence";
export type FeedbackMode = "nebius" | "preview";
export interface Question {
  id: string;
  title: string;
  stage: string;
  prompt: string;
  study: string;
  choices: string[];
  hint: string;
  transfer: boolean;
  chart?: {
    labels: [string, string];
    values: [number, number];
    caption: string;
  };
}
export interface Lesson {
  version: string;
  title: string;
  subtitle: string;
  authors: string;
  year: number;
  sourceUrl: string;
  sourceTitle: string;
  reviewStatus: string;
  mode: FeedbackMode | "unconfigured";
  questions: Question[];
}
export interface AttemptRequest {
  lessonVersion: string;
  questionId: string;
  attemptId: string;
  choice: string;
  explanation: string;
}
export interface Evidence {
  ref: string;
  text: string;
  location: string;
  sourceUrl: string;
}
export interface Feedback {
  outcome: Outcome;
  strength: string;
  correction: string;
  nextStep: string;
  mode: FeedbackMode;
  evidence: Evidence[];
}
export interface FeedbackResponse {
  attemptId: string;
  questionId: string;
  feedback: Feedback;
}
export interface ApiError {
  error: { code: string; message: string; retryable: boolean };
}
export function isFeedbackResponse(value: unknown): value is FeedbackResponse {
  if (!value || typeof value !== "object") return false;
  const v = value as FeedbackResponse;
  const f = v.feedback;
  return (
    typeof v.attemptId === "string" &&
    typeof v.questionId === "string" &&
    !!f &&
    ["correct", "needs_revision", "insufficient_evidence"].includes(
      f.outcome,
    ) &&
    ["nebius", "preview"].includes(f.mode) &&
    [f.strength, f.correction, f.nextStep].every(
      (x) => typeof x === "string",
    ) &&
    Array.isArray(f.evidence) &&
    f.evidence.every(
      (e) =>
        e &&
        [e.ref, e.text, e.location, e.sourceUrl].every(
          (x) => typeof x === "string",
        ),
    )
  );
}
