import express from "express";
import { createApp } from "./apps/api/src/app.js";
import { nebiusProvider } from "./apps/api/src/feedback.js";

const app = express();
const key = process.env.NEBIUS_API_KEY;
const preview = process.env.PREVIEW_MODE === "true";
app.disable("x-powered-by");
app.use(
  createApp({
    provider: key && !preview ? nebiusProvider(key) : undefined,
    preview,
    serveStatic: false,
    trustProxy: 1,
  }),
);
export default app;
