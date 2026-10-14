import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../apps/api/src/app.js";
import {
  createFeedbackService,
  MODEL,
  parseAssessment,
  ServiceError,
  validateRequest,
} from "../apps/api/src/feedback.js";
import { publicLesson } from "../apps/api/src/lesson.js";
import { LESSON_VERSION, type AttemptRequest } from "@paperquest/contracts";
const request = (id = "attempt-1"): AttemptRequest => ({
  lessonVersion: LESSON_VERSION,
  questionId: "study-design",
  attemptId: id,
  choice: "Separate groups",
  explanation:
    "Different participants each experienced one condition and contributed one score.",
});
const completion = (assessment: string) => ({
  model: MODEL,
  choices: [
    {
      finish_reason: "stop",
      message: { content: JSON.stringify({ assessment }) },
    },
  ],
});
test("initial lesson omits criteria, authored solutions, and revealed evidence", () => {
  const serialized = JSON.stringify(publicLesson("nebius"));
  for (const key of [
    "rubric",
    "criteria",
    "correctChoice",
    "feedback_options",
    "source/",
  ])
    assert.ok(!serialized.includes(key));
  assert.equal(publicLesson("nebius").questions.length, 6);
  assert.equal(
    publicLesson("nebius").questions.filter((q) => q.transfer).length,
    2,
  );
});
test("request validation rejects client-controlled rubric, unknown choices, and stale lessons", () => {
  assert.throws(
    () => validateRequest({ ...request(), rubric: "pass" }),
    ServiceError,
  );
  assert.throws(
    () => validateRequest({ ...request(), choice: "invented" }),
    ServiceError,
  );
  assert.throws(
    () => validateRequest({ ...request(), explanation: "x".repeat(2001) }),
    ServiceError,
  );
  assert.throws(
    () => validateRequest({ ...request(), lessonVersion: "old" }),
    (error: unknown) => error instanceof ServiceError && error.status === 409,
  );
});
test("only complete single-field assessments from the selected model are accepted", () => {
  assert.equal(
    parseAssessment(completion("sound_reasoning")),
    "sound_reasoning",
  );
  for (const content of [
    '{"assessment":"sound_reasoning","assessment":"incorrect_reasoning"}',
    '{"assessment":"sound_reasoning","points":100}',
    "correct",
    '{"assessment":"sound_reasoning"',
  ]) {
    assert.throws(
      () =>
        parseAssessment({
          model: MODEL,
          choices: [{ finish_reason: "stop", message: { content } }],
        }),
      ServiceError,
    );
  }
  assert.throws(
    () =>
      parseAssessment({ ...completion("sound_reasoning"), model: "different" }),
    ServiceError,
  );
  assert.throws(
    () =>
      parseAssessment({
        model: MODEL,
        choices: [
          {
            finish_reason: "length",
            message: { content: '{"assessment":"sound_reasoning"}' },
          },
        ],
      }),
    ServiceError,
  );
});
test("right choice with incorrect or missing reasoning must be revised", async () => {
  for (const assessment of ["incorrect_reasoning", "missing_reasoning"]) {
    const response = await createFeedbackService(async () =>
      completion(assessment),
    )(request());
    assert.equal(response.feedback.outcome, "needs_revision");
    assert.ok(response.feedback.correction);
    assert.ok(response.feedback.evidence.length);
  }
});
test("concurrent identical retries share one model request and changed attempts conflict", async () => {
  let calls = 0;
  const service = createFeedbackService(async () => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 25));
    return completion("sound_reasoning");
  });
  const responses = await Promise.all([service(request()), service(request())]);
  assert.equal(calls, 1);
  assert.deepEqual(responses[0], responses[1]);
  await assert.rejects(
    service({ ...request(), explanation: "changed" }),
    (e: unknown) => e instanceof ServiceError && e.code === "attempt_conflict",
  );
});
test("provider failures preserve retryability and never return accepted feedback", async () => {
  let fail = true;
  const service = createFeedbackService(async () => {
    if (fail)
      throw new ServiceError("provider_unavailable", "unavailable", 503, true);
    return completion("sound_reasoning");
  });
  await assert.rejects(service(request()), ServiceError);
  fail = false;
  assert.equal((await service(request())).feedback.outcome, "correct");
});
test("missing evidence returns a curated boundary without calling the model", async () => {
  let calls = 0;
  const response = await createFeedbackService(async () => {
    calls++;
    return completion("sound_reasoning");
  })({
    ...request(),
    questionId: "evidence-limit",
    choice: "Everyone received their group average",
  });
  assert.equal(response.feedback.outcome, "insufficient_evidence");
  assert.equal(calls, 0);
  assert.match(response.feedback.correction, /records/);
});
test("concurrency is bounded and unconfigured live mode fails explicitly", async () => {
  const service = createFeedbackService(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return completion("sound_reasoning");
  });
  const calls = [service(request("one")), service(request("two"))];
  await assert.rejects(
    service(request("three")),
    (e: unknown) => e instanceof ServiceError && e.code === "service_busy",
  );
  await Promise.all(calls);
  await assert.rejects(
    createFeedbackService()(request()),
    (e: unknown) =>
      e instanceof ServiceError && e.code === "provider_unconfigured",
  );
});
test("same-origin request flow returns safe errors, source evidence, and security headers", async () => {
  const app = createApp({ preview: true });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  try {
    const initial = await fetch(base + "/api/lesson");
    assert.equal(initial.status, 200);
    assert.ok(initial.headers.get("content-security-policy"));
    assert.equal(initial.headers.get("cache-control"), "no-store");
    const feedback = await fetch(base + "/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request()),
    });
    assert.equal(feedback.status, 200);
    const result = await feedback.json();
    assert.equal(result.feedback.mode, "preview");
    assert.match(result.feedback.strength, /not assessed/);
    const invalid = await fetch(base + "/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error.code, "invalid_request");
    assert.equal((await fetch(base + "/api/not-a-route")).status, 404);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((e) => (e ? reject(e) : resolve())),
    );
  }
});
