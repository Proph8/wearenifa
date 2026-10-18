import type { Metadata } from "next";
import Markdoc from "@markdoc/markdoc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import { CopyLink, PrintButton } from "@/components/ShareActions";
import { bodyNode, getMember, getMembers, getProjects, renderableBody } from "@/lib/content";
import styles from "./cv.module.css";

type Props = { params: Promise<{ member: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getMembers()).map((m) => ({ member: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = await getMember((await params).member);
  if (!m) return {};
  return {
    title: `${m.name} — CV`,
    description: `${m.role}. ${m.now ?? ""}`.trim(),
    alternates: { canonical: `/${m.slug}/cv` },
    openGraph: { type: "profile", title: `${m.name} — CV`, description: m.role },
  };
}

export default async function CvPage({ params }: Props) {
  const { member: slug } = await params;
  const [m, projects] = await Promise.all([getMember(slug), getProjects(slug)]);
  if (!m) notFound();
  const bio = await bodyNode(m.bio);
  const first = m.shortName || m.name;

  return (
    <article className={`container ${styles.cv}`} data-accent={m.accent}>
      <div className={`${styles.bar} no-print`}>
        <Link href={`/${m.slug}`} className="link">
          <span style={{ display: "inline-block", transform: "rotate(180deg)" }}>
            <ArrowRight />
          </span>
          {first}&rsquo;s page
        </Link>
        <div className={styles.barActions}>
          <CopyLink />
          <PrintButton />
        </div>
      </div>

      <header className={styles.head}>
        {m.portrait && (
          <div className={`media ${styles.portrait}`}>
            <Image src={m.portrait} alt={m.name} fill sizes="160px" priority />
          </div>
        )}
        <div className={styles.headText}>
          <h1 className={styles.name}>{m.name}</h1>
          <p className={styles.role}>
            {m.role}
            {m.location && <span className="muted"> · {m.location}</span>}
          </p>
          <p className={`meta ${styles.contact}`}>
            <a href={`https://wearnifa.com/${m.slug}`}>wearnifa.com/{m.slug}</a>
            {m.email && (
              <>
                <span aria-hidden="true"> · </span>
                <a href={`mailto:${m.email}`}>{m.email}</a>
              </>
            )}
            {m.links.map((l) => (
              <React.Fragment key={l.url}>
                <span aria-hidden="true"> · </span>
                <a href={l.url ?? "#"} rel="me noopener">
                  {l.label}
                  <span className={`no-print ${styles.ext}`}>
                    <ArrowUpRight />
                  </span>
                </a>
              </React.Fragment>
            ))}
          </p>
        </div>
      </header>

      {m.now && <p className={`lead ${styles.now}`}>{m.now}</p>}

      <div className={styles.sheet}>
        <section className={styles.block}>
          <h2>About</h2>
          <div className={styles.prose}>{Markdoc.renderers.react(renderableBody(bio), React)}</div>
        </section>

        {m.experience.length > 0 && (
          <section className={styles.block}>
            <h2>Path</h2>
            <ol className={styles.list}>
              {m.experience.map((e, i) => (
                <li key={i}>
                  <span className={styles.row}>
                    <span>
                      <strong>{e.title}</strong>, {e.org}
                    </span>
                    <span className="meta">{e.start ? `${e.start} – ${e.end || "Present"}` : "Present"}</span>
                  </span>
                  {(e.place || e.note) && <span className={`meta ${styles.note}`}>{[e.place, e.note].filter(Boolean).join(" · ")}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {projects.length > 0 && (
          <section className={styles.block}>
            <h2>Selected work</h2>
            <ol className={styles.list}>
              {projects.map((p) => (
                <li key={p.slug}>
                  <span className={styles.row}>
                    <strong>{p.link ? <a href={p.link}>{p.title}</a> : p.title}</strong>
                    <span className="meta">{p.year}</span>
                  </span>
                  {p.summary && <span className={`meta ${styles.note}`}>{p.summary}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {m.education.length > 0 && (
          <section className={styles.block}>
            <h2>Studied</h2>
            <ol className={styles.list}>
              {m.education.map((e) => (
                <li key={e.course}>
                  <span className={styles.row}>
                    <span>
                      <strong>{e.course}</strong>, {e.school}
                    </span>
                    <span className="meta">{e.years}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {m.skillGroups.length > 0 && (
          <section className={styles.block}>
            <h2>Skills</h2>
            <ul className={styles.list}>
              {m.skillGroups.map((g) => (
                <li key={g.label}>
                  <span className={styles.row}>
                    <strong>{g.label}</strong>
                  </span>
                  <span className={`meta ${styles.note}`}>{g.items}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {m.certifications.length > 0 && (
          <section className={styles.block}>
            <h2>Certificates</h2>
            <ul className={styles.list}>
              {m.certifications.map((c) => (
                <li key={c.name}>
                  <span className={styles.row}>
                    <span>{c.name}</span>
                    <span className="meta">{c.date}</span>
                  </span>
                  <span className={`meta ${styles.note}`}>{c.issuer}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <p className={`meta ${styles.foot}`}>Kept up to date at wearnifa.com/{m.slug}/cv</p>
    </article>
  );
}
