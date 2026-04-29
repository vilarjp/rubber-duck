---
name: diagnosis
description: Investigate a bug from a prompt or Jira link, document reproduction, evidence-backed root cause, solution options, and review it with root-cause and document specialist agents before asking for human approval.
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

## Shared References

Use these shared references when they apply:

- `../_shared/project-rules-discovery.md` before relying on repository conventions, diagnostics, or verification commands.
- `../_shared/source-driven-development.md` when the suspected cause depends on external framework, library, service, or API behavior.
- `../_shared/no-workarounds.md` when evaluating solution options and recommended next steps.
- `../_shared/agent-orchestration.md` for skill-owned orchestration, exact named-agent invocation, read-only delegation, fan-out/fan-in, fallback behavior, and how specialist questions flow back to the parent skill.
- `../_shared/clarifying-questions.md` to ask only diagnosis-shaping questions that code and evidence cannot answer.

## Agent Crew

- Use `docs-locator` and `docs-analyzer` when prior plans, diagnoses, task documents, release notes, ADRs, or known-issue docs may affect the bug.
- Use `codebase-researcher` for broad or unfamiliar failure areas, or invoke `codebase-locator`, `codebase-analyzer`, and `codebase-pattern-finder` directly for narrow evidence questions.
- Run `diagnosis-root-cause-investigator` after drafting the diagnosis and before `document-reviewer` to challenge evidence quality, root-cause confidence, alternate hypotheses, affected flows, and recommended next steps.
- Run `document-reviewer` last as the approval-readiness check after root-cause feedback has been merged.

## Workflow

1. Determine the source context.
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current assistant session.
   - Do not configure or bundle Jira MCP servers.
   - If Jira access fails, ask the human to paste the Jira title, description, reproduction steps, expected behavior, observed behavior, comments, logs, screenshots, and relevant links.
   - If `$ARGUMENTS` is a prompt, use it as the source of truth.
2. Gather the minimum bug context needed for diagnosis.
   - Capture reproduction steps, expected behavior, observed behavior, frequency, environment, affected users or flows, error messages, logs, screenshots, recent changes, and suspected entry points when available.
   - Ask the human for missing facts when they would materially change the investigation path, root-cause confidence, risk, recommended next step, or approval readiness.
   - Apply the clarifying-questions reference: investigate first when possible, ask 1-2 focused questions at a time, explain why each answer matters, and classify blocking vs non-blocking uncertainty.
   - Ask as many times as necessary until approval-relevant bug context and root-cause uncertainty are resolved.
   - Do not ask for facts that the human explicitly accepts as deferred and non-blocking.
3. Inspect the codebase and evidence without changing project files.
   - Read relevant source, tests, configuration, logs, documentation, git history, and local diffs.
   - When available, use `docs-locator` and `docs-analyzer` to find prior plans, diagnoses, task documents, release notes, ADRs, or known-issue docs that affect the bug.
   - When available, use `codebase-researcher` for broad or unfamiliar failure areas, or run `codebase-locator`, `codebase-analyzer`, and `codebase-pattern-finder` directly for narrower investigation questions.
   - Prefer codebase investigation plus human interview over browser automation. Do not add parallel browser reproduction unless the human asks for it or the bug cannot be understood without it.
   - Apply Project Rules Discovery before relying on local conventions, commands, generated artifacts, or diagnostics.
   - When the diagnosis depends on framework, library, cloud, browser, protocol, or third-party API behavior, verify that behavior from repository evidence, local package/source docs, official docs, release notes, or existing tests when feasible.
   - Run read-only searches and diagnostics where useful.
   - If reproducing the bug or running tests would intentionally create or modify repository files other than the diagnosis document, ask the human first or record the command in the Verification Plan instead.
4. Form and validate hypotheses.
   - Tie each hypothesis to concrete evidence from the prompt, Jira content, code, tests, logs, or recent changes.
   - Separate confirmed facts from assumptions and unknowns.
   - Prefer the simplest explanation that fits the evidence.
   - Do not recommend workaround fixes unless the root cause is identified or the document explicitly labels the mitigation as temporary, constrained, and requiring follow-up.
5. Derive the output folder.
   - Use the local current date in `yyyy-mm-dd` format.
   - Use a human-provided slug when available.
   - Otherwise derive a short kebab-case slug from the bug symptom or affected behavior.
