# Renovation Workflow

Use this when transforming an existing frontend. Think like an architect renovating a working house: learn which walls carry weight before moving anything.

## Survey The House

Inspect the project before editing:

- App framework, routing, build tool, CSS strategy, component library, icon set, state management, data fetching, tests.
- Existing tokens, theme files, global CSS, Tailwind config, CSS modules, styled components, component variants, and shared primitives.
- Neighboring screens that establish product vocabulary, spacing, density, navigation, forms, tables, and overlays.
- README, product docs, screenshots, Figma exports, storybook, design-system docs, or local comments that explain design intent.
- Current defects: visual inconsistency, layout overflow, weak hierarchy, missing states, inaccessible controls, brittle responsiveness, duplicated components, hard-coded values.

Prefer repository evidence over generic taste.

## Identify Load-Bearing Walls

Preserve or intentionally migrate these:

- Product nouns, verbs, mental model, and primary workflows.
- User muscle memory: navigation locations, critical action positions, keyboard shortcuts, common routes.
- Brand anchors: logo, primary color, voice, illustration or photography style, tone, domain metaphor.
- Data hierarchy: what users need to compare first, what is secondary, what is rare.
- Shared UI contracts: component APIs, variants, form validation shape, table behavior, state conventions.
- Technical boundaries: design-system package ownership, generated files, framework constraints, SSR/client boundaries, test fixtures.

If a load-bearing wall must move, call it out and keep the change deliberate.

## Renovation Levels

Choose the smallest level that meets the brief:

- **Touch-up**: Fix spacing, alignment, responsive bugs, missing states, focus, contrast, copy, token usage.
- **Room remodel**: Rework one page or flow. Keep global identity and shared components, improve structure and hierarchy.
- **Whole-house renovation**: Introduce or migrate a design system, theme architecture, app shell, layout model, or component vocabulary across multiple surfaces.
- **Rebuild**: Rare. Only when the current structure prevents the target experience or the user explicitly asks for a fresh start.

Do not rebuild because a patch is less glamorous.

## Transformation Sequence

1. **Stabilize the system**
   - Extract or extend tokens before scattering new values.
   - Prefer semantic variables over hard-coded hex, px, shadows, and durations.
   - Align with the existing component API when it is sound.
2. **Fix structure**
   - Improve navigation, grouping, hierarchy, grid, page rhythm, and density before cosmetic styling.
   - Move repeated page furniture into layout primitives only when repetition is real.
3. **Normalize components**
   - Replace one-off buttons, inputs, badges, cards, menus, dialogs, tables, and empty states with shared primitives.
   - Add missing variants and states at the primitive level when several screens need them.
4. **Upgrade responsiveness**
   - Solve overflow, reflow, touch targets, safe areas, sticky regions, data tables, and awkward middle widths.
5. **Add motion and polish**
   - Add transitions after layout and states are correct.
   - Use motion tokens and reduced-motion fallbacks.
6. **Verify the house still works**
   - Run existing checks, inspect routes, and exercise the main workflows.

## Preservation Rules

- Keep copy and IA unless the brief includes UX writing or flow redesign.
- Do not introduce a new UI kit, font loading service, CSS framework, icon library, animation library, or state library without a strong reason.
- Do not erase local conventions that other screens still depend on.
- Do not turn a utilitarian app into a marketing surface.
- Do not make one page perfect while leaving adjacent shared components worse or inconsistent.

## Renovation Smells

- New hard-coded color values while tokens already exist.
- A page-specific button that duplicates the shared button.
- Repeated layout constants in multiple components.
- Desktop-only improvements with mobile regressions.
- A beautiful static state with no loading, empty, error, or disabled behavior.
- Hover-only affordances that fail on touch and keyboard.
- One-off animation curves and durations.
- Design changes that make screenshots prettier but workflows slower.

## Existing UI Report

When useful, summarize findings before large edits:

```text
Preserve:
Upgrade:
System gaps:
Risk:
Plan:
```

Keep it practical. The next action should be code.
