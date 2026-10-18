import { notFound } from "next/navigation";
import { editorAvailable } from "@/lib/family-gate";
import KeystaticApp from "./keystatic";

export const metadata = { title: "Family site · editor", robots: { index: false } };

export default function KeystaticLayout() {
  if (!editorAvailable()) notFound();
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
