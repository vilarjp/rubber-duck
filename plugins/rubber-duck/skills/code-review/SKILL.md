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
   - Treat the PR diff, local diff, relevant untracked files, or explicit human-provided file list as the review boundary; when hunks are available, changed lines are the primary review target.
   - Ignore unrelated build outputs, dependency directories, caches, editor files, logs, and other generated noise unless the human explicitly asks to review them.
2. Find related planning context when available.
   - If `$ARGUMENTS` includes a slug or source hint, search for matching `docs/*-{slug}/plan.md` files.
   - If the PR description, branch name, commit messages, or local changed files mention a docs folder or plan slug, inspect the matching `plan.md`.
   - When a related plan folder exists, inspect matching `task_*.md` implementation progress documents in that folder.
   - Prefer `status: approved` plans as the plan-alignment contract.
   - If multiple plausible plans exist, ask the human which plan to use before invoking `implementation-plan-matcher`.
   - If no related plan is found, skip `implementation-plan-matcher` and record `No related plan found` in Plan Alignment.
   - If a related plan contains `Implementation Subtasks`, use those subtasks and any `task_N.md` documents as review context for scope, sequencing, completed work, and missing progress documents.
3. Gather only the context needed for review.
   - Read changed files plus the smallest amount of directly related source, tests, configuration, manifests, documentation, templates, and existing patterns needed to evaluate the diff.
   - Use nearby files and unchanged lines in touched files as context only; do not review, critique, or report issues there unless the changed code directly depends on the issue or newly exposes it.
   - Anchor findings to changed hunks, newly added lines, removed lines, or new files whenever possible; do not request edits to pre-existing unchanged lines unless they are directly required to fix the changed-code issue.
   - Run read-only commands and focused verification commands when useful for review confidence.
   - Do not modify source, tests, configuration, generated artifacts, or documentation other than the final `code-review.md`.
4. Prioritize findings over commentary.
   - Treat correctness, regression risk, security/privacy issues, missing tests, plan drift, and project-pattern mismatches as first-class review findings.
   - Treat over-broad change sets as findings when the reviewed work uses speculative abstractions, broad refactors, new dependencies, architecture changes, or cleanup that is not clearly required to solve the specific problem.
   - Prefer targeted tests that add real confidence; do not request broad coverage churn unless the implementation risk justifies it.
   - Treat newly introduced nested ternary expressions in changed code as maintainability findings, and recommend clearer control flow.
   - Prefer early returns and guard clauses over avoidable changed-code nesting when that improves correctness, readability, or reviewability; do not request broad rewrites of existing unrelated control flow.
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
   - Include workflow compliance notes when generated documents, answered blocking questions, changelogs, plan subtasks, execution strategy, or `task_N.md` progress documents are part of the reviewed change.
7. Run code-focused reviewer agents on the generated `code-review.md` and reviewed scope.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `code-staff-engineer-reviewer` agent.
   - Invoke the exact pre-built `project-patterns-reviewer` agent.
   - Invoke the exact pre-built `code-security-reviewer` agent.
   - Invoke the exact pre-built `test-reviewer` agent.
   - Invoke the exact pre-built `implementation-plan-matcher` agent only when a related plan can be identified.
   - Run independent code-focused reviewers in parallel when the current assistant environment supports it, then wait for all available reviewers before merging findings.
   - Pass reviewers the document path, source summary, diff or changed-file scope, focused test results, full quality gate results, related plan path when applicable, and related `task_N.md` progress documents when available.
   - Do not write separate review files.
8. Merge reviewer feedback into `code-review.md`.
   - Apply blocking findings and important review gaps before finalizing.
   - Deduplicate overlapping findings and keep the strongest evidence.
   - Treat security/privacy questions, required fixes, plan drift, and missing tests as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
   - Preserve reviewer conflicts as questions for the human instead of guessing.
   - Keep non-blocking suggestions only when they improve approval confidence, future implementation clarity, or review usefulness.
9. Run `document-reviewer` on the merged `code-review.md` as the final approval-readiness pass.
   - Follow the Reviewer Invocation Contract below.
   - Invoke the exact pre-built `document-reviewer` agent.
   - Treat its blocking issues and missing questions as approval blockers unless the human explicitly defers them as non-blocking.
   - Preserve `document-reviewer` missing questions and approval recommendation in the Approval section when they affect human review.
10. Resolve all approval blockers before presenting the review for approval.
   - Ask the human follow-up questions as many times as necessary.
   - Update `code-review.md` after each answer.
   - Preserve the original blocking question, mark it `answered`, record the human's answer with the local date, and summarize the document impact. Do not remove answered blocking questions during updates.
   - Add a `Document Changelog` entry for each human answer, change request, reviewer-driven material update, approval, or requested-changes decision.
   - Update the frontmatter `updated` field to the local date whenever the document changes.
   - Rerun the affected reviewers and `document-reviewer` when an answer materially changes review scope, finding severity, security risk, test coverage, plan alignment, or approval readiness.
   - Do not leave an approval-relevant question only in the document. Either answer it, record the human's explicit non-blocking deferral, or keep the review not ready for approval.
