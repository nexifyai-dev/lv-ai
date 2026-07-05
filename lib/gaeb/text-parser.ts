// ─── LV Text-Parser ──────────────────────────────────────────────────────────
// Parst tabellarische Leistungsverzeichnisse aus PDF-Text-Extrakten oder
// Excel-Exporten, die NICHT dem GAEB DA XML Format entsprechen.
//
// Erkanntes Format (basierend auf echten LVs wie dem Sample
// "Rohbauarbeiten KiTa Liebigstraße"):
//   - Tabellen mit Spalten: OZ | Leistungsbeschreibung | Menge | ME | EP | GP
//   - OZ-Format: N.NN oder N.NN.NN (z.B. 1.6.10, 4.1.50, 5..40)
//   - Hinweistexte: Zeilen ohne OZ, die mit "Hinweistext" beginnen oder
//     als Blocks zwischen Positionen stehen
//   - Summenzeilen: "Summe X.Y ..." — werden übersprungen
//   - Mengen: Deutsche Notation mit Komma (800,000 m) oder Punkt (800.000)
//
// Dieser Parser ist bewusst heuristisch — für strukturierte GAEB-Importe
// weiterhin lib/gaeb/parser.ts verwenden.

import type { GaebParseResult, GaebPosition } from "./parser";

// Re-Export von GAEB_FORMATS, damit Verbraucher beide Parser aus einem Modul
// importieren können — biome:noExportedImports würde sonst meckern, weil
// GAEB_FORMATS nur ein Re-Export wäre.
export { GAEB_FORMATS } from "./parser";

export interface LvTextParseResult {
  success: boolean;
  projectName?: string;
  auftraggeber?: string;
  positions: GaebPosition[];
  hinweistexte: string[];
  warnings: string[];
  error?: string;
}

// ─── OZ-Pattern ──────────────────────────────────────────────────────────────
// OZ kann sein: 1.6.10, 4.1.50, 5..40 (double-dot Tippfehler aus Sample),
// 01.0020 (GAEB-Stil). Wir akzeptieren N[.N]* mit 1-4 Segmenten und
// tolerieren bis zu 2 aufeinanderfolgende Punkte (Tippfehler in echten LVs).
const _OZ_PATTERN = /(\d{1,4}(?:\.{1,2}\d{1,4}){0,4})/;

// Menge: Deutsche Notation 800,000 oder internationale 800.000 oder 800
// Akzeptiert bis zu 3 Nachkommastellen, optionales Tausendertrennzeichen.
const _MENGE_PATTERN =
  /^(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,3})?|\d+(?:[.,]\d{1,3})?)$/;

// ME: m, m², m³, kg, t, St, Stk, PSCH, lfm, h, d — typische AVA-Einheiten.
// Reihenfolge ist wichtig: m³/m² müssen VOR m stehen, sonst matched m zuerst
// und schneidet das ³/² ab.
const _EINHEIT_PATTERN = /^(m³|m²|m|qm|kg|t|St\.?|Stk\.?|PSCH|lfm|h|d)$/i;

// Summenzeile: "Summe 1.6. Leerrohrverkabelung Ortbeton ........................."
const SUMME_PATTERN = /^Summe\s+/i;

// Hinweistext-Marker
const HINWEIS_PATTERN = /^Hinweistext$/i;

export class LvTextParser {
  /**
   * Parst tabellarischen LV-Text und extrahiert Positionen.
   *
   * @param text Rohttext aus PDF-Extraktion oder Excel-Export
   * @returns ParseResult mit Positionen, Hinweistexten und Warnungen
   */
  parse(text: string): LvTextParseResult {
    if (typeof text !== "string" || text.trim().length === 0) {
      return {
        success: false,
        positions: [],
        hinweistexte: [],
        warnings: ["Eingabe ist leer oder kein String."],
      };
    }

    const warnings: string[] = [];
    const hinweistexte: string[] = [];
    const positions: GaebPosition[] = [];

    // Projektdaten extrahieren (optional)
    const projectName = this.extractProjectName(text);
    const auftraggeber = this.extractAuftraggeber(text);

    // Zeilen normalisieren: CRLF → LF, Tabs → Leerzeichen
    const lines = text
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, " ")
      .split("\n")
      .map((l) => l.trim());

