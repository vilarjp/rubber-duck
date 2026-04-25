---
title: Rubber Duck Build Plan
slug: rubber-duck-build-plan
type: project-plan
status: approved
created: 2026-04-23
updated: 2026-04-25
approved: 2026-04-23
approval_note: Approved by the human to guide incremental Rubber Duck development.
source: clean-room user brief
---

# Rubber Duck Build Plan

**Status:** approved

## Document Changelog

- 2026-04-25: Updated Rubber Duck workflow standards to require `updated` metadata, preserve answered blocking questions with human answers, record material document changes, plan medium-to-complex work as subtasks, add first-class implementation orchestration, and create per-subtask implementation progress documents.

## Purpose

Build `rubber-duck` from absolute scratch as a cross-host plugin marketplace focused on spec-driven feature development, bug diagnosis, implementation, review, and commit/push workflows.

This plan intentionally does not reuse previous repository state, previous implementation memories, or assumed product decisions. Product and packaging decisions are captured below so future sessions can proceed without re-asking them.

## Packaging Notes Verified On 2026-04-23, Updated 2026-04-24

- Skills use `SKILL.md`, can be invoked directly, and should keep supporting material in skill folders.
- Slash-command plugin hosts use `.claude-plugin/marketplace.json` at the repository root and `.claude-plugin/plugin.json` inside the plugin.
- Plugin UI hosts use `.agents/plugins/marketplace.json` at the repository root and `.codex-plugin/plugin.json` inside the plugin.
- Plugin components live at plugin root. Shared skills remain in the plugin root `skills/` directory.
- Native plugin agents are Markdown files with YAML frontmatter, should be focused, and should limit tools to the minimum necessary.
- Claude Code consumes the plugin root `agents/*.md` files directly; those Markdown agents set `model: sonnet`.
- Codex custom agents use TOML files under `.codex/agents/` or `~/.codex/agents/`. Rubber Duck ships a setup skill that converts the Markdown reviewer agents to Codex TOML with `model = "gpt-5.5"` and `model_reasoning_effort = "medium"`.
- Agent hooks exist in some hosts but are not required for the MVP.

## Resolved Decisions

1. Marketplace install flows:
   - Slash-command host: add `vilarjp/rubber-duck` as a plugin marketplace, then install `rubber-duck@rubber-duck`.
   - Plugin UI host: add `vilarjp/rubber-duck` as a plugin marketplace, then install Rubber Duck from the plugin UI.
2. GitHub repository: `vilarjp/rubber-duck`.
3. Plugin metadata:
   - Author: `João Vilar`
   - Email: `vilarjp93@gmail.com`
   - Repository: `https://github.com/vilarjp/rubber-duck`
   - Homepage: `https://github.com/vilarjp/rubber-duck/blob/main/README.md`
   - License: `MIT`
   - Initial release tag: `v0.0.1`
   - Manifest versions stay in sync across `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`
4. The technical planning skill is named `plan`.
5. Jira links rely only on authenticated tools already available in the user's current assistant session. Rubber Duck will not bundle Jira MCP configuration in the MVP.
6. Automated agent reviews return findings. The invoking skill owns the artifact and merges accepted findings into the document; reviewer agents must not edit files or write separate review files.
7. Document status uses YAML frontmatter plus a visible status line.
8. `commit-push` asks for a final explicit "yes, commit and push" after proposing commit scope and splits.
9. Protected branches are exactly `main`, `master`, `production`, and `staging`.
10. Reviewer agents avoid persistent memory. They return findings, and the invoking skill merges those findings into the document.
11. Reviewer agents return blocking findings and non-blocking suggestions, except `document-reviewer`, which focuses only on blocking issues, missing questions, and approval recommendation.
12. Stack-specialist agents infer the stack from repository files only.
13. Codex reviewer agents are installed by `setup-codex-agents`, because Codex marketplace installs expose skills while Codex custom agents live outside the plugin skill bundle.

## Validated Repository Layout

Session 1 validated that the root-level single-plugin layout with `"source": "."` should not be used for this repository. Rubber Duck uses root marketplace files that point to the nested plugin at `./plugins/rubber-duck`. The slash-command host manifest lives at `plugins/rubber-duck/.claude-plugin/plugin.json`; the plugin UI host manifest lives at `plugins/rubber-duck/.codex-plugin/plugin.json`.

