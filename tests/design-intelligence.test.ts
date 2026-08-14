import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, it } from "node:test";
import { resolveDesignIntelligence } from "../core/index.js";

const execFileAsync = promisify(execFile);
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
});

async function createCheckout(): Promise<{ checkout: string; commit: string }> {
  const checkout = await mkdtemp(path.join(tmpdir(), "video-intelligence-design-"));
  temporaryDirectories.push(checkout);
  await mkdir(path.join(checkout, "docs"));
  await Promise.all([
    writeFile(path.join(checkout, "AGENTS.md"), "rules"),
    writeFile(path.join(checkout, "registry.yaml"), "version: 1"),
    writeFile(path.join(checkout, "docs", "INTEGRATION_CONTRACT.md"), "contract"),
  ]);
  await execFileAsync("git", ["-C", checkout, "init", "--quiet"]);
  await execFileAsync("git", ["-C", checkout, "config", "user.name", "Video Intelligence Tests"]);
  await execFileAsync("git", ["-C", checkout, "config", "user.email", "tests@example.invalid"]);
  await execFileAsync("git", ["-C", checkout, "add", "."]);
  await execFileAsync("git", ["-C", checkout, "commit", "--quiet", "-m", "fixture"]);
  const { stdout } = await execFileAsync("git", ["-C", checkout, "rev-parse", "HEAD"]);
  return { checkout, commit: stdout.trim() };
}

describe("Design Intelligence discovery", () => {
  it("accepts an explicit checkout only at the pinned ref", async () => {
    const { checkout, commit } = await createCheckout();
    const resolution = await resolveDesignIntelligence({
      explicitPath: checkout,
      env: {},
      canonicalRef: commit,
    });

    assert.equal(resolution.status, "available");
    if (resolution.status === "available") {
      assert.equal(resolution.source, "explicit");
      assert.equal(resolution.resolvedCommit, commit);
    }
  });

  it("rejects a valid-looking checkout at the wrong ref", async () => {
    const { checkout } = await createCheckout();
    const resolution = await resolveDesignIntelligence({
      explicitPath: checkout,
      env: {},
      canonicalRef: "0123456789012345678901234567890123456789",
    });

    assert.equal(resolution.status, "unavailable");
  });

  it("fails loudly with the pinned ref", async () => {
    const resolution = await resolveDesignIntelligence({
      env: {},
      workspaceRoots: [],
      canonicalRef: "missing-ref",
    });

    assert.equal(resolution.status, "unavailable");
    if (resolution.status === "unavailable") assert.match(resolution.message, /missing-ref/);
  });
});

