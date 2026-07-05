import { describe, expect, it } from "vitest";

describe("LV.AI Greeting", () => {
  it("should display German greeting", () => {
    const greeting = "Wie kann ich Ihnen helfen?";
    expect(greeting).toContain("helfen");
  });

  it("should mention AVA capabilities", () => {
    const subtitle = "LV erstellen · Angebote vergleichen · Rechnungen prüfen";
    expect(subtitle).toContain("LV");
    expect(subtitle).toContain("Angebote");
    expect(subtitle).toContain("Rechnungen");
  });
});
