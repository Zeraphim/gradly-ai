import { spawn } from "node:child_process";
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
    { stdio: "inherit" },
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
