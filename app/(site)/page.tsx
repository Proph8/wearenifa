import Image from "next/image";
import Link from "next/link";
import React from "react";
import Corners from "@/components/Corners";
import Frame from "@/components/Frame";
import LineUp from "@/components/LineUp";
import { getFamily, getMembers, getPosts, kindLabel, lineUpRows, splitName } from "@/lib/content";
import styles from "./home.module.css";

export default async function Home() {
  const [family, members, posts] = await Promise.all([getFamily(), getMembers(), getPosts()]);
  const people = members.filter((m) => m.showOnHome);
  const [a, b] = people;
  const left = a ? splitName(a) : { lit: "Ni", first: "Nisham" };
  const right = b ? splitName(b) : { lit: "fa", first: "Fazna" };
  const places = family?.gallery.filter((g) => g.where === "places" && g.image) ?? [];
  const frame = family?.gallery.filter((g) => g.where === "frame" && g.image) ?? [];
  const kinds = [...new Set(posts.map((p) => p.kind))].map((k) => ({ value: k, label: kindLabel(k) }));

  return (
    <>
      <div className="poster">
        <Corners
          left={{ text: left.lit, href: a && `/${a.slug}`, label: left.first }}
          right={{ text: right.lit.toLowerCase(), href: b && `/${b.slug}`, label: right.first }}
        />

        <section className={styles.hero} aria-labelledby="we-are">
          <div className={`on-field ${styles.panel}`}>
            <div className={styles.say}>
              <h1 id="we-are" className={styles.hidden}>
                We are {family?.name}
              </h1>
              <p className="lead">{family?.intro}</p>
              <Link href="#writing" className="button">
                Read our writing
              </Link>
            </div>
            <nav className={styles.stack} aria-label="Pages">
              <Link href="/posts">Writing</Link>
              {people.map((m) => (
                <Link key={m.slug} href={`/${m.slug}`}>
                  {m.shortName || m.name}
                </Link>
              ))}
            </nav>
          </div>
          {family?.heroPhoto && (
            <div className={`pic drift ${styles.heroPic}`}>
              <Image src={family.heroPhoto} alt={family.heroPhotoAlt ?? ""} fill priority sizes="(max-width: 760px) 100vw, 25vw" />
            </div>
          )}
        </section>

        {places.length > 0 && (
          <section className={styles.places} aria-label="Where we are from">
            <div className={styles.placesPin}>
              <p className={styles.statement}>{family?.places}</p>
            </div>
            {places.map((p, i) => (
              <figure key={p.image} className={`${styles.place} ${styles[`place${i % 3}`]}`}>
                <div className="pic bw">
                  <Image src={p.image!} alt={p.alt} fill sizes="(max-width: 760px) 70vw, 36vw" />
                </div>
                <figcaption className="small muted">{p.caption}</figcaption>
              </figure>
            ))}
          </section>
        )}
      </div>

      <section id="writing" className={`on-field ${styles.writing}`} aria-labelledby="writing-title">
        <h2 id="writing-title" className={styles.hidden}>
          Writing
        </h2>
        <LineUp
          rows={lineUpRows(posts, members)}
          people={people.map((m) => ({ value: m.slug, label: m.shortName || m.name }))}
          kinds={kinds}
        />
        <p className={styles.more}>
          <Link href="/posts">Everything we have written</Link>
        </p>
      </section>

      <section className={styles.about} aria-labelledby="who">
        <div className={styles.aboutTrack}>
          <div className={styles.aboutPin}>
            <h2 id="who" className="display">
              {left.lit} + {right.lit.toLowerCase()}
            </h2>
          </div>
        </div>
        {people.map((m, i) => {
          const s = splitName(m);
          return (
            <Link key={m.slug} href={`/${m.slug}`} className={`${styles.person} ${i % 2 ? styles.personRight : ""}`}>
              <div className={`pic bw ${styles.portrait}`} style={{ "--focus": m.portraitFocus || "50%", "--zoom": m.portraitZoom ?? 1 } as React.CSSProperties}>
                {m.portrait && <Image src={m.portrait} alt={m.name} fill sizes="(max-width: 760px) 72vw, 28vw" />}
              </div>
              <p className={styles.personName}>
                <span className={styles.lit}>{s.lit}</span>
                {s.rest}
              </p>
              <p className="small muted">{m.role}</p>
              {m.now && <p className={styles.personNow}>{m.now}</p>}
            </Link>
          );
        })}
      </section>

      {frame.length > 0 && (
        <section className={styles.gallery} aria-label="Pictures" data-reveal>
          <Frame shots={frame.map((f) => ({ image: f.image!, alt: f.alt, caption: f.caption }))} />
        </section>
      )}
    </>
  );
}
