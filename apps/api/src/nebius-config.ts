export const DEFAULT_MODEL = "nvidia/Nemotron-3-Ultra-550b-a55b";
export const DEFAULT_BASE_URL =
  "https://api.tokenfactory.us-central1.nebius.com/v1";
export function nebiusConfig() {
  return {
    modelId: process.env.NEBIUS_MODEL_ID?.trim() || DEFAULT_MODEL,
    baseUrl: (process.env.NEBIUS_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(
      /\/$/,
      "",
    ),
  };
}
