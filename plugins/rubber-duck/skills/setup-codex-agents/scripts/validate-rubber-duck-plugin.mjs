#!/usr/bin/env node

import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const EXPECTED_MODEL = "gpt-5.5";
const EXPECTED_REASONING = "medium";
const EXPECTED_AGENT_COUNT = 29;
const VALID_SANDBOXES = new Set(["read-only", "workspace-write"]);
const EXPECTED_WORKSPACE_WRITE = new Set([
  "implementation-agent",
  "skill-eval-executor",
  "test-implementer",
]);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");
const pluginRoot = path.resolve(skillDir, "..", "..");
const repoRoot = path.resolve(pluginRoot, "..", "..");
const rootAgentsDir = path.join(pluginRoot, "agents");
const bundledAgentsDir = path.join(skillDir, "source-agents");
const setupScript = path.join(scriptDir, "install-codex-agents.mjs");

function fail(message) {
  throw new Error(message);
}

async function readJson(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  return JSON.parse(await readFile(fullPath, "utf8"));
}

async function listFiles(dir, suffix) {
  return (await readdir(dir)).filter((entry) => entry.endsWith(suffix)).sort();
}

function parseFrontmatter(content, filePath) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) fail(`Missing frontmatter: ${filePath}`);

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const fieldMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!fieldMatch) continue;
    fields[fieldMatch[1]] = stripQuotes(fieldMatch[2].trim());
  }
  return fields;
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

function parseTomlScalar(content, key, filePath) {
  const match = content.match(new RegExp(`^${key}\\s*=\\s*"(.*)"$`, "m"));
  if (!match) fail(`Missing TOML key ${key}: ${filePath}`);
  return match[1];
}

async function assertJsonManifests() {
  const manifests = [
    ".agents/plugins/marketplace.json",
    ".claude-plugin/marketplace.json",
    "plugins/rubber-duck/.codex-plugin/plugin.json",
    "plugins/rubber-duck/.claude-plugin/plugin.json",
  ];

  const parsed = {};
  for (const manifest of manifests) {
    parsed[manifest] = await readJson(manifest);
  }

  const codexVersion = parsed["plugins/rubber-duck/.codex-plugin/plugin.json"].version;
  const claudeVersion = parsed["plugins/rubber-duck/.claude-plugin/plugin.json"].version;
  if (!codexVersion || codexVersion !== claudeVersion) {
    fail(`Plugin manifest versions differ: Codex=${codexVersion} Claude=${claudeVersion}`);
  }

  const readme = await readFile(path.join(repoRoot, "README.md"), "utf8");
  if (!readme.includes(`Version ${codexVersion}`)) {
    fail(`README badge does not mention Version ${codexVersion}`);
  }
}

async function assertSkillMetadata() {
  const skillDirs = await readdir(path.join(pluginRoot, "skills"), {
    withFileTypes: true,
  });
  const skillFiles = skillDirs
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => path.join(pluginRoot, "skills", entry.name, "SKILL.md"))
    .sort();

  for (const skillFile of skillFiles) {
    const fields = parseFrontmatter(await readFile(skillFile, "utf8"), skillFile);
    if (!fields.name) fail(`Missing skill name: ${skillFile}`);
    if (!fields.description) fail(`Missing skill description: ${skillFile}`);
  }

  const openaiFiles = [];
  for (const entry of skillDirs) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    openaiFiles.push(
      path.join(pluginRoot, "skills", entry.name, "agents", "openai.yaml"),
    );
  }

  for (const file of openaiFiles.sort()) {
    const content = await readFile(file, "utf8");
    for (const required of [
      "interface:",
      "display_name:",
      "short_description:",
      "brand_color:",
      "default_prompt:",
    ]) {
      if (!content.includes(required)) fail(`Missing ${required} in ${file}`);
    }
  }
}

