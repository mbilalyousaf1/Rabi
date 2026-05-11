import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session";

function getSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || process.env.ADMIN_PANEL_PASSWORD || "";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = getSessionToken();
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  const isAuthenticated = Boolean(sessionToken) && cookieToken === sessionToken;

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (isAdminLogin && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isAdminLogin && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
