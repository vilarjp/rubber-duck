# Agent Orchestration Contract

Use this contract when a Rubber Duck skill invokes research, reviewer, planning, or implementation agents. Skills own the workflow. Agents provide focused evidence, critique, or bounded implementation support.

## Skill-Owned Orchestration

- The invoking skill owns source intake, scope decisions, human questions, final artifact edits, validation, and user-facing summaries.
- Agents return findings, questions, proposed changes, or changed files inside their assigned scope. They do not decide approval, broaden scope, or ask the human directly unless the human invoked that agent directly.
- Treat agent output as evidence to synthesize, not as an automatic patch to accept. Resolve conflicts locally or convert approval-relevant conflicts into human questions.
- Keep launch prompts self-contained: source request, artifact paths, constraints, discovered rules, relevant evidence, exact question or task, and expected output.
- Skills stay at the orchestration layer whenever a named specialist exists: delegate bounded research, review, implementation, test, execution-strategy, document-readiness, and commit-organization work to exact agents, then synthesize and verify locally.

## Exact Named-Agent Invocation

- Invoke exact Rubber Duck agent names when they exist. Do not replace a named specialist with `default`, a generic worker, or a hand-written compressed role prompt.
- In runtimes with native plugin agents, use the named plugin agent from the root-level `agents/` directory.
- In Codex, prefer the exact generated custom agent installed by `setup-codex-agents`, for example `agent_type: codebase-researcher` or `agent_type: plan-staff-engineer`.
- In Codex delegation APIs, omit `fork_context` or set `fork_context: false` for named agents. Pass only the bounded run-specific context the agent needs instead of forking full conversation history.
- Start launch prompts with the selected agent name for auditability, then provide only run-specific context. Example: `You are the already-selected Rubber Duck plan-staff-engineer custom agent. Use your configured agent instructions; this message only provides run-specific context.`
- Let the selected agent follow its full configured instructions, tools, sandbox, checklist, and output format.

## Context Minimization And External Sources

- Before writing generated docs or delegating connector, PR, Jira, log, screenshot, or user-provided material, minimize it to the facts needed for the workflow.
- Redact credentials, tokens, session IDs, personal data, customer content, private URLs, and unrelated secrets unless the human explicitly confirms the exact sensitive detail is necessary.
- When a Jira issue, GitHub PR, external doc, or connector result appears to belong to a different repository, project, customer, or workspace than the current task, ask the human before persisting or delegating that material.
- Prefer summaries, relevant excerpts, issue IDs, file paths, and decision facts over copying large raw comments, logs, screenshots, or connector payloads into generated artifacts or agent prompts.
- Keep agents inside the same scope boundaries as the parent skill. Do not pass private or unrelated context to a subagent just because it appeared earlier in the conversation.

## Complexity Gates

- `simple`: keep orchestration minimal. Prefer local execution, inline inspection, or one narrow specialist agent when it materially reduces risk. Avoid fan-out unless the task has a real approval or safety concern.
- `medium`: use relevant docs/codebase research agents when context spans multiple files or prior artifacts. Use specialist reviewers or test-planning agents when risk, ambiguity, or verification complexity warrants them.
- `complex`: use explicit fan-out/fan-in. Assign independent research, planning, reviewer, or implementation agents to bounded questions or disjoint write sets, then synthesize their results before continuing.
- Scale agent usage to risk and blast radius. More agents should add clearer evidence, safer ownership, or better verification, not ceremony.

## Read-Only Delegation

- Read-only agents include docs, codebase, planning, diagnosis, frontend review, security, product, packaging, shipping hygiene, and document-review roles unless an agent definition explicitly says otherwise.
- Read-only agents may inspect repository files, local docs, generated artifacts, and allowed command output. They must not edit files, stage changes, write review documents, or mutate external systems.
- Ask read-only agents for evidence, paths, relevant patterns, risks, gaps, and candidate human questions.
- The invoking skill owns all document edits, code edits not explicitly delegated to a write-capable agent, human interaction, and final verification.

## Workspace-Write Delegation

