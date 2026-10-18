"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { href: string; label: string };

export default function SiteHeader({ name, items, barePaths }: { name: string; items: Item[]; barePaths: string[] }) {
  const path = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Tuck the bar away while reading down the page; bring it back on any scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 160);
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
    <header
      className="site-header"
      data-hidden={hidden && !open ? "" : undefined}
      data-bare={barePaths.includes(path) ? "" : undefined}
      style={{ viewTransitionName: "site-header" }}
    >
      <Link href="/" className="wordmark">
        {name}
      </Link>
      <nav className="nav" aria-label="Main">
        {items.map((item) => (
          <Link key={item.href} href={item.href} aria-current={current(item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls="menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <div id="menu" className="menu" data-open={open ? "" : undefined} hidden={!open}>
        <nav aria-label="Menu">
          {[{ href: "/", label: "Home" }, ...items].map((item, i) => (
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
