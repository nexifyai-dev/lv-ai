import type { NextAuthConfig } from "next-auth";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const authConfig = {
  basePath: "/api/auth",
  trustHost: true,
  pages: {
    signIn: `${base}/login`,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnRegister = nextUrl.pathname.startsWith("/register");
      const isOnApi = nextUrl.pathname.startsWith("/api");

      // Login/Register Seiten sind immer erlaubt
      if (isOnLogin || isOnRegister) {
        return true;
      }

      // API-Routen sind immer erlaubt (Auth wird intern geprüft)
      if (isOnApi) {
        return true;
      }

      // Alle anderen Seiten erfordern Login
      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
