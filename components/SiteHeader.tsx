"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { href: string; label: string };

export default function SiteHeader({ name, items }: { name: string; items: Item[] }) {
  const path = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Tuck the bar away while reading down; bring it back on any scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 200);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (path === href || path.startsWith(`${href}/`) ? "page" : undefined);

  return (
    <header className="site-header" data-hidden={hidden && !open ? "" : undefined} style={{ viewTransitionName: "site-header" }}>
      <div className="container">
        <div className="bar">
          <Link href="/" className="wordmark" aria-label={`${name} home`}>
            <i aria-hidden="true" />
            {name}
          </Link>
          <nav className="nav" aria-label="Main">
            {items.map((item) => (
              <Link key={item.href} href={item.href} aria-current={current(item.href)}>
                {item.label}
              </Link>
            ))}
            <Link href="/posts" className="btn btn-ghost" aria-current={current("/posts")}>
              Writing
            </Link>
          </nav>
          <button type="button" className="menu-button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <div id="menu" className="menu" data-open={open ? "" : undefined} hidden={!open}>
        <nav aria-label="Menu">
          {[{ href: "/", label: "Home" }, { href: "/posts", label: "Writing" }, ...items].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === "/" ? (path === "/" ? "page" : undefined) : current(item.href)}
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
