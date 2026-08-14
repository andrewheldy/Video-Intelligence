import { z } from "zod";

export const ProviderKindSchema = z.enum(["voice", "image", "video", "lip-sync", "video-review"]);
export type ProviderKind = z.infer<typeof ProviderKindSchema>;

export const ProviderDescriptorSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9][a-z0-9._-]*$/i),
    kind: ProviderKindSchema,
    capabilities: z
      .object({
        textToSpeech: z.boolean().default(false),
        textToImage: z.boolean().default(false),
        textToVideo: z.boolean().default(false),
        imageToVideo: z.boolean().default(false),
        referenceImages: z.boolean().default(false),
        lipSync: z.boolean().default(false),
        structuredReview: z.boolean().default(false),
        maxDurationSeconds: z.number().positive().optional(),
        supportedAspectRatios: z.array(z.string().min(1)).default([]),
      })
      .strict(),
  })
  .strict();

export type ProviderDescriptor = z.infer<typeof ProviderDescriptorSchema>;
export type ProviderCapabilities = ProviderDescriptor["capabilities"];

export interface ProviderRequestContext {
  projectId: string;
  idempotencyKey: string;
  abortSignal?: AbortSignal;
}

export interface ProviderResult {
  providerId: string;
  taskId: string;
  uri: string;
  metadata: Record<string, unknown>;
}

export interface VoiceProvider {
  descriptor: ProviderDescriptor & { kind: "voice" };
  synthesize(text: string, context: ProviderRequestContext): Promise<ProviderResult>;
}

export interface ImageGenerationProvider {
  descriptor: ProviderDescriptor & { kind: "image" };
  generate(prompt: string, context: ProviderRequestContext): Promise<ProviderResult>;
}

export interface VideoGenerationProvider {
  descriptor: ProviderDescriptor & { kind: "video" };
  generate(
    input: { prompt: string; imageUri?: string; durationSeconds: number; aspectRatio: string },
    context: ProviderRequestContext,
  ): Promise<ProviderResult>;
}

export interface LipSyncProvider {
  descriptor: ProviderDescriptor & { kind: "lip-sync" };
  repair(
    input: { videoUri: string; audioUri: string; startSeconds: number; endSeconds: number },
    context: ProviderRequestContext,
  ): Promise<ProviderResult>;
}

export interface VideoReviewProvider {
  descriptor: ProviderDescriptor & { kind: "video-review" };
  review(
    input: { videoUri: string; specification: unknown },
    context: ProviderRequestContext,
  ): Promise<{ taskId: string; issues: unknown[] }>;
}

export interface ProviderRequirements {
  kind: ProviderKind;
  capabilities?: Partial<
    Record<
      | "textToSpeech"
      | "textToImage"
      | "textToVideo"
      | "imageToVideo"
      | "referenceImages"
      | "lipSync"
      | "structuredReview",
      true
    >
  >;
  durationSeconds?: number;
  aspectRatio?: string;
}

/** Return compatible providers in stable id order; routing policy may rank this shortlist later. */
export function compatibleProviders(
  providers: readonly unknown[],
  requirements: ProviderRequirements,
): ProviderDescriptor[] {
  return providers
    .map((provider) => ProviderDescriptorSchema.parse(provider))
    .filter((provider) => {
      if (provider.kind !== requirements.kind) return false;
      for (const [capability, required] of Object.entries(requirements.capabilities ?? {})) {
        if (required === true && provider.capabilities[capability as keyof ProviderCapabilities] !== true) {
          return false;
        }
      }
      if (
        requirements.durationSeconds !== undefined &&
        provider.capabilities.maxDurationSeconds !== undefined &&
        provider.capabilities.maxDurationSeconds < requirements.durationSeconds
      ) {
        return false;
      }
      if (
        requirements.aspectRatio &&
        provider.capabilities.supportedAspectRatios.length > 0 &&
        !provider.capabilities.supportedAspectRatios.includes(requirements.aspectRatio)
      ) {
        return false;
      }
      return true;
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}
