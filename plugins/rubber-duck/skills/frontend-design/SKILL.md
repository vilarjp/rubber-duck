---
name: frontend-design
description: 'Create or renovate high-craft frontend interfaces. Use for greenfield apps, pages, components, dashboards, tools, landing pages, product UI redesigns, layout transformations, theme systems, visual polish, responsive design, accessibility, motion, interaction states, and design-system-level customization. Especially useful when improving an existing codebase with a "renovate the house" mindset: preserve product identity while upgrading structure, consistency, usability, and visual quality. Not for backend-only work.'
argument-hint: "[brief | target route/path | redesign request]"
---

# Frontend Design

Use this skill to design, build, or renovate frontend experiences that feel specific, polished, responsive, accessible, and maintainable. The output should be working code, not a mood board.

## Inputs

Accept a user brief, target route/path, component, screenshot, prototype, product surface, redesign request, or frontend audit request. When the target is ambiguous, inspect the local app structure and ask only for decisions that would change product identity, primary workflow, brand direction, or irreversible scope.

## Output

Return working frontend changes plus a concise summary of the design direction, changed files, verification performed, remaining limitations, and any specialist-review findings that were fixed or intentionally deferred. For audit-only requests, return prioritized findings with evidence and concrete remediation.

## Artifact Ownership

- May read app routes, components, styles, design-system tokens, assets, screenshots, product docs, prior generated artifacts, and relevant tests.
- May edit frontend code, styles, assets, tests, and documentation only when they are directly required by the requested frontend change.
- Must not rewrite unrelated backend behavior, broad product copy, global design tokens, generated assets, or project configuration unless the brief or local architecture makes that necessary.
- Must preserve unrelated user changes and record verification gaps when browser, screenshot, responsive, accessibility, or automated checks cannot be completed.

## Core Stance

- **Preserve identity, raise quality**: In existing products, keep the product's nouns, workflow shape, brand memory, and user muscle memory unless the user explicitly asks for a rebrand.
- **System before surface**: Tokens, layout rules, component states, and responsive behavior are the design. Do not decorate drift.
- **Specific beats generic**: A design should feel born from this product, audience, data, and moment. Reject template reflexes.
- **Wow without fragility**: Beautiful work still needs semantic HTML, keyboard support, resilient states, sane CSS architecture, and tests where the project expects them.
- **Implement with the local stack**: Use existing frameworks, component libraries, styling conventions, icons, and build tooling unless a change is justified by the brief.

## Route The Work

First classify the request, then load only the references that apply:

- **Greenfield build**: Read `references/context-and-direction.md`, `references/design-brief-and-iteration.md`, `references/design-system-tokens.md`, `references/typography.md`, `references/layout-composition.md`, `references/components-interaction-a11y.md`, and `references/motion-polish.md`.
- **Visually open-ended or flagship work**: Read `references/design-brief-and-iteration.md` before coding.
- **Existing-codebase renovation**: Read `references/renovation-workflow.md` first, then the relevant system, layout, type, copy, interaction, motion, and QA references.
- **Theme or design-system customization**: Read `references/design-system-tokens.md` and `references/theme-customization.md`.
- **Audit, critique, or final polish**: Read `references/ux-evaluation.md` and `references/quality-bar-checklist.md`, plus any domain reference needed to fix the findings.
- **Typography-heavy work**: Read `references/typography.md`.
- **Copy, labels, errors, empty states, onboarding, or localization**: Read `references/ux-writing.md`.
- **Landing or brand surface**: Also read the brand portions of `references/context-and-direction.md` and the imagery guidance in `references/layout-composition.md`.
- **Operational app, dashboard, admin UI, or SaaS tool**: Also read the product portions of `references/context-and-direction.md` and the density guidance in `references/layout-composition.md`.

## Shared References

Use `../_shared/agent-orchestration.md` for skill-owned orchestration, exact named-agent invocation, read-only delegation, fan-out/fan-in, fallback behavior, and where-aware ownership boundaries.

## Agent Crew

- Use `codebase-researcher` for broad or unfamiliar frontend areas, or invoke `codebase-locator`, `codebase-analyzer`, and `codebase-pattern-finder` directly for route, component, token, test, or pattern questions.
- Use `docs-locator` and `docs-analyzer` when product docs, design docs, prior plans, generated artifacts, or README guidance shape the frontend work.
- Use `frontend-ux-ui-reviewer` for substantial redesigns, audits, final polish passes, and questions about information architecture, interaction quality, visual hierarchy, responsiveness, usability, and design-system fit.
- Use `frontend-accessibility-reviewer` when the work touches semantic structure, keyboard behavior, focus management, contrast, reduced motion, touch targets, form states, overlays, or inclusive interaction quality.
- Use `frontend-ux-writing-reviewer` when the work touches labels, calls to action, errors, empty/loading/success states, terminology, localization readiness, or content resilience.
- After implementation and browser/screenshot verification, use `design-implementation-validator` to check parity between the implemented UI and stated UX intent, design-system tokens, responsive behavior, and visual states. Skip when the parent skill has no UX intent, screenshots, or acceptance criteria to compare against.

## Working Loop

1. **Gather context**
   - Read the user brief and local project instructions.
   - Inspect `package.json`, app routes, existing styles, component libraries, tokens, shared UI primitives, design docs, and nearby screens.
   - When available and useful, use exact named codebase and docs agents to find routes, components, tokens, comparable screens, design docs, and relevant project guidance before editing.
   - For existing UIs, understand the current structure before changing it. Identify what must be preserved.
