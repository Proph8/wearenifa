import type { Metadata } from "next";
import WritingList from "@/components/WritingList";
import { getMembers, getPosts, kindLabel, writingRows } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, poems, articles, blog posts and photos by Nisham and Fazna.",
  alternates: { canonical: "/posts" },
};

export default async function PostsPage() {
  const [posts, members] = await Promise.all([getPosts(), getMembers()]);
  const kinds = [...new Set(posts.map((p) => p.kind))].map((k) => ({ value: k, label: kindLabel(k) }));

  return (
    <section className="container" style={{ paddingTop: "clamp(3rem, 7vw, 6rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
      <div className="rise" style={{ display: "grid", gap: "1rem", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        <h1 className="hero-title">Writing</h1>
        <p className="lead" style={{ maxWidth: "44ch" }}>
          Essays, poems, articles and notes. Filter by who wrote it or what it is.
        </p>
      </div>
      <WritingList
        rows={writingRows(posts, members)}
        people={members.map((m) => ({ value: m.slug, label: m.shortName || m.name }))}
        kinds={kinds}
      />
    </section>
  );
}