11. Tell the human the review path and that it is pending approval.
   - Ask them to review it and explicitly approve or request changes.

## Runtime Compatibility

- In runtimes with native plugin agents, use the named plugin agents from the root-level `agents/` directory and their full Markdown definitions.
- In Codex, prefer the exact named generated custom agents installed by `setup-codex-agents`.
- If no compatible native or generated agent is available, read the matching reviewer prompt from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and perform that pass inline or through the closest available delegation mechanism.
- Do not skip a configured reviewer solely because the current runtime exposes reviewer prompts as files instead of native agents.

## Reviewer Invocation Contract

- Invoke reviewer roles by exact pre-built agent name, such as `code-staff-engineer-reviewer` or `document-reviewer`.
- In Codex delegation APIs, selecting a reviewer means setting the reviewer as the agent type or custom-agent name, for example `agent_type: code-staff-engineer-reviewer`. Do not use `default`, `worker`, or a newly-created generic subagent when the named reviewer exists.
- In Codex, omit `fork_context` or set `fork_context: false` for named reviewer agents. Do not try a full-history/context fork first; named custom agents must receive a self-contained launch prompt.
- Start each launch prompt with the selected reviewer name for auditability, for example: `You are the already-selected Rubber Duck code-staff-engineer-reviewer custom agent. Use your configured agent instructions; this message only provides run-specific context.`
- Use the rest of the launch prompt only for run-specific context: review document path, source summary, diff or changed-file scope, focused test results, full quality gate results, related plan path when applicable, and any material constraints from the current session.
- Do not replace the reviewer with a compressed prompt such as `Please review for correctness...`. A short launch prompt is acceptable only after the named pre-built reviewer has been selected, and it must not restate, narrow, or override the agent definition.
- Let the selected reviewer follow its own scope, operating rules, checklist, and output format from `agents/<agent-name>.md` or the generated Codex TOML.
- If the runtime cannot invoke the named reviewer, read the full matching agent definition from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and perform the same review inline or through the closest available delegation mechanism. Treat this as a fallback and make the unavailability explicit.

## Document Requirements

Every code review must start with this frontmatter shape:

```yaml
---
title: Short Human Title
slug: short-slug
type: code-review
status: pending-approval
created: yyyy-mm-dd
updated: yyyy-mm-dd
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
- Workflow Compliance
- Blocking Questions
- Deferred Non-Blocking Questions
- Document Changelog
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

Findings should target changed hunks, newly added lines, removed lines, or new files. If a finding must mention an unchanged line in a touched file, explain why the changed code directly depends on it or newly exposes it.

## Reviewer Orchestration Notes

- Run independent exact pre-built reviewer agents in parallel when the current assistant environment supports it.
- Wait for all available code-focused reviewers, merge their findings, then run `document-reviewer` last on the merged review document.
- Use blocking findings, required questions or fixes, security/privacy questions, plan drift, missing tests, and reviewer conflicts as approval blockers unless they are explicitly deferred by the human as non-blocking.
- Validate Rubber Duck workflow compliance when relevant: generated documents must include `created` and `updated`, answered blocking questions must preserve the original question and human answer, changelogs must explain material updates, medium-to-complex plans must include subtasks and execution strategy, and completed planned subtasks must have `task_N.md` progress documents.
- The invoking skill owns the final review document. Reviewer agents return findings only; they do not edit the document.
- If an expected reviewer agent is unavailable, note that gap in the final response and in the review document's Approval section when it affects confidence.
- Do not approve the code changes on behalf of the human.
- Do not make code fixes from this skill unless the human explicitly changes the request from review to implementation.

## Approval Loop

If the human requests changes or answers a blocking question, update `code-review.md`, update `updated`, preserve the original question with the human answer, add a `Document Changelog` entry explaining what changed and why, rerun affected reviewers and `document-reviewer` when the change materially affects approval readiness, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests more changes, or stops the workflow.

Answered blocking questions must remain in `Blocking Questions` as answered entries. Only open blocking questions prevent approval.

## Approval Updates

If the human later explicitly approves the review, update the frontmatter:

```yaml
status: approved
updated: yyyy-mm-dd
approved: yyyy-mm-dd
approval_note: Short note
```

If the human requests changes, update the frontmatter:

```yaml
status: requested-changes
updated: yyyy-mm-dd
decision_date: yyyy-mm-dd
decision_note: Short note
```

Keep the visible status line in sync with frontmatter and add a matching `Document Changelog` entry.
