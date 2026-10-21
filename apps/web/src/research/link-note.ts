// A pasted link is not fetched yet. In sample mode it becomes a small "link
// note" PDF that records what the learner submitted and says plainly that the
// link was not read, so it can travel through the same saved preparation.

function host(value: string) {
  try {
    return new URL(/^[a-z]+:\/\//i.test(value) ? value : `https://${value}`)
      .hostname;
  } catch {
    return "";
  }
}

const PREFIX = "Paper link - ";

/**
 * Link notes exist only in sample preview. With live AI, a note's placeholder
 * text would be sent to the model as if it were the paper, so links open the
 * prepared study instead.
 */
export function linkNotesAllowed(
  config: { liveAI: boolean; demoAvailable: boolean } | null,
) {
  return !!config && !config.liveAI && config.demoAvailable;
}

/** A short, filesystem-safe document name for the link. */
export function linkNoteName(value: string) {
  const label = (host(value) || value)
    .replace(/[^\w.-]+/g, " ")
    .trim()
    .slice(0, 60);
  return `${PREFIX}${label || "submitted"}.pdf`;
}

/** The link's label when a saved document name is a link note. */
export function linkNoteLabel(name: string) {
  return name.startsWith(PREFIX) && name.endsWith(".pdf")
    ? name.slice(PREFIX.length, -4) || null
    : null;
}

export function linkNoteText(value: string) {
  const link = value.trim().slice(0, 300);
  return [
    `Paper link submitted to Gradly: ${link}.`,
    "This link was noted but not fetched. Gradly does not import papers from links yet.",
    "In this sample preview, Gradly prepares an authored study about texting during lectures instead of analysing the linked paper.",
    "Upload the paper as a PDF when link import is available or live processing is configured.",
  ].join(" ");
}

/** A minimal one-page text PDF; the server extracts this text like any upload. */
export function linkNotePdf(value: string): File {
  const ascii = linkNoteText(value)
    .normalize("NFKD")
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/[()\\]/g, " ");
  const lines = ascii.match(/.{1,80}(?:\s|$)/g) ?? [ascii];
  const stream = `BT /F1 11 Tf 15 TL 50 750 Td ${lines
    .map((line) => `(${line.trim()}) Tj T*`)
    .join(" ")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((object, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .map((n) => `${String(n).padStart(10, "0")} 00000 n `)
    .join(
      "\n",
    )}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new File([pdf], linkNoteName(value), { type: "application/pdf" });
}
