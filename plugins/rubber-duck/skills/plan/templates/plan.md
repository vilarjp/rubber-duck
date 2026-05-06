---
title: Short Human Title
slug: short-slug
type: plan
status: pending-approval
created: yyyy-mm-dd
updated: yyyy-mm-dd
source: prompt
---

Status: pending-approval

# Short Human Title

## Summary

One short paragraph with the technical change, user-visible outcome, and implementation style.

## Source Context

- Source of truth: prompt, Jira issue, PRD path, or approved artifact.
- Key requirements, constraints, and non-goals.

## Design Discussion

- Chat alignment status: completed | skipped because simple | pending.
- Aligned direction: simplest viable design and why.
- Rejected heavier option: what was avoided and why.
- Human answers that changed direction, if any.

## PRD Alignment

- For PRD-backed plans, map goals and acceptance criteria to vertical slices, tests, or explicit out-of-scope rationale.
- Write `Not applicable` when the source is not a PRD.

## Current System Notes

- Confirmed files, modules, tests, commands, data flows, and conventions that shape the work.
- External behavior verified from repository evidence or authoritative docs when relevant.
- Assumptions: list separately or write `None`.

## Proposed Approach

- Smallest correct implementation path.
- Important decisions and tradeoffs.
- Root-cause path for bug fixes. Temporary workarounds must be constrained and tracked.

## Contract / Interface Definition

- New or changed contract/interface, if any.
- Existing stable contract this work consumes.
- Compatibility, migration, or deprecation notes.
- Write `No contract change; implementation consumes the existing <surface> contract` when no boundary changes.

## Implementation Surface

- Write targets:
- Read-only context:
- Tests and verification:
- Generated artifacts:
- No-touch boundaries:
- Parallel or merge-risk notes:

## Implementation Strategy

- Complexity: simple | medium | complex.
- Recommended execution: single focused pass | incremental task-by-task | parallel implementation-agent/test-implementer delegation.
- Rationale: why this mode is safer or faster for this work.
- Orchestration: `/rubber-duck:implement` or `/rubber-duck:orchestrate-implementation`.
- Parallel safety: name safe groups or write `Sequential only`.
- Integration checkpoint: what must be reconciled before dependent work begins.

## Decision Notes

- Complex plans only. Capture decisions that future maintainers must understand.
- Shape:
  - Decision: chosen approach.
  - Alternatives considered: viable alternatives.
  - Rationale: why this path is safest or simplest now.
  - Consequences: tradeoffs, follow-ups, rollback notes, or aging risks.
- Write `Not applicable` for simple and medium plans without consequential decisions.

## Implementation Subtasks

- Task 1: Vertical slice title.
  Status: planned
  Execution: sequential first | sequential after Task N | parallel group A | independent
  Contract / interface: contract produced, contract consumed, or `No contract impact`
  Slice outcome: observable behavior this task completes end to end
  Ownership / files: `path/to/file`, `path/to/other`
  Dependencies: Task IDs, human answers, migrations, feature flags, or `None`
  Acceptance: focused tests/checks, expected command results, and stop condition.
  Integration notes: merge boundary, generated artifacts, task-document updates, or `None`
  Progress document: `task_1.md`
- For simple work that does not need breakdown, write `Not applicable: single focused pass is recommended`.

## Test Plan

- Focused checks per vertical slice.
- Full quality gate: format, lint, type check, build/compile, and full tests when those commands exist.
- Manual checks only when automation is not practical.

## Security / Privacy / Compliance

- Data, authorization, validation, logging, retention, abuse, dependency, and compliance notes.
- Write `No material security or privacy impact identified` only when supported by source context.

## Rollout / Rollback

- Deployment, flag, migration, compatibility, monitoring, rollback, or recovery notes.
- Write `Not applicable` for local-only or document-only changes.

## Blocking Questions

- Decision history for blocking questions already asked in chat.
- Open questions keep this plan pending and must also be asked in the final response.
- Keep every blocking question that was raised, including answered ones.
- Shape:
  - Status: open | answered
    Question: Original question text.
    Answer: Human answered on yyyy-mm-dd: answer text.
    Document impact: What changed in this document because of the answer.
- Write `None` only when no blocking questions have ever been raised.

## Deferred Non-Blocking Questions

- Questions the human explicitly accepted as safe to defer, with the reason approval can continue.
- Write `None` when there are no deferred questions.

## Document Changelog

- yyyy-mm-dd: Created from prompt, Jira, or PRD context.
- Add one entry for each material human answer, reviewer-driven update, approval, or requested-changes decision.

## Approval

Pending human approval.
