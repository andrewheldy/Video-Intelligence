import { parse as parseYaml } from "yaml";
import { z } from "zod";

export const ProjectProfileSchema = z
  .object({
    version: z.literal("1"),
    brand: z.string().min(1),
    format: z
      .object({
        primary: z.enum(["9:16", "16:9", "1:1", "4:5"]),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        fps: z.number().int().min(1).max(120).default(30),
        safeAreaPercent: z.number().min(0).max(25).default(5),
      })
      .strict(),
    editing: z
      .object({
        visualInterruptSeconds: z.number().positive().max(60).default(6),
        removeSilenceOverMs: z.number().int().nonnegative().default(350),
        minimumShotFrames: z.number().int().positive().default(6),
      })
      .strict()
      .default({
        visualInterruptSeconds: 6,
        removeSilenceOverMs: 350,
        minimumShotFrames: 6,
      }),
    talkingHead: z
      .object({
        maxPunchIn: z.number().min(1).max(1.25).default(1.06),
        allowSyntheticRepair: z.boolean().default(false),
      })
      .strict()
      .default({ maxPunchIn: 1.06, allowSyntheticRepair: false }),
    captions: z
      .object({
        mode: z.enum(["off", "selective", "verbatim"]).default("selective"),
        maxCharactersPerLine: z.number().int().min(10).max(64).default(32),
        maxLines: z.number().int().min(1).max(3).default(2),
        minimumDisplayMs: z.number().int().min(100).default(700),
      })
      .strict()
      .default({
        mode: "selective",
        maxCharactersPerLine: 32,
        maxLines: 2,
        minimumDisplayMs: 700,
      }),
    motion: z
      .object({
        intensity: z.enum(["none", "restrained", "expressive"]).default("restrained"),
        reducedMotionStrategy: z
          .enum(["remove", "replace", "retain-essential-only"])
          .default("retain-essential-only"),
      })
      .strict()
      .default({ intensity: "restrained", reducedMotionStrategy: "retain-essential-only" }),
    graphics: z
      .object({
        maxConcurrent: z.number().int().min(1).max(10).default(3),
      })
      .strict()
      .default({ maxConcurrent: 3 }),
    generation: z
      .object({
        preferRealAssets: z.boolean().default(true),
        imageBeforeVideo: z.boolean().default(true),
        maxGeneratedClipSeconds: z.number().positive().max(30).default(6),
      })
      .strict()
      .default({
        preferRealAssets: true,
        imageBeforeVideo: true,
        maxGeneratedClipSeconds: 6,
      }),
    avoid: z.array(z.string().min(1)).default([]),
  })
  .strict();

export type ProjectProfile = z.infer<typeof ProjectProfileSchema>;

export function parseProjectProfile(input: unknown): ProjectProfile {
  return ProjectProfileSchema.parse(input);
}

export function parseProjectProfileYaml(input: string): ProjectProfile {
  return parseProjectProfile(parseYaml(input));
}
