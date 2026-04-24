---
name: code-review
description: Review local uncommitted changes or a GitHub pull request, coordinate Rubber Duck reviewer agents, and write a concise pending-approval code review document.
disable-model-invocation: true
argument-hint: "[optional GitHub PR link | slug/source hint]"
---

# Code Review Skill

Use this skill to review implementation changes and create a code review document with evidence-backed findings, security and test notes, project-pattern feedback, and plan alignment when a related plan exists.

## Inputs

Accept `$ARGUMENTS` as one of:

- Empty input, meaning review all local uncommitted changes: staged, unstaged, and relevant untracked files.
- A GitHub pull request link.
- A slug or source hint pointing to an existing implementation plan folder.

If there is no PR link and no local uncommitted work to review, ask the human for a review target.

## Output

Create one document in the target project root:

```text
docs/yyyy-mm-dd-{slug}/code-review.md
```

The document status must remain `pending-approval` until the human explicitly approves it or requests changes.

## Workflow

1. Determine the review scope.
   - If `$ARGUMENTS` includes a GitHub PR link, fetch PR metadata, description, branch details, diff, changed files, comments, and checks through authenticated tools already available in the current assistant session.
   - Do not configure or bundle GitHub credentials, tokens, apps, or MCP servers.
   - If authenticated PR access fails, ask the human to paste the PR description, diff, changed file list, review comments, check status, and any related plan or issue link.
   - If no PR link is provided, inspect local uncommitted work with `git status`, `git diff --staged`, `git diff`, and targeted reads of relevant untracked files.
   - Include untracked source, test, config, documentation, template, manifest, and generated artifact files that appear relevant to the change.
   - Ignore unrelated build outputs, dependency directories, caches, editor files, logs, and other generated noise unless the human explicitly asks to review them.
2. Find related planning context when available.
   - If `$ARGUMENTS` includes a slug or source hint, search for matching `docs/*-{slug}/plan.md` files.
   - If the PR description, branch name, commit messages, or local changed files mention a docs folder or plan slug, inspect the matching `plan.md`.
   - Prefer `status: approved` plans as the plan-alignment contract.
   - If multiple plausible plans exist, ask the human which plan to use before invoking `implementation-plan-matcher`.
   - If no related plan is found, skip `implementation-plan-matcher` and record `No related plan found` in Plan Alignment.
3. Gather only the context needed for review.
   - Read changed files, nearby source, tests, configuration, manifests, documentation, templates, and existing patterns needed to evaluate the diff.
   - Run read-only commands and focused verification commands when useful for review confidence.
   - Do not modify source, tests, configuration, generated artifacts, or documentation other than the final `code-review.md`.
4. Prioritize findings over commentary.
   - Treat correctness, regression risk, security/privacy issues, missing tests, plan drift, and project-pattern mismatches as first-class review findings.
   - Merge duplicate findings from multiple reviewers into one finding with combined evidence.
   - Order findings by severity and user or production impact.
   - Avoid style nits, broad rewrites, or preference-only feedback unless they hide a concrete bug, review risk, security risk, test gap, or maintainability problem.
5. Derive the output folder.
   - Use the local current date in `yyyy-mm-dd` format.
   - For PR reviews, derive a short kebab-case slug from the PR title, branch, or PR number.
   - For local reviews, derive a short kebab-case slug from the main changed behavior or use `local-code-review` when the scope is mixed.
6. Draft the review document.
   - Use `templates/code-review.md` from this skill folder as the default structure.
   - Include only sections that help the human decide whether to approve, request changes, or ask follow-up questions.
   - If there are no findings in a section, write `None`.
   - Preserve uncertainty when evidence is unavailable instead of inventing intent, production behavior, compliance scope, or test results.
7. Run code-focused reviewer agents on the generated `code-review.md` and reviewed scope.
   - Run `code-staff-engineer-reviewer` for correctness, maintainability, stack best practices, production risk, and simpler fixes.
   - Run `project-patterns-reviewer` for local conventions, naming, layering, testing style, abstractions, and file organization.
   - Run `code-security-reviewer` for security, privacy, compliance, authorization, validation, secrets, logging, dependency risk, and data exposure.
   - Run `test-reviewer` for meaningful test coverage, important scenarios, edge cases, regression risks, weak assertions, and redundant tests.
   - Run `implementation-plan-matcher` only when a related plan can be identified.
   - Run independent code-focused reviewers in parallel when the current assistant environment supports it, then wait for all available reviewers before merging findings.
   - Pass reviewers the document path, source summary, diff or changed-file scope, focused test results, full quality gate results, and related plan path when applicable.
   - Do not write separate review files.
