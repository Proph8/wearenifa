import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { editorAvailable } from "@/lib/family-gate";

export const metadata: Metadata = { title: "Family sign-in", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function SignIn({ searchParams }: Props) {
  if (!editorAvailable()) notFound();
  const { next = "/keystatic", error } = await searchParams;

  return (
    <section className="container" style={{ maxWidth: 480, paddingTop: "clamp(4rem, 10vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
      <h1 className="title">Family sign-in</h1>
      <p className="lead" style={{ marginTop: "0.75rem" }}>
        The editor is for the family. Enter the family passphrase; GitHub sign-in follows.
      </p>
      <form method="post" action="/api/family-sign-in" style={{ display: "grid", gap: "0.75rem", marginTop: "2rem" }}>
        <input type="hidden" name="next" value={next.startsWith("/keystatic") ? next : "/keystatic"} />
        <label className="meta" htmlFor="passphrase">
          Passphrase
        </label>
        <input
          id="passphrase"
          name="passphrase"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "err" : undefined}
          style={{
            font: "inherit",
            minHeight: 48,
            padding: "0 1rem",
            borderRadius: 12,
            border: "1px solid var(--stone-2)",
            background: "var(--paper)",
            color: "var(--ink)",
          }}
        />
        {error && (
          <p id="err" className="meta" role="alert" style={{ color: "#b42318" }}>
            That passphrase didn&rsquo;t match. Try again.
          </p>
        )}
        <button type="submit" className="btn" style={{ justifySelf: "start" }}>
          Continue
        </button>
      </form>
    </section>
  );
}
