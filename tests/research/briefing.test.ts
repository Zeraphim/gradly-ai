import { describe, expect, it } from "vitest";
import {
  briefingParts,
  LEAD_WORDS,
} from "../../apps/web/src/research/studies/briefing.js";
import {
  loadStudy,
  studies as cards,
} from "../../apps/web/src/research/studies/catalog.js";

const words = (text: string) => text.split(/\s+/).filter(Boolean);

// The generated briefing reported on 27 October 2026: one 250-word block that
// pushed "Begin study" below the screen.
const longBlock =
  "Gradly’s Lesson Architect presents a field experiment that examined how to reduce employees’ susceptibility to phishing attacks. Over ten thousand workers from a Dutch ministry were unaware they were part of a study. Researchers tested two interventions: an information campaign that delivered infographics about phishing risks, and a simulated-experience intervention that sent a realistic phishing email followed by a brief debrief. A third group received both interventions, while a fourth group served as a control. All participants later received a second phishing email to measure whether they clicked the link and entered their password. The study aimed to determine whether providing information, gaining experience, or combining the two best lowers risky behavior. The experiment used a 2×2 factorial design, assigning employees to groups of roughly equal size based on whether they received information, experience, both, or neither. Randomization was conducted at the level of the smallest organizational unit to limit spillover. Outcomes were measured as clicking the link (Visit) and entering a password (Fill), with a conditional measure (Fill|Visit) indicating password entry given a click. The study also collected basic demographics and organizational division data.";

describe("study intro briefing", () => {
  it("shows every prepared study's briefing whole, as written", async () => {
    for (const card of cards) {
      const study = (await loadStudy(card.slug))!;
      const paragraphs = study.lesson.briefing
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);
      expect(briefingParts(study.lesson.briefing), card.slug).toEqual({
        lead: paragraphs,
        more: [],
      });
    }
  });

  it("folds a long single-block briefing behind a short lead without losing text", () => {
    const { lead, more } = briefingParts(longBlock);
    expect(lead).toHaveLength(1);
    expect(words(lead[0]!).length).toBeLessThanOrEqual(LEAD_WORDS);
    expect(more.length).toBeGreaterThan(1);
    expect(words([...lead, ...more].join(" "))).toEqual(words(longBlock));
    // Sentences stay whole: every part ends a sentence.
    for (const part of [...lead, ...more]) expect(part).toMatch(/[.!?]$/);
  });

  it("keeps the first paragraph as the lead when the writer used paragraphs", () => {
    const first =
      "Workers at a ministry took part in a study about email risks.";
    const briefing = `${first}\n${longBlock}`;
    const { lead, more } = briefingParts(briefing);
    expect(lead).toEqual([first]);
    expect(words(more.join(" "))).toEqual(words(longBlock));
  });

  it("does not split abbreviations or a single very long sentence", () => {
    const sentence = `Researchers compared groups, e.g. ${"those who saw a message and those who did not, ".repeat(
      8,
    )}across offices.`;
    const { lead, more } = briefingParts(
      `${sentence} A second sentence follows.`,
    );
    expect(lead).toEqual([sentence]);
    expect(more).toEqual(["A second sentence follows."]);
  });
});
