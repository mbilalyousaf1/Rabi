import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session";

export async function POST(request: Request) {
  const { password } = await request.json();

  const ownerPassword = process.env.ADMIN_PANEL_PASSWORD;
  const sessionToken =
    process.env.ADMIN_SESSION_TOKEN || process.env.ADMIN_PANEL_PASSWORD;

  if (!ownerPassword || !sessionToken) {
    return NextResponse.json(
      { error: "Admin authentication is not configured." },
      { status: 500 },
    );
  }

  if (!password || password !== ownerPassword) {
    return NextResponse.json(
      { error: "Invalid owner password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
