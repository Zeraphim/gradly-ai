import { afterAll, expect, it, vi } from "vitest";

const mocked = vi.hoisted(() => ({
  client: { executeMultiple: vi.fn() },
}));
vi.mock("@libsql/client", () => ({
  createClient: vi.fn(() => mocked.client),
}));

import { createClient } from "@libsql/client";
import { db } from "../../apps/api/src/research/store.js";

afterAll(() => vi.unstubAllEnvs());

it("retries schema initialization after a transient database failure", async () => {
  vi.stubEnv("DATABASE_URL", "libsql://initialization-test.invalid");
  mocked.client.executeMultiple
    .mockRejectedValueOnce(Error("Temporary database outage"))
    .mockResolvedValueOnce(undefined);

  await expect(db()).rejects.toThrow("Temporary database outage");
  await expect(db()).resolves.toBe(mocked.client);
  await expect(db()).resolves.toBe(mocked.client);
  expect(createClient).toHaveBeenCalledTimes(1);
  expect(mocked.client.executeMultiple).toHaveBeenCalledTimes(2);
});
