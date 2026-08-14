import { parse as parseYaml } from "yaml";
import { z } from "zod";

const id = z.string().regex(/^[a-z0-9][a-z0-9._-]*$/i);
const frame = z.number().int().nonnegative();
const positiveFrames = z.number().int().positive();

export const AssetSchema = z
  .object({
    id,
    type: z.enum(["video", "audio", "image"]),
    uri: z.string().min(1),
    origin: z.enum(["source", "generated"]).default("source"),
    durationFrames: positiveFrames.optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    attribution: z.string().min(1).optional(),
    generation: z
      .object({
        provider: z.string().min(1),
        taskId: z.string().min(1).optional(),
        promptRef: z.string().min(1).optional(),
        disclosureRequired: z.boolean().default(true),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((asset, context) => {
    if (asset.origin === "generated" && !asset.generation) {
      context.addIssue({
        code: "custom",
        path: ["generation"],
        message: "generated assets require generation provenance",
      });
    }
    if (asset.origin === "source" && asset.generation) {
      context.addIssue({
        code: "custom",
        path: ["generation"],
        message: "source assets cannot include generation provenance",
      });
    }
  });

export const ShotSchema = z
  .object({
    id,
    assetId: id,
    startFrame: frame,
    durationFrames: positiveFrames,
    sourceStartFrame: frame.default(0),
    fit: z.enum(["cover", "contain"]).default("cover"),
    role: z.enum(["primary", "broll", "insert", "repair"]).default("primary"),
  })
  .strict();

export const GraphicSchema = z
  .object({
    id,
    type: z.enum(["title", "lower-third", "callout", "chart", "diagram", "map", "custom"]),
    startFrame: frame,
    durationFrames: positiveFrames,
    text: z.string().min(1).optional(),
    dataRef: z.string().min(1).optional(),
    safeArea: z.boolean().default(true),
  })
  .strict()
  .refine((graphic) => graphic.text || graphic.dataRef, {
    message: "a graphic requires text or dataRef",
  });

export const TransitionSchema = z
  .object({
    type: z.enum(["cut", "crossfade", "wipe", "custom"]),
    durationFrames: frame,
    preset: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((transition, context) => {
    if (transition.type === "cut" && transition.durationFrames !== 0) {
      context.addIssue({
        code: "custom",
        path: ["durationFrames"],
        message: "cut transitions must have zero duration",
      });
    }
    if (transition.type !== "cut" && transition.durationFrames === 0) {
      context.addIssue({
        code: "custom",
        path: ["durationFrames"],
        message: "non-cut transitions require a positive duration",
      });
    }
  });

export const SceneSchema = z
  .object({
    id,
    startFrame: frame,
    durationFrames: positiveFrames,
    purpose: z.string().min(1),
    shots: z.array(ShotSchema).default([]),
    graphics: z.array(GraphicSchema).default([]),
    transitionOut: TransitionSchema.optional(),
  })
  .strict();

export const AudioTrackSchema = z
  .object({
    id,
    kind: z.enum(["dialogue", "narration", "music", "ambience", "effect"]),
    assetId: id,
    startFrame: frame,
    durationFrames: positiveFrames,
    sourceStartFrame: frame.default(0),
    gainDb: z.number().min(-96).max(24).default(0),
  })
  .strict();

export const CaptionSchema = z
  .object({
    id,
    startFrame: frame,
    endFrame: positiveFrames,
    text: z.string().trim().min(1),
    speaker: z.string().min(1).optional(),
    emphasis: z.array(z.string().min(1)).default([]),
  })
  .strict()
  .refine((caption) => caption.endFrame > caption.startFrame, {
    path: ["endFrame"],
    message: "endFrame must be after startFrame",
  });

export const EditDecisionSchema = z
  .object({
    id,
    sceneIds: z.array(id).min(1),
    decision: z.string().min(1),
    rationale: z.string().min(1),
    source: z.enum(["human", "model", "rule"]),
  })
  .strict();

export const ReviewIssueSchema = z
  .object({
    id,
    severity: z.enum(["info", "warning", "error"]),
    code: id,
    message: z.string().min(1),
    startFrame: frame.optional(),
    endFrame: positiveFrames.optional(),
    source: z.enum(["validation", "human", "model"]),
  })
  .strict();

export const RenderSchema = z
  .object({
    id,
    adapter: z.string().min(1),
    status: z.enum(["planned", "running", "succeeded", "failed"]),
    outputUri: z.string().min(1).optional(),
    specFingerprint: z.string().min(1),
  })
  .strict();

export const VideoSpecSchema = z
  .object({
    version: z.literal("1"),
    metadata: z
      .object({
        id,
        title: z.string().min(1),
        projectId: id,
        createdBy: z.string().min(1),
      })
      .strict(),
    format: z
      .object({
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        fps: z.number().int().min(1).max(120),
        durationFrames: positiveFrames,
      })
      .strict(),
    assets: z.array(AssetSchema),
    scenes: z.array(SceneSchema).min(1),
    audioTracks: z.array(AudioTrackSchema).default([]),
    captions: z.array(CaptionSchema).default([]),
    editDecisions: z.array(EditDecisionSchema).default([]),
    reviewIssues: z.array(ReviewIssueSchema).default([]),
    renders: z.array(RenderSchema).default([]),
  })
  .strict()
  .superRefine((spec, context) => {
    const assetsById = new Map(spec.assets.map((asset) => [asset.id, asset]));
    const sceneIds = new Set(spec.scenes.map((scene) => scene.id));
    const allIds = [
      ...spec.assets.map((item) => item.id),
      ...spec.scenes.map((item) => item.id),
      ...spec.scenes.flatMap((scene) => scene.shots.map((item) => item.id)),
      ...spec.scenes.flatMap((scene) => scene.graphics.map((item) => item.id)),
      ...spec.audioTracks.map((item) => item.id),
      ...spec.captions.map((item) => item.id),
      ...spec.editDecisions.map((item) => item.id),
      ...spec.reviewIssues.map((item) => item.id),
      ...spec.renders.map((item) => item.id),
    ];

    if (new Set(allIds).size !== allIds.length) {
      context.addIssue({ code: "custom", path: [], message: "all entity ids must be unique" });
    }

    spec.scenes.forEach((scene, sceneIndex) => {
      if (scene.startFrame + scene.durationFrames > spec.format.durationFrames) {
        context.addIssue({
          code: "custom",
          path: ["scenes", sceneIndex],
          message: "scene exceeds the video duration",
        });
      }
      scene.shots.forEach((shot, shotIndex) => {
        const asset = assetsById.get(shot.assetId);
        if (!asset) {
          context.addIssue({
            code: "custom",
            path: ["scenes", sceneIndex, "shots", shotIndex, "assetId"],
            message: `unknown asset: ${shot.assetId}`,
          });
        } else {
          if (asset.type === "audio") {
            context.addIssue({
              code: "custom",
              path: ["scenes", sceneIndex, "shots", shotIndex, "assetId"],
              message: "shots require a video or image asset",
            });
          }
          if (
            asset.durationFrames !== undefined &&
            shot.sourceStartFrame + shot.durationFrames > asset.durationFrames
          ) {
            context.addIssue({
              code: "custom",
              path: ["scenes", sceneIndex, "shots", shotIndex],
              message: "shot exceeds its source asset duration",
            });
          }
        }
        if (shot.startFrame + shot.durationFrames > scene.durationFrames) {
          context.addIssue({
            code: "custom",
            path: ["scenes", sceneIndex, "shots", shotIndex],
            message: "shot exceeds its scene duration",
          });
        }
      });
      scene.graphics.forEach((graphic, graphicIndex) => {
        if (graphic.startFrame + graphic.durationFrames > scene.durationFrames) {
          context.addIssue({
            code: "custom",
            path: ["scenes", sceneIndex, "graphics", graphicIndex],
            message: "graphic exceeds its scene duration",
          });
        }
      });
    });

    spec.audioTracks.forEach((track, index) => {
      const asset = assetsById.get(track.assetId);
      if (!asset) {
        context.addIssue({
          code: "custom",
          path: ["audioTracks", index, "assetId"],
          message: `unknown asset: ${track.assetId}`,
        });
      } else {
        if (asset.type === "image") {
          context.addIssue({
            code: "custom",
            path: ["audioTracks", index, "assetId"],
            message: "audio tracks require an audio or video asset",
          });
        }
        if (
          asset.durationFrames !== undefined &&
          track.sourceStartFrame + track.durationFrames > asset.durationFrames
        ) {
          context.addIssue({
            code: "custom",
            path: ["audioTracks", index],
            message: "audio track exceeds its source asset duration",
          });
        }
      }
      if (track.startFrame + track.durationFrames > spec.format.durationFrames) {
        context.addIssue({
          code: "custom",
          path: ["audioTracks", index],
          message: "audio track exceeds the video duration",
        });
      }
    });

    spec.captions.forEach((caption, index) => {
      if (caption.endFrame > spec.format.durationFrames) {
        context.addIssue({
          code: "custom",
          path: ["captions", index, "endFrame"],
          message: "caption exceeds the video duration",
        });
      }
    });

    spec.editDecisions.forEach((decision, decisionIndex) => {
      decision.sceneIds.forEach((sceneId, sceneIndex) => {
        if (!sceneIds.has(sceneId)) {
          context.addIssue({
            code: "custom",
            path: ["editDecisions", decisionIndex, "sceneIds", sceneIndex],
            message: `unknown scene: ${sceneId}`,
          });
        }
      });
    });
  });

export type VideoSpec = z.infer<typeof VideoSpecSchema>;
export type Asset = z.infer<typeof AssetSchema>;
export type SceneSpec = z.infer<typeof SceneSchema>;
export type ShotSpec = z.infer<typeof ShotSchema>;
export type ReviewIssue = z.infer<typeof ReviewIssueSchema>;

export function parseVideoSpec(input: unknown): VideoSpec {
  return VideoSpecSchema.parse(input);
}

export function parseVideoSpecYaml(input: string): VideoSpec {
  return parseVideoSpec(parseYaml(input));
}
