export const DEFAULT_PIPELINE_MODEL = "nvidia/Nemotron-3-Ultra-550b-a55b";
export const DEFAULT_FEEDBACK_MODEL = "nvidia/Llama-3.1-Nemotron-70B-Instruct";
export const DEFAULT_MODEL = DEFAULT_PIPELINE_MODEL;
export const DEFAULT_BASE_URL =
  "https://api.tokenfactory.us-central1.nebius.com/v1";
export function nebiusConfig() {
  const generic = process.env.NEBIUS_MODEL_ID?.trim();
  const pipelineModelId =
    process.env.NEBIUS_PIPELINE_MODEL?.trim() || generic || DEFAULT_PIPELINE_MODEL;
  const feedbackModelId =
    process.env.NEBIUS_FEEDBACK_MODEL?.trim() || generic || DEFAULT_FEEDBACK_MODEL;
  return {
    modelId: pipelineModelId,
    pipelineModelId,
    feedbackModelId,
    baseUrl: (process.env.NEBIUS_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(
      /\/$/,
      "",
    ),
  };
}
