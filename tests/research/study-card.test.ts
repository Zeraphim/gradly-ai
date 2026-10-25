import { describe, expect, it } from "vitest";
import { featured } from "../../apps/api/src/research/featured.js";
import type { Job, Lesson } from "../../apps/api/src/research/contracts.js";
import {
  newSession,
  publicSession,
  submit,
  transition,
} from "../../apps/api/src/research/engine.js";
import { newJob, publicJob } from "../../apps/api/src/research/pipeline.js";
import {
  NEUTRAL_QUESTION,
  NEUTRAL_TEASER,
  estimateMinutes,
  inferDesign,
  lessonStudyCard,
  lessonTakeaway,
  revealsIdentity,
} from "../../apps/api/src/research/study-card.js";

function generated(changes: Partial<Lesson> = {}): Lesson {
  return { ...structuredClone(featured), source: "generated", ...changes };
}

describe("lessonStudyCard", () => {
  it("keeps a learner-facing title and question that do not name the paper", () => {
    const card = lessonStudyCard(generated());
    expect(card.teaser).toBe(featured.title);
    // The featured title is itself a question; the briefing has none.
    expect(card.question).toBe(featured.title);
    expect(card.minutes).toBeGreaterThanOrEqual(5);
    expect(card.minutes).toBeLessThanOrEqual(15);
  });

  it("hides a title that repeats the paper title, a close variant or an author", () => {
    const paper = featured.paper;
    for (const title of [
      paper.title,
      "Empirical evidence that text messaging during class disrupts comprehension",
      "What Gingerich found about texting",
      "Lineweaver's lecture study",
    ]) {
      expect(revealsIdentity(title, paper)).toBe(true);
      const card = lessonStudyCard(generated({ title }));
      expect(card.teaser).toBe(NEUTRAL_TEASER);
      expect(card.question).not.toContain(title);
    }
    expect(revealsIdentity("Can You Text and Still Learn?", paper)).toBe(false);
  });

  it("uses the briefing's first question and hides it when it names the paper", () => {
    const asks = generated({
      title: "Texting and learning",
      briefing:
        "A team ran a lecture study. Does texting change what students remember? Decide before you see results.",
    });
    expect(lessonStudyCard(asks).question).toBe(
      "Does texting change what students remember?",
    );
    const names = generated({
      title: "Texting and learning",
      briefing: "Did Gingerich show that texting hurts comprehension?",
    });
    expect(lessonStudyCard(names).question).toBe(NEUTRAL_QUESTION);
  });

  it("infers a design from design-stage text only and never a null result", () => {
    expect(inferDesign(generated())).toBe("between");
    const lesson = generated({
      briefing: "Each participant completed both conditions.",
    });
    lesson.challenges = lesson.challenges.map((c) => ({
      ...c,
      explanation:
        c.reveal === "design"
          ? "This is a within-subjects design."
          : "The study found no significant difference, a null result.",
    }));
    expect(inferDesign(lesson)).toBe("within");
    const groups = new Set(
      [
        "replication study",
        "longitudinal waves",
        "a survey",
        "random assignment",
      ].map((briefing) => inferDesign(generated({ briefing }))),
    );
    expect(groups.has("null" as never)).toBe(false);
  });

  it("estimates minutes from the challenge count, reasoning and bonus", () => {
    const lesson = generated();
    const reasoning = lesson.challenges.filter(
      (c) => c.writtenReasoning,
    ).length;
    expect(estimateMinutes(lesson)).toBe(
      Math.min(15, 2 + lesson.challenges.length + Math.ceil(reasoning / 2) + 1),
    );
    expect(
      estimateMinutes(
        generated({ challenges: lesson.challenges.slice(0, 3), bonus: null }),
      ),
    ).toBe(6); // 2 + 3 challenges + 1 for one reasoning prompt
  });

  it("takes the takeaway from the last interpretation, else results, challenge", () => {
    const lesson = generated();
    expect(lessonTakeaway(lesson)).toBe(
      lesson.challenges
        .filter((c) => ["results", "significance"].includes(c.reveal))
        .at(-1)!.explanation,
    );
    lesson.challenges[3] = {
      ...lesson.challenges[3]!,
      reveal: "interpretation",
    };
    expect(lessonTakeaway(lesson)).toBe(lesson.challenges[3]!.explanation);
  });
});

describe("public session and job gates", () => {
  const lesson = generated();
  const first = lesson.challenges[0]!;
  const wrong = first.options.find((o) => !first.accepted.includes(o.id))!.id;

  it("sends the card always, but the keyed answer and takeaway only when earned", () => {
    let s = transition(newSession(lesson, "s"), lesson, "begin");
    let view = publicSession(s, lesson);
    expect(view.study.teaser).toBe(lesson.title);
    expect(view.lessonId).toBe(lesson.id);
    expect(view.takeaway).toBeNull();
    expect(view.paper).toBeNull();
    expect(JSON.stringify(view)).not.toContain('"accepted"');
    s = submit(s, lesson, [wrong], "");
    view = publicSession(s, lesson);
    expect(view.challenge!.feedback!.accepted).toBeNull();
    expect(view.challenge!.feedback!.explanation).toBeNull();
    s = submit(transition(s, lesson, "retry"), lesson, [wrong], "");
    view = publicSession(s, lesson);
    expect(view.challenge!.feedback!.accepted).toEqual(first.accepted);
    expect(view.challenge!.feedback!.explanation).toBe(first.explanation);
  });

  it("returns the takeaway with the paper at the reveal", () => {
    let s = transition(newSession(lesson, "s"), lesson, "begin");
    for (const c of lesson.challenges)
      s = transition(submit(s, lesson, c.accepted, ""), lesson, "next");
    s = transition(s, lesson, "skip");
    const view = publicSession(s, lesson);
    expect(view.paper).toEqual(lesson.paper);
    expect(view.takeaway).toBe(lessonTakeaway(lesson));
  });

  it("previews a drafted lesson as counts only", () => {
    const job: Job = newJob("job", "paper.pdf", [{ page: 1, text: "text" }]);
    expect(publicJob(job).outline).toBeNull();
    job.lesson = lesson;
    const outline = publicJob(job).outline;
    expect(outline).toEqual({
      challenges: lesson.challenges.length,
      bonus: true,
      reasoning: lesson.challenges.filter((c) => c.writtenReasoning).length,
    });
    expect(JSON.stringify(publicJob(job))).not.toContain(
      lesson.challenges[0]!.prompt,
    );
  });
});
