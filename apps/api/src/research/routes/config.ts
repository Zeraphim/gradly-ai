import { uploadLimit } from "../limits.js";
import { researchAvailable } from "../auth.js";
import { nebiusConfig } from "../../nebius-config.js";
export async function GET() {
  return Response.json({
    liveAI: !!process.env.NEBIUS_API_KEY && process.env.PREVIEW_MODE !== "true",
    maxUploadBytes: uploadLimit(),
    storage: researchAvailable(),
    model: nebiusConfig().modelId,
  });
}