2. **Frame the design**
   - Name the audience, job-to-be-done, usage scene, register (`product`, `brand`, or `hybrid`), quality bar, and constraints.
   - Choose a design direction with a color strategy, type strategy, density, radius, depth, motion personality, and one memorable signature.
   - Identify obvious defaults to reject before coding.
   - For ambiguous, flagship, or greenfield work, write a compact design brief and, when useful, explore a north-star visual direction before implementation.
3. **Implement system-first**
   - Establish or extend semantic tokens for color, typography, spacing, radius, density, elevation, motion, and z-index.
   - Reuse existing components first. Create new primitives only when repeated use or missing capability justifies them.
   - Build every interactive path with default, hover, focus-visible, active, disabled, selected, loading, empty, error, and success states where relevant.
4. **Make it responsive by design**
   - Use content-driven breakpoints, container queries when available, fluid layout constraints, safe areas, and touch-aware targets.
   - Test compact, medium, wide, and awkward widths. Do not rely on a single desktop screenshot.
5. **Verify like a frontend engineer**
   - Run the app when possible and inspect real screens.
   - Check keyboard navigation, focus order, reduced motion, contrast, long content, empty data, loading, errors, and at least one mobile viewport.
   - For substantial work, audits, or final polish, fan out to the exact relevant frontend specialists and merge their findings before finalizing. For small targeted work, invoke only the specialist whose scope materially reduces risk.
   - Run the repository's relevant format, lint, typecheck, test, and build commands when available.

## Specialist Review Contract

- Follow `../_shared/agent-orchestration.md` for exact named-agent invocation, read-only delegation, fan-out/fan-in, and fallback behavior.
- Invoke specialist reviewers by exact pre-built agent name: `frontend-ux-ui-reviewer`, `frontend-accessibility-reviewer`, `frontend-ux-writing-reviewer`, and conditionally `design-implementation-validator`.
- In Codex delegation APIs, select the exact custom-agent name, for example `agent_type: frontend-accessibility-reviewer`. Do not use `default`, `worker`, or a compressed role prompt when the named reviewer exists.
- In Codex delegation APIs, omit `fork_context` or set `fork_context: false` for named frontend reviewers. Pass only the bounded route, component, screenshot, design brief, and review context needed for the pass.
- Start each launch prompt with the selected agent name for auditability, for example: `You are the already-selected Rubber Duck frontend-ux-ui-reviewer custom agent. Use your configured agent instructions; this message only provides run-specific context.`
- Pass the route, component paths, screenshots or observations, design brief, relevant constraints, acceptance criteria or UX intent when available, and exact review question. Keep reviewers read-only.
- Invoke `design-implementation-validator` only after implementation and browser/screenshot verification evidence exists, and merge parity findings or questions before claiming the frontend is ready.
- The parent skill owns all code and copy edits, visual iteration, validation, and user-facing summary. Specialist agents return their configured output sections; preserve `UX/UI Findings`, `Accessibility Findings`, `UX Writing Findings`, `Required Fixes`, `Required Copy Changes`, `Verification Notes`, `Parity Findings`, `Token / State / Responsive Gaps`, `Residual Risk`, and `Questions For The Invoking Skill` when those sections appear.
- Treat blocking accessibility, usability, or copy findings as work to fix before claiming the frontend is ready unless the human explicitly accepts the risk or defers the issue.

## Design Laws

- Never start with "clean and modern." Convert vague taste into concrete scene, audience, and system choices.
- Do not add a new visual language on top of an old one. Either align with the existing system or intentionally migrate it.
- Do not solve app UI with marketing-page composition. Do not solve brand pages with admin-panel density.
- Use color as a strategy: restrained, committed, full palette, or drenched. Choose intentionally.
- Use typography as product voice. Product UI may use system fonts; brand surfaces need more deliberate type selection.
- Avoid one-size card grids, repeated icon-heading-text tiles, decorative gradient text, heavy generic shadows, glass effects as default, and arbitrary spacing.
- Use icons to clarify actions and states. Use one icon family unless the product already has a mixed but intentional system.
- Motion must communicate feedback, continuity, hierarchy, or delight. It must respect `prefers-reduced-motion`.
- Accessibility is part of visual craft. Labels, focus, contrast, semantics, keyboard support, and touch targets are not optional.
- If the first pass looks plausible but generic, iterate before showing it.

## Reference Map

- `references/context-and-direction.md`: How to choose a design register, intent, signature, aesthetic lane, and anti-defaults.
- `references/design-brief-and-iteration.md`: How to shape a design brief, use optional visual direction probes, build in order, and iterate visually.
- `references/renovation-workflow.md`: Existing-codebase redesign process, preservation rules, and transformation sequencing.
- `references/design-system-tokens.md`: Token architecture for color, type, spacing, radius, depth, density, motion, and component variables.
- `references/theme-customization.md`: Multi-theme systems, theme axes, runtime switching, and theme QA.
- `references/typography.md`: Type systems, font choice, modular scales, readability, font loading, and text rendering polish.
- `references/layout-composition.md`: Page structure, app shells, dashboards, forms, brand layouts, responsive behavior, and imagery.
- `references/components-interaction-a11y.md`: Component states, forms, overlays, keyboard interaction, ARIA, contrast, and inclusive UX.
- `references/ux-writing.md`: Labels, CTAs, errors, empty states, loading copy, terminology, translation, and content resilience.
- `references/ux-evaluation.md`: Cognitive load checks, heuristic review, persona passes, severity scoring, and critique structure.
- `references/motion-polish.md`: Animation timing, easing, choreography, performance, reduced motion, and micro-interactions.
- `references/quality-bar-checklist.md`: Final review checklist and AI-template failure detectors.

## Communication

If the user asked for implementation, implement. Share a short direction only when it materially affects scope or when the user asked for design rationale. When blocked by missing brand, asset, or product facts, make the safest local inference for reversible choices and ask only for decisions that would change the product's identity or workflow.
