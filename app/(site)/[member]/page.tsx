import type { Metadata } from "next";
import Markdoc from "@markdoc/markdoc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import Corners from "@/components/Corners";
import Frame from "@/components/Frame";
import LineUp from "@/components/LineUp";
import {
  bodyNode,
  getMember,
  getMembers,
  getPosts,
  getProjects,
  lineUpRows,
  renderableBody,
  splitName,
} from "@/lib/content";
import styles from "./member.module.css";

type Props = { params: Promise<{ member: string }> };

const RESERVED = new Set(["posts", "keystatic", "api"]);

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getMembers()).filter((m) => !RESERVED.has(m.slug)).map((m) => ({ member: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = await getMember((await params).member);
  if (!m) return {};
  return {
    title: m.name,
    description: `${m.role}. ${m.now ?? ""}`.trim(),
    openGraph: { type: "profile", title: m.name, images: m.portrait ? [{ url: m.portrait, alt: m.name }] : undefined },
  };
}

const at = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function MemberPage({ params }: Props) {
  const { member: slug } = await params;
  const [m, members, projects, posts] = await Promise.all([getMember(slug), getMembers(), getProjects(slug), getPosts()]);
  if (!m) notFound();

  const theirs = posts.filter((p) => p.authors.includes(slug));
  const bio = await bodyNode(m.bio);
  const name = splitName(m);
  const first = m.shortName || m.name;

  return (
    <>
      <div className="poster">
        <Corners
          lit
          solid
          left={{ text: name.lit || name.first }}
          right={{ text: name.lit ? name.rest : "" }}
        />
        <section className={styles.hero} aria-labelledby="name">
          <div className={styles.say}>
            <h1 id="name" className="lead">
              {m.name}
            </h1>
            <p className="lead muted">
              {m.role}
              {m.location && `, ${m.location}`}
            </p>
            {theirs.length > 0 && (
              <Link href="#writing" className="button">
                Read {first}&rsquo;s writing
              </Link>
            )}
          </div>
          {m.links.length > 0 && (
            <nav className={styles.stack} aria-label={`${first} elsewhere`}>
              {m.links.map((l) => (
                <a key={l.url} href={l.url ?? "#"} rel="me noopener" target="_blank">
                  {l.label}
                </a>
              ))}
            </nav>
          )}
          <div className={`pic drift ${styles.portrait}`} style={{ "--focus": m.portraitFocus || "50%", "--zoom": m.portraitZoom ?? 1 } as React.CSSProperties}>
            {m.portrait && <Image src={m.portrait} alt={m.name} fill priority sizes="(max-width: 760px) 100vw, 25vw" />}
          </div>
        </section>

        {m.now && (
          <section className={styles.now} aria-label="Now">
            <p className={styles.statement} data-reveal>
              {m.now}
            </p>
          </section>
        )}
      </div>

      {m.photos.some((p) => p.image) && (
        <section className={styles.photos} aria-label={`Photos of ${first}`} data-reveal>
          <Frame shots={m.photos.filter((p) => p.image).map((p) => ({ image: p.image!, alt: p.alt, caption: p.caption }))} />
        </section>
      )}

      {projects.length > 0 && (
        <section aria-label="Work">
          {projects.map((p, i) => (
            <article key={p.slug} className={`${styles.panel} ${i % 2 ? "on-field" : "on-surface"}`}>
              <div className={styles.row}>
                <span className="small">{p.year}</span>
                <h2 className={styles.workTitle}>
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener">
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </h2>
                <span className="small">{p.link ? new URL(p.link).hostname.replace(/^www\./, "") : i === 0 ? "Work" : ""}</span>
              </div>
              {p.summary && (
                <p className={`lead ${styles.workSummary}`} data-reveal>
                  {p.summary}
                </p>
              )}
            </article>
          ))}
        </section>
      )}

      <section className={`on-field ${styles.record}`} aria-label={`About ${first}`}>
        <div className={styles.recordGrid}>
          <h2 className="lineup lineup-group">About</h2>
          <div className="reading" data-reveal>
            {Markdoc.renderers.react(renderableBody(bio), React)}
          </div>
        </div>

        {m.experience.length > 0 && (
          <div className="lineup">
            <h2 className="lineup-group">Path</h2>
            <ol>
              {m.experience.map((e, i) => (
                <li key={i} className="lineup-row" data-reveal style={at(i % 4)}>
                  <span>{e.title}</span>
                  <span>{e.org}</span>
                  <span>{e.place}</span>
                  <span>{e.start ? `${e.start} – ${e.end || "now"}` : "now"}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {m.skillGroups.length > 0 && (
          <div className="lineup">
            <h2 className="lineup-group">Skills</h2>
            <dl>
              {m.skillGroups.map((g, i) => (
                <div key={g.label} className={`lineup-row ${styles.wide}`} data-reveal style={at(i)}>
                  <dt>{g.label}</dt>
                  <dd>{g.items}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {m.education.length > 0 && (
          <div className="lineup">
            <h2 className="lineup-group">Studied</h2>
            <ul>
              {m.education.map((e, i) => (
                <li key={e.course} className="lineup-row" data-reveal style={at(i)}>
                  <span>{e.course}</span>
                  <span>{e.school}</span>
                  <span />
                  <span>{e.years}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {m.certifications.length > 0 && (
          <div className="lineup">
            <h2 className="lineup-group">Certificates</h2>
            <ul>
              {m.certifications.map((c, i) => (
                <li key={c.name} className="lineup-row" data-reveal style={at(i % 4)}>
                  <span>{c.name}</span>
                  <span>{c.issuer}</span>
                  <span />
                  <span>{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {theirs.length > 0 && (
        <section id="writing" className={`on-field ${styles.writing}`} aria-label={`${first}'s writing`}>
          <LineUp rows={lineUpRows(theirs, members)} people={[]} kinds={[]} />
        </section>
      )}
    </>
  );
}
