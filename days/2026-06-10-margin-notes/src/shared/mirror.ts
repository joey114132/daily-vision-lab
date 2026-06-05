/**
 * Selfie mirror convention for this repo:
 * - `#video` and `#overlay` use CSS `transform: scaleX(-1)`.
 * - Draw landmarks with RAW normalized x (0–1) × width — CSS handles the flip.
 * - Do NOT use `(1 - x)` on mirrored overlay canvases (double-flip swaps left/right).
 * - Full-screen canvases WITHOUT scaleX(-1) (e.g. sky trails) may use `1 - x` if
 *   aligning to the mirrored video on screen.
 */
export function overlayX(normalizedX: number, width: number): number {
  return normalizedX * width;
}

export function screenXFromMirroredVideo(normalizedX: number, width: number): number {
  return (1 - normalizedX) * width;
}
