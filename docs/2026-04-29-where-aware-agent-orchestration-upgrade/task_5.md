---
title: "Task 5: Update README And Durable Workflow Documentation"
slug: where-aware-agent-orchestration-upgrade
type: implementation-task
status: completed
created: 2026-04-29
updated: 2026-04-29
source: plan
plan: plan.md
task: 5
---

Status: completed

# Task 5: Update README And Durable Workflow Documentation

## Source Plan Task

- Plan path: `docs/2026-04-29-where-aware-agent-orchestration-upgrade/plan.md`
- Planned task: Task 5 from Implementation Subtasks.
- Planned execution: sequential after Tasks 1-4
- Dependencies: Tasks 1-4.

## Implementation Summary

- Updated the README to document the skill-owned orchestration model: skills gather context, decide scope, ask human questions, edit final artifacts, and verify; agents provide focused evidence, critique, questions, or bounded implementation support.
- Documented the `skill-eval` exception: it keeps its existing eval-specific executor, grader, comparator, and analyzer flow instead of joining the new per-skill specialist-review mandate.
- Updated Codex setup documentation to state that `/rubber-duck:setup-codex-agents` generates 29 custom-agent TOML files with `gpt-5.5`, medium reasoning, and each agent's declared sandbox.
- Expanded the README agent inventory so all 29 agents appear in durable documentation, including the new `implementation-agent`, `prd-product-reviewer`, `diagnosis-root-cause-investigator`, frontend specialist reviewers, `shipping-hygiene-reviewer`, and `agent-packaging-reviewer`.
- Added durable README guidance for where-aware plans and `Implementation Surface`, including write targets, read-only context, tests and verification surfaces, no-touch boundaries, and parallel or merge-risk notes.
- Updated safety rails and release documentation for exact named-agent invocation, bounded `workspace-write` delegation, frontend specialist review, shipping hygiene review, packaging review, validator expectations, and allowed `workspace-write` agents.
- Implemented sequentially as planned.

## Changed Files

- `README.md`: documented the upgraded orchestration model, expanded agent crew, where-aware planning, `skill-eval` exception, setup behavior, validation behavior, and updated safety rails.
- `docs/2026-04-29-where-aware-agent-orchestration-upgrade/task_5.md`: recorded Task 5 completion.

## Tests / Verification

- `node plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs`: passed.
- `node plugins/rubber-duck/skills/setup-codex-agents/scripts/install-codex-agents.mjs --agents-dir /private/tmp/rubber-duck-agents-task5 --dry-run`: passed, confirming the setup script still discovers 29 generated agent paths with `gpt-5.5` and medium reasoning.
- `git diff --check`: passed with no whitespace errors.
- `rg -n "Agent Orchestration Model|Implementation Surface|skill-eval|29|implementation-agent|shipping-hygiene-reviewer|agent-packaging-reviewer|workspace-write" README.md`: confirmed README coverage for the task's required durable documentation topics.
- `rg -n "[ \t]+$" README.md docs/2026-04-29-where-aware-agent-orchestration-upgrade/task_5.md`: passed with no output, confirming no trailing whitespace in the Task 5 files.
- No external framework, library, service, or API behavior shaped this documentation task.
- No temporary workaround remains.

## Deviations / Follow-Ups

- Deviations: Did not update `docs/2026-04-23-rubber-duck-build-plan/plan.md` because the Task 5 source plan marked it optional and the file is historical context. The README now carries the durable workflow documentation for this upgrade.
- Follow-ups: Continue with Task 6 for the final verification and consistency pass.

## Blocking Questions

None

## Deferred Non-Blocking Questions

None

## Document Changelog

- 2026-04-29: Created after completing Task 5 and recording README documentation updates.

## Next Task

- Task 6: Final verification and consistency pass.
