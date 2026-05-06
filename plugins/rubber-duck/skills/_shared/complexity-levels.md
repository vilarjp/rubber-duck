# Complexity Levels

Use Rubber Duck's existing complexity vocabulary to scale planning, implementation, review, and verification without changing the workflow names.

## Simple

Use `simple` when the work is narrow, low-risk, and can be completed in one focused pass.

- Prefer a single focused implementation pass.
- Do not add subtasks unless they make execution clearer.
- Keep reviewer and verification notes focused on the changed behavior.
- Ask only approval-relevant questions.
- Keep generated artifacts short; skip Design Discussion unless direction is ambiguous.

## Medium

Use `medium` when the work touches multiple files, has meaningful sequencing, or needs enough coordination that a future implementer benefits from explicit subtasks.

- Start with a concise Design Discussion when the direction, contract, rollout, data, or risk choices are not already obvious.
- Include `Implementation Strategy` and `Implementation Subtasks`.
- Name the contract or existing interface each task consumes before recommending parallel work.
- Prefer vertical, end-to-end slices and incremental task-by-task execution unless parallel safety is explicit.
- Name ownership/files, dependencies, acceptance checks, and `task_N.md` progress documents.
- Keep subtasks small enough that each has one primary outcome and a concrete completion check.
- Run normal specialist review and full quality-gate planning.

## Complex

Use `complex` when the work changes architecture, data models, migrations, public contracts, security-sensitive flows, multi-step rollout, or multiple ownership boundaries.

- Require a Design Discussion before drafting or finalizing the plan unless the human already supplied an approved technical direction.
- Include full strategy, subtasks, rollout/rollback, security/privacy, and verification details.
- Define new or changed contracts/interfaces before downstream implementation tasks, or explain why an existing stable contract is enough.
- Add decision notes for important architecture, API, migration, or third-party choices.
- Prefer orchestration for multi-subtask execution.
- Only recommend parallel implementation when write sets, interfaces, dependencies, and merge boundaries are clearly safe.
- Add an integration checkpoint after every parallel group so contract drift, generated artifacts, task documents, and verification results are reconciled before dependent work starts.
- Split work into vertical slices whenever possible; use horizontal setup tasks only to establish a shared contract that later slices consume.
