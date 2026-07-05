import { describe, expect, it } from "vitest";
import {
  getComplianceForLand,
  COMPLIANCE_DE,
  COMPLIANCE_AT,
  COMPLIANCE_CH,
  getFristen,
  getRechtsgrundlage,
} from "./daech";

describe("D/A/CH Compliance Module", () => {
  describe("getComplianceForLand", () => {
    it("should return DE compliance for DE", () => {
      const compliance = getComplianceForLand("DE");
      expect(compliance.land).toBe("DE");
      expect(compliance.name).toContain("VOB");
    });

    it("should return AT compliance for AT", () => {
      const compliance = getComplianceForLand("AT");
      expect(compliance.land).toBe("AT");
      expect(compliance.name).toContain("ÖNORM");
    });

    it("should return CH compliance for CH", () => {
      const compliance = getComplianceForLand("CH");
      expect(compliance.land).toBe("CH");
      expect(compliance.name).toContain("SIA");
    });

    it("should default to DE for unknown land", () => {
      const compliance = getComplianceForLand("XX");
      expect(compliance.land).toBe("DE");
    });
  });

  describe("COMPLIANCE_DE", () => {
    it("should have VOB/A for Vergabe", () => {
      expect(COMPLIANCE_DE.vergaberecht).toContain("VOB/A");
    });

    it("should have VOB/B for Verträge", () => {
      expect(COMPLIANCE_DE.vertragsrecht).toContain("VOB/B");
    });

    it("should have VOB/C for ATV", () => {
      expect(COMPLIANCE_DE.atv).toContain("VOB/C");
    });

    it("should have DIN 276 for Kosten", () => {
      expect(COMPLIANCE_DE.kostengliederung).toContain("DIN 276");
    });

    it("should have E-Rechnung format", () => {
      expect(COMPLIANCE_DE.eRechnung).toBeDefined();
      expect(COMPLIANCE_DE.eRechnung.length).toBeGreaterThan(0);
    });
  });

  describe("COMPLIANCE_AT", () => {
    it("should have ÖNORM B2110 for Vergabe", () => {
      expect(COMPLIANCE_AT.vergaberecht).toContain("ÖNORM B2110");
    });

    it("should have ÖNORM B2111 for Verträge", () => {
      expect(COMPLIANCE_AT.vertragsrecht).toContain("ÖNORM B2111");
    });
  });

  describe("COMPLIANCE_CH", () => {
    it("should have SIA 118 for Vergabe", () => {
      expect(COMPLIANCE_CH.vergaberecht).toContain("SIA 118");
    });
  });

  describe("getFristen", () => {
    it("should return fristen for DE", () => {
      const fristen = getFristen("DE");
      expect(fristen).toBeDefined();
      expect(fristen.length).toBeGreaterThan(0);
    });

    it("should include Angebotsfrist", () => {
      const fristen = getFristen("DE");
      const angebotsfrist = fristen.find((f) =>
        f.name.includes("Angebotsfrist")
      );
      expect(angebotsfrist).toBeDefined();
    });
  });

  describe("getRechtsgrundlage", () => {
    it("should return legal basis text for DE", () => {
      const text = getRechtsgrundlage("DE", "vergabe");
      expect(text).toContain("VOB/A");
    });

    it("should return legal basis text for AT", () => {
      const text = getRechtsgrundlage("AT", "vergabe");
      expect(text).toContain("ÖNORM");
    });
  });
});
