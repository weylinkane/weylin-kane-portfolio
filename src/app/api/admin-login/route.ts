import { NextResponse } from "next/server";
import {
  verifyPassword,
  expectedToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

// POST /api/admin-login
// Expects: { password: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, expectedToken(), {
      httpOnly: true, // JavaScript in the browser can't read this cookie
      secure: process.env.NODE_ENV === "production", // HTTPS-only in production
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch (error) {
    console.error("POST /api/admin-login failed:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
