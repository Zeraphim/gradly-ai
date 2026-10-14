import {
  LESSON_VERSION,
  isFeedbackResponse,
  type FeedbackResponse,
} from "@paperquest/contracts";
export interface Attempt {
  id: string;
  choice: string;
  explanation: string;
  response?: FeedbackResponse;
}
export interface QuestionState {
  choice: string;
  explanation: string;
  attempts: Attempt[];
  finished: boolean;
  awarded: boolean;
}
export interface Session {
  schema: 1;
  version: string;
  started: boolean;
  current: number;
  questions: Record<string, QuestionState>;
}
export const emptyQuestion = (): QuestionState => ({
  choice: "",
  explanation: "",
  attempts: [],
  finished: false,
  awarded: false,
});
export const newSession = (): Session => ({
  schema: 1,
  version: LESSON_VERSION,
  started: false,
  current: 0,
  questions: {},
});
export function updateDraft(
  session: Session,
  id: string,
  draft: Partial<Pick<QuestionState, "choice" | "explanation">>,
): Session {
  const q = session.questions[id] ?? emptyQuestion();
  return {
    ...session,
    questions: { ...session.questions, [id]: { ...q, ...draft } },
  };
}
export function recordAttempt(
  session: Session,
  id: string,
  attempt: Attempt,
): Session {
  const q = session.questions[id] ?? emptyQuestion();
  if (q.finished) return session;
  const existing = q.attempts.find((x) => x.id === attempt.id);
  if (existing) return session;
  return {
    ...session,
    questions: {
      ...session.questions,
      [id]: {
        ...q,
        attempts:
          q.attempts.length >= 100
            ? [q.attempts[0]!, ...q.attempts.slice(-98), attempt]
            : [...q.attempts, attempt],
      },
    },
  };
}
export function acceptFeedback(
  session: Session,
  response: FeedbackResponse,
): Session {
  const q = session.questions[response.questionId];
  if (!q || !q.attempts.some((x) => x.id === response.attemptId))
    return session;
  const attempt = q.attempts.find((x) => x.id === response.attemptId)!;
  if (attempt.response) return session;
  const passed = response.feedback.outcome === "correct";
  const finished =
    passed || response.feedback.outcome === "insufficient_evidence";
  return {
    ...session,
    questions: {
      ...session.questions,
      [response.questionId]: {
        ...q,
        finished: q.finished || finished,
        awarded: q.awarded || passed,
        attempts: q.attempts.map((x) =>
          x.id === response.attemptId ? { ...x, response } : x,
        ),
      },
    },
  };
}
export function advance(session: Session, ids: string[]): Session {
  const id = ids[session.current];
  if (!id || !session.questions[id]?.finished) return session;
  return { ...session, current: Math.min(session.current + 1, ids.length) };
}
export function points(session: Session): number {
  return Object.values(session.questions).filter((q) => q.awarded).length * 10;
}
export function restoreSession(raw: string | null, ids: string[]): Session {
  try {
    if (!raw || raw.length > 250_000) return newSession();
    const s = JSON.parse(raw) as Session;
    if (
      s.schema !== 1 ||
      s.version !== LESSON_VERSION ||
      typeof s.started !== "boolean" ||
      !Number.isInteger(s.current) ||
      s.current < 0 ||
      s.current > ids.length ||
      !s.questions ||
      typeof s.questions !== "object"
    )
      return newSession();
    const clean = newSession();
    clean.started = s.started;
    for (const id of ids) {
      const q = s.questions[id];
      if (!q) continue;
      if (
        typeof q.choice !== "string" ||
        q.choice.length > 150 ||
        typeof q.explanation !== "string" ||
        q.explanation.length > 2000 ||
        !Array.isArray(q.attempts) ||
        q.attempts.length > 100
      )
        return newSession();
      clean.questions[id] = emptyQuestion();
      for (const a of q.attempts) {
        if (
          !a ||
          typeof a.id !== "string" ||
          !/^[a-zA-Z0-9_-]{1,80}$/.test(a.id) ||
          typeof a.choice !== "string" ||
          a.choice.length > 150 ||
          typeof a.explanation !== "string" ||
          a.explanation.length > 2000
        )
          return newSession();
        clean.questions[id]!.attempts.push({
          id: a.id,
          choice: a.choice,
          explanation: a.explanation,
        });
        if (a.response) {
          if (
            !isFeedbackResponse(a.response) ||
            a.response.questionId !== id ||
            a.response.attemptId !== a.id
          )
            return newSession();
          const accepted = acceptFeedback(clean, a.response);
          clean.questions = accepted.questions;
        }
      }
      clean.questions[id] = {
        ...clean.questions[id]!,
        choice: q.choice,
        explanation: q.explanation,
      };
    }
    // Progress is reconstructed from accepted feedback, never from a stored counter.
    let completed = 0;
    while (ids[completed] && clean.questions[ids[completed]!]?.finished)
      completed++;
    clean.current = Math.min(s.current, completed);
    return clean;
  } catch {
    return newSession();
  }
}
