import { auth } from "@/app/(auth)/auth";

// LV.AI Middleware — Schützt alle Seiten außer Login/Register/API
export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page
     * - register page
     * - api/auth routes
     */
    "/((?!_next/static|_next/image|favicon.ico|login|register|api/auth).*)",
  ],
};
