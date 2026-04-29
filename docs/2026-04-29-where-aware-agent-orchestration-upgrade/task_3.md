---
title: "Task 3: Wire Under-Served Skills To Their Agent Crews"
slug: where-aware-agent-orchestration-upgrade
type: implementation-task
status: completed
created: 2026-04-29
updated: 2026-04-29
source: plan
plan: plan.md
task: 3
---

Status: completed

# Task 3: Wire Under-Served Skills To Their Agent Crews

## Source Plan Task

- Plan path: `docs/2026-04-29-where-aware-agent-orchestration-upgrade/plan.md`
- Planned task: Task 3 from Implementation Subtasks.
- Planned execution: sequential after Task 2
- Dependencies: Task 2 agent definitions.

## Implementation Summary

- Added explicit `Agent Crew` guidance to the under-served skills named by the plan.
- Wired `prd` to use `prd-product-reviewer` before `document-reviewer`.
- Wired `diagnosis` to use `diagnosis-root-cause-investigator` before `document-reviewer`.
- Wired `implement` and `orchestrate-implementation` to use exact `implementation-agent` delegation for bounded production-code work and exact `test-implementer` delegation for bounded test-only or test-heavy work.
- Wired `frontend-design` to selectively use UX/UI, accessibility, and UX-writing specialists.
- Wired `commit-push` to run `shipping-hygiene-reviewer` before commit proposal and final confirmation.
- Wired `setup-codex-agents` to use `agent-packaging-reviewer` for packaging validation and generation-risk review.
- Added shared orchestration references and invocation contracts where each skill needed exact named-agent, fallback, or read-only/workspace-write delegation guidance.
- Left `skill-eval` behavior unchanged as required by the plan.
- Implemented sequentially as planned.

## Changed Files

- `plugins/rubber-duck/skills/prd/SKILL.md`: added the PRD product reviewer crew member, workflow pass, rerun guidance, and shared orchestration contract references.
- `plugins/rubber-duck/skills/diagnosis/SKILL.md`: added the root-cause investigator crew member, workflow pass, rerun guidance, and shared orchestration contract references.
- `plugins/rubber-duck/skills/implement/SKILL.md`: added implementation/test agent crew guidance and an implementation-agent invocation contract for production-code delegation.
- `plugins/rubber-duck/skills/orchestrate-implementation/SKILL.md`: replaced generic production-worker language with exact `implementation-agent` delegation and added an invocation contract.
- `plugins/rubber-duck/skills/frontend-design/SKILL.md`: added codebase/docs research crew guidance plus UX/UI, accessibility, and UX-writing specialist review contracts.
- `plugins/rubber-duck/skills/commit-push/SKILL.md`: added `shipping-hygiene-reviewer` workflow integration and read-only invocation contract.
- `plugins/rubber-duck/skills/setup-codex-agents/SKILL.md`: documented the expanded generated-agent inventory and added `agent-packaging-reviewer` packaging validation guidance.
- `docs/2026-04-29-where-aware-agent-orchestration-upgrade/task_3.md`: recorded Task 3 completion.

## Tests / Verification

- `rg -n 'prd-product-reviewer|diagnosis-root-cause-investigator|implementation-agent|test-implementer|frontend-ux-ui-reviewer|frontend-accessibility-reviewer|frontend-ux-writing-reviewer|shipping-hygiene-reviewer|agent-packaging-reviewer' ...target skill files...`: confirmed the expected specialist names are present in the wired skills.
- `rg -n '[ \t]+$' ...target skill files...`: passed with no output, confirming no trailing whitespace in edited skill files.
- `node plugins/rubber-duck/skills/setup-codex-agents/scripts/install-codex-agents.mjs --agents-dir /private/tmp/rubber-duck-agents-task3 --dry-run`: passed, confirming the installer still parses the expanded 29-agent inventory and would render generated custom agents with the existing `gpt-5.5` / `medium` defaults.
- Full plugin validation was not run for this task because `validate-rubber-duck-plugin.mjs` still intentionally expects the pre-Task-2 agent count and workspace-write set. Updating that validator is Task 4.
- No external framework, library, service, or API behavior shaped this task.
- No temporary workaround remains.

## Deviations / Follow-Ups

- Deviations: None.
- Follow-ups: Continue with Task 4 to update validation counts and allowed workspace-write agents, then Task 5 to update README and durable workflow documentation.

## Blocking Questions

None

## Deferred Non-Blocking Questions

None

## Document Changelog

- 2026-04-29: Created after completing Task 3 and recording targeted verification.

## Next Task

- Task 4: Update validation and generated-agent expectations.
