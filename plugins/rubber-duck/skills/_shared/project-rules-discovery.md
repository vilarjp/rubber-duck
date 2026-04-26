# Project Rules Discovery

Before planning, implementing, or reviewing a change, look for repository-local instructions and conventions that should govern the work.

Prefer the smallest relevant set of files. Do not browse unrelated project areas just because a rules file exists.

## Common Sources

- `AGENTS.md`
- `CLAUDE.md`
- `CONTRIBUTING.md`
- `ARCHITECTURE.md`
- `README.md`
- `.cursor/rules/`
- `.cursorrules`
- `.windsurf/rules/`
- `.github/copilot-instructions.md`
- Package manager files and lockfiles
- Lint, format, typecheck, test, build, and CI configuration
- Nearby source, tests, templates, fixtures, generated artifacts, and examples

## Apply The Rules

- Prefer explicit project instructions over generic preferences.
- Treat conflicts between rules and the requested work as approval-relevant questions.
- Preserve local naming, layering, file organization, test style, and generated-document conventions.
- Record important discovered rules in the generated document only when they affect implementation, review, or approval.
