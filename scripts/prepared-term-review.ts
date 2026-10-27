/**
 * Definitions removed after reading every design-stage term of the prepared
 * studies for answer leaks (#39). The automated leak check misses some
 * study-specific definitions of terms inside answer options. Each entry says
 * how the definition gave the answer away. scripts/define-prepared-terms.ts
 * drops these on generation and `prune` drops them from saved files.
 */
export const removedTerms: {
  slug: string;
  challenge: string;
  term: string;
  reason: string;
}[] = [
  {
    slug: "breakfast-grades",
    challenge: "q1",
    term: "cross-sectional",
    reason:
      "Describes this study's single-assessment design, matching the accepted design.",
  },
  {
    slug: "breakfast-grades",
    challenge: "q2",
    term: "yes/no question",
    reason:
      "Says the yes/no measure cannot convey the habit, which is the accepted answer.",
  },
  {
    slug: "conformity-replication",
    challenge: "q3",
    term: "critical trials",
    reason:
      "Says the critical trials measure conformity, pointing at the accepted measure.",
  },
  {
    slug: "conformity-replication",
    challenge: "q3",
    term: "all ten trials",
    reason:
      "Implies counting all trials mixes in correct-group trials, ruling that option out.",
  },
  {
    slug: "exercise-focus",
    challenge: "q2",
    term: "counterbalancing",
    reason:
      "Restates the accepted plan: session order rotated across students.",
  },
  {
    slug: "texting-lecture",
    challenge: "q1",
    term: "comprehension quiz",
    reason:
      "Names the quiz as this study's measure, pointing at the only option that mentions it.",
  },
  {
    slug: "texting-lecture",
    challenge: "q2",
    term: "within-participants design",
    reason:
      "With the prompt's one-condition assignment, rules out the within-participants option.",
  },
  {
    slug: "texting-lecture",
    challenge: "q2",
    term: "correlational survey",
    reason:
      "Says a survey would not manipulate texting, ruling out that option given the prompt.",
  },
];

const key = (s: string) =>
  s.normalize("NFKC").toLowerCase().replace(/[‐-―]/g, "-").trim();

export function isRemoved(slug: string, challenge: string, term: string) {
  return removedTerms.some(
    (r) =>
      r.slug === slug && r.challenge === challenge && key(r.term) === key(term),
  );
}
