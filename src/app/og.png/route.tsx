import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/data";

// The link-preview card shown by LinkedIn, Slack, Teams, iMessage, email, etc.
// A route named og.png so the static export writes a real /og.png file (static hosts pick
// the content type from the extension). Rendered once at build time, 1200×630.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const og = (file: string) => readFile(join(process.cwd(), "src/og", file));

export async function GET() {
  const [sans400, sans600, serifItalic, portrait] = await Promise.all([
    og("InterTight-400.woff"),
    og("InterTight-600.woff"),
    og("InstrumentSerif-Italic.woff"),
    og("portrait.png"),
  ]);
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f4f2ee",
          color: "#0d0d0d",
          fontFamily: "Inter Tight",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#6b6964" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "#0d0d0d",
                color: "#f4f2ee",
                fontSize: 15,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              PR
            </div>
            {site || "Portfolio"}
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>{PROFILE.name}</div>
            <div
              style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 92, lineHeight: 1.05, marginTop: 4 }}
            >
              {PROFILE.headline}
            </div>
            <div style={{ fontSize: 23, color: "#6b6964", marginTop: 28, lineHeight: 1.4 }}>
              10+ years · Playwright · Cypress · Selenium · AI-assisted testing
            </div>
          </div>
        </div>

        <div
          style={{
            width: 380,
            height: 502,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "#ffffff",
            borderRadius: 28,
            border: "1px solid rgba(13,13,13,0.1)",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- decorative portrait inside a generated image, not page markup */}
          <img
            src={`data:image/png;base64,${portrait.toString("base64")}`}
            width={380}
            height={456}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter Tight", data: sans400, weight: 400, style: "normal" },
        { name: "Inter Tight", data: sans600, weight: 600, style: "normal" },
        { name: "Instrument Serif", data: serifItalic, weight: 400, style: "italic" },
      ],
    },
  );
}
