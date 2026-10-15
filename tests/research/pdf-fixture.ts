export function multiPagePdfBytes(count = 9) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${Array.from({ length: count }, (_, i) => `${3 + i * 2} 0 R`).join(" ")}] /Count ${count} >>`,
  ];
  const font = 3 + count * 2;
  for (let i = 0; i < count; i++) {
    const text = `Project planning page ${i + 1}. This document is a private project plan, not an empirical classroom experiment. It includes tasks, schedules, assumptions and questions for later review. No statistical findings should be inferred from it.`;
    const lines = text.match(/.{1,70}(?:\s|$)/g) ?? [];
    const stream = `BT /F1 12 Tf 16 TL 50 750 Td ${lines.map((line) => `(${line}) Tj T*`).join(" ")} ET`;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${4 + i * 2} 0 R >>`,
      `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    );
  }
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [i, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => String(n).padStart(10, "0") + " 00000 n ")
    .join(
      "\n",
    )}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}

export function pdfBytes(
  text = "An empirical research paper. Fifty-six participants were randomly assigned to one of two independent groups. Each group attended a lecture and completed a numerical comprehension quiz. The design supports a comparison of independent group means. Researchers must examine variance and distribution assumptions.",
) {
  const lines = text.match(/.{1,70}(?:\s|$)/g) ?? [""];
  const stream = `BT /F1 12 Tf 16 TL 50 750 Td ${lines.map((line) => `(${line.replace(/[()\\]/g, " ")}) Tj T*`).join(" ")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((o, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => String(n).padStart(10, "0") + " 00000 n ")
    .join(
      "\n",
    )}\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}

// Rasterize a synthetic text PDF, then embed only its pixels in a second PDF.
// This fixture contains no searchable text and exercises the actual OCR path.
export async function scannedPdfBytes() {
  const { PDFParse } = await import("pdf-parse");
  const { createCanvas, loadImage } = await import("@napi-rs/canvas");
  const { deflateSync } = await import("node:zlib");
  const parser = new PDFParse({ data: new Uint8Array(pdfBytes()) });
  let png: Uint8Array;
  try {
    const result = await parser.getScreenshot({
      desiredWidth: 1400,
      imageBuffer: true,
      imageDataUrl: false,
    });
    png = result.pages[0]!.data;
  } finally {
    await parser.destroy();
  }
  const image = await loadImage(Buffer.from(png));
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const rgba = ctx.getImageData(0, 0, image.width, image.height).data;
  const rgb = Buffer.alloc(image.width * image.height * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4) {
    rgb[j++] = rgba[i]!;
    rgb[j++] = rgba[i + 1]!;
    rgb[j++] = rgba[i + 2]!;
  }
  const pixels = deflateSync(rgb);
  const drawing = Buffer.from("q 612 0 0 792 0 0 cm /Image1 Do Q");
  const objects = [
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
    Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    Buffer.from(
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Image1 6 0 R >> >> /Contents 5 0 R >>",
    ),
    Buffer.from("<< >>"),
    Buffer.concat([
      Buffer.from(`<< /Length ${drawing.length} >>\nstream\n`),
      drawing,
      Buffer.from("\nendstream"),
    ]),
    Buffer.concat([
      Buffer.from(
        `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${pixels.length} >>\nstream\n`,
      ),
      pixels,
      Buffer.from("\nendstream"),
    ]),
  ];
  const chunks = [Buffer.from("%PDF-1.4\n")];
  const offsets: number[] = [];
  let length = chunks[0]!.length;
  objects.forEach((obj, i) => {
    offsets.push(length);
    const chunk = Buffer.concat([
      Buffer.from(`${i + 1} 0 obj\n`),
      obj,
      Buffer.from("\nendobj\n"),
    ]);
    chunks.push(chunk);
    length += chunk.length;
  });
  chunks.push(
    Buffer.from(
      `xref\n0 7\n0000000000 65535 f \n${offsets.map((n) => String(n).padStart(10, "0") + " 00000 n ").join("\n")}\ntrailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${length}\n%%EOF`,
    ),
  );
  return Buffer.concat(chunks);
}
