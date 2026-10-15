import Link from "next/link";

import { SITE_NAME } from "@/lib/content/profile";

/** The Pixel K: a 5 × 5 grid, pitch 4, squares 3. Stem and arm in ink, the
    diagonal in brand purple (see brand/kaisora-pixel-k-sheet.png). */
export const INK = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 2]] as const;
export const SIGNAL = [[2, 2], [3, 1], [4, 0], [3, 3], [4, 4]] as const;

export function PixelK({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 19 19" shapeRendering="crispEdges" className={className} aria-hidden>
      {INK.map(([c, r]) => (
        <rect key={`i${c}${r}`} x={c * 4} y={r * 4} width={3} height={3} className="pk-ink" />
      ))}
      {SIGNAL.map(([c, r]) => (
        <rect key={`s${c}${r}`} x={c * 4} y={r * 4} width={3} height={3} className="pk-signal" />
      ))}
    </svg>
  );
}

/** The Kaisora logo: the Pixel K beside the KAISORA wordmark. */
export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label={`${SITE_NAME}, home`}>
      <PixelK className="wordmark-mark" />
      <span className="wordmark-text">Kaisora</span>
    </Link>
  );
}
