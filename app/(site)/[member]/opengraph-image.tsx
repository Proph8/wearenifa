import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getMember, getMembers } from "@/lib/content";

// The card that WhatsApp, LinkedIn and iMessage show when a profile link is shared.
export const alt = "Profile card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getMembers()).map((m) => ({ member: m.slug }));
}

async function portraitDataUrl(path: string | null | undefined) {
  if (!path) return null;
  try {
    const file = await readFile(join(process.cwd(), "public", path));
    const ext = path.split(".").pop()?.toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ member: string }> }) {
  const { member } = await params;
  const [m, geist] = await Promise.all([getMember(member), readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf"))]);
  const portrait = await portraitDataUrl(m?.portrait);
  const name = m?.name ?? "Nifa";
  const role = m?.role ?? "";
  const place = m?.location ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fbfbfa",
          color: "#15171a",
          fontFamily: "Geist",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, color: "#5a5e66" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#2e5bff" }} />
            <div>{`wearnifa.com/${member}`}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: name.length > 16 ? 76 : 92, lineHeight: 1, letterSpacing: -4 }}>{name}</div>
            <div style={{ fontSize: 34, color: "#5a5e66", lineHeight: 1.3, maxWidth: 640 }}>{`${role}${place ? ` · ${place}` : ""}`}</div>
          </div>
        </div>
        {portrait && (
          <img
            src={portrait}
            alt=""
            width={400}
            height={502}
            style={{ width: 400, height: 502, objectFit: "cover", borderRadius: 28, border: "1px solid rgba(21,23,26,0.08)" }}
          />
        )}
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: geist, style: "normal", weight: 400 }] },
  );
}
