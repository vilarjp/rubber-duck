<p align="center">
  <img src="assets/rubber-duck-readme.png" alt="Rubber Duck plugin mascot" width="100%">
</p>

# Rubber Duck

<p align="center">
  <img alt="Claude Code plugin marketplace" src="https://img.shields.io/badge/Claude%20Code-plugin%20marketplace-5B7FFF?style=for-the-badge">
  <img alt="Spec driven" src="https://img.shields.io/badge/spec--driven-workflows-F8C84E?style=for-the-badge">
  <img alt="Safe shipping" src="https://img.shields.io/badge/safe-shipping-2FBF71?style=for-the-badge">
  <img alt="Version 0.0.2" src="https://img.shields.io/badge/version-0.0.2-FF8A4C?style=for-the-badge">
</p>

Rubber Duck is a Claude Code plugin marketplace for turning fuzzy software work into crisp artifacts, reviewed plans, focused implementation, and safer commits. It is cute on the outside, stubbornly practical on the inside.

Bring it a product idea, Jira link, bug report, local diff, or GitHub PR. Rubber Duck helps ask the right questions, write the right document, call in specialist reviewers, and keep the path from idea to push small enough to reason about.

This repository is built from a clean-room plan. It does not assume or reuse any previous Rubber Duck implementation.

## Install

Add the marketplace:

```text
/plugin marketplace add vilarjp/rubber-duck
```

Install the plugin:

```text
/plugin install rubber-duck@rubber-duck
```

## What It Does

| Moment             | Rubber Duck helps with                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Product idea       | Turns rough prompts or Jira context into a concise PRD.                                                            |
| Technical planning | Builds an implementation plan and sends it through maintainer, security, and staff-engineer review.                |
| Bug investigation  | Produces an evidence-backed diagnosis before anyone starts changing code.                                          |
| Implementation     | Guides scoped, test-first changes against an approved artifact or direct request.                                  |
| Code review        | Reviews local diffs or PRs with specialist agents for correctness, security, tests, patterns, and plan alignment.  |
| Commit and push    | Proposes conventional commit splits, blocks protected branches, asks for explicit confirmation, and pushes safely. |

## Skill Menu

| Skill         | Use it when                                                         | Inputs                                                                         | Output                                                             |
| ------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `prd`         | You need the what and why before implementation.                    | Free-form prompt or Jira link.                                                 | `docs/yyyy-mm-dd-{slug}/prd.md` pending approval.                  |
| `plan`        | You need the technical how for a feature, bug fix, or approved PRD. | Prompt, Jira link, or PRD slug.                                                | `docs/yyyy-mm-dd-{slug}/plan.md` pending approval.                 |
| `diagnosis`   | You need to understand a bug before fixing it.                      | Bug report, Jira link, logs, reproduction notes, or source hint.               | `docs/yyyy-mm-dd-{slug}/diagnosis.md` pending approval.            |
| `implement`   | You are ready to make a scoped code change.                         | Implementation prompt, Jira link, or approved plan/diagnosis/code-review slug. | Code and tests changed in the target project.                      |
| `code-review` | You want a structured review of a local diff or GitHub PR.          | Empty input for local changes, GitHub PR link, or plan/source hint.            | `docs/yyyy-mm-dd-{slug}/code-review.md` pending approval.          |
| `commit-push` | You want to ship local work deliberately.                           | Optional branch or commit-intent hint.                                         | One or more conventional commits pushed to a non-protected branch. |

## Review Crew

| Agent                          | Used by                                   | Checks                                                                                                 |
| ------------------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `document-reviewer`            | `prd`, `plan`, `diagnosis`, `code-review` | Document completeness, correctness, missing questions, and approval readiness.                         |
| `plan-future-maintainer`       | `plan`                                    | Whether a future maintainer can understand intent, constraints, decisions, and rollback context.       |
| `plan-security-reviewer`       | `plan`                                    | LGPD, PII, PCI, authorization, validation, secrets, logging, retention, and abuse-case gaps.           |
| `plan-staff-engineer`          | `plan`                                    | Architecture risk, stack fit, production bugs, compatibility, observability, and simpler options.      |
| `code-staff-engineer-reviewer` | `code-review`                             | Correctness, maintainability, stack best practices, production risk, and required fixes.               |
| `project-patterns-reviewer`    | `code-review`                             | Local conventions, naming, layering, testing style, file organization, and companion docs.             |
| `implementation-plan-matcher`  | `code-review`                             | Whether the implementation matches the approved plan without missing work or extra scope.              |
| `code-security-reviewer`       | `code-review`                             | Security, privacy, compliance, authorization, validation, secrets, dependency risk, and data exposure. |
| `test-reviewer`                | `code-review`                             | Meaningful coverage, edge cases, weak assertions, redundant tests, and recommended focused tests.      |

## Duck Trail

```text
prd -> plan -> implement -> code-review -> commit-push
diagnosis -> implement -> code-review -> commit-push
GitHub PR link -> code-review
```

Generated PRD, plan, diagnosis, and code-review documents live in the target project under:

```text
docs/yyyy-mm-dd-{slug}/
```

Documents start as `pending-approval` in YAML frontmatter. Human confirmation updates them to `approved` or `requested-changes` with a decision date and short note.

## Safety Rails

- `implement` follows TDD whenever feasible and explains when it cannot.
- `commit-push` refuses `main`, `master`, `production`, and `staging`.
- `commit-push` requires the exact final confirmation: `yes, commit and push`.
- Skills keep work scoped and avoid unrelated refactors.
- Jira links rely only on authenticated tools already available in the user's Claude Code session.
- Reviewer agents return findings to the invoking skill instead of writing separate review files.

## Troubleshooting

If marketplace installation fails, confirm the repository is reachable and that `.claude-plugin/marketplace.json` points to `plugins/rubber-duck`.

## Contributing And Releases

Rubber Duck is versioned with SemVer in `plugins/rubber-duck/.claude-plugin/plugin.json`. Release tags use the `vX.Y.Z` form, starting with `v0.0.1`.