    let currentOz: string | null = null;
    let currentKurztext: string | null = null;
    let currentLangtext: string[] = [];
    let currentMenge: string | undefined;
    let currentEinheit: string | undefined;
    let inHinweistext = false;
    let hinweistextBuffer: string[] = [];

    const flushHinweistext = () => {
      if (hinweistextBuffer.length > 0) {
        const joined = hinweistextBuffer.join(" ").trim();
        if (joined) {
          hinweistexte.push(joined);
        }
        hinweistextBuffer = [];
      }
      inHinweistext = false;
    };

    const flushPosition = () => {
      if (currentOz && currentKurztext) {
        const langtext = currentLangtext.join(" ").trim();
        positions.push({
          oz: currentOz,
          kurztext: currentKurztext,
          langtext: langtext || undefined,
          menge: currentMenge,
          einheit: currentEinheit,
          positionstyp: "standard",
        });
      }
      currentOz = null;
      currentKurztext = null;
      currentLangtext = [];
      currentMenge = undefined;
      currentEinheit = undefined;
    };

    for (const line of lines) {
      if (!line) {
        continue;
      }

      // Hinweistext-Block erkennen
      if (HINWEIS_PATTERN.test(line)) {
        flushPosition();
        flushHinweistext();
        inHinweistext = true;
        continue;
      }

      if (inHinweistext) {
        // Hinweistext läuft bis zur nächsten OZ-Zeile oder Summe
        if (this.isPositionLine(line)) {
          inHinweistext = false;
          flushHinweistext();
        } else if (SUMME_PATTERN.test(line)) {
          inHinweistext = false;
          flushHinweistext();
          continue;
        } else {
          hinweistextBuffer.push(line);
          continue;
        }
      }

      // Summenzeile überspringen, aber aktuelle Position flushen
      if (SUMME_PATTERN.test(line)) {
        flushPosition();
        continue;
      }

      // Seiten-Header überspringen (Druckdatum, Projekt-Zeile)
      if (/^Druckdatum:/i.test(line) || /^Seite:\s*\d+/i.test(line)) {
        continue;
      }
      if (/^Projekt:\s+/i.test(line) || /^LV:\s+/i.test(line)) {
        continue;
      }
      if (/^OZ\s+Leistungsbeschreibung/i.test(line)) {
        continue;
      }
      if (/^in EUR/i.test(line)) {
        continue;
      }

      // Position-Zeile erkennen: beginnt mit OZ, gefolgt von Text
      const posMatch = this.matchPositionLine(line);
      if (posMatch) {
        flushPosition();
        currentOz = posMatch.oz;
        currentKurztext = posMatch.kurztext;
        currentMenge = posMatch.menge;
        currentEinheit = posMatch.einheit;
        continue;
      }

      // Mengen-/Einheiten-Zeile am Ende einer Position
      // Format: "800,000 m ......................... ........................."
      const mengeMatch = this.matchMengeLine(line);
      if (mengeMatch && currentOz && !currentMenge) {
        currentMenge = mengeMatch.menge;
        currentEinheit = mengeMatch.einheit;
        continue;
      }

      // Langtext-Fortsetzung: Zeile gehört zur aktuellen Position
      if (currentOz && currentKurztext && !currentMenge) {
        currentLangtext.push(line);
        // biome-ignore lint/complexity/noUselessContinue: Loop hat nachfolgende Branches, continue ist explizit klarer
        continue;
      }

      // Ignorierte Zeilen (Punkte, Trennzeichen etc.) werden nicht
      // weiterverarbeitet — am Loop-Ende ist das implizit ein "continue".
      // Kein separater if-Block nötig, da nachfolgende Logik diese Zeilen
      // ohnehin nicht matcht (keine OZ, kein Hinweistext-Marker etc.).
    }

    // Letzte Position flushen
    flushPosition();
    flushHinweistext();

    if (positions.length === 0) {
      warnings.push(
        "Keine Positionen extrahiert — Format evtl. nicht erkannt."
      );
    }

