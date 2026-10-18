"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Shot = { image: string; alt: string };

/** The fixed half of a profile page: one picture that slowly changes. */
export default function Stage({ shots, priority }: { shots: Shot[]; priority?: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (shots.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % shots.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [shots.length]);

  if (!shots.length) return <div className="stage-pic" aria-hidden="true" />;
  return (
    <div className="stage-pic">
      {shots.map((s, n) => (
        <Image
          key={s.image}
          src={s.image}
          alt={n === 0 ? s.alt : ""}
          fill
          priority={priority && n === 0}
          sizes="(max-width: 900px) 100vw, 45vw"
          aria-hidden={n !== i}
          data-on={n === i ? "" : undefined}
        />
      ))}
    </div>
  );
}
