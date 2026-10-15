---
name: vercel-delivery
description: >-
  Diagnose or verify Gradly Vercel delivery, including generated frontend assets,
  server-function dependencies, runtime failures, and deployment evidence. Use for
  changes to build scripts, vercel.json, server.ts, extraction/OCR packaging, or hosting.
---

# Vercel delivery

Read `vercel.json`, `server.ts`, root package scripts, and
`docs/RESEARCH_INTEGRATION.md` before changing packaging. Documentation contains
dated integration reports; verify the current target's commit and configuration.
Use the application root and the teammate's own authorized project link. Do not
hard-code a personal account, filesystem path, token, or temporary deployment URL.

## Current packaging contract

- The package `vercel-build` script calls `build:vercel`, which builds shared
  contracts and the frontend and copies its output into generated `public/`.
- An explicit `@vercel/static-build` entry collects `public/` after generation.
  `@vercel/node` bundles `server.ts`. Filesystem routing precedes the server fallback.
  A clean checkout has no generated public directory; existing local assets must
  not be required for a successful deployment.
- The server exports a 240-second function limit. Keep this limit, the compiled
  shared-contract exports, and the OCR declaration reference in the import graph
  when changing the hosted entrypoint.
- Explicit inclusion keeps Tesseract workers/core/language data, `@napi-rs/canvas`,
  and its platform-specific native package in the function bundle. Local macOS
  binaries do not establish Linux runtime compatibility. Preserve native dependency
  inclusion until a replacement is verified on the actual host.

## Diagnose and verify

1. Match request logs to the deployment identifier and commit. Distinguish build,
   startup, application-route, and static-file failures. Old logs do not prove the
   current deployment still has the same error.
2. For build/asset changes, use a clean source snapshot without prior `public/`,
   workspace build output, dependencies, or deployment output. Install from the
   lockfile and run the actual Vercel build when the task/environment allows it.
   `npm run build:vercel` alone does not verify the complete function package.
3. Inspect generated static paths against the served HTML and the function manifest
   for required workers/native packages and timeout. Do not publish host-native
   prebuilt binaries to a different host architecture as a substitute for testing.
4. When deployment is authorized, prefer a preview for verification. Request the
   homepage, referenced stylesheet and script, relevant lazy-loaded assets, and
   `/api/health`. Confirm status codes, content types, and expected contents. A 200
   homepage may still contain a broken frontend. Inspect scoped runtime logs.
5. Hosted research needs separate checks for database/guest isolation, searchable
   and scanned extraction, consent, generation, recovery, history, and deletion.
   Successful asset/health checks do not establish those flows or model quality.

Keep environment values private. Use sample/provider fixtures for ordinary checks;
actual model calls require the intended configuration and task scope. An unavailable
preview because of project membership is an access failure, not proof of build
correctness. Report unresolved checks and distinguish local, preview, and production
states. This skill does not itself authorize publishing or deploying.
