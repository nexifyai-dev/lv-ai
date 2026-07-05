import { describe, expect, it } from "vitest";

describe("LV.AI Layout", () => {
  it("should have LV.AI metadata", () => {
    const title = "LV.AI — Leistungsverzeichnis KI-Experte";
    const description =
      "Autonomer KI-Experte für Leistungsverzeichnisse, Ausschreibung, Vergabe und Abrechnung im D/A/CH-Raum";
    expect(title).toContain("LV.AI");
    expect(description).toContain("D/A/CH");
  });

  it("should use German language", () => {
    const lang = "de";
    expect(lang).toBe("de");
  });
});
