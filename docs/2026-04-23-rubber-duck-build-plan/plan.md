---
title: Rubber Duck Build Plan
slug: rubber-duck-build-plan
type: project-plan
status: approved
created: 2026-04-23
approved: 2026-04-23
approval_note: Approved by the human to guide incremental Rubber Duck development.
source: clean-room user brief
---

# Rubber Duck Build Plan

**Status:** approved

## Purpose

Build `rubber-duck` from absolute scratch as a Claude Code plugin marketplace focused on spec-driven feature development, bug diagnosis, implementation, review, and commit/push workflows.

This plan intentionally does not reuse previous repository state, previous implementation memories, or assumed product decisions. Product and packaging decisions are captured below so future sessions can proceed without re-asking them.

## Official References Verified On 2026-04-23

- [Claude Code skills](https://code.claude.com/docs/en/skills): skills use `SKILL.md`, can be invoked directly, support frontmatter such as `disable-model-invocation`, `argument-hint`, `allowed-tools`, `context`, and `agent`, and should keep supporting material in skill folders.
- [Claude Code plugins](https://code.claude.com/docs/en/plugins): plugins are the right packaging model for reusable marketplace distribution; plugin skills are namespaced as `/plugin-name:skill-name`; plugin components live at plugin root, not inside `.claude-plugin/`.
- [Claude Code plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces): marketplace repos expose `.claude-plugin/marketplace.json`; GitHub marketplaces can be added with `/plugin marketplace add owner/repo`.
- [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference): plugin manifests use `.claude-plugin/plugin.json`; skills live in `skills/`, agents in `agents/`, hooks in `hooks/hooks.json`, and `claude plugin validate` validates plugin and marketplace structure.
- [Claude Code subagents](https://code.claude.com/docs/en/subagents): subagents are Markdown files with YAML frontmatter, should be focused, can set `model: sonnet`, and should limit tools to the minimum necessary.
- [Claude Code hooks reference](https://code.claude.com/docs/en/hooks): agent hooks exist but are experimental; do not rely on them for the MVP unless explicitly approved.

Note: the local Codex `plugin-creator` skill uses `.codex-plugin`, which is not the Claude Code plugin format. Rubber Duck should follow Claude Code's `.claude-plugin` structure.

## Resolved Decisions

1. Marketplace install flow:
   - `/plugin marketplace add vilarjp/rubber-duck`
   - `/plugin install rubber-duck@rubber-duck`
2. GitHub repository: `vilarjp/rubber-duck`.
3. Plugin metadata:
   - Author: `João Vilar`
   - Email: `vilarjp93@gmail.com`
   - Repository: `https://github.com/vilarjp/rubber-duck`
   - Homepage: `https://github.com/vilarjp/rubber-duck/blob/main/README.md`
   - License: `MIT`
   - Initial release tag: `v0.0.1`
   - Manifest version: `0.0.1` if Claude Code validation requires SemVer without a leading `v`
4. The technical planning skill is named `plan`.
5. Jira links rely only on authenticated tools already available in the user's Claude Code session. Rubber Duck will not bundle Jira MCP configuration in the MVP.
6. Automated agent reviews update the respective document instead of writing separate review files.
7. Document status uses YAML frontmatter plus a visible status line.
8. `commit-push` asks for a final explicit "yes, commit and push" after proposing commit scope and splits.
9. Protected branches are exactly `main`, `master`, `production`, and `staging`.
10. Reviewer agents avoid persistent memory. They return findings, and the invoking skill merges those findings into the document.
11. Reviewer agents return blocking findings and non-blocking suggestions, except `document-reviewer`, which focuses only on blocking issues, missing questions, and approval recommendation.
12. Stack-specialist agents infer the stack from repository files only.

## Remaining Validation Question

Session 1 must verify whether Claude Code accepts a single-plugin marketplace repo where the marketplace entry points to the repository root with `"source": "."` and the root `.claude-plugin/` directory contains both `marketplace.json` and `plugin.json`.

If validation fails, fall back to the nested `plugins/rubber-duck/` layout. If validation passes, keep the flatter root-level layout below.

## Target Repository Layout

Recommended single-plugin marketplace layout:

```text
rubber-duck/
+-- README.md
+-- .claude-plugin/
|   +-- marketplace.json
|   +-- plugin.json
+-- skills/
|   +-- prd/
|   |   +-- SKILL.md
|   +-- plan/
|   |   +-- SKILL.md
|   +-- implement/
|   |   +-- SKILL.md
|   +-- diagnosis/
|   |   +-- SKILL.md
|   +-- code-review/
|   |   +-- SKILL.md
|   +-- commit-push/
|       +-- SKILL.md
+-- agents/
|   +-- document-reviewer.md
|   +-- plan-future-maintainer.md
|   +-- plan-security-reviewer.md
|   +-- plan-staff-engineer.md
|   +-- code-staff-engineer-reviewer.md
|   +-- project-patterns-reviewer.md
|   +-- implementation-plan-matcher.md
|   +-- code-security-reviewer.md
|   +-- test-reviewer.md
+-- docs/
    +-- 2026-04-23-rubber-duck-build-plan/
        +-- plan.md
```

## Global Skill Rules

All initial skills should:

- Be standalone: no skill invokes or requires another skill.
- Be manual by default with `disable-model-invocation: true`, because they write files, edit code, inspect private data, or run git operations.
- Accept `$ARGUMENTS` as either a free-form prompt, a Jira link, a GitHub PR link where applicable, or a slug/source hint.
- Ask the human when the input is ambiguous enough that choosing would risk a wrong artifact or wrong code change.
- If given a Jira link, attempt to read it only through available authenticated tools. If access fails, ask the human to paste the Jira title, description, acceptance criteria, comments, and relevant links.
- Create generated documents under the target project root, not inside the installed plugin cache:
  `docs/yyyy-mm-dd-{slug}/`.
- Derive `{slug}` from a human-provided slug when available. If no slug is provided, derive a short kebab-case slug from the requested feature or bug without asking the human.
- Use the local current date for the folder prefix.
- Put document status in frontmatter:

```yaml
status: pending-approval
```

- Leave `prd`, `plan`, `diagnosis`, and `code-review` documents as `pending-approval` until explicit human confirmation.
- On later human confirmation, update status to `approved` or `requested-changes` and record the decision date and short note.
- Keep documents concise, useful as LLM context, and free of filler.
- Prefer evidence over speculation. If uncertain, write the uncertainty and ask.
- Run their configured reviewer agents before finalizing when those agents exist, then merge findings into the generated document.

## Document Standards

Every generated document should start with:

```yaml
---
title: Short Human Title
slug: short-slug
type: prd | plan | diagnosis | code-review
status: pending-approval
created: yyyy-mm-dd
source: prompt | jira | github-pr | local-diff
---
```

Documents should include only sections that help the work move forward. "Straight to the point" is a requirement, not a style preference.

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
6. Tell the human the file is pending approval and ask them to review it.

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
- Open questions
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
6. Invoke `document-reviewer`, `plan-future-maintainer`, `plan-security-reviewer`, and `plan-staff-engineer`.
7. Apply reviewer feedback that improves correctness, security, maintainability, or future readability.
8. Tell the human the file is pending approval and ask them to review it.

Suggested plan sections:
- Summary
- Source context
- Current system notes
- Proposed approach
- Files / modules to touch
- Data model / migrations
- API / UI behavior
- Test plan
- Security / privacy / compliance
- Rollout / rollback
- Open questions
- Approval

### implement

Path: `skills/implement/SKILL.md`

Purpose: Implement a feature, bug fix, quick win, or code review adjustment.

Inputs:
- Free-form prompt.
- Jira link.
- Optional slug pointing to an existing plan, diagnosis, or code-review folder.

Output:
- Code and tests changed in the target project.
- No required document unless the implementation reveals a material plan gap, in which case the skill should ask before changing the approved document.

Required workflow:
1. Gather prompt or Jira context.
2. If a slug is present, look for related `plan.md`, `diagnosis.md`, or `code-review.md`.
3. If relevant context exists, use it. If multiple candidates exist, ask.
4. Inspect the existing codebase and conventions.
5. Follow TDD whenever feasible: write or adjust a focused failing test first, then implement the smallest code change to pass.
6. Keep changes scoped to the current goal. Apply KISS and YAGNI. Do not refactor unrelated code.
7. Run focused tests, then broader tests when blast radius warrants it.
8. Do not invoke reviewer agents. Reviewer agents are invoked by the future `code-review` skill.
9. Summarize changed files, tests run, and remaining risks.

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
7. Tell the human the file is pending approval and ask them to review it.

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
- Open questions
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
3. Invoke `code-staff-engineer-reviewer`, `project-patterns-reviewer`, `code-security-reviewer`, `test-reviewer`, and `document-reviewer`.
4. Invoke `implementation-plan-matcher` if a related plan can be found.
5. Merge duplicate findings and order by severity.
6. Write the review document.
7. Tell the human the file is pending approval and ask them to review it.

Suggested code-review sections:
- Scope
- Findings
- Security / privacy notes
- Test coverage notes
- Project convention notes
- Plan alignment
- Open questions
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
- Set `model: sonnet`.
- Be read-only unless a future requirement explicitly needs edits.
- Avoid persistent memory.
- Prefer `tools: Read, Grep, Glob, Bash` for code and git inspection.
- Return concise blocking findings and non-blocking suggestions with severity, evidence, and exact file references where applicable.
- Flag uncertainty instead of inventing project facts.
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

- Skills stay inline in the main Claude Code session.
- Skills are meant to be explicitly invoked by the human with slash commands, not inferred automatically.
- Each review-producing skill includes explicit instructions to invoke the required plugin agents before finalizing.
- Agents use `model: sonnet`.
- Do not use skill `context: fork` for multi-reviewer workflows, because `context: fork` sends the whole skill to one subagent rather than orchestrating a reviewer group.
- Do not rely on agent teams for MVP, because Claude Code starts teams only when requested or confirmed by the user.
- Do not rely on agent hooks for MVP, because official docs mark agent hooks experimental.
- Do not require runtime smoke tests during MVP construction. Use explicit skill instructions and plugin validation first.

## README Target

The root `README.md` should eventually include:

- What Rubber Duck is.
- Motivation: lightweight spec-driven development for Claude Code, aimed at features, bugs, implementation, review, and safe shipping.
- Clean-room note: no previous Rubber Duck implementation assumed.
- Install from marketplace:
  - Add marketplace with `/plugin marketplace add vilarjp/rubber-duck`.
  - Install with `/plugin install rubber-duck@rubber-duck`.
  - Validate with `/plugin`, `/help`, and `/agents`.
- Local development:
  - `claude --plugin-dir .`
  - `/reload-plugins`
  - `claude plugin validate .`
- Skill table: name, purpose, inputs, outputs.
- Agent table: name, used by, purpose.
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
- `claude plugin validate .`

### Session 2: Create `prd` Skill

Deliverables:
- `skills/prd/SKILL.md`.
- PRD document template embedded or bundled in the skill folder.
- README skill table update.

Validation:
- `claude plugin validate .`

### Session 3: Create `plan-future-maintainer` Agent

Deliverables:
- `agents/plan-future-maintainer.md`.
- README agent table update.

Validation:
- `claude plugin validate .`

### Session 4: Create `plan-security-reviewer` Agent

Deliverables:
- `agents/plan-security-reviewer.md`.
- README agent table update.

Validation:
- `claude plugin validate .`

### Session 5: Create `plan-staff-engineer` Agent

Deliverables:
- `agents/plan-staff-engineer.md`.
- README agent table update.

Validation:
- `claude plugin validate .`

### Session 6: Create `plan` Skill

Deliverables:
- `skills/plan/SKILL.md`.
- Plan document template.
- Agent orchestration for document, future maintainer, security, and staff engineer review.
- README skill table update.

Validation:
- `claude plugin validate .`

### Session 7: Create `diagnosis` Skill

Deliverables:
- `skills/diagnosis/SKILL.md`.
- Diagnosis document template.
- README skill table update.

Validation:
- `claude plugin validate .`

### Session 8: Create `code-staff-engineer-reviewer` Agent

Deliverables:
- `agents/code-staff-engineer-reviewer.md`.
- README agent table update.

Validation:
- `claude plugin validate .`

### Session 9: Create `project-patterns-reviewer` Agent

Deliverables:
- `agents/project-patterns-reviewer.md`.
- README agent table update.

Validation:
- `claude plugin validate .`

### Session 10: Create `implementation-plan-matcher` Agent

Deliverables:
- `agents/implementation-plan-matcher.md`.
- README agent table update.

Validation:
- `claude plugin validate .`

### Session 11: Create `code-security-reviewer` Agent

Deliverables:
- `agents/code-security-reviewer.md`.
- README agent table update.

Validation:
- `claude plugin validate .`

### Session 12: Create `test-reviewer` Agent

Deliverables:
- `agents/test-reviewer.md`.
- README agent table update.

Validation:
- `claude plugin validate .`

### Session 13: Create `implement` Skill

Deliverables:
- `skills/implement/SKILL.md`.
- TDD workflow instructions.
- README skill table update.

Validation:
- `claude plugin validate .`

### Session 14: Create `code-review` Skill

Deliverables:
- `skills/code-review/SKILL.md`.
- Code review document template.
- Agent orchestration for staff, patterns, plan match when applicable, security, tests, and document review.
- README skill table update.

Validation:
- `claude plugin validate .`

### Session 15: Create `commit-push` Skill

Deliverables:
- `skills/commit-push/SKILL.md`.
- Conventional commit workflow.
- Protected branch guard.
- README skill table update.

Validation:
- `claude plugin validate .`

## Session Definition Of Done

Every session should finish with:

- Exactly one new skill or subagent added.
- Any README table or usage text updated for that component.
- `claude plugin validate .` run, or a clear note if unavailable.
- No unrelated file changes.
- No previous Rubber Duck implementation reused.

## MVP Non-Goals

- No Atlassian/Jira MCP bundled in the MVP.
- No persistent agent memory in the MVP.
- No agent teams until the user explicitly asks for them.
- No experimental agent hooks for required reviewer flow.
- No dependency-heavy scripts unless a repeated workflow proves deterministic scripting is needed.
- No slash commands under `commands/`; use `skills/` for new Claude Code plugin skills.

## Ready For Session 1

The product, packaging, and workflow decisions needed for Session 1 are resolved. Session 1 should scaffold the root-level single-plugin marketplace layout, then validate whether that flatter layout is accepted by Claude Code.
