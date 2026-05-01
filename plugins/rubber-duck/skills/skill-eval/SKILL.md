---
name: skill-eval
description: Evaluate and improve Rubber Duck skills and agent prompts with realistic prompts, with-skill/baseline runs, grading, blind comparison, analyzer notes, and human review. Use for Rubber Duck maintainers testing whether a skill, agent, prompt, or workflow change actually improves behavior.
disable-model-invocation: true
argument-hint: "[skill path | agent path | eval prompt set | improvement goal]"
---

# Skill Eval

Use this skill to evaluate Rubber Duck's own skills and agents before or after changing prompts, workflows, or bundled resources.

This is an internal-quality workflow. It should feel like Rubber Duck: source-driven, human-aligned, skeptical of false confidence, and careful about preserving why a change is better.

## Inputs

Accept `$ARGUMENTS` as one of:

- A Rubber Duck skill path, agent path, or workflow name.
- A proposed prompt or instruction change.
- A directory containing eval prompts or previous eval results.
- A free-form goal such as "check whether the new plan workflow asks better questions."

If no useful input is provided, ask the human for the skill, agent, or workflow to evaluate and the behavior they want to improve.

## Output

Create eval artifacts only when the human wants a persisted run. Use this default location inside the Rubber Duck repository:

```text
docs/yyyy-mm-dd-{slug}/skill-eval/
```

When the human only wants quick advice, return a concise evaluation plan without creating files.

## Shared References

Use:

- `../_shared/clarifying-questions.md` to protect human alignment during eval design.
- `../_shared/project-rules-discovery.md` before assuming repository commands or generated artifact conventions.
- `../_shared/agent-orchestration.md` for exact named-agent invocation, bounded launch prompts, read-only delegation, fallback behavior, and how agent questions flow back to this skill.

## Workflow

1. Define the evaluation target.
   - Identify the skill, agent, prompt, or workflow being evaluated.
   - Read the current source fully enough to understand trigger conditions, operating rules, output format, and human-approval behavior.
   - If evaluating a change, preserve the old version as the baseline when possible.
2. Interview and narrow uncertainty.
   - Ask only for success criteria, edge cases, target user behavior, or output expectations that cannot be inferred from source.
   - Ask 1-2 focused questions at a time.
   - Record blocking vs non-blocking uncertainty in the eval notes.
   - Ask for safe synthetic or redacted examples when eval prompts would otherwise include secrets, credentials, private customer data, unnecessary PII, proprietary prompt contents, or raw user transcripts.
3. Draft realistic eval prompts.
   - Use prompts a real user would send, including messy wording, partial context, links, file paths, or ambiguity when that is part of the real workflow.
   - Prefer synthetic or redacted prompts that preserve the shape of the problem without storing sensitive content.
   - Cover both happy paths and edge cases.
   - Include "should not trigger" or "should ask first" cases when trigger behavior or clarifying-question quality matters.
   - Share the prompt set with the human before running expensive evals when the eval design could change the conclusion.
4. Run with-skill and baseline comparisons when subagents are available.
   - Launch paired eval runs in the same batch when possible: one with the target skill/agent/prompt and one baseline.
   - Use the exact pre-built `skill-eval-executor` agent when available.
   - Give each executor only the task-local context needed for its assigned condition.
   - Give each executor an explicit eval output directory and no broader write boundary.
   - Save outputs, redacted summaries, metrics, and uncertainty notes for each run.
   - Do not persist raw transcripts, secrets, credentials, private customer data, unnecessary PII, or proprietary prompt contents. Redact before writing or stop and ask for safer eval input.
   - If subagents are unavailable, run a smaller inline check and state that it is less independent.
5. Grade outputs.
   - Use `skill-eval-grader` for explicit expectations.
   - Require evidence from actual outputs, not only executor claims.
   - Treat weak, unverifiable, or non-discriminating assertions as eval problems.
6. Compare outputs.
   - Use `skill-eval-comparator` for blind A/B comparisons when two outputs can be judged by task completion and quality.
   - Keep the comparator blind to which output came from which configuration.
7. Analyze results.
   - Use `skill-eval-analyzer` to identify patterns, variance, regressions, token/time tradeoffs, and improvements.
   - Prefer generalized prompt or workflow improvements over narrow wording that only fits one eval.
   - When the evaluated target is a Rubber Duck skill or agent prompt, also invoke `agent-prompt-reviewer` after the analyzer pass to surface scope-clarity, confidence-anchor, severity-tier, output-schema, and when-NOT-to-invoke gaps before proposing prompt edits.
8. Bring the human back in.
   - Present the outputs, grades, comparisons, and analyzer notes.
   - Ask for human feedback before making subjective quality changes or declaring a prompt better.
   - If the human approves an improvement direction, update the skill or agent in a separate implementation step or clearly describe the proposed patch.

## Eval Design Rules

- Good evals are discriminating: a low-quality output should fail for a reason that matters.
- Use expectations that check substance, not just file existence, section names, or confident wording.
- Include at least one case where asking a clarifying question is the correct behavior when that workflow depends on human alignment.
- Do not leak the intended fix, desired winner, or suspected failure mode to executor or comparator agents unless the eval explicitly tests instruction-following.
- Do not overfit. If one eval fails, ask what broader behavior it represents before editing the skill.

## Specialist Invocation Contract

- Invoke the exact pre-built agent names: `skill-eval-executor`, `skill-eval-grader`, `skill-eval-comparator`, `skill-eval-analyzer`, and conditionally `agent-prompt-reviewer`.
- In Codex delegation APIs, select the exact agent type or custom-agent name. Do not use `default`, `worker`, or a compressed role prompt when the named reviewer exists.
- Omit `fork_context` or set `fork_context: false` for named eval agents. Pass only the bounded eval prompt, source paths, output directory, condition label, scoring rubric, and redaction constraints needed for that run.
- Start each launch prompt with the selected agent name for auditability, for example: `You are the already-selected Rubber Duck skill-eval-grader custom agent. Use your configured agent instructions; this message only provides run-specific context.`
- Keep reviewer and analyzer agents read-only. Only `skill-eval-executor` may write, and only inside the explicit eval output directory assigned by this skill.
- If a named agent is unavailable, perform the smallest equivalent inline pass from the source-agent definition and record the independence gap in the eval notes.

## Final Response Requirements

Report:

- Target skill, agent, or workflow.
- Eval prompts used or proposed.
- Baseline condition.
- Grading and comparison summary.
- Human feedback requested or received.
- Recommended skill/agent changes and why.
- Residual uncertainty or limits of the eval.
