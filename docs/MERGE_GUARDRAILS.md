# Merge verification guardrails

This runbook records failure patterns and the checks agents should select before
recommending a merge and after integrating it. The rules apply to future changes,
regardless of author. They are agent procedures, not newly installed automated
checks or branch protection. No merge, deployment, hosted setting change or browser
permission is granted by this document.

## Review scope and evidence

Reviewed on 2026-10-16 against local `219efda`: the merged upload-first integration
[pull request 2](https://github.com/Zeraphim/nebius-hackathon-submission/pull/2), its
superseded [pull request 1](https://github.com/Zeraphim/nebius-hackathon-submission/pull/1),
the three subsequent delivery fixes, current entrypoints/build configuration and
existing tests. The production-error report supplied during troubleshooting included
missing canvas/DOMMatrix startup failures, stylesheet requests returning HTML and
missing JavaScript. Those were separate failure classes, not one MIME-header fix.
Raw private logs are not copied into this repository.

At review time, open [pull request 10](https://github.com/Zeraphim/nebius-hackathon-submission/pull/10)
at head `f2a443b` was also inspected for related frontend changes. Its diffs address viewport height,
refresh loading presentation, mascot clipping and inherited speech-tail styles.
These are author-described fixes supported by source diffs, not independently
reproduced browser failures in this review. Its code is not part of local `219efda`.
No pull request was merged or deployed during this guardrail review.

| Evidence                                                                                                                                                     | What is established                                                                                                                                                     | Future guardrail                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E1: [declaration fix e908ca2](https://github.com/Zeraphim/nebius-hackathon-submission/commit/e908ca2adb2fabd60887af93bdba100f98baed37)                       | Adds an explicit reference from `ocr.ts` to the local language-package declaration. The historical raw compiler log is unavailable in this review.                      | Check the actual hosted entrypoint compilation graph; root type-check inclusion alone does not establish declaration discovery by the function builder.                                                               |
| E2: [canvas fix b2b4504](https://github.com/Zeraphim/nebius-hackathon-submission/commit/b2b450484bc97a1bb1fedc79a506d437ef1fb32e) and reported startup log   | The function could not load `@napi-rs/canvas`, then failed on missing `DOMMatrix`. The patch explicitly includes canvas and native platform packages.                   | Inspect transitive startup dependencies and packaged native/worker files. Verify cold startup before attempting an upload. Local native packages do not prove hosted compatibility.                                   |
| E3: [asset fix c966340](https://github.com/Zeraphim/nebius-hackathon-submission/commit/c9663404d065a308f072c5160a277fa0da85767a) and reported browser errors | Adds the Vercel build hook, explicit static/server builders, filesystem-first routing and an entrypoint duration setting.                                               | Build from clean source, inspect emitted artifacts, then request the asset paths actually referenced by served HTML. Never mask HTML fallback with a stylesheet content-type header.                                  |
| E4: [preview access comment on request 2](https://github.com/Zeraphim/nebius-hackathon-submission/pull/2#issuecomment-6193300861)                            | Vercel reports that the commit author lacks team membership. The separate preview-comment check succeeded. Request 10 shows the same access restriction at review time. | Classify access as an unavailable deployment check. Do not turn a green comment check or local build into hosted verification.                                                                                        |
| E5: [request 1 supersession comment](https://github.com/Zeraphim/nebius-hackathon-submission/pull/1#issuecomment-6193302447)                                 | Request 1 was explicitly replaced by request 2, which removes the superseded standalone paper-case path.                                                                | Review against current target intent. Preserve retired-link recovery without resurrecting removed screens or treating the closed request as a rejected feature.                                                       |
| E6: [request 10 files](https://github.com/Zeraphim/nebius-hackathon-submission/pull/10/files)                                                                | Shared shell/loading changes span original and research screens. Local styles had leaked into mascot/speech treatments according to the patches.                        | Inspect every consumer of global styles and shared shells. Include pseudo-elements, loading states, scrolling and narrow controls in rendering checks. Keep screenshot output inside the test run's output directory. |

The gap demonstrated by E1–E4 is between local validation and the actual hosted
artifact/runtime. Request 2 reports successful local type, test, browser and packaging
checks while explicitly leaving hosted extraction/storage and live inference open.
Those reports do not establish that the later production artifact worked. The fixes
establish what changed, not retrospective proof of every historical deployment.

## Before merge: choose checks from the diff

Record the candidate and target revisions. For overlapping integration changes,
verify their combined result in an isolated checkout where practical. Preserve the
working tree. Do not create a remote merge, rebase others' work or resolve conflicts
as a side effect of review. A later base/head update invalidates affected evidence.

| Changed area                                                                            | Required applicable checks                                                                                                                                                                                    | Limit of the evidence                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instructions, skills, documentation only                                                | Validate changed skills; check relative links; format changed files; regenerate `npm run context:index`; run `npm run context:check` and `git diff --check`.                                                  | No application runtime or hosted claim follows from documentation checks. Review context warnings rather than hiding them with an acknowledgement.                                                                                                          |
| Application source or runtime contracts                                                 | Run `npm run check` from the application root and inspect relevant existing regression coverage.                                                                                                              | This command includes type checks, Node/research tests and production builds. It excludes browser, live-service and full hosted packaging checks.                                                                                                           |
| Lockfile/dependencies, hosted startup imports, shared exports, build scripts or routing | From an exact, clean source revision, install with `npm ci`, run the applicable source checks and `npm run vercel-build`; inspect the actual Vercel builder output when accessible. Follow `vercel-delivery`. | Asset preparation alone does not establish function bundling, native-platform compatibility, startup or hosted delivery.                                                                                                                                    |
| Shared styles, viewport shell, route/loading boundaries or interaction primitives       | Inspect all consumers and choose existing affected browser suites from TESTING.md. Include short/tall/narrow sizes, expanded/error content, focus, live reduced motion and delayed loading where relevant.    | Source and simulated-document tests cannot establish perceived smoothness or responsive geometry. Browser execution requires current authorization. Request 10's new viewport suite is not present in `219efda`; check the candidate before naming a suite. |
| Extraction, storage, generation or assessment                                           | Select the affected service/research fixtures plus configured hosted checks for changed host-dependent behavior, following RESEARCH_INTEGRATION.md.                                                           | Synthetic documents, provider fixtures, authored scenes and configuration-presence flags do not prove hosted extraction, real persistence or live generation quality.                                                                                       |

Clean source means no carried-over `public/`, workspace `dist/`, dependencies,
deployment output, ignored environment files or local database. Use an isolated
checkout/archive of the exact revision and only its tracked inputs. Do not remove
those directories from the user's working checkout or reuse its environment values.
The emitted shared-package exports must exist before dependents run.

## Packaging and hosted evidence

The [vercel-delivery skill](../.agents/skills/vercel-delivery/SKILL.md) owns current
builder details. Verify the chain from root build hook to generated frontend files,
static collection, function bundle and filesystem-first routing. Check that the
entrypoint compiler sees ambient declarations and runtime exports and that the
function includes extraction workers, language data and host-compatible native files.
Preserve the current timeout contract unless an intentionally verified change replaces it.

When hosted verification is authorized and available, match the deployment to the
tested revision/environment, then check a cold start, `/api/health`, homepage and
its referenced stylesheet, script and affected lazy-loaded assets. Check successful
status, content type and expected content. A homepage may return successfully while
its assets fail. A healthy endpoint does not prove the storage/model operations.

If a preview is blocked by account access, report it as unverified and continue
independent local checks. Do not bypass it by altering authorship, repository
visibility, billing or team access. The current hosted-verification handoff is
specified in [issue 4](https://github.com/Zeraphim/nebius-hackathon-submission/issues/4)
and [issue 9](https://github.com/Zeraphim/nebius-hackathon-submission/issues/9).
An authorized operator can supply the exact preview/revision and redacted diagnostics
without every contributor obtaining deployment access. Verify current ownership
when using those issue-specific arrangements; do not generalize them to all projects.

## After an authorized merge or sync

Compare the resulting revision and changed paths with the tested candidate. Rerun
checks affected by the integration result, including packaging when its inputs or
startup graph changed. Do not treat source checks on an old head as proof for a new
merge. Match any deployment and runtime logs to the resulting revision and environment.

Keep assessment reveals and points server-controlled, failures recoverable, drafts
bound to their version/challenge and late responses unable to overwrite newer work.
Use the existing regressions rather than introducing parallel progress or fallback
systems. These are current product invariants, not additional failures attributed
to the reviewed author.

## Evidence handoff

Report a compact table with:

| Field            | Required content                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| Revision         | Target/base, candidate and tested integration revision, plus resulting merge revision if a merge was authorized    |
| Local checks     | Exact commands, outcomes and affected behavior; identify clean-source checks                                       |
| Artifact/runtime | Which builder, static assets, declarations, native packages and startup paths were actually inspected or exercised |
| Hosted checks    | Deployment/revision/environment and observed requests, or the access/configuration reason they remain unverified   |
| Gaps             | Failed/missing applicable checks, their impact and what evidence would resolve them                                |

Do not recommend a merge as verified while required applicable checks fail or remain
missing. Merging with disclosed gaps requires explicit user direction. A completed
review or commit does not imply deployment, live-service success or browser approval.
Do not copy raw private logs, real configuration values or learner documents into
this record. No continuous-integration workflow or branch policy was added here.