Future sessions should keep the nested layout below unless the human explicitly approves a layout migration.

## Target Repository Layout

Chosen marketplace plus nested plugin layout:

```text
rubber-duck/
+-- README.md
+-- .claude-plugin/
|   +-- marketplace.json
+-- .agents/
|   +-- plugins/
|       +-- marketplace.json
+-- plugins/
|   +-- rubber-duck/
|       +-- .claude-plugin/
|       |   +-- plugin.json
|       +-- .codex-plugin/
|       |   +-- plugin.json
|       +-- skills/
|       |   +-- prd/
|       |   |   +-- SKILL.md
|       |   |   +-- agents/
|       |   |       +-- openai.yaml
|       |   +-- plan/
|       |   |   +-- SKILL.md
|       |   |   +-- agents/
|       |   |       +-- openai.yaml
|       |   +-- implement/
|       |   |   +-- SKILL.md
|       |   |   +-- agents/
|       |   |       +-- openai.yaml
|       |   +-- diagnosis/
|       |   |   +-- SKILL.md
|       |   |   +-- agents/
|       |   |       +-- openai.yaml
|       |   +-- code-review/
|       |   |   +-- SKILL.md
|       |   |   +-- agents/
|       |   |       +-- openai.yaml
|       |   +-- commit-push/
|       |   |   +-- SKILL.md
|       |   |   +-- agents/
|       |   |       +-- openai.yaml
|       |   +-- setup-codex-agents/
|       |       +-- SKILL.md
|       |       +-- agents/
|       |       |   +-- openai.yaml
|       |       +-- scripts/
|       |       |   +-- install-codex-agents.mjs
|       |       +-- source-agents/
|       |           +-- *.md
|       +-- agents/
|           +-- document-reviewer.md
|           +-- plan-future-maintainer.md
|           +-- plan-security-reviewer.md
|           +-- plan-staff-engineer.md
|           +-- code-staff-engineer-reviewer.md
|           +-- project-patterns-reviewer.md
|           +-- implementation-plan-matcher.md
|           +-- code-security-reviewer.md
|           +-- test-reviewer.md
+-- docs/
    +-- 2026-04-23-rubber-duck-build-plan/
        +-- plan.md
```

## Global Skill Rules

All initial skills should:

- Be standalone: no skill invokes or requires another skill.
- Be manual by default with `disable-model-invocation: true`, because they write files, edit code, inspect private data, or run git operations.
- For plugin UI hosts, set `policy.allow_implicit_invocation: false` in each skill's `agents/openai.yaml` for the same manual-invocation safety.
- Accept `$ARGUMENTS` as either a free-form prompt, a Jira link, a GitHub PR link where applicable, or a slug/source hint.
- Ask the human when the input is ambiguous enough that choosing would risk a wrong artifact or wrong code change.
- If given a Jira link, attempt to read it only through available authenticated tools. If access fails, ask the human to paste the Jira title, description, acceptance criteria, comments, and relevant links.
- Create generated documents under the target project root, not inside the installed plugin cache:
  `docs/yyyy-mm-dd-{slug}/`.
- Derive `{slug}` from a human-provided slug when available. If no slug is provided, derive a short kebab-case slug from the requested feature or bug without asking the human.
- Use the local current date for the folder prefix.
- Put document status in frontmatter:

```yaml
status: pending-approval | completed
```

- Leave `prd`, `plan`, `diagnosis`, and `code-review` documents as `pending-approval` until explicit human confirmation.
- On later human confirmation, update status to `approved` or `requested-changes`, set `updated` to the local date, record the decision date and short note, and add a changelog entry.
- Keep documents concise, useful as LLM context, and free of filler.
- Prefer evidence over speculation. If uncertain, write the uncertainty and ask.
- Run their configured reviewer agents before finalizing when those agents exist, then merge findings into the generated document.
- Before presenting any `prd`, `plan`, `diagnosis`, or `code-review` document for approval, ask the human follow-up questions as many times as necessary to resolve all material ambiguity, reviewer missing questions, and agent doubts.
- Do not ask for approval while approval-relevant uncertainty remains unresolved. If a question is intentionally left open, label it as deferred and non-blocking, explain why approval can still proceed, and record that the human explicitly accepted the deferral.
- Treat reviewer blocking issues, security/privacy questions, and "Questions For The Human" as approval blockers unless the reviewer explicitly marks them non-blocking with rationale or the human explicitly defers them.
- If the human answers a blocking question or requests changes, update the document, set `updated` to the local date, keep the original blocking question as an answered entry with the human answer and document impact, add a changelog entry, rerun the required reviewer agents when the answer materially changes the artifact, merge any new blocking feedback, and ask again. Repeat until the human explicitly approves, requests changes, or stops the workflow.
- When multiple reviewer agents run, use a fan-out/fan-in flow: run independent reviewers in parallel when supported, wait for all available reviewers, merge findings by severity and evidence, preserve reviewer conflicts as human questions, and only then ask the human.

