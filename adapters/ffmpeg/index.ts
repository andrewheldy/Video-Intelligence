export type FfmpegOperation =
  | { type: "probe"; inputUri: string }
  | { type: "extract-audio"; inputUri: string; outputUri: string }
  | { type: "normalize-audio"; inputUri: string; outputUri: string; targetLufs: number }
  | { type: "transcode-proxy"; inputUri: string; outputUri: string; maxWidth: number };

export interface FfmpegPlan {
  operations: FfmpegOperation[];
}

/** Describe media work as data. Command construction/execution belongs in the Phase 2 adapter. */
export function createFfmpegPlan(operations: readonly FfmpegOperation[]): FfmpegPlan {
  return { operations: [...operations] };
}

