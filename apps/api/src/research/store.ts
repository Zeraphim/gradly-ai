import { createClient, type Client } from "@libsql/client";
import { mkdir } from "node:fs/promises";
export class ConflictError extends Error {}
let client: Client | undefined;
let ready: Promise<void> | undefined;
export async function db() {
  const url = process.env.DATABASE_URL || "file:.data/gradly.db";
  if (process.env.VERCEL && url.startsWith("file:"))
    throw Error(
      "Configure a remote DATABASE_URL and DATABASE_AUTH_TOKEN for durable Vercel storage.",
    );
  if (!client) {
    if (url.startsWith("file:")) await mkdir(".data", { recursive: true });
    client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
  }
  if (!ready)
    ready = client.executeMultiple(
      `CREATE TABLE IF NOT EXISTS records (id TEXT NOT NULL,owner TEXT NOT NULL,kind TEXT NOT NULL,data TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 0,updated INTEGER NOT NULL,expires INTEGER NOT NULL, PRIMARY KEY(id,kind)); CREATE INDEX IF NOT EXISTS records_owner ON records(owner,kind); CREATE TABLE IF NOT EXISTS limits (id TEXT PRIMARY KEY,count INTEGER NOT NULL,reset INTEGER NOT NULL);`,
    );
  await ready;
  return client;
}
export async function insert<T>(
  owner: string,
  kind: string,
  id: string,
  data: T,
) {
  const d = await db();
  await d.execute({
    sql: "INSERT INTO records(id,owner,kind,data,updated,expires) VALUES(?,?,?,?,?,?)",
    args: [
      id,
      owner,
      kind,
      JSON.stringify(data),
      Date.now(),
      Date.now() + 30 * 86400000,
    ],
  });
}
export async function read<T>(
  owner: string,
  kind: string,
  id: string,
): Promise<T & { version: number }> {
  const d = await db();
  const r = await d.execute({
    sql: "SELECT data,version FROM records WHERE id=? AND owner=? AND kind=? AND expires>?",
    args: [id, owner, kind, Date.now()],
  });
  if (!r.rows.length) throw Error("Record not found or expired.");
  return {
    ...JSON.parse(r.rows[0]!.data as string),
    version: Number(r.rows[0]!.version),
  };
}
export async function write<T>(
  owner: string,
  kind: string,
  id: string,
  data: T,
  version: number,
) {
  const d = await db();
  const r = await d.execute({
    sql: "UPDATE records SET data=?,version=version+1,updated=? WHERE id=? AND owner=? AND kind=? AND version=?",
    args: [JSON.stringify(data), Date.now(), id, owner, kind, version],
  });
  if (r.rowsAffected !== 1)
    throw new ConflictError("State changed. Reload to continue safely.");
  return { ...data, version: version + 1 };
}
export async function list<T>(
  owner: string,
  kind: string,
): Promise<(T & { version: number })[]> {
  const d = await db();
  await d.execute({
    sql: "DELETE FROM records WHERE expires<?",
    args: [Date.now()],
  });
  const r = await d.execute({
    sql: "SELECT data,version FROM records WHERE owner=? AND kind=? ORDER BY updated DESC LIMIT 100",
    args: [owner, kind],
  });
  return r.rows.map((row) => ({
    ...JSON.parse(row.data as string),
    version: Number(row.version),
  }));
}
export async function remove(owner: string, id: string) {
  const d = await db();
  await d.execute({
    sql: "DELETE FROM records WHERE owner=? AND id=?",
    args: [owner, id],
  });
}
export async function rateLimit(owner: string, bucket: string, max: number) {
  const d = await db();
  const key = `${owner}:${bucket}`;
  const now = Date.now();
  await d.execute({
    sql: "INSERT INTO limits(id,count,reset) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN reset<? THEN 1 ELSE count+1 END, reset=CASE WHEN reset<? THEN ? ELSE reset END",
    args: [key, now + 3600000, now, now, now + 3600000],
  });
  const r = await d.execute({
    sql: "SELECT count FROM limits WHERE id=?",
    args: [key],
  });
  if (Number(r.rows[0]?.count ?? max + 1) > max)
    throw Error("Hourly request limit reached. Try again later.");
}

export async function deleteDocument(owner: string, id: string) {
  const d = await db();
  await d.batch(
    [
      {
        sql: "DELETE FROM records WHERE owner=? AND kind='session' AND json_extract(data,'$.lessonId')=?",
        args: [owner, id],
      },
      {
        sql: "DELETE FROM records WHERE owner=? AND id=? AND kind='job'",
        args: [owner, id],
      },
    ],
    "write",
  );
}

export async function purgeExpired(now = Date.now()) {
  const d = await db();
  const results = await d.batch(
    [
      {
        sql: "DELETE FROM records WHERE kind='session' AND EXISTS (SELECT 1 FROM records AS document WHERE document.kind='job' AND document.owner=records.owner AND document.id=json_extract(records.data,'$.lessonId') AND document.expires<=?)",
        args: [now],
      },
      { sql: "DELETE FROM records WHERE expires<=?", args: [now] },
      { sql: "DELETE FROM limits WHERE reset<=?", args: [now] },
    ],
    "write",
  );
  return {
    removedRecords: results[0]!.rowsAffected + results[1]!.rowsAffected,
    removedRateCounters: results[2]!.rowsAffected,
  };
}
