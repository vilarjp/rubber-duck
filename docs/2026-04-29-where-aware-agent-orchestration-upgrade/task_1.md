---
title: "Task 1: Add Shared Orchestration And Surface-Planning Contract"
slug: where-aware-agent-orchestration-upgrade
type: implementation-task
status: completed
created: 2026-04-29
updated: 2026-04-29
source: plan
plan: plan.md
task: 1
---

Status: completed

# Task 1: Add Shared Orchestration And Surface-Planning Contract

## Source Plan Task

- Plan path: `docs/2026-04-29-where-aware-agent-orchestration-upgrade/plan.md`
- Planned task: Task 1 from Implementation Subtasks.
- Planned execution: sequential first
- Dependencies: None

## Implementation Summary

- Added a shared agent orchestration contract that defines skill-owned orchestration, exact named-agent invocation, complexity gates, read-only vs workspace-write delegation, fan-out/fan-in, fallback behavior, and where-aware planning boundaries.
- Updated the plan template so every generated plan includes `Implementation Surface` before `Implementation Strategy`.
- Updated the plan skill to reference the shared orchestration contract, require `Implementation Surface`, and keep implementation-surface ownership boundaries distinct from the concise `Files / Modules To Touch` list.
- Implemented sequentially as planned.

## Changed Files

- `plugins/rubber-duck/skills/_shared/agent-orchestration.md`: new shared orchestration and where-aware delegation contract.
- `plugins/rubber-duck/skills/plan/templates/plan.md`: added the required `Implementation Surface` section and updated orchestration wording.
- `plugins/rubber-duck/skills/plan/SKILL.md`: wired the shared reference into the planning workflow, runtime compatibility notes, agent invocation contracts, document requirements, and strategy requirements.
- `docs/2026-04-29-where-aware-agent-orchestration-upgrade/task_1.md`: recorded Task 1 completion.

## Tests / Verification

- `node plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs`: passed.
- Inspected `git diff` for the Task 1 files to confirm the change is limited to the shared orchestration contract and plan skill/template updates.
- No external framework, library, service, or API behavior shaped this task.
- No temporary workaround remains.

## Deviations / Follow-Ups

- Deviations: None.
- Follow-ups: Continue with Task 2 to add the new specialized agent definitions and mirrored source-agent files.

## Blocking Questions

None

## Deferred Non-Blocking Questions

None

## Document Changelog

- 2026-04-29: Created after completing Task 1 and recording validation results.

## Next Task

- Task 2: Add new specialized agent definitions and mirrors.
