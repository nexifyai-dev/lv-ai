// ─── GAEB DA XML Parser ──────────────────────────────────────────────────────
// Parser für GAEB DA XML Formate (X81–X89) — D/A/CH Standard für LV-Austausch.
// Implementierung basierend auf GAEB DA XML 3.2/3.3 Spezifikation.

export const GAEB_FORMATS: Record<string, string> = {
  X81: "Leistungsbeschreibung",
  X82: "Kostenanschlag",
  X83: "Angebotsaufforderung",
  X84: "Angebotsabgabe",
  X85: "Nebenangebot",
  X86: "Auftragserteilung",
  X87: "Auftragsbestätigung",
  X89: "Rechnung",
};

export interface GaebPosition {
  oz: string; // Ordnungszahl (z.B. 01.0020)
  kurztext: string;
  langtext?: string;
  menge?: string;
  einheit?: string;
  einheitspreis?: string;
  gesamtpreis?: string;
  positionstyp?: "standard" | "alternativ" | "nachtrag";
}

export interface GaebParseResult {
  success: boolean;
  projectName?: string;
  projectDescription?: string;
  gaebFormat?: string;
  positions: GaebPosition[];
  error?: string;
  rawXml?: string;
}

export class GaebParser {
  private parser: DOMParser | null = null;

  constructor() {
    // DOMParser ist in Browser und Node 21+ verfügbar
    if (typeof DOMParser !== "undefined") {
      this.parser = new DOMParser();
    }
  }

  /**
   * Erkennt das GAEB-Format aus dem XML-Namespace.
   */
  detectFormat(xml: string): string | null {
    // Suche nach DA81, DA82, DA83, DA84, DA85, DA86, DA87, DA89 im Namespace
    const match = xml.match(/GAEB_DA_XML\/DA(\d{2})/);
    if (match) {
      return `X${match[1]}`;
    }
    return null;
  }

  /**
   * Parst GAEB DA XML und extrahiert Projektinformationen und Positionen.
   */
  parse(xml: string): GaebParseResult {
    try {
      // Einfache XML-Verarbeitung mit Regex (für Node.js ohne DOMParser)
      const gaebFormat = this.detectFormat(xml);

      // Projektname extrahieren
      const projectName = this.extractTag(xml, "PrjName") || "Unbenanntes Projekt";
      const projectDescription = this.extractTag(xml, "PrjDescription") || undefined;

      // Positionen extrahieren
      const positions = this.extractPositionsFromXml(xml);

      return {
        success: true,
        projectName,
        projectDescription,
        gaebFormat: gaebFormat || undefined,
        positions,
      };
    } catch (error) {
      return {
        success: false,
        positions: [],
        error: error instanceof Error ? error.message : "Unbekannter Parser-Fehler",
        rawXml: xml,
      };
    }
  }

  /**
   * Extrahiert den Inhalt eines XML-Tags.
   */
  private extractTag(xml: string, tagName: string): string | null {
    const regex = new RegExp(`<${tagName}[^>]*>([^<]*)<\\/${tagName}>`, "i");
    const match = xml.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extrahiert alle Positionen aus der GAEB XML.
   */
  private extractPositionsFromXml(xml: string): GaebPosition[] {
    const positions: GaebPosition[] = [];

    // Finde alle Item-Elemente
    const itemRegex = /<Item[^>]*>([\s\S]*?)<\/Item>/gi;
    let itemMatch = itemRegex.exec(xml);

    while (itemMatch !== null) {
      const itemXml = itemMatch[1];

      // Extrahiere Positionsdetails
      const oz = this.extractTag(itemXml, "IDno") || "";
      const kurztext = this.extractTag(itemXml, "ShortDesc") || "";
      const langtext = this.extractTag(itemXml, "LongDesc") || undefined;
      const menge = this.extractTag(itemXml, "QU") || undefined;
      const einheit = this.extractTag(itemXml, "QUDesc") || undefined;

      if (oz || kurztext) {
        positions.push({
          oz,
          kurztext,
          langtext,
          menge,
          einheit,
          positionstyp: "standard",
        });
      }

      itemMatch = itemRegex.exec(xml);
    }

    return positions;
  }

  /**
   * Erzeugt eine einfache GAEB XML für Export.
   */
  generateXml(
    projectName: string,
    positions: GaebPosition[],
    format: string = "X83"
  ): string {
    const nsPrefix = format.replace("X", "DA");
    const positionsXml = positions
      .map(
        (p) => `        <Item>
          <IDno>${this.escapeXml(p.oz)}</IDno>
          <Description>
            <ShortDesc>${this.escapeXml(p.kurztext)}</ShortDesc>${p.langtext ? `
            <LongDesc>${this.escapeXml(p.langtext)}</LongDesc>` : ""}
          </Description>${p.menge ? `
          <QU>${this.escapeXml(p.menge)}</QU>` : ""}${p.einheit ? `
          <QUDesc>${this.escapeXml(p.einheit)}</QUDesc>` : ""}
        </Item>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/${nsPrefix}/3.2">
  <PrjInfo>
    <PrjName>${this.escapeXml(projectName)}</PrjName>
  </PrjInfo>
  <Award>
    <Lot>
      <BoQ>
        <BoQBody>
          <Itemlist>
${positionsXml}
          </Itemlist>
        </BoQBody>
      </BoQ>
    </Lot>
  </Award>
</GAEB>`;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}

// ─── Convenience Functions ───────────────────────────────────────────────────

export function parseGaebXml(xml: string): GaebParseResult {
  const parser = new GaebParser();
  return parser.parse(xml);
}

export function detectGaebFormat(xml: string): string | null {
  const parser = new GaebParser();
  return parser.detectFormat(xml);
}

export function extractPositions(xml: string): GaebPosition[] {
  const result = parseGaebXml(xml);
  return result.positions;
}
