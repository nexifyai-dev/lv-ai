import { describe, expect, it } from "vitest";
import { suggestions, guestRegex, isTestEnvironment } from "./constants";

describe("LV.AI Constants", () => {
  describe("suggestions", () => {
    it("should have 8 LV-specific suggestions", () => {
      expect(suggestions.length).toBe(8);
    });

    it("should include Leistungsverzeichnis creation", () => {
      const lvSuggestion = suggestions.find((s) =>
        s.includes("Leistungsverzeichnis")
      );
      expect(lvSuggestion).toBeDefined();
    });

    it("should include DIN 276 cost estimation", () => {
      const dinSuggestion = suggestions.find((s) => s.includes("DIN 276"));
      expect(dinSuggestion).toBeDefined();
    });

    it("should include Preisspiegel comparison", () => {
      const preisspiegel = suggestions.find((s) =>
        s.includes("Preisspiegel")
      );
      expect(preisspiegel).toBeDefined();
    });

    it("should include GAEB import", () => {
      const gaeb = suggestions.find((s) => s.includes("GAEB"));
      expect(gaeb).toBeDefined();
    });

    it("should include Nachtragsformulierung", () => {
      const nachtrag = suggestions.find((s) => s.includes("Nachtrag"));
      expect(nachtrag).toBeDefined();
    });

    it("should include Schlussrechnung check", () => {
      const schlussrechnung = suggestions.find((s) =>
        s.includes("Schlussrechnung")
      );
      expect(schlussrechnung).toBeDefined();
    });

    it("should include Gewährleistungsfristen", () => {
      const gewaehrleistung = suggestions.find((s) =>
        s.includes("Gewährleistungsfristen")
      );
      expect(gewaehrleistung).toBeDefined();
    });

    it("should include Alternativpositionen", () => {
      const alternativ = suggestions.find((s) =>
        s.includes("Alternativpositionen")
      );
      expect(alternativ).toBeDefined();
    });
  });

  describe("guestRegex", () => {
    it("should match guest user pattern", () => {
      expect(guestRegex.test("guest-123")).toBe(true);
    });

    it("should not match regular user", () => {
      expect(guestRegex.test("admin")).toBe(false);
    });
  });

  describe("isTestEnvironment", () => {
    it("should be a boolean", () => {
      expect(typeof isTestEnvironment).toBe("boolean");
    });
  });
});
