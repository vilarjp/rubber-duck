export const DEFAULT_MODEL = "gpt-5.5";
export const DEFAULT_REASONING = "medium";
export const EXPECTED_SOURCE_MODEL = "sonnet";

export const AGENT_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const REQUIRED_AGENT_FIELDS = ["name", "description", "model", "tools", "color", "sandbox"];
export const VALID_SANDBOXES = new Set(["read-only", "workspace-write"]);
export const VALID_AGENT_COLORS = new Set([
  "blue",
  "cyan",
  "green",
  "orange",
  "pink",
  "purple",
  "red",
  "yellow",
]);
export const VALID_SOURCE_TOOLS = new Set([
  "Agent",
  "Bash",
  "Edit",
  "Glob",
  "Grep",
  "Read",
  "WebFetch",
  "WebSearch",
  "Write",
]);
export const MUTATING_TOOLS = new Set(["Edit", "Write"]);

export function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseFrontmatterFields(content, filePath) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`Missing frontmatter: ${filePath}`);

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const fieldMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!fieldMatch) continue;
    fields[fieldMatch[1]] = stripQuotes(fieldMatch[2].trim());
  }
  return fields;
}

export function parseToolList(value, filePath) {
  const tools = value
    .split(",")
    .map((tool) => tool.trim())
    .filter(Boolean);
  if (tools.length === 0) throw new Error(`Empty tools list: ${filePath}`);
  for (const tool of tools) {
    if (!VALID_SOURCE_TOOLS.has(tool)) {
      throw new Error(`Invalid source tool ${tool}: ${filePath}`);
    }
  }
  return tools;
}

export function validateAgentFields(fields, filePath, expectedName) {
  for (const field of REQUIRED_AGENT_FIELDS) {
    if (!fields[field]) {
      throw new Error(`Missing frontmatter ${field} in ${filePath}`);
    }
  }

  if (!AGENT_NAME_PATTERN.test(fields.name)) {
    throw new Error(`Invalid agent name ${fields.name} in ${filePath}`);
  }
  if (expectedName && fields.name !== expectedName) {
    throw new Error(
      `Agent name ${fields.name} does not match filename ${expectedName}: ${filePath}`,
    );
  }
  if (fields.model !== EXPECTED_SOURCE_MODEL) {
    throw new Error(`Unexpected source model for ${fields.name}: ${fields.model}`);
  }
  if (!VALID_AGENT_COLORS.has(fields.color)) {
    throw new Error(`Invalid agent color ${fields.color}: ${filePath}`);
  }
  if (!VALID_SANDBOXES.has(fields.sandbox)) {
    throw new Error(`Invalid sandbox ${fields.sandbox}: ${filePath}`);
  }

  const tools = parseToolList(fields.tools, filePath);
  const mutatingTools = tools.filter((tool) => MUTATING_TOOLS.has(tool));
  if (fields.sandbox === "read-only" && mutatingTools.length > 0) {
    throw new Error(
      `Read-only agent ${fields.name} declares mutating tools [${mutatingTools.join(", ")}]`,
    );
  }
  return tools;
}

export function parseMarkdownAgent(content, filePath, expectedName) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing YAML frontmatter in ${filePath}`);
  }

  const fields = parseFrontmatterFields(content, filePath);
  const tools = validateAgentFields(fields, filePath, expectedName);

  return {
    name: fields.name,
    description: fields.description,
    model: fields.model,
    tools: fields.tools,
    parsedTools: tools,
    color: fields.color,
    sandbox: fields.sandbox,
    body: match[2].trim(),
  };
}

export function tomlString(value) {
  return JSON.stringify(value);
}

export function renderDeveloperInstructions(sourceBody, sourceFileName, sourceTools) {
  return `${sourceBody}

## Codex Runtime Notes

- This TOML file was generated from Rubber Duck Markdown agent source: ${sourceFileName}.
- Source tools declared in the Markdown frontmatter: ${sourceTools}.
- Respect this agent's declared scope and sandbox. Read-only agents must not edit files. Workspace-write agents may edit only within the ownership or output boundaries provided by the invoking skill.
- Follow these full developer instructions even if the parent skill launches you with a brief run-specific prompt.
- Treat short launch prompts as task context only, not as a replacement for this agent's scope, operating rules, checklist, or output format.
- If the launch prompt names this already-selected agent, treat that as an audit label and continue following these full developer instructions.
- The source tools comment in this generated TOML is informational. Only use tools the host runtime actually exposes to you.
- Treat the source tools list as the allowed capability policy for this agent. Do not use additional host tools, connectors, external access, or mutating capabilities unless the source Markdown frontmatter includes them and the invoking skill explicitly asks for that behavior within this agent's scope.
- If this agent references shared Rubber Duck guidance by name, resolve it from \`plugins/rubber-duck/skills/_shared/\` when that path is available. If the shared reference is unavailable, follow the explicit instructions in this generated agent and state the missing shared-reference context as a confidence limit.
- If nested Agent, WebSearch, or WebFetch capabilities are unavailable, follow this agent's fallback behavior and make the review gap explicit instead of claiming that delegated or external research occurred.
- Return findings, questions, and recommendations to the parent Rubber Duck skill.`;
}

export function renderToml(agent, options, sourceFileName) {
  if (!VALID_SANDBOXES.has(agent.sandbox)) {
    throw new Error(
      `Unsupported sandbox value for ${agent.name}: ${agent.sandbox}`,
    );
  }

  const instructions = renderDeveloperInstructions(agent.body, sourceFileName, agent.tools);

  return `# Generated by Rubber Duck setup-codex-agents.
# Re-run the setup skill after updating Rubber Duck custom agents.
# Source Markdown: ${sourceFileName}
# Source tools: ${agent.tools}
# Source tools note: informational; only use tools the host runtime exposes and the source policy allows.

name = ${tomlString(agent.name)}
description = ${tomlString(agent.description)}
model = ${tomlString(options.model)}
model_reasoning_effort = ${tomlString(options.reasoning)}
sandbox_mode = ${tomlString(agent.sandbox)}
developer_instructions = ${tomlString(instructions)}
`;
}
