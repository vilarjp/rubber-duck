---
name: prd
description: Generate a concise Product Requirements Document from a prompt or Jira link, then review it with the document-reviewer agent before asking for human approval.
disable-model-invocation: true
argument-hint: "[feature prompt | Jira link | slug/source hint]"
---

# PRD Skill

Use this skill to create a Product Requirements Document: the "what and why" for a feature, product change, or user-facing workflow.

## Inputs

Accept `$ARGUMENTS` as one of:

- A free-form product or feature prompt.
- A Jira link.
- A slug or source hint for naming the generated document folder.

If no useful input is provided, ask the human for the feature prompt or Jira link.

## Output

Create one document in the target project root:

```text
docs/yyyy-mm-dd-{slug}/prd.md
```

The document status must remain `pending-approval` until the human explicitly approves it or requests changes.

## Workflow

1. Determine the source context.
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current Claude Code session.
   - Do not configure or bundle Jira MCP servers.
   - If Jira access fails, ask the human to paste the Jira title, description, acceptance criteria, comments, and relevant links.
   - If `$ARGUMENTS` is a prompt, use it as the source of truth.
2. Gather only the context needed to write the PRD.
   - Prefer the human prompt, Jira content, existing README files, nearby docs, and relevant product context.
   - Do not inspect private or unrelated project areas unless the request requires it.
3. Ask the human for missing product facts only when they would materially change scope, user value, requirements, acceptance criteria, or approval.
   - Do not ask about details that can safely remain open questions in the PRD.
4. Derive the output folder.
   - Use the local current date in `yyyy-mm-dd` format.
   - Use a human-provided slug when available.
   - Otherwise derive a short kebab-case slug from the requested feature or problem.
5. Draft a concise PRD.
   - Use `templates/prd.md` from this skill folder as the default structure.
   - Include only sections that help the work move forward.
   - Keep facts, assumptions, non-goals, risks, and open questions distinct.
   - Prefer evidence over speculation.
   - Use clear acceptance criteria that a future plan or implementation can verify.
6. Run the `document-reviewer` agent on the generated `prd.md`.
   - Ask it to review for completeness, correctness, clarity, unresolved uncertainty, request alignment, missing questions, and approval readiness.
   - Do not write a separate review file.
7. Apply reviewer feedback only when it improves correctness, clarity, scope control, or approval readiness.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
8. Tell the human the PRD path and that it is pending approval.
   - Ask them to review it and explicitly approve or request changes.

## Document Requirements

Every PRD must start with this frontmatter shape:

```yaml
---
title: Short Human Title
slug: short-slug
type: prd
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
- Problem
- Goals
- Non-goals
- Users / use cases
- Requirements
- Acceptance criteria
- Success signals
- Risks / dependencies
- Open questions
- Approval

## Approval Updates

If the human later explicitly approves the PRD, update the frontmatter:

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
