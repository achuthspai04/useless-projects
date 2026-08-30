import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const socialImageSize = { width: 1200, height: 630 };
export const socialImageAlt = "Useless Projects 3.0 — TinkerHub";

export async function renderSocialImage() {
  const [drowner, helvetica, helveticaBold, nanumPen] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/Drowner.otf")),
    readFile(join(process.cwd(), "src/fonts/Helvetica.ttf")),
    readFile(join(process.cwd(), "src/fonts/Helvetica-Bold.ttf")),
    readFile(join(process.cwd(), "src/fonts/NanumPenScript-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#06C3FB",
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, color: "#141414" }}>
            <span style={{ fontFamily: "Helvetica-Bold" }}>Tinker</span>
            <span style={{ fontFamily: "Helvetica" }}>Hub</span>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Drowner",
              fontSize: 56,
              color: "#FCFBB9",
            }}
          >
            3.0
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Drowner",
              fontSize: 148,
              lineHeight: 1,
              color: "#FCFBB9",
            }}
          >
            Useless
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Drowner",
              fontSize: 148,
              lineHeight: 1,
              color: "#FCFBB9",
              marginTop: 4,
            }}
          >
            Projects
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 26,
              color: "#141414",
              fontFamily: "Helvetica",
            }}
          >
            <span>an overnight make-a-thon for brilliantly impractical tech&nbsp;</span>
            <span style={{ fontFamily: "NanumPenScript", fontSize: 34 }}>
              — why not?
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#141414",
              color: "#ffffff",
              borderRadius: 999,
              padding: "14px 34px",
              fontFamily: "NanumPenScript",
              fontSize: 30,
            }}
          >
            register here →
          </div>
        </div>
      </div>
    ),
    {
      ...socialImageSize,
      fonts: [
        { name: "Drowner", data: drowner, style: "normal", weight: 400 },
        { name: "Helvetica", data: helvetica, style: "normal", weight: 400 },
        { name: "Helvetica-Bold", data: helveticaBold, style: "normal", weight: 700 },
        { name: "NanumPenScript", data: nanumPen, style: "normal", weight: 400 },
      ],
    },
  );
}
