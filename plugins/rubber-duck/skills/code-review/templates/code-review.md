---
title: Short Human Title
slug: short-slug
type: code-review
status: pending-approval
created: yyyy-mm-dd
source: local-diff
---

Status: pending-approval

# Short Human Title

## Scope

- Review target: local diff or GitHub PR link.
- Review boundary: changed hunks/lines, new files, commits, PR metadata, checks, comments, and relevant untracked files reviewed.
- Context-only files or related plan, diagnosis, PRD, or code-review document used to understand the reviewed change, if any.

## Findings

- Severity: critical | high | medium | low
  File: `path/to/file:line`
  Issue: Concise description of the bug, regression, plan drift, security risk, test gap, or maintainability issue.
  Impact: Concrete user-facing, production, security, review-confidence, or maintenance impact.
  Recommendation: Smallest useful fix or question.

Write `None` when there are no findings.

## Security / Privacy Notes

- Security, privacy, compliance, authorization, validation, secrets, logging, dependency, data exposure, or abuse-case risks introduced or changed by the reviewed work.
- Risk classification and residual uncertainty when relevant.

Write `None` when there are no material notes.

## Test Coverage Notes

- Focused tests present, missing, weak, redundant, or not run.
- Full quality gate status: formatting checks, linting, type checks, builds or compilation, and full automated test suite results when available.
- Important scenarios, edge cases, regression paths, and recommended test additions.

Write `None` when there are no material notes.

## Project Convention Notes

- Alignment or mismatch with local naming, layering, file organization, templates, manifests, generated documents, tests, and existing project patterns.
- Evidence from directly related context files when a convention drives a recommendation.
- Unrelated nearby files and unchanged lines in touched files are not review targets.

Write `None` when there are no material notes.

## Plan Alignment

- Related plan path and approval status.
- Matched plan items.
- Missing plan items.
- Extra implementation scope.

Write `No related plan found` when no applicable plan is available.

## Blocking Questions

- Questions that must be answered before approval because they affect review scope, finding severity, required fixes, security risk, test coverage, plan alignment, or approval readiness.
- Write `None` when there are no blocking questions.

## Deferred Non-Blocking Questions

- Questions the human explicitly accepted as safe to defer, with the reason approval can still proceed.
- Write `None` when there are no deferred questions.

## Approval

Pending human approval.
