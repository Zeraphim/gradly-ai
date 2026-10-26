/**
 * The Lesson Architect's wire shape for a lesson: each option carries a
 * correct flag and there is no accepted list. Other values pass through, so
 * mocks can wrap every provider output.
 */
export function asDraft<T>(output: T): T {
  if (!output || typeof output !== "object" || !("challenges" in output))
    return output;
  type C = { options: { id: string }[]; accepted?: string[] };
  const flag = (c: C | null | undefined) => {
    if (!c?.accepted) return c;
    const { accepted, ...rest } = c;
    return {
      ...rest,
      options: c.options.map((o) => ({
        ...o,
        correct: accepted.includes(o.id),
      })),
    };
  };
  const lesson = output as { challenges: C[]; bonus?: C | null };
  return {
    ...output,
    challenges: lesson.challenges.map(flag),
    ...("bonus" in lesson ? { bonus: flag(lesson.bonus) } : {}),
  } as T;
}
