import type { Metadata } from "next";
import Markdoc from "@markdoc/markdoc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import MixedRow from "@/components/MixedRow";
import { CopyLink } from "@/components/ShareActions";
import Stage from "@/components/Stage";
import WritingList from "@/components/WritingList";
import { bodyNode, getMember, getMembers, getPosts, getProjects, renderableBody, writingRows } from "@/lib/content";
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
    alternates: { canonical: `/${m.slug}` },
    openGraph: { type: "profile", title: m.name, description: m.role, url: `/${m.slug}` },
    twitter: { card: "summary_large_image", title: m.name, description: m.role },
  };
}

const at = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function MemberPage({ params }: Props) {
  const { member: slug } = await params;
  const [m, members, projects, posts] = await Promise.all([getMember(slug), getMembers(), getProjects(slug), getPosts()]);
  if (!m) notFound();

  const theirs = posts.filter((p) => p.authors.includes(slug));
  const bio = await bodyNode(m.bio);
  const first = m.shortName || m.name;
  const photos = m.photos.filter((p) => p.image).map((p) => ({ image: p.image!, alt: p.alt }));
  const stage = [m.portrait ? { image: m.portrait, alt: m.name } : null, ...photos.slice(0, 3)].filter(
    (s): s is { image: string; alt: string } => Boolean(s),
  );

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    url: `https://wearnifa.com/${m.slug}`,
    image: m.portrait ? `https://wearnifa.com${m.portrait}` : undefined,
    address: m.location ? { "@type": "PostalAddress", addressLocality: m.location } : undefined,
    sameAs: m.links.map((l) => l.url).filter(Boolean),
    worksFor: m.experience[0]?.org ? { "@type": "Organization", name: m.experience[0].org } : undefined,
  };

  return (
    <div className={`${styles.page} ${m.tone === "dark" ? "band-dark" : ""}`} data-accent={m.accent}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />

      <div className={styles.split}>
        {/* The half that never moves */}
        <aside className={styles.stage} aria-label={`Photos of ${first}`}>
          <Stage shots={stage} priority />
        </aside>

        {/* The half that scrolls, in one narrow measure */}
        <div className={styles.column}>
          <header className={`rise ${styles.head}`}>
            <h1 className={styles.name} style={at(0)}>
              {m.name}
            </h1>
            <p className="meta" style={at(1)}>
              {m.role}
              {m.location && ` · ${m.location}`}
            </p>
            {m.now && (
              <p className={`lead ${styles.now}`} style={at(2)}>
                {m.now}
              </p>
            )}
            <div className={styles.actions} style={at(3)}>
              {theirs.length > 0 && (
                <a href="#writing" className="btn">
                  Read {first}&rsquo;s writing <ArrowRight />
                </a>
              )}
              <Link href={`/${m.slug}/cv`} className="btn btn-ghost">
                CV
              </Link>
              <CopyLink />
            </div>
            {m.links.length > 0 && (
              <p className={`meta ${styles.links}`} style={at(4)}>
                {m.links.map((l, i) => (
                  <React.Fragment key={l.url}>
                    {i > 0 && <span aria-hidden="true"> · </span>}
                    <a href={l.url ?? "#"} rel="me noopener" target="_blank" className="link">
                      {l.label} <ArrowUpRight />
                    </a>
                  </React.Fragment>
                ))}
              </p>
            )}
          </header>

          {projects.length > 0 && (
            <section className={styles.block} aria-labelledby="work">
              <h2 id="work" className={styles.h}>
                Work
              </h2>
              <ol className={styles.index}>
                {projects.map((p, i) => {
                  const inner = (
                    <>
                      <span className={styles.indexRow}>
                        <span className={styles.indexName}>{p.title}</span>
                        <span className="meta">{p.year}</span>
                      </span>
                      {p.summary && <span className={`muted ${styles.indexNote}`}>{p.summary}</span>}
                    </>
                  );
                  return (
                    <li key={p.slug} data-reveal style={at(i % 4)}>
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noopener" className={styles.indexLink}>
                          {inner}
                        </a>
                      ) : (
                        <div className={styles.indexLink}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          <section className={`${styles.block} ${styles.letter}`} aria-label={`About ${first}`} data-reveal>
            {m.portrait && (
              <span className={styles.letterPortrait}>
                <Image src={m.portrait} alt="" width={44} height={44} />
              </span>
            )}
            <div className={styles.letterBody}>{Markdoc.renderers.react(renderableBody(bio), React)}</div>
            <p className={styles.signoff}>
              <span>{first}</span>
              <span className="meta">{m.role}</span>
            </p>
          </section>

          {(m.experience.length > 0 || m.education.length > 0 || m.skillGroups.length > 0 || m.certifications.length > 0) && (
            <section className={`${styles.block} ${styles.sheet}`} aria-label="Record" data-reveal>
              {m.experience.length > 0 && (
                <div className={styles.group}>
                  <h2 className={styles.groupName}>Path</h2>
                  <ol>
                    {m.experience.map((e, i) => (
                      <li key={i} className={styles.item}>
                        <span className={styles.itemRow}>
                          <span>
                            <strong>{e.title}</strong>, {e.org}
                          </span>
                          <span className="meta">{e.start ? `${e.start} – ${e.end || "now"}` : "now"}</span>
                        </span>
                        {(e.place || e.note) && (
                          <span className={`meta ${styles.itemNote}`}>{[e.place, e.note].filter(Boolean).join(" · ")}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {m.education.length > 0 && (
                <div className={styles.group}>
                  <h2 className={styles.groupName}>Studied</h2>
                  <ul>
                    {m.education.map((e) => (
                      <li key={e.course} className={styles.item}>
                        <span className={styles.itemRow}>
                          <span>
                            <strong>{e.course}</strong>, {e.school}
                          </span>
                          <span className="meta">{e.years}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {m.skillGroups.length > 0 && (
                <div className={styles.group}>
                  <h2 className={styles.groupName}>Skills</h2>
                  <ul>
                    {m.skillGroups.map((g) => (
                      <li key={g.label} className={styles.item}>
                        <span className={styles.itemRow}>
                          <strong>{g.label}</strong>
                        </span>
                        <span className={`meta ${styles.itemNote}`}>{g.items}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {m.certifications.length > 0 && (
                <div className={styles.group}>
                  <h2 className={styles.groupName}>Certificates</h2>
                  <ul>
                    {m.certifications.map((c) => (
                      <li key={c.name} className={styles.item}>
                        <span className={styles.itemRow}>
                          <span>{c.name}</span>
                          <span className="meta">{c.date}</span>
                        </span>
                        <span className={`meta ${styles.itemNote}`}>{c.issuer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className={`meta ${styles.sheetFoot}`}>
                <Link href={`/${m.slug}/cv`} className="link">
                  The same as a one-page CV <ArrowRight />
                </Link>
              </p>
            </section>
          )}

          {photos.length > 0 && (
            <section className={styles.block} aria-labelledby="photos">
              <div className={styles.rowHead}>
                <h2 id="photos" className={styles.h}>
                  Photos
                </h2>
                <span className="meta">{photos.length}</span>
              </div>
              <MixedRow shots={photos} label={`Photos of ${first}`} />
            </section>
          )}

          {theirs.length > 0 && (
            <section id="writing" className={styles.block} aria-labelledby="their-writing">
              <div className={styles.rowHead}>
                <h2 id="their-writing" className={styles.h}>
                  Writing
                </h2>
                <Link href="/posts" className="link">
                  Everyone&rsquo;s <ArrowRight />
                </Link>
              </div>
              <WritingList rows={writingRows(theirs, members)} people={[]} kinds={[]} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
