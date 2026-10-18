import type { Metadata } from "next";
import { Anek_Malayalam, Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { ViewTransition } from "react";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import { getFamily, getMembers } from "@/lib/content";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

// Only for Malayalam text; Latin always comes from Bricolage.
const anek = Anek_Malayalam({ subsets: ["malayalam"], variable: "--font-anek", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const family = await getFamily();
  const name = family?.name ?? "Nifa";
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "https://wearnifa.com"),
    title: { default: `We are ${name}`, template: `%s · ${name}` },
    description: family?.intro,
    openGraph: { siteName: name, type: "website", locale: "en_IN", images: family?.heroPhoto ? [family.heroPhoto] : undefined },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [family, members] = await Promise.all([getFamily(), getMembers()]);
  const name = family?.name ?? "Nifa";
  const people = members.map((m) => ({ href: `/${m.slug}`, label: m.shortName || m.name }));
  const items = [{ href: "/posts", label: "Writing" }, ...people];

  return (
    <html lang="en" className={`${bricolage.variable} ${anek.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets scroll reveals hide content only while script is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader name={name} items={items} barePaths={["/", ...people.map((p) => p.href)]} />
        <ViewTransition>
          <main id="main">{children}</main>
        </ViewTransition>
        <footer className="site-footer">
          <span>{name}, the family site of {people.map((p) => p.label).join(" and ")}</span>
          <nav aria-label="Footer">
            {items.map((i) => (
              <Link key={i.href} href={i.href}>
                {i.label}
              </Link>
            ))}
            <Link href="/keystatic">Sign in</Link>
          </nav>
          <span className="end">wearnifa.com · {new Date().getFullYear()}</span>
        </footer>
        <Reveal />
      </body>
    </html>
  );
}