    return {
      success: positions.length > 0,
      projectName,
      auftraggeber,
      positions,
      hinweistexte,
      warnings,
    };
  }

  // ─── Helper: Position-Zeile erkennen ──────────────────────────────────────
  // Eine Position-Zeile beginnt mit einer OZ, gefolgt von Kurztext.
  // Kann inline schon Menge/Einheit am Ende enthalten (selten) oder
  // Kurztext-only (häufig — Menge folgt in eigener Zeile).
  private matchPositionLine(line: string): {
    oz: string;
    kurztext: string;
    menge?: string;
    einheit?: string;
  } | null {
    // OZ muss am Zeilenanfang stehen; toleriert bis zu 2 aufeinanderfolgende
    // Punkte (Tippfehler wie "5..40" in echten LVs).
    const ozMatch = line.match(/^(\d{1,4}(?:\.{1,2}\d{1,4}){0,4})\s+(.+)$/);
    if (!ozMatch) {
      return null;
    }

    const oz = ozMatch[1];
    const rest = ozMatch[2].trim();

    // Summenzeile ausschließen ("Summe 1.6. ..." matcht sonst)
    if (/^Summe\s/i.test(rest)) {
      return null;
    }

    // Versuche, Menge/Einheit am Ende zu extrahieren
    // Format: "Kurztext ... 800,000 m"
    // Reihenfolge im Regex: m³/m² VOR m, damit sie nicht abgeschnitten werden.
    const mengeEndMatch = rest.match(
      /^(.+?)\s+(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,3})?|\d+(?:[.,]\d{1,3})?)\s+(m³|m²|m|qm|kg|t|St\.?|Stk\.?|PSCH|lfm|h|d)$/i
    );

    if (mengeEndMatch) {
      return {
        oz,
        kurztext: mengeEndMatch[1].trim(),
        menge: mengeEndMatch[2],
        einheit: mengeEndMatch[3],
      };
    }

    // Reiner Kurztext ohne Mengen-Angabe
    if (rest.length < 3) {
      return null;
    }
    return {
      oz,
      kurztext: rest,
    };
  }

  private matchMengeLine(line: string): {
    menge: string;
    einheit: string;
  } | null {
    // Format: "800,000 m ......................... ........................."
    // Reihenfolge: m³/m² VOR m. Kein \b-Word-Boundary, weil Unicode-Einheiten
    // (m², m³) sonst abgeschnitten werden.
    const match = line.match(
      /^(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,3})?|\d+(?:[.,]\d{1,3})?)\s+(m³|m²|m|qm|kg|t|St\.?|Stk\.?|PSCH|lfm|h|d)(?:\s|$)/i
    );
    if (!match) {
      return null;
    }
    return { menge: match[1], einheit: match[2] };
  }

  private isPositionLine(line: string): boolean {
    return this.matchPositionLine(line) !== null;
  }

  private extractProjectName(text: string): string | undefined {
    const match = text.match(/^Projekt:\s*(.+)$/m);
    return match?.[1]?.trim();
  }

  private extractAuftraggeber(text: string): string | undefined {
    const match = text.match(/Auftraggeber:\s*(.+?)(?:\n|$)/m);
    return match?.[1]?.trim();
  }
}

// ─── Convenience Functions ───────────────────────────────────────────────────

export function parseLvText(text: string): LvTextParseResult {
  const parser = new LvTextParser();
  return parser.parse(text);
}

// ─── Format-Detection ────────────────────────────────────────────────────────
// Erkennt, ob ein Text GAEB XML oder tabellarisches LV-Format ist.

export type LvFormat = "gaeb-xml" | "lv-text" | "unknown";

export function detectLvFormat(content: string): LvFormat {
  if (typeof content !== "string" || content.trim().length === 0) {
    return "unknown";
  }

  // GAEB XML: hat <GAEB>-Wurzelelement
  if (/<GAEB[\s>]/i.test(content)) {
    return "gaeb-xml";
  }

  // LV-Text: hat typische OZ-Zeilen mit Mengenangaben
  const parser = new LvTextParser();
  const result = parser.parse(content);
  if (result.positions.length > 0) {
    return "lv-text";
  }

  return "unknown";
}

// ─── Unified Parse ───────────────────────────────────────────────────────────
// Erkennt Format automatisch und parst entsprechend.

export async function parseLvContent(content: string): Promise<{
  format: LvFormat;
  gaebResult?: GaebParseResult;
  lvTextResult?: LvTextParseResult;
}> {
  const format = detectLvFormat(content);

  if (format === "gaeb-xml") {
    // ESM-konformer dynamischer Import — `require` geht in Vitest-ESM nicht.
    const { parseGaebXml } = await import("./parser");
    return {
      format,
      gaebResult: parseGaebXml(content),
    };
  }

  if (format === "lv-text") {
    return {
      format,
      lvTextResult: parseLvText(content),
    };
  }

  return { format: "unknown" };
}
