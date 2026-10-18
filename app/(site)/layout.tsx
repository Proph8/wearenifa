import type { Metadata } from "next";
import { Anek_Malayalam, Geist } from "next/font/google";
import Link from "next/link";
import { ViewTransition } from "react";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import { getFamily, getMembers } from "@/lib/content";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

// Only for Malayalam text; Latin always comes from Geist.
const anek = Anek_Malayalam({ subsets: ["malayalam"], variable: "--font-anek", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const [family, members] = await Promise.all([getFamily(), getMembers()]);
  const name = family?.name ?? "Nifa";
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "https://wearnifa.com"),
    title: { default: `${name} — Nisham and Fazna`, template: `%s · ${name}` },
    description: family?.intro,
    applicationName: name,
    authors: members.map((m) => ({ name: m.name, url: `/${m.slug}` })),
    robots: { index: true, follow: true },
    openGraph: { siteName: name, type: "website", locale: "en_IN", url: "/" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [family, members] = await Promise.all([getFamily(), getMembers()]);
  const name = family?.name ?? "Nifa";
  const people = members.map((m) => ({ href: `/${m.slug}`, label: m.shortName || m.name }));
  const items = [{ href: "/posts", label: "Writing" }, ...people];

  return (
    <html lang="en" className={`${geist.variable} ${anek.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets scroll reveals hide content only while script is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader name={name} items={people} />
        <ViewTransition>
          <main id="main">{children}</main>
        </ViewTransition>
        <footer className="site-footer">
          <div className="container">
            <div className="top">
              <div>
                <Link href="/" className="wordmark">
                  <i aria-hidden="true" />
                  {name}
                </Link>
                <p className="meta" style={{ marginTop: "0.9rem", maxWidth: "32ch" }}>
                  {family?.intro}
                </p>
              </div>
              <div>
                <h4>Site</h4>
                <ul>
                  {items.map((i) => (
                    <li key={i.href}>
                      <Link href={i.href}>{i.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Family</h4>
                <ul>
                  <li>
                    <Link href="/keystatic">Sign in to post</Link>
                  </li>
                  <li>
                    <a href="mailto:hello@wearnifa.com">hello@wearnifa.com</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bottom">
              <span>© {new Date().getFullYear()} {name}</span>
              <span>wearnifa.com</span>
            </div>
            <div className="big" aria-hidden="true">
              {name}
            </div>
          </div>
        </footer>
        <Reveal />
      </body>
    </html>
  );
}
