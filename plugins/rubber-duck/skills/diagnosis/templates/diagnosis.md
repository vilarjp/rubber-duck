---
title: Short Human Title
slug: short-slug
type: diagnosis
status: pending-approval
created: yyyy-mm-dd
source: prompt
---

Status: pending-approval

# Short Human Title

## Summary

One short paragraph describing the bug, affected behavior, and current confidence in the diagnosis.

## Reproduction

- Steps, inputs, environment, account state, feature flags, or data conditions needed to reproduce.
- Note whether reproduction is confirmed, partial, or not yet reproduced.

## Observed Behavior

- What actually happens, including errors, logs, screenshots, timestamps, or user-visible symptoms.

## Expected Behavior

- What should happen instead, based on product requirements, existing behavior, or user expectation.

## Investigation Notes

- Evidence from the prompt, Jira issue, code paths, tests, logs, git history, and local diffs.
- Keep confirmed facts, hypotheses, assumptions, and unknowns separate.

## Probable Root Cause

Evidence-backed explanation of why the bug is happening. Include confidence level and any competing hypotheses that remain plausible.

## Affected Files / Flows

- `path/to/file`: relevant responsibility, code path, or observed behavior.
- User, API, job, data, or integration flow affected.

## Solution Options

- Option 1: smallest plausible fix, tradeoffs, and risks.
- Option 2: alternative fix if the smallest option is insufficient.

## Recommended Next Step

The recommended implementation or follow-up action, with the reason it is preferred.

## Verification Plan

- Focused checks, tests, reproduction steps, logs, or manual validation that should confirm the fix.

## Blocking Questions

- Questions that must be answered before approval because they affect reproduction, expected behavior, observed behavior, root-cause confidence, risk, recommended next step, or verification.
- Write `None` when there are no blocking questions.

## Deferred Non-Blocking Questions

- Questions the human explicitly accepted as safe to defer, with the reason approval can still proceed.
- Write `None` when there are no deferred questions.

## Approval

Pending human approval.
