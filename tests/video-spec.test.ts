import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseVideoSpec } from "../core/index.js";
import { createSpec } from "./fixtures.js";

describe("VideoSpec", () => {
  it("parses a minimal renderer-independent spec and applies defaults", () => {
    const spec = createSpec();

    assert.equal(spec.version, "1");
    assert.equal(spec.scenes[0]?.shots[0]?.sourceStartFrame, 0);
    assert.deepEqual(spec.audioTracks, []);
  });

  it("rejects references to unknown assets", () => {
    assert.throws(
      () =>
        parseVideoSpec({
          ...createSpec(),
          scenes: [
            {
              id: "scene-1",
              startFrame: 0,
              durationFrames: 300,
              purpose: "Invalid reference",
              shots: [
                { id: "shot-1", assetId: "missing", startFrame: 0, durationFrames: 30 },
              ],
            },
          ],
        }),
      /unknown asset/,
    );
  });

  it("rejects duplicate entity ids", () => {
    const spec = createSpec();
    assert.throws(
      () =>
        parseVideoSpec({
          ...spec,
          captions: [{ id: "camera", startFrame: 0, endFrame: 30, text: "Duplicate id" }],
        }),
      /unique/,
    );
  });
});

