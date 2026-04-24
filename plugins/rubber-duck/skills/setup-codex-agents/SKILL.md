---
name: setup-codex-agents
description: Install Codex custom-agent TOML files generated from Rubber Duck reviewer agents so Codex can run equivalent review passes.
disable-model-invocation: true
argument-hint: "[--project path | --global | --agents-dir path | --model model-id | --reasoning low|medium|high|xhigh]"
---

# Setup Codex Agents Skill

Use this skill after installing Rubber Duck in Codex to generate Codex-native custom agents from Rubber Duck reviewer agents.

Claude Code loads the Markdown files in the plugin root `agents/` directory directly. Codex custom agents use TOML files under `.codex/agents/` for a project or `~/.codex/agents/` globally. This skill bridges that packaging difference.

## Inputs

Accept `$ARGUMENTS` as optional flags for the bundled script:

- `--project path`: install into `path/.codex/agents`.
- `--global`: install into `~/.codex/agents`.
- `--agents-dir path`: install into an exact agents directory.
- `--model model-id`: override the Codex model. Defaults to `gpt-5.5`.
- `--reasoning low|medium|high|xhigh`: override reasoning effort. Defaults to `medium`.
- `--dry-run`: print planned writes without creating files.

If no target flag is provided, install into `.codex/agents/` under the current project root.

## Workflow

1. Resolve `scripts/install-codex-agents.mjs` relative to this skill folder.
2. Run the script with Node.js, forwarding any `$ARGUMENTS`.
3. If Node.js is unavailable, perform the conversion inline:
   - Read Markdown agents from `source-agents/*.md`.
   - Parse each YAML frontmatter `name` and `description`.
   - Write one TOML file per agent using the Markdown body as `developer_instructions`.
   - Use `model = "gpt-5.5"`, `model_reasoning_effort = "medium"`, and `sandbox_mode = "read-only"` unless the human provided overrides.
4. If setup succeeds, tell the human which agents directory was updated and list the generated TOML files.
5. Tell the human to restart Codex or start a new thread if the new agents do not appear immediately.

## Safety

- Only write generated TOML files into the selected Codex agents directory.
- Do not edit source code, Rubber Duck Markdown agents, or unrelated project files.
- Do not install globally unless the human passes `--global`.
- Do not change the selected model or reasoning effort unless the human passes explicit flags.
