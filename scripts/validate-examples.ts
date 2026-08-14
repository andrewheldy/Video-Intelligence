import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  parseProjectProfileYaml,
  parseVideoSpecYaml,
  validateVideoSpec,
} from "../core/index.js";

const root = process.cwd();
const exampleRoot = path.join(root, "examples", "talking-head-basic");
const [profileYaml, specYaml] = await Promise.all([
  readFile(path.join(exampleRoot, "project-profile.yaml"), "utf8"),
  readFile(path.join(exampleRoot, "video-spec.yaml"), "utf8"),
]);

const profile = parseProjectProfileYaml(profileYaml);
const spec = parseVideoSpecYaml(specYaml);
const issues = validateVideoSpec(spec, profile);
const errors = issues.filter((issue) => issue.severity === "error");

if (errors.length > 0) {
  console.error(JSON.stringify(errors, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Validated talking-head-basic: ${spec.scenes.length} scenes, ${issues.length} issue(s).`);
}

