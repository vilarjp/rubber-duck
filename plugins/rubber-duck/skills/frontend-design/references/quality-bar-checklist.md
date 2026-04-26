# Quality Bar Checklist

Use this before finalizing a frontend design, redesign, or polish pass.

## Product Fit

- The interface preserves the product's identity or intentionally migrates it.
- The primary user and job are visible in the structure.
- The design register fits the surface: product, brand, or hybrid.
- The signature idea appears in actual UI elements, not only in prose.
- The result does not look interchangeable with a generic prompt for the category.

## Design System

- Tokens cover color, type, spacing, radius, depth, density, motion, and layering where relevant.
- Components consume semantic tokens.
- New values are justified, reusable, or truly one-off.
- Existing shared components are reused or extended.
- Light, dark, density, or brand themes still work if the app supports them.
- Icon style, border style, depth style, and radius vocabulary are consistent.

## Layout And Responsiveness

- Page hierarchy is clear at a glance.
- The squint test reveals primary, secondary, and grouped regions.
- Related items are grouped by spacing and alignment.
- No accidental horizontal scroll.
- Mobile, tablet, desktop, and awkward middle widths work.
- Long content, localization, empty data, errors, and loading states do not break layout.
- Sticky and fixed regions work with mobile safe areas and on-screen keyboards.
- Tables, filters, toolbars, and navigation adapt logically.

## Interaction

- Buttons, inputs, links, menus, tabs, and custom controls have the states they need.
- Hover interactions have keyboard and touch equivalents.
- Async actions show loading and recovery.
- Destructive actions are reversible or explicitly confirmed when irreversible.
- Overlays close predictably and restore focus.
- Touch targets are large enough.

## Accessibility

- Semantic landmarks and headings make sense.
- All controls are labelled.
- Focus is visible and ordered.
- Contrast meets WCAG AA for text and 3:1 for meaningful UI graphics.
- Status is not communicated by color alone.
- Keyboard-only users can complete primary workflows.
- Reduced motion is respected.
- Images have useful alt text or are marked decorative.

## Motion And Performance

- Motion uses shared durations and easings.
- Animations are purposeful and not fatiguing.
- Large movement has reduced-motion fallback.
- Transitions avoid layout jank.
- Images have dimensions or aspect ratios.
- No obvious layout shift.
- The app still feels responsive during loading.

## Content

- Copy uses consistent product nouns and verbs.
- Labels are concise and action-oriented.
- Empty states teach the next step.
- Error messages explain recovery.
- Destructive actions name the object and consequence.
- Loading copy says what is happening when the wait is meaningful.
- Dates, numbers, currency, and units are formatted consistently.
- No placeholder lorem ipsum remains unless it is an intentional mock.

## UX Evaluation

- Cognitive load is appropriate: one focus, grouped information, progressive disclosure, and minimal recall.
- The primary flow has been checked through at least two relevant personas.
- System status, user control, consistency, error prevention, and recovery are covered.
- Findings are prioritized by severity instead of presented as an undifferentiated wish list.

## Code Quality

- Styling follows the local architecture.
- No unrelated refactors.
- No dead CSS, unused imports, console logs, or commented-out experiments.
- New abstractions remove real duplication or clarify a shared pattern.
- Tests, stories, snapshots, or examples are updated when the project uses them.
- Formatting, linting, type checks, tests, and build run when available.

## AI-Template Failure Detectors

Iterate before showing the result if you see:

- Generic centered hero with vague value prop and feature cards.
- Identical card grid with icon, heading, paragraph repeated everywhere.
- Metrics shown as big number plus tiny label without user meaning.
- Purple/blue gradient as the only personality.
- Hard-coded colors, shadows, radii, and durations scattered through components.
- Spacing values that do not belong to a scale.
- Beautiful static state with no error, loading, empty, disabled, or focus behavior.
- Desktop-only composition.
- Decorative motion that makes tasks slower.
- One page that looks redesigned while neighboring components still feel unrelated.

## Final Pass

Use the product yourself. Click, tab, resize, wait, fail, retry, and read it out loud. The work is done when the interface feels intentional in motion, resilient under stress, and coherent with the rest of the product.
