# Components, Interaction, And Accessibility

Use this for component design, interaction states, forms, overlays, keyboard behavior, and inclusive UX.

## State Inventory

Every interactive component should define the states that apply:

- Default.
- Hover for fine pointers.
- Focus-visible for keyboard and programmatic focus.
- Active/pressed.
- Selected/current.
- Disabled.
- Loading.
- Empty.
- Error.
- Success.

Missing states make a UI feel unfinished even when the static screenshot looks good.

## Component Vocabulary

Standardize these before inventing new variants:

- Buttons: primary, secondary, tertiary/ghost, destructive, icon-only, loading.
- Inputs: text, textarea, select/combobox, checkbox, radio, switch, date/time if needed.
- Navigation: tabs, breadcrumbs, side nav, top nav, pagination, command/search.
- Feedback: alert, toast, inline validation, progress, skeleton, empty state.
- Data: table, list row, stat, chart, badge, status, filter chip.
- Overlays: dropdown, popover, tooltip, drawer, modal/dialog.

Use the local component library where it exists. Extend it instead of cloning it.

## Accessibility Baseline

- Use semantic HTML first. Add ARIA only when semantics cannot express the pattern.
- Never remove focus outlines without a visible replacement.
- Labels are visible and programmatically associated with fields.
- Placeholder text is not a label.
- Text contrast meets WCAG AA unless the text is decorative.
- UI components and meaningful icons meet at least 3:1 contrast against adjacent colors.
- Color is never the only status indicator.
- Keyboard navigation reaches every interactive element in a logical order.
- Escape closes dismissible overlays. Focus returns to the trigger.
- Touch targets are large enough and not crowded.
- Reduced motion is respected.

## Focus Design

Use `:focus-visible` for keyboard focus. Rings should be:

- Visible on every background.
- Consistent across components.
- Offset enough to avoid blending into the component border.
- Strong enough to be found quickly without looking like an error state.

## Forms

- Put labels above or beside fields consistently.
- Align error messages with their fields and connect them using `aria-describedby`.
- Validate on blur or submit for most fields. Avoid scolding users on every keystroke.
- Keep required indicators consistent.
- Preserve entered data after validation errors.
- Disable submit only when the reason is obvious, or pair disabled state with helpful guidance.
- Show progress for multi-step or long-running submissions.

## Overlays

- Prefer native `dialog` for modal behavior when appropriate.
- For menus and popovers, use the platform or component library's accessible primitive when available.
- Avoid z-index escalation. Use a semantic layering scale.
- Render overlays outside clipping parents when necessary, using portal/teleport/top-layer patterns.
- Keep overlays sized for small screens and keyboard users.
- Do not hide critical actions only behind hover or gesture.

## Data And Status

- Use tabular numerals for comparable metrics.
- Align numeric columns by decimal or right edge.
- Give status badges meaningful text, not only color.
- Use skeletons that match the final content shape.
- Empty states should explain what happened and what to do next.
- Error states should include recovery, retry, or contact path when possible.

## Microcopy

- Use the product's nouns and verbs consistently.
- Buttons should name the action, not the UI mechanism.
- Error messages should say what went wrong and how to recover.
- Empty states should not apologize unless the product voice truly does.
- Avoid filler headings that repeat adjacent labels.

## Interaction QA

- Can a keyboard-only user complete the main workflow?
- Can a screen reader user understand the page structure and form errors?
- Are all icon-only controls labelled?
- Do hover affordances have touch and keyboard equivalents?
- Are async actions visibly pending and safely recoverable?
- Do disabled, loading, empty, error, and success states match the visual system?
