import type { ProjectProfile, VideoSpec } from "../core/index.js";

export interface RenderRequest {
  spec: VideoSpec;
  profile: ProjectProfile;
  outputUri: string;
}

export interface RenderResult {
  renderId: string;
  outputUri: string;
  durationFrames: number;
  specFingerprint: string;
}

export interface RendererAdapter {
  readonly id: string;
  validate(request: RenderRequest): Promise<void>;
  render(request: RenderRequest): Promise<RenderResult>;
}

