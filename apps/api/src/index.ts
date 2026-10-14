import { createApp } from "./app.js";
import { nebiusProvider } from "./feedback.js";
const key = process.env.NEBIUS_API_KEY;
const preview = process.env.PREVIEW_MODE === "true";
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "127.0.0.1";
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT must be a valid port number");
const app = createApp({
  provider: key && !preview ? nebiusProvider(key) : undefined,
  preview,
});
const server = app.listen(port, host, () =>
  console.log(
    `Gradly server: http://${host}:${port} (${preview ? "explicit local preview" : key ? "Nebius feedback" : "feedback unconfigured"})`,
  ),
);
function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
