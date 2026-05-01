---
name: plan
description: Generate a concise technical implementation plan from a prompt, Jira link, or existing PRD slug, using code/docs research and specialist reviewers before asking for human approval.
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

## Shared References

Use these shared references when they apply:

- `../_shared/complexity-levels.md` for `simple`, `medium`, and `complex` planning expectations.
- `../_shared/agent-orchestration.md` for skill-owned orchestration, exact named-agent invocation, complexity gates, read-only vs workspace-write delegation, fan-out/fan-in, fallback behavior, and where-aware planning.
- `../_shared/project-rules-discovery.md` before relying on repository conventions.
- `../_shared/source-driven-development.md` when the plan depends on external framework, library, service, or API behavior.
- `../_shared/no-workarounds.md` to reject plans that patch symptoms instead of addressing root causes.
- `../_shared/prd-plan-alignment.md` when planning from a PRD.
- `../_shared/decision-notes.md` for optional mini-ADR-style decision notes in complex plans.
- `../_shared/clarifying-questions.md` to keep human questions focused on approval-relevant uncertainty after investigation.

## Workflow

1. Determine the source context.
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current assistant session.
   - Do not configure or bundle Jira MCP servers.
   - Before writing Jira, connector, log, or external-doc content into a plan or passing it to agents, verify it belongs to the current project/repository or ask the human to confirm cross-project use. Redact or summarize unrelated private details, credentials, tokens, personal data, customer content, private URLs, and raw comments/logs that are not needed for planning.
   - If Jira access fails, ask the human to paste the Jira title, description, acceptance criteria, comments, and relevant links.
   - If `$ARGUMENTS` looks like a slug, search for matching `docs/*-{slug}/prd.md` files.
   - If exactly one matching PRD exists, use it as source context.
   - If multiple matching PRDs exist, ask the human which PRD to use.
   - If no matching PRD exists, treat `$ARGUMENTS` as a free-form planning prompt.
2. Gather only the context needed to write the implementation plan.
   - Inspect the codebase enough to identify the smallest correct implementation path.
   - Prefer repository files, manifests, tests, configuration, existing docs, and relevant nearby source code.
   - When available, use `docs-locator` and `docs-analyzer` to find prior PRDs, plans, diagnoses, task documents, ADRs, and project docs that affect the requested work.
   - When available, use `codebase-researcher` for broad or unfamiliar areas, or run `codebase-locator`, `codebase-analyzer`, and `codebase-pattern-finder` directly for narrower questions.
   - For medium or complex plans, also invoke `learnings-researcher` early to mine prior `docs/`, plans, diagnoses, and task progress for applicable lessons, preserved decisions, dead ends, and rejected approaches.
   - When the planned work depends on a PRD, diagnosis, Jira issue, or prior task docs, also invoke `spec-flow-analyzer` to confirm the upstream chain has no missing acceptance-criteria mapping or dropped requirements before drafting.
   - For pattern-heavy or architectural work, invoke `pattern-recognition-specialist` for a baseline of repo-wide design patterns, anti-patterns, naming drift, and boundary smells.
   - When the plan depends on current third-party API, framework, browser, protocol, or service behavior that is not pinned in the repository, invoke `web-researcher` for bounded external research; otherwise rely on local evidence.
   - Prefer running independent locator and pattern-finding passes in parallel when the current runtime supports it, then synthesize the evidence locally before drafting.
   - Apply Project Rules Discovery before deciding conventions, commands, ownership boundaries, or generated-document formats.
   - When implementation depends on framework, library, cloud, browser, protocol, or third-party API behavior, verify it from repository evidence, local package/source docs, official docs, or version-specific release notes before treating it as a plan fact.
   - Do not inspect private or unrelated project areas unless the request requires it.
