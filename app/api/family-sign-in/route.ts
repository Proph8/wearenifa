import { NextResponse, type NextRequest } from "next/server";
import { FAMILY_COOKIE, familyToken, safeEqual } from "@/lib/family-gate";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  const secret = process.env.FAMILY_PASSPHRASE;
  const form = await request.formData();
  const given = String(form.get("passphrase") ?? "");
  const next = String(form.get("next") ?? "/keystatic");
  const safeNext = next.startsWith("/keystatic") ? next : "/keystatic";

  // A short pause makes guessing slow without bothering a real person.
  await new Promise((r) => setTimeout(r, 600));

  if (!secret || !given || !safeEqual(given, secret)) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("next", safeNext);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(safeNext, request.url), 303);
  res.cookies.set(FAMILY_COOKIE, familyToken(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
  return res;
}

export async function DELETE(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/", request.url), 303);
  res.cookies.set(FAMILY_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
