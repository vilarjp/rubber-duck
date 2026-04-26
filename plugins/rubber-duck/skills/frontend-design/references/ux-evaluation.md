# UX Evaluation

Use this for audits, critiques, redesign planning, and final review when the question is not only "does it look good?" but "does it help humans succeed?"

## Cognitive Load

Classify load:

- **Intrinsic load**: The task is genuinely complex. Structure it.
- **Extraneous load**: The interface makes the task harder. Remove it.
- **Learning load**: The user is building useful understanding. Support it.

Check:

- Single focus: Is the primary task clear?
- Chunking: Is information grouped into digestible sets?
- Grouping: Are related things visually close and unrelated things separated?
- Visual hierarchy: Is the most important thing obvious?
- One decision at a time: Does the flow avoid simultaneous competing decisions?
- Minimal visible choices: Are decision points kept tight or grouped?
- Recognition over recall: Is needed context visible where action happens?
- Progressive disclosure: Is complexity revealed when needed?

If several fail, fix structure before visual polish.

## Heuristic Review

Use this quick 0-4 scoring scale when auditing a flow:

- `0`: absent or broken.
- `1`: major gaps.
- `2`: partial, with meaningful friction.
- `3`: good, minor issues.
- `4`: excellent, hard to improve.

Score the relevant heuristics:

- Visibility of system status.
- Match between system and user language.
- User control and freedom.
- Consistency and standards.
- Error prevention.
- Recognition rather than recall.
- Flexibility and efficiency for repeat users.
- Aesthetic and focused design.
- Error recognition, diagnosis, and recovery.
- Help, onboarding, or contextual guidance when needed.

Most real interfaces do not score 4 everywhere. Be honest and prioritize.

## Persona Passes

Choose 2-3 personas relevant to the surface:

- **Power user**: Wants speed, keyboard flow, shortcuts, density, bulk actions, no forced hand-holding.
- **First-timer**: Needs obvious first action, plain language, visible guidance, no unexplained icons.
- **Accessibility-dependent user**: Needs keyboard completion, semantic structure, labels, contrast, screen reader state, reduced motion.
- **Stress tester**: Tries empty data, long strings, invalid inputs, refreshes, multiple tabs, permissions, API failure.
- **Distracted mobile user**: Needs thumb-friendly actions, saved progress, short forms, slow-network resilience.

Walk the primary action as each persona. Report concrete red flags, not generic empathy.

## Severity

Use severity to prevent noisy critique:

- **P0 Blocking**: Prevents task completion.
- **P1 Major**: Causes significant confusion, error, accessibility failure, or trust loss.
- **P2 Minor**: Annoying or inefficient, but there is a workaround.
- **P3 Polish**: Quality detail with low task risk.

If everything is P1, the review is not prioritizing.

## Critique Structure

For design review output, lead with the issues:

```text
Anti-template verdict:
Health score:
Top findings:
What is working:
Persona red flags:
Recommended fixes:
Verification:
```

Each finding should include:

- Location.
- What is wrong.
- Why it matters to users.
- Concrete fix.
- Severity.

## Evaluation QA

- Did you inspect the live UI or rendered states when possible?
- Did you test the primary workflow, not only the first screen?
- Did you include loading, empty, error, and long-content states?
- Did you distinguish design-system drift from isolated bugs?
- Did you recommend structural fixes before cosmetic fixes?
- Did you avoid turning a product UI critique into a brand taste review?
