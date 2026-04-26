# Theme Customization

Use this when the user wants theme controls, design-system variables, branded variants, or multiple visual modes.

## Theme Axes

A useful theme is more than light and dark. Model the axes explicitly:

- **Palette**: hue, chroma, neutral tint, semantic colors, contrast level.
- **Typography**: display family, body family, mono family, scale, weight, tracking.
- **Radius**: sharp, tailored, soft, round.
- **Spacing**: compact, comfortable, spacious.
- **Density**: row height, control height, gap, table padding, sidebar width.
- **Depth**: flat, bordered, tinted, shadowed, dimensional.
- **Motion**: reduced, quiet, expressive, choreographed.
- **Texture**: none, subtle grain, grid, material, image-led, illustrated.

Expose axes as tokens, not scattered conditional classes.

## Theme Contract

Create a stable contract before adding presets:

```ts
type ThemeId = "default" | "studio" | "compact" | "high-contrast";

type ThemeTokens = {
  color: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
    danger: string;
    success: string;
    focus: string;
  };
  typography: {
    sans: string;
    display: string;
    mono: string;
  };
  radius: "sharp" | "tailored" | "soft" | "round";
  density: "compact" | "comfortable" | "spacious";
  motion: "reduced" | "quiet" | "expressive";
};
```

Use the codebase's language and configuration style. The important part is a semantic contract.

## CSS Pattern

Prefer semantic variables on an attribute selector:

```css
:root,
[data-theme="default"] {
  --color-bg: oklch(98% 0.01 245);
  --color-surface: oklch(100% 0.006 245);
  --color-text: oklch(18% 0.018 245);
  --color-accent: oklch(56% 0.18 250);
  --radius-control: 0.5rem;
  --space-page: clamp(1rem, 2vw, 2rem);
}

[data-theme="studio"] {
  --color-bg: oklch(96% 0.018 72);
  --color-surface: oklch(99% 0.012 72);
  --color-text: oklch(19% 0.03 62);
  --color-accent: oklch(55% 0.16 32);
}
```

Components should not know which theme is active.

## Presets As Starting Points

Do not ship these names blindly. Translate them into the product's language.

- **Operational**: restrained palette, high clarity, compact density, minimal motion, sharp or tailored radius.
- **Editorial**: expressive type, larger spacing, image-led composition, restrained components, careful line lengths.
- **Studio**: warm neutrals, tactile surfaces, flexible grids, distinctive display type, moderate motion.
- **Instrument**: dense layout, tabular numbers, clear status color, strong keyboard states, low decoration.
- **Premium**: low-chroma neutrals, refined depth, precise spacing, high typographic contrast, slow-but-subtle reveals.
- **Playful**: soft radius, bolder color, springy-looking shapes without inaccessible motion, friendly empty states.
- **High contrast**: stronger text and borders, no low-contrast placeholder-only affordances, visible focus, reduced ambiguity.

Each preset must still pass contrast, responsive, and interaction QA.

## Runtime Theme Behavior

- Persist user choice when the product has settings.
- Respect OS light/dark preference when no user choice exists.
- Respect `prefers-reduced-motion` even if the selected theme is expressive.
- Do not animate theme switching with large color sweeps in task-focused apps; a short crossfade is enough.
- Prevent flash of wrong theme during SSR or first paint when the stack supports it.

## Theme QA Matrix

Check at least:

- Light/default, dark if supported, and high contrast if provided.
- Compact and spacious density for data-heavy pages.
- Long labels, localized strings, empty states, loading skeletons, errors, disabled controls.
- Focus rings and selection states on every background.
- Charts, status badges, and semantic colors for color-blind users.
- Mobile and wide desktop at each major theme.

## Customization Guardrails

- Do not let customization break component geometry. Radius and spacing can vary, but controls still need clear hit areas and aligned content.
- Do not make every token user-configurable. Expose meaningful axes.
- Do not store raw arbitrary CSS from untrusted users.
- Do not let theme presets fork component implementations.
- Do not use theme as a substitute for information architecture.
