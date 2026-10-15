import express from "express";
import { resolve } from "node:path";
import { createApp } from "./apps/api/src/app.js";
import { nebiusProvider } from "./apps/api/src/feedback.js";

export const config = { maxDuration: 240 };

const app = express();
const key = process.env.NEBIUS_API_KEY;
const preview = process.env.PREVIEW_MODE === "true";
app.disable("x-powered-by");
app.get("/", (_request, response) => {
  response.set("Cache-Control", "no-store");
  response.sendFile(resolve(process.cwd(), "public/index.html"));
});
app.use(
  createApp({
    provider: key && !preview ? nebiusProvider(key) : undefined,
    preview,
    serveStatic: false,
    trustProxy: 1,
  }),
);
export default app;
