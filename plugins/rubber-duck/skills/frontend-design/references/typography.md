# Typography

Use this for type systems, font choice, hierarchy, readability, font loading, and text rendering polish.

## Register

- **Product UI**: System fonts and neutral sans stacks are legitimate. Prioritize speed, readability, native feel, predictable sizing, and numeric clarity. Use fixed `rem` scales.
- **Brand surfaces**: Type is voice. Choose fonts from the product's physical world, references, audience, and tone. Display type may be fluid and more dramatic.
- **Hybrid**: Brand type can carry entry moments; task areas should settle into product typography.

## Type Direction

Before choosing fonts, name:

- Three voice words that are concrete, not generic.
- The physical object the typography should evoke: manual, ledger, gallery wall, receipt, field guide, console, poster, archive, label, instrument panel.
- Three reflex fonts or defaults to reject.

One well-chosen family often beats two weakly paired families.

## Pairing Rules

- Pair only when contrast has a job.
- Good contrast uses different structures, proportions, or historical voices.
- Avoid pairing two similar sans families or two similar serifs.
- Keep most projects to one or two families; three is a high-risk ceiling.
- Use monospace for code, IDs, tabular data, timestamps, or technical voice when justified, not as lazy shorthand for "developer."

## Scale And Hierarchy

Use fewer sizes with clearer roles:

- `xs`: captions, legal, metadata.
- `sm`: secondary UI and labels.
- `base`: body.
- `lg`: subheads and lead text.
- `xl+`: headlines and hero display.

Product UI usually wants a tighter ratio around 1.125-1.2. Brand and editorial surfaces can use 1.25-1.5 or stronger display contrast.

Build hierarchy with several dimensions:

- Size.
- Weight.
- Color contrast.
- Spacing.
- Position.
- Case and letter spacing.

If all text feels medium, the hierarchy is muddy.

## Rhythm And Measure

- Use `ch` constraints for prose. Most body copy wants 45-75 characters per line.
- Long-form text usually wants line-height around 1.5-1.7.
- Headings usually want tighter line-height around 1.05-1.2.
- Wide text columns need more leading than narrow ones.
- Use either paragraph spacing or first-line indentation, not both.
- For light text on dark backgrounds, increase line-height slightly and test perceived weight.

## Fluid Vs Fixed Type

- Use fixed `rem` scales for app UI, dashboards, tables, dense controls, and component systems.
- Use fluid `clamp()` for brand headlines and display text where composition should breathe across viewports.
- Keep body text fixed unless the content surface truly benefits from fluid scaling.
- Bound `clamp()` values so headings do not become comically large on wide displays or too small on mobile.

## Font Loading

- Use `font-display: swap` or `optional` depending on whether branded type or zero layout shift matters more.
- Preload only critical above-the-fold weights.
- Use variable fonts when several weights or optical sizes are needed.
- Avoid loading unused weights and styles.
- If custom fonts cause visible layout shift, use metric-compatible fallbacks where the stack supports it.

## OpenType And Rendering Polish

Use font features when they support the content:

```css
.metric,
.price,
.timestamp {
  font-variant-numeric: tabular-nums;
}

article p {
  text-wrap: pretty;
}

h1,
h2 {
  text-wrap: balance;
}
```

Use all-caps sparingly. When short labels are uppercase, add positive letter spacing and keep them brief.

## Accessibility

- Use `rem` for font sizes so browser settings work.
- Never disable zoom.
- Keep body text at least 16px in ordinary reading contexts.
- Ensure contrast works at actual rendered weight and size.
- Test text at 200% zoom.
- Make links visible by more than color when context needs it.

## Typography QA

- Can you identify heading, body, metadata, and controls instantly?
- Are same-role text elements styled consistently?
- Does the type voice match the product register?
- Are numbers aligned in tables, metrics, and ledgers?
- Does long copy read comfortably?
- Does font loading avoid obvious layout jump?
- Does the page still work with long labels and localized strings?
