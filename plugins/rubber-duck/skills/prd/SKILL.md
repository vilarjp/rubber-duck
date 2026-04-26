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

## Shared References

Use `../_shared/prd-plan-alignment.md` as downstream guidance: PRDs should make goals, non-goals, risks, dependencies, and acceptance criteria clear enough for a future plan to map them into implementation work and verification.

## Workflow

1. Determine the source context.
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current assistant session.
   - Do not configure or bundle Jira MCP servers.
   - If Jira access fails, ask the human to paste the Jira title, description, acceptance criteria, comments, and relevant links.
   - If `$ARGUMENTS` is a prompt, use it as the source of truth.
2. Gather only the context needed to write the PRD.
   - Prefer the human prompt, Jira content, existing README files, nearby docs, and relevant product context.
   - Do not inspect private or unrelated project areas unless the request requires it.
3. Ask the human for missing product facts when they would materially change scope, user value, requirements, acceptance criteria, or approval.
   - Ask as many times as necessary until approval-relevant product ambiguity is resolved.
   - Do not ask about details that the human explicitly accepts as deferred and non-blocking.
4. Derive the output folder.
   - Use the local current date in `yyyy-mm-dd` format.
   - Use a human-provided slug when available.
   - Otherwise derive a short kebab-case slug from the requested feature or problem.
5. Draft a concise PRD.
   - Use `templates/prd.md` from this skill folder as the default structure.
   - Include only sections that help the work move forward.
   - Keep facts, assumptions, non-goals, risks, blocking questions, and deferred non-blocking questions distinct.
   - Prefer evidence over speculation.
   - Use clear acceptance criteria that a future plan or implementation can verify.
   - Make goals, non-goals, risks, dependencies, and answered blocking questions concrete enough for a future PRD-to-plan alignment check.
6. Run the `document-reviewer` agent on the generated `prd.md`.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `document-reviewer` agent.
   - Pass the PRD path, source context summary, and any material constraints from the current session.
   - Do not write a separate review file.
7. Apply reviewer feedback only when it improves correctness, clarity, scope control, or approval readiness.
   - Treat blocking issues and missing questions as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
8. Resolve all approval blockers before presenting the PRD for approval.
   - Ask the human follow-up questions as many times as necessary.
   - Update `prd.md` after each answer.
   - Preserve the original blocking question, mark it `answered`, record the human's answer with the local date, and summarize the document impact. Do not remove answered blocking questions during updates.
   - Add a `Document Changelog` entry for each human answer, change request, reviewer-driven material update, approval, or requested-changes decision.
   - Update the frontmatter `updated` field to the local date whenever the document changes.
   - Rerun `document-reviewer` when an answer materially changes requirements, scope, acceptance criteria, risks, or approval readiness.
   - Do not leave an approval-relevant question only in the document. Either answer it, record the human's explicit non-blocking deferral, or keep the PRD not ready for approval.
9. Tell the human the PRD path and that it is pending approval.
   - Ask them to review it and explicitly approve or request changes.

## Runtime Compatibility

- In runtimes with native plugin agents, use the named plugin agents from the root-level `agents/` directory and their full Markdown definitions.
- In Codex, prefer the exact named generated custom agents installed by `setup-codex-agents`.
- If no compatible native or generated agent is available, read the matching reviewer prompt from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and perform that pass inline or through the closest available delegation mechanism.
- Do not skip `document-reviewer` solely because the current runtime exposes reviewer prompts as files instead of native agents.

## Reviewer Invocation Contract

- Invoke reviewer roles by exact pre-built agent name, such as `document-reviewer`.
- In Codex delegation APIs, selecting a reviewer means setting the reviewer as the agent type or custom-agent name, for example `agent_type: document-reviewer`. Do not use `default`, `worker`, or a newly-created generic subagent when the named reviewer exists.
- In Codex, omit `fork_context` or set `fork_context: false` for named reviewer agents. Do not try a full-history/context fork first; named custom agents must receive a self-contained launch prompt.
- Start each launch prompt with the selected reviewer name for auditability, for example: `You are the already-selected Rubber Duck document-reviewer custom agent. Use your configured agent instructions; this message only provides run-specific context.`
- Use the rest of the launch prompt only for run-specific context: document path, source summary, and any material constraints from the current session.
- Do not replace the reviewer with a compressed prompt such as `Please review for completeness...`. A short launch prompt is acceptable only after the named pre-built reviewer has been selected, and it must not restate, narrow, or override the agent definition.
- Let the selected reviewer follow its own scope, operating rules, checklist, and output format from `agents/<agent-name>.md` or the generated Codex TOML.
- If the runtime cannot invoke the named reviewer, read the full matching agent definition from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and perform the same review inline or through the closest available delegation mechanism. Treat this as a fallback and make the unavailability explicit.

## Document Requirements

Every PRD must start with this frontmatter shape:

```yaml
---
title: Short Human Title
slug: short-slug
type: prd
status: pending-approval
created: yyyy-mm-dd
updated: yyyy-mm-dd
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
- Blocking Questions
- Deferred Non-Blocking Questions
- Document Changelog
- Approval

## Approval Loop

If the human requests changes or answers a blocking question, update `prd.md`, update `updated`, preserve the original question with the human answer, add a `Document Changelog` entry explaining what changed and why, rerun `document-reviewer` when the change materially affects approval readiness, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests more changes, or stops the workflow.

Answered blocking questions must remain in `Blocking Questions` as answered entries. Only open blocking questions prevent approval.

## Approval Updates

If the human later explicitly approves the PRD, update the frontmatter:

```yaml
status: approved
updated: yyyy-mm-dd
approved: yyyy-mm-dd
approval_note: Short note
```

If the human requests changes, update the frontmatter:

```yaml
status: requested-changes
updated: yyyy-mm-dd
decision_date: yyyy-mm-dd
decision_note: Short note
```

Keep the visible status line in sync with frontmatter and add a matching `Document Changelog` entry.
