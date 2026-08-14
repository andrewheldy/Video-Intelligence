import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { framesToSeconds, millisecondsToFrames, secondsToFrames } from "../core/index.js";

describe("frame utilities", () => {
  it("uses one documented rounding boundary", () => {
    assert.equal(secondsToFrames(1.5, 30), 45);
    assert.equal(millisecondsToFrames(750, 30), 23);
    assert.equal(framesToSeconds(45, 30), 1.5);
  });

  it("rejects invalid time values", () => {
    assert.throws(() => secondsToFrames(-1, 30), RangeError);
    assert.throws(() => framesToSeconds(10, 0), RangeError);
  });
});

