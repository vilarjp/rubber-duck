---
title: Where-Aware Agent Orchestration Upgrade
slug: where-aware-agent-orchestration-upgrade
type: plan
status: approved
created: 2026-04-29
updated: 2026-04-29
source: prompt
approved: 2026-04-29
approval_note: Human approved the plan and will start implementation in a new chat.
---

Status: approved

# Where-Aware Agent Orchestration Upgrade

## Summary

Upgrade Rubber Duck so implementation plans describe both where and how work should happen, and so skills more consistently orchestrate specialized agents instead of relying on optional helper delegation. The upgrade should preserve the current PRD emphasis on "what and why," strengthen planning and implementation execution, and keep `skill-eval` out of the new "every skill needs a specialist agent" mandate.

## Source Context

- Human request: raise the project quality bar by expanding plans from "how" to "where and how," creating more subagents, making skills delegate to specialized agents, strengthening exploration-agent usage, and ensuring every skill except `skill-eval` has at least one specialized agent available.
- Prior discussion outcome: treat skills as orchestrators, agents as specialized researchers/workers/reviewers, and code-review as the strongest existing model to copy.
- Non-goal: change the PRD artifact into a technical plan. PRDs should stay focused on product "what and why."
- Non-goal: redesign `skill-eval`; it already has an eval-agent flow and is explicitly excluded from the new per-skill-agent mandate.

## PRD Alignment

Not applicable. This plan was created directly from a product/workflow improvement prompt rather than an approved PRD.

## Current System Notes

- `plugins/rubber-duck/skills/plan/SKILL.md` already requires code/docs research, `Implementation Strategy`, `Implementation Subtasks`, plan reviewers, and final `document-reviewer` approval-readiness review.
- `plugins/rubber-duck/skills/plan/templates/plan.md` already includes `Files / Modules To Touch`, subtask ownership/files, and parallel-safety notes, but "where" is not yet a required planning primitive with read/write/no-touch boundaries.
- `plugins/rubber-duck/skills/implement/SKILL.md` currently uses research agents opportunistically and can delegate bounded test work to `test-implementer`, but it does not have a named general implementation agent.
- `plugins/rubber-duck/skills/orchestrate-implementation/SKILL.md` coordinates sequential or parallel subtasks, but production-code work is described as ordinary implementation workers rather than an exact pre-built Rubber Duck implementation agent.
- `plugins/rubber-duck/skills/code-review/SKILL.md` already models the desired fan-out/fan-in pattern with exact named reviewers and a final `document-reviewer` pass.
- Root agents live in `plugins/rubber-duck/agents/*.md` and must be mirrored exactly in `plugins/rubber-duck/skills/setup-codex-agents/source-agents/*.md`.
- `plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs` currently expects exactly 21 agents and only `skill-eval-executor` plus `test-implementer` to use `workspace-write`; adding agents requires updating this validation.
- There is no package manifest in the repository. The main available validation command is the bundled plugin validator.

## Proposed Approach

Add a shared orchestration contract, make "Implementation Surface" a required plan concept, add targeted agent definitions for under-served skills, then update each skill to declare and use its agent crew. Keep the change source-driven and incremental: first establish the common vocabulary, then add agents, then wire skills to those agents, then update README and validation.

The implementation should avoid creating a maze of agents that run for every tiny task. Skills should choose the right crew by complexity: simple work may use one narrow agent or inline fallback, medium work should use research plus specialist review/worker support, and complex work should use explicit fan-out/fan-in orchestration.

## Agent Inventory Strategy

- Keep all existing agents in this upgrade unless implementation reveals a direct conflict or obsolete role.
- Do not merge existing agents in this pass. The current separations are useful:
  - `codebase-locator`, `codebase-analyzer`, and `codebase-pattern-finder` answer different research questions; `codebase-researcher` coordinates them rather than replacing them.
  - `docs-locator` and `docs-analyzer` should stay separate for the same locate-then-analyze reason.
  - Plan reviewers, code reviewers, `document-reviewer`, test agents, and skill-eval agents each protect a distinct quality gate.