## Document Standards

Every generated document should start with:

```yaml
---
title: Short Human Title
slug: short-slug
type: prd | plan | diagnosis | code-review | implementation-task
status: pending-approval
created: yyyy-mm-dd
updated: yyyy-mm-dd
source: prompt | jira | github-pr | local-diff | plan
---
```

Documents should include only sections that help the work move forward. "Straight to the point" is a requirement, not a style preference.

Question sections should not hide approval blockers. If a question affects approval readiness, scope, behavior, security, review confidence, or implementation safety, put it under Blocking Questions or ask the human before presenting the artifact for approval. Use Deferred Non-Blocking Questions only for questions the human has explicitly accepted as safe to defer. Answered blocking questions stay in Blocking Questions with the original question, human answer, answer date, and document impact.

Documents should include `Document Changelog` when they are updated after creation. Record human answers, requested changes, reviewer-driven material updates, approvals, requested-changes decisions, implementation progress updates, and why the document changed.

## Skill Specifications

### prd

Path: `skills/prd/SKILL.md`

Purpose: Generate a Product Requirements Document, the "what and why".

Inputs:
- Free-form prompt.
- Jira link.

Output:
- `docs/yyyy-mm-dd-{slug}/prd.md`
- Status: `pending-approval`.

Required workflow:
1. Gather source context from prompt or Jira.
2. Ask for missing product facts that would materially change scope, user value, or acceptance criteria.
3. Write a concise PRD.
4. Invoke `document-reviewer`.
5. Apply reviewer feedback only if it improves correctness or clarity.
6. Resolve all reviewer blocking issues and missing questions before asking for approval, unless the human explicitly marks a question as deferred and non-blocking.
7. Tell the human the file is pending approval and ask them to review it.

Suggested PRD sections:
- Summary
- Problem
- Goals
- Non-goals
- Users / use cases
- Requirements
- Acceptance criteria
- Success signals
- Risks / dependencies
- Blocking questions
- Deferred non-blocking questions
- Document changelog
- Approval

### plan

Path: `skills/plan/SKILL.md`

Purpose: Generate the technical implementation guide, the "how".

Inputs:
- Free-form prompt.
- Jira link.
- Optional slug pointing to an existing PRD folder.

Output:
- `docs/yyyy-mm-dd-{slug}/plan.md`
- Status: `pending-approval`.

Required workflow:
1. Gather source context from prompt or Jira.
2. If a slug is present, check for an existing related PRD in `docs/*-{slug}/prd.md`.
3. If multiple PRDs match, ask which one to use.
4. Inspect the codebase enough to propose the smallest correct implementation.
5. Write the implementation plan.
   - Classify implementation complexity as simple, medium, or complex.
   - For medium-to-complex work, include implementation subtasks with task IDs, execution mode, dependencies, ownership/files, acceptance checks, and planned `task_N.md` progress documents.
   - Recommend `single focused pass`, `incremental task-by-task`, or `parallel implementation subagents`.
   - Recommend whether `/rubber-duck:orchestrate-implementation` should coordinate the work or whether a simple `/rubber-duck:implement` pass is enough.
6. Invoke `plan-future-maintainer`, `plan-security-reviewer`, and `plan-staff-engineer` in parallel when supported.
7. Apply reviewer feedback that improves correctness, security, maintainability, or future readability.
8. Invoke `document-reviewer` on the merged plan as the final approval-readiness pass.
9. Resolve all reviewer blocking issues and missing questions before asking for approval, unless the human explicitly marks a question as deferred and non-blocking.
10. Tell the human the file is pending approval and ask them to review it.

Suggested plan sections:
- Summary
- Source context
- Current system notes
- Proposed approach
- Implementation strategy
- Implementation subtasks
- Files / modules to touch
- Data model / migrations
- API / UI behavior
- Test plan
- Security / privacy / compliance
- Rollout / rollback
- Blocking questions
- Deferred non-blocking questions
- Document changelog
- Approval

