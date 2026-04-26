---
name: orchestrate-implementation
description: Coordinate implementation of an approved Rubber Duck plan across planned subtasks, running sequential tasks locally or parallel-safe tasks through implementation subagents while preserving per-task progress documents.
disable-model-invocation: true
argument-hint: "[approved plan slug/path | optional task ids | optional sequential/parallel hint]"
---

# Orchestrate Implementation Skill

Use this skill to coordinate implementation from an approved `plan.md` that contains `Implementation Strategy` and `Implementation Subtasks`.

This skill is the orchestration layer. It decides which planned task or tasks should run, whether parallel execution is safe, how workers are assigned, and whether each completed subtask produced the required `task_N.md` progress document. It is standalone: do not require another Rubber Duck skill to be invoked in order to complete an orchestration run.

## Inputs

Accept `$ARGUMENTS` as one of:

- A slug or source hint pointing to an approved plan folder.
- A direct `docs/yyyy-mm-dd-{slug}/plan.md` path.
- Optional task IDs, such as `Task 2` or `tasks 2,4,5`.
- Optional execution hint, such as `sequential`, `parallel`, `next`, or `all-ready`.

If no useful input is provided, ask the human for the approved plan slug, plan path, or intended task IDs.

## Output

Coordinate code and test changes for one or more planned subtasks.

Each completed planned subtask must have a matching progress document in the plan folder:

```text
docs/yyyy-mm-dd-{slug}/task_N.md
```

Do not create a separate orchestration report unless the human explicitly asks for one. The per-task documents are the durable implementation history.

## Shared References

Use these shared references when they apply:

- `../_shared/complexity-levels.md` when interpreting `simple`, `medium`, or `complex` approved plans.
- `../_shared/project-rules-discovery.md` before deciding local conventions, commands, file placement, or generated-document formats.
- `../_shared/source-driven-development.md` when a selected task depends on external framework, library, service, or API behavior.
- `../_shared/no-workarounds.md` before accepting task implementations or temporary mitigations.

## Workflow

1. Resolve the approved plan.
   - Search for matching `docs/*-{slug}/plan.md` files when `$ARGUMENTS` looks like a slug.
   - Use the provided plan path when one is explicit.
   - If multiple plans match, ask the human which plan to use.
   - If no plan matches, ask for the plan path or slug.
   - Require `status: approved` before orchestrating implementation. If the plan is `pending-approval` or `requested-changes`, ask the human whether to stop, approve/update the plan first, or proceed with explicit risk acceptance.
2. Read orchestration context.
   - Read `Implementation Strategy`, `Implementation Subtasks`, `Decision Notes`, `Blocking Questions`, `Deferred Non-Blocking Questions`, `Test Plan`, `Files / Modules To Touch`, and any security, rollout, migration, or plan-approval notes.
   - Treat the plan's `simple`, `medium`, or `complex` classification as execution guidance: simple plans should normally run as one focused pass, medium plans should follow subtasks, and complex plans require extra care around sequencing, rollback, security, and decision context.
   - Inspect existing `task_*.md` documents in the same folder to identify completed tasks, partial tasks, deviations, blocked tasks, and the recommended next task.
   - Treat existing `task_N.md` documents as completed-work history. Do not repeat completed subtasks unless the human explicitly asks for a correction or resume.
3. Build the task queue.
   - If the human named task IDs, consider only those tasks and their unmet dependencies.
   - Otherwise choose the next ready task for `incremental task-by-task` plans.
   - For `parallel implementation subagents` plans, identify all ready tasks in the same parallel-safe group when the human asked for parallel execution or all-ready execution.
   - A task is ready only when its dependencies are complete, no open blocking questions affect it, and its ownership/files do not conflict with another selected task.
   - If the plan has no subtasks, fall back to a single focused implementation pass and note that the plan should be updated later if the work is medium-to-complex.
4. Select execution mode.
   - Use sequential execution when the plan recommends a single focused pass or incremental task-by-task execution.
   - Use sequential execution when tasks share files, migrations, feature flags, public contracts, test fixtures, release steps, or security-sensitive state.
   - Use parallel subagents only when the plan explicitly marks tasks as parallel-safe, selected tasks have disjoint write sets, each task has clear acceptance checks, and the current runtime supports implementation workers that can edit files.
   - If parallel execution was requested but unsafe, explain the specific dependency or conflict and run the next ready task sequentially unless the human asks to stop.
