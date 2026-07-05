import { describe, expect, it } from "vitest";
import {
  parseGaebXml,
  detectGaebFormat,
  extractPositions,
  GaebParser,
  GAEB_FORMATS,
} from "./parser";

describe("GAEB Parser", () => {
  describe("GAEB_FORMATS", () => {
    it("should define all GAEB exchange phases", () => {
      expect(GAEB_FORMATS.X81).toBe("Leistungsbeschreibung");
      expect(GAEB_FORMATS.X82).toBe("Kostenanschlag");
      expect(GAEB_FORMATS.X83).toBe("Angebotsaufforderung");
      expect(GAEB_FORMATS.X84).toBe("Angebotsabgabe");
      expect(GAEB_FORMATS.X85).toBe("Nebenangebot");
      expect(GAEB_FORMATS.X86).toBe("Auftragserteilung");
      expect(GAEB_FORMATS.X87).toBe("Auftragsbestätigung");
      expect(GAEB_FORMATS.X89).toBe("Rechnung");
    });
  });

  describe("GaebParser", () => {
    it("should create a parser instance", () => {
      const parser = new GaebParser();
      expect(parser).toBeDefined();
    });

    it("should parse valid GAEB XML", () => {
      const parser = new GaebParser();
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/DA83/3.2">
  <PrjInfo>
    <PrjName>Testprojekt</PrjName>
  </PrjInfo>
  <Award>
    <Lot>
      <BoQ>
        <BoQBody>
          <Itemlist>
            <Item>
              <IDno>01.0010</IDno>
              <Description>
                <ShortDesc>Boden aushuben</ShortDesc>
                <LongDesc>Boden fur Streifenfundamente aushuben</LongDesc>
              </Description>
              <QU>100.000</QU>
              <QUDesc>m3</QUDesc>
            </Item>
          </Itemlist>
        </BoQBody>
      </BoQ>
    </Lot>
  </Award>
</GAEB>`;

      const result = parser.parse(xml);
      expect(result.success).toBe(true);
      expect(result.projectName).toBe("Testprojekt");
      expect(result.positions.length).toBe(1);
      expect(result.positions[0].oz).toBe("01.0010");
      expect(result.positions[0].kurztext).toBe("Boden aushuben");
      expect(result.positions[0].menge).toBe("100.000");
      expect(result.positions[0].einheit).toBe("m3");
    });

    it("should handle invalid XML gracefully", () => {
      const parser = new GaebParser();
      const result = parser.parse("not xml");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should detect GAEB format from namespace", () => {
      const parser = new GaebParser();
      const xml83 = `<GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/DA83/3.2"></GAEB>`;
      const format = parser.detectFormat(xml83);
      expect(format).toBe("X83");
    });
  });

  describe("extractPositions", () => {
    it("should extract positions from parsed result", () => {
      const positions = [
        {
          oz: "01.0010",
          kurztext: "Test",
          langtext: "Test Beschreibung",
          menge: "100",
          einheit: "m3",
        },
      ];
      expect(positions.length).toBe(1);
      expect(positions[0].oz).toBe("01.0010");
    });
  });
});
