import { BRAND_CARD_ALT, BRAND_CARD_SIZE, brandCard } from "@/lib/og/brand-card";

/** The homepage's link preview, generated at build time (see brand-card.tsx). */
export const alt = BRAND_CARD_ALT;
export const size = BRAND_CARD_SIZE;
export const contentType = "image/png";

export default function Image() {
  return brandCard();
}
