import { it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../../apps/api/src/research/routes/feedback.js";
import { insert, read, write } from "../../apps/api/src/research/store.js";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  newSession,
  transition,
  submit,
  reviseReasoning,
} from "../../apps/api/src/research/engine.js";
import { requestContext } from "../../apps/api/src/research/auth.js";
import { type LearningSession } from "../../apps/api/src/research/contracts.js";
import { type ModelProvider } from "../../apps/api/src/research/provider.js";

const guestA = "guest-a-0000-0000-0000-000000000000";
const guestB = "guest-b-1111-1111-1111-111111111111";

// Helper to wrap execution in requestContext with simulated guest cookies
function withGuest<T>(ownerId: string, fn: () => Promise<T>): Promise<T> {
  const req = {
    headers: {
      cookie: `gradly-research-guest=${ownerId}.mocksignature`,
    },
  } as any;
  const res = {
    cookie: vi.fn(),
  } as any;
  return requestContext.run({ request: req, response: res }, fn);
}

// Mock auth.owner() to return the simulated guest ID
vi.mock("../../apps/api/src/research/auth.js", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    sameOrigin: vi.fn(),
    owner: vi.fn(async () => {
      const store = actual.requestContext.getStore();
      const raw = store?.request.headers.cookie?.match(
        /gradly-research-guest=([^.]+)/,
      );
      return raw ? raw[1] : guestA;
    }),
  };
});

// Helper to create a session for Guest A with reasoning submitted for challenge "q3" (writtenReasoning: true)
async function createSessionWithReasoning(ownerId: string) {
  let s = newSession(featured, "session-" + Math.random().toString(36).slice(2));
  s = transition(s, featured, "begin");
  s.index = 2; // "q3" has writtenReasoning: true
  // Submit answer with reasoning on "q3", option "A"
  s = submit(
    s,
    featured,
    ["A"],
    "I selected A because of randomized group allocation.",
  );
  await insert(ownerId, "session", s.id, s);
  return s;
}

beforeEach(() => {
  process.env.RESEARCH_ENABLED = "true";
  process.env.DATABASE_URL = "file:.data/feedback-route.db";
  process.env.DATABASE_AUTH_TOKEN = "";
  process.env.SESSION_SECRET =
    "local-test-session-secret-at-least-32-chars-long-0123456789";
  process.env.PREVIEW_MODE = "false";
});

afterEach(() => {
  vi.clearAllMocks();
});

it("passes readable option labels and permitted excerpts to the model", async () => {
  const session = await withGuest(guestA, () =>
    createSessionWithReasoning(guestA),
  );

  let capturedInput: any = null;
  const mockProvider: ModelProvider = {
    async generate(role, task, input, schema) {
      capturedInput = input;
      return {
        category: "Well Supported",
        guidance: "Strong reasoning based on the random assignment protocol.",
        followup: "How might blinding further improve this design?",
        refs: ["method"],
      } as any;
    },
  };

  const req = new Request("http://localhost/api/research/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: session.id,
      version: session.version,
      challengeId: "q3",
      reasoningRevision: 0,
    }),
  });

  const res = await withGuest(guestA, () => POST(req, mockProvider));
  expect(res.status).toBe(200);

  // 1. Verify readable option label was resolved instead of raw ["A"]
  expect(capturedInput).not.toBeNull();
  expect(capturedInput.selected[0]).toContain("Independent-samples t-test");

  // 2. Verify permitted source excerpts were resolved from authoritative records
  expect(capturedInput.permittedExcerpts).toBeDefined();
  expect(capturedInput.permittedExcerpts.length).toBeGreaterThan(0);
  expect(capturedInput.permittedExcerpts[0].excerpt).toBeDefined();

  // 3. Verify reasoning is present
  expect(capturedInput.reasoning).toBe(
    "I selected A because of randomized group allocation.",
  );
});

it("rejects another guest's session (IDOR protection)", async () => {
  const session = await withGuest(guestA, () =>
    createSessionWithReasoning(guestA),
  );

  const req = new Request("http://localhost/api/research/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: session.id }),
  });

  // Guest B attempts to request feedback on Guest A's session
  const res = await withGuest(guestB, () => POST(req));
  expect(res.status).toBe(400);
});

