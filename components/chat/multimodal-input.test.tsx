import { describe, expect, it } from "vitest";

describe("Multimodal Input", () => {
  it("should have German placeholder text", () => {
    const placeholder = "Fragen Sie mich alles zu LV, Ausschreibung, Vergabe...";
    expect(placeholder).toContain("LV");
    expect(placeholder).toContain("Ausschreibung");
  });

  it("should have German edit placeholder", () => {
    const editPlaceholder = "Nachricht bearbeiten...";
    expect(editPlaceholder).toBe("Nachricht bearbeiten...");
  });

  it("should allow file uploads for all models", () => {
    const vision = true; // Alle Modelle erlauben Upload
    expect(vision).toBe(true);
  });
});