- Treat merging as a later cleanup only if evals show repeated duplicate findings, unclear ownership, or prompt maintenance pain.
- New agents should fill missing skill-specific responsibilities, not duplicate existing research or review agents.
- Frontend design should get a small specialist crew rather than one catch-all frontend reviewer, because visual UX, accessibility/interaction quality, and UX writing fail in different ways.

## Agent Invocation Map

### Skill Crew View

| Skill | Explicit agent crew | Invocation context |
| --- | --- | --- |
| `prd` | `docs-locator`, `docs-analyzer`, `prd-product-reviewer`, `document-reviewer` | Use docs agents when prior product docs, generated artifacts, or decisions may shape requirements. Run `prd-product-reviewer` after drafting for product clarity, scope, acceptance criteria, and downstream plannability. Run `document-reviewer` last for approval readiness. |
| `plan` | `docs-locator`, `docs-analyzer`, `codebase-researcher`, `codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `test-plan-architect`, `plan-future-maintainer`, `plan-security-reviewer`, `plan-staff-engineer`, `document-reviewer` | Use docs and codebase research before drafting. Use `codebase-researcher` for broad areas, or invoke locator/analyzer/pattern agents directly for narrow independent questions. Use `test-plan-architect` for medium-to-complex, risky, or unclear verification. Run plan reviewers in parallel, then `document-reviewer` last. |
| `diagnosis` | `docs-locator`, `docs-analyzer`, `codebase-researcher`, `codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `diagnosis-root-cause-investigator`, `document-reviewer` | Use docs/codebase agents to locate evidence, affected flows, prior decisions, and comparable patterns. Run `diagnosis-root-cause-investigator` after evidence gathering to challenge hypotheses, confidence, and next-step recommendations. Run `document-reviewer` last. |
| `implement` | `docs-locator`, `docs-analyzer`, `codebase-researcher`, `codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `implementation-agent`, `test-implementer` | Use docs/codebase agents before editing when context is broad, stale, or unfamiliar. Use `implementation-agent` only for bounded production-code work with explicit write ownership, especially delegated subtask work. Use `test-implementer` for bounded test-only or test-heavy work. Do not run reviewer agents from this skill. |
| `orchestrate-implementation` | `docs-analyzer`, `codebase-researcher`, `test-plan-architect`, `implementation-agent`, `test-implementer` | Use research/test planning agents only to refresh stale or thin execution context. Use one `implementation-agent` per parallel-safe production-code task. Use `test-implementer` for test-only or test-heavy tasks. Fan in, inspect ownership, verify, and write task docs. |
| `frontend-design` | `codebase-researcher`, `codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `docs-locator`, `docs-analyzer`, `frontend-ux-ui-reviewer`, `frontend-accessibility-reviewer`, `frontend-ux-writing-reviewer` | Use codebase/docs agents to learn routes, component systems, tokens, design docs, and existing patterns. For substantial work, fan out UX/UI, accessibility, and UX-writing specialists during audit/final polish. For small work, invoke only the relevant frontend specialist. |
| `code-review` | `docs-locator`, `docs-analyzer`, `codebase-researcher`, `codebase-analyzer`, `codebase-pattern-finder`, `code-staff-engineer-reviewer`, `project-patterns-reviewer`, `code-security-reviewer`, `test-reviewer`, `implementation-plan-matcher`, `document-reviewer` | Use docs/codebase agents to understand scope and related plans. Run code-focused reviewers in parallel. Run `implementation-plan-matcher` only when a related plan exists. Run `document-reviewer` last on the merged review document. |
| `skill-eval` | `skill-eval-executor`, `skill-eval-grader`, `skill-eval-comparator`, `skill-eval-analyzer` | Existing eval-specific flow remains unchanged. Use executor for with-skill/baseline runs, grader for expectation checks, comparator for blind A/B judgment, and analyzer for prompt/workflow recommendations. |
| `commit-push` | `shipping-hygiene-reviewer` | Invoke after scope inspection and before proposing final commits to check included/excluded paths, secrets, debug leftovers, unrelated files, coverage notes, and verification readiness. |
| `setup-codex-agents` | `agent-packaging-reviewer` | Invoke when validating or changing agent packaging, mirrored source agents, sandbox declarations, generated TOML behavior, or setup script expectations. |

