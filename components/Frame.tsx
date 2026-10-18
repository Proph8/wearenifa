"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Shot = { image: string; alt: string; caption: string };

/** One frame stays put while its picture changes; tap to move on. */
export default function Frame({ shots }: { shots: Shot[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (shots.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % shots.length);
    }, 3600);
    return () => window.clearInterval(id);
  }, [shots.length]);

  if (!shots.length) return null;
  return (
    <figure className="frame">
      <button type="button" className="frame-pic" onClick={() => setI((n) => (n + 1) % shots.length)} aria-label="Next picture">
        {shots.map((s, n) => (
          <Image
            key={s.image}
            src={s.image}
            alt={s.alt}
            fill
            sizes="(max-width: 760px) 72vw, 34vw"
            aria-hidden={n !== i}
            data-on={n === i ? "" : undefined}
          />
        ))}
      </button>
      <figcaption className="small muted" aria-live="polite">
        {shots[i].caption}
      </figcaption>
    </figure>
  );
}
