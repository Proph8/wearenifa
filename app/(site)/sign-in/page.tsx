import type { Metadata } from "next";

export const metadata: Metadata = { title: "Family sign-in", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ next?: string; error?: string; setup?: string }> };

export default async function SignIn({ searchParams }: Props) {
  const { next = "/keystatic", error, setup } = await searchParams;

  if (setup) {
    const missing = [
      !process.env.FAMILY_PASSPHRASE && "FAMILY_PASSPHRASE",
      !process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG && "the GitHub sign-in variables",
    ].filter(Boolean);
    return (
      <section className="container" style={{ maxWidth: 560, paddingTop: "clamp(4rem, 10vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <h1 className="title">The editor isn&rsquo;t switched on here yet</h1>
        <p className="lead" style={{ marginTop: "0.75rem" }}>
          On the live site it stays closed until {missing.join(" and ") || "its settings"} are added to the hosting
          environment. The README&rsquo;s &ldquo;Going live on Vercel&rdquo; section lists the steps.
        </p>
      </section>
    );
  }

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
