#!/usr/bin/env node

import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const EXPECTED_MODEL = "gpt-5.5";
const EXPECTED_REASONING = "medium";
const EXPECTED_AGENT_NAMES = [
  "agent-packaging-reviewer",
  "code-security-reviewer",
  "code-staff-engineer-reviewer",
  "codebase-analyzer",
  "codebase-locator",
  "codebase-pattern-finder",
  "codebase-researcher",
  "diagnosis-root-cause-investigator",
  "docs-analyzer",
  "docs-locator",
  "document-reviewer",
  "frontend-accessibility-reviewer",
  "frontend-ux-ui-reviewer",
  "frontend-ux-writing-reviewer",
  "implementation-agent",
  "implementation-plan-matcher",
  "plan-future-maintainer",
  "plan-security-reviewer",
  "plan-staff-engineer",
  "prd-product-reviewer",
  "project-patterns-reviewer",
  "shipping-hygiene-reviewer",
  "skill-eval-analyzer",
  "skill-eval-comparator",
  "skill-eval-executor",
  "skill-eval-grader",
  "test-implementer",
  "test-plan-architect",
  "test-reviewer",
];
const EXPECTED_AGENT_COUNT = EXPECTED_AGENT_NAMES.length;
const AGENT_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUIRED_AGENT_FIELDS = ["name", "description", "model", "tools", "color", "sandbox"];
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
  const expectedMarkdownFiles = EXPECTED_AGENT_NAMES.map((name) => `${name}.md`);
  assertArrayEquals(rootAgents, expectedMarkdownFiles, "root agent files");
  assertArrayEquals(bundledAgents, expectedMarkdownFiles, "bundled source agent files");
  if (bundledAgents.length !== rootAgents.length) {
    fail(`Root/source agent count mismatch: ${rootAgents.length} vs ${bundledAgents.length}`);
  }
  if (rootAgents.join("\n") !== bundledAgents.join("\n")) {
    fail("Root/source agent filename sets differ");
  }

  const workspaceWrite = new Set();
  const names = new Set();
  for (const agentFile of rootAgents) {
    const rootPath = path.join(rootAgentsDir, agentFile);
    const bundledPath = path.join(bundledAgentsDir, agentFile);
    const rootContent = await readFile(rootPath, "utf8");
    const bundledContent = await readFile(bundledPath, "utf8");
    if (rootContent !== bundledContent) fail(`Bundled source differs: ${agentFile}`);

    const fields = parseFrontmatter(rootContent, rootPath);
    for (const field of REQUIRED_AGENT_FIELDS) {
      if (!fields[field]) fail(`Missing agent ${field}: ${rootPath}`);
    }
    if (!AGENT_NAME_PATTERN.test(fields.name)) {
      fail(`Invalid agent name ${fields.name}: ${rootPath}`);
    }
    const expectedName = path.basename(agentFile, ".md");
    if (fields.name !== expectedName) {
      fail(`Agent name ${fields.name} does not match filename ${expectedName}: ${rootPath}`);
    }
    if (names.has(fields.name)) fail(`Duplicate agent name: ${fields.name}`);
    names.add(fields.name);
    const sandbox = fields.sandbox;
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
    const expectedTomlFiles = EXPECTED_AGENT_NAMES.map((name) => `${name}.toml`);
    assertArrayEquals(generated, expectedTomlFiles, "generated TOML files");

    const workspaceWrite = new Set();
    const names = new Set();
    for (const file of generated) {
      const fullPath = path.join(targetDir, file);
      const content = await readFile(fullPath, "utf8");
      const name = parseTomlScalar(content, "name", fullPath);
      const model = parseTomlScalar(content, "model", fullPath);
      const reasoning = parseTomlScalar(content, "model_reasoning_effort", fullPath);
      const sandbox = parseTomlScalar(content, "sandbox_mode", fullPath);

      if (!content.includes("# Source tools: ")) {
        fail(`Missing source tools comment in generated agent: ${fullPath}`);
      }
      const expectedName = path.basename(file, ".toml");
      if (name !== expectedName) {
        fail(`Generated agent name ${name} does not match filename ${expectedName}: ${fullPath}`);
      }
      if (names.has(name)) fail(`Duplicate generated agent name: ${name}`);
      names.add(name);
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

function assertArrayEquals(actual, expected, label) {
  if (actual.join("\n") !== expected.join("\n")) {
    fail(
      `${label} mismatch. Expected [${expected.join(", ")}], got [${actual.join(", ")}]`,
    );
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
