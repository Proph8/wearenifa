"use client";

import Link from "next/link";
import { useState } from "react";

export type LineUpRow = {
  slug: string;
  title: string;
  kind: string;
  kindLabel: string;
  authors: string[];
  byline: string;
  year: string;
  when: string;
  lang: string;
};
type Option = { value: string; label: string };

/** The writing as one table at one size; choose whose writing and what kind. */
export default function LineUp({ rows, people, kinds }: { rows: LineUpRow[]; people: Option[]; kinds: Option[] }) {
  const [who, setWho] = useState("");
  const [kind, setKind] = useState("");
  const shown = rows.filter((r) => (!who || r.authors.includes(who)) && (!kind || r.kind === kind));
  const years = [...new Set(shown.map((r) => r.year))];

  return (
    <>
      <div className="lineup-filters">
        <div className="choices" role="group" aria-label="Whose writing">
          {[{ value: "", label: "Both of us" }, ...people].map((o) => (
            <button key={o.value} type="button" aria-pressed={who === o.value} onClick={() => setWho(o.value)}>
              {o.label}
            </button>
          ))}
        </div>
        {kinds.length > 1 && (
          <div className="choices" role="group" aria-label="Kind of writing">
            {[{ value: "", label: "Everything" }, ...kinds].map((o) => (
              <button key={o.value} type="button" aria-pressed={kind === o.value} onClick={() => setKind(o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="lineup" key={`${who}|${kind}`} aria-live="polite">
        {years.map((y) => (
          <div key={y}>
            <h3 className="lineup-group">{y}</h3>
            {shown
              .filter((r) => r.year === y)
              .map((r, i) => (
                <Link key={r.slug} href={`/posts/${r.slug}`} className="lineup-row" style={{ "--i": i } as React.CSSProperties}>
                  <span lang={r.lang}>{r.title}</span>
                  <span>{r.kindLabel}</span>
                  <span>{r.byline}</span>
                  <span>{r.when}</span>
                </Link>
              ))}
          </div>
        ))}
        {shown.length === 0 && <p className="lineup-group">Nothing like that yet.</p>}
      </div>
    </>
  );
}
