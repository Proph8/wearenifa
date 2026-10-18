import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getFamily, getMembers } from "@/lib/content";

// The card shown when the home page is shared.
export const alt = "Nifa — Nisham and Fazna";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function dataUrl(path: string | null | undefined) {
  if (!path) return null;
  try {
    const file = await readFile(join(process.cwd(), "public", path));
    const ext = path.split(".").pop()?.toLowerCase();
    return `data:${ext === "png" ? "image/png" : "image/jpeg"};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image() {
  const [family, members, geist] = await Promise.all([
    getFamily(),
    getMembers(),
    readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
  ]);
  const photo = await dataUrl(family?.heroPhoto);
  const name = family?.name ?? "Nifa";
  const who = members.map((m) => m.shortName || m.name).join(" and ");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fbfbfa", color: "#15171a", fontFamily: "Geist", padding: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, color: "#5a5e66" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#2e5bff" }} />
            <div>wearnifa.com</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 120, lineHeight: 0.95, letterSpacing: -6 }}>{name}</div>
            <div style={{ fontSize: 34, color: "#5a5e66", lineHeight: 1.3, maxWidth: 600 }}>{`${who}. Essays, poems, work and photos.`}</div>
          </div>
        </div>
        {photo && (
          <img src={photo} alt="" width={460} height={502} style={{ width: 460, height: 502, objectFit: "cover", borderRadius: 28, border: "1px solid rgba(21,23,26,0.08)" }} />
        )}
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: geist, style: "normal", weight: 400 }] },
  );
}