3. Ask the human for missing technical or product facts when they would materially change scope, architecture, data handling, security, rollout, or approval.
   - Apply the clarifying-questions reference: investigate first, ask 1-2 focused questions at a time when possible, explain why each answer matters, and classify blocking vs non-blocking uncertainty.
   - Treat questions returned by research, docs, test, or reviewer agents as candidate questions for the parent skill to ask; specialist agents do not ask the human directly unless invoked directly.
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
   - If the source is a PRD, run the PRD-to-Plan Alignment check before reviewer invocation: map PRD goals, acceptance criteria, non-goals, risks, dependencies, and answered blocking questions into plan sections, tests, rollout notes, or explicit out-of-scope rationale.
   - Make the plan specific enough that a future implementer can follow it without rediscovering the same context.
   - Include an `Implementation Surface` section for every plan. This section defines where implementation may happen before describing how it will happen.
   - In `Implementation Surface`, separate write targets, read-only context, tests and verification surfaces, generated artifacts, no-touch boundaries, and parallel or merge-risk notes.
   - Keep `Implementation Surface` focused on ownership and coordination boundaries. Keep `Files / Modules To Touch` as the concise per-file change list.
   - Include a full quality gate in the Test Plan: formatting checks, linting, type checks, builds or compilation, and the full automated test suite when those commands exist.
   - When known, name the focused verification command and expected result for important behavior or regression coverage.
   - For medium-to-complex plans, risky behavior changes, or unclear verification strategy, use `test-plan-architect` when available to draft layered test cases with stable `T###` IDs, fixtures, commands, and manual checks.
   - Classify implementation complexity as `simple`, `medium`, or `complex`.
   - Use the shared complexity reference to scale detail: simple plans stay single-pass when possible, medium plans include clear subtasks, and complex plans include full sequencing, rollout, rollback, and decision context.
   - For medium-to-complex work, include `Implementation Strategy` and `Implementation Subtasks` sections that break the plan into named tasks with dependencies, ownership/files, acceptance checks, execution mode, and expected `task_N.md` progress document names.
   - For simple work, either include one task or explicitly write that a single focused pass is recommended.
   - For complex plans, include `Decision Notes` when architecture, public contracts, data migrations, security, third-party integrations, or intentionally avoided heavier alternatives matter to future implementers.
   - Recommend one execution strategy: `single focused pass`, `incremental task-by-task`, or parallel `implementation-agent` / `test-implementer` delegation.
   - Evaluate orchestration needs in the plan: state whether `/rubber-duck:orchestrate-implementation` should coordinate the plan, whether a simple `/rubber-duck:implement` pass is enough, and whether exact `implementation-agent` or `test-implementer` workers can safely handle independent tasks.
   - Only recommend parallel implementation when subtasks have disjoint ownership, clear interfaces, no unresolved blockers, and low merge risk. Mark sequential dependencies when tasks share files, migrations, feature flags, public contracts, or test fixtures.
   - Do not approve or preserve workaround strategies unless the plan explicitly names the root cause, why a temporary mitigation is necessary, how it is constrained, and what follow-up removes it.
6. For medium or complex plans, run the plan-time council on the generated `plan.md` before invoking the technical reviewers.
   - Council voices debate the proposal; they do not finalize the plan.
   - Each council voice steel-mans the proposal, attacks its strongest form, and concedes when the plan already addresses the concern.
   - Invoke the exact pre-built council agents that match the plan's surface:
     - `plan-thinker` when the framing may be wrong or the problem class is unclear.
     - `plan-devils-advocate` when production risk, abuse risk, or rollback risk is non-trivial.
     - `plan-pragmatic-engineer` when the plan introduces abstractions, shared service surface, or recurring maintenance burden.
     - `plan-architect-advisor` when the plan changes module boundaries, public contracts, or layering.
     - `plan-product-mind` when the plan derives from a PRD whose hypothesis or success signals could be sharpened.
     - `plan-security-advocate` when the plan touches authorization, secrets, abuse cases, third-party integrations, or PII.
   - For simple plans, allow zero council agents or one targeted council agent — do not always-on the council on routine work.
   - Run available council voices in parallel; merge their `Final Position` outputs before invoking the technical reviewers.
   - Treat any council voice's `Final Position` that is not an explicit pass (`proposal survives` or `keep current framing`) as a blocker for the technical-review pass unless the human explicitly resolves or defers it. This includes `reframe`, `simpler alternative`, `scope down`, `defer`, `inconclusive`, and other non-pass outcomes.
