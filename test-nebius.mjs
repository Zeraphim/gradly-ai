import { nebiusConfig } from "./apps/api/src/nebius-config.ts";

const apiKey = process.env.NEBIUS_API_KEY;
if (!apiKey) {
  console.error("❌ NEBIUS_API_KEY is not set in environment or .env file.");
  console.error("Provide NEBIUS_API_KEY to test live model connectivity.");
  process.exit(1);
}

const { baseUrl, pipelineModelId, feedbackModelId } = nebiusConfig();
console.log(`\n======================================================`);
console.log(`🔍 NEBIUS TOKEN FACTORY DUAL-MODEL PROBE`);
console.log(`Endpoint: ${baseUrl}/chat/completions`);
console.log(`Key:      ${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`);
console.log(`======================================================\n`);

async function testModel(label, modelId) {
  console.log(`Testing ${label}: ${modelId}...`);
  const started = performance.now();
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: "Reply with the single word OK." }],
        max_tokens: 20,
        temperature: 0.1,
      }),
    });

    const elapsed = ((performance.now() - started) / 1000).toFixed(2);
    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ ${label} (${modelId}) failed with HTTP ${res.status}: ${err}`);
      return false;
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    console.log(`✅ ${label} responded in ${elapsed}s: "${reply}"`);
    console.log(`   Tokens: prompt=${data.usage?.prompt_tokens}, completion=${data.usage?.completion_tokens}\n`);
    return true;
  } catch (err) {
    console.error(`❌ ${label} network error:`, err.message);
    return false;
  }
}

async function run() {
  const p1 = await testModel("Subsystem 1 (Quest Pipeline - Ultra)", pipelineModelId);
  const p2 = await testModel("Subsystem 2 (Reasoning Coach - 70B)", feedbackModelId);

  if (p1 && p2) {
    console.log(`🎉 Both NVIDIA Nemotron models are online and verified on Nebius Token Factory!\n`);
  } else {
    process.exit(1);
  }
}

run();
