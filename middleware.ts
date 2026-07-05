import { auth } from "@/app/(auth)/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Login/Register Seiten sind immer erlaubt
  if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
    return;
  }

  // API-Routen sind immer erlaubt
  if (nextUrl.pathname.startsWith("/api")) {
    return;
  }

  // Statische Assets sind immer erlaubt
  if (nextUrl.pathname.startsWith("/_next") || nextUrl.pathname === "/favicon.ico") {
    return;
  }

  // Nicht eingeloggte User zum Login weiterleiten
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|register|api/auth).*)"],
};