### Agent Coverage View

| Agent | Existing or new | Invoked by | Right context |
| --- | --- | --- | --- |
| `agent-packaging-reviewer` | New | `setup-codex-agents` | Packaging, mirror consistency, sandbox declarations, generated TOML, and validation risks. |
| `code-security-reviewer` | Existing | `code-review` | Security, privacy, authorization, validation, secrets, dependency, logging, and data exposure findings in changed code. |
| `code-staff-engineer-reviewer` | Existing | `code-review` | Correctness, maintainability, stack fit, production risk, and simpler fixes for implementation changes. |
| `codebase-analyzer` | Existing | `plan`, `diagnosis`, `implement`, `orchestrate-implementation`, `frontend-design`, `code-review` | Current behavior, flows, dependencies, side effects, and tests after relevant files are located. |
| `codebase-locator` | Existing | `plan`, `diagnosis`, `implement`, `frontend-design`, `code-review` | File, route, test, config, generated-artifact, and entry-point discovery before deeper analysis. |
| `codebase-pattern-finder` | Existing | `plan`, `diagnosis`, `implement`, `frontend-design`, `code-review` | Similar implementation, frontend, workflow, test, and convention patterns to reuse or avoid. |
| `codebase-researcher` | Existing | `plan`, `diagnosis`, `implement`, `orchestrate-implementation`, `frontend-design`, `code-review` | Broad or unfamiliar areas where locator, analyzer, pattern, and docs findings need synthesis. |
| `diagnosis-root-cause-investigator` | New | `diagnosis` | Bug hypotheses, evidence quality, root-cause confidence, affected flows, and recommended next step. |
| `docs-analyzer` | Existing | `prd`, `plan`, `diagnosis`, `orchestrate-implementation`, `frontend-design`, `code-review` | Decisions, requirements, constraints, stale context, and questions from docs and generated artifacts. |
| `docs-locator` | Existing | `prd`, `plan`, `diagnosis`, `frontend-design`, `code-review` | Prior PRDs, plans, diagnoses, code reviews, ADRs, standards, design docs, and README context. |
| `document-reviewer` | Existing | `prd`, `plan`, `diagnosis`, `code-review` | Final approval-readiness check for generated approval-gated documents. |
| `frontend-accessibility-reviewer` | New | `frontend-design` | Semantic structure, keyboard navigation, focus, contrast, reduced motion, touch targets, and inclusive states. |
| `frontend-ux-ui-reviewer` | New | `frontend-design` | Information architecture, interaction model, visual hierarchy, layout, responsiveness, usability, and design-system fit. |
| `frontend-ux-writing-reviewer` | New | `frontend-design` | Labels, CTAs, errors, empty/loading/success states, terminology, content resilience, and localization readiness. |
| `implementation-agent` | New | `implement`, `orchestrate-implementation` | Scoped production-code implementation with explicit task, ownership/files, dependencies, TDD/verification, and progress-doc expectations. |
| `implementation-plan-matcher` | Existing | `code-review` | Plan drift, missing planned work, task-doc gaps, sequencing issues, and extra scope when a related plan exists. |
| `plan-future-maintainer` | Existing | `plan` | Future maintainability, decision context, rollback/readability, and aging assumptions in plans. |
| `plan-security-reviewer` | Existing | `plan` | Security, privacy, compliance, authorization, validation, logging, retention, and abuse-case plan gaps. |
| `plan-staff-engineer` | Existing | `plan` | Architecture risk, stack fit, production bugs, compatibility, observability, and simpler implementation options. |
| `prd-product-reviewer` | New | `prd` | Product scope, goals, non-goals, acceptance criteria, risks, dependencies, and downstream plannability. |
| `project-patterns-reviewer` | Existing | `code-review` | Alignment with local conventions, naming, layering, test style, abstractions, and file organization. |
| `shipping-hygiene-reviewer` | New | `commit-push` | Commit scope, secrets, debug artifacts, unrelated files, test/verification readiness, and safe commit splits. |
| `skill-eval-analyzer` | Existing | `skill-eval` | Eval result patterns, variance, regressions, tradeoffs, and prompt/workflow improvement recommendations. |
| `skill-eval-comparator` | Existing | `skill-eval` | Blind A/B comparison of baseline and changed outputs. |
| `skill-eval-executor` | Existing | `skill-eval` | With-skill and baseline eval runs with bounded output directories. |
| `skill-eval-grader` | Existing | `skill-eval` | Evidence-backed grading against explicit eval expectations. |
| `test-implementer` | Existing | `implement`, `orchestrate-implementation` | Bounded test-only or test-heavy implementation inside explicit write boundaries. |
| `test-plan-architect` | Existing | `plan`, `orchestrate-implementation` | Layered test plans, stable `T###` cases, fixtures, commands, and manual checks for risky or complex work. |
| `test-reviewer` | Existing | `code-review` | Meaningful coverage, edge cases, regression risk, weak assertions, redundant tests, and missing focused checks. |

