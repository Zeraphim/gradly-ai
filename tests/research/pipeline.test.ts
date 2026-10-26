import { it, expect } from "vitest";
import { newJob, publicJob, runStage } from "../../apps/api/src/research/pipeline.js";
import { featured } from "../../apps/api/src/research/featured.js";
import { ProviderError, type ModelProvider } from "../../apps/api/src/research/provider.js";
import { z } from "zod";
import {
  generatedLessonSchema,
  lessonSchema,
  MAX_GENERATED_CHALLENGES,
  type Lesson,
} from "../../apps/api/src/research/contracts.js";
import {
  newSession,
  publicSession,
  submit,
  transition,
} from "../../apps/api/src/research/engine.js";
const page =
  "A complete empirical study of independent groups with a numerical outcome and random assignment. Reported group results and statistical test are described here.";
const refs = [
  { id: "source1", page: 1, excerpt: page },
  { id: "source2", page: 1, excerpt: "independent groups with a numerical outcome" },
  { id: "source3", page: 1, excerpt: "Reported group results and statistical test" },
];
const draft = {
  ...structuredClone(featured),
  id: "generated",
  source: "generated",
  evidence: refs,
  paper: { ...featured.paper, url: null },
  challenges: featured.challenges
    .slice(0, 3)
    .map((c) => ({ ...c, scene: undefined, refs: ["source1"] })),
  bonus: null,
};
function provider(outputs: unknown[]): ModelProvider {
  return {
    async generate<T>() {
      return outputs.shift() as T;
    },
  };
}
it("completes actual stage orchestration against an explicitly mocked provider", async () => {
  let j = newJob("job", "paper.pdf", [{ page: 1, text: page }]);
  const p = provider([
    { paperSummary: "Study evidence located", refs, missing: [] },
    draft,
    { approved: true, issues: [], summary: "Methods fit evidence" },
    { approved: true, issues: [], summary: "Guidance supports revision" },
  ]);
  for (let n = 0; n < 5; n++) j = await runStage(j, p);
  expect(j.status).toBe("ready");
  expect(j.audits.every((a) => a.status === "Completed")).toBe(true);
  expect(j.lesson?.challenges).toHaveLength(3);
});
it("rejects invented exact excerpts and incomplete evidence", async () => {
  const j = newJob("job", "paper.pdf", [{ page: 1, text: page }]);
  const invalid = await runStage(
    j,
    provider([
      {
        paperSummary: "Invented",
        refs: [{ id: "bad", page: 2, excerpt: "fabricated evidence" }],
        missing: [],
      },
    ]),
  );
  expect(invalid.status).toBe("failed");
  const missing = await runStage(
    j,
    provider([{ paperSummary: "Not enough", refs, missing: ["Reported results"] }]),
  );
  expect(missing.error).toContain("Insufficient");
});
it("accepts PDF typography differences, drops paraphrased excerpts and hides narrated findings", async () => {
  const pdfPage =
    "we report on two studies aimed specifically at replicating the original findings while improving on its design and exploring the extent to which the experimenter’s own expectan- cies may influence the results.";
  const j = newJob("typography", "paper.pdf", [{ page: 1, text: pdfPage }]);
  const next = await runStage(
    j,
    provider([
      {
        paperSummary: "The user wants me to analyze the document.",
        refs: [
          {
            id: "typography",
            page: 1,
            excerpt:
              "exploring the extent to which the experimenter's own expectancies may influence the results.",
          },
          {
            id: "paraphrase",
            page: 1,
            excerpt:
              "exploring the extent to which the experimenter's own expectations may influence the results.",
          },
          { id: "aim", page: 1, excerpt: "we report on two studies" },
          { id: "design", page: 1, excerpt: "while improving on its design" },
        ],
        missing: [],
      },
    ]),
  );
  expect(next.status).not.toBe("failed");
  expect(next.evidence?.refs.map((r) => r.id)).toEqual([
    "typography",
    "aim",
    "design",
  ]);
  expect(next.audits[0]?.summary).not.toMatch(/user wants/i);
});

it("replaces an empty or truncated findings summary with the neutral fallback", async () => {
  const j = newJob("empty-findings", "paper.pdf", [{ page: 1, text: page }]);
  const next = await runStage(
    j,
    provider([
      { paperSummary: "", refs, missing: [] },
    ]),
  );
  expect(next.status).toBe("pending");
  expect(next.audits[0]?.summary).toBe(
    `Located ${refs.length} verified page excerpts for the investigation.`,
  );
});

