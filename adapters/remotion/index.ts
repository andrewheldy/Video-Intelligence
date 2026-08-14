import type { RenderRequest } from "../contracts.js";

export interface RemotionCompositionInput {
  compositionId: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  defaultProps: RenderRequest;
}

/** Convert the domain request into Remotion composition input without importing Remotion. */
export function toRemotionCompositionInput(request: RenderRequest): RemotionCompositionInput {
  return {
    compositionId: request.spec.metadata.id,
    width: request.spec.format.width,
    height: request.spec.format.height,
    fps: request.spec.format.fps,
    durationInFrames: request.spec.format.durationFrames,
    defaultProps: request,
  };
}

