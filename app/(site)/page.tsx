import Image from "next/image";
import Link from "next/link";
import React, { ViewTransition } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import PhotoRow from "@/components/PhotoRow";
import WritingList from "@/components/WritingList";
import { getFamily, getMembers, getPosts, kindLabel, writingRows } from "@/lib/content";
import styles from "./home.module.css";

export const metadata = { alternates: { canonical: "/" } };

const at = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function Home() {
  const [family, members, posts] = await Promise.all([getFamily(), getMembers(), getPosts()]);
  const people = members.filter((m) => m.showOnHome);
  const kinds = [...new Set(posts.map((p) => p.kind))].map((k) => ({ value: k, label: kindLabel(k) }));
  const shots = family?.gallery.filter((g) => g.image) ?? [];

  return (
    <>
      {/* Hero: one statement, two actions, one big picture that scales in */}
      <section className={`container ${styles.hero}`} aria-labelledby="hero">
        <div className={`rise ${styles.heroText}`}>
          <h1 id="hero" className="hero-title" style={at(0)}>
            Two people.
            <br />
            One name.
          </h1>
          <p className="lead" style={at(1)}>
            {family?.intro}
          </p>
          <div className={styles.actions} style={at(2)}>
            <Link href="/posts" className="btn">
              Read our writing <ArrowRight />
            </Link>
            <a href="#people" className="btn btn-ghost">
              Meet us
            </a>
          </div>
        </div>
        {family?.heroPhoto && (
          <div className={`media scale-in ${styles.heroMedia}`}>
            <Image src={family.heroPhoto} alt={family.heroPhotoAlt ?? ""} fill priority sizes="(max-width: 1200px) 100vw, 1200px" />
          </div>
        )}
      </section>

      {/* Latest writing */}
      <section className="container section" aria-labelledby="writing">
        <div className="section-head" data-reveal>
          <div>
            <h2 id="writing" className="title">
              Latest writing
            </h2>
            <p className="lead">Essays, poems, articles and notes, as we finish them.</p>
          </div>
          <Link href="/posts" className="link">
            Everything <ArrowRight />
          </Link>
        </div>
        <WritingList
          rows={writingRows(posts, members)}
          people={[]}
          kinds={kinds}
          limit={5}
        />
      </section>

      {/* Two people: one on stone, one on graphite */}
      <section id="people" className={styles.people} aria-label="Who we are">
        {people.map((m) => (
          <Link key={m.slug} href={`/${m.slug}`} className={`${styles.person} ${m.tone === "dark" ? "band-dark" : "band"}`} data-accent={m.accent}>
            <div className={styles.personInner}>
              <div className={styles.personText} data-reveal>
                <h2 className="title">{m.shortName || m.name}</h2>
                <p className="meta">{m.role}</p>
                {m.now && <p className="lead">{m.now}</p>}
                <span className="btn btn-ghost">
                  {m.shortName || m.name}&rsquo;s page <ArrowUpRight />
                </span>
              </div>
              <ViewTransition name={`portrait-${m.slug}`} share="morph" default="none">
                <div className={`media ${styles.portrait}`} data-reveal style={at(1)}>
                  {m.portrait && <Image src={m.portrait} alt={m.name} fill sizes="(max-width: 900px) 100vw, 40vw" />}
                </div>
              </ViewTransition>
            </div>
          </Link>
        ))}
      </section>

      {/* Now: cards that stack as you scroll */}
      <section className="container section" aria-labelledby="now">
        <div className="section-head" data-reveal>
          <div>
            <h2 id="now" className="title">
              What we&rsquo;re on right now
            </h2>
          </div>
        </div>
        <div className={styles.stack}>
          {people.map((m, i) => (
            <article key={m.slug} className={`card ${styles.stackCard}`} style={{ "--n": i } as React.CSSProperties}>
              <p className="subtitle">{m.now}</p>
              <div className={styles.stackFoot}>
                <span className={styles.stackWho}>
                  <span className="pill">{m.shortName || m.name}</span>
                  <span className="meta">
                    {m.role}
                    {m.location && ` · ${m.location}`}
                  </span>
                </span>
                <Link href={`/${m.slug}`} className="link">
                  Work and writing <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
          {posts[0] && (
            <article className={`card band-dark ${styles.stackCard}`} style={{ "--n": people.length } as React.CSSProperties}>
              <p className="subtitle" lang={posts[0].language}>
                {posts[0].title}
              </p>
              <div className={styles.stackFoot}>
                <span className={styles.stackWho}>
                  <span className="pill">New</span>
                  <span className="meta">{kindLabel(posts[0].kind)}, {posts[0].summary}</span>
                </span>
                <Link href={`/posts/${posts[0].slug}`} className="link">
                  Read it <ArrowRight />
                </Link>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* Photos */}
      {shots.length > 0 && (
        <section className="section-tight" aria-labelledby="photos">
          <div className="container section-head" data-reveal>
            <div>
              <h2 id="photos" className="title">
                Around and about
              </h2>
              {family?.places && <p className="lead">{family.places}</p>}
            </div>
          </div>
          <div className="container">
            <PhotoRow shots={shots.map((s) => ({ image: s.image!, alt: s.alt, caption: s.caption }))} />
          </div>
        </section>
      )}
    </>
  );
}
