# Decision Notes For Complex Plans

Complex plans should capture the important "why" behind choices that future implementers or reviewers would otherwise have to rediscover.

Use concise mini-ADR-style notes only when they help. Do not add decision notes to simple or medium plans unless a specific decision is unusually consequential.

## Include For

- Architecture boundaries or module ownership changes.
- Public API, CLI, schema, file format, or generated-document contract changes.
- Data model, migration, backfill, retention, rollback, or compatibility choices.
- Security, privacy, authorization, logging, or third-party integration choices.
- Decisions to avoid a heavier refactor, dependency, migration, or rollout path.

## Shape

- Decision: the chosen approach.
- Alternatives considered: the main viable alternatives, not a long brainstorm.
- Rationale: why this choice is safest or simplest for the current scope.
- Consequences: tradeoffs, follow-ups, rollback notes, or conditions that would make this decision age poorly.