7. Run technical specialist reviewer agents on the merged plan.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `plan-future-maintainer` agent.
   - Invoke the exact pre-built `plan-security-reviewer` agent for local security lanes that remain coordinator-owned: validation/output encoding, logging exposure, abuse-case coverage, secrets/config handling, cross-lane risk synthesis, and reviewer questions. For medium/complex plans, you may also invoke the relevant `plan-compliance-reviewer`, `plan-data-handling-reviewer`, `plan-authz-reviewer`, and `plan-supply-chain-reviewer` specialists directly; when you do, pass their outputs to `plan-security-reviewer` and ask it not to duplicate those specialist lanes.
   - Invoke the exact pre-built `plan-staff-engineer` agent (lead reviewer) for cross-lane architecture/execution synthesis. For medium/complex plans, you may also invoke the relevant `plan-design-reviewer`, `plan-observability-reviewer`, and `plan-execution-strategy-reviewer` specialists directly; when you do, pass their outputs to `plan-staff-engineer` and ask it not to duplicate those specialist lanes.
   - When the planned work changes public APIs, CLIs, plugin interfaces, schemas, events, webhooks, or generated artifacts consumed by other systems, also invoke the exact pre-built `api-contract-reviewer` agent.
   - When the planned work introduces data shape migrations, storage format changes, destructive transforms, backfills, or retention/deletion changes, also invoke the exact pre-built `data-migrations-reviewer` agent.
   - Run direct plan specialists in parallel when the current assistant environment supports it, then wait for their outputs before invoking `plan-security-reviewer` or `plan-staff-engineer` for coordinator/lead synthesis.
   - Run reviewers in parallel only when they do not feed a later coordinator or lead reviewer.
   - Pass each reviewer the plan path, source context summary, discovered project rules that affect the plan, source-driven verification notes, and any relevant PRD or Jira context.
   - Do not write separate review files.
8. Merge council and technical reviewer feedback into `plan.md` when it improves correctness, security, maintainability, testability, rollout safety, or approval readiness.
   - Apply blocking findings before finalizing.
   - Treat security/privacy questions, blocking findings, blocking council positions, and human questions as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Preserve reviewer conflicts as questions for the human instead of guessing.
   - Keep non-blocking style preferences out unless they remove real ambiguity.
9. Run `document-reviewer` on the merged `plan.md` as the final approval-readiness pass.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `document-reviewer` agent.
   - For long or complex plans, repeated terminology, or several answered blocking questions, tell `document-reviewer` that a coherence pass is required. `document-reviewer` owns any `document-coherence-reviewer` delegation so coherence findings are not duplicated.
   - When cross-document references, PRD-to-plan continuity, task progress drift, or code-review handoff drift could affect approval readiness, rerun or invoke `spec-flow-analyzer` before `document-reviewer`; do not route cross-document continuity to coherence-only review.
   - Merge any approval-readiness fixes before asking the human.
10. Resolve all approval blockers before presenting the plan for approval.
   - Ask the human follow-up questions as many times as necessary.
   - Update `plan.md` after each answer.
   - Preserve the original blocking question, mark it `answered`, record the human's answer with the local date, and summarize the document impact. Do not remove answered blocking questions during updates.
   - Add a `Document Changelog` entry for each human answer, change request, reviewer-driven material update, approval, or requested-changes decision.
   - Update the frontmatter `updated` field to the local date whenever the document changes.
   - Rerun the affected council voices, specialist reviewers, coordinator/lead reviewers, and `document-reviewer` when an answer materially changes scope, architecture, data handling, security, rollout, tests, or approval readiness.
   - Do not leave an approval-relevant question only in the document. Either answer it, record the human's explicit non-blocking deferral, or keep the plan not ready for approval.
11. Tell the human the plan path and that it is pending approval.

- Ask them to review it and explicitly approve or request changes.

## Runtime Compatibility

- Follow `../_shared/agent-orchestration.md` for native plugin agents, Codex generated custom agents, exact named-agent invocation, full-definition fallback, and inline fallback behavior.
- Do not skip configured research, test-planning, or reviewer passes solely because the current runtime exposes agent prompts as files instead of native agents.

## Research And Test Agent Invocation Contract

