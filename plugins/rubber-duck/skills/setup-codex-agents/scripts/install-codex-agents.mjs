#!/usr/bin/env node

import { lstat, mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_MODEL = "gpt-5.5";
const DEFAULT_REASONING = "medium";
const AGENT_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUIRED_AGENT_FIELDS = ["name", "description", "model", "tools", "color", "sandbox"];

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");
const pluginRoot = path.resolve(skillDir, "..", "..");
const rootAgentsDir = path.join(pluginRoot, "agents");
const bundledAgentsDir = path.join(skillDir, "source-agents");

function usage() {
  return `Usage: node install-codex-agents.mjs [options]

Options:
  --project <path>      Install into <path>/.codex/agents
  --agents-dir <path>   Install into an exact Codex agents directory
  --global              Install into ~/.codex/agents
  --model <model-id>    Codex model to write into generated agents (default: ${DEFAULT_MODEL})
  --reasoning <effort>  Reasoning effort: low, medium, high, or xhigh (default: ${DEFAULT_REASONING})
  --dry-run             Print planned writes without creating files
  --help                Show this help

Default target without --project, --agents-dir, or --global: nearest project root's .codex/agents.
`;
}

function parseArgs(argv) {
  const options = {
    project: null,
    agentsDir: null,
    global: false,
    model: DEFAULT_MODEL,
    reasoning: DEFAULT_REASONING,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--global") {
      options.global = true;
    } else if (arg === "--project") {
      options.project = requireValue(argv, ++i, arg);
    } else if (arg === "--agents-dir") {
      options.agentsDir = requireValue(argv, ++i, arg);
    } else if (arg === "--model") {
      options.model = requireValue(argv, ++i, arg);
    } else if (arg === "--reasoning") {
      options.reasoning = requireValue(argv, ++i, arg);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!["low", "medium", "high", "xhigh"].includes(options.reasoning)) {
    throw new Error(`Unsupported reasoning effort: ${options.reasoning}`);
  }

  const targetModes = [options.project, options.agentsDir, options.global].filter(Boolean);
  if (targetModes.length > 1) {
    throw new Error("Choose only one target flag: --project, --agents-dir, or --global");
  }

  return options;
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

async function existsDirectory(dir) {
  try {
    const dirStat = await stat(dir);
    return dirStat.isDirectory();
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function existsPath(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function findNearestProjectRoot(startDir) {
  let current = path.resolve(startDir);
  while (true) {
    if (await existsPath(path.join(current, ".git"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(startDir);
    current = parent;
  }
}

async function resolveSourceDir() {
  if (await existsDirectory(rootAgentsDir)) return rootAgentsDir;
  if (await existsDirectory(bundledAgentsDir)) return bundledAgentsDir;
  throw new Error(
    `Could not find Rubber Duck source agents at ${rootAgentsDir} or ${bundledAgentsDir}`,
  );
}

async function resolveTargetDir(options) {
  if (options.agentsDir) return path.resolve(options.agentsDir);
  if (options.global) return path.join(os.homedir(), ".codex", "agents");
  const projectDir = options.project
    ? path.resolve(options.project)
    : await findNearestProjectRoot(process.cwd());
  return path.join(projectDir, ".codex", "agents");
}

function parseMarkdownAgent(content, filePath) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing YAML frontmatter in ${filePath}`);
  }

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const fieldMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!fieldMatch) continue;
    fields[fieldMatch[1]] = stripQuotes(fieldMatch[2].trim());
  }

  for (const field of REQUIRED_AGENT_FIELDS) {
    if (!fields[field]) {
      throw new Error(`Missing frontmatter ${field} in ${filePath}`);
    }
  }

  const expectedName = path.basename(filePath, ".md");
  if (!AGENT_NAME_PATTERN.test(fields.name)) {
    throw new Error(`Invalid agent name ${fields.name} in ${filePath}`);
  }
  if (fields.name !== expectedName) {
    throw new Error(
      `Agent name ${fields.name} does not match filename ${expectedName}: ${filePath}`,
    );
  }

  return {
    name: fields.name,
    description: fields.description,
    tools: fields.tools,
    sandbox: fields.sandbox,
    body: match[2].trim(),
  };
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function tomlString(value) {
  return JSON.stringify(value);
}

function renderToml(agent, options, sourceFileName) {
  if (!["read-only", "workspace-write"].includes(agent.sandbox)) {
    throw new Error(
      `Unsupported sandbox value for ${agent.name}: ${agent.sandbox}`,
    );
  }

  const instructions = `${agent.body}

## Codex Runtime Notes

- This TOML file was generated from Rubber Duck Markdown agent source: ${sourceFileName}.
- Source tools declared in the Markdown frontmatter: ${agent.tools}.
- Respect this agent's declared scope and sandbox. Read-only agents must not edit files. Workspace-write agents may edit only within the ownership or output boundaries provided by the invoking skill.
- Follow these full developer instructions even if the parent skill launches you with a brief run-specific prompt.
- Treat short launch prompts as task context only, not as a replacement for this agent's scope, operating rules, checklist, or output format.
- If the launch prompt names this already-selected agent, treat that as an audit label and continue following these full developer instructions.
- The source tools comment in this generated TOML is informational. Only use tools the host runtime actually exposes to you.
- Treat the source tools list as the allowed capability policy for this agent. Do not use additional host tools, connectors, external access, or mutating capabilities unless the source Markdown frontmatter includes them and the invoking skill explicitly asks for that behavior within this agent's scope.
- If nested Agent, WebSearch, or WebFetch capabilities are unavailable, follow this agent's fallback behavior and make the review gap explicit instead of claiming that delegated or external research occurred.
- Return findings, questions, and recommendations to the parent Rubber Duck skill.`;

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

function assertPathInsideDirectory(targetPath, targetDir) {
  const relative = path.relative(targetDir, targetPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside target agents directory: ${targetPath}`);
  }
}

async function assertSafeWriteTarget(targetPath) {
  try {
    const existing = await lstat(targetPath);
    if (existing.isSymbolicLink()) {
      throw new Error(`Refusing to overwrite symlink destination: ${targetPath}`);
    }
    if (!existing.isFile()) {
      throw new Error(`Refusing to overwrite non-file destination: ${targetPath}`);
    }
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
}

async function assertTargetDirIsNotSymlink(targetPath) {
  try {
    const existing = await lstat(targetPath);
    if (existing.isSymbolicLink()) {
      throw new Error(`Refusing to use symlinked agents directory: ${targetPath}`);
    }
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
}

async function writeGeneratedAgentsAtomically(writes) {
  const tempWrites = [];
  const committedWrites = [];
  const backupWrites = [];
  const failAfterRenames = Number.parseInt(
    process.env.RUBBER_DUCK_INSTALL_FAIL_AFTER_RENAMES ?? "",
    10,
  );

  async function restoreCommittedWrites() {
    for (const write of committedWrites.reverse()) {
      await rm(write.target, { force: true });
      if (write.backupPath) {
        await rename(write.backupPath, write.target);
      }
    }
  }

  try {
    for (let index = 0; index < writes.length; index += 1) {
      const write = writes[index];
      const tempPath = path.join(
        path.dirname(write.target),
        `.${path.basename(write.target)}.${process.pid}.${index}.tmp`,
      );
      await assertSafeWriteTarget(write.target);
      await writeFile(tempPath, write.toml, { encoding: "utf8", flag: "wx" });
      tempWrites.push({ tempPath, target: write.target });
    }

    for (let index = 0; index < tempWrites.length; index += 1) {
      const { tempPath, target } = tempWrites[index];
      const backupPath = `${target}.${process.pid}.${index}.bak`;
      let backupCreated = false;
      try {
        await assertSafeWriteTarget(target);
        await rename(target, backupPath);
        backupCreated = true;
        backupWrites.push(backupPath);
      } catch (error) {
        if (error?.code !== "ENOENT") throw error;
      }
      try {
        await rename(tempPath, target);
      } catch (error) {
        if (backupCreated) {
          await rename(backupPath, target);
        }
        throw error;
      }
      committedWrites.push({
        target,
        backupPath: backupCreated ? backupPath : null,
      });
      if (!Number.isNaN(failAfterRenames) && committedWrites.length === failAfterRenames) {
        throw new Error("Simulated generated-agent commit failure");
      }
    }

    for (const backupPath of backupWrites) {
      await rm(backupPath, { force: true });
    }
  } catch (error) {
    await restoreCommittedWrites();
    for (const { tempPath } of tempWrites) {
      await rm(tempPath, { force: true });
    }
    for (const backupPath of backupWrites) {
      await rm(backupPath, { force: true });
    }
    throw error;
  }
}

async function collectStaleGeneratedAgents(targetDir, currentTargets) {
  const entries = await readdir(targetDir);
  const currentTargetSet = new Set(currentTargets.map((target) => path.resolve(target)));
  const staleTargets = [];

  for (const entry of entries) {
    if (!entry.endsWith(".toml")) continue;
    const targetPath = path.resolve(targetDir, entry);
    assertPathInsideDirectory(targetPath, targetDir);
    if (currentTargetSet.has(targetPath)) continue;

    const existing = await lstat(targetPath);
    if (!existing.isFile() || existing.isSymbolicLink()) continue;

    const content = await readFile(targetPath, "utf8");
    if (!content.startsWith("# Generated by Rubber Duck setup-codex-agents.\n")) continue;
    staleTargets.push(targetPath);
  }

  return staleTargets;
}

async function removeStaleGeneratedAgents(staleTargets) {
  for (const targetPath of staleTargets) {
    await rm(targetPath);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const sourceDir = await resolveSourceDir();
  const targetDir = await resolveTargetDir(options);
  const entries = (await readdir(sourceDir))
    .filter((entry) => entry.endsWith(".md"))
    .sort();

  if (entries.length === 0) {
    throw new Error(`No Markdown agents found in ${sourceDir}`);
  }

  const writes = [];
  const seenNames = new Set();
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry);
    const content = await readFile(sourcePath, "utf8");
    const agent = parseMarkdownAgent(content, sourcePath);
    if (seenNames.has(agent.name)) {
      throw new Error(`Duplicate agent name: ${agent.name}`);
    }
    seenNames.add(agent.name);
    const targetPath = path.resolve(targetDir, `${agent.name}.toml`);
    assertPathInsideDirectory(targetPath, targetDir);
    writes.push({
      agent,
      source: sourcePath,
      target: targetPath,
      toml: renderToml(agent, options, entry),
    });
  }

  if (!options.dryRun) {
    await assertTargetDirIsNotSymlink(targetDir);
    await mkdir(targetDir, { recursive: true });
    await assertTargetDirIsNotSymlink(targetDir);
    for (const write of writes) {
      await assertSafeWriteTarget(write.target);
    }
    const staleTargets = await collectStaleGeneratedAgents(
      targetDir,
      writes.map((write) => write.target),
    );
    await writeGeneratedAgentsAtomically(writes);
    await removeStaleGeneratedAgents(staleTargets);
  }

  process.stdout.write(
    [
      `Source agents: ${sourceDir}`,
      `Target agents directory: ${targetDir}`,
      `Model: ${options.model}`,
      `Reasoning effort: ${options.reasoning}`,
      options.dryRun ? "Dry run: no files written" : "Generated files:",
      ...writes.map((write) => `- ${write.target}`),
      "",
    ].join("\n"),
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
