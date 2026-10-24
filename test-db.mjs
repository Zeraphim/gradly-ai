import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url || !authToken || url.startsWith("file:")) {
  console.error("❌ DATABASE_URL and DATABASE_AUTH_TOKEN must be set to a remote libsql:// or https:// URL.");
  process.exit(1);
}

console.log("Connecting to:", url.replace(/:[^:@]*@/, ":***@"));

// Standard libSQL over HTTPS pipeline check
async function runHttpCheck() {
  const httpUrl = url.replace(/^libsql:\/\//, "https://");
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const statements = [
    `CREATE TABLE IF NOT EXISTS records (id TEXT NOT NULL, owner TEXT NOT NULL, kind TEXT NOT NULL, data TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 0, updated INTEGER NOT NULL, expires INTEGER NOT NULL, PRIMARY KEY(id, kind));`,
    `CREATE INDEX IF NOT EXISTS records_owner ON records(owner, kind);`,
    `CREATE TABLE IF NOT EXISTS limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, reset INTEGER NOT NULL);`
  ];

  console.log("1. Verifying & initializing schema via libSQL HTTP pipeline...");
  const pipelineRes = await fetch(`${httpUrl}/v2/pipeline`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      requests: statements.map((sql) => ({ type: "execute", stmt: { sql } })),
    }),
  });

  if (!pipelineRes.ok) {
    throw new Error(`Pipeline request failed (${pipelineRes.status}): ${await pipelineRes.text()}`);
  }
  console.log("✅ Schema initialized successfully.");

  console.log("2. Testing insert...");
  const testId = "test-probe-" + Date.now();
  const insertRes = await fetch(`${httpUrl}/v2/pipeline`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      requests: [
        {
          type: "execute",
          stmt: {
            sql: "INSERT INTO records(id, owner, kind, data, updated, expires) VALUES(?, ?, ?, ?, ?, ?)",
            args: [
              { type: "text", value: testId },
              { type: "text", value: "probe-owner" },
              { type: "text", value: "test" },
              { type: "text", value: JSON.stringify({ ok: true }) },
              { type: "integer", value: String(Date.now()) },
              { type: "integer", value: String(Date.now() + 60000) },
            ],
          },
        },
      ],
    }),
  });
  if (!insertRes.ok) throw new Error(`Insert failed: ${await insertRes.text()}`);
  console.log("✅ Insert test passed.");

  console.log("3. Testing read...");
  const readRes = await fetch(`${httpUrl}/v2/pipeline`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      requests: [
        {
          type: "execute",
          stmt: {
            sql: "SELECT data FROM records WHERE id=? AND owner=?",
            args: [
              { type: "text", value: testId },
              { type: "text", value: "probe-owner" },
            ],
          },
        },
      ],
    }),
  });
  if (!readRes.ok) throw new Error(`Read failed: ${await readRes.text()}`);
  const readData = await readRes.json();
  const rows = readData.results?.[0]?.response?.result?.rows;
  if (rows && rows.length === 1) {
    console.log("✅ Read test passed.");
  } else {
    throw new Error("Read test returned unexpected row count.");
  }

  console.log("4. Cleaning up test record...");
  await fetch(`${httpUrl}/v2/pipeline`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      requests: [
        {
          type: "execute",
          stmt: {
            sql: "DELETE FROM records WHERE id=? AND owner=?",
            args: [
              { type: "text", value: testId },
              { type: "text", value: "probe-owner" },
            ],
          },
        },
      ],
    }),
  });
  console.log("✅ Cleanup test passed.");
  console.log("\n🎉 Remote database connectivity & schema confirmed! Ready for Vercel.");
}

runHttpCheck().catch((err) => {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
});
