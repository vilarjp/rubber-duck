---
title: Short Human Title
slug: short-slug
type: code-review
status: pending-approval
created: yyyy-mm-dd
updated: yyyy-mm-dd
source: local-diff
---

Status: pending-approval

# Short Human Title

## Scope

- Review target: local diff or GitHub PR link.
- Review boundary: changed hunks/lines, new files, commits, PR metadata, checks, comments, and relevant untracked files.
- Context used: related plan, task docs, nearby source/tests, project rules, or `None`.

## Findings

- Severity: critical | high | medium | low
  File: `path/to/file:line`
  Evidence: Changed line, hunk, command output, related plan/task document, or other review evidence.
  Issue: Concise description of the bug, regression, plan drift, security risk, test gap, or maintainability issue.
  Impact: Concrete user-facing, production, security, review-confidence, or maintenance impact.
  Recommendation: Smallest useful fix or question.

Write `None` when there are no findings.

Finding bar: changed-scope evidence, concrete impact, and a smallest useful fix. Preference-only nits and broad rewrites stay out.

Reviewer taxonomy mapping: `Blocker` becomes `critical` or `high` based on impact, `Friction` becomes `medium`, and `Optimization` becomes `low` or a non-finding note.

## Security / Privacy Notes

- Material security, privacy, compliance, auth, validation, secrets, logging, dependency, data exposure, or abuse-case notes.

Write `None` when there are no material notes.

## Test Coverage Notes

- Focused tests present, missing, weak, redundant, or not run.
- Full quality gate status: formatting checks, linting, type checks, builds or compilation, and full automated test suite results when available.
- Important scenarios, edge cases, regression paths, and recommended test additions.

Write `None` when there are no material notes.

## Project Convention Notes

- Material local pattern or workflow mismatches with changed-scope evidence.

Write `None` when there are no material notes.

## Source-Driven / Workaround Notes

- External framework, library, service, API, or version-sensitive behavior verified from repository evidence, local package/source docs, official docs, release notes, or existing tests.
- Any unverified external API assumptions that affect correctness, compatibility, security, rollout, or test confidence.
- Any workaround smells found in changed code, tests, or generated documents, including type suppression, lint/test bypasses, swallowed errors, timing patches, monkey patches, scattered special cases, or copy-pasted fixes.

Write `None` when there are no material notes.

## Plan Alignment

- Related plan path and approval status.
- Matched plan items.
- Missing plan items.
- Extra implementation scope.
- Planned vertical slices represented by the reviewed changes.
- Related `task_N.md` documents and sequencing/parallel constraints.

Write `No related plan found` when no applicable plan is available.

## Workflow Compliance

- Generated-document metadata: whether touched Rubber Duck documents include `created`, `updated`, and accurate status fields.
- Answered blocking questions: whether original questions were preserved with the human answer and document impact.
- Document changelog: whether material human answers, requested changes, reviewer-driven updates, approvals, and requested-changes decisions were recorded.
- Subtask orchestration: whether medium-to-complex plans include subtasks, execution strategy, and per-subtask progress documents.

Write `None` when there are no material workflow notes.

## Blocking Questions

- Decision history for blocking questions already asked in chat.
- Open questions keep this review pending and must also be asked in the final response.
- Keep every blocking question that was raised, including answered ones.
- Shape:
  - Status: open | answered
    Question: Original question text.
    Answer: Human answered on yyyy-mm-dd: answer text.
    Document impact: What changed in this document because of the answer.
- Write `None` only when no blocking questions have ever been raised.

## Deferred Non-Blocking Questions

- Questions the human explicitly accepted as safe to defer, with the reason approval can still proceed.
- Write `None` when there are no deferred questions.

## Document Changelog

- yyyy-mm-dd: Created from local diff or GitHub PR context.
- Add one entry for each material human answer, reviewer-driven update, approval, or requested-changes decision.

## Approval

Pending human approval.
