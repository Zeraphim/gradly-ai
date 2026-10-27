/**
 * General research terms. The glossary page lists them all; in a challenge
 * they fill in only where the lesson has no context-specific definition.
 */
export const glossary: Record<string, string> = {
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

/** Entries too general to mark inline: they would underline most questions. */
const notInline = new Set(["Evidence", "Transfer"]);

/** Glossary entries a challenge may mark inline as a fallback. */
export const inlineGlossary = Object.entries(glossary)
  .filter(([term]) => !notInline.has(term))
  .map(([term, definition]) => ({ term, definition }));
