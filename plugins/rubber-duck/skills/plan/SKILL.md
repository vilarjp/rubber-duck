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
3. Ask the human for missing technical or product facts only when they would materially change scope, architecture, data handling, security, rollout, or approval.
   - Do not ask about details that can safely remain open questions in the plan.
4. Derive the output folder.
   - Use the local current date in `yyyy-mm-dd` format.
   - Use a human-provided slug or matched PRD slug when available.
   - Otherwise derive a short kebab-case slug from the requested feature, bug, or technical change.
5. Draft a concise implementation plan.
   - Use `templates/plan.md` from this skill folder as the default structure.
   - Include only sections that help implementation, review, approval, rollback, or later maintenance.
   - Keep confirmed facts, assumptions, decisions, risks, non-goals, and open questions distinct.
   - Prefer evidence from the repository over speculation.
   - Make the plan specific enough that a future implementer can follow it without rediscovering the same context.
6. Run reviewer agents on the generated `plan.md`.
   - Run `document-reviewer` for completeness, correctness, clarity, unresolved uncertainty, request alignment, missing questions, and approval readiness.
   - Run `plan-future-maintainer` for future context, ambiguous decisions, aging assumptions, and concise additions.
   - Run `plan-security-reviewer` for security, privacy, compliance, authorization, validation, secrets, logging, retention, and abuse-case gaps.
   - Run `plan-staff-engineer` for stack-specific architecture risks, production bugs, compatibility concerns, observability gaps, and simpler implementation options.
   - Pass each reviewer the plan path, source context summary, and any relevant PRD or Jira context.
   - Do not write separate review files.
7. Merge reviewer feedback into `plan.md` when it improves correctness, security, maintainability, testability, rollout safety, or approval readiness.
   - Apply blocking findings before finalizing.
   - Add or preserve open questions when the feedback identifies uncertainty that should not be guessed.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
8. Tell the human the plan path and that it is pending approval.
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
- Open Questions
- Approval

## Reviewer Orchestration Notes

- Run all four reviewers before asking for human approval when the agents are available.
- Prefer running independent reviewer agents in parallel when the current Claude Code environment supports it.
- If an expected reviewer agent is unavailable, note that gap in the final response and add it to the plan's Open Questions or Approval notes when it affects approval confidence.
- The invoking skill owns the final document. Reviewer agents return findings only; they do not edit the document.
- Do not approve the plan on behalf of the human.

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
