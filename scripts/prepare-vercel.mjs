import { cp, rm } from "node:fs/promises";
// The public directory is generated exclusively for Vercel's static hosting.
await rm(new URL("../public/", import.meta.url), {
  recursive: true,
  force: true,
});
await cp(
  new URL("../apps/web/dist/", import.meta.url),
  new URL("../public/", import.meta.url),
  { recursive: true },
);
