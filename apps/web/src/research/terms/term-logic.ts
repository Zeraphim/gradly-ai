import { termPattern, type Term } from "@paperquest/contracts";
import { inlineGlossary } from "./glossary.js";

/** A cited excerpt behind a `paper` definition. */
export type TermSource = { id: string; page: number; excerpt: string };

/** One markable term with everything its popover shows. */
export type TermEntry = {
  key: string;
  term: string;
  definition: string;
  /** `glossary` is the general fallback, not a lesson definition. */
  origin: "paper" | "model" | "glossary";
  sources: TermSource[];
};

export const termKey = (term: string) =>
  term.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Lesson terms first, then glossary entries the lesson does not define. A
 * lesson entry always wins over a glossary entry with the same name.
 */
export function termEntries(
  terms: Term[] | undefined,
  evidence: TermSource[],
  withGlossary = true,
): TermEntry[] {
  const entries: TermEntry[] = [];
  const seen = new Set<string>();
  for (const t of terms ?? []) {
    const key = termKey(t.term);
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({
      key,
      term: t.term,
      definition: t.definition,
      origin: t.source,
      sources:
        t.source === "paper"
          ? evidence.filter((r) => t.refs.includes(r.id))
          : [],
    });
  }
  if (withGlossary)
    for (const g of inlineGlossary) {
      const key = termKey(g.term);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ key, ...g, origin: "glossary", sources: [] });
    }
  return entries;
}

export type Segment = { text: string; key?: string };

/**
 * Splits text into plain runs and term marks. Each term is marked at its first
 * free occurrence; longer terms win where two overlap, so "random assignment" is
 * one mark rather than a mark on "random".
 */
export function segmentText(
  text: string,
  entries: Pick<TermEntry, "key" | "term">[],
): Segment[] {
  const hits: { start: number; end: number; key: string }[] = [];
  const ordered = [...entries].sort((a, b) => b.term.length - a.term.length);
  for (const entry of ordered)
    for (const match of text.matchAll(termPattern(entry.term, "giu"))) {
      const start = match.index;
      const end = start + match[0].length;
      if (hits.some((h) => start < h.end && end > h.start)) continue;
      hits.push({ start, end, key: entry.key });
      break;
    }
  hits.sort((a, b) => a.start - b.start);
  const segments: Segment[] = [];
  let at = 0;
  for (const hit of hits) {
    if (hit.start > at) segments.push({ text: text.slice(at, hit.start) });
    segments.push({ text: text.slice(hit.start, hit.end), key: hit.key });
    at = hit.end;
  }
  if (at < text.length) segments.push({ text: text.slice(at) });
  return segments;
}

export type Placement = {
  side: "top" | "bottom";
  top: number;
  left: number;
  /** Arrow position from the popover's left edge. */
  arrow: number;
};

/**
 * Places the popover above its term when there is room, so the answer
 * options below a question stay uncovered, and flips below otherwise. The
 * popover stays inside the viewport and its arrow points at the term.
 */
export function placePopover(
  anchor: { top: number; bottom: number; left: number; width: number },
  size: { width: number; height: number },
  viewport: { width: number; height: number },
  gap = 10,
  margin = 12,
): Placement {
  const roomAbove = anchor.top - gap - margin;
  const roomBelow = viewport.height - anchor.bottom - gap - margin;
  const side =
    size.height <= roomAbove
      ? "top"
      : size.height <= roomBelow
        ? "bottom"
        : roomAbove >= roomBelow
          ? "top"
          : "bottom";
  const top =
    side === "top"
      ? Math.max(margin, anchor.top - gap - size.height)
      : Math.min(
          anchor.bottom + gap,
          Math.max(margin, viewport.height - margin - size.height),
        );
  const center = anchor.left + anchor.width / 2;
  const left = clamp(
    center - size.width / 2,
    margin,
    Math.max(margin, viewport.width - margin - size.width),
  );
  return { side, top, left, arrow: clamp(center - left, 18, size.width - 18) };
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/**
 * A short window of an excerpt around the term, with the term located for
 * highlighting. Long excerpts are cut at word boundaries with ellipses.
 */
export function excerptSnippet(excerpt: string, term: string, size = 240) {
  const text = excerpt.replace(/\s+/g, " ").trim();
  const match = termPattern(term).exec(text);
  let start = 0;
  if (match && text.length > size)
    start = Math.max(0, match.index - Math.floor((size - match[0].length) / 2));
  let end = Math.min(text.length, start + size);
  start = Math.max(0, end - size);
  if (start > 0) start = text.indexOf(" ", start) + 1 || start;
  if (end < text.length) end = text.lastIndexOf(" ", end) || end;
  const body = text.slice(start, end);
  const found = termPattern(term).exec(body);
  return {
    before:
      (start > 0 ? "…" : "") + (found ? body.slice(0, found.index) : body),
    mark: found ? found[0] : "",
    after:
      (found ? body.slice(found.index + found[0].length) : "") +
      (end < text.length ? "…" : ""),
  };
}

/** "p. 4" or "pp. 3, 5" for the cited pages. */
export function pageLabel(sources: TermSource[]) {
  const pages = [...new Set(sources.map((s) => s.page))].sort((a, b) => a - b);
  return pages.length > 1 ? `pp. ${pages.join(", ")}` : `p. ${pages[0]}`;
}
