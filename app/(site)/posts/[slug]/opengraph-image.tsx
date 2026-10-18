import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { byline, formatDate, getMembers, getPost, getPosts, kindLabel } from "@/lib/content";

// The card shown when a piece of writing is shared; uses the cover when there is one.
export const alt = "Writing on wearnifa.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

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

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, members, geist] = await Promise.all([getPost(slug), getMembers(), readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf"))]);
  const cover = await dataUrl(post?.cover);
  const title = post?.title ?? "Writing";
  const line = post ? `${kindLabel(post.kind)} by ${byline(post.authors, members)} · ${formatDate(post.date, { day: undefined })}` : "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fbfbfa", color: "#15171a", fontFamily: "Geist", padding: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: cover ? 48 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, color: "#5a5e66" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#2e5bff" }} />
            <div>wearnifa.com</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: title.length > 40 ? 56 : 72, lineHeight: 1.05, letterSpacing: -2.5 }}>{title}</div>
            <div style={{ fontSize: 30, color: "#5a5e66", lineHeight: 1.3 }}>{line}</div>
          </div>
        </div>
        {cover && (
          <img src={cover} alt="" width={420} height={502} style={{ width: 420, height: 502, objectFit: "cover", borderRadius: 28, border: "1px solid rgba(21,23,26,0.08)" }} />
        )}
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: geist, style: "normal", weight: 400 }] },
  );
}
