import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "admin_session";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const sessionToken =
    process.env.ADMIN_SESSION_TOKEN || process.env.ADMIN_PANEL_PASSWORD;

  if (!sessionToken) {
    return false;
  }

  return cookieToken === sessionToken;
}
