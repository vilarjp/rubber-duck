---
name: plan
description: Generate a concise technical implementation plan from a prompt, Jira link, or existing PRD slug, then review it with document, future-maintainer, security, and staff-engineer agents before asking for human approval.
disable-model-invocation: true
argument-hint: "[implementation prompt | Jira link | PRD slug]"
---

# Plan Skill

Use this skill to create a technical implementation plan: the "how" for a feature, bug fix, product change, or approved PRD.

## Inputs

Accept `$ARGUMENTS` as one of:

- A free-form implementation request.
- A Jira link.
- A slug or source hint pointing to an existing PRD folder.

If no useful input is provided, ask the human for the implementation request, Jira link, or PRD slug.

## Output

Create one document in the target project root:

```text
docs/yyyy-mm-dd-{slug}/plan.md
```

The document status must remain `pending-approval` until the human explicitly approves it or requests changes.

## Workflow

1. Determine the source context.
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current Claude Code session.
   - Do not configure or bundle Jira MCP servers.
   - If Jira access fails, ask the human to paste the Jira title, description, acceptance criteria, comments, and relevant links.
   - If `$ARGUMENTS` looks like a slug, search for matching `docs/*-{slug}/prd.md` files.
   - If exactly one matching PRD exists, use it as source context.
   - If multiple matching PRDs exist, ask the human which PRD to use.
   - If no matching PRD exists, treat `$ARGUMENTS` as a free-form planning prompt.
2. Gather only the context needed to write the implementation plan.
   - Inspect the codebase enough to identify the smallest correct implementation path.
   - Prefer repository files, manifests, tests, configuration, existing docs, and relevant nearby source code.
   - Do not inspect private or unrelated project areas unless the request requires it.
3. Ask the human for missing technical or product facts when they would materially change scope, architecture, data handling, security, rollout, or approval.
   - Ask as many times as necessary until approval-relevant ambiguity is resolved.
   - Do not ask about details that the human explicitly accepts as deferred and non-blocking.
4. Derive the output folder.
   - Use the local current date in `yyyy-mm-dd` format.
   - Use a human-provided slug or matched PRD slug when available.
   - Otherwise derive a short kebab-case slug from the requested feature, bug, or technical change.
5. Draft a concise implementation plan.
   - Use `templates/plan.md` from this skill folder as the default structure.
   - Include only sections that help implementation, review, approval, rollback, or later maintenance.
   - Keep confirmed facts, assumptions, decisions, risks, non-goals, blocking questions, and deferred non-blocking questions distinct.
   - Prefer evidence from the repository over speculation.
   - Make the plan specific enough that a future implementer can follow it without rediscovering the same context.
   - Include a full quality gate in the Test Plan: formatting checks, linting, type checks, builds or compilation, and the full automated test suite when those commands exist.
6. Run specialist reviewer agents on the generated `plan.md`.
   - Run `plan-future-maintainer` for future context, ambiguous decisions, aging assumptions, and concise additions.
   - Run `plan-security-reviewer` for security, privacy, compliance, authorization, validation, secrets, logging, retention, and abuse-case gaps.
   - Run `plan-staff-engineer` for stack-specific architecture risks, production bugs, compatibility concerns, observability gaps, and simpler implementation options.
   - Run these independent reviewers in parallel when the current Claude Code environment supports it.
   - Pass each reviewer the plan path, source context summary, and any relevant PRD or Jira context.
   - Do not write separate review files.
7. Merge reviewer feedback into `plan.md` when it improves correctness, security, maintainability, testability, rollout safety, or approval readiness.
   - Apply blocking findings before finalizing.
   - Treat security/privacy questions, blocking findings, and human questions as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Preserve reviewer conflicts as questions for the human instead of guessing.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
8. Run `document-reviewer` on the merged `plan.md` as the final approval-readiness pass.
   - Ask it to review for completeness, correctness, clarity, unresolved uncertainty, request alignment, missing questions, and approval readiness.
   - Merge any approval-readiness fixes before asking the human.
9. Resolve all approval blockers before presenting the plan for approval.
   - Ask the human follow-up questions as many times as necessary.
   - Update `plan.md` after each answer.
   - Rerun the affected specialist reviewers and `document-reviewer` when an answer materially changes scope, architecture, data handling, security, rollout, tests, or approval readiness.
   - Do not leave an approval-relevant question only in the document. Either answer it, record the human's explicit non-blocking deferral, or keep the plan not ready for approval.
10. Tell the human the plan path and that it is pending approval.

- Ask them to review it and explicitly approve or request changes.

## Document Requirements

Every plan must start with this frontmatter shape:

```yaml
---
title: Short Human Title
slug: short-slug
type: plan
status: pending-approval
created: yyyy-mm-dd
source: prompt | jira | prd
---
```

Immediately after frontmatter, include a visible status line:

```text
Status: pending-approval
```

Use these sections when useful:

- Summary
- Source Context
- Current System Notes
- Proposed Approach
- Files / Modules To Touch
- Data Model / Migrations
- API / UI Behavior
- Test Plan
- Security / Privacy / Compliance
- Rollout / Rollback
- Blocking Questions
- Deferred Non-Blocking Questions
- Approval

## Reviewer Orchestration Notes

- Run `plan-future-maintainer`, `plan-security-reviewer`, and `plan-staff-engineer` before asking for human approval when the agents are available.
- Prefer running independent specialist reviewer agents in parallel when the current Claude Code environment supports it.
- Wait for all available specialist reviewers, merge their findings, then run `document-reviewer` last on the merged plan.
- Use blocking findings, security/privacy questions, and reviewer conflicts as approval blockers unless they are explicitly deferred by the human as non-blocking.
- If an expected reviewer agent is unavailable, note that gap in the final response and add it to the plan's Blocking Questions, Deferred Non-Blocking Questions, or Approval notes when it affects approval confidence.
- The invoking skill owns the final document. Reviewer agents return findings only; they do not edit the document.
- Do not approve the plan on behalf of the human.

## Approval Loop

If the human requests changes or answers a blocking question, update `plan.md`, rerun affected specialist reviewers and `document-reviewer` when the change materially affects approval readiness, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests more changes, or stops the workflow.

## Approval Updates

If the human later explicitly approves the plan, update the frontmatter:

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