8. Merge reviewer feedback into `code-review.md`.
   - Apply blocking findings and important review gaps before finalizing.
   - Deduplicate overlapping findings and keep the strongest evidence.
   - Treat security/privacy questions, required fixes, plan drift, and missing tests as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Preserve reviewer conflicts as questions for the human instead of guessing.
   - Keep non-blocking suggestions only when they improve approval confidence, future implementation clarity, or review usefulness.
9. Run `document-reviewer` on the merged `code-review.md` as the final approval-readiness pass.
   - Ask it to review for completeness, correctness, clarity, unresolved uncertainty, request alignment, missing questions, and approval readiness.
   - Treat its blocking issues and missing questions as approval blockers unless the human explicitly defers them as non-blocking.
   - Preserve `document-reviewer` missing questions and approval recommendation in the Approval section when they affect human review.
10. Resolve all approval blockers before presenting the review for approval.
   - Ask the human follow-up questions as many times as necessary.
   - Update `code-review.md` after each answer.
   - Rerun the affected reviewers and `document-reviewer` when an answer materially changes review scope, finding severity, security risk, test coverage, plan alignment, or approval readiness.
   - Do not leave an approval-relevant question only in the document. Either answer it, record the human's explicit non-blocking deferral, or keep the review not ready for approval.
11. Tell the human the review path and that it is pending approval.
   - Ask them to review it and explicitly approve or request changes.

## Runtime Compatibility

- In runtimes with native plugin agents, use the named plugin agents from the root-level `agents/` directory.
- In Codex, prefer the generated custom agents installed by `setup-codex-agents`.
- If no compatible native or generated agent is available, read the matching reviewer prompt from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and perform that pass inline or through the closest available delegation mechanism.
- Do not skip a configured reviewer solely because the current runtime exposes reviewer prompts as files instead of native agents.

## Document Requirements

Every code review must start with this frontmatter shape:

```yaml
---
title: Short Human Title
slug: short-slug
type: code-review
status: pending-approval
created: yyyy-mm-dd
source: local-diff | github-pr
---
```

Immediately after frontmatter, include a visible status line:

```text
Status: pending-approval
```

Use these sections when useful:

- Scope
- Findings
- Security / Privacy Notes
- Test Coverage Notes
- Project Convention Notes
- Plan Alignment
- Blocking Questions
- Deferred Non-Blocking Questions
- Approval

## Finding Format

Use this shape for each finding:

```text
- Severity: critical | high | medium | low
  File: path/to/file:line
  Issue: What is wrong.
  Impact: Why it matters to users, production behavior, security, tests, or maintainability.
  Recommendation: The smallest useful fix or question.
```

If exact line numbers are unavailable for a PR diff or untracked file, cite the most specific file, function, section, or hunk available.

## Reviewer Orchestration Notes

- Run independent reviewer agents in parallel when the current assistant environment supports it.
- Wait for all available code-focused reviewers, merge their findings, then run `document-reviewer` last on the merged review document.
- Use blocking findings, required questions or fixes, security/privacy questions, plan drift, missing tests, and reviewer conflicts as approval blockers unless they are explicitly deferred by the human as non-blocking.
- The invoking skill owns the final review document. Reviewer agents return findings only; they do not edit the document.
- If an expected reviewer agent is unavailable, note that gap in the final response and in the review document's Approval section when it affects confidence.
- Do not approve the code changes on behalf of the human.
- Do not make code fixes from this skill unless the human explicitly changes the request from review to implementation.

## Approval Loop

If the human requests changes or answers a blocking question, update `code-review.md`, rerun affected reviewers and `document-reviewer` when the change materially affects approval readiness, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests more changes, or stops the workflow.

## Approval Updates

If the human later explicitly approves the review, update the frontmatter:

```yaml
status: approved
approved: yyyy-mm-dd
approval_note: Short note
```

If the human requests changes, update the frontmatter:

```yaml
status: requested-changes
decision_date: yyyy-mm-dd
decision_note: Short note
```

Keep the visible status line in sync with frontmatter.
