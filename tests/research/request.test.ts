import { afterEach, expect, it, vi } from "vitest";
import {
  api,
  ResearchRequestError,
} from "../../apps/web/src/research/request.js";

afterEach(() => vi.unstubAllGlobals());

it("returns valid JSON from a read request", async () => {
  const result = { id: "adventure", version: 4 };
  const fetcher = vi.fn().mockResolvedValue(Response.json(result));
  vi.stubGlobal("fetch", fetcher);

  await expect(
    api<typeof result>("/api/research/learning?id=adventure"),
  ).resolves.toEqual(result);
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(fetcher.mock.calls[0]?.[0]).toBe(
    "/api/research/learning?id=adventure",
  );
});

it("serializes mutation data and forwards a caller cancellation signal", async () => {
  const fetcher = vi.fn().mockResolvedValue(Response.json({ deleted: true }));
  vi.stubGlobal("fetch", fetcher);
  const controller = new AbortController();
  await api(
    "/api/research/documents",
    { id: "document" },
    "DELETE",
    controller.signal,
  );
  const options = fetcher.mock.calls[0]?.[1] as RequestInit;
  expect(options.method).toBe("DELETE");
  expect(new Headers(options.headers).get("Content-Type")).toBe(
    "application/json",
  );
  expect(JSON.parse(options.body as string)).toEqual({ id: "document" });
  expect(options.signal).toBeDefined();
});

it("keeps a structured error message and its HTTP status", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        Response.json(
          { error: "Your saved progress changed. Reload before submitting." },
          { status: 409 },
        ),
      ),
  );
  const error = await api("/api/research/learning", { action: "submit" }).catch(
    (cause: unknown) => cause,
  );
  expect(error).toBeInstanceOf(ResearchRequestError);
  expect(error).toMatchObject({
    status: 409,
    message: "Your saved progress changed. Reload before submitting.",
  });
});

it.each([200, 502])(
  "handles non-JSON HTTP %i without showing an HTML error page",
  async (status) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html>private proxy diagnostic</html>", {
          status,
          headers: { "Content-Type": "text/html" },
        }),
      ),
    );
    const error = await api("/api/research/config").catch(
      (cause: unknown) => cause,
    );
    expect(error).toBeInstanceOf(ResearchRequestError);
    expect(error).toHaveProperty("status", status);
    expect((error as Error).message).toBeTruthy();
    expect((error as Error).message).not.toContain("private proxy diagnostic");
    expect((error as Error).message).not.toContain("<html>");
  },
);

it("turns network failure into a recoverable request error", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockRejectedValue(new TypeError("private network diagnostic")),
  );
  const error = await api("/api/research/config").catch(
    (cause: unknown) => cause,
  );
  expect(error).toBeInstanceOf(ResearchRequestError);
  expect(error).toHaveProperty("status", 0);
  expect((error as Error).message).toBeTruthy();
  expect((error as Error).message).not.toContain("private network diagnostic");
});

it("passes caller aborts through unchanged", async () => {
  const aborted = new DOMException("User left this page", "AbortError");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(aborted));
  const controller = new AbortController();
  controller.abort();

  await expect(
    api("/api/research/learning", undefined, "POST", controller.signal),
  ).rejects.toBe(aborted);
});
