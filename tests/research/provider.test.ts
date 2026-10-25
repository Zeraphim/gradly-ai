import { it, expect, vi, afterEach } from "vitest";
import { z } from "zod";
import { nebiusConfig } from "../../apps/api/src/nebius-config.js";
import { NebiusProvider } from "../../apps/api/src/research/provider.js";
import { generatedLessonSchema } from "../../apps/api/src/research/contracts.js";
const schema = z.object({ answer: z.string() });
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it("rejects absent credentials before a network request", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "");
  const mock = vi.fn();
  vi.stubGlobal("fetch", mock);
  await expect(
    new NebiusProvider().generate("Test", "test", {}, schema),
  ).rejects.toThrow("not configured");
  expect(mock).not.toHaveBeenCalled();
});
it("sends credentials only in server Authorization and validates structured output", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "unit-test-secret");
  const fetcher = vi.fn().mockResolvedValue(
    Response.json({
      model: nebiusConfig().modelId,
      choices: [
        { finish_reason: "stop", message: { content: '{"answer":"valid"}' } },
      ],
    }),
  );
  vi.stubGlobal("fetch", fetcher);
  const output = await new NebiusProvider().generate(
    "Reviewer",
    "verify",
    { paper: "untrusted" },
    schema,
  );
  expect(output.answer).toBe("valid");
  const [url, opts] = fetcher.mock.calls[0]!;
  expect(url).toContain("/v1/chat/completions");
  expect(opts.headers.Authorization).toBe("Bearer unit-test-secret");
  expect(opts.body).not.toContain("unit-test-secret");
  expect(JSON.parse(opts.body).response_format.type).toBe("json_schema");
});
it("handles malformed JSON and schema mismatch", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "test");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        model: nebiusConfig().modelId,
        choices: [{ finish_reason: "stop", message: { content: "oops" } }],
      }),
    ),
  );
  await expect(
    new NebiusProvider().generate("Test", "test", {}, schema),
  ).rejects.toThrow("malformed");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        model: nebiusConfig().modelId,
        choices: [
          { finish_reason: "stop", message: { content: '{"wrong":true}' } },
        ],
      }),
    ),
  );
  await expect(
    new NebiusProvider().generate("Test", "test", {}, schema),
  ).rejects.toThrow("schema");
});
it("reports model access errors and timeouts without response body leakage", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "test");
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(new Response("sensitive upstream", { status: 403 })),
  );
  await expect(
    new NebiusProvider().generate("Test", "test", {}, schema),
  ).rejects.toThrow("(403)");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockRejectedValue(new DOMException("timeout", "TimeoutError")),
  );
  await expect(
    new NebiusProvider().generate("Test", "test", {}, schema),
  ).rejects.toThrow("timed out");
});

it("rejects truncated or unexpected-model responses before accepting valid JSON", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "test");
  for (const [model, finishReason, message] of [
    ["unexpected-model", "stop", "incomplete or came from an unexpected model"],
    [nebiusConfig().modelId, "length", "output limit"],
  ]) {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          model,
          choices: [
            {
              finish_reason: finishReason,
              message: { content: '{"answer":"valid"}' },
            },
          ],
        }),
      ),
    );
    await expect(
      new NebiusProvider().generate("Test", "test", {}, schema),
    ).rejects.toThrow(message);
  }
});

it("carries a typed errorCode and logs token usage on the output limit", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "test");
  const model = nebiusConfig().modelId;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json({
        model,
        usage: {
          completion_tokens: 8000,
          completion_tokens_details: { reasoning_tokens: 4100 },
        },
        choices: [{ finish_reason: "length", message: { content: "{" } }],
      }),
    ),
  );
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    const attempt = new NebiusProvider().generate(
      "Reviewer",
      "verify",
      {},
      schema,
    );
    await expect(attempt).rejects.toThrow("output limit");
    await expect(attempt).rejects.toMatchObject({ code: "output_limit" });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("completion_tokens: 8000"),
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("reasoning_tokens: 4100"),
    );
  } finally {
    warn.mockRestore();
  }
});

it("sizes the output budget by caller slot, not model name", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "test");
  const fetcher = vi.fn().mockImplementation(() =>
    Response.json({
      model: nebiusConfig().modelId,
      choices: [
        { finish_reason: "stop", message: { content: '{"answer":"ok"}' } },
      ],
    }),
  );
  vi.stubGlobal("fetch", fetcher);

  await new NebiusProvider().generate(
    "Lesson Architect",
    "draft",
    {},
    schema,
    undefined,
    { tier: "pipeline" },
  );
  await new NebiusProvider().generate("Coach", "feedback", {}, schema);

  const [pipelineRequest, feedbackRequest] = fetcher.mock.calls.map(
    (call) => JSON.parse(call[1]!.body),
  );
  expect(pipelineRequest.max_tokens).toBe(32000);
  expect(feedbackRequest.max_tokens).toBe(8000);
  expect(pipelineRequest.model).toBe("nvidia/nemotron-3-super-120b-a12b");
});

