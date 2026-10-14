import test from "node:test";
import assert from "node:assert/strict";
import {
  newSession,
  updateDraft,
  recordAttempt,
  acceptFeedback,
  advance,
  points,
  restoreSession,
} from "@paperquest/lesson-state";
import type { FeedbackResponse } from "@paperquest/contracts";
const response = (
  questionId = "q1",
  attemptId = "attempt1",
  outcome: "correct" | "needs_revision" | "insufficient_evidence" = "correct",
): FeedbackResponse => ({
  questionId,
  attemptId,
  feedback: {
    outcome,
    strength: "",
    correction: "",
    nextStep: "",
    mode: "nebius",
    evidence: [],
  },
});
function attempt(s = newSession(), q = "q1", id = "attempt1") {
  return recordAttempt(
    updateDraft(s, q, { choice: "A", explanation: "My reasoning" }),
    q,
    { id, choice: "A", explanation: "My reasoning" },
  );
}
test("feedback without a recorded matching attempt cannot reveal or award progress", () => {
  const s = newSession();
  assert.equal(acceptFeedback(s, response()), s);
  assert.equal(points(s), 0);
  assert.equal(advance(s, ["q1"]), s);
});
test("retries cannot award duplicate points and unpassed quests cannot be skipped", () => {
  let s = attempt();
  assert.equal(advance(s, ["q1", "q2"]), s);
  s = acceptFeedback(s, response());
  assert.equal(points(s), 10);
  assert.equal(points(acceptFeedback(s, response())), 10);
  assert.equal(
    recordAttempt(s, "q1", { id: "extra", choice: "A", explanation: "repeat" }),
    s,
  );
  s = advance(s, ["q1", "q2"]);
  assert.equal(s.current, 1);
  assert.equal(s.questions.q2, undefined);
});
test("revision and new-scenario answers remain independent", () => {
  let s = acceptFeedback(
    attempt(),
    response("q1", "attempt1", "needs_revision"),
  );
  assert.equal(points(s), 0);
  assert.equal(s.questions.q1?.finished, false);
  s = acceptFeedback(attempt(s, "q1", "revision"), response("q1", "revision"));
  s = advance(s, ["q1", "q2"]);
  s = updateDraft(s, "q2", { choice: "B", explanation: "Different scenario" });
  assert.equal(s.questions.q1?.choice, "A");
  assert.equal(s.questions.q2?.choice, "B");
  assert.equal(points(s), 10);
});
test("insufficient evidence unlocks continuation but awards no points", () => {
  const s = acceptFeedback(
    attempt(),
    response("q1", "attempt1", "insufficient_evidence"),
  );
  assert.equal(points(s), 0);
  assert.equal(advance(s, ["q1", "q2"]).current, 1);
});
test("saved progress reconstructs rewards and rejects malformed and incompatible sessions", () => {
  const s = advance(acceptFeedback(attempt(), response()), ["q1", "q2"]);
  assert.equal(points(restoreSession(JSON.stringify(s), ["q1", "q2"])), 10);
  const forged = {
    ...newSession(),
    current: 2,
    questions: {
      q1: {
        choice: "A",
        explanation: "",
        attempts: [],
        finished: true,
        awarded: true,
      },
    },
  };
  const restored = restoreSession(JSON.stringify(forged), ["q1", "q2"]);
  assert.equal(restored.current, 0);
  assert.equal(points(restored), 0);
  for (const raw of [
    "bad",
    JSON.stringify({ ...s, version: "old" }),
    JSON.stringify({ ...s, current: -1 }),
  ])
    assert.deepEqual(restoreSession(raw, ["q1", "q2"]), newSession());
});
