# Design Brief And Iteration

Use this when a frontend task is greenfield, visually open-ended, flagship-quality, or ambiguous enough that code-first design would drift into defaults.

## When To Shape First

Shape before coding when:

- The user asks for a new app, page, flow, marketing surface, or major redesign.
- The brief contains vague taste words such as modern, clean, premium, playful, bold, or beautiful.
- Product identity, audience, or information architecture is unclear.
- Multiple strong visual directions could be valid.
- The work needs to make humans say "wow," not merely pass as acceptable.

For small fixes, do not over-ceremonialize. Use the brief mentally and implement.

## Discovery

Gather only what changes design decisions:

- **Purpose**: What problem does this surface solve?
- **Human**: Who uses it, how often, and in what mental state?
- **Primary action**: What should the user do or understand first?
- **Content range**: Empty, typical, max, long strings, errors, loading, permissions.
- **Register**: Product, brand, or hybrid.
- **Visual direction**: Color strategy, type voice, density, motion energy, reference products or objects.
- **Anti-goals**: What would be the wrong version of this?
- **Scope**: Sketch, mid-fi, high-fi, production-ready; one screen, flow, or whole surface.
- **Constraints**: Stack, design system, assets, performance, accessibility, browser support, localization.

Ask only for facts that materially change direction. Infer reversible details from the product context.

## Compact Design Brief

For meaningful work, synthesize this before implementation. Share it only when useful; otherwise use it as an internal guide.

```text
Feature:
Primary user and scene:
Primary user action:
Register:
Direction:
Layout strategy:
Type and color strategy:
Key states:
Interaction model:
Content and microcopy:
Constraints:
Open questions:
```

Every implementation decision should trace back to this brief or to established repository conventions.

## Visual Direction Probes

When built-in image generation, screenshots, or quick mock tooling is available and the visual direction is genuinely open:

- Generate or sketch 2-4 distinct directions before coding.
- Make them differ by structure, hierarchy, density, type voice, color strategy, or motion idea, not just palette.
- Treat probes as north-star direction, not final UX specification.
- Decide what to carry into code and what not to literalize.

Skip probes for small renovations, obvious product surfaces, or when the existing design system already determines the direction.

## Build Order

1. **Structure**: Semantic HTML/component hierarchy, landmarks, headings, route or page shell.
2. **Layout**: Grid, flow, density, grouping, responsive behavior, stable dimensions.
3. **Typography**: Type scale, weights, line-height, measure, numeric behavior, font loading.
4. **Color and depth**: Tokens, semantic roles, contrast, theme support, surface hierarchy.
5. **Components**: Shared primitives, variants, states, focus, disabled, loading, selected.
6. **Content states**: Empty, error, success, permissions, edge cases, long content.
7. **Motion**: Feedback, continuity, reveals, reduced-motion alternative.
8. **Responsive pass**: Compact, medium, wide, awkward widths, touch and pointer differences.
9. **Production pass**: Performance, accessibility, tests, build, visual QA.

Do not add motion before layout and states are sound.

## Visual Iteration

Do not stop after the first pass on substantial frontend work.

- Open the result when possible.
- Compare against the brief.
- Run the squint test for hierarchy.
- Resize across viewports.
- Use keyboard navigation.
- Exercise loading, empty, error, success, disabled, and long-content states.
- Check whether the result feels product-specific or prompt-generic.
- Iterate until the live UI, not just the code, feels intentional.

## Presentation

When summarizing design work, explain the decisions that matter:

- What identity or workflow was preserved.
- What system choices were introduced or extended.
- How responsiveness, accessibility, and states were handled.
- What was verified.

Avoid narrating decorative details unless they affect user experience or maintainability.
