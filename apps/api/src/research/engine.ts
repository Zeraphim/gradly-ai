import { type Lesson, type LearningSession } from "./contracts.js";
/** Practice credit, once per solved challenge in this adventure. */
export function learningPoints(session: LearningSession): number {
  return (
    Object.values(session.answers).filter((attempts) =>
      attempts.some((attempt) => attempt.correct),
    ).length * 10
  );
}
export function newSession(lesson: Lesson, id: string): LearningSession {
  return {
    id,
    lessonId: lesson.id,
    source: lesson.source,
    title: lesson.title,
    index: 0,
    phase: "briefing",
    answers: {},
    retrying: false,
    version: 0,
    created: new Date().toISOString(),
    reflection: "",
    reviewIds: null,
  };
}
export function currentChallenge(s: LearningSession, l: Lesson) {
  return s.phase === "bonus"
    ? l.bonus
    : s.reviewIds
      ? l.challenges.find((c) => c.id === s.reviewIds![s.index])!
      : l.challenges[s.index];
}
export function submit(
  s: LearningSession,
  l: Lesson,
  selected: string[],
  reasoning: string,
) {
  if (!["challenge", "bonus"].includes(s.phase))
    throw Error("There is no active challenge.");
  const c = currentChallenge(s, l);
  if (!c) throw Error("Challenge unavailable.");
  const existing = s.answers[c.id] ?? [];
  if (existing.length && !s.retrying)
    throw Error("This answer is already submitted.");
  if (existing.length >= 2) throw Error("Both attempts have been used.");
  if (
    !selected.length ||
    new Set(selected).size !== selected.length ||
    selected.some((id) => !c.options.some((o) => o.id === id)) ||
    (c.type === "single" && selected.length !== 1)
  )
    throw Error("Select a valid response.");
  const match = (a: string[]) =>
    a.length === selected.length && a.every((id) => selected.includes(id));
  const correct = [c.accepted, ...c.alternatives].some(match);
  const feedback = correct
    ? c.explanation
    : selected
        .map((id) => c.misconceptions[id])
        .filter(Boolean)
        .join(" ") || "Reconsider how the evidence supports your choice.";
  return {
    ...s,
    retrying: false,
    answers: {
      ...s.answers,
      [c.id]: [
        ...existing,
        {
          selected,
          reasoning: reasoning.slice(0, 3000),
          correct,
          feedback,
          at: new Date().toISOString(),
        },
      ],
    },
  };
}
export function transition(
  s: LearningSession,
  l: Lesson,
  action: string,
): LearningSession {
  if (action === "begin" && s.phase === "briefing")
    return { ...s, phase: "challenge" };
  if (action === "retry") {
    const c = currentChallenge(s, l);
    const a = c ? s.answers[c.id] : undefined;
    if (!a || a.length !== 1 || a[0]!.correct || s.retrying)
      throw Error("Retry unavailable.");
    return { ...s, retrying: true };
  }
  if (action === "next" && ["challenge", "bonus"].includes(s.phase)) {
    const c = currentChallenge(s, l);
    const a = c ? s.answers[c.id] : undefined;
    if (!a?.length || s.retrying || (!a.at(-1)!.correct && a.length < 2))
      throw Error("Complete this challenge or use your retry first.");
    if (s.phase === "bonus") return { ...s, phase: "reveal" };
    const total = s.reviewIds?.length ?? l.challenges.length;
    if (s.index + 1 === total)
      return { ...s, phase: s.reviewIds ? "complete" : "bonus-choice" };
    return { ...s, index: s.index + 1 };
  }
  if (action === "bonus" && s.phase === "bonus-choice" && l.bonus)
    return { ...s, phase: "bonus" };
  if (action === "skip" && s.phase === "bonus-choice")
    return { ...s, phase: "reveal" };
  if (action === "finish" && s.phase === "reveal")
    return { ...s, phase: "complete" };
  throw Error("That action is not available at this stage.");
}
export function publicSession(s: LearningSession, l: Lesson) {
  const c = ["challenge", "bonus"].includes(s.phase)
    ? currentChallenge(s, l)
    : null;
  const a = c ? (s.answers[c.id] ?? []) : [];
  const last = a.at(-1);
  const showFeedback = !!last && !s.retrying;
  const challenge = c
    ? {
        id: c.id,
        stage: c.stage,
        title: c.title,
        prompt: c.prompt,
        type: c.type,
        options: c.options,
        hint: c.hint,
        evidence: c.evidence,
        references: c.refs
          .map((id) => l.evidence.find((r) => r.id === id))
          .filter(Boolean)
          .map((r) => ({ id: r!.id, page: r!.page })),
        writtenReasoning: c.writtenReasoning,
        reveal: c.reveal,
        feedback: showFeedback
          ? {
              correct: last.correct,
              message: last.feedback,
              explanation: last.correct || a.length >= 2 ? c.explanation : null,
              retryAvailable: a.length === 1 && !last.correct,
            }
          : null,
        aiFeedback: showFeedback ? (s.aiFeedback?.[c.id] ?? null) : null,
        attempts: a.length,
        previousSelection: last?.selected ?? [],
        reasoning: last?.reasoning ?? "",
      }
    : null;
  const active = s.reviewIds
    ? l.challenges.filter((c) => s.reviewIds!.includes(c.id))
    : l.challenges;
  const review = ["complete", "reveal"].includes(s.phase)
    ? active.map((c) => ({
        id: c.id,
        title: c.title,
        options: c.options,
        attempts: s.answers[c.id] ?? [],
        accepted: c.accepted,
        explanation: c.explanation,
      }))
    : null;
  const firstCorrect = active.filter(
    (c) => s.answers[c.id]?.[0]?.correct,
  ).length;
  const completed = active.filter((c) => !!s.answers[c.id]?.length).length;
  return {
    id: s.id,
    title: s.title,
    source: l.source,
    index: s.index,
    phase: s.phase,
    version: s.version,
    points: learningPoints(s),
    briefing: l.briefing,
    challenge,
    retrying: s.retrying,
    total: s.reviewIds?.length ?? l.challenges.length,
    summary: {
      completed,
      firstCorrect,
      total: active.length,
      retries: Object.values(s.answers).filter((a) => a.length > 1).length,
      missed: active
        .filter(
          (c) => s.answers[c.id]?.length && !s.answers[c.id]?.[0]?.correct,
        )
        .map((c) => c.title),
    },
    paper: ["reveal", "complete"].includes(s.phase) ? l.paper : null,
    review,
    reflection: s.reflection,
    bonusAvailable: !!l.bonus,
  };
}

export function reviseReasoning(
  s: LearningSession,
  l: Lesson,
  reasoning: string,
): LearningSession {
  if (!["challenge", "bonus"].includes(s.phase) || s.retrying)
    throw Error("Submit a response before revising its explanation.");
  const c = currentChallenge(s, l);
  const attempts = c ? s.answers[c.id] : undefined;
  if (!c?.writtenReasoning || !attempts?.length)
    throw Error("This challenge has no submitted explanation to revise.");
  const last = attempts.at(-1)!;
  if ((last.reasoningRevisions?.length ?? 0) >= 20)
    throw Error("The revision limit for this response has been reached.");
  const revised = {
    ...last,
    reasoning: reasoning.slice(0, 3000),
    reasoningRevisions: [
      ...(last.reasoningRevisions ?? []),
      { text: last.reasoning, at: new Date().toISOString() },
    ],
  };
  const aiFeedback = { ...s.aiFeedback };
  delete aiFeedback[c.id];
  return {
    ...s,
    answers: { ...s.answers, [c.id]: [...attempts.slice(0, -1), revised] },
    aiFeedback,
  };
}
