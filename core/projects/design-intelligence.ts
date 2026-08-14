import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const REQUIRED_FILES = ["AGENTS.md", "docs/INTEGRATION_CONTRACT.md", "registry.yaml"] as const;
const execFileAsync = promisify(execFile);

export interface DesignIntelligenceResolutionOptions {
  explicitPath?: string;
  env?: NodeJS.ProcessEnv;
  envVariable?: string;
  workspaceRoots?: readonly string[];
  canonicalRef: string;
}

export type DesignIntelligenceResolution =
  | {
      status: "available";
      checkoutPath: string;
      source: "explicit" | "environment" | "workspace";
      canonicalRef: string;
      resolvedCommit: string;
    }
  | {
      status: "unavailable";
      canonicalRef: string;
      attempted: string[];
      message: string;
    };

async function isCheckout(candidate: string): Promise<boolean> {
  try {
    await Promise.all(
      REQUIRED_FILES.map((relativePath) =>
        access(path.join(candidate, relativePath), constants.R_OK),
      ),
    );
    return true;
  } catch {
    return false;
  }
}

async function resolvesToCurrentHead(candidate: string, canonicalRef: string): Promise<string | null> {
  try {
    const [headResult, refResult] = await Promise.all([
      execFileAsync("git", ["-C", candidate, "rev-parse", "HEAD"]),
      execFileAsync("git", ["-C", candidate, "rev-parse", `${canonicalRef}^{commit}`]),
    ]);
    const head = headResult.stdout.trim();
    return head === refResult.stdout.trim() ? head : null;
  } catch {
    return null;
  }
}

/** Locate an operator-provided checkout without guessing a machine-specific path. */
export async function resolveDesignIntelligence(
  options: DesignIntelligenceResolutionOptions,
): Promise<DesignIntelligenceResolution> {
  const envVariable = options.envVariable ?? "DESIGN_INTELLIGENCE_PATH";
  const env = options.env ?? process.env;
  const candidates: Array<{
    candidate: string;
    source: "explicit" | "environment" | "workspace";
  }> = [];

  if (options.explicitPath) {
    candidates.push({ candidate: options.explicitPath, source: "explicit" });
  }
  if (env[envVariable]) {
    candidates.push({ candidate: env[envVariable], source: "environment" });
  }
  for (const root of options.workspaceRoots ?? []) {
    candidates.push({ candidate: root, source: "workspace" });
  }

  const attempted: string[] = [];
  for (const { candidate, source } of candidates) {
    const checkoutPath = path.resolve(candidate);
    if (attempted.includes(checkoutPath)) continue;
    attempted.push(checkoutPath);
    if (await isCheckout(checkoutPath)) {
      const resolvedCommit = await resolvesToCurrentHead(checkoutPath, options.canonicalRef);
      if (resolvedCommit) {
        return {
          status: "available",
          checkoutPath,
          source,
          canonicalRef: options.canonicalRef,
          resolvedCommit,
        };
      }
    }
  }

  return {
    status: "unavailable",
    canonicalRef: options.canonicalRef,
    attempted,
    message: `Design Intelligence could not be resolved at pinned ref ${options.canonicalRef}; candidates must be Git checkouts with that ref at HEAD. Treat design output as an unverified loadout.`,
  };
}
