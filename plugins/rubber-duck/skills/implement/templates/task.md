---
title: Task N: Short Task Title
slug: short-slug
type: implementation-task
status: completed
created: yyyy-mm-dd
updated: yyyy-mm-dd
source: plan
plan: plan.md
task: N
---

Status: completed

# Task N: Short Task Title

## Source Plan Task

- Plan path: `docs/yyyy-mm-dd-{slug}/plan.md`
- Planned task: Task N from Implementation Subtasks.
- Planned execution: sequential first | sequential after Task N | parallel group A | independent
- Dependencies: Task IDs, human answers, migrations, feature flags, or `None`

## Implementation Summary

- What changed for this subtask and why it satisfies the planned acceptance criteria.
- Note whether this was implemented sequentially or in parallel with other planned subtasks.

## Changed Files

- `path/to/file`: change made for this task.

## Tests / Verification

- Focused tests and checks run for this task.
- Full quality gate commands run, deferred, unavailable, or blocked.

## Deviations / Follow-Ups

- Differences from the plan, why they were necessary, and whether the human approved them.
- Remaining follow-up work or `None`.

## Blocking Questions

- Keep every blocking question that was raised during this subtask, including questions the human has answered.
- Open questions block marking the task complete; answered questions remain as decision history when the answer and task impact are recorded.
- Use this shape:
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
- Add one entry for each human change request, follow-up answer, material implementation update, verification update, or correction. Include what changed and why.

## Next Task

- Recommended next planned task, blocked dependency, or `Plan implementation complete`.