- Follow `../_shared/agent-orchestration.md` for skill-owned orchestration, complexity gates, read-only delegation, fan-out/fan-in, and fallback behavior.
- Use exact pre-built agent names for research and test planning roles, such as `codebase-researcher`, `docs-locator`, `docs-analyzer`, or `test-plan-architect`.
- Keep read-only research agents read-only. They return evidence, paths, patterns, and questions; the parent skill owns the plan document and all human interaction.
- Use `codebase-researcher` when the question spans multiple areas. Use `codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `docs-locator`, and `docs-analyzer` directly when their narrower scopes can run independently.
- In Codex delegation APIs, select the exact custom-agent name when it exists, for example `agent_type: codebase-researcher` or `agent_type: test-plan-architect`; otherwise perform the same pass inline from the agent definition.
- Start launch prompts with the selected agent name for auditability, then provide only run-specific context: source request, candidate artifact paths, known constraints, and the exact research or test-planning question.
- Preserve returned `Questions For The Invoking Skill` and legacy `Questions For The Human` sections in the planning flow. Ask blocking questions before approval; record deferred non-blocking questions separately.

## Reviewer Invocation Contract

- Follow `../_shared/agent-orchestration.md` for exact named-agent invocation, read-only delegation, fan-out/fan-in, and fallback behavior.
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
- PRD Alignment
- Current System Notes
- Proposed Approach
- Implementation Surface
- Implementation Strategy
- Implementation Subtasks
- Decision Notes
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

- Every plan must include an `Implementation Surface` section before `Implementation Strategy`.
- `Implementation Surface` must identify write targets, read-only context, tests and verification surfaces, generated artifacts, no-touch boundaries, and parallel or merge-risk notes. Use `Not applicable` only for categories that truly do not apply.
- `simple` plans may recommend `single focused pass` and use `Not applicable` for subtasks when a breakdown would add noise.
- `medium` and `complex` plans must include implementation subtasks.
- `complex` plans should include decision notes for important architecture, public-contract, data, migration, security, or third-party integration decisions.
- Each subtask must include task number, short title, status, execution mode, ownership/files, dependencies, acceptance checks, and progress document name such as `task_1.md`.
- When a focused command is known, acceptance checks should include the command and the expected result instead of only saying "add tests" or "verify behavior".
- Execution mode must say whether the task is sequential, dependent on another task, in a named parallel group, or independent.
- The strategy must recommend incremental task-by-task execution or parallel execution across exact `implementation-agent` / `test-implementer` workers, with rationale.
- The strategy must recommend whether `/rubber-duck:orchestrate-implementation` should coordinate the work or whether a simple `/rubber-duck:implement` pass is enough.
- Parallel implementation must only be recommended when tasks can be assigned disjoint write sets and merged without cross-task ordering risk.

## Reviewer Orchestration Notes

- Run the exact pre-built `plan-future-maintainer`, `plan-security-reviewer`, and `plan-staff-engineer` agents before asking for human approval when the agents are available. `plan-security-reviewer` may return no findings for plans with no security/privacy surface; it still preserves the coordinator output contract.
- Prefer running direct specialist reviewer agents in parallel when the current assistant environment supports it, then pass their outputs to the relevant coordinator or lead reviewer for synthesis and question preservation.
- Do not run a coordinator or lead reviewer in the same fan-out batch as specialists whose outputs it must synthesize.
- Wait for all available specialist reviewers and coordinator reviewers, merge their findings, then run `document-reviewer` last on the merged plan.
- Use blocking findings, security/privacy questions, and reviewer conflicts as approval blockers unless they are explicitly deferred by the human as non-blocking.
- If an expected reviewer agent is unavailable, note that gap in the final response and add it to the plan's Blocking Questions, Deferred Non-Blocking Questions, or Approval notes when it affects approval confidence.
- The invoking skill owns the final document. Reviewer agents return findings only; they do not edit the document.
- Do not approve the plan on behalf of the human.

## Approval Loop

If the human requests changes or answers a blocking question, update `plan.md`, update `updated`, preserve the original question with the human answer, add a `Document Changelog` entry explaining what changed and why, rerun affected council voices, specialist reviewers, coordinator/lead reviewers, and `document-reviewer` when the change materially affects approval readiness, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests more changes, or stops the workflow.

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
