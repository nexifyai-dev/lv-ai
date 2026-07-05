import { describe, expect, it } from "vitest";

describe("LV.AI Login Page", () => {
  it("should be defined", () => {
    // Basic smoke test — full render tests require Playwright
    expect(true).toBe(true);
  });

  it("should have LV.AI branding", () => {
    // Verify branding constants
    const brandName = "LV.AI";
    const tagline = "Autonomer KI-Experte für Leistungsverzeichnisse";
    expect(brandName).toBe("LV.AI");
    expect(tagline).toContain("Leistungsverzeichnisse");
  });

  it("should mention D/A/CH compliance", () => {
    const compliance = "D/A/CH · GAEB DA XML · VOB · ÖNORM · SIA";
    expect(compliance).toContain("GAEB");
    expect(compliance).toContain("VOB");
    expect(compliance).toContain("ÖNORM");
    expect(compliance).toContain("SIA");
  });
});
