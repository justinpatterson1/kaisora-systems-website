import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { INK, SIGNAL } from "@/components/site/wordmark";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_CARD_SERVICES,
  STUDIO_LOCATION,
} from "@/lib/content/profile";
import { PRODUCTION_URL } from "@/lib/site-url";

/**
 * The homepage's social preview: the logo over the tagline, centred, with its
 * last word in the brand purple, on the dark theme's background, grid and
 * glow. Shared by `opengraph-image` and `twitter-image`, and rendered once at
 * build time.
 *
 * Satori only reads TTF/OTF, so the brand fonts are kept as files here rather
 * than taken from next/font. Satori also has no CSS variables, so the dark
 * theme's tokens from globals.css are restated below.
 */

export const BRAND_CARD_SIZE = { width: 1200, height: 630 };

export const BRAND_CARD_ALT = `${SITE_NAME}: ${SITE_TAGLINE}.`;

const COLOR = {
  bg: "#0b0b0f",
  fg: "#ededef",
  fg2: "#a3a6ad",
  fg3: "#8a8f98",
  accent: "#7b2ff7",
  accentText: "#a87bff",
  line: "rgba(255, 255, 255, 0.08)",
  live: "#3dd68c",
};

const fontFile = (name: string) => readFile(join(process.cwd(), "src/lib/og/fonts", name));

/** The Pixel K at any size, from the same grid as the header logo. */
function PixelK({ size }: { size: number }) {
  const unit = size / 19;
  const square = ([column, row]: readonly [number, number], fill: string) => (
    <div
      key={`${column}${row}`}
      style={{
        position: "absolute",
        left: column * 4 * unit,
        top: row * 4 * unit,
        width: 3 * unit,
        height: 3 * unit,
        background: fill,
      }}
    />
  );

  return (
    <div style={{ position: "relative", display: "flex", width: size, height: size }}>
      {INK.map((cell) => square(cell, "#ffffff"))}
      {SIGNAL.map((cell) => square(cell, COLOR.accent))}
    </div>
  );
}

export async function brandCard() {
  const [rethinkBold, monoMedium, monoBold] = await Promise.all([
    fontFile("RethinkSans-Bold.ttf"),
    fontFile("GeistMono-Medium.ttf"),
    fontFile("GeistMono-Bold.ttf"),
  ]);

  /* The last word of the tagline is set in the accent. */
  const lastSpace = SITE_TAGLINE.lastIndexOf(" ");
  const taglineLead = SITE_TAGLINE.slice(0, lastSpace);
  const taglineLast = SITE_TAGLINE.slice(lastSpace + 1);

  const mono = { fontFamily: "Geist Mono", fontWeight: 500, fontSize: 22, color: COLOR.fg3 };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px 56px",
          fontFamily: "Rethink Sans",
          backgroundColor: COLOR.bg,
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(123, 47, 247, 0.3), rgba(123, 47, 247, 0) 55%)," +
            "linear-gradient(rgba(168, 123, 255, 0.07) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(168, 123, 255, 0.07) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <PixelK size={64} />
            <div
              style={{
                fontFamily: "Geist Mono",
                fontWeight: 700,
                fontSize: 40,
                color: COLOR.fg,
                letterSpacing: 6,
              }}
            >
              KAISORA
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontSize: 64,
              fontWeight: 700,
              color: COLOR.fg,
              letterSpacing: -2,
            }}
          >
            {`${taglineLead} `}
            <span style={{ color: COLOR.accentText }}>{`${taglineLast}.`}</span>
          </div>
          <div style={{ ...mono, fontSize: 21, marginTop: 24 }}>
            {SOCIAL_CARD_SERVICES.join(" · ")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${COLOR.line}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: COLOR.live }} />
            <div style={{ ...mono, color: COLOR.fg2 }}>{new URL(PRODUCTION_URL).host}</div>
          </div>
          <div style={{ ...mono, letterSpacing: 1 }}>{STUDIO_LOCATION.toUpperCase()}</div>
        </div>
      </div>
    ),
    {
      ...BRAND_CARD_SIZE,
      fonts: [
        { name: "Rethink Sans", data: rethinkBold, weight: 700, style: "normal" },
        { name: "Geist Mono", data: monoMedium, weight: 500, style: "normal" },
        { name: "Geist Mono", data: monoBold, weight: 700, style: "normal" },
      ],
    },
  );
}
