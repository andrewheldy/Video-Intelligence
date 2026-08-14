import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createFfmpegPlan, toRemotionCompositionInput } from "../adapters/index.js";
import { createProfile, createSpec } from "./fixtures.js";

describe("adapter boundaries", () => {
  it("maps core format data to Remotion input without a Remotion dependency", () => {
    const request = { spec: createSpec(), profile: createProfile(), outputUri: "renders/test.mp4" };
    const input = toRemotionCompositionInput(request);

    assert.equal(input.compositionId, "test-video");
    assert.equal(input.durationInFrames, 300);
    assert.equal(input.defaultProps, request);
  });

  it("keeps FFmpeg work declarative", () => {
    assert.deepEqual(createFfmpegPlan([{ type: "probe", inputUri: "input.mp4" }]), {
      operations: [{ type: "probe", inputUri: "input.mp4" }],
    });
  });
});

