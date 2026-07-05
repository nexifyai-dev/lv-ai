// ─── GAEB DA XML 3.3 Export ──────────────────────────────────────────────────
// Generiert valide GAEB DA XML Dateien aus lv-ai DB-Daten.
// Unterstützte Formate: X81 (Leistungsbeschreibung), X82 (Kostenanschlag), X83 (Angebotsaufforderung),
// X84 (Angebotsabgabe — Bieterpreise), X85 (Nebenangebot), X86 (Auftrags-LV).
//
// Schema: GAEB DA XML 3.3 (Nachfolger von 3.2, abwärtskompatibel).
// Namespace: http://www.gaeb.de/GAEB_DA_XML/DA<XX>/3.3
//
// Verwendung:
//   import { exportGaebXml } from "@/lib/gaeb/export";
//   const xml = exportGaebXml({ format: "X83", projectName, projectInfo, positions });
//   // → valides GAEB XML als String

import type { GaebPosition } from "./parser";

export type GaebFormat = "X81" | "X82" | "X83" | "X84" | "X85" | "X86";

export interface GaebProjectInfo {
  projectName: string;
  projectDescription?: string;
  projectNumber?: string;
  // Auftragsgeber (DE: VOB/A § 9 braucht Auftraggeber-Info)
  clientName?: string;
  clientStreet?: string;
  clientCity?: string;
  clientZip?: string;
  // Land: DE/AT/CH — beeinflusst Currency (EUR/CHF)
  land?: "DE" | "AT" | "CH";
  // Angebotssumme (nur X84 — Bieterpreis)
  totalNet?: string;
  bidderName?: string;
  // Datum der Angebotserstellung (X84)
  offerDate?: string; // ISO 8601
}

export interface GaebExportInput {
  format: GaebFormat;
  projectInfo: GaebProjectInfo;
  positions: GaebPosition[];
}

// ─── Currency-Land-Mapping ───────────────────────────────────────────────────
const CURRENCY_BY_LAND: Record<string, string> = {
  DE: "EUR",
  AT: "EUR",
  CH: "CHF",
};

// ─── Main Export Function ────────────────────────────────────────────────────
export function exportGaebXml(input: GaebExportInput): string {
  const { format, projectInfo, positions } = input;
  validateInput(input);

  const nsPrefix = format.replace("X", "DA");
  const namespace = `http://www.gaeb.de/GAEB_DA_XML/${nsPrefix}/3.3`;
  const currency = CURRENCY_BY_LAND[projectInfo.land ?? "DE"] ?? "EUR";

  const xmlParts: string[] = [];

  // XML-Deklaration
  xmlParts.push(`<?xml version="1.0" encoding="UTF-8"?>`);

  // GAEB-Root mit Namespace
  xmlParts.push(`<GAEB xmlns="${namespace}">`);

  // Projektinformationen
  xmlParts.push(generateProjectInfo(projectInfo, format));

  // Award-Block (Ausschreibung)
  xmlParts.push("  <Award>");
  xmlParts.push(generateLot(projectInfo, positions, format, currency));
  xmlParts.push("  </Award>");

  // X84: Zusätzliche Angebotsdaten
  if (format === "X84" || format === "X85") {
    xmlParts.push(generateOfferBlock(projectInfo));
  }

  xmlParts.push("</GAEB>");

  return xmlParts.join("\n");
}