## Implementation Surface

- Shared workflow references:
  - Write `plugins/rubber-duck/skills/_shared/agent-orchestration.md`.
  - Update `plugins/rubber-duck/skills/_shared/complexity-levels.md` only if complexity guidance needs a concise orchestration note.
- Plan skill and template:
  - Update `plugins/rubber-duck/skills/plan/SKILL.md`.
  - Update `plugins/rubber-duck/skills/plan/templates/plan.md`.
- Implementation and orchestration skills:
  - Update `plugins/rubber-duck/skills/implement/SKILL.md`.
  - Update `plugins/rubber-duck/skills/orchestrate-implementation/SKILL.md`.
  - Update `plugins/rubber-duck/skills/implement/templates/task.md` only if task docs need to record implementation-agent ownership or surface deviations.
- Other skill workflow contracts:
  - Update `plugins/rubber-duck/skills/prd/SKILL.md`.
  - Update `plugins/rubber-duck/skills/diagnosis/SKILL.md`.
  - Update `plugins/rubber-duck/skills/frontend-design/SKILL.md`.
  - Update `plugins/rubber-duck/skills/commit-push/SKILL.md`.
  - Update `plugins/rubber-duck/skills/setup-codex-agents/SKILL.md` only for documentation of the expanded agent inventory.
  - Leave `plugins/rubber-duck/skills/skill-eval/SKILL.md` behavior unchanged unless README language needs a clarifying exception.
- Agent definitions:
  - Add root agent files under `plugins/rubber-duck/agents/`.
  - Add exact mirrored source files under `plugins/rubber-duck/skills/setup-codex-agents/source-agents/`.
  - Candidate new agents:
    - `implementation-agent` with `workspace-write` sandbox for scoped production-code implementation inside explicit ownership boundaries.
    - `prd-product-reviewer` with `read-only` sandbox for PRD clarity, scope, acceptance criteria, and downstream plannability.
    - `diagnosis-root-cause-investigator` with `read-only` sandbox for bug evidence, hypotheses, affected flows, and root-cause confidence.
    - `frontend-ux-ui-reviewer` with `read-only` sandbox for frontend information architecture, interaction quality, visual hierarchy, responsive behavior, usability, and design-system fit.
    - `frontend-accessibility-reviewer` with `read-only` sandbox for semantic structure, keyboard behavior, focus order, contrast, reduced motion, touch targets, and inclusive interaction states.
    - `frontend-ux-writing-reviewer` with `read-only` sandbox for labels, CTAs, errors, empty/loading/success states, terminology, content resilience, and localization readiness.
    - `shipping-hygiene-reviewer` with `read-only` sandbox for commit-push scope, secrets/debug artifacts, unrelated files, and verification readiness.
    - `agent-packaging-reviewer` with `read-only` sandbox for setup-codex-agents packaging, mirror consistency, sandbox declarations, and generated-agent risks.
- Validation and docs:
  - Update `plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs`.
  - Update `README.md`.
  - Update `docs/2026-04-23-rubber-duck-build-plan/plan.md` only if keeping the original project plan current is desired during implementation; otherwise leave it as historical context.
