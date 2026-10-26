/**
 * Splits a lesson briefing into the lead shown on the study intro and the rest,
 * which the intro folds behind a disclosure. Generated briefings can arrive as
 * one long block; without this the intro grows past the screen and pushes
 * "Begin study" out of view. Short briefings (every prepared study) are shown
 * whole, exactly as written.
 */
export const SHORT_BRIEFING_WORDS = 80;
export const LEAD_WORDS = 60;
const PARAGRAPH_WORDS = 70;

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** Sentence ends followed by a capitalised or numbered start; keeps "e.g. the" whole. */
function sentences(paragraph: string) {
  return paragraph
    .split(/(?<=[.!?]["”’)]?)\s+(?=["“‘(]?[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Groups sentences into paragraphs of roughly `limit` words, never splitting one. */
function chunk(items: string[], limit: number) {
  const out: string[][] = [];
  for (const sentence of items) {
    const last = out.at(-1);
    if (last && countWords([...last, sentence].join(" ")) <= limit)
      last.push(sentence);
    else out.push([sentence]);
  }
  return out.map((group) => group.join(" "));
}

export function briefingParts(briefing: string): {
  lead: string[];
  more: string[];
} {
  const paragraphs = briefing
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (countWords(paragraphs.join(" ")) <= SHORT_BRIEFING_WORDS)
    return { lead: paragraphs, more: [] };
  const [first = "", ...rest] = paragraphs;
  const [lead = "", ...overflow] = chunk(sentences(first), LEAD_WORDS);
  const remainder = overflow.join(" ");
  const more = [
    ...(remainder ? chunk(sentences(remainder), PARAGRAPH_WORDS) : []),
    ...rest.flatMap((p) => chunk(sentences(p), PARAGRAPH_WORDS)),
  ];
  return { lead: [lead], more };
}
