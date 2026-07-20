import { createHash } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// The name of the cookie that marks someone as logged in to /admin.
export const SESSION_COOKIE = "wk_admin_session";

// How long a login lasts before you need to re-enter the password.
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

/**
 * The cookie never stores the raw password — it stores a one-way hash
 * of it. Even if someone inspected the cookie in their browser, they
 * couldn't recover the password from it.
 */
export function expectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(password).digest("hex");
}

/**
 * Compares a submitted password against ADMIN_PASSWORD.
 * If ADMIN_PASSWORD isn't set at all, we deny by default rather than
 * silently letting everyone in.
 */
export function verifyPassword(password: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  return password === configured;
}

/**
 * Reads the session cookie (server-side only) and checks it matches
 * the current expected token. Used by both pages and API routes.
 */
export function hasValidSession(): boolean {
  const store = cookies();
  const cookie = store.get(SESSION_COOKIE);
  if (!cookie) return false;
  return cookie.value === expectedToken();
}

/**
 * Drop this at the top of any API route that should require login.
 * Returns a 401 response if not authenticated, or null if the request
 * should proceed. Usage:
 *
 *   const unauthorized = requireAuth();
 *   if (unauthorized) return unauthorized;
 */
export function requireAuth(): NextResponse | null {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