- No-touch boundaries:
  - Do not change plugin marketplace installation paths unless required by validation.
  - Do not change `skill-eval` execution behavior as part of this plan.
  - Do not change model defaults from `gpt-5.5` / `medium` unless separately requested.

## Implementation Strategy

- Complexity: complex.
- Recommended execution: incremental task-by-task.
- Rationale: this touches shared workflow contracts, multiple skills, mirrored agent sources, README documentation, and validation assumptions. Sequential tasks reduce drift between agent inventory, skill instructions, and generated Codex-agent setup.
- Orchestration recommendation: use `/rubber-duck:orchestrate-implementation` after approval. Parallel implementation should wait until the shared contract and agent list are established, because later tasks depend on names, sandbox choices, and invocation rules.
- Parallel safety notes: agent file creation can be parallelized only after final names and sandbox modes are approved. Skill updates may overlap conceptually and should be done carefully to avoid inconsistent invocation language.

## Decision Notes

- Decision: make "Implementation Surface" a first-class plan section instead of only expanding `Files / Modules To Touch`.
  Alternatives considered: rename the existing section, or rely on subtask ownership only.
  Rationale: a dedicated surface section can distinguish write targets, read-only context, tests, generated artifacts, no-touch boundaries, and merge-risk notes before subtasks are assigned.
  Consequences: plan documents become slightly longer, but implementation and orchestration agents get clearer boundaries.
- Decision: add a general `implementation-agent` rather than using generic runtime workers for production-code subtasks.
  Alternatives considered: keep using generic workers; only use `test-implementer`.
  Rationale: named agents preserve the Rubber Duck contract in Codex and Claude Code, including TDD, scope control, no-workaround rules, and progress-doc expectations.
  Consequences: validation must allow another `workspace-write` agent, and orchestration prompts must pass explicit write ownership.
- Decision: add specialized reviewer/research agents for under-served skills instead of forcing one universal reviewer agent.
  Alternatives considered: extend `document-reviewer` for everything.
  Rationale: PRD, diagnosis, frontend design, shipping hygiene, and agent packaging have distinct quality bars.
  Consequences: more files to maintain, but each skill can delegate to a focused role without bloating the skill itself.
- Decision: keep the existing 21 agents unchanged during this upgrade.
  Alternatives considered: merge locator/analyzer agents, merge plan reviewers, or fold document review into specialist reviewers.
  Rationale: existing agents cover distinct workflow phases and their current separation supports selective delegation. The upgrade should add missing capabilities before consolidating proven ones.
  Consequences: agent count increases, so validation and README tables must stay carefully synchronized.
- Decision: split frontend-design review into UX/UI, accessibility, and UX writing specialists.
  Alternatives considered: one broad `frontend-experience-reviewer`.
  Rationale: frontend quality is multi-dimensional, and a single broad reviewer would either become too generic or too long. The existing frontend-design references already separate UX evaluation, components/accessibility, and UX writing.
  Consequences: frontend-design can fan out specialist reviews on substantial work, while small visual tasks can invoke only the relevant specialist.

## Implementation Subtasks

- Task 1: Add shared orchestration and surface-planning contract.
  Status: planned
  Execution: sequential first
  Ownership / files: `plugins/rubber-duck/skills/_shared/agent-orchestration.md`, `plugins/rubber-duck/skills/plan/templates/plan.md`, `plugins/rubber-duck/skills/plan/SKILL.md`
  Dependencies: None
  Acceptance: Plans require `Implementation Surface`; the shared reference defines skill-owned orchestration, exact named-agent invocation, complexity gates, read-only vs workspace-write delegation, fan-out/fan-in, and fallback behavior.
  Progress document: `task_1.md`
- Task 2: Add new specialized agent definitions and mirrors.
  Status: planned
  Execution: sequential after Task 1
  Ownership / files: `plugins/rubber-duck/agents/*.md`, `plugins/rubber-duck/skills/setup-codex-agents/source-agents/*.md`
  Dependencies: Task 1 agent-orchestration contract and approved agent names/sandbox modes.
  Acceptance: New agents have YAML frontmatter with `name`, `description`, `model`, tools, color, and sandbox; mirrored source-agent files are byte-for-byte identical to root agents; existing agents remain in place; `implementation-agent` is the only new `workspace-write` agent unless implementation proves another write-capable role is necessary.
  Progress document: `task_2.md`
