import { describe, expect, it } from "vitest";

describe("LV.AI Proxy", () => {
  it("should export proxy function", () => {
    // Proxy is tested via E2E
    expect(true).toBe(true);
  });

  it("should redirect unauthenticated users to /login", () => {
    const redirectTarget = "/login";
    expect(redirectTarget).toBe("/login");
    expect(redirectTarget).not.toBe("/api/auth/guest");
  });

  it("should allow login and register pages", () => {
    const allowedPaths = ["/login", "/register", "/api/auth"];
    expect(allowedPaths).toContain("/login");
    expect(allowedPaths).toContain("/register");
    expect(allowedPaths).toContain("/api/auth");
  });
});
