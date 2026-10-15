import { spawn } from "node:child_process";
const preview = process.argv.includes("--preview");
const env = preview
  ? {
      ...process.env,
      PREVIEW_MODE: "true",
      DEMO_MODE: "true",
      RESEARCH_ENABLED: "true",
      NEBIUS_API_KEY: "",
      DATABASE_URL: "file:.data/gradly.db",
      DATABASE_AUTH_TOKEN: "",
      HOST: "127.0.0.1",
      PORT: "3001",
    }
  : process.env;
const processes = ["@paperquest/api", "@paperquest/web"].map((workspace) =>
  spawn(
    "npm",
    [
      "run",
      workspace === "@paperquest/api" && process.argv.includes("--test")
        ? "dev:test"
        : "dev",
      "--workspace",
      workspace,
    ],
    { stdio: "inherit", env },
  ),
);
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of processes) child.kill("SIGTERM");
  process.exitCode = code;
}
for (const child of processes) child.on("exit", (code) => stop(code ?? 0));
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
