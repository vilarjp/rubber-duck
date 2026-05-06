---
title: Task N: Short Task Title
slug: short-slug
type: implementation-task
status: completed | partial | blocked
created: yyyy-mm-dd
updated: yyyy-mm-dd
source: plan
plan: plan.md
task: N
---

Status: completed | partial | blocked

# Task N: Short Task Title

## Source Plan Task

- Plan path: `docs/yyyy-mm-dd-{slug}/plan.md`
- Planned task: Task N from Implementation Subtasks.
- Planned execution: sequential first | sequential after Task N | parallel group A | independent
- Contract / interface: contract produced, contract consumed, or `No contract impact`
- Vertical slice outcome: observable behavior this task completes end to end.
- Dependencies: Task IDs, human answers, migrations, feature flags, or `None`

## Implementation Summary

- What changed and why it satisfies the planned acceptance checks.
- Execution mode: local sequential | implementation-agent | test-implementer | mixed.
- Contract/interface effect, compatibility note, generated-artifact reconciliation, or `None`.
- If delegated, record the assigned `implementation-agent` or `test-implementer`, its write ownership, read-only context, generated-artifact boundaries, and no-touch boundaries.
- For `partial` or `blocked`, summarize reusable work, remaining work, and blockers.

## Changed Files

- `path/to/file`: change made for this task.

## Tests / Verification

- Focused tests and checks run for this task.
- Full quality gate commands run, deferred, unavailable, or blocked.
- External framework, library, service, or API behavior verified when it shaped implementation.
- Contract/interface verification or integration checkpoint when relevant.
- Any temporary workaround that remains, including why it was necessary, how it is constrained, and what follow-up removes it.

## Deviations / Follow-Ups

- Differences from the plan, why they were necessary, and whether the human approved them.
- Remaining follow-up work or `None`.

## Blocking Questions

- Decision history for task-blocking questions already asked in chat.
- Open questions keep this task partial/blocked and must also be asked in the final response.
- Keep every blocking question that was raised, including answered ones.
- Shape:
  - Status: open | answered
    Question: Original question text.
    Answer: Human answered on yyyy-mm-dd: answer text.
    Task impact: What changed in this task because of the answer.
- Write `None` only when no blocking questions have ever been raised for this task.

## Deferred Non-Blocking Questions

- Questions the human explicitly accepted as safe to defer, with the reason this task could still complete.
- Write `None` when there are no deferred questions.

## Document Changelog

- yyyy-mm-dd: Created after completing Task N.
- Add one entry for each material implementation update, verification update, human answer, or correction.

## Next Task

- Recommended next planned task, blocked dependency, or `Plan implementation complete`.
