import KeystaticApp from "./keystatic";

export const metadata = { title: "Family site · editor", robots: { index: false } };

export default function KeystaticLayout() {
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
