import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseProjectProfileYaml } from "../core/index.js";

describe("ProjectProfile", () => {
  it("parses YAML and applies conservative defaults", () => {
    const profile = parseProjectProfileYaml(`
version: "1"
brand: test-brand
format:
  primary: "9:16"
  width: 1080
  height: 1920
`);

    assert.equal(profile.format.fps, 30);
    assert.equal(profile.talkingHead.allowSyntheticRepair, false);
    assert.equal(profile.generation.preferRealAssets, true);
    assert.equal(profile.captions.mode, "selective");
  });

  it("rejects unsafe profile limits", () => {
    assert.throws(() =>
      parseProjectProfileYaml(`
version: "1"
brand: test-brand
format:
  primary: "9:16"
  width: 1080
  height: 1920
  safeAreaPercent: 40
`),
    );
  });
});

