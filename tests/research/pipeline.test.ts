import { asDraft } from "./fixtures/draft.js";
import { it, expect } from "vitest";
import {
  AUTO_RETRIES,
  autoRecover,
  lessonDraftSchema,
  newJob,
  publicJob,
  runStage,
} from "../../apps/api/src/research/pipeline.js";
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
/** A minimal connections scene: one evidence anchor every option connects to. */
function anchorScene(
  options: { id: string }[],
  ref: string,
): NonNullable<Lesson["challenges"][number]["scene"]> {
  const provenance = {
    kind: "source-summary" as const,
    refs: [ref],
    note: "Paraphrase of the cited evidence.",
  };
  return {
    version: 1,
    kind: "connections",
    title: "Connect the evidence",
    instruction: "Inspect the evidence, then choose a response.",
    description: "One evidence anchor with a response per option.",
    provenance,
    actionLabel: "Connect a response",
    anchors: [
      {
        id: "anchor",
        label: "Reported design",
        detail: "Independent groups with a numerical outcome.",
        at: "setup",
        provenance,
      },
    ],
    responses: options.map((o) => ({
      optionId: o.id,
      label: `Option ${o.id}`,
      targetIds: ["anchor"],
    })),
    resolution: null,
  };
}
const draft = {
  ...structuredClone(featured),
  id: "generated",
  source: "generated",
  evidence: refs,
  paper: { ...featured.paper, url: null },
  challenges: featured.challenges.slice(0, 3).map((c, i) => ({
    ...c,
    // Generated lessons need at least one valid scene.
    scene: i === 0 ? anchorScene(c.options, "source1") : undefined,
    refs: ["source1"],
  })),
  bonus: null,
};
function provider(outputs: unknown[]): ModelProvider {
  return {
    async generate<T>() {
      return asDraft(outputs.shift()) as T;
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
      return asDraft({ ...draft, challenges: nine }) as T;
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
      return asDraft({
        ...draft,
        evidence: [{ id: "source1", page: 1, excerpt: "An altered excerpt text." }],
      }) as T;
    },
  });
  const wire = JSON.stringify(z.toJSONSchema(schemaSent!));
  expect(wire).toContain('"enum":["source1","source2","source3"]');
  expect(
    (z.toJSONSchema(schemaSent!) as { properties: object }).properties,
  ).not.toHaveProperty("evidence");
  expect(
    (z.toJSONSchema(schemaSent!) as unknown as WireLesson).properties.challenges
      .items.properties,
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
it("records reviewer rejections as advisory notes and still makes the lesson ready", async () => {
  let j = newJob("job", "paper.pdf", [{ page: 1, text: page }]);
  const p = provider([
    { paperSummary: "Evidence", refs, missing: [] },
    draft,
    { approved: false, issues: ["Unsupported conclusion"], summary: "Needs review" },
    { approved: false, issues: [], summary: "Hints give away the answer." },
  ]);
  for (let n = 0; n < 5; n++) j = await runStage(j, p);
  expect(j.status).toBe("ready");
  expect(j.audits.every((a) => a.status === "Completed")).toBe(true);
  expect(j.audits[2]!.summary).toBe("Advisory notes: Unsupported conclusion");
  expect(j.audits[3]!.summary).toBe("Advisory notes: Hints give away the answer.");
  expect(j.review?.approved).toBe(false);
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
        { id: "C", text: "A survey estimating how many commuters get lost" },
      ],
      accepted: ["A"],
      alternatives: [],
      hint: "Consider the type of evidence the question seeks.",
      misconceptions: {
        B: "There is no numerical quiz outcome in this study.",
        C: "Exploring accounts does not estimate how common an experience is.",
      },
      explanation:
        "Open-ended interviews can explore how participants describe experiences; a numerical comparison addresses a different question.",
      refs: ["approach"],
      writtenReasoning: true,
      reveal: "design",
      scene: anchorScene([{ id: "A" }, { id: "B" }, { id: "C" }], "approach"),
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
        { id: "C", text: "Station staff caused the sign uncertainty." },
      ],
      accepted: ["A"],
      alternatives: [],
      hint: "Distinguish a theme in accounts from a population estimate.",
      misconceptions: {
        B: "The study does not provide a population estimate.",
        C: "The accounts do not identify a cause of the uncertainty.",
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
        { id: "C", text: "No; the accounts show signs make no difference." },
      ],
      accepted: ["A"],
      alternatives: [],
      hint: "Which intervention and comparison were observed?",
      misconceptions: {
        B: "A theme alone does not identify an intervention effect.",
        C: "The accounts did not test whether signs make a difference.",
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
      return schema.parse(asDraft(outputs.shift()));
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

it("ignores unreadable reviewer text and continues when a review call fails", async () => {
  const toCoach = async (coach: () => unknown) => {
    let j = newJob("coach", "paper.pdf", [{ page: 1, text: page }]);
    const outputs: unknown[] = [
      { paperSummary: "Study evidence located", refs, missing: [] },
      draft,
      { approved: true, issues: [], summary: "Methods fit evidence" },
    ];
    const p: ModelProvider = {
      async generate<T>() {
        return asDraft(outputs.length ? outputs.shift() : coach()) as T;
      },
    };
    for (let n = 0; n < 5; n++) j = await runStage(j, p);
    return j;
  };
  const garbled = await toCoach(() => ({ approved: false, issues: [":{"], summary: " " }));
  expect(garbled.status).toBe("ready");
  expect(garbled.audits[3]?.summary).toBe("Advisory notes: No reason given.");
  const approved = await toCoach(() => ({ approved: true, issues: [":{"], summary: "Fine" }));
  expect(approved.audits[3]?.summary).toBe("Fine");
  const failed = await toCoach(() => {
    throw new ProviderError("timeout", "The AI request timed out. Retry this stage.");
  });
  expect(failed.status).toBe("ready");
  expect(failed.audits[3]?.status).toBe("Completed");
  expect(failed.audits[3]?.summary).toBe(
    "Review unavailable, so the lesson continued without it. The AI request timed out.",
  );
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

it("builds a scene from the evidence when no drafted scene passes", async () => {
  const evidenceJob = await evidenceFor([{ page: 1, text: page }]);
  const plain = {
    ...draft,
    challenges: draft.challenges.map((c) => ({ ...c, scene: null })),
  };
  // A scene that breaks its own response mapping does not count either.
  const broken = structuredClone(draft);
  broken.challenges[0]!.scene!.responses[0]!.optionId = "unmapped";
  for (const [lesson, at, summary] of [
    [plain, 0, "Drafted 3 challenges. Added a server-built scene."],
    [
      broken,
      0,
      "Drafted 3 challenges. Removed 1 scene that failed checks. Added a server-built scene.",
    ],
  ] as const) {
    let j = await runStage(evidenceJob, provider([lesson]));
    expect(j.status).toBe("pending");
    expect(j.audits[1]?.summary).toBe(summary);
    const scenes = j.lesson!.challenges.filter((c) => c.scene);
    expect(scenes.map((c) => c.id)).toEqual([draft.challenges[at]!.id]);
    expect(scenes[0]!.scene!.kind).toBe("connections");
    j = await finish(j);
    expect(j.status).toBe("ready");
  }
  const ready = await finish(await runStage(evidenceJob, provider([plain])));
  const anchors = ready.lesson!.challenges[0]!.scene;
  expect(anchors?.kind === "connections" && anchors.anchors[0]?.detail).toBe(page);
});

it("fails drafting when no scene can be built and redrafts on retry", async () => {
  const evidenceJob = await evidenceFor([{ page: 1, text: page }]);
  // Scene element ids allow no spaces, so no scene fits these options.
  const unfit = {
    ...draft,
    challenges: draft.challenges.map((c) => ({
      ...c,
      scene: null,
      options: c.options.map((o) => ({ ...o, id: `${o.id} x` })),
      accepted: c.accepted.map((a) => `${a} x`),
      misconceptions: {},
    })),
  };
  const failed = await runStage(evidenceJob, provider([unfit]));
  expect(failed.status).toBe("failed");
  expect(failed.stage).toBe(1);
  expect(failed.error).toContain("0 valid interactive scenes");
  expect(failed.error).toContain("Retry this stage.");
  // The existing retry reruns the drafting stage, and a lesson with a scene passes.
  const retried = await runStage(failed, provider([draft]));
  expect(retried.status).toBe("pending");
  expect(retried.stage).toBe(2);
});

type WireLesson = {
  properties: { challenges: { items: { properties: object } } };
};
async function evidenceFor(pages: { page: number; text: string }[]) {
  return runStage(
    newJob("guards", "paper.pdf", pages),
    provider([{ paperSummary: "Study evidence located", refs, missing: [] }]),
  );
}
async function finish(j: Awaited<ReturnType<typeof runStage>>) {
  const p = provider([
    { approved: true, issues: [], summary: "Methods fit evidence" },
    { approved: true, issues: [], summary: "Guidance supports revision" },
  ]);
  for (let n = 0; n < 3; n++) j = await runStage(j, p);
  return j;
}

it("drafts without alternatives so grading accepts only the accepted answer", async () => {
  const evidenceJob = await evidenceFor([{ page: 1, text: page }]);
  const c = draft.challenges[0]!;
  const wrong = c.options.find((o) => !c.accepted.includes(o.id))!.id;
  let schemaSent: z.ZodType | undefined;
  let j = await runStage(evidenceJob, {
    async generate<T>(_r: string, _t: string, _i: unknown, schema: unknown) {
      schemaSent = schema as z.ZodType;
      // Drafts listed wrong options, alone or with a reason, as alternatives.
      return asDraft({
        ...draft,
        challenges: draft.challenges.map((d, i) =>
          i === 0 ? { ...d, alternatives: [[wrong], [wrong, "Not the design."]] } : d,
        ),
      }) as T;
    },
  });
  const wire = z.toJSONSchema(schemaSent!) as unknown as WireLesson;
  expect(wire.properties.challenges.items.properties).not.toHaveProperty("alternatives");
  expect(j.lesson?.challenges.every((d) => d.alternatives.length === 0)).toBe(true);
  j = await finish(j);
  expect(j.status).toBe("ready");
  let s = transition(newSession(j.lesson!, "guards-session"), j.lesson!, "begin");
  s = submit(s, j.lesson!, [wrong], "");
  expect(s.answers[c.id]?.[0]?.correct).toBe(false);
});

it("derives answer keys from option flags and removes challenges without one", async () => {
  const evidenceJob = await evidenceFor([{ page: 1, text: page }]);
  const four = asDraft({
    ...draft,
    challenges: featured.challenges.slice(0, 4).map((c, i) => ({
      ...draft.challenges[i % 3]!,
      id: `c${i}`,
      // The server derives type from the correct flags, not from the draft.
      type: "multiple" as const,
      options: c.options,
      accepted: c.accepted,
    })),
  });
  // c1 marks two options correct; c2 marks none; c3 marks every option.
  four.challenges[1]!.options = four.challenges[1]!.options.map((o, i) => ({
    ...o,
    correct: i < 2,
  }));
  four.challenges[2]!.options = four.challenges[2]!.options.map((o) => ({
    ...o,
    correct: false,
  }));
  four.challenges[3]!.options = four.challenges[3]!.options.map((o) => ({
    ...o,
    correct: true,
  }));
  let schemaSent: z.ZodType | undefined;
  const failed = await runStage(evidenceJob, {
    async generate<T>(_r: string, _t: string, _i: unknown, schema: unknown) {
      schemaSent = schema as z.ZodType;
      return four as T;
    },
  });
  const wire = z.toJSONSchema(schemaSent!) as unknown as WireLesson;
  expect(wire.properties.challenges.items.properties).not.toHaveProperty(
    "accepted",
  );
  expect(wire.properties.challenges.items.properties).not.toHaveProperty(
    "type",
  );
  // Two of four challenges have a usable key, and a lesson needs three.
  expect(failed.status).toBe("failed");
  expect(failed.error).toBe(
    "The draft marked correct answers on only 2 of 4 challenges; at least 3 are needed. Retry this stage.",
  );
  const five = structuredClone(four);
  five.challenges.push({ ...structuredClone(four.challenges[0]!), id: "c4" });
  const j = await runStage(failed, provider([five]));
  expect(j.status).toBe("pending");
  expect(j.lesson!.challenges.map((c) => c.id)).toEqual(["c0", "c1", "c4"]);
  // One correct option is single even though the draft said multiple.
  expect(j.lesson!.challenges[0]!.type).toBe("single");
  const two = j.lesson!.challenges[1]!;
  expect(two.type).toBe("multiple");
  expect(two.accepted).toEqual(two.options.slice(0, 2).map((o) => o.id));
  expect(two.options.every((o) => !("correct" in o))).toBe(true);
  expect(j.audits[1]!.summary).toContain(
    "Removed 2 challenges without a usable answer.",
  );
  expect((await finish(j)).status).toBe("ready");
});

it("requires at least three options on every drafted challenge", () => {
  const schema = lessonDraftSchema(["source1"]);
  const wire = z.toJSONSchema(schema) as unknown as {
    properties: {
      challenges: { items: { properties: { options: { minItems: number } } } };
    };
  };
  expect(wire.properties.challenges.items.properties.options.minItems).toBe(3);
  const valid = asDraft(draft);
  expect(schema.safeParse(valid).success).toBe(true);
  const two = structuredClone(valid);
  two.challenges[0]!.options = two.challenges[0]!.options.slice(0, 2);
  expect(schema.safeParse(two).success).toBe(false);
});

it("attaches verified added excerpts to a challenge and drops unverifiable ones", async () => {
  const payment = "Participants were paid $0.50 for taking part.";
  const pages = [
    { page: 1, text: page },
    { page: 2, text: `${payment} Sessions lasted twenty minutes.` },
  ];
  const evidenceJob = await evidenceFor(pages);
  let schemaSent: z.ZodType | undefined;
  const id = draft.challenges[0]!.id;
  let j = await runStage(evidenceJob, {
    async generate<T>(_r: string, _t: string, _i: unknown, schema: unknown) {
      schemaSent = schema as z.ZodType;
      return asDraft({
        ...draft,
        challenges: draft.challenges.map((d, i) =>
          i === 0
            ? {
                ...d,
                addedExcerpts: [
                  { page: 2, excerpt: payment },
                  // Wrong page: moved to the one page that holds it, not duplicated.
                  { page: 1, excerpt: payment },
                  { page: 2, excerpt: "Participants were paid one dollar each." },
                ],
              }
            : i === 1
              ? // Already stage-0 evidence: cited by its existing id.
                { ...d, addedExcerpts: [{ page: 1, excerpt: refs[1]!.excerpt }] }
              : d,
        ),
      }) as T;
    },
  });
  const wire = z.toJSONSchema(schemaSent!) as unknown as WireLesson;
  expect(wire.properties.challenges.items.properties).toHaveProperty("addedExcerpts");
  expect(j.status).toBe("pending");
  expect(j.lesson?.evidence).toEqual([
    ...refs,
    { id: `${id}_added_1`, page: 2, excerpt: payment },
  ]);
  expect(j.lesson?.challenges[0]?.refs).toEqual(["source1", `${id}_added_1`]);
  expect(j.lesson?.challenges[1]?.refs).toEqual(["source1", "source2"]);
  expect(j.lesson?.challenges[0]).not.toHaveProperty("addedExcerpts");
  expect(j.audits[1]?.summary).toBe("Drafted 3 challenges with 1 added excerpt.");
  j = await finish(j);
  expect(j.status).toBe("ready");
});

it("shows cited excerpts as evidence, never ref ids, and no findings before a design answer", async () => {
  const aspects = [
    { id: "research_question_1", page: 1, excerpt: "We asked whether group size changes recall." },
    { id: "approach_1", page: 1, excerpt: "Participants were randomly assigned to two groups." },
    { id: "findings_1", page: 1, excerpt: "Recall was higher in the smaller group." },
    { id: "limitations_1", page: 1, excerpt: "The sample came from one university." },
  ];
  const evidenceJob = await runStage(
    newJob("aspects", "paper.pdf", [
      { page: 1, text: aspects.map((r) => r.excerpt).join(" ") },
    ]),
    provider([{ paperSummary: "Study evidence located", refs: aspects, missing: [] }]),
  );
  const cited = [
    // A design question citing a finding, with ids written as its evidence.
    { reveal: "design", refs: ["research_question_1", "approach_1", "findings_1"], evidence: ["research_question_1"] },
    { reveal: "results", refs: ["findings_1", "limitations_1"], evidence: ["limitations_2"] },
    { reveal: "interpretation", refs: ["limitations_1"], evidence: ["limitations_1"] },
  ] as const;
  // No drafted scene, so the server builds one from the design question.
  let j = await runStage(
    evidenceJob,
    provider([
      {
        ...draft,
        challenges: draft.challenges.map((c, i) => ({ ...c, ...cited[i], scene: null })),
      },
    ]),
  );
  expect(j.status).toBe("pending");
  const [design, results, limits] = j.lesson!.challenges;
  const excerpt = (id: string) => aspects.find((r) => r.id === id)!.excerpt;
  expect(design!.evidence).toEqual([
    excerpt("research_question_1"),
    excerpt("approach_1"),
  ]);
  expect(design!.refs).toContain("findings_1");
  expect(results!.evidence).toEqual([excerpt("findings_1"), excerpt("limitations_1")]);
  expect(limits!.evidence).toEqual([excerpt("limitations_1")]);
  const ids = [...aspects.map((r) => r.id), "limitations_2"];
  expect(
    j.lesson!.challenges.flatMap((c) => c.evidence).some((e) => ids.includes(e)),
  ).toBe(false);
  // The server-built scene shows the same excerpts, so no finding leaks there.
  const scene = design!.scene;
  expect(scene?.kind === "connections" && scene.anchors.map((a) => a.detail)).toEqual(
    design!.evidence,
  );
  j = await finish(j);
  expect(j.status).toBe("ready");
  const s = transition(newSession(j.lesson!, "aspects-session"), j.lesson!, "begin");
  expect(publicSession(s, j.lesson!).challenge?.evidence).toEqual(design!.evidence);
});

it("fails drafting with a retry when a challenge has no hint", async () => {
  const evidenceJob = await evidenceFor([{ page: 1, text: page }]);
  const hintless = {
    ...draft,
    challenges: draft.challenges.map((d, i) => (i === 1 ? { ...d, hint: " " } : d)),
  };
  const failed = await runStage(evidenceJob, provider([hintless]));
  expect(failed.status).toBe("failed");
  expect(failed.stage).toBe(1);
  expect(failed.error).toBe(
    `The draft has no hint for ${draft.challenges[1]!.id}. Retry this stage.`,
  );
  const retried = await runStage(failed, provider([draft]));
  expect(retried.stage).toBe(2);
});

it("removes a broken scene at drafting and keeps the lesson's valid one", async () => {
  const evidenceJob = await evidenceFor([{ page: 1, text: page }]);
  const second = draft.challenges[1]!;
  const broken = anchorScene(second.options, "source1");
  // A response pointing at a missing element, as drafts produced live.
  broken.responses[0]!.targetIds = ["s1"];
  let j = await runStage(
    evidenceJob,
    provider([
      {
        ...draft,
        challenges: draft.challenges.map((d, i) =>
          i === 1 ? { ...d, scene: broken, responseStyle: "tap" } : d,
        ),
      },
    ]),
  );
  expect(j.status).toBe("pending");
  expect(j.lesson?.challenges[0]?.scene).toBeTruthy();
  expect(j.lesson?.challenges[1]?.scene).toBeNull();
  expect(j.lesson?.challenges[1]).not.toHaveProperty("responseStyle");
  expect(j.audits[1]?.summary).toBe(
    "Drafted 3 challenges. Removed 1 scene that failed checks.",
  );
  j = await finish(j);
  expect(j.status).toBe("ready");
});

it("queues a failed stage again up to three times, but not a timeout or bad key", () => {
  const before = newJob("auto", "paper.pdf", [{ page: 1, text: page }]);
  before.stage = 1;
  const fail = (j: typeof before, error: string, errorCode?: "timeout") => {
    const after = structuredClone(j);
    after.status = "failed";
    after.error = error;
    after.audits[1] = { ...after.audits[1]!, status: "Failed", error, errorCode };
    return after;
  };
  let j = before;
  for (let n = 1; n <= AUTO_RETRIES; n++) {
    j = autoRecover(j, fail(j, "The draft has no hint for c1. Retry this stage."));
    expect(j.status).toBe("pending");
    expect(j.autoRetries).toBe(n);
    expect(j.error).toBeUndefined();
    expect(j.audits[1]).toMatchObject({ status: "Retrying" });
    expect(j.audits[1]!.error).toBeUndefined();
    expect(j.audits[1]!.summary).toBe(
      `Retrying automatically (${n} of 3): The draft has no hint for c1. Retry this stage.`,
    );
  }
  expect(autoRecover(j, fail(j, "Malformed.")).status).toBe("failed");
  expect(
    autoRecover(before, fail(before, "The AI request timed out.", "timeout")).status,
  ).toBe("failed");
  expect(
    autoRecover(
      before,
      fail(before, "Nebius request failed (401). Check model access and configuration."),
    ).status,
  ).toBe("failed");
  expect(
    autoRecover(before, fail(before, "Nebius request failed (429). Check model access and configuration."))
      .status,
  ).toBe("pending");
  // A completed stage gives the next one its own three retries.
  const advanced = structuredClone(j);
  advanced.stage = 2;
  advanced.status = "pending";
  expect(autoRecover(j, advanced).autoRetries).toBeUndefined();
});

it("redrafts once from the Lesson Architect when the final check rejects a lesson", () => {
  const before = newJob("redraft", "paper.pdf", [{ page: 1, text: page }]);
  before.stage = 4;
  before.autoRetries = 2;
  before.lesson = structuredClone(featured);
  const after = structuredClone(before);
  after.status = "review";
  after.error = "cq1: invalid answer guide.";
  after.audits[4] = { ...after.audits[4]!, status: "Needs Review", summary: after.error };
  const j = autoRecover(before, after);
  expect(j).toMatchObject({ stage: 1, status: "pending", autoRedrafts: 1, lesson: undefined });
  expect(j.error).toBeUndefined();
  expect(j.autoRetries).toBeUndefined();
  expect(j.audits[1]).toMatchObject({
    status: "Retrying",
    summary: "Redrafting automatically after the final check found: cq1: invalid answer guide.",
  });
  expect(j.audits[4]!.status).toBe("Pending");
  const again = structuredClone(after);
  again.autoRedrafts = 1;
  expect(autoRecover(before, again).status).toBe("review");
});