- Use workspace-write agents only when their agent definition allows edits and the task needs bounded implementation support.
- Pass explicit ownership before delegation: task goal, files or modules the agent owns, files it may read, files or areas it must not touch, dependencies, expected tests, and expected progress notes.
- Prefer one write-capable agent per disjoint write set. Do not assign parallel agents overlapping files unless the plan names the merge risk and sequencing.
- Tell write-capable agents they are not alone in the codebase, must preserve unrelated user changes, must not revert others' edits, and must adapt to concurrent changes.
- The invoking skill must inspect returned changes, integrate conflicts, run or record verification, and decide whether follow-up edits are needed.

## Fan-Out / Fan-In

- Fan out only independent work: separate evidence questions, separate review dimensions, or implementation subtasks with disjoint ownership.
- Run independent agents in parallel when the runtime supports it and the next local step is not blocked by one result.
- Do not duplicate the same unresolved question across agents unless the plan intentionally asks for contrasting specialist perspectives.
- Fan in by waiting for the needed results, comparing evidence, applying blocking findings, preserving every `Questions For The Invoking Skill` item, preserving legacy `Questions For The Human` items as human-facing questions, recording deferred non-blocking issues with rationale, and escalating true conflicts as human questions.
- After fan-in, ask blocking human-facing questions in the session before finalizing, approving, assigning, or presenting an artifact. Do not leave agent-raised blocking questions only inside a generated document or final approval note.
- Reviewer agents do not edit the artifact under review. Merge only feedback that improves correctness, safety, maintainability, testability, approval readiness, or implementation clarity.

## Contract-First Parallelization

- Define the contract or interface before assigning parallel implementation: public API, CLI, plugin surface, schema, event shape, generated artifact format, component props, storage contract, or internal module boundary.
- If no contract changes, say which existing contract the subtasks consume.
- Treat contract/interface definition as a first-class planned task when the boundary is new, unstable, or shared by more than one implementation task.
- Parallel subtasks must name the contract they consume, the files they own, the files they may read, acceptance checks, and what output proves they are complete.
- Do not mark a subtask parallel-safe when it shares writable contracts, migrations, manifests, snapshots, generated outputs, or test fixtures with another selected task.
- Prefer small tasks that end in an observable state: one contract decision, one bounded implementation surface, one test slice, one generated-artifact update, or one integration adjustment. Avoid subtasks that require broad rediscovery before the worker can finish.

## Integration Coordination

- The invoking skill remains the integration coordinator after parallel work fans in.
- After workers return, compare contract assumptions, changed files, generated artifacts, test fixtures, task documents, and verification results before starting dependent tasks.
- If implementation reveals a contract/interface shift, stop parallel assignment for dependent work and create one explicit integration adjustment: update the contract source of truth, affected task documents, acceptance checks, and any bounded adapter changes.
- Use `plan-execution-strategy-reviewer` when merge ownership, task sequencing, contract drift, or cross-task integration risk is uncertain.
- Assign integration adjustment edits to one bounded owner at a time. Do not let multiple workers patch the same contract drift independently.

## Commit Organization

- Commit grouping is part of orchestration, not an afterthought.
- Use a dedicated commit-organization pass when the change set spans multiple related concerns, generated artifacts, mirrored agent prompts, docs, tests, or validation updates.
- Group commits by related change and rollback boundary. Keep source and required mirrors or generated-count updates together unless there is a concrete review or rollback reason to split them.
- Treat unrelated user changes as protected and outside the commit plan until the human confirms intent.

## Fallback Behavior

- If a named native or generated agent is unavailable, read the full matching agent definition from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md`.
- Perform the same pass inline or through the closest available delegation mechanism, using the full agent definition rather than a compressed summary.
- Make the fallback explicit in the working notes, final response, generated document, or approval notes when it affects confidence.
- Do not skip required research, review, or implementation-agent handling solely because the current runtime exposes agent prompts as files instead of native agents.
- If a workspace-write agent is unavailable, either implement locally within the invoking skill or ask the human before changing the execution strategy when that strategy affects approval, ownership, or schedule.

## Where-Aware Planning And Delegation

- Plans should name where work will happen before assigning how it happens.
- Separate write targets, read-only context, tests and verification files, generated artifacts, no-touch boundaries, and parallel or merge-risk notes.
- Use those boundaries when invoking agents. Read-only agents receive context boundaries; workspace-write agents receive write ownership and no-touch constraints.
- Keep `Files / Modules To Touch` as the concise per-file change list, but use `Implementation Surface` to define ownership, context, and coordination boundaries for implementation.