it("rejects stale session version, wrong challenge, or superseded reasoning revision", async () => {
  const session = await withGuest(guestA, () =>
    createSessionWithReasoning(guestA),
  );

  const mockProvider: ModelProvider = {
    async generate() {
      return {} as any;
    },
  };

  // Test stale session version
  const staleVersionReq = new Request(
    "http://localhost/api/research/feedback",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        version: session.version - 1,
        challengeId: "q3",
      }),
    },
  );
  const resStale = await withGuest(guestA, () =>
    POST(staleVersionReq, mockProvider),
  );
  expect(resStale.status).toBe(409);

  // Test wrong challengeId
  const wrongChallengeReq = new Request(
    "http://localhost/api/research/feedback",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        version: session.version,
        challengeId: "wrong-challenge-id",
      }),
    },
  );
  const resWrong = await withGuest(guestA, () =>
    POST(wrongChallengeReq, mockProvider),
  );
  expect(resWrong.status).toBe(409);

  // Test superseded reasoning revision index
  const supersededRevReq = new Request(
    "http://localhost/api/research/feedback",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        version: session.version,
        challengeId: "q3",
        reasoningRevision: 99, // revision 99 does not exist
      }),
    },
  );
  const resRev = await withGuest(guestA, () =>
    POST(supersededRevReq, mockProvider),
  );
  expect(resRev.status).toBe(409);
});

it("concurrency guard: prevents delayed AI feedback from overwriting a newer reasoning revision", async () => {
  const session = await withGuest(guestA, () =>
    createSessionWithReasoning(guestA),
  );

  // Simulate slow AI inference during which the learner edits their reasoning
  const mockSlowProvider: ModelProvider = {
    async generate() {
      // While AI is "thinking", user updates reasoning in the database
      const current = await read<LearningSession>(guestA, "session", session.id);
      const updated = reviseReasoning(
        current,
        featured,
        "Revised reasoning: now including double-blind controls.",
      );
      await write(guestA, "session", session.id, updated, current.version);

      return {
        category: "Well Supported",
        guidance: "Old assessment",
        followup: "Old question",
        refs: ["method"],
      } as any;
    },
  };

  const req = new Request("http://localhost/api/research/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: session.id,
      version: session.version,
      challengeId: "q3",
      reasoningRevision: 0,
    }),
  });

  const res = await withGuest(guestA, () => POST(req, mockSlowProvider));
  // Must reject with 409 Conflict due to concurrent revision
  expect(res.status).toBe(409);

  // Verify that the learner's newer revised reasoning was NOT overwritten
  const finalState = await read<LearningSession>(guestA, "session", session.id);
  const finalAttempt = finalState.answers["q3"]?.at(-1);
  expect(finalAttempt?.reasoning).toBe(
    "Revised reasoning: now including double-blind controls.",
  );
});

it("provider failure preserves reasoning without altering score or progression", async () => {
  const session = await withGuest(guestA, () =>
    createSessionWithReasoning(guestA),
  );

  const failingProvider: ModelProvider = {
    async generate() {
      throw new Error("Nebius 503 Service Unavailable");
    },
  };

  const req = new Request("http://localhost/api/research/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: session.id }),
  });

  const res = await withGuest(guestA, () => POST(req, failingProvider));
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.mode).toBe("fallback");
  expect(data.notice).toContain("Your reasoning is saved");

  // Verify database record has untouched reasoning and no progress was corrupted
  const stateAfter = await read<LearningSession>(guestA, "session", session.id);
  expect(stateAfter.answers["q3"]?.at(-1)?.reasoning).toBe(
    "I selected A because of randomized group allocation.",
  );
  expect(stateAfter.phase).toBe("challenge");
});

it("keeps paper identity and unrelated evidence out of feedback", async () => {
  const session = await withGuest(guestA, () =>
    createSessionWithReasoning(guestA),
  );
  const challenge = featured.challenges[2]!;
  let capturedInput: any = null;
  const reply = (guidance: string): ModelProvider => ({
    async generate(_role, _task, input) {
      capturedInput = input;
      return {
        category: "Partially Supported",
        guidance,
        followup: "Which excerpt supports that?",
        refs: [],
      } as any;
    },
  });
  const request = () =>
    new Request("http://localhost/api/research/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id }),
    });

  const ok = await withGuest(guestA, () =>
    POST(request(), reply("Connect the allocation to the outcome.")),
  );
  expect(ok.status).toBe(200);
  const sent = JSON.stringify(capturedInput);
  expect(sent).not.toContain(featured.paper.title);
  expect(sent).not.toContain(featured.paper.authors);
  expect(
    capturedInput.permittedExcerpts.every((e: { id: string }) =>
      challenge.refs.includes(e.id),
    ),
  ).toBe(true);
  const unrelated = featured.evidence.filter(
    (e) => !challenge.refs.includes(e.id),
  );
  expect(unrelated.length).toBeGreaterThan(0);
  for (const e of unrelated) expect(sent).not.toContain(e.excerpt);

  const before = await withGuest(guestA, () =>
    read<LearningSession>(guestA, "session", session.id),
  );
  const leaked = await withGuest(guestA, () =>
    POST(request(), reply(`As shown in ${featured.paper.title}, yes.`)),
  );
  expect(leaked.status).toBe(400);
  expect((await leaked.json()).error).toMatch(/paper identity/);
  const after = await withGuest(guestA, () =>
    read<LearningSession>(guestA, "session", session.id),
  );
  expect(after.aiFeedback).toEqual(before.aiFeedback);
});
