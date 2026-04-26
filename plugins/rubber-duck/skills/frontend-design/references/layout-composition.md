# Layout Composition

Use this for page structure, responsive behavior, app shells, dashboards, forms, brand pages, and spatial polish.

## First Principles

- Layout is hierarchy made physical.
- Every region should answer: what is primary, what is related, what is optional, what is persistent?
- Whitespace is not a decoration. It is grouping, pace, and comprehension.
- Density is a product decision. More space is not automatically more premium; less space is not automatically more powerful.
- Space, alignment, and contrast can create grouping without more boxes.

## Spatial System

- Use a 4px primitive grid when creating a system; it gives useful steps such as 4, 8, 12, 16, 24, 32, 48, 64, and 96.
- Use semantic spacing tokens when the project allows it: `--space-stack-sm`, `--space-section`, `--space-control-gap`.
- Use `gap` for sibling relationships instead of margin chains when possible.
- Tight gaps imply belonging. Generous gaps imply a new group or a new decision.
- Do not make all spacing equal. Equal spacing everywhere creates flat hierarchy.

## Product Layouts

For apps, dashboards, admin panels, and tools:

- Use predictable navigation: side nav, top bar, tabs, breadcrumbs, command surfaces, filters, and persistent action regions when the workflow needs them.
- Prioritize the task path. Put status, filters, primary action, and primary data where scanning naturally starts.
- Use panels and cards only when they represent real grouping. Do not card-wrap every section.
- Keep repeated screens structurally consistent. Users learn the product through repeated spatial grammar.
- Use tables for comparison, lists for triage, cards for object browsing, timelines for sequence, boards for workflow state, maps for location, and canvases for creation.
- Design empty, loading, and error states into the same layout structure instead of replacing the whole screen with unrelated compositions.

## Brand Layouts

For marketing, landing, portfolio, and story surfaces:

- Let the first viewport reveal the subject immediately.
- Use real imagery or generated bitmap assets when the subject is physical, visual, spatial, culinary, fashion, travel, real estate, people-centered, or lifestyle-oriented.
- Avoid generic split hero templates unless the product genuinely needs side-by-side comparison.
- Vary pacing across sections: tight proof, spacious story, dense specs, immersive visual, clear conversion.
- One dominant idea per major viewport is often stronger than equal-weight feature blocks.
- Keep the next section slightly discoverable so the page feels scrollable, especially in hero layouts.

## Responsive Strategy

- Start from the smallest plausible viewport and layer complexity upward.
- Use content-driven breakpoints: stretch until the layout breaks, then add a breakpoint.
- Prefer `minmax()`, `auto-fit`, `clamp()`, container queries, and intrinsic sizing over brittle device assumptions.
- Use container queries for reusable components whose layout depends on where they are placed.
- Use pointer and hover queries for interaction differences. A narrow screen is not always touch; a wide screen can be touch.
- Keep touch targets at least 44x44 CSS pixels where touch is expected.
- Account for safe areas on modern phones when fixed footers, drawers, and bottom controls exist.
- Prevent horizontal scrolling except in intentional data regions with clear affordance.

## Common Responsive Patterns

- **App shell**: icon-only rail or drawer on small screens, labeled sidebar or split nav on wide screens.
- **Data tables**: horizontal scroll for expert dense tables, card rows for low-density mobile review, column visibility controls for advanced tools.
- **Forms**: single column on mobile, grouped columns only when fields are short and related, sticky summary or actions on long flows.
- **Dashboards**: priority stack on mobile, asymmetric grid on tablet, full layout on desktop.
- **Media**: define aspect ratios to prevent layout shift. Use `object-fit` deliberately.
- **Toolbars**: collapse secondary actions into menus, keep primary action visible.

## Rhythm And Alignment

- Align to a small set of grid and spacing values.
- Vary spacing by relationship: tight for label/value, medium for sibling controls, generous for section changes.
- Use optical alignment for icons, badges, and large type. Mathematical centering can look wrong.
- Nudge icons or glyph-heavy headings only when they visually look wrong, not as a reflex.
- Keep stable dimensions for boards, grids, counters, controls, and tiles so state changes do not move the layout.
- Avoid nested cards. Use bands, dividers, spacing, headings, or subtle surface shifts instead.

## Hierarchy Checks

- **Squint test**: Blur the page mentally or via screenshot. The primary element, secondary group, and main sections should still be obvious.
- **Two-second test**: A user should know where to start within two seconds on task surfaces.
- **Grouping test**: Remove borders mentally. If relationships disappear, spacing and alignment are not doing enough work.
- **Card test**: If a card contains another card, replace the inner card with spacing, a divider, a heading, or a subtle surface shift.

## Forms And Flows

- Group fields by user decision, not database table.
- Put help text where it prevents errors, not in distant docs.
- Use inline validation with clear recovery.
- Use sticky actions for long forms only when they improve confidence and do not hide content.
- Confirmation dialogs are for irreversible or high-risk actions. Undo is often better for reversible destructive actions.

## Imagery And Media

- Use actual product, place, person, object, gameplay, or state when the user needs inspection or trust.
- Avoid blurred, dark, stock-like mood images when clarity matters.
- Provide alt text that communicates content and purpose.
- Reserve decorative textures for backgrounds that do not impair readability.
- Set explicit dimensions or aspect ratios to avoid layout shift.

## Layout QA

- Does the layout still make sense at 320px, 390px, 768px, 1024px, and a wide desktop width?
- Does anything overlap, truncate badly, or require accidental horizontal scroll?
- Can the primary action be found without reading every label?
- Is the layout still coherent with long names, empty data, loading skeletons, and error banners?
- Are sticky or fixed regions usable with mobile browser chrome and on-screen keyboards?
