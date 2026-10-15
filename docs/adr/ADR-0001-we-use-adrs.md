# ADR-0001: We Use ADRs

## Date

2026/10/15

## Status

Proposed

## Decision Owners

- Unassigned; maintainer acceptance has not been recorded

## Affected Scope

- Repository-wide architecture and technical decisions

## Context

The repository needs a durable, reviewable record of significant technical decisions so future
contributors can recover why a choice was made, which alternatives were rejected, and when a
decision was superseded.

## Decision

Record significant architecture and technical decisions as Markdown ADRs in `docs/adr/`, using the
repository template and explicit lifecycle.

## Rationale

Keeping decisions beside the code makes them searchable, reviewable, and available to developers
and agents without relying on chat history, a separate wiki, or commit archaeology.

## Alternatives Considered

| Option             | Why Rejected                                                  |
| ------------------ | ------------------------------------------------------------- |
| Pull requests only | Decisions become scattered and difficult to recover           |
| External wiki      | Adds another system whose state can drift from the repository |
| Inline comments    | Cannot capture system-wide context and alternatives cleanly   |

## Consequences

### Positive

- Decision history remains close to implementation.
- Reviewers can evaluate tradeoffs consistently.
- Supersession preserves historical reasoning.

### Negative / Accepted Tradeoffs

- Significant decisions require a small documentation cost.

### Risks

- Unmaintained or silently edited ADRs can mislead future work.

## Supersession

- Supersedes: None
- Superseded by: None

## References

- `.agents/context-manifest.json`
- `docs/adr/TEMPLATE.md`
