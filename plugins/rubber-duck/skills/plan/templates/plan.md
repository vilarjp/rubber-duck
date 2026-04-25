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

One short paragraph describing the intended technical change and the outcome it should enable.

## Source Context

- Prompt, Jira issue, or PRD path used as the source of truth.
- Key requirements, constraints, and non-goals carried into implementation planning.

## Current System Notes

- Existing files, modules, tests, commands, data flows, or conventions that shape the implementation.
- Confirmed facts only; call out assumptions separately.

## Proposed Approach

- Smallest correct implementation sequence.
- Important decisions, tradeoffs, dependencies, and rejected heavier alternatives.

## Implementation Strategy

- Complexity: simple | medium | complex.
- Recommended execution: single focused pass | incremental task-by-task | parallel implementation subagents.
- Rationale: why this mode is safer or faster for this work.
- Orchestration recommendation: whether `/rubber-duck:orchestrate-implementation` should coordinate the plan, whether a simple `/rubber-duck:implement` pass is enough, and whether runtime worker subagents can safely implement independent subtasks.
- Parallel safety notes: shared files, shared state, migrations, test dependencies, merge risks, and any tasks that must not run at the same time.

## Implementation Subtasks

- Task 1: Short task title.
  Status: planned
  Execution: sequential first | sequential after Task N | parallel group A | independent
  Ownership / files: `path/to/file`, `path/to/other`
  Dependencies: Task IDs, human answers, migrations, feature flags, or `None`
  Acceptance: Observable completion criteria and focused tests/checks.
  Progress document: `task_1.md`
- For simple work that does not need breakdown, write `Not applicable: single focused pass is recommended`.

## Files / Modules To Touch

- `path/to/file`: planned responsibility or change.

## Data Model / Migrations

- Storage, schema, migration, backfill, compatibility, or cleanup work.
- Write `Not applicable` when no data model changes are planned.

## API / UI Behavior

- Public contracts, routes, components, commands, user flows, or integration behavior that will change.
- Write `Not applicable` when no API or UI behavior changes are planned.

## Test Plan

- Focused tests to add or update.
- Full quality gate to run before completion: formatting checks, linting, type checks, builds or compilation, and the full automated test suite when those commands exist.
- Manual checks only for behavior that cannot be covered by the automated gate.

## Security / Privacy / Compliance

- Data types involved, especially PII, credentials, customer content, logs, or analytics.
- Authorization, validation, sanitization, logging, retention, abuse-case, and dependency considerations.
- Write `No material security or privacy impact identified` only when supported by source context.

## Rollout / Rollback

- Deployment, feature flag, migration, compatibility, monitoring, rollback, or recovery notes.
- Write `Not applicable` for local-only or document-only changes.

## Blocking Questions

- Keep every blocking question that was raised, including questions the human has answered.
- Open questions block approval; answered questions remain as decision history and do not block approval when the answer and document impact are recorded.
- Use this shape:
  - Status: open | answered
    Question: Original question text.
    Answer: Human answered on yyyy-mm-dd: answer text.
    Document impact: What changed in this document because of the answer.
- Write `None` only when no blocking questions have ever been raised.

## Deferred Non-Blocking Questions

- Questions the human explicitly accepted as safe to defer, with the reason approval can still proceed.
- Write `None` when there are no deferred questions.

## Document Changelog

- yyyy-mm-dd: Created from prompt, Jira, or PRD context.
- Add one entry for each human change request, follow-up answer, reviewer-driven material update, approval, or requested-changes decision. Include what changed and why.

## Approval

Pending human approval.
