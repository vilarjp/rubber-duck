---
name: commit-push
description: Analyze local uncommitted work, propose safe conventional commit splits, require explicit human confirmation, and push a non-protected branch.
disable-model-invocation: true
argument-hint: "[optional branch name | commit intent hint]"
---

# Commit Push Skill

Use this skill to turn local uncommitted work into one or more intentional conventional commits and push the selected branch.

This skill is intentionally conservative. It must never commit, branch-switch, or push until the human has provided the required branch and final confirmation.

## Inputs

Accept `$ARGUMENTS` as an optional hint, such as:

- A target branch name.
- A short commit intent.
- A note about which files or logical units should be included.

Even when `$ARGUMENTS` appears to include a branch name, ask the human to confirm the exact target branch before committing or pushing.

## Output

Create one or more local commits and push the selected branch to the configured remote after explicit confirmation.

## Required Confirmations

1. Ask the human for the exact target branch name before any commit or push work.
2. Present the proposed commit split, included paths, excluded paths, and conventional commit messages.
3. Ask for the exact final confirmation:

```text
yes, commit and push
```

Do not treat a vague approval, approval of only the branch, or approval of only the commit message as final confirmation.

If the scope, branch, remote state, or proposed commits change after confirmation, present the updated proposal and ask again.

## Protected Branch Guard

Refuse to commit to or push these protected branch targets:

- `main`
- `master`
- `production`
- `staging`

Normalize branch inputs before checking protection:

- Treat `origin/main`, `refs/heads/main`, and similar remote or ref forms as `main`.
- Compare protected names case-insensitively.
- If the current branch is protected, require the human to choose a non-protected target branch before proceeding.

Do not force push a protected branch. Do not force push any branch unless the human explicitly asks for force push after the branch has passed the protected-branch guard. Prefer `--force-with-lease` over `--force` when an explicit force push is approved.

## Workflow

1. Gather branch intent.
   - Read `$ARGUMENTS` only as a hint.
   - Ask the human for the exact target branch name.
   - If the target branch is protected, stop and ask for a non-protected branch.
2. Inspect the repository state before changing branches.
   - Run `git status --short --branch`.
   - Identify the current branch, upstream, staged changes, unstaged changes, untracked files, and whether there is an in-progress merge, rebase, cherry-pick, revert, or bisect.
   - If a git operation is already in progress, stop and ask the human how to proceed.
3. Fetch remote branch state.
   - Fetch the configured remote, usually `origin`.
   - If fetching fails because the remote is unavailable or credentials are missing, stop before committing and explain the blocker.
4. Check out or create the target branch safely.
   - If the target branch exists remotely, switch to a local branch tracking it.
   - If the target branch exists locally, switch to it and compare it with its upstream when available.
   - If the target branch does not exist remotely or locally, create it locally from the current HEAD.
   - If uncommitted changes would be overwritten or stranded by branch switching, stop and ask the human whether to stash, commit elsewhere, or choose another branch.
5. Inspect all uncommitted work.
   - Review `git status`, `git diff --staged`, `git diff`, and relevant untracked files.
   - Include staged, unstaged, and untracked files in the analysis.
   - Ignore dependency directories, caches, build artifacts, logs, editor files, and generated noise unless the human explicitly asks to include them or they are clearly part of the intended change.
6. Separate intended and unrelated changes.
   - Do not include unrelated changes.
   - If unrelated changes are already staged, do not accidentally commit them. Ask before changing the index when needed.
   - If the intended scope is unclear, ask the human which paths belong in the commit.
7. Propose the commit plan.
   - Split commits only when there are clear logical units that can be understood and reverted independently.
   - Prefer a single commit when the work is one coherent change.
   - For each proposed commit, list the conventional commit message and included paths.
   - List excluded local changes when they exist.
   - Mention whether tests or checks appear to have been run, are available, or should be run before committing.
8. Ask for final confirmation.
   - Use the required phrase `yes, commit and push`.
   - Do not commit or push until the human responds with that exact confirmation.
9. Create commits after confirmation.
   - Stage only the files for the current commit.
   - Preserve unrelated working tree and index changes.
   - Use conventional commit messages.
   - If a commit command fails, stop and report the failure instead of trying broad recovery commands.
10. Push after successful commits.
    - Push the selected branch to the configured remote.
    - Use upstream setup for new branches, usually `git push -u origin <branch>`.
    - Do not force push unless explicitly approved and non-protected.
11. Summarize the result.
    - Include the branch, commit SHA or SHAs, commit messages, pushed remote, and any excluded local changes.
    - Include tests or checks run, or state that none were run.
    - Mention any remaining local uncommitted changes.

## Conventional Commit Rules

Use conventional commits in this shape:

```text
type(scope): short imperative summary
```

Allowed default types:

- `feat` for new user-facing behavior or plugin capability.
- `fix` for bug fixes.
- `docs` for documentation-only changes.
- `test` for test-only changes.
- `refactor` for behavior-preserving code restructuring.
- `chore` for maintenance, metadata, or tooling changes.

Choose a short lowercase scope from the affected area, such as `prd`, `plan`, `implement`, `code-review`, `commit-push`, `agents`, `readme`, or `plugin`.

Keep the summary concise, imperative, lowercase after the colon, and without a trailing period.

Examples:

```text
feat(commit-push): add guarded commit and push workflow
docs(readme): document commit-push skill
fix(commit-push): block protected branch pushes
```

Use a commit body only when it materially clarifies risk, migration notes, test coverage, or why the split exists.

## Safety Notes

- Do not run destructive commands such as `git reset --hard`, `git clean`, or forced branch deletion.
- Do not rewrite history unless the human explicitly requests it and the branch is not protected.
- Do not amend existing commits unless the human explicitly asks.
- Do not create tags or releases.
- Do not push multiple branches.
- Do not configure credentials, remotes, or signing keys unless the human explicitly asks.
- Preserve user changes you did not make.

## Final Response Requirements

After pushing, the final response must include:

- Target branch.
- Remote pushed to.
- Commit SHA or SHAs and messages.
- Tests or checks run.
- Remaining local changes, if any.

If the workflow stops before committing or pushing, explain the blocker and the safest next action.
