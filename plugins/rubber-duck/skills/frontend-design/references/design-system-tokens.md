# Design System Tokens

Use this for greenfield systems, redesigns, and any themeable frontend. A design system is a set of decisions encoded as reusable variables, components, and behavior.

## Token Layers

Use three layers when the stack allows it:

- **Primitive tokens**: Raw scales such as color ramps, font families, spacing units, radius steps, shadow recipes, durations.
- **Semantic tokens**: Product roles such as `--color-bg`, `--color-panel`, `--color-text`, `--color-accent`, `--color-danger`, `--space-page`, `--radius-control`.
- **Component tokens**: Local roles such as `--button-bg`, `--input-border`, `--card-padding`, usually mapped to semantic tokens.

Components should consume semantic or component tokens, not raw primitives.

## Token Categories

Define only what the interface needs, but cover the system shape:

- **Color**: canvas, surface, elevated, overlay, text, text-muted, border, border-strong, accent, accent-hover, accent-soft, success, warning, danger, info, focus.
- **Typography**: font-sans, font-display, font-mono, size scale, line-height scale, weight scale, tracking, tabular number behavior.
- **Spacing**: base unit, component gaps, page gutters, section spacing, stack spacing, inline spacing.
- **Radius**: control, small surface, card, panel, modal, pill.
- **Elevation**: border-only, color-shift, shadow, overlay, focus ring.
- **Density**: compact, comfortable, spacious values for height, padding, gap, font size.
- **Motion**: duration-fast, duration-base, duration-layout, ease-out, ease-in, ease-standard.
- **Layering**: dropdown, sticky, popover, modal, toast, tooltip.
- **Breakpoints/containers**: semantic names tied to content, not devices.

## Color Strategy

Use OKLCH where browser support and tooling allow it. It makes lightness and chroma easier to reason about than HSL.

Pick a strategy before picking colors:

- **Restrained**: Tinted neutrals with one accent used sparingly. Default for operational product UI.
- **Committed**: One color carries a meaningful part of the surface. Useful for identity-driven products, onboarding, reports, or brand-led screens.
- **Full palette**: Several named roles used deliberately. Useful for data, campaigns, editorial systems, or multi-entity products.
- **Drenched**: The page is built around color. Use for brand moments, launches, hero sections, and experiences where mood is the product.

Tint neutrals subtly toward the brand hue when possible. Avoid pure black and pure white for large UI surfaces unless the existing brand depends on them.

## Typography

- Product UI can use system fonts or a neutral sans when trust, speed, and platform familiarity matter.
- Brand surfaces should choose type for voice, not habit.
- Dense tools usually need tighter type ratios. Expressive pages can use larger contrast between display and body.
- Use `font-variant-numeric: tabular-nums` for metrics, tables, timestamps, prices, and aligned numeric data.
- Set max line lengths for prose. Long-form text usually wants 65-75ch; dense tables and code-like surfaces are different.

## Spacing And Density

Use a base grid. Most systems work well with 4px as the primitive and 8px as the common rhythm.

Create density tokens instead of scattering alternate values:

```css
:root {
  --density: 1;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --control-h: calc(2.25rem * var(--density));
  --control-px: calc(0.875rem * var(--density));
}

[data-density="compact"] { --density: 0.9; }
[data-density="comfortable"] { --density: 1; }
[data-density="spacious"] { --density: 1.12; }
```

Adjust carefully. Compact should not make touch targets inaccessible.

## Radius And Depth

Choose a radius system and stick to it:

- **Sharp**: precise, technical, dense.
- **Tailored**: modern product default, moderate corners.
- **Soft**: friendly, consumer, wellness, education.
- **Round**: playful, tactile, high softness.

Choose one depth strategy per surface family:

- Subtle borders.
- Surface color shifts.
- Soft shadows.
- Layered shadows.
- None, when typographic hierarchy carries structure.

Mixing all of them randomly makes the interface feel unresolved.

## Example CSS Token Skeleton

Adapt names to the codebase:

```css
:root {
  color-scheme: light;

  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;

  --color-bg: oklch(98% 0.01 245);
  --color-surface: oklch(100% 0.006 245);
  --color-surface-2: oklch(96% 0.012 245);
  --color-text: oklch(18% 0.018 245);
  --color-muted: oklch(45% 0.02 245);
  --color-border: oklch(83% 0.018 245);
  --color-accent: oklch(56% 0.18 250);
  --color-focus: color-mix(in oklch, var(--color-accent), white 15%);

  --radius-control: 0.5rem;
  --radius-surface: 0.75rem;
  --radius-panel: 1rem;

  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-layout: 320ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

## Token QA

- Can every visible color be traced to a role?
- Are action, selection, and focus colors consistent?
- Do themes redefine semantic roles instead of component internals?
- Are hard-coded values limited to true one-off geometry?
- Do components still look coherent when radius, density, and theme change?