6. Draft a concise diagnosis.
   - Use `templates/diagnosis.md` from this skill folder as the default structure.
   - Include only sections that help decide the next implementation or product action.
   - Do not implement fixes, edit tests, update configuration, or change source code.
7. Run the `diagnosis-root-cause-investigator` agent on the generated `diagnosis.md`.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `diagnosis-root-cause-investigator` agent.
   - Pass the diagnosis path, bug source summary, reproduction evidence, root-cause evidence, affected files or flows, competing hypotheses, and any material constraints from the current session.
   - Do not write a separate review file.
8. Apply root-cause investigator feedback only when it improves evidence quality, root-cause confidence, affected-flow clarity, recommendation quality, or approval readiness.
   - Treat evidence gaps, unsupported root causes, workaround risks, and missing questions as approval blockers unless the investigator explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Preserve alternate hypotheses as open investigation notes when they are plausible but not blocking.
9. Run the `document-reviewer` agent on the generated `diagnosis.md`.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `document-reviewer` agent.
   - Pass the diagnosis path, source context summary, reproduction evidence, root-cause evidence, and any material constraints from the current session.
   - Do not write a separate review file.
10. Apply document reviewer feedback only by updating `diagnosis.md`, and only when it improves correctness, evidence quality, clarity, or approval readiness.
   - Treat blocking issues and missing questions as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
11. Resolve all approval blockers before presenting the diagnosis for approval.
   - Ask the human follow-up questions as many times as necessary.
   - Update `diagnosis.md` after each answer.
   - Preserve the original blocking question, mark it `answered`, record the human's answer with the local date, and summarize the document impact. Do not remove answered blocking questions during updates.
   - Add a `Document Changelog` entry for each human answer, change request, reviewer-driven material update, approval, or requested-changes decision.
   - Update the frontmatter `updated` field to the local date whenever the document changes.
   - Rerun `diagnosis-root-cause-investigator` and `document-reviewer` when an answer materially changes reproduction, expected behavior, observed behavior, root-cause confidence, risk, recommended next step, or approval readiness.
   - Do not leave an approval-relevant question only in the document. Either answer it, record the human's explicit non-blocking deferral, or keep the diagnosis not ready for approval.
12. Tell the human the diagnosis path and that it is pending approval.
   - Ask them to review it and explicitly approve or request changes.

## Runtime Compatibility

- Follow `../_shared/agent-orchestration.md` for native plugin agents, Codex generated custom agents, exact named-agent invocation, full-definition fallback, and inline fallback behavior.
- Do not skip configured docs, codebase, root-cause, or reviewer passes solely because the current runtime exposes agent prompts as files instead of native agents.

## Reviewer Invocation Contract

- Follow `../_shared/agent-orchestration.md` for exact named-agent invocation, read-only delegation, fan-out/fan-in, and fallback behavior.
- Invoke reviewer roles by exact pre-built agent name, such as `diagnosis-root-cause-investigator` or `document-reviewer`.
- In Codex delegation APIs, selecting a reviewer means setting the reviewer as the agent type or custom-agent name, for example `agent_type: diagnosis-root-cause-investigator`. Do not use `default`, `worker`, or a newly-created generic subagent when the named reviewer exists.
- In Codex, omit `fork_context` or set `fork_context: false` for named reviewer agents. Do not try a full-history/context fork first; named custom agents must receive a self-contained launch prompt.
- Start each launch prompt with the selected reviewer name for auditability, for example: `You are the already-selected Rubber Duck diagnosis-root-cause-investigator custom agent. Use your configured agent instructions; this message only provides run-specific context.`
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
- Reproduction
- Observed Behavior
- Expected Behavior
- Investigation Notes
- Probable Root Cause
- Affected Files / Flows
- Solution Options
- Recommended Next Step
- Verification Plan
- Workaround / Root-Cause Check
- Blocking Questions
- Deferred Non-Blocking Questions
- Document Changelog
- Approval

## Approval Loop

If the human requests changes or answers a blocking question, update `diagnosis.md`, update `updated`, preserve the original question with the human answer, add a `Document Changelog` entry explaining what changed and why, rerun `diagnosis-root-cause-investigator` and `document-reviewer` when the change materially affects root-cause confidence or approval readiness, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests more changes, or stops the workflow.

Answered blocking questions must remain in `Blocking Questions` as answered entries. Only open blocking questions prevent approval.

## Approval Updates

If the human later explicitly approves the diagnosis, update the frontmatter:

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