it("strips propertyNames from the wire schema but keeps Zod validation", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "unit-test-secret");
  const recordSchema = z.object({
    misconceptions: z.record(z.string(), z.string()),
  });
  const fetcher = vi.fn().mockImplementation(() =>
    Response.json({
      model: nebiusConfig().modelId,
      choices: [
        {
          finish_reason: "stop",
          message: { content: '{"misconceptions":{"opt1":"text"}}' },
        },
      ],
    }),
  );
  vi.stubGlobal("fetch", fetcher);

  const output = await new NebiusProvider().generate(
    "Test",
    "test",
    {},
    recordSchema,
  );
  const sent = JSON.parse(fetcher.mock.calls[0]![1]!.body);
  const sentJson = JSON.stringify(sent.response_format.json_schema.schema);
  expect(sentJson).not.toContain("propertyNames");
  // Zod still validates the reply against the record shape.
  expect(output.misconceptions.opt1).toBe("text");
  fetcher.mockImplementation(() =>
    Response.json({
      model: nebiusConfig().modelId,
      choices: [
        {
          finish_reason: "stop",
          message: { content: '{"misconceptions":{"opt1":5}}' },
        },
      ],
    }),
  );
  await expect(
    new NebiusProvider().generate("Test", "test", {}, recordSchema),
  ).rejects.toThrow("did not match the required schema");
});

it("strips propertyNames from the real lesson schema", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "test");
  const fetcher = vi.fn().mockResolvedValue(
    new Response("stop after capture", { status: 400 }),
  );
  vi.stubGlobal("fetch", fetcher);
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    await expect(
      new NebiusProvider().generate(
        "Lesson Architect",
        "draft",
        {},
        generatedLessonSchema,
        undefined,
        { tier: "pipeline" },
      ),
    ).rejects.toThrow("(400)");
  } finally {
    warn.mockRestore();
  }
  expect(JSON.stringify(z.toJSONSchema(generatedLessonSchema))).toContain(
    "propertyNames",
  );
  const sent = JSON.parse(fetcher.mock.calls[0]![1]!.body);
  expect(JSON.stringify(sent.response_format.json_schema.schema)).not.toContain(
    "propertyNames",
  );
});

it("retries one timeout, then fails with a typed timeout code and a log line", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "test");
  const fetcher = vi
    .fn()
    .mockRejectedValue(new DOMException("timeout", "TimeoutError"));
  vi.stubGlobal("fetch", fetcher);
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    const attempt = new NebiusProvider().generate(
      "Lesson Architect",
      "draft",
      {},
      schema,
      undefined,
      { tier: "pipeline" },
    );
    await expect(attempt).rejects.toThrow("timed out");
    await expect(attempt).rejects.toMatchObject({ code: "timeout" });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(
        /Timeout after 110000ms .*role: Lesson Architect, tier: pipeline/,
      ),
    );
    warn.mockClear();
    await expect(
      new NebiusProvider().generate("Coach", "feedback", {}, schema),
    ).rejects.toMatchObject({ code: "timeout" });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Timeout after 45000ms"),
    );
  } finally {
    warn.mockRestore();
  }
});

it("rejects when PREVIEW_MODE is true even if API key exists", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "valid-key");
  vi.stubEnv("PREVIEW_MODE", "true");
  const mock = vi.fn();
  vi.stubGlobal("fetch", mock);
  await expect(
    new NebiusProvider().generate("Test", "test", {}, schema),
  ).rejects.toThrow("Nebius API key is not configured");
  expect(mock).not.toHaveBeenCalled();
});

it.each([429, 529])("retries transient %i and succeeds on attempt 1", async (status) => {
  vi.stubEnv("NEBIUS_API_KEY", "unit-test-secret");
  vi.useFakeTimers();

  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(new Response("Too Many Requests", { status }))
    .mockResolvedValueOnce(
      Response.json({
        model: nebiusConfig().modelId,
        choices: [
          {
            finish_reason: "stop",
            message: { content: '{"answer":"recovered"}' },
          },
        ],
      }),
    );
  vi.stubGlobal("fetch", fetcher);

  const promise = new NebiusProvider().generate(
    "Reviewer",
    "verify",
    {},
    schema,
  );
  await vi.runAllTimersAsync();
  const output = await promise;

  expect(output.answer).toBe("recovered");
  expect(fetcher).toHaveBeenCalledTimes(2);
  vi.useRealTimers();
});

it("fails when transient errors exhaust all retry attempts", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "unit-test-secret");
  vi.useFakeTimers();

  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response("Gateway Timeout", { status: 504 }));
  vi.stubGlobal("fetch", fetcher);

  const promise = new NebiusProvider().generate(
    "Reviewer",
    "verify",
    {},
    schema,
  );
  const expectation = expect(promise).rejects.toThrow("(504)");
  await vi.runAllTimersAsync();
  await expectation;

  expect(fetcher).toHaveBeenCalledTimes(2);
  vi.useRealTimers();
});

it("does not retry permanent 401 client error", async () => {
  vi.stubEnv("NEBIUS_API_KEY", "unit-test-secret");
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response("Unauthorized", { status: 401 }));
  vi.stubGlobal("fetch", fetcher);

  await expect(
    new NebiusProvider().generate("Test", "test", {}, schema),
  ).rejects.toThrow("(401)");

  // Must fail immediately on attempt 0 without retrying
  expect(fetcher).toHaveBeenCalledTimes(1);
});
