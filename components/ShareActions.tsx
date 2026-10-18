"use client";

import { useState } from "react";

/** Copy this page's address, or print it; both for sharing a profile professionally. */
export function CopyLink({ className = "btn btn-ghost" }: { className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`${className} no-print`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          window.prompt("Copy this link", window.location.href);
        }
      }}
      aria-live="polite"
    >
      {done ? "Link copied" : "Copy link"}
    </button>
  );
}

export function PrintButton({ label = "Save as PDF", className = "btn" }: { label?: string; className?: string }) {
  return (
    <button type="button" className={`${className} no-print`} onClick={() => window.print()}>
      {label}
    </button>
  );
}