- Task 3: Wire under-served skills to their agent crews.
  Status: planned
  Execution: sequential after Task 2
  Ownership / files: `plugins/rubber-duck/skills/prd/SKILL.md`, `plugins/rubber-duck/skills/diagnosis/SKILL.md`, `plugins/rubber-duck/skills/implement/SKILL.md`, `plugins/rubber-duck/skills/orchestrate-implementation/SKILL.md`, `plugins/rubber-duck/skills/frontend-design/SKILL.md`, `plugins/rubber-duck/skills/commit-push/SKILL.md`, `plugins/rubber-duck/skills/setup-codex-agents/SKILL.md`
  Dependencies: Task 2 agent definitions.
  Acceptance: Each skill except `skill-eval` names at least one specialized agent and explains when to invoke it; `implement` and `orchestrate-implementation` use exact `implementation-agent` for production-code delegation; `frontend-design` can selectively invoke UX/UI, accessibility, and UX-writing specialists; code-review's existing reviewer flow remains materially unchanged.
  Progress document: `task_3.md`
- Task 4: Update validation and generated-agent expectations.
  Status: planned
  Execution: sequential after Task 2, can run before or after Task 3
  Ownership / files: `plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs`, possibly `plugins/rubber-duck/skills/setup-codex-agents/scripts/install-codex-agents.mjs` if generation assumptions need adjustment
  Dependencies: Final agent count and sandbox set from Task 2.
  Acceptance: Validator expects the new total root/source/generated agent count, permits the updated workspace-write set, verifies mirrors, and generated TOML still uses `gpt-5.5` with medium reasoning by default.
  Progress document: `task_4.md`
- Task 5: Update README and durable workflow documentation.
  Status: planned
  Execution: sequential after Tasks 1-4
  Ownership / files: `README.md`, optionally `docs/2026-04-23-rubber-duck-build-plan/plan.md`
  Dependencies: Tasks 1-4.
  Acceptance: README documents the new agent crew, the skill-orchestrates-agents model, the `skill-eval` exception, where-aware plans, and the updated setup/validation behavior.
  Progress document: `task_5.md`
- Task 6: Final verification and consistency pass.
  Status: planned
  Execution: sequential last
  Ownership / files: validation outputs only; no new source ownership unless issues are found.
  Dependencies: Tasks 1-5.
  Acceptance: Run `node plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs` successfully; run `node plugins/rubber-duck/skills/setup-codex-agents/scripts/install-codex-agents.mjs --dry-run` successfully; inspect `git diff` for mirror drift, inconsistent agent names, obsolete agent counts, and accidental `skill-eval` behavior changes.
  Progress document: `task_6.md`

## Files / Modules To Touch

- `plugins/rubber-duck/skills/_shared/agent-orchestration.md`: new shared contract for agent crews, invocation, complexity gating, and fallback behavior.
- `plugins/rubber-duck/skills/plan/SKILL.md`: require where-aware planning and stronger exploration-agent usage.
- `plugins/rubber-duck/skills/plan/templates/plan.md`: add `Implementation Surface` and adjust section guidance.
- `plugins/rubber-duck/skills/implement/SKILL.md`: route production-code delegation through `implementation-agent`; keep local implementation for critical-path work.
- `plugins/rubber-duck/skills/orchestrate-implementation/SKILL.md`: replace generic implementation workers with exact `implementation-agent` for production tasks.
- `plugins/rubber-duck/skills/prd/SKILL.md`: add PRD specialist review before or alongside `document-reviewer`.
- `plugins/rubber-duck/skills/diagnosis/SKILL.md`: add root-cause investigation specialist.
- `plugins/rubber-duck/skills/frontend-design/SKILL.md`: add UX/UI, accessibility, and UX-writing specialist invocation.
- `plugins/rubber-duck/skills/commit-push/SKILL.md`: add shipping hygiene specialist before final confirmation.
- `plugins/rubber-duck/skills/setup-codex-agents/SKILL.md`: mention expanded generated-agent inventory if needed.
- `plugins/rubber-duck/agents/*.md`: add new agent definitions.
- `plugins/rubber-duck/skills/setup-codex-agents/source-agents/*.md`: mirror new agent definitions exactly.
- `plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs`: update expected counts and workspace-write agent set.
- `README.md`: document the upgraded model.

