import { parseProjectProfile, parseVideoSpec } from "../core/index.js";

export function createProfile(overrides: Record<string, unknown> = {}) {
  return parseProjectProfile({
    version: "1",
    brand: "test-brand",
    format: { primary: "9:16", width: 1080, height: 1920, fps: 30 },
    ...overrides,
  });
}

export function createSpec(overrides: Record<string, unknown> = {}) {
  return parseVideoSpec({
    version: "1",
    metadata: {
      id: "test-video",
      title: "Test video",
      projectId: "test-project",
      createdBy: "tests",
    },
    format: { width: 1080, height: 1920, fps: 30, durationFrames: 300 },
    assets: [
      {
        id: "camera",
        type: "video",
        uri: "fixtures/camera.mp4",
        durationFrames: 300,
        width: 1080,
        height: 1920,
      },
    ],
    scenes: [
      {
        id: "scene-1",
        startFrame: 0,
        durationFrames: 300,
        purpose: "Deliver the test claim.",
        shots: [
          {
            id: "shot-1",
            assetId: "camera",
            startFrame: 0,
            durationFrames: 300,
          },
        ],
      },
    ],
    ...overrides,
  });
}