async function assertAgentSources() {
  const rootAgents = await listFiles(rootAgentsDir, ".md");
  const bundledAgents = await listFiles(bundledAgentsDir, ".md");
  if (rootAgents.length !== EXPECTED_AGENT_COUNT) {
    fail(`Expected ${EXPECTED_AGENT_COUNT} root agents, found ${rootAgents.length}`);
  }
  if (bundledAgents.length !== rootAgents.length) {
    fail(`Root/source agent count mismatch: ${rootAgents.length} vs ${bundledAgents.length}`);
  }
  if (rootAgents.join("\n") !== bundledAgents.join("\n")) {
    fail("Root/source agent filename sets differ");
  }

  const workspaceWrite = new Set();
  for (const agentFile of rootAgents) {
    const rootPath = path.join(rootAgentsDir, agentFile);
    const bundledPath = path.join(bundledAgentsDir, agentFile);
    const rootContent = await readFile(rootPath, "utf8");
    const bundledContent = await readFile(bundledPath, "utf8");
    if (rootContent !== bundledContent) fail(`Bundled source differs: ${agentFile}`);

    const fields = parseFrontmatter(rootContent, rootPath);
    if (!fields.name) fail(`Missing agent name: ${rootPath}`);
    if (!fields.description) fail(`Missing agent description: ${rootPath}`);
    const sandbox = fields.sandbox || "read-only";
    if (!VALID_SANDBOXES.has(sandbox)) fail(`Invalid sandbox ${sandbox}: ${rootPath}`);
    if (sandbox === "workspace-write") workspaceWrite.add(fields.name);
  }

  assertSetEquals(workspaceWrite, EXPECTED_WORKSPACE_WRITE, "workspace-write source agents");
}

async function assertGeneratedAgents() {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "rubber-duck-agents-"));
  try {
    const result = spawnSync(process.execPath, [setupScript, "--agents-dir", targetDir], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    if (result.status !== 0) {
      fail(`Generator failed:\n${result.stderr || result.stdout}`);
    }

    const generated = await listFiles(targetDir, ".toml");
    if (generated.length !== EXPECTED_AGENT_COUNT) {
      fail(`Expected ${EXPECTED_AGENT_COUNT} generated TOML files, found ${generated.length}`);
    }

    const workspaceWrite = new Set();
    for (const file of generated) {
      const fullPath = path.join(targetDir, file);
      const content = await readFile(fullPath, "utf8");
      const name = parseTomlScalar(content, "name", fullPath);
      const model = parseTomlScalar(content, "model", fullPath);
      const reasoning = parseTomlScalar(content, "model_reasoning_effort", fullPath);
      const sandbox = parseTomlScalar(content, "sandbox_mode", fullPath);

      if (model !== EXPECTED_MODEL) fail(`Unexpected model for ${name}: ${model}`);
      if (reasoning !== EXPECTED_REASONING) {
        fail(`Unexpected reasoning effort for ${name}: ${reasoning}`);
      }
      if (!VALID_SANDBOXES.has(sandbox)) fail(`Invalid generated sandbox for ${name}: ${sandbox}`);
      if (sandbox === "workspace-write") workspaceWrite.add(name);
    }

    assertSetEquals(workspaceWrite, EXPECTED_WORKSPACE_WRITE, "workspace-write generated agents");
  } finally {
    await rm(targetDir, { recursive: true, force: true });
  }
}

function assertSetEquals(actual, expected, label) {
  const actualList = [...actual].sort();
  const expectedList = [...expected].sort();
  if (actualList.join("\n") !== expectedList.join("\n")) {
    fail(
      `${label} mismatch. Expected [${expectedList.join(", ")}], got [${actualList.join(", ")}]`,
    );
  }
}

async function main() {
  await assertJsonManifests();
  await assertSkillMetadata();
  await assertAgentSources();
  await assertGeneratedAgents();
  process.stdout.write("Rubber Duck plugin validation passed.\n");
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