5. Execute selected tasks.
   - For sequential execution, implement one selected task at a time with scoped edits, TDD when feasible, focused tests, full quality gate, and `task_N.md` progress documentation.
   - In sequential execution, follow the same TDD discipline as `implement`: run an existing nearby test first when practical, add or adjust the narrowest useful failing test, confirm it fails for the expected reason, make the smallest correct change, and use Verification Mode for non-behavior changes where artificial TDD would add no confidence.
   - In sequential execution, apply Project Rules Discovery, Source-Driven External API Checks, and the No-Workarounds Checklist the same way `implement` does.
   - For parallel execution, launch one implementation subagent per selected task when the runtime supports it.
   - Give each subagent a self-contained prompt with:
     - Approved plan path and relevant plan excerpts.
     - Exact task ID and task text.
     - Ownership/files and explicit write boundaries.
     - Dependencies and already completed `task_N.md` docs.
     - Required focused tests, including any known focused command and expected result.
     - Relevant discovered project rules, source-driven external API verification needs, and any no-workarounds constraints from the approved plan.
     - TDD expectations: run an existing nearby test first when practical, confirm the new focused test fails for the expected reason before implementation, and use Verification Mode for non-behavior changes instead of forcing artificial tests.
     - Full quality gate expectations.
     - Required progress document path.
     - Instruction that other agents may be editing disjoint tasks, and it must not revert or rewrite others' work.
   - Do not assign two workers to the same file or task.
   - Do not delegate a task whose immediate dependency is still running unless the plan explicitly allows it.
6. Fan in and integrate.
   - Wait for every launched implementation subagent before finalizing orchestration.
   - Review each worker's changed files, tests, and `task_N.md` document before starting another dependent task.
   - Reject worker changes that rely on untracked workaround smells unless the worker records a constrained temporary mitigation and required follow-up.
   - Resolve non-overlapping worker changes together only after confirming they stayed within ownership boundaries.
   - If workers conflict, stop and ask the human before resolving by dropping or overwriting another worker's changes.
   - If any task reveals a material plan gap, stop and ask before changing the approved plan or continuing with a different scope.
7. Verify the run.
   - Ensure each completed selected task has a completed `task_N.md` progress document.
   - Ensure each task document includes source plan task, implementation summary, changed files, tests/verification, TDD or Verification Mode notes, deviations/follow-ups, blocking questions, deferred non-blocking questions, `Document Changelog`, and next task.
   - Run focused tests for each completed task.
   - Run the full quality gate before final summary unless the plan or human explicitly scoped the run to discovery only.
   - If a full quality gate category is unavailable, blocked, too expensive, or cannot be inferred safely, state that plainly in the final summary.
8. Summarize orchestration.
   - List plan path.
   - List execution mode used and why.
   - List completed tasks and their `task_N.md` documents.
   - List changed files.
   - List focused tests and full quality gate commands/results.
   - Identify the next ready task, remaining blocked tasks, or state that plan implementation appears complete.
   - Call out skipped TDD, Verification Mode use, skipped verification, assumptions, risks, worker conflicts, or required plan updates.
   - When adjacent issues were noticed but intentionally left out of scope, add a concise `Noticed but not touching` note.

## Parallel Safety Rules

Parallel execution is allowed only when all of these are true:

- The approved plan recommends `parallel implementation subagents` or explicitly marks the selected tasks as parallel-safe.
- Selected tasks have disjoint ownership/files.
- No selected task depends on another selected task's unfinished output.
- Selected tasks do not share migrations, data model changes, generated files, snapshots, package manifests, release steps, or public contracts.
- Security-sensitive tasks do not require ordering or a shared threat-model decision.
- Each task has a clear `task_N.md` output path and acceptance checks, including focused verification commands and expected results when known.
- The current runtime can run implementation workers with write access and clear ownership boundaries.

If any condition is false, run sequentially.

## Relationship To `implement`

- Use `orchestrate-implementation` when the approved plan has subtasks or parallelization decisions.
- Use `implement` for a direct prompt, a single planned subtask, a bug fix, a code-review adjustment, or a small approved plan that does not need coordination.
- Orchestration may delegate implementation work, but this skill owns the run end to end. The implementation rules remain the same: focused scope, changed lines trace to the plan or directly required tests/integration work, TDD when feasible, Verification Mode for non-behavior changes, minimal change, verification, and one `task_N.md` per completed planned subtask.

## Final Response Requirements

The final response must include:

- Plan path.
- Execution mode used: sequential or parallel.
- Completed tasks and progress documents.
- Changed files.
- Focused tests and full quality gate commands/results.
- Next ready task or remaining blocked tasks.
- Skipped TDD, Verification Mode use, and any `Noticed but not touching` items.
- Remaining risks, assumptions, unavailable verification, or plan-update needs.
