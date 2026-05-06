# Pragmatic Quality

Use this reference when a Rubber Duck workflow drafts, reviews, or implements from generated artifacts.

## Ask Before Direction Changes

- Ask in the live session before creating or finalizing a PRD, plan, diagnosis, review, or major task document when the answer would change scope, architecture, behavior, data handling, security, rollout, ownership, or approval.
- Do not hide a blocking question inside the document as the first place the human sees it.
- Ask 1-3 concise questions at a time. Include the reason each answer matters and the best evidence-backed options when useful.
- If the human explicitly defers a question, record why the workflow can continue safely.

## Short Clear Documents

- Write plain English for scanning, including by non-native English readers.
- Prefer short sentences, concrete nouns, active voice, and small bullets.
- Remove sections that do not help the next decision or workflow.
- Default size targets: PRD 60-120 lines, Design Discussion 30-80 lines, plan 100-220 lines, task document 40-90 lines, code-review document 60-140 lines.
- Exceed the target only when the work is genuinely complex; add a short note explaining why the extra detail is necessary.

## Design Discussion Before Plans

- Before drafting a medium, complex, risky, or directionally ambiguous implementation plan, pause for a concise Design Discussion in chat.
- Cover the intended outcome, current evidence, simplest viable design, rejected heavier option, proposed vertical slices, key tests, and unresolved direction-setting choices.
- Ask for alignment or the missing choices, then wait for the human answer before writing or finalizing `plan.md`.
- Simple, low-risk changes may skip the Design Discussion when local evidence makes the direction obvious.

## Vertical Slices

- Plan implementation around end-to-end behavior slices, not horizontal layers.
- Each slice should deliver one observable behavior and include the necessary database, service, API, UI, generated artifact, and test work for that behavior when those layers are relevant.
- A horizontal enabling task is allowed only when it creates or confirms a shared contract needed by later vertical slices.
- Every slice needs a focused acceptance check and a stop condition that proves the slice is ready for review.

## Review Discipline

- A finding needs changed-scope evidence, a concrete failure path or maintenance cost, and the smallest useful fix.
- Prefer correctness, security, data handling, API compatibility, meaningful tests, production risk, plan drift, and user impact.
- Suppress preference-only nits, broad rewrites, speculative hardening, and low-confidence style comments.
- Keep optional suggestions short and do not let them obscure required fixes.
