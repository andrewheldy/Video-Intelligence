import type { ProjectProfile } from "../schemas/project-profile.js";
import type { VideoSpec } from "../schemas/video-spec.js";
import { framesToSeconds, millisecondsToFrames } from "../timeline/frames.js";

export interface ValidationIssue {
  ruleId: string;
  severity: "warning" | "error";
  path: string;
  message: string;
}

export interface ValidationContext {
  spec: VideoSpec;
  profile: ProjectProfile;
}

export type ValidationRule = (context: ValidationContext) => ValidationIssue[];

export const generatedClipDurationRule: ValidationRule = ({ spec, profile }) =>
  spec.assets.flatMap((asset, index) => {
    if (asset.origin !== "generated" || asset.type !== "video" || !asset.durationFrames) return [];
    const durationSeconds = framesToSeconds(asset.durationFrames, spec.format.fps);
    if (durationSeconds <= profile.generation.maxGeneratedClipSeconds) return [];
    return [
      {
        ruleId: "generated-clip-duration",
        severity: "error" as const,
        path: `assets.${index}.durationFrames`,
        message: `Generated clip is ${durationSeconds.toFixed(2)}s; profile limit is ${profile.generation.maxGeneratedClipSeconds}s.`,
      },
    ];
  });

export const sourceAttributionRule: ValidationRule = ({ spec }) =>
  spec.assets.flatMap((asset, index) => {
    if (asset.origin !== "source" || !/^https?:\/\//.test(asset.uri) || asset.attribution) return [];
    return [
      {
        ruleId: "source-attribution",
        severity: "warning" as const,
        path: `assets.${index}.attribution`,
        message: "Remote source asset is missing attribution.",
      },
    ];
  });

export const assetAspectRatioRule: ValidationRule = ({ spec }) =>
  spec.assets.flatMap((asset, index) => {
    if (!asset.width || !asset.height || asset.type === "audio") return [];
    const assetRatio = asset.width / asset.height;
    const outputRatio = spec.format.width / spec.format.height;
    const difference = Math.abs(assetRatio - outputRatio) / outputRatio;
    if (difference <= 0.02) return [];
    return [
      {
        ruleId: "asset-aspect-ratio",
        severity: "warning" as const,
        path: `assets.${index}`,
        message: "Asset aspect ratio differs from output; verify the declared crop/contain treatment.",
      },
    ];
  });

export const captionReadabilityRule: ValidationRule = ({ spec, profile }) => {
  const minimumFrames = millisecondsToFrames(profile.captions.minimumDisplayMs, spec.format.fps);
  return spec.captions.flatMap((caption, index) => {
    const issues: ValidationIssue[] = [];
    const lines = caption.text.split("\n");
    if (lines.length > profile.captions.maxLines) {
      issues.push({
        ruleId: "caption-line-count",
        severity: "error",
        path: `captions.${index}.text`,
        message: `Caption has ${lines.length} lines; profile limit is ${profile.captions.maxLines}.`,
      });
    }
    if (lines.some((line) => line.length > profile.captions.maxCharactersPerLine)) {
      issues.push({
        ruleId: "caption-line-length",
        severity: "warning",
        path: `captions.${index}.text`,
        message: `Caption exceeds ${profile.captions.maxCharactersPerLine} characters on a line.`,
      });
    }
    if (caption.endFrame - caption.startFrame < minimumFrames) {
      issues.push({
        ruleId: "caption-display-duration",
        severity: "error",
        path: `captions.${index}`,
        message: `Caption displays for fewer than ${profile.captions.minimumDisplayMs}ms.`,
      });
    }
    return issues;
  });
};

export const shotDurationRule: ValidationRule = ({ spec, profile }) =>
  spec.scenes.flatMap((scene, sceneIndex) =>
    scene.shots.flatMap((shot, shotIndex) =>
      shot.durationFrames < profile.editing.minimumShotFrames
        ? [
            {
              ruleId: "minimum-shot-duration",
              severity: "warning" as const,
              path: `scenes.${sceneIndex}.shots.${shotIndex}.durationFrames`,
              message: `Shot is shorter than the profile minimum of ${profile.editing.minimumShotFrames} frames.`,
            },
          ]
        : [],
    ),
  );

export const sceneOverlapRule: ValidationRule = ({ spec }) => {
  const ordered = spec.scenes
    .map((scene, index) => ({ ...scene, index }))
    .sort((a, b) => a.startFrame - b.startFrame);
  const issues: ValidationIssue[] = [];
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = ordered[index - 1];
    const current = ordered[index];
    if (previous && current && previous.startFrame + previous.durationFrames > current.startFrame) {
      issues.push({
        ruleId: "scene-overlap",
        severity: "error",
        path: `scenes.${current.index}.startFrame`,
        message: `Scene overlaps ${previous.id}; transitions belong inside scene boundaries.`,
      });
    }
  }
  return issues;
};

export const visualDensityRule: ValidationRule = ({ spec, profile }) =>
  spec.scenes.flatMap((scene, sceneIndex) => {
    const events = scene.graphics.flatMap((graphic) => [
      { frame: graphic.startFrame, delta: 1 },
      { frame: graphic.startFrame + graphic.durationFrames, delta: -1 },
    ]);
    events.sort((a, b) => a.frame - b.frame || a.delta - b.delta);
    let active = 0;
    let peak = 0;
    for (const event of events) {
      active += event.delta;
      peak = Math.max(peak, active);
    }
    return peak > profile.graphics.maxConcurrent
      ? [
          {
            ruleId: "visual-density",
            severity: "warning" as const,
            path: `scenes.${sceneIndex}.graphics`,
            message: `${peak} graphics overlap; profile limit is ${profile.graphics.maxConcurrent} before renderer-level collision review.`,
          },
        ]
      : [];
  });

export const builtInValidationRules: readonly ValidationRule[] = [
  generatedClipDurationRule,
  sourceAttributionRule,
  assetAspectRatioRule,
  captionReadabilityRule,
  shotDurationRule,
  sceneOverlapRule,
  visualDensityRule,
];

export function validateVideoSpec(
  spec: VideoSpec,
  profile: ProjectProfile,
  rules: readonly ValidationRule[] = builtInValidationRules,
): ValidationIssue[] {
  return rules.flatMap((rule) => rule({ spec, profile }));
}
