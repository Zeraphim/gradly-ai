import { it, expect } from "vitest";
import { newJob, runStage } from "../../apps/api/src/research/pipeline.js";
import { featured } from "../../apps/api/src/research/featured.js";
import { type ModelProvider } from "../../apps/api/src/research/provider.js";
const page =
  "A complete empirical study of independent groups with a numerical outcome and random assignment. Reported group results and statistical test are described here.";
const refs = [{ id: "source1", page: 1, excerpt: page }];
const draft = {
  ...structuredClone(featured),
  id: "generated",
  source: "generated",
  evidence: refs,
  paper: { ...featured.paper, url: null },
  challenges: featured.challenges
    .slice(0, 3)
    .map((c) => ({ ...c, refs: ["source1"] })),
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
    { findings: "Study evidence located", refs, missing: [] },
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
        findings: "Invented",
        refs: [{ id: "bad", page: 2, excerpt: "fabricated evidence" }],
        missing: [],
      },
    ]),
  );
  expect(invalid.status).toBe("failed");
  const missing = await runStage(
    j,
    provider([{ findings: "Not enough", refs, missing: ["Reported results"] }]),
  );
  expect(missing.error).toContain("Insufficient");
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
    provider([{ findings: "Evidence recovered", refs, missing: [] }]),
  );
  expect(recovered.status).toBe("pending");
  expect(recovered.stage).toBe(1);
  expect(recovered.audits[0]?.status).toBe("Completed");
  expect(recovered.audits[0]?.summary).toBe("Evidence recovered");
  expect(recovered.error).toBeUndefined();
  expect(recovered.audits[0]?.error).toBeUndefined();
});
it("prevents a flagged statistical review from becoming playable", async () => {
  let j = newJob("job", "paper.pdf", [{ page: 1, text: page }]);
  const p = provider([
    { findings: "Evidence", refs, missing: [] },
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