it("treats a paper.url without a host as unavailable metadata", () => {
  const lesson = structuredClone(featured);
  for (const missing of ["https://", "", "unavailable", "https://doi org.x/a"]) {
    lesson.paper.url = missing;
    const parsed = lessonSchema.safeParse(lesson);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.paper.url).toBeNull();
  }
  lesson.paper.url = "https://doi.org/10.1177/0098628313514177";
  expect(lessonSchema.parse(lesson).paper.url).toBe(
    "https://doi.org/10.1177/0098628313514177",
  );
  // The wire schema still asks the model for a host, not just a prefix.
  const wire = z.toJSONSchema(lessonSchema) as unknown as {
    properties: {
      paper: { properties: { url: { anyOf: { pattern?: string }[] } } };
    };
  };
  const pattern = new RegExp(
    wire.properties.paper.properties.url.anyOf[0]!.pattern!,
  );
  expect(pattern.test("https://")).toBe(false);
  expect(pattern.test("https://doi.org/10.1/x")).toBe(true);
});
it("caps live lesson drafts at the generated challenge limit", async () => {
  let schemaSent: unknown;
  let taskSent = "";
  const nine = Array.from({ length: MAX_GENERATED_CHALLENGES + 1 }, (_, n) => ({
    ...draft.challenges[n % draft.challenges.length]!,
    id: `c${n}`,
  }));
  const evidenceJob = await runStage(
    newJob("cap-job", "paper.pdf", [{ page: 1, text: page }]),
    provider([{ paperSummary: "Study evidence located", refs, missing: [] }]),
  );
  const failed = await runStage(evidenceJob, {
    async generate<T>(_role: string, task: string, _input: unknown, schema: unknown) {
      taskSent = task;
      schemaSent = schema;
      return { ...draft, challenges: nine } as T;
    },
  });
  expect(MAX_GENERATED_CHALLENGES).toBe(8);
  expect(taskSent).toContain("Use 3–8 challenges");
  expect(taskSent).toMatch(/Fill every required field.*keep each one brief/);
  expect(taskSent).toContain("Set writtenReasoning=true on at least one");
  const wire = z.toJSONSchema(schemaSent as z.ZodType) as unknown as {
    properties: { challenges: { maxItems: number } };
  };
  expect(wire.properties.challenges.maxItems).toBe(8);
  expect(failed.status).toBe("failed");
  expect(failed.stage).toBe(1);
  // Stored and featured lessons keep the wider limit.
  expect(lessonSchema.safeParse({ ...draft, challenges: nine }).success).toBe(true);
  expect(
    generatedLessonSchema.safeParse({ ...draft, challenges: nine.slice(0, 8) })
      .success,
  ).toBe(true);
  // A live draft must name and brief the investigation.
  expect(
    generatedLessonSchema.safeParse({ ...draft, title: "", briefing: "" })
      .success,
  ).toBe(false);
});
it("limits lesson references to stage-0 ids and attaches verified evidence server-side", async () => {
  const evidenceJob = await runStage(
    newJob("refs-job", "paper.pdf", [{ page: 1, text: page }]),
    provider([{ paperSummary: "Study evidence located", refs, missing: [] }]),
  );
  let schemaSent: z.ZodType | undefined;
  const drafted = await runStage(evidenceJob, {
    async generate<T>(_r: string, _t: string, _i: unknown, schema: unknown) {
      schemaSent = schema as z.ZodType;
      // A re-copied, altered excerpt from the model must not be kept.
      return {
        ...draft,
        evidence: [{ id: "source1", page: 1, excerpt: "An altered excerpt text." }],
      } as T;
    },
  });
  const wire = JSON.stringify(z.toJSONSchema(schemaSent!));
  expect(wire).toContain('"enum":["source1","source2","source3"]');
  expect(
    (z.toJSONSchema(schemaSent!) as { properties: object }).properties,
  ).not.toHaveProperty("evidence");
  expect(drafted.status).toBe("pending");
  expect(drafted.lesson?.evidence).toEqual(refs);

  const unknownRef = await runStage(
    evidenceJob,
    provider([
      {
        ...draft,
        challenges: draft.challenges.map((c) => ({ ...c, refs: ["invented"] })),
      },
    ]),
  );
  expect(unknownRef.status).toBe("failed");
  expect(unknownRef.stage).toBe(1);
});
it("clears obsolete stage and job errors after a successful retry", async () => {
  const j = newJob("retry-job", "paper.pdf", [{ page: 1, text: page }]);
  const failed = await runStage(j, {
    async generate() {
      throw Error("Temporary provider outage");
    },
  });
  expect(failed.status).toBe("failed");
  expect(failed.stage).toBe(0);
  expect(failed.error).toBe("Temporary provider outage");
  expect(failed.audits[0]?.error).toBe("Temporary provider outage");

  const recovered = await runStage(
    failed,
    provider([{ paperSummary: "Evidence recovered", refs, missing: [] }]),
  );
  expect(recovered.status).toBe("pending");
  expect(recovered.stage).toBe(1);
  expect(recovered.audits[0]?.status).toBe("Completed");
  expect(recovered.audits[0]?.summary).toBe("Evidence recovered");
  expect(recovered.error).toBeUndefined();
  expect(recovered.audits[0]?.error).toBeUndefined();
});