### orchestrate-implementation

Path: `skills/orchestrate-implementation/SKILL.md`

Purpose: Coordinate approved plan subtasks sequentially or with parallel-safe implementation subagents.

Inputs:
- Approved plan slug or `plan.md` path.
- Optional task IDs.
- Optional sequential, parallel, next, or all-ready execution hint.

Output:
- Code and tests changed in the target project.
- One `task_N.md` progress document per completed planned subtask.

Required workflow:
1. Resolve the approved plan and require `status: approved` before orchestration unless the human explicitly accepts risk.
2. Read `Implementation Strategy`, `Implementation Subtasks`, dependencies, blocking questions, test plan, and existing `task_*.md` documents.
3. Build the task queue from named tasks, next ready sequential task, or ready parallel-safe group.
4. Select execution mode: sequential by default, parallel only when the plan marks tasks parallel-safe and ownership/files are disjoint.
5. Execute selected tasks locally or by launching one implementation subagent per selected parallel-safe task.
6. Fan in worker results, preserve disjoint ownership boundaries, and stop before overwriting conflicting worker changes.
7. Verify each completed task has a matching `task_N.md` document, focused tests, and full quality gate results when available.
8. Summarize execution mode, completed tasks, progress documents, changed files, verification, next ready task, and remaining risks.

### implement

Path: `skills/implement/SKILL.md`

Purpose: Implement a feature, bug fix, quick win, or code review adjustment.

Inputs:
- Free-form prompt.
- Jira link.
- Optional slug pointing to an existing plan, diagnosis, or code-review folder.

Output:
- Code and tests changed in the target project.
- When implementing planned subtasks, one progress document per completed subtask, such as `docs/yyyy-mm-dd-{slug}/task_1.md`.
- No required document for direct prompts or artifacts without planned subtasks unless the implementation reveals a material plan gap, in which case the skill should ask before changing the approved document.

Required workflow:
1. Gather prompt or Jira context.
2. If a slug is present, look for related `plan.md`, `diagnosis.md`, or `code-review.md`.
3. If relevant context exists, use it. If multiple candidates exist, ask.
   - When an approved plan contains implementation subtasks, inspect existing `task_*.md` documents to determine completed tasks and the next ready task.
4. Inspect the existing codebase and conventions.
5. Follow TDD whenever feasible: write or adjust a focused failing test first, then implement the smallest code change to pass.
6. Keep changes scoped to the current goal. Apply KISS and YAGNI. Do not refactor unrelated code.
7. Run focused tests, then the full quality gate when available: formatting checks, linting, type checks, builds or compilation, and the full automated test suite.
8. Do not invoke reviewer agents. Reviewer agents are invoked by the future `code-review` skill.
9. For completed planned subtasks, write or update the matching `task_N.md` progress document with the source plan task, implementation summary, changed files, tests, deviations, blocking questions, changelog, and next task.
10. Summarize changed files, completed subtasks, progress documents, focused tests, full quality gate commands, unavailable verification categories, and remaining risks.

### diagnosis

Path: `skills/diagnosis/SKILL.md`

Purpose: Investigate a bug and produce a diagnosis document covering how and where it happens, why it happens, and possible solutions.

Inputs:
- Free-form prompt.
- Jira link.

Output:
- `docs/yyyy-mm-dd-{slug}/diagnosis.md`
- Status: `pending-approval`.
- The diagnosis document is the only file this skill may create or modify.

Required workflow:
1. Gather bug report, reproduction, expected behavior, and observed behavior.
2. Inspect code paths, tests, logs, and recent changes when available.
3. Form hypotheses and validate them with code evidence.
4. Never modify source code, tests, configuration, or other project files.
5. Write the diagnosis document.
6. Invoke `document-reviewer`.
7. Resolve all reviewer blocking issues and missing questions before asking for approval, unless the human explicitly marks a question as deferred and non-blocking.
8. Tell the human the file is pending approval and ask them to review it.

Suggested diagnosis sections:
- Summary
- Reproduction
- Observed behavior
- Expected behavior
- Investigation notes
- Probable root cause
- Affected files / flows
- Solution options
- Recommended next step
- Verification plan
- Blocking questions
- Deferred non-blocking questions
- Document changelog
- Approval

