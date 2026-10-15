import { Router, type Request, type Response } from "express";
import { requestContext, researchAvailable } from "./auth.js";
import * as config from "./routes/config.js";
import * as learning from "./routes/learning.js";
import * as documents from "./routes/documents.js";
import * as jobs from "./routes/jobs.js";
import * as feedback from "./routes/feedback.js";
import * as maintenance from "./routes/maintenance.js";
type Handler = (request: globalThis.Request) => Promise<globalThis.Response>;
async function adapt(req: Request, res: Response, handler: Handler) {
  try {
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(name, value);
    }
    let body: BodyInit | undefined;
    if (!["GET", "HEAD"].includes(req.method)) {
      if (req.is("application/json")) body = JSON.stringify(req.body);
      else {
        const chunks: Buffer[] = [];
        let size = 0;
        for await (const chunk of req) {
          const bytes = Buffer.from(chunk);
          size += bytes.length;
          if (size > 4050000) throw Error("Upload exceeds the allowed size.");
          chunks.push(bytes);
        }
        body = new Uint8Array(Buffer.concat(chunks));
      }
    }
    const request = new globalThis.Request(
      `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      { method: req.method, headers, ...(body === undefined ? {} : { body }) },
    );
    const result = await requestContext.run(
      { request: req, response: res },
      () => handler(request),
    );
    res.status(result.status);
    result.headers.forEach((value, name) => res.set(name, value));
    res.set("Cache-Control", "no-store");
    res.send(Buffer.from(await result.arrayBuffer()));
  } catch {
    res
      .status(400)
      .json({
        error:
          "This research request could not be processed. Check the file or request size and retry.",
      });
  }
}
export function researchRouter() {
  const router = Router();
  router.get("/config", (req, res) => void adapt(req, res, config.GET));
  router.use((req, res, next) => {
    if (!researchAvailable()) {
      res
        .status(503)
        .json({
          error:
            "The research extension is not configured. Use the curated adventure, or configure RESEARCH_ENABLED, DATABASE_URL, DATABASE_AUTH_TOKEN and SESSION_SECRET.",
        });
      return;
    }
    next();
  });
  const modules: Record<
    string,
    { GET?: Handler; POST?: Handler; DELETE?: Handler }
  > = { learning, documents, jobs, feedback, maintenance };
  for (const [path, module] of Object.entries(modules)) {
    if (module.GET)
      router.get("/" + path, (req, res) => void adapt(req, res, module.GET!));
    if (module.POST)
      router.post("/" + path, (req, res) => void adapt(req, res, module.POST!));
    if (module.DELETE)
      router.delete(
        "/" + path,
        (req, res) => void adapt(req, res, module.DELETE!),
      );
  }
  return router;
}
