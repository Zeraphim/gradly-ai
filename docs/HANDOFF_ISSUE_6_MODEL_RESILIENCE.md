# Handoff: Nebius model tiering, typed stage errors, and the stage-1 500 investigation

Date: 2026-10-25 · Branch: `feat/issue-6-scene-pipeline` (uncommitted at time of writing)

> Superseded by [HANDOFF_JAN_BACKEND.md](HANDOFF_JAN_BACKEND.md). The stage-1 500 below was the `propertyNames` keyword and is resolved; this record is kept as history.

## Context

Users reported "The AI response was incomplete because it reached the
32000-token output limit" during lesson generation. Investigation found the
pipeline default model (`Nemotron-3-Ultra-550b-a55b`) burning most of its
`max_tokens` budget on reasoning tokens (measured live: 1,994 of 2,317
completion tokens on a 7-page stage-0 pass), with stage 1's full-lesson
output overflowing the 32k cap on dense papers. No live evaluation data
favored Ultra as default.

## Shipped changes (all local, uncommitted)

### A1 — Default pipeline model switched to super-120b

- `apps/api/src/nebius-config.ts`: `DEFAULT_PIPELINE_MODEL` is now
  `nvidia/nemotron-3-super-120b-a12b`; Ultra-550b remains available through
  `NEBIUS_PIPELINE_MODEL`.
- **Budget tiers follow the caller slot, not the model name.** The old
  `isUltra` name-sniff would have silently dropped pipeline stages to the
  8k/45s feedback tier after the default switch. `provider.ts` now takes
  `{ tier: "pipeline" | "feedback" }`; pipeline stages (`pipeline.ts`) get
  32k tokens/110s timeout, the reasoning-feedback route gets 8k/45s.
  Default tier is `feedback`.

### A2 — Typed errorCode on stage records

- `contracts.ts`: `Audit.errorCode?: "output_limit" | "timeout"`.
- `provider.ts`: new `ProviderError extends Error` carrying the code; the
  output-limit and timeout branches throw it (user-facing messages
  unchanged).
- `pipeline.ts`: catch block persists `audit.errorCode`; success and demo
  completion clear it. `publicJob` passes audits through, so the API payload
  and the frontend's derived `ProcessingJob` type carry the code with no UI
  changes.

### A3 — Incident telemetry

- `warnWithUsage` in `provider.ts` logs model, role, tier,
  `completion_tokens`, and `reasoning_tokens` (when reported) on the
  output-limit branch; the timeout branch logs model/role/tier/timeout. All
  response-body reads use `in`-narrowing, no unchecked casts.
- Terminal HTTP failures now log the upstream error body (first 300 chars)
  server-side via `console.warn`; the user-facing message stays generic.

### Empty-findings guard

- Live super-120b runs returned `findings: ""` (Zod permits it; the narration
  guard didn't match it). `pipeline.ts` stage 0 now replaces empty/whitespace
  or narrated findings with the neutral fallback. An earlier
  mid-sentence-truncation heuristic was added and then removed after an
  existing test correctly rejected it ("Evidence recovered" is legitimate
  summary text).

### Diagnostics

- `scripts/diagnose-nebius.ts` now runs stage 0 then stage 1 with the same
  wrapped fetch, and on stage-1 failure fires a schema-feature isolation
  ladder: full lesson schema (control), without scenes, without `record`
  (misconceptions), without unions/enums. First rung that stops 500ing names
  the culprit feature family. `npm run diagnose:nebius`.

### Tests and docs

- `tests/research/provider.test.ts`: typed code + usage logging on length;
  slot-based `max_tokens` (32000 pipeline / 8000 feedback) and default
  model. Mock fixes: single-rejection promise reuse (Response bodies are
  single-use) and `mockImplementation` for fresh `Response` per call.
- `tests/research/pipeline.test.ts`: `errorCode` persists on output-limit
  failure and clears on recovery; empty findings get the fallback.
- `.env.example`, `README.md`, `docs/ARCHITECTURE.md`,
  `docs/RESEARCH_INTEGRATION.md` updated for the new default, tiers, and
  error codes.
- Frontend untouched; no files under `apps/web/` changed.

## Live verification recorded this session

| Check | Result |
|---|---|
| Key access to super-120b (`/v1/models`) | listed (18 models; also Ultra, Nano, Lightning) |
| Stage 0 (Evidence Analyst) on super-120b | passes twice; refs verified, `finish_reason: stop` |
| Stage 0 reasoning burn | ~86% / ~70% of completion tokens were reasoning |
| Stage 0 findings | `""` on both runs → guard now replaces it |
| Stage 1 (Lesson Architect) on super-120b | **HTTP 500 twice** (auto-retried), `InternalServerError` with empty gateway message, both
failures <1s |

## Open blocker: the stage-1 500

Stage 1 500s on super-120b while stage 0 on the same key/model/pages passes.
Both 500s failed before generation started (<1s), pointing at request-shape
handling rather than generation content. Leading hypothesis [INFERENCE]:
super-120b's structured-output compiler crashes on a feature of the stage-1
lesson schema (scene discriminated union, `record`, or enum/union handling)
that Ultra-550b demonstrably accepted (Ultra generated lessons against this
schema historically).

### Deciding input (not yet run)

1. `npm run test:research` and `npm run typecheck` — no green run recorded
   after the latest test fixes.
2. `npm run diagnose:nebius` — fires the isolation ladder after the stage-1
   failure; the first OK rung names the culprit schema feature.
3. Control: `NEBIUS_PIPELINE_MODEL=nvidia/Nemotron-3-Ultra-550b-a55b npm run
   diagnose:nebius` — if Ultra passes stage 1 with the identical schema,
   that is the evaluation data A1 asked for and justifies reverting the
   pipeline default to Ultra (the tier mechanism makes model choice
   orthogonal to budget sizing).

### Decision tree after the ladder

| Result | Fix |
|---|---|
| Control 500s; "without scenes" OK | Flatten/simplify the scene union for the request schema |
| "without record" OK | Replace `misconceptions` map with an array-of-pairs shape |
| "without unions" OK only | Inline literals instead of `enum` |
| Everything 500s | Not schema-shaped; compare Ultra control run; consider capacity/gateway fault |

## Known-not-fixed (deliberately deferred)

- Stage-1 prompt still allows 3–14 challenges with no field-length caps;
  dense papers can still legitimately hit the 32k limit on whichever model
  runs. Scoped fixes (not shipped): challenge-count cap (3–8), terse-field
  directive, retry-on-length with a conciseness addendum.
- The manual "Retry this stage" button resends the same request; a length
  cut is near-deterministic on retry.
- `HANDOFF_ISSUE_1.md` still documents Ultra-550b as the default; update
  after the model question is settled.
- Frontend does not yet consume `errorCode`; `FailureRecovery.tsx` has its
  own separate proposed reason taxonomy.

## Commands

| Purpose | Command |
|---|---|
| Research tests | `npm run test:research` |
| Type check | `npm run typecheck` |
| Live stage 0+1 probe + schema ladder | `npm run diagnose:nebius` |
| Ultra control run | `NEBIUS_PIPELINE_MODEL=nvidia/Nemotron-3-Ultra-550b-a55b npm run diagnose:nebius` |
| Full source validation | `npm run check` |
| Context registry | `npm run context:index` then `npm run context:check` |

Everything above is uncommitted on `feat/issue-6-scene-pipeline`. Conventional
commit subject, no co-author line, per repo rules. Do not commit `.env` (it
now contains a real key) or `.data/` local databases.
