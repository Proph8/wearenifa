import Image from "next/image";

type Shot = { image: string; alt: string };
type Module = { kind: "tall" | "wide"; shots: [Shot] } | { kind: "pair"; shots: [Shot, Shot] };

/** Lays photos out as a sideways row of tall, paired and wide modules. */
function plan(shots: Shot[]): Module[] {
  const out: Module[] = [];
  const order = ["tall", "pair", "wide"] as const;
  let i = 0;
  let k = 0;
  while (i < shots.length) {
    const kind = order[k % order.length];
    k++;
    if (kind === "pair" && i + 1 < shots.length) {
      out.push({ kind, shots: [shots[i], shots[i + 1]] });
      i += 2;
    } else {
      out.push({ kind: kind === "pair" ? "tall" : kind, shots: [shots[i]] });
      i += 1;
    }
  }
  return out;
}

export default function MixedRow({ shots, label }: { shots: Shot[]; label: string }) {
  if (!shots.length) return null;
  return (
    <div className="mixrow" tabIndex={0} aria-label={`${label}, scroll sideways`}>
      {plan(shots).map((m, n) => (
        <div key={n} className={m.kind} data-reveal style={{ "--i": n % 3 } as React.CSSProperties}>
          {m.shots.map((s) => (
            <div key={s.image} className="media">
              <Image src={s.image} alt={s.alt} fill sizes="(max-width: 900px) 80vw, 40vw" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
