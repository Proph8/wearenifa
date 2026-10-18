import { createHmac, timingSafeEqual } from "node:crypto";

/** The editor sits behind a family passphrase (FAMILY_PASSPHRASE) before GitHub sign-in. */
export const FAMILY_COOKIE = "nifa_family";

export function familyToken(secret: string) {
  return createHmac("sha256", secret).update("nifa-family-editor").digest("hex");
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** True when the request carries a valid family cookie. */
export function hasFamilyCookie(cookie: string | undefined, secret: string) {
  return Boolean(cookie) && safeEqual(cookie as string, familyToken(secret));
}

/** The editor is only served in production once GitHub sign-in is configured. */
export function editorAvailable() {
  return process.env.NODE_ENV !== "production" || Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);
}