it("persists a typed errorCode when a stage hits the output limit", async () => {
  const j = newJob("limit-job", "paper.pdf", [{ page: 1, text: page }]);
  const failed = await runStage(j, {
    async generate() {
      throw new ProviderError(
        "output_limit",
        "The AI response was incomplete because it reached the 32000-token output limit. Retry this stage.",
      );
    },
  });
  expect(failed.status).toBe("failed");
  expect(failed.audits[0]?.errorCode).toBe("output_limit");
  expect(failed.audits[0]?.error).toContain("output limit");

  const recovered = await runStage(
    failed,
    provider([{ paperSummary: "Evidence recovered", refs, missing: [] }]),
  );
  expect(recovered.status).toBe("pending");
  expect(recovered.audits[0]?.errorCode).toBeUndefined();

  const timedOut = await runStage(j, {
    async generate() {
      throw new ProviderError("timeout", "The AI request timed out.");
    },
  });
  expect(timedOut.audits[0]?.errorCode).toBe("timeout");
  expect(publicJob(timedOut).audits[0]?.errorCode).toBe("timeout");
  const otherFailure = await runStage(timedOut, {
    async generate() {
      throw Error("Nebius request failed (503).");
    },
  });
  expect(otherFailure.audits[0]?.errorCode).toBeUndefined();
});
it("prevents a flagged methods review from becoming playable", async () => {
  let j = newJob("job", "paper.pdf", [{ page: 1, text: page }]);
  const p = provider([
    { paperSummary: "Evidence", refs, missing: [] },
    draft,
    {
      approved: false,
      issues: ["Unsupported conclusion"],
      summary: "Needs review",
    },
  ]);
  for (let n = 0; n < 3; n++) j = await runStage(j, p);
  expect(j.status).toBe("review");
  expect(j.stage).toBe(2);
  expect(j.audits[2]!.status).toBe("Needs Review");
});

// Synthetic contract fixture. These accounts do not describe a published study.
const qualitativeDesign =
  "Researchers used purposive sampling to recruit commuters for open-ended interviews about navigating an unfamiliar station. Transcripts were coded and compared to develop themes, with researcher memos documenting interpretive decisions.";
const qualitativeFinding =
  "Interview accounts linked asking staff for help with uncertainty about platform signs. The authors present this as a theme in these accounts, not a population estimate or evidence that sign changes cause better navigation.";
