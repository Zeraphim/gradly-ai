import { it, expect, vi, afterAll } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  db,
  insert,
  list,
  purgeExpired,
  read,
} from "../../apps/api/src/research/store.js";
const scratch = await mkdtemp(join(tmpdir(), "gradly-retention-"));
vi.stubEnv("DATABASE_URL", `file:${join(scratch, "retention.db")}`);
afterAll(async () => {
  (await db()).close();
  vi.unstubAllEnvs();
  await rm(scratch, { recursive: true, force: true });
});
it("purges expired papers and linked sessions while preserving active records across owners", async () => {
  const now = Date.now();
  await insert("owner-a", "job", "expired-paper", { name: "expired" });
  await insert("owner-a", "session", "linked-session", {
    lessonId: "expired-paper",
  });
  await insert("owner-b", "session", "active-other-owner", {
    lessonId: "expired-paper",
  });
  await insert("owner-a", "job", "active-paper", { name: "active" });
  const d = await db();
  await d.execute({
    sql: "UPDATE records SET expires=? WHERE id=? AND kind=?",
    args: [now - 1, "expired-paper", "job"],
  });
  await d.execute({
    sql: "INSERT INTO limits(id,count,reset) VALUES(?,?,?)",
    args: ["old-counter", 1, now - 1],
  });
  const result = await purgeExpired(now);
  expect(result).toEqual({ removedRecords: 2, removedRateCounters: 1 });
  await expect(read("owner-a", "job", "expired-paper")).rejects.toThrow(
    "not found",
  );
  await expect(read("owner-a", "session", "linked-session")).rejects.toThrow(
    "not found",
  );
  await expect(
    read("owner-b", "session", "active-other-owner"),
  ).resolves.toMatchObject({ lessonId: "expired-paper" });
  await expect(read("owner-a", "job", "active-paper")).resolves.toMatchObject({
    name: "active",
  });
  expect(await purgeExpired(now)).toEqual({
    removedRecords: 0,
    removedRateCounters: 0,
  });
});
it("history listing removes sessions whose earlier-uploaded document expired", async () => {
  const now = Date.now();
  await insert("staggered-owner", "job", "older-paper", { name: "older" });
  await insert("staggered-owner", "session", "newer-linked-session", {
    lessonId: "older-paper",
  });
  await insert("staggered-owner", "session", "active-reference-session", {
    lessonId: "featured-reference",
  });
  await insert("unrelated-owner", "session", "unrelated-session", {
    lessonId: "older-paper",
  });
  const d = await db();
  await d.execute({
    sql: "UPDATE records SET expires=? WHERE id=? AND kind='job'",
    args: [now - 1, "older-paper"],
  });
  await d.execute({
    sql: "UPDATE records SET expires=? WHERE id=? AND kind='session'",
    args: [now + 2 * 86400000, "newer-linked-session"],
  });

  expect(await list("staggered-owner", "session")).toEqual([
    expect.objectContaining({ lessonId: "featured-reference" }),
  ]);
  await expect(
    read("staggered-owner", "session", "newer-linked-session"),
  ).rejects.toThrow("not found");
  await expect(read("staggered-owner", "job", "older-paper")).rejects.toThrow(
    "not found",
  );
  await expect(
    read("unrelated-owner", "session", "unrelated-session"),
  ).resolves.toMatchObject({ lessonId: "older-paper" });
});
