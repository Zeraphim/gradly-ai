import express from "express";
import { researchRouter } from "./research/router.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { publicLesson } from "./lesson.js";
import {
  createFeedbackService,
  ServiceError,
  type Provider,
} from "./feedback.js";
export function createApp(
  options: {
    provider?: Provider;
    preview?: boolean;
    webRoot?: string;
    serveStatic?: boolean;
    trustProxy?: number;
  } = {},
) {
  const app = express();
  app.disable("x-powered-by");
  if (options.trustProxy !== undefined)
    app.set("trust proxy", options.trustProxy);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "upgrade-insecure-requests": null,
          "frame-src": ["'self'", "blob:"],
        },
      },
    }),
  );
  app.use(express.json({ limit: "12kb", strict: true }));
  app.use("/api/research", researchRouter());
  const mode = options.preview
    ? "preview"
    : options.provider
      ? "nebius"
      : "unconfigured";
  const feedback = createFeedbackService(options.provider, options.preview);
  app.get("/api/health", (_req, res) =>
    res.json({ status: "ok", feedback: mode }),
  );
  app.get("/api/lesson", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(publicLesson(mode));
  });
  app.post(
    "/api/feedback",
    rateLimit({
      windowMs: 15 * 60_000,
      limit: 20,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      handler: (_req, res) =>
        res.status(429).json({
          error: {
            code: "rate_limit",
            message:
              "You have reached the feedback limit. Your answer is saved. Try again in 15 minutes.",
            retryable: true,
          },
        }),
    }),
    async (req, res, next) => {
      try {
        res.set("Cache-Control", "no-store");
        res.json(await feedback(req.body));
      } catch (error) {
        next(error);
      }
    },
  );
  app.use("/api", (_req, res) =>
    res.status(404).json({
      error: {
        code: "not_found",
        message: "This lesson route does not exist.",
        retryable: false,
      },
    }),
  );
  const webRoot = options.webRoot ?? resolve(process.cwd(), "apps/web/dist");
  if (options.serveStatic !== false && existsSync(webRoot)) {
    app.use(express.static(webRoot));
    app.get("/{*path}", (_req, res) =>
      res.sendFile(resolve(webRoot, "index.html")),
    );
  }
  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (error instanceof ServiceError) {
        res.status(error.status).json({
          error: {
            code: error.code,
            message: error.message,
            retryable: error.retryable,
          },
        });
        return;
      }
      const bodyError = error as { type?: string };
      if (
        bodyError?.type === "entity.too.large" ||
        bodyError?.type === "entity.parse.failed"
      ) {
        res.status(400).json({
          error: {
            code: "invalid_request",
            message: "The request is too large or contains invalid data.",
            retryable: false,
          },
        });
        return;
      }
      res.status(500).json({
        error: {
          code: "service_error",
          message:
            "Feedback could not complete. Your answer is saved. Try again.",
          retryable: true,
        },
      });
    },
  );
  return app;
}
