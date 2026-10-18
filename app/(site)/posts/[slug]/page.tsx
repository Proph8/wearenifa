import type { Metadata } from "next";
import Markdoc from "@markdoc/markdoc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import {
  bodyNode,
  byline,
  formatDate,
  getMembers,
  getPost,
  getPosts,
  kindLabel,
  renderableBody,
  wordCount,
} from "@/lib/content";
import styles from "./post.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date ?? undefined,
      images: post.cover ? [{ url: post.cover, alt: post.coverAlt }] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, members, posts] = await Promise.all([getPost(slug), getMembers(), getPosts()]);
  if (!post) notFound();

  const node = await bodyNode(post.body);
  const poem = post.kind === "poem";
  const minutes = Math.max(1, Math.round(wordCount(node) / 220));
  const index = posts.findIndex((p) => p.slug === slug);
  const next = posts[index + 1] ?? posts[0];

  return (
    <article className={`on-field ${styles.sheet}`}>
      <header className={styles.head}>
        <h1 className={`head ${styles.title}`} lang={post.language}>
          {post.title}
        </h1>
        <p className={`small ${styles.meta}`} data-reveal>
          {kindLabel(post.kind)} by {byline(post.authors, members)}, {formatDate(post.date)}
          {!poem && post.kind !== "photos" && <span className="muted"> · {minutes} min read</span>}
        </p>
      </header>

      {post.cover && (
        <figure className={styles.cover} data-reveal>
          <div className="pic drift" style={{ aspectRatio: "16 / 9" }}>
            <Image src={post.cover} alt={post.coverAlt ?? ""} fill priority sizes="100vw" />
          </div>
        </figure>
      )}

      <div className={styles.body}>
        {post.summary && (
          <p className={`lead ${styles.summary}`} lang={post.language} data-reveal>
            {post.summary}
          </p>
        )}
        <div className={`reading ${poem ? "poem" : ""}`} lang={post.language} data-reveal>
          {Markdoc.renderers.react(renderableBody(node, { poem }), React)}
        </div>
      </div>

      {post.gallery.length > 0 && (
        <div className={styles.gallery}>
          {post.gallery.map((g, i) =>
            g.image ? (
              <figure key={i} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                <div className="pic" style={{ aspectRatio: "4 / 5" }}>
                  <Image src={g.image} alt={g.alt} fill sizes="(max-width: 760px) 100vw, 40vw" />
                </div>
                {g.caption && <figcaption className="small muted">{g.caption}</figcaption>}
              </figure>
            ) : null,
          )}
        </div>
      )}

      {next && next.slug !== post.slug && (
        <nav className={styles.next} aria-label="Next piece">
          <Link href={`/posts/${next.slug}`} className="lineup-row">
            <span lang={next.language}>Next: {next.title}</span>
            <span>{kindLabel(next.kind)}</span>
            <span>{byline(next.authors, members)}</span>
            <span>{formatDate(next.date, { day: undefined, month: "short" })}</span>
          </Link>
        </nav>
      )}
    </article>
  );
}
