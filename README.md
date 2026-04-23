# Rubber Duck

Rubber Duck is a Claude Code plugin marketplace for lightweight spec-driven development. It is aimed at turning product prompts, Jira context, bug reports, local diffs, and pull requests into concise documents and safer code-shipping workflows.

This repository is being built from a clean-room plan. It does not assume or reuse any previous Rubber Duck implementation.

## Install

Add the marketplace:

```text
/plugin marketplace add vilarjp/rubber-duck
```

Install the plugin:

```text
/plugin install rubber-duck@rubber-duck
```

After installation, verify availability with:

```text
/plugin
/help
/agents
```

## Local Development

Run Claude Code against this local plugin checkout:

```bash
claude --plugin-dir plugins/rubber-duck
```

Reload plugins inside Claude Code after edits:

```text
/reload-plugins
```

Validate the plugin and marketplace structure:

```bash
claude plugin validate .
```

## Current Components

| Type | Name | Purpose | Status |
| --- | --- | --- | --- |
| Agent | `document-reviewer` | Reviews generated PRD, plan, diagnosis, and code-review documents for blockers, missing questions, and approval readiness. | Available |
| Agent | `plan-future-maintainer` | Reviews technical implementation plans for missing future context, ambiguous decisions, aging risks, and concise additions. | Available |
| Agent | `plan-security-reviewer` | Reviews technical implementation plans for security, privacy, compliance, authorization, validation, secrets, logging, retention, and abuse-case gaps. | Available |
| Agent | `plan-staff-engineer` | Reviews technical implementation plans for stack-specific architecture risks, production bugs, compatibility concerns, observability gaps, and simpler implementation options. | Available |
| Agent | `code-staff-engineer-reviewer` | Reviews implementation changes and pull requests for correctness, maintainability, stack best practices, production risk, and simpler fixes. | Available |
| Agent | `project-patterns-reviewer` | Reviews implementation changes and pull requests for alignment with existing project conventions, naming, layering, testing style, abstractions, and file organization. | Available |
| Agent | `implementation-plan-matcher` | Reviews implementation changes and pull requests against an approved implementation plan, flagging missing work, plan drift, and extra scope. | Available |
| Agent | `code-security-reviewer` | Reviews implementation changes and pull requests for security, privacy, compliance, authorization, validation, secrets, logging, dependency risk, and data exposure. | Available |
| Agent | `test-reviewer` | Reviews implementation changes and pull requests for meaningful test coverage, important scenarios, edge cases, regression risks, weak assertions, and redundant tests. | Available |
| Skill | `prd` | Generates concise product requirements documents from prompts or Jira links, then routes them through `document-reviewer` before human approval. | Available |
| Skill | `plan` | Generates concise technical implementation plans from prompts, Jira links, or PRD slugs, then routes them through plan reviewer agents before human approval. | Available |
| Skill | `diagnosis` | Investigates bug reports from prompts or Jira links, documents reproduction, evidence-backed root cause, solution options, and routes the diagnosis through `document-reviewer`. | Available |
| Skill | `implement` | Implements features, bug fixes, quick wins, or review adjustments from prompts, Jira links, or approved artifact slugs, using focused TDD when feasible. | Available |
| Skill | `code-review` | Reviews local uncommitted changes or GitHub pull requests, coordinates staff, pattern, plan-alignment, security, test, and document reviewers, and writes a pending-approval review document. | Available |
| Skill | `commit-push` | Analyzes uncommitted work, proposes safe conventional commit splits, blocks protected branches, requires explicit confirmation, and pushes the selected branch. | Available |

All planned MVP skills and agents are now available.

## Document Lifecycle

Generated PRD, plan, diagnosis, and code-review documents live in the target project under:

```text
docs/yyyy-mm-dd-{slug}/
```

Documents start as `pending-approval` in YAML frontmatter. Human confirmation updates them to `approved` or `requested-changes` with a decision date and short note.

## Example Workflows

```text
prd -> plan -> implement -> code-review -> commit-push
diagnosis -> implement -> code-review -> commit-push
GitHub PR link -> code-review
```

## Safety Rules

- Implementation follows TDD whenever feasible.
- `commit-push` refuses protected branch targets: `main`, `master`, `production`, and `staging`.
- Skills keep changes scoped to the current goal and avoid unrelated refactors.
- Jira links rely only on authenticated tools already available in the user's Claude Code session. If access fails, Rubber Duck asks the human to paste the needed context.
- Automated reviewers return findings to the invoking skill; they do not write separate review files.

## Troubleshooting

If the plugin does not appear after local edits, run `/reload-plugins` inside Claude Code and validate the checkout again:

```bash
claude plugin validate .
```

If marketplace installation fails, confirm the repository is reachable and that `.claude-plugin/marketplace.json` points to `plugins/rubber-duck`.

## Contributing And Releases

Rubber Duck is versioned with SemVer in `plugins/rubber-duck/.claude-plugin/plugin.json`. Release tags use the `vX.Y.Z` form, starting with `v0.0.1`.
