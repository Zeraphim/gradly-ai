export class ResearchRequestError extends Error {
  constructor(
    message: string,
    public readonly status = 0,
  ) {
    super(message);
    this.name = "ResearchRequestError";
  }
}

export async function api<T>(
  path: string,
  body?: unknown,
  method = "POST",
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      cache: "no-store",
      signal,
      ...(body === undefined
        ? {}
        : {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ResearchRequestError(
      "We couldn’t connect to Gradly. Check your connection and try again. If you were saving a decision, reload saved state first.",
    );
  }
  let data: T & { error?: string };
  try {
    data = await response.json();
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ResearchRequestError(
      "Gradly’s response was interrupted. Try again, or reload your saved state if you were saving a decision.",
      response.status,
    );
  }
  if (!response.ok)
    throw new ResearchRequestError(
      typeof data?.error === "string"
        ? data.error
        : "That request couldn’t be completed. Please try again.",
      response.status,
    );
  return data;
}
