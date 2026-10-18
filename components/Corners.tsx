import Link from "next/link";

export type Half = { text: string; rest?: string; href?: string; label?: string };

function Word({ half, lit, className }: { half: Half; lit?: boolean; className: string }) {
  const word = (
    <>
      <span className={lit ? "corner-lit" : undefined}>{half.text}</span>
      {half.rest && <span>{half.rest}</span>}
    </>
  );
  return half.href ? (
    <Link href={half.href} className={`corner ${className}`} aria-label={half.label}>
      {word}
      {half.label && <span className="corner-label small">{half.label}&rsquo;s page</span>}
    </Link>
  ) : (
    <span className={`corner ${className}`}>{word}</span>
  );
}

/** The name in two halves, pinned to opposite corners while the page passes between them. */
export default function Corners({ left, right, lit, solid }: { left: Half; right: Half; lit?: boolean; solid?: boolean }) {
  return (
    <div className="corners-track" data-solid={solid ? "" : undefined} aria-hidden={!left.href}>
      <div className="corners">
        <p className="display rise">
          <Word half={left} lit={lit} className="corner-tl" />
          <Word half={right} className="corner-br" />
        </p>
      </div>
    </div>
  );
}
