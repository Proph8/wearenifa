import { NextResponse, type NextRequest } from "next/server";
import { FAMILY_COOKIE, editorAvailable, hasFamilyCookie } from "@/lib/family-gate";

// Guards the editor and its API. Two layers: this family passphrase, then Keystatic's
// own GitHub sign-in, which only lets repository collaborators save anything.
export function proxy(request: NextRequest) {
  if (!editorAvailable()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const secret = process.env.FAMILY_PASSPHRASE;
  if (!secret) {
    // Never expose the editor in production without the passphrase set.
    if (process.env.NODE_ENV === "production") return new NextResponse("Not found", { status: 404 });
    return NextResponse.next();
  }

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
