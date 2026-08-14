import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseVideoSpec, validateVideoSpec } from "../core/index.js";
import { createProfile, createSpec } from "./fixtures.js";

describe("deterministic validation", () => {
  it("accepts the clean fixture", () => {
    assert.deepEqual(validateVideoSpec(createSpec(), createProfile()), []);
  });

  it("reports generated duration and caption readability with stable rule ids", () => {
    const base = createSpec();
    const spec = parseVideoSpec({
      ...base,
      assets: [
        ...base.assets,
        {
          id: "generated-insert",
          type: "video",
          uri: "generated/insert.mp4",
          origin: "generated",
          durationFrames: 210,
          generation: { provider: "fixture-provider" },
        },
      ],
      captions: [
        {
          id: "caption-1",
          startFrame: 0,
          endFrame: 5,
          text: "This caption line is deliberately much longer than the configured maximum.",
        },
      ],
    });

    const ruleIds = validateVideoSpec(spec, createProfile()).map((issue) => issue.ruleId);
    assert.ok(ruleIds.includes("generated-clip-duration"));
    assert.ok(ruleIds.includes("caption-line-length"));
    assert.ok(ruleIds.includes("caption-display-duration"));
  });
});

