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
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current assistant session.
   - Do not configure or bundle Jira MCP servers.
   - If Jira access fails, ask the human to paste the Jira title, description, reproduction steps, expected behavior, observed behavior, comments, logs, screenshots, and relevant links.
   - If `$ARGUMENTS` is a prompt, use it as the source of truth.
2. Gather the minimum bug context needed for diagnosis.
   - Capture reproduction steps, expected behavior, observed behavior, frequency, environment, affected users or flows, error messages, logs, screenshots, recent changes, and suspected entry points when available.
   - Ask the human for missing facts when they would materially change the investigation path, root-cause confidence, risk, recommended next step, or approval readiness.
   - Ask as many times as necessary until approval-relevant bug context and root-cause uncertainty are resolved.
   - Do not ask for facts that the human explicitly accepts as deferred and non-blocking.
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
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `document-reviewer` agent.
   - Pass the diagnosis path, source context summary, reproduction evidence, root-cause evidence, and any material constraints from the current session.
   - Do not write a separate review file.
8. Apply reviewer feedback only by updating `diagnosis.md`, and only when it improves correctness, evidence quality, clarity, or approval readiness.
   - Treat blocking issues and missing questions as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
9. Resolve all approval blockers before presenting the diagnosis for approval.
   - Ask the human follow-up questions as many times as necessary.
   - Update `diagnosis.md` after each answer.
   - Rerun `document-reviewer` when an answer materially changes reproduction, expected behavior, observed behavior, root-cause confidence, risk, recommended next step, or approval readiness.
   - Do not leave an approval-relevant question only in the document. Either answer it, record the human's explicit non-blocking deferral, or keep the diagnosis not ready for approval.
10. Tell the human the diagnosis path and that it is pending approval.
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
- Use the rest of the launch prompt only for run-specific context: document path, source summary, reproduction evidence, root-cause evidence, and any material constraints from the current session.
- Do not replace the reviewer with a compressed prompt such as `Please review for completeness...`. A short launch prompt is acceptable only after the named pre-built reviewer has been selected, and it must not restate, narrow, or override the agent definition.
- Let the selected reviewer follow its own scope, operating rules, checklist, and output format from `agents/<agent-name>.md` or the generated Codex TOML.
- If the runtime cannot invoke the named reviewer, read the full matching agent definition from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and perform the same review inline or through the closest available delegation mechanism. Treat this as a fallback and make the unavailability explicit.

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
- Blocking Questions
- Deferred Non-Blocking Questions
- Approval

## Approval Loop

If the human requests changes or answers a blocking question, update `diagnosis.md`, rerun `document-reviewer` when the change materially affects approval readiness, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests more changes, or stops the workflow.

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
