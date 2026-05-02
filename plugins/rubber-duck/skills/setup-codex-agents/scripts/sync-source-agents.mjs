#!/usr/bin/env node

import { copyFile, mkdir, readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");
const pluginRoot = path.resolve(skillDir, "..", "..");
const rootAgentsDir = path.join(pluginRoot, "agents");
const bundledAgentsDir = path.join(skillDir, "source-agents");

function usage() {
  return `Usage: node sync-source-agents.mjs [--check]

Synchronizes the bundled setup-codex-agents/source-agents mirror from the plugin root agents directory.

Options:
  --check   Verify parity without writing files.
  --help    Show this help
`;
}

function parseArgs(argv) {
  const options = { check: false, help: false };
  for (const arg of argv) {
    if (arg === "--check") {
      options.check = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

async function listMarkdownFiles(dir) {
  return (await readdir(dir)).filter((entry) => entry.endsWith(".md")).sort();
}

async function assertMirrored(sourceFiles, targetFiles) {
  const mismatches = [];
  if (sourceFiles.join("\n") !== targetFiles.join("\n")) {
    mismatches.push(
      `filename set differs: source [${sourceFiles.join(", ")}], target [${targetFiles.join(", ")}]`,
    );
  }

  for (const file of sourceFiles.filter((entry) => targetFiles.includes(entry))) {
    const source = await readFile(path.join(rootAgentsDir, file), "utf8");
    const target = await readFile(path.join(bundledAgentsDir, file), "utf8");
    if (source !== target) mismatches.push(`content differs: ${file}`);
  }

  if (mismatches.length > 0) {
    throw new Error(`source-agents mirror is stale:\n- ${mismatches.join("\n- ")}`);
  }
}

async function syncMirror(sourceFiles, targetFiles) {
  await mkdir(bundledAgentsDir, { recursive: true });
  const sourceSet = new Set(sourceFiles);

  for (const file of targetFiles) {
    if (!sourceSet.has(file)) {
      await rm(path.join(bundledAgentsDir, file));
    }
  }

  for (const file of sourceFiles) {
    await copyFile(path.join(rootAgentsDir, file), path.join(bundledAgentsDir, file));
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const sourceFiles = await listMarkdownFiles(rootAgentsDir);
  const targetFiles = await listMarkdownFiles(bundledAgentsDir);

  if (options.check) {
    await assertMirrored(sourceFiles, targetFiles);
    process.stdout.write(`source-agents mirror is current (${sourceFiles.length} agents).\n`);
    return;
  }

  await syncMirror(sourceFiles, targetFiles);
  process.stdout.write(`Synchronized ${sourceFiles.length} source-agent mirror files.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
