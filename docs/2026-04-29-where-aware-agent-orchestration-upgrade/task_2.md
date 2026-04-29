---
title: "Task 2: Add New Specialized Agent Definitions And Mirrors"
slug: where-aware-agent-orchestration-upgrade
type: implementation-task
status: completed
created: 2026-04-29
updated: 2026-04-29
source: plan
plan: plan.md
task: 2
---

Status: completed

# Task 2: Add New Specialized Agent Definitions And Mirrors

## Source Plan Task

- Plan path: `docs/2026-04-29-where-aware-agent-orchestration-upgrade/plan.md`
- Planned task: Task 2 from Implementation Subtasks.
- Planned execution: sequential after Task 1
- Dependencies: Task 1 agent-orchestration contract and approved agent names/sandbox modes.

## Implementation Summary

- Added eight new specialized Rubber Duck agent definitions with YAML frontmatter containing `name`, `description`, `model`, `tools`, `color`, and `sandbox`.
- Mirrored each new root agent definition into `plugins/rubber-duck/skills/setup-codex-agents/source-agents/` byte-for-byte.
- Kept all existing agents in place.
- Added `implementation-agent` as the only new `workspace-write` agent.
- Added all other new roles as explicit `read-only` agents.
- Implemented sequentially as planned.

## Changed Files

- `plugins/rubber-duck/agents/implementation-agent.md`: new write-capable production-code implementation agent.
- `plugins/rubber-duck/agents/prd-product-reviewer.md`: new read-only PRD product quality reviewer.
- `plugins/rubber-duck/agents/diagnosis-root-cause-investigator.md`: new read-only diagnosis evidence and root-cause reviewer.
- `plugins/rubber-duck/agents/frontend-ux-ui-reviewer.md`: new read-only frontend UX/UI reviewer.
- `plugins/rubber-duck/agents/frontend-accessibility-reviewer.md`: new read-only frontend accessibility reviewer.
- `plugins/rubber-duck/agents/frontend-ux-writing-reviewer.md`: new read-only frontend UX writing reviewer.
- `plugins/rubber-duck/agents/shipping-hygiene-reviewer.md`: new read-only commit/push hygiene reviewer.
- `plugins/rubber-duck/agents/agent-packaging-reviewer.md`: new read-only agent packaging reviewer.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/implementation-agent.md`: byte-for-byte mirror.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/prd-product-reviewer.md`: byte-for-byte mirror.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/diagnosis-root-cause-investigator.md`: byte-for-byte mirror.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/frontend-ux-ui-reviewer.md`: byte-for-byte mirror.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/frontend-accessibility-reviewer.md`: byte-for-byte mirror.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/frontend-ux-writing-reviewer.md`: byte-for-byte mirror.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/shipping-hygiene-reviewer.md`: byte-for-byte mirror.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/agent-packaging-reviewer.md`: byte-for-byte mirror.
- `docs/2026-04-29-where-aware-agent-orchestration-upgrade/task_2.md`: recorded Task 2 completion.

## Tests / Verification

- `diff -rq plugins/rubber-duck/agents plugins/rubber-duck/skills/setup-codex-agents/source-agents`: passed with no output, confirming root and source-agent files are identical.
- `rg "^(name|description|model|tools|color|sandbox):" ...new agent files...`: confirmed required frontmatter fields exist for every new root agent.
- Metadata inventory check: confirmed 29 root agents and 29 source agents; workspace-write agents are `implementation-agent`, `skill-eval-executor`, and `test-implementer`; no required fields were missing from the new agents.
- `rg -n "[ \t]+$" ...new agent files... task_2.md`: passed with no output, confirming no trailing whitespace in new files.
- `node plugins/rubber-duck/skills/setup-codex-agents/scripts/install-codex-agents.mjs --agents-dir /private/tmp/rubber-duck-agents-task2 --dry-run`: passed, confirming the installer can parse the expanded agent inventory and would render 29 generated agents with the existing `gpt-5.5` / `medium` defaults.
- `find plugins/rubber-duck/agents -maxdepth 1 -type f -name '*.md' -print`: confirmed the root inventory now includes the new agent files.
- `find plugins/rubber-duck/skills/setup-codex-agents/source-agents -maxdepth 1 -type f -name '*.md' -print`: confirmed the source-agent inventory mirrors the root inventory.
- Full plugin validation was not run for this task because `validate-rubber-duck-plugin.mjs` still intentionally expects the pre-Task-2 agent count and workspace-write set. Updating that validator is Task 4.
- No external framework, library, service, or API behavior shaped this task.
- No temporary workaround remains.

## Deviations / Follow-Ups

- Deviations: None.
- Follow-ups: Continue with Task 3 to wire under-served skills to the new agent crews, and Task 4 to update validation counts and allowed workspace-write agents.

## Blocking Questions

None

## Deferred Non-Blocking Questions

None

## Document Changelog

- 2026-04-29: Created after completing Task 2 and recording targeted verification.

## Next Task

- Task 3: Wire under-served skills to their agent crews.
