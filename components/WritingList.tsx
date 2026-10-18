"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "./Icons";

export type WritingRow = {
  slug: string;
  title: string;
  summary: string;
  kind: string;
  kindLabel: string;
  authors: string[];
  byline: string;
  when: string;
  lang: string;
};
type Option = { value: string; label: string };

export default function WritingList({
  rows,
  people,
  kinds,
  limit,
}: {
  rows: WritingRow[];
  people: Option[];
  kinds: Option[];
  limit?: number;
}) {
  const [who, setWho] = useState("");
  const [kind, setKind] = useState("");
  const shown = rows.filter((r) => (!who || r.authors.includes(who)) && (!kind || r.kind === kind)).slice(0, limit);

  return (
    <>
      {(people.length > 0 || kinds.length > 1) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
          {people.length > 0 && (
            <div className="seg" role="group" aria-label="Whose writing">
              {[{ value: "", label: "Everyone" }, ...people].map((o) => (
                <button key={o.value} type="button" aria-pressed={who === o.value} onClick={() => setWho(o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          )}
          {kinds.length > 1 && (
            <div className="seg" role="group" aria-label="Kind of writing">
              {[{ value: "", label: "All" }, ...kinds].map((o) => (
                <button key={o.value} type="button" aria-pressed={kind === o.value} onClick={() => setKind(o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="wlist" key={`${who}|${kind}`} aria-live="polite">
        {shown.map((r, i) => (
          <Link key={r.slug} href={`/posts/${r.slug}`} className="wrow" data-reveal style={{ "--i": i } as React.CSSProperties}>
            <span className="meta date">{r.when}</span>
            <span>
              <h3 lang={r.lang}>{r.title}</h3>
              {r.summary && <p>{r.summary}</p>}
              <span style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center", marginTop: "0.75rem" }}>
                <span className="kind">{r.kindLabel}</span>
                <span className="meta">{r.byline}</span>
              </span>
            </span>
            <span className="arrow" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </Link>
        ))}
        {shown.length === 0 && <p className="meta" style={{ padding: "2rem 0" }}>Nothing like that yet.</p>}
      </div>
    </>
  );
}
