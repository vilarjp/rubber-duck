# Artifact Quality Gates

Use this reference before a Rubber Duck skill presents a generated artifact, delegates implementation from it, or asks the human for approval.

## Evidence Grounding

- Separate confirmed evidence, human-provided requirements, repository facts, assumptions, and unknowns.
- Do not invent Jira, GitHub, production, compliance, customer, or user-intent details. If evidence is unavailable, write the uncertainty plainly.
- Tie material claims to a prompt, approved artifact, code path, command output, repository file, prior task document, or explicit human answer.
- Preserve answered blocking questions as decision history with original question text, answer date, human answer, and artifact impact.
- Keep deferred non-blocking questions separate, with the reason approval or handoff can proceed.

## Structure And Handoff

- Verify required frontmatter, visible status, required sections, changelog, approval notes, and expected output paths before handoff.
- Check that the artifact is usable by the next workflow without rediscovery: PRDs feed plans, plans feed implementation, task documents feed later tasks, diagnoses feed plans or fixes, and code reviews feed implementation or approval.
- Remove or mark speculative details that are not needed for the next decision.
- Keep scope boundaries explicit so later agents can tell what is in scope, out of scope, read-only, and safe to change.

## Acceptance And Verification

- PRDs need acceptance criteria that a future plan can map to tests, checks, or explicit non-implementation rationale.
- Plans need focused completion checks, full quality-gate commands when discoverable, and subtask completion criteria that are concrete enough for an implementer to stop without revisiting the plan.
- Diagnoses need reproduction evidence, hypothesis ranking, confidence, affected flows, and verification plans that distinguish confirmed facts from likely causes.
- Code-review documents need changed-line evidence, severity ordering, test/security/plan-alignment notes, and explicit residual uncertainty.
- Task progress documents need changed paths, verification commands and results, deviations, reusable partial work, blockers, and the next-task recommendation.

## Pre-Handoff Self-Review

Before invoking final reviewers or presenting the artifact:

1. Read the artifact as the next workflow consumer.
2. Check required structure and status fields.
3. Check every key claim against available evidence.
4. Check every open question is either asked live, answered, or explicitly deferred as non-blocking.
5. Check every acceptance or verification claim names an observable result, command, file, or manual check.
6. Fix document drift before asking reviewers to approve it.
