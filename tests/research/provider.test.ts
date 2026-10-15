import { it, expect, vi, afterEach } from "vitest";
import { z } from "zod";
import { nebiusConfig } from "../../apps/api/src/nebius-config.js";
import { NebiusProvider } from "../../apps/api/src/research/provider.js";
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
  for (const [model, finishReason] of [
    ["unexpected-model", "stop"],
    [nebiusConfig().modelId, "length"],
  ]) {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
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
    ).rejects.toThrow("incomplete or came from an unexpected model");
  }
});
