#!/usr/bin/env node

import { lstat, mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_MODEL,
  DEFAULT_REASONING,
  parseMarkdownAgent,
  renderToml,
} from "./agent-contracts.mjs";

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
    const agent = parseMarkdownAgent(content, sourcePath, path.basename(sourcePath, ".md"));
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
