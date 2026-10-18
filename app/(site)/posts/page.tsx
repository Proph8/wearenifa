import type { Metadata } from "next";
import LineUp from "@/components/LineUp";
import { getMembers, getPosts, kindLabel, lineUpRows } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, poems, articles, blog posts and photos by Nisham and Fazna.",
};

export default async function PostsPage() {
  const [posts, members] = await Promise.all([getPosts(), getMembers()]);
  const kinds = [...new Set(posts.map((p) => p.kind))].map((k) => ({ value: k, label: kindLabel(k) }));

  return (
    <section className="on-field" style={{ minHeight: "100svh", padding: "clamp(3rem, 8vw, 7rem) var(--m) clamp(4rem, 8vw, 7rem)" }}>
      <h1 className="display rise" style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        <span>Writing</span>
      </h1>
      <LineUp
        rows={lineUpRows(posts, members)}
        people={members.map((m) => ({ value: m.slug, label: m.shortName || m.name }))}
        kinds={kinds}
      />
    </section>
  );
}
