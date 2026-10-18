import type { Metadata } from "next";
import Markdoc from "@markdoc/markdoc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { ArrowRight } from "@/components/Icons";
import { bodyNode, byline, formatDate, getMembers, getPost, getPosts, kindLabel, renderableBody, wordCount } from "@/lib/content";
import styles from "./post.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const members = await getMembers();
  const names = post.authors
    .map((a) => members.find((m) => m.slug === a)?.name)
    .filter((n): n is string => Boolean(n));
  return {
    title: post.title,
    description: post.summary,
    authors: names.map((name) => ({ name })),
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/posts/${post.slug}`,
      publishedTime: post.date ?? undefined,
      authors: names,
      locale: post.language === "ml" ? "ml_IN" : "en_IN",
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary },
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
  const gallery = post.gallery.filter((g) => g.image);

  const site = process.env.SITE_URL ?? "https://wearnifa.com";
  const article = {
    "@context": "https://schema.org",
    "@type": post.kind === "poem" ? "CreativeWork" : "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    inLanguage: post.language,
    url: `${site}/posts/${post.slug}`,
    image: post.cover ? `${site}${post.cover}` : `${site}/posts/${post.slug}/opengraph-image`,
    author: post.authors
      .map((a) => members.find((m) => m.slug === a))
      .filter(Boolean)
      .map((m) => ({ "@type": "Person", name: m!.name, url: `${site}/${m!.slug}` })),
    publisher: { "@type": "Organization", name: "Nifa", url: site },
  };

  return (
    <article className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <header className={`rise ${styles.head}`}>
        <h1 className="hero-title" lang={post.language} style={{ "--i": 0 } as React.CSSProperties}>
          {post.title}
        </h1>
        <p className="meta" style={{ "--i": 1 } as React.CSSProperties}>
          {kindLabel(post.kind)} by {byline(post.authors, members)} · {formatDate(post.date)}
          {!poem && post.kind !== "photos" && ` · ${minutes} min read`}
        </p>
      </header>

      {post.cover && (
        <div className={`media scale-in ${styles.cover}`}>
          <Image src={post.cover} alt={post.coverAlt || post.title} fill priority sizes="(max-width: 1200px) 100vw, 1200px" />
        </div>
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

      {gallery.length > 0 && (
        <div className={styles.gallery}>
          {gallery.map((g, i) => (
            <figure key={i} data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
              <div className="media" style={{ aspectRatio: "4 / 5" }}>
                <Image src={g.image!} alt={g.alt} fill sizes="(max-width: 760px) 100vw, 400px" />
              </div>
              {g.caption && <figcaption className="meta" style={{ marginTop: "0.6rem" }}>{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      {next && next.slug !== post.slug && (
        <nav className={styles.next} aria-label="Next piece" data-reveal>
          <Link href={`/posts/${next.slug}`} className={`card ${styles.nextCard}`}>
            <span className="meta">Read next · {kindLabel(next.kind)}</span>
            <span className="subtitle" lang={next.language}>
              {next.title}
            </span>
            <span className="link">
              Open <ArrowRight />
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}
