import { describe, expect, it } from "vitest";
import {
  artifactsPrompt,
  codePrompt,
  getRequestPromptFromHints,
  regularPrompt,
  sheetPrompt,
  systemPrompt,
  titlePrompt,
  updateDocumentPrompt,
} from "./prompts";

describe("LV.AI Prompts", () => {
  describe("regularPrompt", () => {
    it("should contain LV.AI identity", () => {
      expect(regularPrompt).toContain("LV.AI");
      expect(regularPrompt).toContain("AVA");
    });

    it("should mention D/A/CH region", () => {
      expect(regularPrompt).toContain("D/A/CH");
    });

    it("should mention GAEB DA XML", () => {
      expect(regularPrompt).toContain("GAEB DA XML");
      expect(regularPrompt).toContain("X81");
      expect(regularPrompt).toContain("X86");
    });

    it("should mention all three legal frameworks", () => {
      expect(regularPrompt).toContain("VOB/A");
      expect(regularPrompt).toContain("ÖNORM B2110");
      expect(regularPrompt).toContain("SIA 118");
    });

    it("should mention DIN 276 for cost estimation", () => {
      expect(regularPrompt).toContain("DIN 276");
    });

    it("should mention E-Rechnung formats", () => {
      expect(regularPrompt).toContain("XRechnung");
      expect(regularPrompt).toContain("ZUGFeRD");
    });

    it("should define LV-Position format", () => {
      expect(regularPrompt).toContain("OZ");
      expect(regularPrompt).toContain("Kurztext");
      expect(regularPrompt).toContain("Langtext");
      expect(regularPrompt).toContain("Mengeneinheit");
    });

    it("should mention DIN 18299 Gewerke", () => {
      expect(regularPrompt).toContain("DIN 18299");
      expect(regularPrompt).toContain("Rohbau");
      expect(regularPrompt).toContain("SHK");
    });

    it("should specify German language", () => {
      expect(regularPrompt).toContain("Deutsch");
    });
  });

  describe("artifactsPrompt", () => {
    it("should mention LV-specific use cases", () => {
      expect(artifactsPrompt).toContain("LV");
      expect(artifactsPrompt).toContain("Preisspiegel");
    });

    it("should define tool usage rules", () => {
      expect(artifactsPrompt).toContain("createDocument");
      expect(artifactsPrompt).toContain("editDocument");
      expect(artifactsPrompt).toContain("updateDocument");
    });
  });

  describe("systemPrompt", () => {
    const mockHints = {
      latitude: "51.1657",
      longitude: "10.4515",
      city: "Berlin",
      country: "DE",
    };

    it("should include regular prompt", () => {
      const result = systemPrompt({
        requestHints: mockHints,
        supportsTools: false,
      });
      expect(result).toContain("LV.AI");
    });

    it("should include request hints", () => {
      const result = systemPrompt({
        requestHints: mockHints,
        supportsTools: false,
      });
      expect(result).toContain("Berlin");
      expect(result).toContain("DE");
    });

    it("should include artifacts prompt when tools supported", () => {
      const result = systemPrompt({
        requestHints: mockHints,
        supportsTools: true,
      });
      expect(result).toContain("createDocument");
    });

    it("should not include artifacts prompt when tools not supported", () => {
      const result = systemPrompt({
        requestHints: mockHints,
        supportsTools: false,
      });
      expect(result).not.toContain("createDocument");
    });

    it("should include project context when provided", () => {
      const result = systemPrompt({
        requestHints: mockHints,
        supportsTools: false,
        projectContext: "Projekt: KiTa Liebigstraße, Land: DE, Gewerk: Rohbau",
      });
      expect(result).toContain("KiTa Liebigstraße");
      expect(result).toContain("Aktuelles Projekt");
    });
  });

  describe("getRequestPromptFromHints", () => {
    it("should format hints correctly", () => {
      const result = getRequestPromptFromHints({
        latitude: "48.2082",
        longitude: "16.3738",
        city: "Wien",
        country: "AT",
      });
      expect(result).toContain("48.2082");
      expect(result).toContain("16.3738");
      expect(result).toContain("Wien");
      expect(result).toContain("AT");
    });
  });

  describe("sheetPrompt", () => {
    it("should mention GAEB-compliant headers", () => {
      expect(sheetPrompt).toContain("GAEB");
      expect(sheetPrompt).toContain("OZ");
      expect(sheetPrompt).toContain("Kurztext");
    });

    it("should mention German decimal notation", () => {
      expect(sheetPrompt).toContain("German decimal");
    });
  });

  describe("titlePrompt", () => {
    it("should specify German language for titles", () => {
      expect(titlePrompt).toContain("German");
    });

    it("should contain AVA-specific examples", () => {
      expect(titlePrompt).toContain("LV Rohbauarbeiten");
      expect(titlePrompt).toContain("Bieterauswertung");
      expect(titlePrompt).toContain("Kostenschätzung");
    });
  });

  describe("codePrompt", () => {
    it("should define code generation rules", () => {
      expect(codePrompt).toContain("complete and runnable");
      expect(codePrompt).toContain("console.log");
    });
  });

  describe("updateDocumentPrompt", () => {
    it("should return prompt with current content", () => {
      const result = updateDocumentPrompt("test content", "text");
      expect(result).toContain("test content");
      expect(result).toContain("document");
    });

    it("should map sheet type correctly", () => {
      const result = updateDocumentPrompt("data", "sheet");
      expect(result).toContain("spreadsheet");
    });

    it("should map code type correctly", () => {
      const result = updateDocumentPrompt("code", "code");
      expect(result).toContain("script");
    });
  });
});
