import { describe, it, expect } from "vitest";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  newSession,
  transition,
  submit,
  publicSession,
  reviseReasoning,
  learningPoints,
} from "../../apps/api/src/research/engine.js";
import {
  lessonSchema,
  verifyLesson,
  type LearningSession,
} from "../../apps/api/src/research/contracts.js";
function begun() {
  return transition(newSession(featured, "test"), featured, "begin");
}
function finish(s: LearningSession) {
  for (; s.phase === "challenge";) {
    const c = featured.challenges[s.index]!;
    s = submit(s, featured, c.accepted, "Because the groups are independent.");
    s = transition(s, featured, "next");
  }
  return s;
}
describe("featured learning engine", () => {
  it("keeps the quoted decision count in step with the featured quest", () => {
    /* The path picker and the completion recap both promise these numbers. */
    expect(featured.challenges).toHaveLength(8);
    expect(featured.bonus).toBeTruthy();
  });

  it("awards practice points once per solved challenge, including retries and an optional bonus", () => {
    let s = begun();
    expect(learningPoints(s)).toBe(0);
    s = submit(s, featured, ["B"], "A first attempt.");
    expect(learningPoints(s)).toBe(0);
    s = transition(s, featured, "retry");
    s = submit(s, featured, ["A"], "Revised using the evidence.");
    expect(learningPoints(s)).toBe(10);
    expect(() => submit(s, featured, ["A"], "Repeat")).toThrow();
    expect(publicSession(s, featured).points).toBe(10);
    expect(publicSession(s, featured).points).toBe(10);
    s = transition(s, featured, "next");
    s = finish(s);
    expect(learningPoints(s)).toBe(80);
    s = transition(s, featured, "bonus");
    s = submit(
      s,
      featured,
      featured.bonus!.accepted,
      "Transfer to the new setting.",
    );
    expect(learningPoints(s)).toBe(90);
    expect(learningPoints(newSession(featured, "new"))).toBe(0);
  });
  it("validates the full contract and mandated answer keys", () => {
    expect(lessonSchema.safeParse(featured).success).toBe(true);
    expect(featured.challenges.map((c) => c.accepted.join(""))).toEqual([
      "A",
      "B",
      "AB",
      "B",
      "AB",
      "A",
      "B",
      "B",
    ]);
  });
  it("does not send answer guides, paper identity, or findings before their stage", () => {
    const s = begun();
    const payload = JSON.stringify(publicSession(s, featured));
    for (const value of [
      "Gingerich",
      "3514177",
      "73.41",
      "9.59",
      "accepted",
      "misconceptions",
    ])
      expect(payload).not.toContain(value);
    expect(publicSession(s, featured).challenge?.feedback).toBeNull();
  });
  it("prevents skipping and invalid selections", () => {
    const s = begun();
    expect(() => transition(s, featured, "next")).toThrow();
    expect(() => submit(s, featured, [], "")).toThrow();
    expect(() => submit(s, featured, ["A", "B"], "")).toThrow();
    expect(() => submit(s, featured, ["Z"], "")).toThrow();
  });
  it("records two misses, exposes an explanation, and prevents third attempts", () => {
    let s = submit(begun(), featured, ["B"], "");
    expect(
      publicSession(s, featured).challenge?.feedback?.explanation,
    ).toBeNull();
    expect(() => submit(s, featured, ["A"], "")).toThrow();
    expect(() => transition(s, featured, "next")).toThrow();
    s = transition(s, featured, "retry");
    expect(publicSession(s, featured).challenge?.feedback).toBeNull();
    s = submit(s, featured, ["C"], "");
    expect(
      publicSession(s, featured).challenge?.feedback?.explanation,
    ).toBeTruthy();
    expect(() => transition(s, featured, "retry")).toThrow();
    s = transition(s, featured, "next");
    expect(s.index).toBe(1);
    expect(publicSession(s, featured).summary.firstCorrect).toBe(0);
  });
  it("requires both multi-selection responses", () => {
    let s = begun();
    s.index = 2;
    s = submit(s, featured, ["A"], "");
    expect(s.answers.q3![0]!.correct).toBe(false);
    s = transition(s, featured, "retry");
    s = submit(s, featured, ["B", "A"], "Independent groups");
    expect(s.answers.q3![1]!.correct).toBe(true);
    expect(s.answers.q3![1]!.reasoning).toBe("Independent groups");
  });
  it("reveals paper only after required challenges and bonus decision", () => {
    let s = finish(begun());
    expect(s.phase).toBe("bonus-choice");
    expect(publicSession(s, featured).paper).toBeNull();
    s = transition(s, featured, "skip");
    expect(publicSession(s, featured).paper?.url).toContain("3514177");
    s = transition(s, featured, "finish");
    expect(publicSession(s, featured).summary).toMatchObject({
      completed: 8,
      firstCorrect: 8,
      retries: 0,
    });
  });
  it("supports completing the optional bonus", () => {
    let s = transition(finish(begun()), featured, "bonus");
    s = submit(s, featured, ["B"], "");
    s = transition(s, featured, "next");
    expect(s.phase).toBe("reveal");
    expect(s.answers.q9![0]!.correct).toBe(true);
  });
  it("blocks invalid source refs and contradictory answer keys", () => {
    const bad = structuredClone(featured);
    bad.challenges[0]!.accepted = ["Z"];
    bad.challenges[1]!.refs = ["missing"];
    expect(verifyLesson(bad, []).join(" ")).toContain("invalid answer guide");
    expect(verifyLesson(bad, []).join(" ")).toContain("unknown evidence");
  });
});

it("preserves scoring and revision history while clearing stale AI feedback", () => {
  let s = begun();
  s.index = 2;
  s = submit(s, featured, ["A", "B"], "Initial explanation.");
  s.aiFeedback = {
    q3: {
      category: "Partially Supported",
      guidance: "Clarify independence",
      followup: "Are the same students in both groups?",
      refs: ["method"],
      model: "mocked test reviewer",
    },
  };
  s = reviseReasoning(
    s,
    featured,
    "Separate participants experienced one condition each.",
  );
  expect(s.answers.q3!).toHaveLength(1);
  expect(s.answers.q3![0]!.correct).toBe(true);
  expect(s.answers.q3![0]!.reasoningRevisions?.[0]?.text).toBe(
    "Initial explanation.",
  );
  expect(s.aiFeedback?.q3).toBeUndefined();
  expect(publicSession(s, featured).summary.firstCorrect).toBe(1);
});

it("rejects an empty multi-selection alternative answer guide", () => {
  const lesson = structuredClone(featured);
  lesson.challenges[2]!.alternatives = [[]];
  expect(verifyLesson(lesson, []).join(" ")).toContain(
    "q3: invalid answer guide",
  );
});
