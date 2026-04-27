# Clarifying Questions

Use human questions to protect correctness, not to outsource ordinary investigation.

## Default Loop

1. Investigate first.
   - Read the prompt, source artifact, nearby code, tests, docs, project rules, and relevant external source evidence when applicable.
   - Do not ask for facts that are discoverable with reasonable local inspection.
2. Ask only when the answer would materially change:
   - Product scope, acceptance criteria, user-facing behavior, or non-goals.
   - Architecture, public contracts, data model, migrations, rollout, rollback, or observability.
   - Security, privacy, compliance, authorization, logging, retention, or abuse-case handling.
   - The intended files to touch, ownership boundaries, or whether a deviation from an approved artifact is acceptable.
3. Keep questions focused.
   - Ask 1-2 questions at a time when possible.
   - Offer the best evidence-backed options when that reduces human effort.
   - Explain why the answer matters when the impact is not obvious.
4. Classify uncertainty.
   - Blocking: approval, implementation, or task completion would be unsafe or likely wrong without the answer.
   - Non-blocking: work can proceed with an explicit assumption or deferred follow-up.
5. Preserve the decision trail.
   - Keep every blocking question that was raised.
   - When answered, record the original question, human answer, local date, and document or task impact.
   - When deferred, record why proceeding remains acceptable.

## Specialist Agents

Specialist agents should not ask the human directly unless invoked directly by the human.

They should return:

- Exact question text for the parent Rubber Duck skill to ask.
- `Blocking` or `Non-blocking` classification.
- Why the answer matters.
- The evidence already checked.
- A recommended assumption only for non-blocking uncertainty.

## What Not To Ask

- Do not ask permission to follow established repository conventions.
- Do not ask broad preference questions when a local pattern clearly applies.
- Do not ask about speculative future scope unless it affects current approval or implementation.
- Do not ask for secrets, credentials, private customer data, or unnecessary PII. Ask for safe redacted examples instead.
