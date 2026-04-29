---
title: "Task 4: Update Validation And Generated-Agent Expectations"
slug: where-aware-agent-orchestration-upgrade
type: implementation-task
status: completed
created: 2026-04-29
updated: 2026-04-29
source: plan
plan: plan.md
task: 4
---

Status: completed

# Task 4: Update Validation And Generated-Agent Expectations

## Source Plan Task

- Plan path: `docs/2026-04-29-where-aware-agent-orchestration-upgrade/plan.md`
- Planned task: Task 4 from Implementation Subtasks.
- Planned execution: sequential after Task 2, can run before or after Task 3
- Dependencies: Final agent count and sandbox set from Task 2.

## Implementation Summary

- Updated the plugin validator to expect 29 root agents and 29 generated Codex TOML agents.
- Added `implementation-agent` to the allowed `workspace-write` agent set alongside `skill-eval-executor` and `test-implementer`.
- Kept generated-agent default expectations at `gpt-5.5` with medium reasoning.
- Left `install-codex-agents.mjs` unchanged because it already discovers source agents dynamically and preserves each agent's declared sandbox.
- Implemented sequentially as planned.

## Changed Files

- `plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs`: added `EXPECTED_AGENT_COUNT = 29`, reused it for root and generated counts, and permitted `implementation-agent` as a generated/source `workspace-write` agent.
- `docs/2026-04-29-where-aware-agent-orchestration-upgrade/task_4.md`: recorded Task 4 completion.

## Tests / Verification

- `node plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs`: passed.
- `node plugins/rubber-duck/skills/setup-codex-agents/scripts/install-codex-agents.mjs --agents-dir /private/tmp/rubber-duck-agents-task4 --dry-run`: passed, confirming 29 generated agent paths with `gpt-5.5` and medium reasoning.
- `rg -n "Expected 21|!== 21|= 21|21 generated|21 root|EXPECTED_AGENT_COUNT|EXPECTED_WORKSPACE_WRITE|workspace-write" plugins/rubber-duck/skills/setup-codex-agents/scripts plugins/rubber-duck/skills/setup-codex-agents/source-agents plugins/rubber-duck/agents`: confirmed no stale hard-coded 21-agent validator expectations remain and the workspace-write agents are the intended three.
- Inspected the validator diff to confirm the only behavior changes are the count constant and updated workspace-write set.
- No external framework, library, service, or API behavior shaped this task.
- No temporary workaround remains.

## Deviations / Follow-Ups

- Deviations: `install-codex-agents.mjs` did not need edits because its source-agent discovery and generated TOML defaults already satisfy this task.
- Follow-ups: Continue with Task 5 to update README and durable workflow documentation, then Task 6 for the final consistency pass.

## Blocking Questions

None

## Deferred Non-Blocking Questions

None

## Document Changelog

- 2026-04-29: Created after completing Task 4 and recording validation results.

## Next Task

- Task 5: Update README and durable workflow documentation.
