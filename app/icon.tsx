import { ImageResponse } from "next/og";

// Browser-tab icon: the wordmark's dot on graphite.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#15171a", borderRadius: 16 }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: "#2e5bff" }} />
      </div>
    ),
    size,
  );
}
