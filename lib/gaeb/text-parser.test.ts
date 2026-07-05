import { describe, expect, it } from "vitest";
import {
  detectLvFormat,
  LvTextParser,
  parseLvContent,
  parseLvText,
} from "./text-parser";

// ─── Sample-Auszug aus docs/samples/LV_Rohbau_KiTa_Liebigstrasse.md ──────────
// Reduzierter Auszug mit echten Positionen aus dem KiTa-LV, um den Parser
// gegen reale Daten zu validieren.

const SAMPLE_LV_TEXT = `Projekt: 026339 Erd-, Gerüst- und Rohbauarbeiten KiTa Liebigstraße
LV: Rohbauarbeiten Rohbauarbeiten
Auftraggeber: Stadt Ratingen

OZ Leistungsbeschreibung Menge ME Einheitspreis Gesamtbetrag
in EUR in EUR

1.6.10 Kunststoff-Wellrohr M 25 Beton
Isolierstoffrohr DIN VDE 0605 flexibel, für sehr hohe
Druckbeanspruchung, betonfest, hochtemperaturbeständig,
Nenngröße M 25, mit eingeführtem verzinkten Zugdraht,
Verlegung in Ortbeton.
800,000 m ......................... .........................

1.6.20 Kunststoff-Wellrohr M 32 Beton
Isolierstoffrohr DIN VDE 0605 flexibel, Nenngröße M 32
20,000 m ......................... .........................

4.1.50 Stahlbeton, Frostschutzschürze, C20/25, bis 0,50 m³
Frostschutzschürze aus Stahlbeton
12,000 m³ ......................... .........................

4.6.430 Durchstanzbewehrung O 12/230-3/A510
6,000 St ......................... .........................

Summe 4.6. Besondere Einbauteile im Beton .........................

5..40 Mauerwerkswände 11,5
Liefern und Erstellen von nichttragendem Innenmauerwerk
716,000 m² ......................... .........................
`;

const SAMPLE_GAEB_XML = `<?xml version="1.0" encoding="UTF-8"?>
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

describe("LvTextParser", () => {
  describe("parse", () => {
    it("extrahiert Positionen aus tabellarischem LV-Text", () => {
      const result = parseLvText(SAMPLE_LV_TEXT);
      expect(result.success).toBe(true);
      expect(result.positions.length).toBeGreaterThanOrEqual(4);
    });

    it("erkennt OZ-Formate mit einfachen und doppelten Punkten", () => {
      const result = parseLvText(SAMPLE_LV_TEXT);
      const ozValues = result.positions.map((p) => p.oz);
      expect(ozValues).toContain("1.6.10");
      expect(ozValues).toContain("4.1.50");
      expect(ozValues).toContain("5..40");
    });

    it("extrahiert Mengen in deutscher Notation (800,000)", () => {
      const result = parseLvText(SAMPLE_LV_TEXT);
      const pos = result.positions.find((p) => p.oz === "1.6.10");
      expect(pos).toBeDefined();
      expect(pos?.menge).toBe("800,000");
      expect(pos?.einheit).toMatch(/^m$/i);
    });

    it("erkennt Einheiten m³, St, m²", () => {
      const result = parseLvText(SAMPLE_LV_TEXT);
      const m3Pos = result.positions.find((p) => p.oz === "4.1.50");
      const stPos = result.positions.find((p) => p.oz === "4.6.430");
      const m2Pos = result.positions.find((p) => p.oz === "5..40");
      expect(m3Pos?.einheit).toMatch(/m³/i);
      expect(stPos?.einheit).toMatch(/St/i);
      expect(m2Pos?.einheit).toMatch(/m²/i);
    });

    it("überspringt Summenzeilen", () => {
      const result = parseLvText(SAMPLE_LV_TEXT);
      const sumPositions = result.positions.filter((p) =>
        /Summe/i.test(p.kurztext)
      );
      expect(sumPositions).toHaveLength(0);
    });

    it("extrahiert Projektnamen", () => {
      const result = parseLvText(SAMPLE_LV_TEXT);
      expect(result.projectName).toContain("026339");
      expect(result.projectName).toContain("KiTa Liebigstraße");
    });

    it("extrahiert Auftraggeber", () => {
      const result = parseLvText(SAMPLE_LV_TEXT);
      expect(result.auftraggeber).toContain("Stadt Ratingen");
    });

    it("sammelt Langtext bei mehrzeiligen Positionen", () => {
      const result = parseLvText(SAMPLE_LV_TEXT);
      const pos = result.positions.find((p) => p.oz === "1.6.10");
      expect(pos?.langtext).toBeDefined();
      expect(pos?.langtext).toContain("Isolierstoffrohr");
    });

    it("gibt success=false bei leerer Eingabe zurück", () => {
      const result = parseLvText("");
      expect(result.success).toBe(false);
      expect(result.positions).toHaveLength(0);
    });

    it("warnt bei nicht erkannten Positionen", () => {
      const result = parseLvText("nur Text ohne Positionen");
      expect(result.success).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("überspringt Seiten-Header (Druckdatum, Projekt, LV)", () => {
      const text = `Druckdatum: 07.04.2026 Seite: 1 von 96
Projekt: Testprojekt
LV: Rohbauarbeiten
OZ Leistungsbeschreibung Menge ME
1.6.10 Testposition
100,000 m`;
      const result = parseLvText(text);
      const headerPositions = result.positions.filter((p) =>
        /Druckdatum|Projekt:|^LV/i.test(p.kurztext)
      );
      expect(headerPositions).toHaveLength(0);
    });
  });

  describe("detectLvFormat", () => {
    it("erkennt GAEB XML", () => {
      expect(detectLvFormat(SAMPLE_GAEB_XML)).toBe("gaeb-xml");
    });

    it("erkennt LV-Text-Format", () => {
      expect(detectLvFormat(SAMPLE_LV_TEXT)).toBe("lv-text");
    });

    it("gibt 'unknown' bei nicht erkennbarem Format zurück", () => {
      expect(detectLvFormat("nur Fließtext ohne Struktur")).toBe("unknown");
    });

    it("gibt 'unknown' bei leerer Eingabe zurück", () => {
      expect(detectLvFormat("")).toBe("unknown");
    });
  });

  describe("parseLvContent (Unified)", () => {
    it("leitet GAEB XML an GaebParser weiter", async () => {
      const result = await parseLvContent(SAMPLE_GAEB_XML);
      expect(result.format).toBe("gaeb-xml");
      expect(result.gaebResult).toBeDefined();
      expect(result.gaebResult?.success).toBe(true);
      expect(result.gaebResult?.projectName).toBe("Testprojekt");
    });

    it("leitet LV-Text an LvTextParser weiter", async () => {
      const result = await parseLvContent(SAMPLE_LV_TEXT);
      expect(result.format).toBe("lv-text");
      expect(result.lvTextResult).toBeDefined();
      expect(result.lvTextResult?.success).toBe(true);
    });

    it("gibt 'unknown' zurück bei nicht erkennbarem Format", async () => {
      const result = await parseLvContent("unstrukturierter Text");
      expect(result.format).toBe("unknown");
    });
  });

  describe("LvTextParser Klasse direkt", () => {
    it("kann instanziiert und aufgerufen werden", () => {
      const parser = new LvTextParser();
      const result = parser.parse("1.6.10 Test\n100,000 m");
      expect(result.positions.length).toBeGreaterThan(0);
    });
  });
});
