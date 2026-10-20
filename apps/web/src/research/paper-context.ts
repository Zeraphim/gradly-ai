/** Authored method-only context for the reference study. Never upload-derived or assessed. */

/**
 * The paper's published identity. It is authored here because the sample job
 * exposes no citation, and it must stay separate from anything an upload says.
 */
export const paperCitation = {
  title: "OMG! Texting in Class = U Fail :(",
  subtitle: "Can you text and still learn?",
  authors: "Gingerich & Lineweaver",
  year: "2014",
  journal: "Teaching of Psychology",
  issue: "41(1), 44–51",
  doi: "10.1177/0098628313514177",
} as const;

export const paperIdentity = `${paperCitation.authors} (${paperCitation.year}) · ${paperCitation.journal} ${paperCitation.issue}`;

export type PaperChapterId =
  "question" | "design" | "measurement" | "boundaries";

export type PaperChapter = {
  id: PaperChapterId;
  label: string;
  kicker: string;
  title: string;
  /** One sentence shown under the heading. The story keeps text off the stage. */
  caption: string;
  /** The mascot's line for this chapter. One short sentence. */
  narration: string;
  /** Optional depth, hidden behind one disclosure per chapter. */
  deep: string;
  deepLabel: string;
  /** What a careful reader should not over-read. */
  caution: string;
  source: string;
};

export const paperContext: readonly PaperChapter[] = [
  {
    id: "question",
    label: "Research question",
    kicker: "The question",
    title: "What changes when students text?",
    caption:
      "One lecture, one quiz: does texting while listening change how much students remember?",
    narration: "Every study starts with one sharp question.",
    deep: "The researchers asked whether texting during a lecture changes comprehension. Keep the comparison precise: texting versus no texting, measured by a quiz after the lecture.",
    deepLabel: "Why the question is narrow",
    caution:
      "A question about comprehension is different from a claim about overall academic success.",
    source: "Reference study · pp. 44–47 · authored paraphrase",
  },
  {
    id: "design",
    label: "Study design",
    kicker: "The setup",
    title: "One student. One condition.",
    caption:
      "56 undergraduates were randomly assigned to text or not text. Each student experienced one condition, so the two groups started out comparable.",
    narration: "Here is the setup: two groups, one difference.",
    deep: "In Experiment 2, 56 undergraduates were randomly assigned to texting or no texting. Each student experienced one condition. Both groups followed the same lecture, distractor activity and quiz.",
    deepLabel: "How assignment worked",
    caution:
      "Random assignment describes how the conditions were allocated. It does not mean the participants were randomly sampled from every university.",
    source: "Reference study · p. 47 · authored paraphrase",
  },
  {
    id: "measurement",
    label: "Measurement",
    kicker: "The measure",
    title: "Follow the session, then inspect the measure.",
    caption:
      "Both groups sat the same lecture, waited through the same distraction, then took the same nine-item quiz.",
    narration: "Watch the session before you judge the score.",
    deep: "An approximately 30-minute lecture was followed by a 10-minute distractor and a nine-item comprehension quiz. Scores were reported as percentage correct.",
    deepLabel: "What the quiz can show",
    caution:
      "A short quiz tells us about this comprehension check. It does not directly measure semester grades or long-term retention.",
    source: "Reference study · p. 47 · authored paraphrase",
  },
  {
    id: "boundaries",
    label: "Boundaries",
    kicker: "The edge",
    title: "A useful study still has limits.",
    caption:
      "One university, prescribed text conversations. Everyday texting and other classrooms may behave differently.",
    narration: "A good finding still knows where it stops.",
    deep: "The study used a single university sample and prescribed text conversations. Everyday texting and other classrooms may differ. The earlier experiment selected texting volunteers rather than randomly assigning conditions.",
    deepLabel: "Keep the two experiments apart",
    caution:
      "Keep the two experiments distinct. The later random assignment strengthens the comparison without removing every limitation.",
    source: "Reference study · p. 46 and discussion · authored paraphrase",
  },
];

/** One line, so the page states provenance once instead of on every card. */
export const contextProvenance =
  "Authored for this pilot — not generated from, or an analysis of, your upload.";
