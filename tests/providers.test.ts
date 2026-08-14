import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compatibleProviders, ProviderDescriptorSchema } from "../providers/index.js";

const providers = [
  {
    id: "video-basic",
    kind: "video" as const,
    capabilities: {
      textToVideo: true,
      imageToVideo: false,
      maxDurationSeconds: 8,
      supportedAspectRatios: ["16:9"],
    },
  },
  {
    id: "video-reference",
    kind: "video" as const,
    capabilities: {
      textToVideo: true,
      imageToVideo: true,
      referenceImages: true,
      maxDurationSeconds: 6,
      supportedAspectRatios: ["9:16", "16:9"],
    },
  },
];

describe("provider contracts", () => {
  it("selects by capability rather than vendor name", () => {
    const compatible = compatibleProviders(providers, {
      kind: "video",
      capabilities: { imageToVideo: true, referenceImages: true },
      durationSeconds: 5,
      aspectRatio: "9:16",
    });

    assert.deepEqual(compatible.map((provider) => provider.id), ["video-reference"]);
  });

  it("rejects invalid capability declarations", () => {
    assert.throws(() =>
      ProviderDescriptorSchema.parse({
        id: "bad",
        kind: "video",
        capabilities: { maxDurationSeconds: -1 },
      }),
    );
  });
});