### code-review

Path: `skills/code-review/SKILL.md`

Purpose: Review code and generate a code review document.

Inputs:
- No argument: review all uncommitted changes, staged and unstaged, including relevant untracked files.
- GitHub PR link: review the PR.

Output:
- `docs/yyyy-mm-dd-{slug}/code-review.md`
- Status: `pending-approval`.

Required workflow:
1. Determine scope:
   - If a PR link is provided, fetch PR metadata, diff, comments, and checks through available authenticated tools.
   - Otherwise inspect `git status`, staged diff, unstaged diff, and relevant untracked files.
2. Prefer findings over commentary. No filler.
3. Write the initial review document.
4. Invoke `code-staff-engineer-reviewer`, `project-patterns-reviewer`, `code-security-reviewer`, and `test-reviewer` in parallel when supported.
5. Invoke `implementation-plan-matcher` if a related plan can be found.
   - Include related `task_N.md` progress documents when a plan has implementation subtasks.
6. Merge duplicate findings and order by severity.
7. Validate workflow compliance when relevant: `updated` metadata, answered blocking questions, changelog entries, implementation subtasks, execution strategy, and per-subtask progress documents.
8. Invoke `document-reviewer` on the merged `code-review.md` as the final approval-readiness pass.
9. Resolve all reviewer blocking issues and missing questions before asking for approval, unless the human explicitly marks a question as deferred and non-blocking.
10. Tell the human the file is pending approval and ask them to review it.

Suggested code-review sections:
- Scope
- Findings
- Security / privacy notes
- Test coverage notes
- Project convention notes
- Plan alignment
- Workflow compliance
- Blocking questions
- Deferred non-blocking questions
- Document changelog
- Approval

### commit-push

Path: `skills/commit-push/SKILL.md`

Purpose: Analyze uncommitted work, create one or more conventional commits when appropriate, and push to the selected branch.

Inputs:
- Optional free-form hint for branch name or commit intent.

Output:
- One or more local commits.
- Pushed branch.

Required workflow:
1. Always ask the human for the target branch name before committing or pushing.
2. Refuse protected branch targets: `main`, `master`, `production`, and `staging`.
3. Fetch remote branch state.
4. If the branch exists remotely, check it out safely.
5. If the branch does not exist remotely, create it locally.
6. Inspect all uncommitted changes: staged, unstaged, and untracked.
7. Split commits only when there are clear logical units.
8. Use conventional commits.
9. Do not include unrelated changes.
10. Present the proposed commit split and commit messages.
11. Ask for a final explicit "yes, commit and push".
12. Do not force push unless the human explicitly asks and the branch is not protected.
13. Push the branch only after final confirmation.

Conventional commit examples:
- `feat(prd): add product requirements skill`
- `fix(commit-push): block protected branch pushes`
- `docs(readme): document marketplace installation`

## Agent Specifications

All agents should:

- Live in `agents/`.
- Set `model: sonnet` in Markdown frontmatter for Claude Code.
- Be convertible to Codex TOML with `model = "gpt-5.5"` and `model_reasoning_effort = "medium"`.
- Be read-only unless a future requirement explicitly needs edits.
- Avoid persistent memory.
- Prefer `tools: Read, Grep, Glob, Bash` for code and git inspection.
- Return concise blocking findings and non-blocking suggestions with severity, evidence, and exact file references where applicable.
- Flag uncertainty instead of inventing project facts.
- When human input is needed, return the exact question for the invoking skill to ask; do not ask the human directly unless invoked directly by the human.
- Classify human questions as blocking or non-blocking, with rationale for any non-blocking question.
- Do not treat an artifact as approval-ready while blocking issues or blocking questions remain.
- Avoid broad restatement of the prompt.

### document-reviewer

Purpose: Review PRD, plan, diagnosis, and code-review documents for completeness, correctness, clarity, missing answers, mismatches with the user's request, and unresolved uncertainty.

Used by:
- `prd`
- `plan`
- `diagnosis`
- `code-review`

Output:
- Blocking issues
- Missing questions to ask the human
- Approval recommendation: pass, pass-with-notes, or revise

### plan-future-maintainer

Purpose: Review a plan as if reading it three months later to understand what was intended, why it was done, and how to answer future maintenance questions.

Used by:
- `plan`

Output:
- Missing future context
- Ambiguous decisions
- Areas where the plan may age poorly
- Recommended concise additions