const qualitativeRefs = [
  { id: "approach", page: 1, excerpt: qualitativeDesign },
  { id: "accounts", page: 2, excerpt: qualitativeFinding },
  { id: "memos", page: 1, excerpt: "researcher memos documenting interpretive decisions" },
];
const qualitativeLesson: Lesson = {
  id: "qualitative-fixture",
  title: "A station, a question, and the limits of an account",
  briefing:
    "Researchers explored how commuters describe navigating an unfamiliar station. Decide what the approach can support before inspecting the accounts.",
  source: "generated",
  paper: {
    title: "Synthetic interview study for contract testing",
    authors: "Synthetic fixture",
    journal: "Not a publication",
    url: null,
    limitations: [
      "Purposive interview accounts do not estimate population prevalence.",
    ],
  },
  evidence: qualitativeRefs,
  challenges: [
    {
      id: "approach-choice",
      stage: "Research design",
      title: "Choose a fitting inquiry",
      type: "single",
      prompt: "Which approach fits the aim of exploring commuters’ accounts?",
      evidence: [qualitativeDesign],
      options: [
        { id: "A", text: "Open-ended interviews with thematic interpretation" },
        { id: "B", text: "A statistical test of mean quiz scores" },
      ],
      accepted: ["A"],
      alternatives: [],
      hint: "Consider the type of evidence the question seeks.",
      misconceptions: {
        B: "There is no numerical quiz outcome in this study.",
      },
      explanation:
        "Open-ended interviews can explore how participants describe experiences; a numerical comparison addresses a different question.",
      refs: ["approach"],
      writtenReasoning: true,
      reveal: "design",
    },
    {
      id: "theme-boundary",
      stage: "Evidence interpretation",
      title: "Interpret the theme",
      type: "single",
      prompt: "What does the reported theme support about these accounts?",
      evidence: [qualitativeFinding],
      options: [
        {
          id: "A",
          text: "Some accounts connect help-seeking and sign uncertainty.",
        },
        {
          id: "B",
          text: "Most commuters everywhere cannot read platform signs.",
        },
      ],
      accepted: ["A"],
      alternatives: [],
      hint: "Distinguish a theme in accounts from a population estimate.",
      misconceptions: {
        B: "The study does not provide a population estimate.",
      },
      explanation:
        "The theme describes a pattern in the interview accounts. Purposive interviews alone cannot establish how common that experience is in a population.",
      refs: ["accounts"],
      writtenReasoning: true,
      reveal: "results",
    },
    {
      id: "causal-boundary",
      stage: "Claim limits",
      title: "Know when to ask for more evidence",
      type: "single",
      prompt:
        "Do these interviews show that changing signs will improve navigation?",
      evidence: [qualitativeFinding],
      options: [
        { id: "A", text: "No; an intervention claim needs further evidence." },
        {
          id: "B",
          text: "Yes; a reported theme establishes the causal effect.",
        },
      ],
      accepted: ["A"],
      alternatives: [],
      hint: "Which intervention and comparison were observed?",
      misconceptions: {
        B: "A theme alone does not identify an intervention effect.",
      },
      explanation:
        "The accounts can motivate a design hypothesis. They do not test a signage intervention, so its effect remains uncertain.",
      refs: ["accounts"],
      writtenReasoning: true,
      reveal: "interpretation",
    },
  ],
  bonus: null,
};

it("supports a nonnumeric qualitative investigation through verification and the learning loop", async () => {
  const pages = [qualitativeDesign, qualitativeFinding].map((text, i) => ({
    page: i + 1,
    text,
  }));
  const outputs: unknown[] = [
    {
      paperSummary: "An interview approach and bounded theme are available.",
      refs: qualitativeRefs,
      missing: [],
    },
    qualitativeLesson,
    {
      approved: true,
      issues: [],
      summary: "Interpretations stay within the accounts.",
    },
    {
      approved: true,
      issues: [],
      summary: "Feedback distinguishes a theme from a causal claim.",
    },
  ];
  const requests: { role: string; task: string }[] = [];
  const mocked: ModelProvider = {
    async generate(role, task, _input, schema) {
      requests.push({ role, task });
      return schema.parse(outputs.shift());
    },
  };
  let job = newJob("qualitative-job", "interview-study.pdf", pages);
  for (let stage = 0; stage < 5; stage++) job = await runStage(job, mocked);
  expect(job.status).toBe("ready");
  expect(job.lesson?.challenges.at(-1)?.reveal).toBe("interpretation");
  expect(job.lesson?.paper.url).toBeNull();
  expect(job.lesson?.evidence).toEqual(qualitativeRefs);
  expect(requests[0]?.task).toContain(
    "statistical test, numerical result, or experimental design is not required",
  );
  expect(requests[1]?.task).toContain(
    "do not turn qualitative themes into prevalence estimates",
  );
  expect(requests[2]?.role).toBe("Research Methods Reviewer");

  const lesson = job.lesson!;
  let session = transition(
    newSession(lesson, "qualitative-session"),
    lesson,
    "begin",
  );
  expect(publicSession(session, lesson).paper).toBeNull();
  for (const challenge of lesson.challenges) {
    expect(publicSession(session, lesson).challenge?.id).toBe(challenge.id);
    session = submit(
      session,
      lesson,
      ["A"],
      "The scope of the evidence limits the claim.",
    );
    session = transition(session, lesson, "next");
  }
  session = transition(session, lesson, "skip");
  expect(publicSession(session, lesson).paper?.title).toBe(
    qualitativeLesson.paper.title,
  );
  expect(publicSession(session, lesson).summary.firstCorrect).toBe(3);
});

it("keeps the legacy statistical-significance path schema-compatible", () => {
  expect(lessonSchema.safeParse(featured).success).toBe(true);
  expect(
    featured.challenges.some(
      (challenge) => challenge.reveal === "significance",
    ),
  ).toBe(true);
});

