# Motion And Polish

Use this for animation systems, micro-interactions, perceived performance, and final tactile details.

## Motion Principles

- Motion explains what changed.
- Motion should make the interface feel faster or clearer, not busier.
- Product UI usually needs quiet feedback and continuity.
- Brand surfaces can use choreographed reveals when they support the story.
- Reduced motion is a requirement, not an enhancement.

## Timing

Use tokens and stay consistent:

- **80-120ms**: Press feedback, instant color or opacity response.
- **150-220ms**: Hover, focus, selection, small state changes.
- **240-360ms**: Menus, popovers, drawers, accordions, route-level UI changes.
- **400-700ms**: Brand entrances, hero reveals, meaningful onboarding choreography.

Exit animations are usually shorter than entrances.

## Easing

Prefer smooth deceleration:

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-standard: cubic-bezier(0.65, 0, 0.35, 1);
}
```

Avoid bounce, elastic, and novelty curves unless the product's interaction model is explicitly playful and still accessible.

## Performance

- Animate `transform` and `opacity` by default.
- Avoid animating layout properties such as `top`, `left`, `width`, and `height`.
- For expanding regions, prefer grid-row or transform patterns, or use the framework's measured animation primitive when already available.
- Use `will-change` only shortly before an animation.
- For scroll-triggered work, prefer Intersection Observer or framework primitives over raw scroll handlers.
- Avoid long stagger chains. Cap total delay so content is not held hostage by choreography.

## Reduced Motion

Provide reduced-motion alternatives:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }

  .motion-slide,
  .motion-scale {
    animation: none !important;
    transition: opacity 120ms ease-out !important;
    transform: none !important;
  }
}
```

Functional feedback can remain, but remove large movement, parallax, zoom, and vestibular triggers.

## Micro-Interactions

Good candidates:

- Button press and loading state.
- Toggle state change.
- Menu open/close and focus movement.
- Row selection, drag handles, sortable headers.
- Form validation and success confirmation.
- Copy-to-clipboard, save, undo, retry.
- Empty state activation.
- Chart hover, scrub, and selection.

Avoid animating every card on every hover. Restraint creates quality.

## Tactile Polish

- Button icons shift or fade with text only when it clarifies the action.
- Loading states preserve layout size.
- Skeletons reflect actual content structure.
- Toasts do not cover primary controls.
- Drawers and dialogs return focus to the trigger.
- Route transitions do not erase scroll or context unexpectedly.
- The same action should feel the same across the product.

## Brand Choreography

For expressive pages:

- Choose one main motion idea, such as typographic reveal, image parallax, object trail, scroll-linked progression, or staged proof points.
- Tie motion to narrative order.
- Keep text readable during motion.
- Do not hijack scroll or delay basic navigation.
- Make the non-motion experience still feel intentionally designed.

## Motion QA

- Does motion communicate state, hierarchy, continuity, or delight?
- Does reduced motion remove large spatial movement?
- Are animations smooth on low-power devices?
- Do loading and transition states avoid layout shift?
- Is the choreography consistent with the product register?
