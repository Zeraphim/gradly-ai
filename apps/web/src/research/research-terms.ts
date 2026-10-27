export const researchTerms: Record<string, string> = {
  Evidence:
    "Information that bears on a research question. Its relevance, source, collection, and limits matter when deciding what a claim can support.",
  "Qualitative theme":
    "A pattern of meaning developed through interpretation of material such as interview accounts. A theme does not by itself estimate how common an experience is in a population.",
  "Causal claim":
    "A claim that one factor changes another. The research design and competing explanations determine how well the evidence supports that claim; an association alone does not establish it.",
  Confounding:
    "Another factor provides an alternative explanation for an apparent relationship. Consider whether the design or analysis addresses that explanation before making a causal claim.",
  Transfer:
    "Applying a reasoning principle to a new setting while checking whether its conditions and limits still fit. Completing one example does not establish mastery in other settings.",
  "Between-participants design":
    "Different participants contribute observations in each condition.",
  "Random assignment":
    "A chance process assigns participants to conditions. It supports causal comparisons by reducing systematic differences between groups before the study begins.",
  "Random sampling":
    "A chance process selects people from a population. It concerns how well a sample represents that population. It differs from random assignment to study conditions.",
  "Independent-samples t-test":
    "Compares the means of two independent groups. The pooled version assumes equal population variances. Welch’s version does not require that assumption.",
  "One-way ANOVA":
    "Analysis of variance tests group mean differences for one factor. With two groups, the usual equal-variance ANOVA and pooled t-test are equivalent: F = t².",
  "Paired-samples t-test":
    "Tests the mean difference between linked observations, such as repeated measurements of the same people.",
  "Percentage points":
    "The arithmetic difference between two percentages. For example, 80% minus 70% is 10 percentage points. A relative percentage change instead divides the difference by a baseline.",
  "p-value":
    "Under a specified null model and test assumptions, the probability of a result at least as extreme as the one observed.",
  "Standard deviation":
    "Describes how much observations vary around a mean, in the same units as the outcome.",
  Generalizability:
    "Whether findings apply to people, contexts, and outcomes beyond those studied.",
};

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