// ─── ProjectInfo ─────────────────────────────────────────────────────────────
function generateProjectInfo(
  info: GaebProjectInfo,
  format: GaebFormat
): string {
  const parts: string[] = ["  <PrjInfo>"];

  if (info.projectNumber) {
    parts.push(`    <PrjNumber>${escapeXml(info.projectNumber)}</PrjNumber>`);
  }
  parts.push(`    <PrjName>${escapeXml(info.projectName)}</PrjName>`);

  if (info.projectDescription) {
    parts.push(
      `    <PrjDescription>${escapeXml(info.projectDescription)}</PrjDescription>`
    );
  }

  // Auftragsgeber-Info (GAEB 3.3: <PrjInfo><Prt>...</Prt>)
  if (info.clientName) {
    parts.push("    <Prt>");
    parts.push("      <PrtInfo>");
    parts.push("        <PrtType>AG</PrtType>"); // AG = Auftraggeber
    parts.push(`        <PrtName>${escapeXml(info.clientName)}</PrtName>`);
    if (info.clientStreet) {
      parts.push(
        `        <PrtStreet>${escapeXml(info.clientStreet)}</PrtStreet>`
      );
    }
    if (info.clientZip || info.clientCity) {
      parts.push(
        `        <PrtPcode>${escapeXml(info.clientZip ?? "")}</PrtPcode>`
      );
      parts.push(
        `        <PrtCity>${escapeXml(info.clientCity ?? "")}</PrtCity>`
      );
    }
    parts.push("      </PrtInfo>");
    parts.push("    </Prt>");
  }

  // X84: Bieter-Info
  if ((format === "X84" || format === "X85") && info.bidderName) {
    parts.push("    <Prt>");
    parts.push("      <PrtInfo>");
    parts.push("        <PrtType>BI</PrtType>"); // BI = Bieter
    parts.push(`        <PrtName>${escapeXml(info.bidderName)}</PrtName>`);
    parts.push("      </PrtInfo>");
    parts.push("    </Prt>");
  }

  // Datum (GAEB 3.3: <PrjDate>)
  if (info.offerDate) {
    parts.push(`    <PrjDate>${escapeXml(info.offerDate)}</PrjDate>`);
  }

  parts.push("  </PrjInfo>");
  return parts.join("\n");
}

// ─── Lot (Ausschreibungslos) ─────────────────────────────────────────────────
function generateLot(
  info: GaebProjectInfo,
  positions: GaebPosition[],
  format: GaebFormat,
  currency: string
): string {
  const parts: string[] = ["    <Lot>"];

  // LotInfo
  parts.push("      <LotInfo>");
  parts.push(`        <LotName>${escapeXml(info.projectName)}</LotName>`);
  parts.push(`        <LotCur>${currency}</LotCur>`);
  parts.push("      </LotInfo>");

  // BoQ (Leistungsverzeichnis)
  parts.push("      <BoQ>");
  parts.push("        <BoQInfo>");
  parts.push("          <BoQName>Rohbauarbeiten</BoQName>");
  parts.push("          <BoQType>BOQ</BoQType>");
  parts.push("          <BoQIDNo>1</BoQIDNo>");
  parts.push("        </BoQInfo>");

  // BoQBody mit Positionen
  parts.push("        <BoQBody>");
  parts.push(generateItemlist(positions, format));
  parts.push("        </BoQBody>");

  parts.push("      </BoQ>");
  parts.push("    </Lot>");

  return parts.join("\n");
}

// ─── Itemlist (Positionen) ───────────────────────────────────────────────────
function generateItemlist(
  positions: GaebPosition[],
  format: GaebFormat
): string {
  if (positions.length === 0) {
    return "          <Itemlist></Itemlist>";
  }

  const parts: string[] = ["          <Itemlist>"];

  for (const pos of positions) {
    parts.push(generateItem(pos, format));
  }

  parts.push("          </Itemlist>");
  return parts.join("\n");
}

// ─── Einzelne Position ───────────────────────────────────────────────────────
function generateItem(pos: GaebPosition, format: GaebFormat): string {
  const parts: string[] = ["            <Item>"];

  // IDno (Ordnungszahl)
  parts.push(`              <IDno>${escapeXml(pos.oz)}</IDno>`);

  // Description (Kurztext + Langtext)
  parts.push("              <Description>");
  parts.push(
    `                <ShortDesc>${escapeXml(pos.kurztext)}</ShortDesc>`
  );
  if (pos.langtext) {
    parts.push(
      `                <LongDesc>${escapeXml(pos.langtext)}</LongDesc>`
    );
  }
  parts.push("              </Description>");

  // Quantity (Menge + Einheit)
  if (pos.menge) {
    parts.push(`              <QU>${escapeXml(pos.menge)}</QU>`);
  }
  if (pos.einheit) {
    parts.push(`              <QUDesc>${escapeXml(pos.einheit)}</QUDesc>`);
  }

  // Preisfelder: EP (UP) für X82/X84/X85/X86, GP (TP) nur X84/X85
  if (
    (format === "X82" ||
      format === "X84" ||
      format === "X85" ||
      format === "X86") &&
    pos.einheitspreis
  ) {
    parts.push(`              <UP>${escapeXml(pos.einheitspreis)}</UP>`);
  }
  if ((format === "X84" || format === "X85") && pos.gesamtpreis) {
    parts.push(`              <TP>${escapeXml(pos.gesamtpreis)}</TP>`);
  }

  parts.push("            </Item>");
  return parts.join("\n");
}

