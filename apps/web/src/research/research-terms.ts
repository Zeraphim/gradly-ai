import { glossary } from "./terms/glossary.js";

export const researchTerms = glossary;

/** Match only text already visible to the learner, never options or answer keys. */
export function termMatches(text: string) {
  const lower = text.toLowerCase();
  const matches: { term: string; text: string; start: number; end: number }[] =
    [];
  for (const term of Object.keys(researchTerms)) {
    const name = term.toLowerCase();
    for (
      let start = lower.indexOf(name);
      start !== -1;
      start = lower.indexOf(name, start + name.length)
    ) {
      const end = start + name.length;
      if (
        /[a-z0-9_]/i.test(text[start - 1] ?? "") ||
        /[a-z0-9_]/i.test(text[end] ?? "")
      )
        continue;
      matches.push({ term, text: text.slice(start, end), start, end });
    }
  }
  let end = 0;
  return matches
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .filter((match) => {
      if (match.start < end) return false;
      end = match.end;
      return true;
    });
}

export function relevantTerms(text: string) {
  return [...new Set(termMatches(text).map((match) => match.term))];
}

/** Authored illustrations; none describe the learner's paper or answer choices. */
export const termExamples: Record<string, string> = {
  Evidence:
    "A recorded observation or an interview passage can be evidence for a question.",
  "Qualitative theme":
    "Several interview accounts might share an idea about belonging.",
  "Causal claim": "Saying that changing A changes B makes a causal claim.",
  Confounding:
    "If groups also met at different times, timing could be another explanation.",
  Transfer:
    "Use the same comparison principle on a different paper, then check its limits again.",
  "Between-participants design":
    "Each volunteer takes part in just one of two conditions.",
  "Random assignment": "A coin flip places volunteers into two conditions.",
  "Random sampling":
    "A lottery selects names from a list of everyone in the population of interest.",
  "Independent-samples t-test":
    "A comparison uses measurements from two separate groups.",
  "One-way ANOVA":
    "A comparison examines mean outcomes across levels of one factor.",
  "Paired-samples t-test":
    "Each person's first measurement is linked to their second measurement.",
  "Percentage points":
    "A change from 40% to 45% is an increase of five percentage points.",
  "p-value":
    "The calculation asks about results under a specified null model, rather than the probability that a claim is true.",
  "Standard deviation":
    "Two groups can share the same mean while having different spreads of scores.",
  Generalizability:
    "Ask whether results from one setting might apply in another setting.",
};
