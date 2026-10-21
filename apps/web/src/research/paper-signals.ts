// A quick, local text check shown during review. It spots common research
// section headings in the extracted text; it is not an analysis of the paper
// and never decides whether a paper can be used.
export const researchSections = [
  { id: "abstract", label: "Abstract", pattern: /abstract|summary/ },
  {
    id: "introduction",
    label: "Introduction",
    pattern: /introduction|background|literature review/,
  },
  {
    id: "method",
    label: "Methods",
    pattern: /methods?|methodology|materials and methods|procedure|design/,
  },
  {
    id: "participants",
    label: "Participants",
    pattern: /participants|subjects|sample|respondents/,
  },
  { id: "results", label: "Results", pattern: /results|findings/ },
  {
    id: "discussion",
    label: "Discussion",
    pattern: /discussion|conclusions?|general discussion/,
  },
  {
    id: "references",
    label: "References",
    pattern: /references|bibliography|works cited/,
  },
] as const;

export type SectionId = (typeof researchSections)[number]["id"];

const numbering = /^(?:\d+(?:\.\d+)*\.?|[ivx]+\.)\s*/i;

/** The heading-like text of a line, or null when the line reads as prose. */
function headingText(line: string): string | null {
  const text = line.trim().replace(numbering, "").replace(/[:.]$/, "");
  if (!text || text.length > 48) return null;
  if (text.split(/\s+/).length > 5) return null;
  return text.toLowerCase();
}

export function isHeadingLine(line: string) {
  const text = headingText(line);
  if (!text) return false;
  if (
    researchSections.some((s) =>
      new RegExp(`^(${s.pattern.source})$`).test(text),
    )
  )
    return true;
  // Short all-capitals lines are usually headings in extracted PDFs.
  const raw = line.trim();
  return raw.length >= 4 && /[A-Z]/.test(raw) && raw === raw.toUpperCase();
}

/** Which common research sections appear as heading lines in the text. */
export function spotSections(pages: { text: string }[]): Set<SectionId> {
  const found = new Set<SectionId>();
  for (const page of pages)
    for (const line of page.text.split(/\n/)) {
      const text = headingText(line);
      if (!text) continue;
      for (const section of researchSections)
        if (new RegExp(`^(${section.pattern.source})$`).test(text))
          found.add(section.id);
    }
  return found;
}
