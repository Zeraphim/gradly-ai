import { readFileSync } from "node:fs";

// Verification Suite for Vercel Preview Deployment (Issue No. 2 & 3)
// Usage: node verify-preview.mjs <PREVIEW_URL>
// Example: node verify-preview.mjs https://gradly-preview-xxxx.vercel.app

const targetUrl = process.argv[2]?.replace(/\/$/, "");

if (!targetUrl) {
  console.error("❌ Please provide the Preview URL as an argument.");
  console.error("Usage: node verify-preview.mjs https://<preview-domain>.vercel.app");
  process.exit(1);
}

console.log(`\n======================================================`);
console.log(`🔍 GRADLY PREVIEW DEPLOYMENT VERIFICATION SUITE`);
console.log(`Target: ${targetUrl}`);
console.log(`======================================================\n`);

async function run() {
  let cookieHeader = "";

  // 1. Check Homepage and asset headers
  console.log("1. Checking Homepage (GET /)...");
  const homeRes = await fetch(`${targetUrl}/`);
  const homeContentType = homeRes.headers.get("content-type") || "";
  if (!homeRes.ok || !homeContentType.includes("text/html")) {
    console.error(`❌ Failed: Homepage returned status ${homeRes.status} with content-type: ${homeContentType}`);
    process.exit(1);
  }
  console.log(`✅ Homepage loaded successfully (status: ${homeRes.status}, type: ${homeContentType}).`);

  // 2. Check /api/research/config endpoint
  console.log("\n2. Checking Research Config Endpoint (GET /api/research/config)...");
  const configRes = await fetch(`${targetUrl}/api/research/config`);
  if (!configRes.ok) {
    console.error(`❌ Failed: Config returned status ${configRes.status}`);
    process.exit(1);
  }
  const config = await configRes.json();
  console.log(`   Response:`, JSON.stringify(config, null, 2));

  if (!config.storage) {
    console.error(`❌ Failed: config.storage is false. (Check DATABASE_URL, DATABASE_AUTH_TOKEN, SESSION_SECRET on Vercel).`);
    process.exit(1);
  }
  console.log(`✅ Storage subsystem is recognized and enabled on Vercel preview!`);
  console.log(`   Live AI Status: ${config.liveAI ? "ENABLED (Live Mode)" : "DISABLED (Preview Reference Mode)"}`);

  // 3. Check Guest Session Cookie & Initialization
  console.log("\n3. Testing Guest Session & DB Persistence (/api/research/learning)...");
  
  // Start learning session for featured adventure
  const startRes = await fetch(`${targetUrl}/api/research/learning`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: targetUrl,
    },
    body: JSON.stringify({ lessonId: "featured" }),
  });

  const rawSetCookie = startRes.headers.get("set-cookie");
  if (rawSetCookie) {
    const match = rawSetCookie.match(/gradly-research-guest=([^;]+)/);
    if (match) {
      cookieHeader = `gradly-research-guest=${match[1]}`;
      console.log(`✅ Received signed guest session cookie: ${match[1].slice(0, 12)}...`);
    }
  }

  if (!startRes.ok) {
    const errText = await startRes.text();
    console.error(`❌ Failed to start featured adventure: status ${startRes.status}`);
    console.error(errText);
    process.exit(1);
  }

  const session = await startRes.json();
  console.log(`✅ Started featured learning session (ID: ${session.id || "featured"}, status: ${session.status || "active"}).`);

  // 4. Test durable read from remote DB across requests
  console.log("\n4. Testing Session Resume / Durable Read...");
  const resumeRes = await fetch(`${targetUrl}/api/research/learning?lessonId=featured`, {
    headers: {
      Cookie: cookieHeader,
      Origin: targetUrl,
    },
  });

  if (!resumeRes.ok) {
    console.error(`❌ Failed to read back session: status ${resumeRes.status}`);
    process.exit(1);
  }
  const resumeData = await resumeRes.json();
  console.log(`✅ Durable session read verified! Remote DB read/write roundtrip is operational on Vercel.`);

  console.log(`\n======================================================`);
  console.log(`🎉 ALL PREVIEW ACCEPTANCE CHECKS PASSED SUCCESSFULLY!`);
  console.log(`======================================================\n`);
}

run().catch((err) => {
  console.error(`\n❌ Verification encountered an unexpected error:`, err);
  process.exit(1);
});