### plan-security-reviewer

Purpose: Review a plan for LGPD, PII, PCI, authorization, input validation, sanitization, secrets, environment variables, logging, retention, and abuse cases.

Used by:
- `plan`

Output:
- Security/privacy gaps
- Required mitigations
- Questions for the human when compliance scope is unclear

### plan-staff-engineer

Purpose: Review a plan as a staff engineer specializing in the detected project stack and catch design decisions that could become production bugs.

Used by:
- `plan`

Output:
- Architecture risks
- Stack-specific mistakes
- Missing migration, compatibility, or observability concerns
- Simpler implementation options

### code-staff-engineer-reviewer

Purpose: Review implementation or PR changes for code quality, stack best practices, maintainability, correctness, and production risk.

Used by:
- `code-review`

Output:
- Findings ordered by severity
- Required fixes
- Optional simplifications

### project-patterns-reviewer

Purpose: Check whether changed code follows the existing codebase's conventions, naming, layering, testing style, abstractions, and file organization.

Used by:
- `code-review`

Output:
- Pattern mismatches
- Suggested local-pattern alternatives
- Evidence from nearby files

### implementation-plan-matcher

Purpose: Verify that implementation changes match the approved plan exactly and flag drift, missing requirements, or extra scope.

Used by:
- `code-review` when a related plan exists

Output:
- Matched plan items
- Missing plan items
- Extra implementation scope
- Required questions or fixes

### code-security-reviewer

Purpose: Review code changes for LGPD, PII, PCI, authorization, input validation, sanitization, secrets, environment variables, logging, dependency risk, and data exposure.

Used by:
- `code-review`

Output:
- Security/privacy findings
- Required mitigations
- Risk classification

### test-reviewer

Purpose: Review whether tests cover the created or modified behavior, important scenarios, edge cases, regression risks, and whether tests assert meaningful outcomes.

Used by:
- `code-review`

Output:
- Missing tests
- Weak assertions
- Redundant tests
- Recommended focused test additions

## Automatic Agent Triggering Strategy

MVP strategy:

- Skills stay inline in the main assistant session.
- Skills are meant to be explicitly invoked by the human with slash commands, plugin mentions, or skill mentions, not inferred automatically.
- Each review-producing skill includes explicit instructions to invoke the required plugin agents before finalizing.
- If the current runtime is Codex, run `setup-codex-agents` once after plugin installation to generate Codex custom agents.
- If no compatible native or generated agent is available, the skill reads the corresponding reviewer prompt from `agents/<agent-name>.md` or `skills/setup-codex-agents/source-agents/<agent-name>.md` and performs the same reviewer pass inline or through the closest available delegation mechanism.
- Claude Code reviewer agents use Sonnet. Generated Codex reviewer agents use GPT-5.5 with medium reasoning by default.
- Do not use skill `context: fork` for multi-reviewer workflows, because `context: fork` sends the whole skill to one subagent rather than orchestrating a reviewer group.
- Do not rely on agent teams for MVP, because some hosts start teams only when requested or confirmed by the user.
- Do not rely on agent hooks for MVP, because official docs mark agent hooks experimental.
- Do not require runtime smoke tests during MVP construction. Use explicit skill instructions and plugin validation first.

## README Target

The root `README.md` should eventually include:

- What Rubber Duck is.
- Motivation: lightweight spec-driven development for agentic coding sessions, aimed at features, bugs, implementation, review, and safe shipping.
- Clean-room note: no previous Rubber Duck implementation assumed.
- Install from marketplace:
  - Add `vilarjp/rubber-duck` as a plugin marketplace.
  - Install the `rubber-duck` plugin.
  - Validate with the host's plugin, help, and agent views when available.
- Local development:
  - Reload plugins after local file changes.
  - Run the relevant host validator from the repository root when available.
  - Restart the host after marketplace or plugin file changes when required.
- Skill table: name, purpose, inputs, outputs.
- Agent table: name, used by, purpose.
- Codex setup step for generating `.codex/agents/*.toml` reviewer agents.
- Document status lifecycle.
- Example workflows:
  - PRD -> plan -> implement -> code-review -> commit-push.
  - diagnosis -> implement -> code-review -> commit-push.
  - PR link -> code-review.
- Safety rules:
  - TDD for implementation.
  - protected branch refusal.
  - no unrelated code changes.
  - no Jira assumptions when access fails.
