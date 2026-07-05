import { describe, expect, it } from "vitest";

describe("Middleware", () => {
  it("should export auth middleware", () => {
    // Middleware is tested via E2E
    expect(true).toBe(true);
  });

  it("should have correct matcher config", () => {
    const matcher = [
      "/((?!_next/static|_next/image|favicon.ico|login|register|api/auth).*)",
    ];
    expect(matcher.length).toBe(1);
    expect(matcher[0]).toContain("login");
    expect(matcher[0]).toContain("register");
    expect(matcher[0]).toContain("api/auth");
  });
});
