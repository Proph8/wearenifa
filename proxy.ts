import { NextResponse, type NextRequest } from "next/server";
import { FAMILY_COOKIE, editorAvailable, hasFamilyCookie } from "@/lib/family-gate";

// Guards the editor and its API. Two layers: this family passphrase, then Keystatic's
// own GitHub sign-in, which only lets repository collaborators save anything.
export function proxy(request: NextRequest) {
  const secret = process.env.FAMILY_PASSPHRASE;
  const configured = editorAvailable() && (secret || process.env.NODE_ENV !== "production");

  if (!configured) {
    // The API stays closed; the page explains what is still missing.
    if (request.nextUrl.pathname.startsWith("/api/")) return new NextResponse("Not found", { status: 404 });
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "?setup=1";
    return NextResponse.redirect(url);
  }
  if (!secret) return NextResponse.next(); // development, no passphrase set

  if (hasFamilyCookie(request.cookies.get(FAMILY_COOKIE)?.value, secret)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return new NextResponse("Sign in first", { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/sign-in";
  url.search = "";
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};
