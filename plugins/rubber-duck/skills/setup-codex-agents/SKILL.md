---
name: setup-codex-agents
description: Install Codex custom-agent TOML files generated from Rubber Duck research, docs, implementation, frontend, product, diagnosis, shipping, packaging, test, eval, and review agents.
disable-model-invocation: true
argument-hint: "[--project path | --global | --agents-dir path | --model model-id | --reasoning low|medium|high|xhigh]"
---

# Setup Codex Agents Skill

Use this skill after installing Rubber Duck in Codex to generate Codex-native custom agents from Rubber Duck research, docs, implementation, frontend, product, diagnosis, shipping, packaging, test, eval, and review agents.

Claude Code loads the Markdown files in the plugin root `agents/` directory directly. Codex custom agents use TOML files under `.codex/agents/` for a project or `~/.codex/agents/` globally. This skill bridges that packaging difference.

The generated agents are the source of truth for specialized Rubber Duck behavior in Codex. Rubber Duck skills should invoke them by exact custom-agent name, omit full-history forks, and use the self-contained launch prompt only for document paths, diffs, source summaries, assigned tasks, and other run-specific context.

## Inputs

Accept `$ARGUMENTS` as optional flags for the bundled script:

- `--project path`: install into `path/.codex/agents`.
- `--global`: install into `~/.codex/agents`.
- `--agents-dir path`: install into an exact agents directory.
- `--model model-id`: override the Codex model. Defaults to `gpt-5.5`.
- `--reasoning low|medium|high|xhigh`: override reasoning effort. Defaults to `medium`.
- `--dry-run`: print planned writes without creating files.

If no target flag is provided, install into `.codex/agents/` under the current project root.

## Shared References

Use `../_shared/agent-orchestration.md` for exact named-agent invocation, read-only delegation, fallback behavior, and how specialist questions flow back to the parent skill.

## Agent Crew

- Use `agent-packaging-reviewer` when validating or changing Rubber Duck agent packaging, mirrored source agents, sandbox declarations, generated TOML behavior, setup scripts, validation counts, or README/setup expectations.
- Do not invoke `agent-packaging-reviewer` for a routine local install when no packaging behavior changed and validation is not being assessed.

## Workflow

1. Resolve `scripts/install-codex-agents.mjs` relative to this skill folder.
2. Run the script with Node.js, forwarding any `$ARGUMENTS`.
3. If Node.js is unavailable, perform the conversion inline:
   - Read Markdown agents from `source-agents/*.md`.
   - Parse each YAML frontmatter `name` and `description`.
   - Write one TOML file per agent using the Markdown body as `developer_instructions`.
   - Use `model = "gpt-5.5"`, `model_reasoning_effort = "medium"`, and each agent's frontmatter `sandbox` value when present.
   - Default missing sandbox values to `read-only`; only generate `workspace-write` for agents that explicitly declare it.
   - Reject any sandbox value other than `read-only` or `workspace-write`, matching the bundled script.
4. For publish or release validation, run `scripts/validate-rubber-duck-plugin.mjs` from this skill folder. It checks plugin manifests, skill metadata, root/source-agent mirroring, generated TOML count, default model/reasoning, and allowed sandbox modes.
5. When validating packaging changes or investigating validation/generation risk, run the `agent-packaging-reviewer` agent.
   - Follow the Specialist Invocation Contract below.
   - Invoke the exact pre-built `agent-packaging-reviewer` agent.
   - Pass the root `agents/` inventory, `source-agents/` inventory, validation command and output, install command or dry-run output, sandbox expectations, and any changed setup scripts or docs.
   - Do not allow the reviewer to edit files or write separate reports.
   - Treat mirror drift, sandbox mismatches, generated-agent count mismatches, stale validation expectations, or missing required frontmatter as blockers before calling packaging ready.
6. If setup succeeds, tell the human which agents directory was updated and list the generated TOML files.
7. Tell the human to restart Codex or start a new thread if the new agents do not appear immediately.

## Specialist Invocation Contract

- Follow `../_shared/agent-orchestration.md` for exact named-agent invocation, read-only delegation, fan-out/fan-in, and fallback behavior.
- Invoke the exact pre-built `agent-packaging-reviewer` agent for packaging validation review.
- In Codex delegation APIs, select `agent_type: agent-packaging-reviewer`. Do not use `default`, `worker`, or a compressed role prompt when the named reviewer exists.
- Start the launch prompt with the selected agent name for auditability, for example: `You are the already-selected Rubber Duck agent-packaging-reviewer custom agent. Use your configured agent instructions; this message only provides run-specific context.`
- Keep the reviewer read-only. It returns packaging findings, required fixes, generated-agent notes, and questions; the parent skill owns edits, validation commands, install commands, and the final user summary.

## Safety

- Only write generated TOML files into the selected Codex agents directory.
- Do not edit source code, Rubber Duck Markdown agents, or unrelated project files.
- Do not install globally unless the human passes `--global`.
- Do not change the selected model or reasoning effort unless the human passes explicit flags.
- Preserve each agent's declared sandbox. Read-only agents must remain read-only; workspace-write agents still require explicit task ownership from the invoking skill.
