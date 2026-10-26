import { it, expect } from "vitest";
import { paperLinkSupported } from "../../apps/api/src/research/contracts.js";

const pages = [
  {
    page: 1,
    text: "Front. Psychol. 11:560. doi: 10.3389/fpsyg.2020.00560 This article is available online at: https://www.frontiersin.org/articles/10.3389/fpsyg.\n2020.00560/full",
  },
];

it("matches a DOI in any link form, ignoring case and PDF line breaks", () => {
  for (const url of [
    "https://doi.org/10.3389/fpsyg.2020.00560",
    "https://dx.doi.org/10.3389/FPSYG.2020.00560",
    "http://doi.org/10.3389/fpsyg.2020.00560",
    "https://www.frontiersin.org/articles/10.3389/fpsyg.2020.00560/full",
    "https://www.frontiersin.org/articles/10.3389/fpsyg.2020.00560/pdf",
  ])
    expect(paperLinkSupported(url, pages), url).toBe(true);
});

it("rejects a DOI or link the document does not contain", () => {
  expect(
    paperLinkSupported("https://doi.org/10.3389/fpsyg.2021.00001", pages),
  ).toBe(false);
  expect(paperLinkSupported("https://example.org/paper", pages)).toBe(false);
});
