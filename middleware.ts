export { auth as middleware } from "@/app/(auth)/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login page
     * - register page
     * - api/auth routes
     */
    "/((?!_next/static|_next/image|favicon.ico|login|register|api/auth).*)",
  ],
};
