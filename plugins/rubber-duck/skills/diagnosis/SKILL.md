---
name: diagnosis
description: Investigate a bug from a prompt or Jira link, document reproduction, evidence-backed root cause, solution options, and review it with the document-reviewer agent before asking for human approval.
disable-model-invocation: true
argument-hint: "[bug report | Jira link | slug/source hint]"
---

# Diagnosis Skill

Use this skill to investigate a bug and create a diagnosis document: what happens, where it happens, why it likely happens, and what to do next.

## Inputs

Accept `$ARGUMENTS` as one of:

- A free-form bug report.
- A Jira link.
- A slug or source hint for naming the generated document folder.

If no useful input is provided, ask the human for the bug report, reproduction steps, expected behavior, observed behavior, logs, screenshots, or Jira link.

## Output

Create one document in the target project root:

```text
docs/yyyy-mm-dd-{slug}/diagnosis.md
```

The diagnosis document is the only file this skill may create or modify. Its status must remain `pending-approval` until the human explicitly approves it or requests changes.

## Workflow

1. Determine the source context.
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current Claude Code session.
   - Do not configure or bundle Jira MCP servers.
   - If Jira access fails, ask the human to paste the Jira title, description, reproduction steps, expected behavior, observed behavior, comments, logs, screenshots, and relevant links.
   - If `$ARGUMENTS` is a prompt, use it as the source of truth.
2. Gather the minimum bug context needed for diagnosis.
   - Capture reproduction steps, expected behavior, observed behavior, frequency, environment, affected users or flows, error messages, logs, screenshots, recent changes, and suspected entry points when available.
   - Ask the human for missing facts only when they would materially change the investigation path, root-cause confidence, risk, or recommended next step.
   - Do not ask for facts that can safely remain open questions in the diagnosis.
3. Inspect the codebase and evidence without changing project files.
   - Read relevant source, tests, configuration, logs, documentation, git history, and local diffs.
   - Run read-only searches and diagnostics where useful.
   - If reproducing the bug or running tests would intentionally create or modify repository files other than the diagnosis document, ask the human first or record the command in the Verification Plan instead.
4. Form and validate hypotheses.
   - Tie each hypothesis to concrete evidence from the prompt, Jira content, code, tests, logs, or recent changes.
   - Separate confirmed facts from assumptions and unknowns.
   - Prefer the simplest explanation that fits the evidence.
5. Derive the output folder.
   - Use the local current date in `yyyy-mm-dd` format.
   - Use a human-provided slug when available.
   - Otherwise derive a short kebab-case slug from the bug symptom or affected behavior.
6. Draft a concise diagnosis.
   - Use `templates/diagnosis.md` from this skill folder as the default structure.
   - Include only sections that help decide the next implementation or product action.
   - Do not implement fixes, edit tests, update configuration, or change source code.
7. Run the `document-reviewer` agent on the generated `diagnosis.md`.
   - Ask it to review for completeness, correctness, clarity, unresolved uncertainty, request alignment, missing questions, approval readiness, and whether the root cause is evidence-backed.
   - Do not write a separate review file.
8. Apply reviewer feedback only by updating `diagnosis.md`, and only when it improves correctness, evidence quality, clarity, or approval readiness.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
9. Tell the human the diagnosis path and that it is pending approval.
   - Ask them to review it and explicitly approve or request changes.

## Document Requirements

Every diagnosis must start with this frontmatter shape:

```yaml
---
title: Short Human Title
slug: short-slug
type: diagnosis
status: pending-approval
created: yyyy-mm-dd
source: prompt | jira
---
```

Immediately after frontmatter, include a visible status line:

```text
Status: pending-approval
```

Use these sections when useful:

- Summary
- Reproduction
- Observed Behavior
- Expected Behavior
- Investigation Notes
- Probable Root Cause
- Affected Files / Flows
- Solution Options
- Recommended Next Step
- Verification Plan
- Open Questions
- Approval

## Approval Updates

If the human later explicitly approves the diagnosis, update the frontmatter:

```yaml
status: approved
approved: yyyy-mm-dd
approval_note: Short note
```

If the human requests changes, update the frontmatter:

```yaml
status: requested-changes
decision_date: yyyy-mm-dd
decision_note: Short note
```

Keep the visible status line in sync with frontmatter.
