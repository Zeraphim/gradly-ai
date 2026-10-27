import { z } from "zod";

/**
 * Context-specific term definitions attached to one challenge. A definition
 * says what the term means in this paper, not in general. `paper` definitions
 * cite at least one evidence excerpt that supports them; `model` definitions
 * are the model's own explanation in the paper's context and cite none.
 */
export const MAX_TERMS = 4;
export const MAX_DEFINITION_LENGTH = 240;
export const termSources = ["paper", "model"] as const;
export const termSchema = z.object({
  term: z.string().min(2).max(60),
  definition: z.string().min(12).max(MAX_DEFINITION_LENGTH),
  refs: z.array(z.string()),
  source: z.enum(termSources),
});
export const termsSchema = z.array(termSchema).max(MAX_TERMS);
export type Term = z.infer<typeof termSchema>;

/** The challenge fields a term may come from, split by when the learner sees them. */
export type TermText = {
  prompt: string;
  options: { id: string; text: string }[];
  hint: string;
  explanation: string;
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const dashes = "-\u2010-\u2015\u2212";

/** Whole-word, case-insensitive pattern for a term. Dash and apostrophe
 *  variants match each other, since models often write typographic ones. */
export function termPattern(term: string, flags = "iu") {
  const words = term
    .trim()
    .split(/\s+/)
    .map((word) =>
      escape(word)
        .replace(new RegExp(`[${dashes}]`, "gu"), `[${dashes}]`)
        .replace(/['\u2018\u2019]/gu, "['\u2018\u2019]"),
    )
    .join("\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${words}(?![\\p{L}\\p{N}])`, flags);
}

export function termIn(term: string, text: string) {
  return !!term.trim() && termPattern(term).test(text);
}

/** Text a learner sees before answering: prompt, options and hint. */
export function beforeAnswerText(c: TermText) {
  return [c.prompt, ...c.options.map((o) => o.text), c.hint];
}

/**
 * Terms the learner may see now. Terms found in the prompt, options or hint
 * ship with the challenge. A term found only in the explanation follows the
 * explanation's gate, so it stays hidden until the explanation is shown.
 */
export function visibleTerms<T extends Pick<Term, "term">>(
  c: TermText & { terms?: T[] },
  explanationShown: boolean,
): T[] {
  const early = beforeAnswerText(c);
  return (c.terms ?? []).filter(
    (t) =>
      early.some((text) => termIn(t.term, text)) ||
      (explanationShown && termIn(t.term, c.explanation)),
  );
}

/** Ref ids named after a findings, claims, results or limitations aspect. */
export const resultsRefId = /^(finding|claim|result|limitation)/i;

const canonical = (s: string) =>
  s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/** Option text long enough that quoting it in a definition gives the answer away. */
const quotable = (text: string) =>
  canonical(text).split(" ").length >= 3 && canonical(text).length >= 15;

/**
 * Deterministic problems with a challenge's terms. `evidenceIds` are the
 * lesson's evidence ids. A `paper` term cites only excerpts its challenge
 * already cites, so a definition never opens evidence the challenge does not
 * show. Leakage checks: a design-stage term may not cite results-side
 * evidence, and no definition may quote an accepted option.
 */
export function termProblems(
  c: TermText & {
    id: string;
    reveal: string;
    accepted: string[];
    refs: string[];
    terms?: Term[];
  },
  evidenceIds: Iterable<string>,
): string[] {
  if (c.terms === undefined) return [];
  const problems: string[] = [];
  const parsed = termsSchema.safeParse(c.terms);
  if (!parsed.success) {
    problems.push(
      `${c.id}: terms must be at most ${MAX_TERMS} entries with definitions of ${MAX_DEFINITION_LENGTH} characters or fewer.`,
    );
    return problems;
  }
  const known = new Set(evidenceIds);
  const text = [...beforeAnswerText(c), c.explanation];
  const seen = new Set<string>();
  const accepted = c.options
    .filter((o) => c.accepted.includes(o.id) && quotable(o.text))
    .map((o) => canonical(o.text));
  for (const t of parsed.data) {
    const key = canonical(t.term);
    if (seen.has(key)) problems.push(`${c.id}: duplicate term "${t.term}".`);
    seen.add(key);
    if (!text.some((s) => termIn(t.term, s)))
      problems.push(`${c.id}: term "${t.term}" is not in the challenge text.`);
    if (t.refs.some((r) => !known.has(r)))
      problems.push(`${c.id}: term "${t.term}" cites unknown evidence.`);
    else if (t.refs.some((r) => !c.refs.includes(r)))
      problems.push(
        `${c.id}: term "${t.term}" cites evidence its challenge does not cite.`,
      );
    if (t.source === "paper" && !t.refs.length)
      problems.push(`${c.id}: paper term "${t.term}" needs an evidence ref.`);
    if (t.source === "model" && t.refs.length)
      problems.push(`${c.id}: model term "${t.term}" must not cite evidence.`);
    if (c.reveal === "design" && t.refs.some((r) => resultsRefId.test(r)))
      problems.push(
        `${c.id}: design-stage term "${t.term}" cites results-side evidence.`,
      );
    const definition = canonical(t.definition);
    if (accepted.some((answer) => definition.includes(answer)))
      problems.push(
        `${c.id}: term "${t.term}" definition quotes an accepted answer.`,
      );
  }
  return problems;
}

/** Keeps only terms that pass every check, so one bad term does not drop the rest. */
export function validTerms(
  c: Parameters<typeof termProblems>[0],
  evidenceIds: Iterable<string>,
): Term[] {
  const ids = [...evidenceIds];
  const kept: Term[] = [];
  for (const t of c.terms ?? []) {
    if (kept.length >= MAX_TERMS) break;
    if (!termProblems({ ...c, terms: [...kept, t] }, ids).length) kept.push(t);
  }
  return kept;
}
