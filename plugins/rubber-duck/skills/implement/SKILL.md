---
name: implement
description: Implement a feature, bug fix, quick win, or review adjustment from a prompt, Jira link, or approved artifact slug, using focused TDD when feasible and keeping changes scoped.
disable-model-invocation: true
argument-hint: "[implementation prompt | Jira link | plan/diagnosis/code-review slug]"
---

# Implement Skill

Use this skill to make code and test changes in the target project for a feature, bug fix, quick win, or code review adjustment.

For approved plans with multiple subtasks, dependencies, or parallelization decisions, prefer `/rubber-duck:orchestrate-implementation` as the coordinator. Use this skill directly for direct prompts, small single-pass plans, or one specific planned subtask.

## Inputs

Accept `$ARGUMENTS` as one of:

- A free-form implementation request.
- A Jira link.
- A slug or source hint pointing to an existing plan, diagnosis, or code-review folder.

If no useful input is provided, ask the human for the implementation request, Jira link, or approved artifact slug.

## Output

Change code and tests in the target project.

When implementing from an approved plan that contains `Implementation Subtasks`, create or update one progress document per completed subtask in the same docs folder:

```text
docs/yyyy-mm-dd-{slug}/task_N.md
```

Use `templates/task.md` from this skill folder as the default structure. Do not create task progress documents for direct prompts or artifacts without planned subtasks unless the human explicitly asks for them.

If implementation reveals a material gap or contradiction in an approved plan, diagnosis, code-review document, or planned subtask, ask the human before changing that document or continuing with a different scope.

## Workflow

1. Determine the source context.
   - If `$ARGUMENTS` includes a Jira link, try to read it only through authenticated tools already available in the current assistant session.
   - Do not configure or bundle Jira MCP servers.
   - If Jira access fails, ask the human to paste the Jira title, description, acceptance criteria, comments, reproduction steps, logs, and relevant links.
   - If `$ARGUMENTS` looks like a slug, search for matching `docs/*-{slug}/plan.md`, `docs/*-{slug}/diagnosis.md`, and `docs/*-{slug}/code-review.md` files.
   - When a matching `plan.md` exists, also inspect `docs/*-{slug}/task_*.md` progress documents in the same folder.
   - If exactly one relevant artifact exists, use it as source context.
   - If multiple relevant artifacts exist, ask the human which one to use.
   - If no matching artifact exists, treat `$ARGUMENTS` as a free-form implementation request.
2. Confirm the implementable scope.
   - Prefer approved plans, diagnoses, and code-review documents when they exist.
   - When an approved plan includes `Implementation Subtasks`, treat those subtasks as the implementation queue.
   - Read existing `task_N.md` documents before editing so completed subtasks are not repeated.
   - If the human names a specific subtask, implement only that subtask unless its dependencies are incomplete.
   - If no subtask is named, choose the next ready subtask from the plan: the first uncompleted sequential task whose dependencies are complete, or the next independent task from the recommended parallel group.
   - For `incremental task-by-task` plans, complete one planned subtask per run unless the human explicitly asks for a larger batch.
   - For `parallel implementation subagents` plans, only coordinate multiple implementation subagents when the runtime supports safe parallel workers, the plan marks tasks as parallel-safe with disjoint ownership, and the current request authorizes implementing more than one task. Otherwise proceed with one ready task and note the parallel recommendation in the final summary.
   - When delegating parallel subtasks, give each implementation subagent an explicit task ID, ownership/files, dependencies, expected tests, and progress-document path; tell each subagent that other agents may be editing disjoint tasks and they must not revert others' work.
   - Keep the change scoped to the requested behavior, bug, or review adjustment.
   - Treat the requested behavior, approved artifact, review comment, or changed-file scope as the boundary for edits; do not modify unrelated files just because they are nearby.
   - Inside files that must be edited, touch only the lines required for the requested behavior, tests, imports, or directly necessary integration; do not reformat, clean up, reorder, or rewrite unchanged lines opportunistically.
   - Ask the human when missing information would materially change behavior, data handling, migration needs, security posture, or the intended files to touch.
   - Record smaller uncertainties as assumptions in the final summary instead of blocking on them.
3. Inspect the codebase and conventions.
   - Read relevant source, tests, configuration, dependency manifests, generated artifacts, and directly applicable patterns before editing.
   - Use nearby files and unchanged lines in touched files only when they are needed to understand the requested change or local convention; do not review, critique, or opportunistically clean up unrelated nearby code.
   - Check `git status` before modifying files so unrelated user changes are preserved.
   - Work with existing user changes when they affect the task; do not revert changes you did not make.
4. Follow TDD whenever feasible.
   - Add or adjust a focused failing test for the requested behavior before implementation when the project has a practical test harness.
   - If a failing test cannot be written first because the project has no suitable test setup, the change is documentation-only, or the cost is disproportionate, state that reason in the final summary.
   - Keep tests targeted to meaningful behavior and regression risk; add tests only where they provide real confidence rather than broad coverage churn.