- Troubleshooting.
- Contributing and release/versioning policy.

## Incremental Build Sessions

Each implementation session after this plan should create exactly one skill or one subagent. README and validation updates can happen in the same session, but the new functional component count should stay at one.

### Session 1: Scaffold Marketplace And Create `document-reviewer`

Deliverables:
- Root marketplace skeleton.
- Plugin skeleton.
- `agents/document-reviewer.md`.
- README install/dev skeleton.

Validation:
- Run the host validator from the repository root when available.

### Session 2: Create `prd` Skill

Deliverables:
- `skills/prd/SKILL.md`.
- PRD document template embedded or bundled in the skill folder.
- README skill table update.

Validation:
- Run the host validator from the repository root when available.

### Session 3: Create `plan-future-maintainer` Agent

Deliverables:
- `agents/plan-future-maintainer.md`.
- README agent table update.

Validation:
- Run the host validator from the repository root when available.

### Session 4: Create `plan-security-reviewer` Agent

Deliverables:
- `agents/plan-security-reviewer.md`.
- README agent table update.

Validation:
- Run the host validator from the repository root when available.

### Session 5: Create `plan-staff-engineer` Agent

Deliverables:
- `agents/plan-staff-engineer.md`.
- README agent table update.

Validation:
- Run the host validator from the repository root when available.

### Session 6: Create `plan` Skill

Deliverables:
- `skills/plan/SKILL.md`.
- Plan document template.
- Agent orchestration for document, future maintainer, security, and staff engineer review.
- README skill table update.

Validation:
- Run the host validator from the repository root when available.

### Session 7: Create `diagnosis` Skill

Deliverables:
- `skills/diagnosis/SKILL.md`.
- Diagnosis document template.
- README skill table update.

Validation:
- Run the host validator from the repository root when available.

### Session 8: Create `code-staff-engineer-reviewer` Agent

Deliverables:
- `agents/code-staff-engineer-reviewer.md`.
- README agent table update.

Validation:
- Run the host validator from the repository root when available.

### Session 9: Create `project-patterns-reviewer` Agent

Deliverables:
- `agents/project-patterns-reviewer.md`.
- README agent table update.

Validation:
- Run the host validator from the repository root when available.

### Session 10: Create `implementation-plan-matcher` Agent

Deliverables:
- `agents/implementation-plan-matcher.md`.
- README agent table update.

Validation:
- Run the host validator from the repository root when available.

### Session 11: Create `code-security-reviewer` Agent

Deliverables:
- `agents/code-security-reviewer.md`.
- README agent table update.

Validation:
- Run the host validator from the repository root when available.

### Session 12: Create `test-reviewer` Agent

Deliverables:
- `agents/test-reviewer.md`.
- README agent table update.

Validation:
- Run the host validator from the repository root when available.

### Session 13: Create `implement` Skill

Deliverables:
- `skills/implement/SKILL.md`.
- TDD workflow instructions.
- README skill table update.

Validation:
- Run the host validator from the repository root when available.

### Session 14: Create `code-review` Skill

Deliverables:
- `skills/code-review/SKILL.md`.
- Code review document template.
- Agent orchestration for staff, patterns, plan match when applicable, security, tests, and document review.
- README skill table update.

Validation:
- Run the host validator from the repository root when available.

### Session 15: Create `commit-push` Skill

Deliverables:
- `skills/commit-push/SKILL.md`.
- Conventional commit workflow.
- Protected branch guard.
- README skill table update.

Validation:
- Run the host validator from the repository root when available.

## Session Definition Of Done

Every session should finish with:

- Exactly one new skill or subagent added.
- Any README table or usage text updated for that component.
- Host validator run, or a clear note if unavailable.
- No unrelated file changes.
- No previous Rubber Duck implementation reused.

## MVP Non-Goals

- No Atlassian/Jira MCP bundled in the MVP.
- No persistent agent memory in the MVP.
- No agent teams until the user explicitly asks for them.
- No experimental agent hooks for required reviewer flow.
- No dependency-heavy scripts unless a repeated workflow proves deterministic scripting is needed.
- No slash commands under `commands/`; use `skills/` for new plugin skills.

## Current Build State

The original Session 1 validation has been resolved. The repository should continue using the dual root marketplace files plus nested `plugins/rubber-duck/` plugin layout unless the human explicitly approves a future layout migration.
