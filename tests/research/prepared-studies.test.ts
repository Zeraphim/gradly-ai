import { describe, expect, inject, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import {
  bodySlugs,
  loadStudy,
  studies as cards,
} from "../../apps/web/src/research/studies/catalog.js";
import {
  challengeStatus,
  isCorrect,
} from "../../apps/web/src/research/studies/journey.js";
import type { StudyChallenge } from "../../apps/web/src/research/studies/types.js";
import {
  answerGuideProblems,
  bannedPhrasesIn,
  excerptProblems,
  firstAuthorSurname,
  gateProblems,
  identityProblems,
  journeyProblems,
  namesSurname,
  paperFileFor,
  sceneCheckProblems,
  sceneRepeatProblems,
} from "../../scripts/prepared-study-checks.js";
import type {} from "./papers-setup.js";

const studies = await Promise.all(
  cards.map(async (card) => (await loadStudy(card.slug))!),
);
const proofSet = [
  "texting-lecture",
  "stress-affirmation",
  "exercise-focus",
  "conformity-replication",
  "breakfast-grades",
  "sleep-school",
  "basketball-maths",
  "learning-styles",
];

describe("prepared-study catalog", () => {
  it("has exactly one lesson body per card, with matching challenge ids", () => {
    expect([...bodySlugs].sort()).toEqual(cards.map((c) => c.slug).sort());
    expect(new Set(cards.map((c) => c.slug)).size).toBe(cards.length);
    for (const [i, card] of cards.entries())
      expect(card.challenges, card.slug).toEqual(
        studies[i]!.lesson.challenges.map((c) => c.id),
      );
  });

  it("keeps slugs free of author names", () => {
    for (const study of studies) {
      const surname = firstAuthorSurname(study.lesson.paper.authors)
        .toLowerCase()
        .replace(/\s+/g, "-");
      expect(`-${study.slug}-`, study.slug).not.toContain(`-${surname}-`);
    }
  });

  it("finds the first author's surname in either author format", () => {
    expect(
      firstAuthorSurname("J. David Creswell, Janine M. Dutcher (2013)"),
    ).toBe("Creswell");
    expect(firstAuthorSurname("Stephens & Robertson (2020)")).toBe("Stephens");
    expect(
      firstAuthorSurname(
        "van der Weiden, Benjamins & Gillebaart et al. (2020)",
      ),
    ).toBe("van der Weiden");
    expect(namesSurname("A relevant habit", "van der Weiden")).toBe(false);
    expect(namesSurname("An hour outside", "An")).toBe(false);
    expect(namesSurname("Work by An and colleagues", "An")).toBe(true);
    expect(namesSurname("Creswell asked students", "Creswell")).toBe(true);
  });

  it("lists every non-school study before any school study", () => {
    const school = cards.map((c) => c.topic === "school");
    expect(
      school.indexOf(true) === -1 ||
        !school.slice(school.indexOf(true)).includes(false),
    ).toBe(true);
  });

  it("covers every design group and keeps the proof set", () => {
    expect(new Set(cards.map((s) => s.group))).toEqual(
      new Set([
        "between",
        "within",
        "replication",
        "correlational",
        "longitudinal",
        "classroom",
        "null",
      ]),
    );
    for (const slug of proofSet)
      expect(
        cards.some((s) => s.slug === slug),
        slug,
      ).toBe(true);
    // Nothing is approved until Tymee's content review.
    expect(cards.every((s) => !s.reviewed)).toBe(true);
  });

  it("keeps scenes on most required challenges in every proof-set study", () => {
    for (const slug of proofSet) {
      const challenges = studies.find((s) => s.slug === slug)!.lesson
        .challenges;
      expect(challenges.filter((c) => c.scene).length, slug).toBeGreaterThan(
        challenges.length / 2,
      );
    }
  });

  it("uses the timeline, association and estimate kinds where the design needs them", () => {
    const kinds = (slug: string) =>
      studies
        .find((s) => s.slug === slug)!
        .lesson.challenges.map((c) => c.scene?.kind);
    expect(kinds("sleep-school")).toContain("timeline");
    expect(kinds("breakfast-grades")).toContain("association");
    expect(kinds("learning-styles")).toContain("estimate");
  });

  it("flags teasers that name a known research line", () => {
    expect(bannedPhrasesIn("Strike a power pose")).toEqual(["power pose"]);
    expect(bannedPhrasesIn("TV and the death penalty")).toEqual([
      "death penalty",
    ]);
    expect(bannedPhrasesIn("An ego-depletion test")).toContain("ego-depletion");
    expect(bannedPhrasesIn("Swearing and cold water")).toEqual([]);
    expect(bannedPhrasesIn("Primary school maths")).toEqual([]);
  });

  describe.each(studies.map((s) => [s.slug, s] as const))(
    "%s",
    (slug, study) => {
      it("has well-formed challenges and answer guides", () => {
        expect(answerGuideProblems(study)).toEqual([]);
      });
      it("keeps the paper's identity out of pre-reveal text", () => {
        expect(identityProblems(study)).toEqual([]);
      });
      it("has valid scenes and response mappings", () => {
        expect(sceneCheckProblems(study)).toEqual([]);
      });
      it("hides answers and resolutions until the attempt is checked", () => {
        expect(gateProblems(study)).toEqual([]);
      });
      // The original texting lesson predates these prepared-study rules.
      if (slug !== "texting-lecture") {
        it("does not repeat a scene kind back to back", () => {
          expect(sceneRepeatProblems(study)).toEqual([]);
        });
        it("orders stages and gives each challenge a hint and readable evidence", () => {
          expect(journeyProblems(study)).toEqual([]);
        });
      }
    },
  );
});

describe("journey rules", () => {
  const challenge = {
    accepted: ["A"],
    alternatives: [["B", "C"]],
  } as unknown as StudyChallenge;
  it("checks exact answer sets, including alternatives", () => {
    expect(isCorrect(challenge, ["A"])).toBe(true);
    expect(isCorrect(challenge, ["C", "B"])).toBe(true);
    expect(isCorrect(challenge, ["A", "B"])).toBe(false);
  });
  it("allows one retry, then explains", () => {
    expect(challengeStatus([], false)).toBe("answering");
    expect(challengeStatus([{ selected: ["B"], correct: false }], false)).toBe(
      "retry-feedback",
    );
    expect(challengeStatus([{ selected: ["B"], correct: false }], true)).toBe(
      "retrying",
    );
    expect(
      challengeStatus(
        [
          { selected: ["B"], correct: false },
          { selected: ["C"], correct: false },
        ],
        false,
      ),
    ).toBe("explained");
    expect(challengeStatus([{ selected: ["A"], correct: true }], false)).toBe(
      "solved",
    );
  });
});

// Every evidence excerpt must appear verbatim in its stored paper, as the
// pipeline's verifyLesson requires for generated lessons. Page text is parsed once
// in tests/research/papers-setup.ts.
const papersDir = fileURLToPath(
  new URL("../../docs/research/papers/", import.meta.url),
);
const readme = readFileSync(join(papersDir, "README.md"), "utf8");
const pdfs = readdirSync(papersDir).filter((f) => f.endsWith(".pdf"));
const paperPages = inject("paperPages");
const stored = studies.map(
  (s) => [s.slug, s, paperFileFor(s.lesson.paper.url, readme, pdfs)] as const,
);

describe("evidence excerpts", () => {
  it("has a stored paper for every study except the original texting study", () => {
    expect(stored.filter(([, , file]) => !file).map(([slug]) => slug)).toEqual([
      "texting-lecture",
    ]);
  });
  it.each(stored.filter(([, , file]) => file))(
    "%s quotes its paper verbatim",
    (_slug, study, file) => {
      expect(excerptProblems(study, paperPages[file!]!)).toEqual([]);
    },
  );
});
