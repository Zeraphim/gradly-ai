import assert from "node:assert/strict";
import { createApp } from "../apps/api/src/app.js";
import { MODEL, nebiusProvider } from "../apps/api/src/feedback.js";
import { LESSON_VERSION, type FeedbackResponse } from "@paperquest/contracts";
const key = process.env.NEBIUS_API_KEY || process.env.NEBIUS_TOKEN_FACTORY_KEY;
if (!key)
  throw new Error("Set NEBIUS_API_KEY before running the opt-in live check.");
const cases = [
  [
    "study-design",
    "Separate groups",
    "Different participants were assigned to each condition. Each student experienced only one condition and contributed one quiz score. Possible session dependence still needs checking.",
    "correct",
  ],
  [
    "study-design",
    "Separate groups",
    "The same people completed both conditions, so each person is paired with themselves.",
    "needs_revision",
  ],
  [
    "study-design",
    "Separate groups",
    "The authors used this method.",
    "needs_revision",
  ],
  [
    "method-choice",
    "A separate-groups comparison, with assumptions checked",
    "An independent-groups or Welch comparison can compare the means because different people contribute to each condition. Individual data and session information are needed to check distribution and dependence assumptions.",
    "correct",
  ],
  [
    "quiz-gap",
    "No-text scored 9.59 percentage points higher on average",
    "83.00 minus 73.41 is 9.59 percentage points. That is an absolute mean-score difference, not a relative percent change or every person’s outcome.",
    "correct",
  ],
  [
    "evidence-limit",
    "We need the individual score records",
    "Many sets of student scores can share the same average. The excerpt has no individual records, so exact scores cannot be recovered.",
    "insufficient_evidence",
  ],
  [
    "transfer-paired",
    "Account for paired measurements",
    "The same 30 students provide both estimates. The two measurements from each person are linked, so the analysis needs to account for within-person pairing.",
    "correct",
  ],
  [
    "transfer-gap",
    "Quiet-room scores average 8 percentage points higher",
    "80 minus 72 is 8 percentage points. It describes group averages on a short quiz, not course grades or every individual student. Relative change against 72 would be about 11.11 percent.",
    "correct",
  ],
] as const;
const server = createApp({ provider: nebiusProvider(key) }).listen(
  0,
  "127.0.0.1",
);
await new Promise<void>((resolve) => server.once("listening", resolve));
const address = server.address();
assert.ok(address && typeof address !== "string");
const base = `http://127.0.0.1:${address.port}`;
let failures = 0;
console.log(
  `Live smoke check: ${MODEL}; ${cases.length} cases, no automatic retries.`,
);
try {
  const initial = await (await fetch(base + "/api/lesson")).json();
  assert.equal(initial.mode, "nebius");
  for (const [
    index,
    [questionId, choice, explanation, expected],
  ] of cases.entries()) {
    const started = performance.now();
    const request = {
      lessonVersion: LESSON_VERSION,
      questionId,
      attemptId: `live-${crypto.randomUUID()}`,
      choice,
      explanation,
    };
    const response = await fetch(base + "/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    const data = (await response.json()) as FeedbackResponse;
    const actual = response.ok
      ? data.feedback.outcome
      : `service-error-${response.status}`;
    const pass = actual === expected;
    if (!pass) failures++;
    console.log(
      JSON.stringify({
        case: index + 1,
        questionId,
        expected,
        actual,
        pass,
        seconds: Number(((performance.now() - started) / 1000).toFixed(3)),
      }),
    );
    if (response.ok) {
      assert.equal(data.attemptId, request.attemptId);
      assert.equal(data.feedback.mode, "nebius");
      assert.ok(data.feedback.evidence.length > 0);
      const repeat = await fetch(base + "/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      assert.deepEqual(await repeat.json(), data);
    }
  }
  console.log(
    `${cases.length - failures}/${cases.length} expected outcomes. These checks do not establish teaching quality or learning benefits.`,
  );
  process.exitCode = failures ? 1 : 0;
} finally {
  await new Promise<void>((resolve, reject) =>
    server.close((e) => (e ? reject(e) : resolve())),
  );
}
