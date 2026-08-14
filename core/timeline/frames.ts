export function secondsToFrames(seconds: number, fps: number): number {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new RangeError("seconds must be a finite non-negative number");
  }
  if (!Number.isInteger(fps) || fps <= 0) {
    throw new RangeError("fps must be a positive integer");
  }
  return Math.round(seconds * fps);
}

export function millisecondsToFrames(milliseconds: number, fps: number): number {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    throw new RangeError("milliseconds must be a finite non-negative number");
  }
  return secondsToFrames(milliseconds / 1_000, fps);
}

export function framesToSeconds(frames: number, fps: number): number {
  if (!Number.isInteger(frames) || frames < 0) {
    throw new RangeError("frames must be a non-negative integer");
  }
  if (!Number.isInteger(fps) || fps <= 0) {
    throw new RangeError("fps must be a positive integer");
  }
  return frames / fps;
}

