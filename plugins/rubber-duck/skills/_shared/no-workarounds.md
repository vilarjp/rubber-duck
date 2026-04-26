# No-Workarounds Checklist

Prefer root-cause fixes over patches that make symptoms disappear while preserving the underlying defect.

Before approving a diagnosis, implementation, or code-review finding, check for these workaround smells:

- Type suppression: casts, ignores, `any`, or unchecked dynamic access used to silence type errors without proving the data shape.
- Lint or test bypass: disabled rules, skipped tests, loosened assertions, or changed config used to make the gate pass without fixing behavior.
- Swallowed errors: empty catches, generic fallback values, hidden promise failures, or logging-only paths that lose the failure signal.
- Timing patches: sleeps, arbitrary retries, polling, or debounce changes used without identifying the ordering, state, or concurrency issue.
- Monkey patches: runtime patching, global mutation, or special-case overrides that bypass the intended extension point.
- Scattered special cases: repeated conditionals across layers where one boundary, parser, adapter, or domain rule should own the behavior.
- Copy-pasted fixes: duplicated code used to avoid extracting or reusing the local abstraction that already owns the behavior.

Escape valves are acceptable only when they are explicit, temporary, constrained, and tracked:

- The root cause is outside the current ownership boundary.
- The workaround is needed for an urgent mitigation.
- The plan or final summary names the follow-up, owner, and verification needed to remove it.
