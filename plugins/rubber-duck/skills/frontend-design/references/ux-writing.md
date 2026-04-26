# UX Writing

Use this for labels, CTAs, errors, empty states, loading copy, terminology, onboarding text, accessibility text, and translation readiness.

## Principles

- Copy is interface behavior. It should help people act, recover, decide, or understand.
- Be specific, concise, active, human, and consistent.
- Match tone to the moment. Success can be warm; errors should be clear and helpful; destructive actions should be serious.
- Do not vary terminology for variety. One concept gets one name.
- Do not use humor when the user is blocked, anxious, paying, deleting, or recovering from failure.

## Buttons And CTAs

Use action labels that say what happens:

- Prefer `Save changes`, `Create project`, `Invite member`, `Download report`.
- Avoid vague labels like `OK`, `Submit`, `Yes`, `No`, and `Click here`.
- For destructive actions, name the object and consequence when space allows.
- For cancel actions, clarify the safe outcome when ambiguity matters, such as `Keep editing`.

Button labels should map to the user's goal, not the implementation mechanism.

## Error Messages

Every useful error answers:

- What happened?
- Why did it happen, if known?
- How can the user recover?

Patterns:

- Format: `[Field] needs [format]. Example: [example].`
- Missing required: `Enter [field] to continue.`
- Permission: `You do not have access to [thing]. [Recovery path].`
- Network: `We could not reach [service]. Check your connection and try again.`
- Server: `Something went wrong on our end. Try again, or [fallback path].`

Keep user input intact after errors. Put errors near the source and connect them to fields programmatically.

## Empty States

An empty state should provide:

- What is empty.
- Why this area matters.
- The next useful action.
- Optional example, template, or import path.

Types:

- First use: teach the value and offer a starter action.
- Cleared by user: light touch and easy recovery.
- No results: suggest changing query or clearing filters.
- No permission: explain access and request path.
- Failed load: say what happened and offer retry.

## Loading And Progress

- Say what is happening, not only `Loading...`.
- Preserve layout with skeletons when content shape is known.
- For long operations, set expectations or show progress.
- Let users cancel or leave when waiting is long and safe.
- Use product-specific loading text. Generic whimsy reads fake quickly.

## Confirmation And Undo

- Use undo for reversible low-risk destructive actions when feasible.
- Use confirmation for irreversible, expensive, security-sensitive, or batch actions.
- Confirmation copy should name the action, object, and consequence.
- Buttons should be specific: `Delete project` and `Keep project`, not `Yes` and `No`.

## Terminology

Create or infer a tiny glossary for repeated nouns and verbs:

- `Project` vs `Workspace`.
- `Delete` vs `Remove` vs `Archive`.
- `Sign in` vs `Log in`.
- `Create` vs `Add` vs `New`.

Use the product's established language. Do not rename concepts during a visual renovation unless the task includes IA or content redesign.

## Accessibility Text

- Link text should make sense out of context.
- Icon-only buttons need accessible names.
- Alt text describes the information or purpose, not merely the image category.
- Decorative images use empty alt text.
- Dynamic status changes should be announced when they affect task progress.

## Translation And Resilience

- Leave room for text expansion. Some translations are much longer than English.
- Avoid fixed-width text containers for labels and buttons.
- Use complete translatable strings; do not concatenate sentence fragments.
- Format dates, times, numbers, and currency with locale-aware APIs where possible.
- Avoid abbreviations that do not translate cleanly.

## Copy QA

- Can a first-time user predict what each action does?
- Are errors recoverable without support?
- Are empty states useful rather than dead ends?
- Is the same concept named the same way everywhere?
- Does copy still fit with long strings and localization?
- Does the tone match the emotional moment?