it("blocks an evidence-poor document without falling back to authored research", async () => {
  const document =
    "A project note lists a station redesign idea but contains no research methods, evidence or supported findings.";
  const job = newJob("not-research", "project-note.pdf", [
    { page: 1, text: document },
  ]);
  const result = await runStage(
    job,
    provider([
      {
        paperSummary: "A project proposal only.",
        refs: [{ id: "note", page: 1, excerpt: document }],
        missing: ["Research evidence for grounded decisions"],
      },
    ]),
  );
  expect(result.status).toBe("failed");
  expect(result.stage).toBe(0);
  expect(result.lesson).toBeUndefined();
  expect(result.error).toContain("Insufficient research evidence");
  expect(result.audits[0]?.status).toBe("Failed");
});

it("moves an exact excerpt cited on the wrong page to the one page that holds it", async () => {
  const other =
    "Participants logged the behaviour each day in a smartphone app for twelve weeks of the field study.";
  const j = newJob("wrong-page", "paper.pdf", [
    { page: 1, text: page },
    { page: 2, text: other },
    { page: 3, text: `${other} The same sentence appears again here.` },
  ]);
  const next = await runStage(
    j,
    provider([
      {
        paperSummary: "Evidence",
        refs: [
          { id: "moved", page: 5, excerpt: page },
          { id: "nowhere", page: 1, excerpt: "A sentence on no page at all." },
          { id: "ambiguous", page: 1, excerpt: other },
          ...refs.slice(1),
        ],
        missing: [],
      },
    ]),
  );
  expect(next.status).toBe("pending");
  expect(next.evidence?.refs).toEqual([
    { id: "moved", page: 1, excerpt: page },
    ...refs.slice(1),
  ]);
});

it("drops an unsupported paper link at verification instead of blocking the lesson", async () => {
  let j = newJob("link", "paper.pdf", [{ page: 1, text: page }]);
  const p = provider([
    { paperSummary: "Study evidence located", refs, missing: [] },
    {
      ...draft,
      paper: { ...draft.paper, url: "https://doi.org/10.9999/not-in-this-paper" },
    },
    { approved: true, issues: [], summary: "Methods fit evidence" },
    { approved: true, issues: [], summary: "Guidance supports revision" },
  ]);
  for (let n = 0; n < 5; n++) j = await runStage(j, p);
  expect(j.status).toBe("ready");
  expect(j.lesson?.paper.url).toBeNull();
});

it("fails stage 0 with a retry when fewer than three excerpts verify", async () => {
  const j = newJob("thin", "paper.pdf", [{ page: 1, text: page }]);
  const thin = await runStage(
    j,
    provider([
      {
        paperSummary: "Evidence",
        refs: [...refs.slice(0, 1), { id: "x", page: 1, excerpt: "Not in the paper." }],
        missing: [],
      },
    ]),
  );
  expect(thin.status).toBe("failed");
  expect(thin.stage).toBe(0);
  expect(thin.error).toContain("1 of 2 excerpts verified, 3 needed");
  expect(thin.error).toContain("Retry this stage");
});

it("explains a reviewer rejection that lists no issues", async () => {
  const base = newJob("coach", "paper.pdf", [{ page: 1, text: page }]);
  const toCoach = async (coach: unknown) => {
    let j = base;
    const p = provider([
      { paperSummary: "Study evidence located", refs, missing: [] },
      draft,
      { approved: true, issues: [], summary: "Methods fit evidence" },
      coach,
    ]);
    for (let n = 0; n < 4; n++) j = await runStage(j, p);
    return j;
  };
  const silent = await toCoach({ approved: false, issues: [], summary: " " });
  expect(silent.status).toBe("review");
  expect(silent.error).toBe(
    "The Learning Coach did not approve this lesson and gave no reason. Regenerate to draft and review it again.",
  );
  expect(silent.audits[3]?.summary).toBe(silent.error);
  const summarized = await toCoach({
    approved: false,
    issues: [],
    summary: "Hints give away the answer.",
  });
  expect(summarized.error).toBe(
    "The Learning Coach did not approve this lesson: Hints give away the answer. Regenerate to draft and review it again.",
  );
  expect(summarized.audits[3]?.summary).toBe("Hints give away the answer.");
});

it("asks stage 0 for a paper summary field that no evidence aspect shares", async () => {
  let schemaSent: z.ZodType | undefined;
  const j = await runStage(newJob("wire", "paper.pdf", [{ page: 1, text: page }]), {
    async generate<T>(_r: string, _t: string, _i: unknown, schema: unknown) {
      schemaSent = schema as z.ZodType;
      return { refs, missing: [], paperSummary: "A study of two groups." } as T;
    },
  });
  // A field named "findings" made the model return only findings excerpts.
  const wire = z.toJSONSchema(schemaSent!) as { properties: object };
  expect(Object.keys(wire.properties)).toEqual(["refs", "missing", "paperSummary"]);
  expect(j.evidence?.findings).toBe("A study of two groups.");
});