// ─── Offer-Block (nur X84) ───────────────────────────────────────────────────
function generateOfferBlock(info: GaebProjectInfo): string {
  if (!info.totalNet) {
    return "";
  }

  const parts: string[] = ["  <Offer>"];
  parts.push("    <OfferInfo>");
  parts.push(`      <OfferTotal>${escapeXml(info.totalNet)}</OfferTotal>`);
  if (info.offerDate) {
    parts.push(`      <OfferDate>${escapeXml(info.offerDate)}</OfferDate>`);
  }
  parts.push("    </OfferInfo>");
  parts.push("  </Offer>");

  return parts.join("\n");
}

// ─── Validation ──────────────────────────────────────────────────────────────
function validateInput(input: GaebExportInput): void {
  if (
    !input.format ||
    !["X81", "X82", "X83", "X84", "X85", "X86"].includes(input.format)
  ) {
    throw new Error(
      `Ungültiges GAEB-Format: "${input.format}". Erlaubt: X81-X86.`
    );
  }

  if (!input.projectInfo.projectName?.trim()) {
    throw new Error("Projektname fehlt — GAEB benötigt mindestens PrjName.");
  }

  if (
    (input.format === "X84" || input.format === "X85") &&
    !input.projectInfo.bidderName?.trim()
  ) {
    throw new Error(
      `${input.format} (Angebotsabgabe/Nebenangebot) benötigt bidderName (Bieter).`
    );
  }

  if (input.positions.length === 0) {
    throw new Error("Keine Positionen — GAEB benötigt mindestens 1 Item.");
  }

  // OZ-Validierung
  for (const pos of input.positions) {
    if (!pos.oz?.trim()) {
      throw new Error("Position ohne OZ (Ordnungszahl) — GAEB benötigt IDno.");
    }
    if (!pos.kurztext?.trim()) {
      throw new Error(
        `Position ${pos.oz} ohne Kurztext — GAEB benötigt ShortDesc.`
      );
    }
  }
}

// ─── XML-Escaping ────────────────────────────────────────────────────────────
function escapeXml(text: string): string {
  if (!text) {
    return "";
  }
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ─── Convenience: Export aus DB-Daten ────────────────────────────────────────
// Diese Funktion kann direkt Server-Action/Route nutzen, die lv-queries
// aufruft und die Resultate hier reinreicht.

export interface GaebExportFromDbInput {
  format: GaebFormat;
  projectName: string;
  clientName?: string;
  clientStreet?: string;
  clientCity?: string;
  clientZip?: string;
  land?: "DE" | "AT" | "CH";
  bidderName?: string;
  totalNet?: string;
  positions: Array<{
    oz: string;
    kurztext: string;
    langtext?: string | null;
    menge?: string | null;
    einheit?: string | null;
    einheitspreis?: string | null;
    gesamtpreis?: string | null;
  }>;
}

export function exportGaebFromDb(input: GaebExportFromDbInput): string {
  return exportGaebXml({
    format: input.format,
    projectInfo: {
      projectName: input.projectName,
      clientName: input.clientName,
      clientStreet: input.clientStreet,
      clientCity: input.clientCity,
      clientZip: input.clientZip,
      land: input.land,
      bidderName: input.bidderName,
      totalNet: input.totalNet,
      offerDate: new Date().toISOString(),
    },
    positions: input.positions.map((p) => ({
      oz: p.oz,
      kurztext: p.kurztext,
      langtext: p.langtext ?? undefined,
      menge: p.menge ?? undefined,
      einheit: p.einheit ?? undefined,
      einheitspreis: p.einheitspreis ?? undefined,
      gesamtpreis: p.gesamtpreis ?? undefined,
    })),
  });
}
