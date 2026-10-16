---
name: merge-verification
description: >-
  Review Gradly pull-request readiness and verify integration after an authorized
  merge or sync. Use before recommending or performing a merge, and after pull,
  rebase or merge changes the integration revision. Select checks from the actual
  diff, including hosted packaging and cross-screen regressions.
---

# Gradly merge verification

Read [MERGE_GUARDRAILS.md](../../../docs/MERGE_GUARDRAILS.md) for the evidence-backed
check matrix and failure history. This skill prepares and verifies a merge; it does
not authorize merging, pushing, deploying, changing hosted settings or browser use.
Follow current task scope and applicable repository instructions.

## Establish the candidate

- Identify the repository, target branch, pull request, base/head revisions, changed
  paths, current worktree and check results. Read discussions and follow-up fixes.
  A successful comment-publication check is not a successful deployment.
- Preserve uncommitted work. Test a reviewable integration of the candidate with
  the target's current changes when available; branch-only results do not establish
  that result. Use an isolated checkout if needed, without modifying the user's
  branch. Do not perform an unrequested merge or silently resolve conflicts.
- Separate observed failures from suspected causes and open verification tasks.
  Match logs to a revision/deployment before attributing a regression. Do not treat
  an access restriction as a compiler, dependency or application failure.

## Select and run the checks

- Use the runbook matrix. Source changes need `npm run check`; documentation-only
  changes need context, links, formatting and skill validation where applicable.
  Choose focused regression coverage for the affected behavior as well.
- Load [vercel-delivery](../vercel-delivery/SKILL.md) for dependency/lockfile changes,
  server startup imports, shared runtime exports, document extraction, build scripts
  or hosted routing. Verify clean artifact preparation and the actual builder/package
  separately from ordinary production compilation. Inspect transitive import changes,
  not only edits to hosting configuration.
- For shared frontend styles, shell, loading or route changes, inspect all affected
  consumers, loading/error/expanded states, short/tall/narrow viewports and scrolling.
  Reuse [gradly-motion](../gradly-motion/SKILL.md) for changed interactions. Run affected
  browser checks only when authorized; otherwise identify the outstanding visual
  checks without claiming source or simulated-document tests establish rendering.
- Preserve existing sample/live distinctions, server-derived points, reveal gates,
  guest ownership and stale-response protection. Select their regressions when the
  diff reaches those paths. A configuration flag is not a successful service call.

## Decide and reverify

Do not present an affected merge as verified while a required applicable check is
failing or missing. Report the exact gap and its impact. Do not carry out a merge
with those gaps unless the user explicitly directs it after the gaps are disclosed.
An access-blocked preview remains unverified; local checks can continue without
changing team membership, billing, project visibility or commit authorship.

After an authorized merge/sync, compare the resulting revision with the tested one.
Rerun the affected checks when the integration result changed. Associate any hosted
checks with that exact deployed revision and the intended environment. Use the
runbook's compact evidence handoff: revision, commands/results, artifact/runtime
coverage, hosted status and remaining gaps. Keep secrets and private logs out.

Maintain this skill and the canonical runbook when the packaging contract, check
commands or evidence changes. Update the context registry/index with those changes.
