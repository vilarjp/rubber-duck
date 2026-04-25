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
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current assistant session.
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
   - Classify implementation complexity as `simple`, `medium`, or `complex`.
   - For medium-to-complex work, include `Implementation Strategy` and `Implementation Subtasks` sections that break the plan into named tasks with dependencies, ownership/files, acceptance checks, execution mode, and expected `task_N.md` progress document names.
   - For simple work, either include one task or explicitly write that a single focused pass is recommended.
   - Recommend one execution strategy: `single focused pass`, `incremental task-by-task`, or `parallel implementation subagents`.
   - Evaluate orchestration needs in the plan: state whether `/rubber-duck:orchestrate-implementation` should coordinate the plan, whether a simple `/rubber-duck:implement` pass is enough, and whether current runtime worker subagents can safely handle independent tasks.
   - Only recommend parallel implementation when subtasks have disjoint ownership, clear interfaces, no unresolved blockers, and low merge risk. Mark sequential dependencies when tasks share files, migrations, feature flags, public contracts, or test fixtures.
6. Run specialist reviewer agents on the generated `plan.md`.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `plan-future-maintainer` agent.
   - Invoke the exact pre-built `plan-security-reviewer` agent.
   - Invoke the exact pre-built `plan-staff-engineer` agent.
   - Run these independent reviewers in parallel when the current assistant environment supports it.
   - Pass each reviewer the plan path, source context summary, and any relevant PRD or Jira context.
   - Do not write separate review files.
7. Merge reviewer feedback into `plan.md` when it improves correctness, security, maintainability, testability, rollout safety, or approval readiness.
   - Apply blocking findings before finalizing.
   - Treat security/privacy questions, blocking findings, and human questions as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Preserve reviewer conflicts as questions for the human instead of guessing.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
8. Run `document-reviewer` on the merged `plan.md` as the final approval-readiness pass.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `document-reviewer` agent.
   - Merge any approval-readiness fixes before asking the human.
9. Resolve all approval blockers before presenting the plan for approval.
   - Ask the human follow-up questions as many times as necessary.
   - Update `plan.md` after each answer.
   - Preserve the original blocking question, mark it `answered`, record the human's answer with the local date, and summarize the document impact. Do not remove answered blocking questions during updates.
   - Add a `Document Changelog` entry for each human answer, change request, reviewer-driven material update, approval, or requested-changes decision.
   - Update the frontmatter `updated` field to the local date whenever the document changes.
   - Rerun the affected specialist reviewers and `document-reviewer` when an answer materially changes scope, architecture, data handling, security, rollout, tests, or approval readiness.
   - Do not leave an approval-relevant question only in the document. Either answer it, record the human's explicit non-blocking deferral, or keep the plan not ready for approval.
10. Tell the human the plan path and that it is pending approval.

- Ask them to review it and explicitly approve or request changes.

## Runtime Compatibility

- In runtimes with native plugin agents, use the named plugin agents from the root-level `agents/` directory and their full Markdown definitions.
- In Codex, prefer the exact named generated custom agents installed by `setup-codex-agents`.
- If no compatible native or generated agent is available, read the matching reviewer prompt from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and perform that pass inline or through the closest available delegation mechanism.
- Do not skip a configured reviewer solely because the current runtime exposes reviewer prompts as files instead of native agents.

## Reviewer Invocation Contract

- Invoke reviewer roles by exact pre-built agent name, such as `plan-future-maintainer` or `document-reviewer`.
- In Codex delegation APIs, selecting a reviewer means setting the reviewer as the agent type or custom-agent name, for example `agent_type: plan-future-maintainer`. Do not use `default`, `worker`, or a newly-created generic subagent when the named reviewer exists.
- In Codex, omit `fork_context` or set `fork_context: false` for named reviewer agents. Do not try a full-history/context fork first; named custom agents must receive a self-contained launch prompt.
- Start each launch prompt with the selected reviewer name for auditability, for example: `You are the already-selected Rubber Duck plan-future-maintainer custom agent. Use your configured agent instructions; this message only provides run-specific context.`
- Use the rest of the launch prompt only for run-specific context: document path, source summary, relevant PRD or Jira details, and any material constraints from the current session.
- Do not replace the reviewer with a compressed prompt such as `Please review for future maintainability...`. A short launch prompt is acceptable only after the named pre-built reviewer has been selected, and it must not restate, narrow, or override the agent definition.
- Let the selected reviewer follow its own scope, operating rules, checklist, and output format from `agents/<agent-name>.md` or the generated Codex TOML.
- If the runtime cannot invoke the named reviewer, read the full matching agent definition from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and perform the same review inline or through the closest available delegation mechanism. Treat this as a fallback and make the unavailability explicit.

## Document Requirements

Every plan must start with this frontmatter shape:

```yaml
---
title: Short Human Title
slug: short-slug
type: plan
status: pending-approval
created: yyyy-mm-dd
updated: yyyy-mm-dd
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
- Implementation Strategy
- Implementation Subtasks
- Files / Modules To Touch
- Data Model / Migrations
- API / UI Behavior
- Test Plan
- Security / Privacy / Compliance
- Rollout / Rollback
- Blocking Questions
- Deferred Non-Blocking Questions
- Document Changelog
- Approval

## Implementation Strategy And Subtasks

Plans must explicitly guide execution:

- `simple` plans may recommend `single focused pass` and use `Not applicable` for subtasks when a breakdown would add noise.
- `medium` and `complex` plans must include implementation subtasks.
- Each subtask must include task number, short title, status, execution mode, ownership/files, dependencies, acceptance checks, and progress document name such as `task_1.md`.
- Execution mode must say whether the task is sequential, dependent on another task, in a named parallel group, or independent.
- The strategy must recommend incremental task-by-task execution or parallel execution across multiple implementation subagents, with rationale.
- The strategy must recommend whether `/rubber-duck:orchestrate-implementation` should coordinate the work or whether a simple `/rubber-duck:implement` pass is enough.
- Parallel implementation must only be recommended when tasks can be assigned disjoint write sets and merged without cross-task ordering risk.

## Reviewer Orchestration Notes

- Run the exact pre-built `plan-future-maintainer`, `plan-security-reviewer`, and `plan-staff-engineer` agents before asking for human approval when the agents are available.
- Prefer running independent specialist reviewer agents in parallel when the current assistant environment supports it.
- Wait for all available specialist reviewers, merge their findings, then run `document-reviewer` last on the merged plan.
- Use blocking findings, security/privacy questions, and reviewer conflicts as approval blockers unless they are explicitly deferred by the human as non-blocking.
- If an expected reviewer agent is unavailable, note that gap in the final response and add it to the plan's Blocking Questions, Deferred Non-Blocking Questions, or Approval notes when it affects approval confidence.
- The invoking skill owns the final document. Reviewer agents return findings only; they do not edit the document.
- Do not approve the plan on behalf of the human.

## Approval Loop

If the human requests changes or answers a blocking question, update `plan.md`, update `updated`, preserve the original question with the human answer, add a `Document Changelog` entry explaining what changed and why, rerun affected specialist reviewers and `document-reviewer` when the change materially affects approval readiness, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests more changes, or stops the workflow.

Answered blocking questions must remain in `Blocking Questions` as answered entries. Only open blocking questions prevent approval.

## Approval Updates

If the human later explicitly approves the plan, update the frontmatter:

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
