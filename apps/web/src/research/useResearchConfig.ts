import { useEffect, useState } from "react";
import { api } from "./request.js";
import type { ResearchConfig } from "./types.js";

export function useResearchConfig(enabled = true) {
  const [config, setConfig] = useState<ResearchConfig | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    setError("");
    api<ResearchConfig>(
      "/api/research/config",
      undefined,
      "GET",
      controller.signal,
    )
      .then((result) => {
        if (!controller.signal.aborted) setConfig(result);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "Application settings couldn’t be loaded. Try reloading saved state.",
          );
      });
    return () => controller.abort();
  }, [attempt, enabled]);
  return { config, error, retry: () => setAttempt((value) => value + 1) };
}

export type ResearchConfiguration = ReturnType<typeof useResearchConfig>;
