# Complexity Levels

Use Rubber Duck's existing complexity vocabulary to scale planning, implementation, review, and verification without changing the workflow names.

## Simple

Use `simple` when the work is narrow, low-risk, and can be completed in one focused pass.

- Prefer a single focused implementation pass.
- Do not add subtasks unless they make execution clearer.
- Keep reviewer and verification notes focused on the changed behavior.
- Ask only approval-relevant questions.

## Medium

Use `medium` when the work touches multiple files, has meaningful sequencing, or needs enough coordination that a future implementer benefits from explicit subtasks.

- Include `Implementation Strategy` and `Implementation Subtasks`.
- Prefer incremental task-by-task execution unless parallel safety is explicit.
- Name ownership/files, dependencies, acceptance checks, and `task_N.md` progress documents.
- Run normal specialist review and full quality-gate planning.

## Complex

Use `complex` when the work changes architecture, data models, migrations, public contracts, security-sensitive flows, multi-step rollout, or multiple ownership boundaries.

- Include full strategy, subtasks, rollout/rollback, security/privacy, and verification details.
- Add decision notes for important architecture, API, migration, or third-party choices.
- Prefer orchestration for multi-subtask execution.
- Only recommend parallel implementation when write sets, interfaces, dependencies, and merge boundaries are clearly safe.
