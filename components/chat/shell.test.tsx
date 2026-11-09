import { describe, expect, it } from "vitest";

describe("Chat Shell", () => {
  it("should have German error messages", () => {
    const messages = {
      close: "Schließen",
      connectionError: "Verbindungsfehler",
      retry: "Erneut versuchen",
    };
    expect(messages.connectionError).toBe("Verbindungsfehler");
    expect(messages.retry).toBe("Erneut versuchen");
  });

  it("should not reference Vercel AI Gateway", () => {
    const text = "NeXifyAI.cloud";
    expect(text).not.toContain("Vercel");
    expect(text).not.toContain("AI Gateway");
  });
});
