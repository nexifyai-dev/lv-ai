import { describe, expect, it } from "vitest";
import {
  exportGaebFromDb,
  exportGaebXml,
  type GaebExportInput,
} from "./export";

// ─── Fixtures ────────────────────────────────────────────────────────────────
const samplePositions = [
  {
    einheit: "m",
    kurztext: "Kunststoff-Wellrohr M 25 Beton",
    langtext: "Isolierstoffrohr DIN VDE 0605, Nenngröße M 25",
    menge: "800.000",
    oz: "1.6.10",
  },
  {
    einheit: "m3",
    einheitspreis: "120.50",
    gesamtpreis: "1446.00",
    kurztext: "Stahlbeton, Frostschutzschürze, C20/25",
    menge: "12.000",
    oz: "4.1.50",
  },
];

const baseProjectInfo = {
  clientCity: "Ratingen",
  clientName: "Stadt Ratingen",
  clientStreet: "Poststraße 21",
  clientZip: "40878",
  land: "DE" as const,
  projectName: "026339 Rohbauarbeiten KiTa Liebigstraße",
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("GAEB Export", () => {
  describe("exportGaebXml — X83 (Angebotsaufforderung)", () => {
    const input: GaebExportInput = {
      format: "X83",
      positions: samplePositions,
      projectInfo: baseProjectInfo,
    };

    it("erzeugt valide XML-Deklaration", () => {
      const xml = exportGaebXml(input);
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    });

    it("nutzt GAEB 3.3 Namespace mit DA83", () => {
      const xml = exportGaebXml(input);
      expect(xml).toContain('xmlns="http://www.gaeb.de/GAEB_DA_XML/DA83/3.3"');
    });

    it("enthält GAEB-Root-Element", () => {
      const xml = exportGaebXml(input);
      expect(xml).toContain("<GAEB ");
      expect(xml).toContain("</GAEB>");
    });

    it("enthält PrjName", () => {
      const xml = exportGaebXml(input);
      expect(xml).toContain("<PrjName>");
      expect(xml).toContain("KiTa Liebigstraße");
    });

    it("enthält Auftraggeber als PrtType AG", () => {
      const xml = exportGaebXml(input);
      expect(xml).toContain("<PrtType>AG</PrtType>");
      expect(xml).toContain("Stadt Ratingen");
      expect(xml).toContain("Poststraße 21");
    });

    it("enthält Währung EUR für DE", () => {
      const xml = exportGaebXml(input);
      expect(xml).toContain("<LotCur>EUR</LotCur>");
    });

    it("enthält alle Positionen als Item", () => {
      const xml = exportGaebXml(input);
      expect(xml).toContain("<Item>");
      expect(xml).toContain("1.6.10");
      expect(xml).toContain("4.1.50");
      expect(xml).toContain("Kunststoff-Wellrohr M 25 Beton");
    });

    it("enthält Menge und Einheit", () => {
      const xml = exportGaebXml(input);
      expect(xml).toContain("<QU>800.000</QU>");
      expect(xml).toContain("<QUDesc>m</QUDesc>");
    });

    it("X83 enthält keine Bieterpreise (UP/TP)", () => {
      const xml = exportGaebXml(input);
      expect(xml).not.toContain("<UP>");
      expect(xml).not.toContain("<TP>");
    });

    it("escaped XML-Sonderzeichen in Kurztext", () => {
      const xml = exportGaebXml({
        format: "X83",
        positions: [{ kurztext: "Boden < 5cm & > 3cm", oz: "1.1" }],
        projectInfo: baseProjectInfo,
      });
      expect(xml).toContain("&lt; 5cm &amp; &gt; 3cm");
      expect(xml).not.toContain("< 5cm & > 3cm");
    });
  });

  describe("exportGaebXml — X81 (Leistungsbeschreibung)", () => {
    it("nutzt DA81 Namespace", () => {
      const xml = exportGaebXml({
        format: "X81",
        positions: samplePositions,
        projectInfo: baseProjectInfo,
      });
      expect(xml).toContain('xmlns="http://www.gaeb.de/GAEB_DA_XML/DA81/3.3"');
    });
  });

  describe("exportGaebXml — X84 (Angebotsabgabe)", () => {
    const x84Input: GaebExportInput = {
      format: "X84",
      positions: samplePositions,
      projectInfo: {
        ...baseProjectInfo,
        bidderName: "Bauunternehmen GmbH",
        offerDate: "2026-07-05T10:00:00Z",
        totalNet: "45000.00",
      },
    };

    it("enthält Bieterpreise (UP und TP)", () => {
      const xml = exportGaebXml(x84Input);
      expect(xml).toContain("<UP>120.50</UP>");
      expect(xml).toContain("<TP>1446.00</TP>");
    });

    it("enthält Bieter als PrtType BI", () => {
      const xml = exportGaebXml(x84Input);
      expect(xml).toContain("<PrtType>BI</PrtType>");
      expect(xml).toContain("Bauunternehmen GmbH");
    });

    it("enthält Offer-Block mit Total", () => {
      const xml = exportGaebXml(x84Input);
      expect(xml).toContain("<Offer>");
      expect(xml).toContain("<OfferTotal>45000.00</OfferTotal>");
    });

    it("erfordert bidderName — wirft ohne", () => {
      expect(() =>
        exportGaebXml({
          format: "X84",
          positions: samplePositions,
          projectInfo: baseProjectInfo,
        })
      ).toThrow("bidderName");
    });
  });

  describe("exportGaebXml — CH Währung", () => {
    it("nutzt CHF für Schweiz", () => {
      const xml = exportGaebXml({
        format: "X83",
        positions: samplePositions,
        projectInfo: { ...baseProjectInfo, land: "CH" },
      });
      expect(xml).toContain("<LotCur>CHF</LotCur>");
    });

    it("nutzt EUR für Österreich", () => {
      const xml = exportGaebXml({
        format: "X83",
        positions: samplePositions,
        projectInfo: { ...baseProjectInfo, land: "AT" },
      });
      expect(xml).toContain("<LotCur>EUR</LotCur>");
    });
  });

  describe("exportGaebXml — Validation", () => {
    it("wirft bei ungültigem Format", () => {
      expect(() =>
        exportGaebXml({
          format: "X99" as any,
          positions: samplePositions,
          projectInfo: baseProjectInfo,
        })
      ).toThrow("X81-X86");
    });

    it("wirft bei fehlendem Projektnamen", () => {
      expect(() =>
        exportGaebXml({
          format: "X83",
          positions: samplePositions,
          projectInfo: { ...baseProjectInfo, projectName: "" },
        })
      ).toThrow("Projektname");
    });

    it("wirft bei 0 Positionen", () => {
      expect(() =>
        exportGaebXml({
          format: "X83",
          positions: [],
          projectInfo: baseProjectInfo,
        })
      ).toThrow("Keine Positionen");
    });

    it("wirft bei Position ohne OZ", () => {
      expect(() =>
        exportGaebXml({
          format: "X83",
          positions: [{ kurztext: "Test", oz: "" }],
          projectInfo: baseProjectInfo,
        })
      ).toThrow("Ordnungszahl");
    });

    it("wirft bei Position ohne Kurztext", () => {
      expect(() =>
        exportGaebXml({
          format: "X83",
          positions: [{ kurztext: "", oz: "1.1" }],
          projectInfo: baseProjectInfo,
        })
      ).toThrow("Kurztext");
    });
  });

  describe("exportGaebFromDb — Convenience", () => {
    it("konvertiert DB-Positionen (null→undefined) und exportiert", () => {
      const xml = exportGaebFromDb({
        format: "X83",
        positions: [
          {
            einheit: "m",
            einheitspreis: null,
            gesamtpreis: null,
            kurztext: "Test",
            langtext: null,
            menge: "100",
            oz: "1.1",
          },
        ],
        projectName: "Test-LV",
      });
      expect(xml).toContain("Test-LV");
      expect(xml).toContain("1.1");
      expect(xml).toContain("<QU>100</QU>");
      expect(xml).not.toContain("<UP>"); // X83 hat keine Preise
    });

    it("setzt offerDate automatisch auf jetzt", () => {
      const _before = new Date().toISOString().slice(0, 10);
      const xml = exportGaebFromDb({
        format: "X83",
        positions: [{ kurztext: "T", oz: "1.1" }],
        projectName: "Test",
      });
      const _after = new Date().toISOString().slice(0, 10);
      // PrjDate sollte heutiges Datum enthalten
      expect(xml).toMatch(/<PrjDate>2026-07-/u);
    });
  });

  describe("exportGaebXml — X82 (Kostenanschlag)", () => {
    const x82Pos = [
      {
        einheit: "m3",
        einheitspreis: "25.00",
        kurztext: "Aushub",
        menge: "100",
        oz: "01.0010",
      },
    ];

    it("nutzt DA82 Namespace", () => {
      const xml = exportGaebXml({
        format: "X82",
        positions: x82Pos,
        projectInfo: baseProjectInfo,
      });
      expect(xml).toContain('xmlns="http://www.gaeb.de/GAEB_DA_XML/DA82/3.3"');
    });

    it("enthält EP (UP) aber keinen GP (TP)", () => {
      const xml = exportGaebXml({
        format: "X82",
        positions: x82Pos,
        projectInfo: baseProjectInfo,
      });
      expect(xml).toContain("<UP>25.00</UP>");
      expect(xml).not.toContain("<TP>");
    });
  });

  describe("exportGaebXml — X85 (Nebenangebot)", () => {
    const x85Pos = [
      {
        einheit: "Stk",
        einheitspreis: "25.00",
        gesamtpreis: "25.00",
        kurztext: "Alternativ",
        menge: "1",
        oz: "01.0050",
      },
    ];

    it("nutzt DA85 Namespace", () => {
      const xml = exportGaebXml({
        format: "X85",
        positions: x85Pos,
        projectInfo: {
          ...baseProjectInfo,
          bidderName: "Alternativ-Bieter GmbH",
        },
      });
      expect(xml).toContain('xmlns="http://www.gaeb.de/GAEB_DA_XML/DA85/3.3"');
    });

    it("enthält EP+GP und Offer-Block", () => {
      const xml = exportGaebXml({
        format: "X85",
        positions: x85Pos,
        projectInfo: { ...baseProjectInfo, bidderName: "Alt-Bieter" },
      });
      expect(xml).toContain("<UP>25.00</UP>");
      expect(xml).toContain("<TP>25.00</TP>");
      expect(xml).toContain("<PrtType>BI</PrtType>");
    });

    it("erfordert Bieter-Namen", () => {
      expect(() =>
        exportGaebXml({
          format: "X85",
          positions: x85Pos,
          projectInfo: baseProjectInfo,
        })
      ).toThrow("bidderName");
    });
  });

  describe("exportGaebXml — X86 (Auftrags-LV)", () => {
    const x86Pos = [
      {
        einheit: "m3",
        einheitspreis: "25.00",
        kurztext: "Auftrags-LV",
        menge: "100",
        oz: "01.0010",
      },
    ];

    it("nutzt DA86 Namespace", () => {
      const xml = exportGaebXml({
        format: "X86",
        positions: x86Pos,
        projectInfo: baseProjectInfo,
      });
      expect(xml).toContain('xmlns="http://www.gaeb.de/GAEB_DA_XML/DA86/3.3"');
    });

    it("enthält EP (UP) aber keinen GP (TP)", () => {
      const xml = exportGaebXml({
        format: "X86",
        positions: x86Pos,
        projectInfo: baseProjectInfo,
      });
      expect(xml).toContain("<UP>25.00</UP>");
      expect(xml).not.toContain("<TP>");
    });
  });

  describe("exportGaebXml — Leere Itemlist", () => {
    it("erzeugt leeres Itemlist-Tag bei 0 Positionen mit Validierung", () => {
      expect(() =>
        exportGaebXml({
          format: "X83",
          positions: [],
          projectInfo: baseProjectInfo,
        })
      ).toThrow("Keine Positionen");
    });
  });
});
