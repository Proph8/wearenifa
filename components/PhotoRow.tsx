import Image from "next/image";

type Shot = { image: string; alt: string; caption?: string };

/** A horizontal, snap-scrolling row of photos. */
export default function PhotoRow({ shots }: { shots: Shot[] }) {
  if (!shots.length) return null;
  return (
    <div className="row" tabIndex={0} aria-label="Photos, scroll sideways">
      {shots.map((s, i) => (
        <figure key={s.image} data-reveal style={{ "--i": i % 4 } as React.CSSProperties}>
          <div className="media">
            <Image src={s.image} alt={s.alt} fill sizes="(max-width: 760px) 70vw, 360px" />
          </div>
          {s.caption && <figcaption>{s.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