5. Implement the smallest correct change.
   - Prefer existing helpers, patterns, frameworks, naming, layering, and file organization.
   - Keep the change set small and focused: make the minimal clean change that fully solves the specific problem.
   - Apply KISS and YAGNI; avoid speculative abstractions, broad refactors, new dependencies, architecture changes, generated file updates, or public API changes unless clearly required by the source context.
   - Prefer early returns and guard clauses over avoidable nested branches when they make the changed code clearer.
   - Do not introduce nested ternary expressions; use named variables, guard clauses, `if`/`else`, or small helpers instead.
   - Avoid unrelated refactors, broad formatting churn, or cleanup that does not directly contribute to the requested fix.
   - Handle validation, errors, authorization, privacy, logging, and secrets consistently with the local stack.
6. Verify the change with a full quality gate.
   - Run the focused test or check that covers the edited behavior.
   - Discover repository-native verification commands from package manifests, lockfiles, task runners, CI workflows, Makefiles, and project documentation.
   - Before the final summary, run every available non-mutating command that checks formatting, linting, type checking, builds or compilation, and the full automated test suite.
   - For JavaScript or TypeScript projects, this includes Prettier in check mode, ESLint, `tsc` or the repo's typecheck script, and all existing test scripts when those tools are present.
   - Prefer a single repo-native `check`, `verify`, `ci`, or equivalent command only when the repository evidence shows that it covers the relevant formatting, linting, type checking, build, and test categories; otherwise run the individual commands.
   - Do not run formatters, linters, generators, snapshots, or other tools in write/fix/update mode unless the requested implementation requires it or the human explicitly asks for it.
   - If an important verification command is unavailable, too expensive, blocked, or cannot be inferred safely, say so clearly in the final summary and do not imply that category passed.
7. Write subtask progress documents when following planned subtasks.
   - For each completed planned subtask, create or update `task_N.md` in the same docs folder as the plan.
   - Use `templates/task.md` as the default structure.
   - Set `created` when the task document is first created and `updated` to the local date on every task-document update.
   - Include the source plan path, planned task text, execution mode, dependencies, implementation summary, changed files, tests and verification, deviations, follow-ups, and recommended next task.
   - Preserve any blocking question raised during the subtask; when the human answers, keep the original question, mark it `answered`, record the human answer with the local date, and explain the task impact.
   - Add a `Document Changelog` entry for every human answer, change request, material implementation update, verification update, or correction.
   - Do not mark a task document `completed` while open blocking questions remain, planned dependencies are incomplete, or required verification for that subtask has not run or been explicitly accepted as unavailable.
   - If a completed subtask deviates from the approved plan, record the deviation and human approval. If approval is missing and the deviation materially changes scope, stop and ask before proceeding.
8. Do not invoke reviewer agents.
   - Reviewer agents are invoked by the `code-review` skill, not by `implement`.
9. Summarize the result.
   - List changed files.
   - List completed planned subtasks and progress documents created or updated.
   - Identify the next planned subtask or state that the plan implementation appears complete.
   - List tests and checks run.
   - Call out skipped TDD, skipped verification, assumptions, risks, or follow-up work.

## TDD Guidance

Use this default loop when practical:

1. Reproduce or encode the current failure with the narrowest useful test.
2. Run the focused test and confirm it fails for the expected reason.
3. Make the smallest implementation change.
4. Run the focused test until it passes.
5. Add edge-case coverage only when it protects important behavior or a known regression path.
6. Run the full quality gate: formatting checks, linting, type checks, builds or compilation, and the full automated test suite when those commands exist.

## Artifact Handling

When using an existing artifact:

- Treat `status: approved` artifacts as the implementation contract.
- Treat `pending-approval` or `requested-changes` artifacts as context, and ask before implementing if approval status affects whether work should proceed.
- Do not silently expand scope beyond the artifact.
- If code evidence conflicts with the artifact, explain the conflict and ask before choosing a different direction.
- For approved plans with `Implementation Subtasks`, treat existing `task_N.md` documents as completed-work history and the source of truth for which planned tasks have already been implemented.
- Do not remove or overwrite another task's progress document. Update an existing task document only when resuming, correcting, or adding verification for that same task.
- If the plan recommends parallel execution, prefer `/rubber-duck:orchestrate-implementation` to coordinate workers. If this skill is invoked directly and cannot safely coordinate or merge parallel implementation work, implement the next ready task sequentially and record that choice in the task document and final summary.

## Subtask Progress Documents

Every completed planned subtask must have a matching progress document:

```yaml
---
title: Task N: Short Task Title
slug: short-slug
type: implementation-task
status: completed
created: yyyy-mm-dd
updated: yyyy-mm-dd
source: plan
plan: plan.md
task: N
---
```

Task documents must include:

- Source Plan Task
- Implementation Summary
- Changed Files
- Tests / Verification
- Deviations / Follow-Ups
- Blocking Questions
- Deferred Non-Blocking Questions
- Document Changelog
- Next Task

Answered blocking questions must remain in `Blocking Questions` as answered entries. Only open blocking questions prevent task completion.

## Final Response Requirements

The final response must include:

- What changed.
- Which files changed.
- Which planned subtask or subtasks were completed, which `task_N.md` documents were created or updated, and which planned task should run next when applicable.
- Which focused tests ran, which full quality gate commands ran, and any verification categories that were unavailable or skipped.
- Any remaining risks, assumptions, or unavailable verification.