## Data Model / Migrations

Not applicable. This is a plugin workflow, prompt, documentation, and validation change. No persistent application data model or migration is involved.

## API / UI Behavior

- Skill behavior changes:
  - Plans will include explicit implementation location/surface guidance.
  - Skills will have clearer, named agent crews and stronger delegation rules.
  - Implementation orchestration will prefer exact Rubber Duck implementation agents over generic runtime workers.
- User-facing generated artifacts:
  - `plan.md` gains an `Implementation Surface` section.
  - Future task docs may mention assigned implementation agents when work is delegated.
- Plugin UI metadata is not expected to change.

## Test Plan

- Focused checks:
  - Run `node plugins/rubber-duck/skills/setup-codex-agents/scripts/validate-rubber-duck-plugin.mjs`.
  - Run `node plugins/rubber-duck/skills/setup-codex-agents/scripts/install-codex-agents.mjs --dry-run`.
  - Inspect `git diff --check` for whitespace errors.
  - Search for stale hard-coded agent counts with `rg -n "21|Expected .* agents|workspace-write|implementation worker|generic worker|skill-eval" plugins README.md docs`.
- Manual review:
  - Confirm every skill except `skill-eval` names at least one specialized agent.
  - Confirm root and bundled source-agent files match exactly.
  - Confirm each new agent has a narrow scope, correct sandbox, and clear output contract.
  - Confirm existing agents were not removed or merged unless the plan is explicitly revised.
  - Confirm frontend-design specialist scopes do not duplicate each other or turn small design tasks into heavyweight review ceremonies.
  - Confirm plan and implementation instructions still avoid over-delegating critical-path work.
- Full quality gate:
  - No package-level lint/type/test scripts are currently present.
  - Use the bundled validator as the repository-native validation gate.

## Security / Privacy / Compliance

- No customer data, credentials, or external service integration is introduced.
- `implementation-agent` should use `workspace-write` because it edits code, but its prompt must require explicit write ownership and must not revert other users' changes.
- All other proposed new agents should remain `read-only` unless a later approved task proves write access is necessary.
- `shipping-hygiene-reviewer` should strengthen secret/debug-artifact checks before commit and push.
- Agent prompts must not encourage broad private-area inspection; keep existing scope and repository-evidence limits.

## Rollout / Rollback

- Rollout:
  - Implement behind ordinary plugin source changes; no runtime migration required.
  - Re-run setup-codex-agents after release so Codex users regenerate the expanded custom-agent set.
  - Document the new model in README before release.
- Rollback:
  - Revert the new shared reference, skill workflow changes, new agents, validation updates, and README updates together.
  - If validation changes are reverted separately from agent files, the validator will intentionally catch count/mirror drift.

## Blocking Questions

None.

## Deferred Non-Blocking Questions

- Should `setup-codex-agents` count as a normal workflow skill for the "every skill has an agent" rule, or is it a utility skill? This plan includes `agent-packaging-reviewer` so approval can proceed either way.
- Should `frontend-design` eventually get a write-capable frontend implementation agent? This plan starts with read-only frontend specialists to avoid overlapping with the skill's primary implementation responsibility.

## Document Changelog

- 2026-04-29: Created from human request to upgrade planning from "how" to "where and how" and strengthen skill-led agent orchestration.
- 2026-04-29: Clarified that existing agents should be kept and not merged in this pass; replaced the single broad frontend reviewer proposal with UX/UI, accessibility, and UX-writing specialists.
- 2026-04-29: Added a skill-to-agent invocation map and agent coverage view so every existing and proposed agent has an explicit skill context.
- 2026-04-29: Marked approved after human approval.

## Approval

Approved on 2026-04-29. Human approved the plan and will start implementation in a new chat.
