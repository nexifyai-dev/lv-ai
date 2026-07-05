// ─── D/A/CH Compliance-Modul ─────────────────────────────────────────────────
// Hinterlegt die jeweils gültige Rechtsgrundlage je Land (DE/AT/CH).
// Passt Textbausteine, Fristen und Regelwerke automatisch an.

export type Land = "DE" | "AT" | "CH";

export interface ComplianceConfig {
  land: Land;
  name: string;
  vergaberecht: string;
  vertragsrecht: string;
  atv: string; // Allgemeine Technische Vertragsbedingungen
  kostengliederung: string;
  eRechnung: string[];
  waehrung: string;
  sprache: string;
  fristen: FristConfig[];
  positionstexte: Positionsvorlage[];
}

export interface FristConfig {
  name: string;
  tage: number;
  beschreibung: string;
}

export interface Positionsvorlage {
  gewerk: string;
  musterpositionen: {
    oz: string;
    kurztext: string;
    langtext: string;
    einheit: string;
  }[];
}

// ─── DE — VOB/A+B+C, DIN 276 ────────────────────────────────────────────────

export const COMPLIANCE_DE: ComplianceConfig = {
  land: "DE",
  name: "VOB/A+B+C (Vergabe- und Vertragsordnung für Bauleistungen)",
  vergaberecht: "VOB/A 2019 — Vergabe von Bauleistungen",
  vertragsrecht: "VOB/B 2016 — Allgemeine Vertragsbedingungen",
  atv: "VOB/C — Allgemeine Technische Vertragsbedingungen (DIN 18299 ff.)",
  kostengliederung: "DIN 276:2018 — Kosten im Bauwesen",
  eRechnung: ["XRechnung 3.0", "ZUGFeRD 2.1"],
  waehrung: "EUR",
  sprache: "de-DE",
  fristen: [
    {
      name: "Angebotsfrist (Mindestfrist öffentliche Ausschreibung nach VOB/A § 10)",
      tage: 35,
      beschreibung: "§ 10 Abs. 1 VOB/A — Frist für Angebotsabgabe",
    },
    {
      name: "Angebotsfrist (Mindestfrist beschränkte Ausschreibung nach VOB/A § 10)",
      tage: 25,
      beschreibung: "§ 10 Abs. 2 VOB/A",
    },
    {
      name: "Angebotsbindefrist",
      tage: 60,
      beschreibung: "§ 14 VOB/A — Standard-Bindefrist",
    },
    {
      name: "Gewährleistungsfrist",
      tage: 730, // 2 Jahre
      beschreibung: "§ 13 Abs. 4 VOB/B — Allgemeine Gewährleistungsfrist",
    },
    {
      name: "Abschlagsrechnung Fälligkeit",
      tage: 14,
      beschreibung: "§ 16 Abs. 1 VOB/B — Fälligkeit von Abschlagszahlungen",
    },
    {
      name: "Schlussrechnung Prüffrist",
      tage: 30,
      beschreibung: "§ 16 Abs. 3 VOB/B — Prüfungsfrist für Schlussrechnungen",
    },
  ],
  positionstexte: [],
};

// ─── AT — ÖNORM B2110/B2111 ─────────────────────────────────────────────────

export const COMPLIANCE_AT: ComplianceConfig = {
  land: "AT",
  name: "ÖNORM B2110/B2111 (Österreichische Norm)",
  vergaberecht: "ÖNORM B2110:2013 — Ausschreibung, Angebot und Vergabe",
  vertragsrecht: "ÖNORM B2111:2013 — Werkvertragsnorm",
  atv: "ÖNORM B2110 Anhang C — Technische Vertragsbedingungen",
  kostengliederung: "ÖNORM B 1801-1 — Kostenermittlung",
  eRechnung: ["ebInterface 5.0", "ZUGFeRD 2.1"],
  waehrung: "EUR",
  sprache: "de-AT",
  fristen: [
    {
      name: "Angebotsfrist (Mindestfrist nach ÖNORM B2110)",
      tage: 30,
      beschreibung: "ÖNORM B2110 Punkt 5.3",
    },
    {
      name: "Angebotsbindefrist",
      tage: 90,
      beschreibung: "ÖNORM B 2110 Punkt 6.1",
    },
    {
      name: "Gewährleistungsfrist",
      tage: 730, // 2 Jahre
      beschreibung: "ÖNORM B 2111 Punkt 8.3",
    },
    {
      name: "Rechnung Prüffrist",
      tage: 30,
      beschreibung: "ÖNORM B 2111 Punkt 9.2",
    },
  ],
  positionstexte: [],
};

// ─── CH — SIA 118/102 ───────────────────────────────────────────────────────

export const COMPLIANCE_CH: ComplianceConfig = {
  land: "CH",
  name: "SIA 118/102 (Schweizer Norm)",
  vergaberecht: "SIA 118 — Allgemeine Bedingungen für Bauarbeiten",
  vertragsrecht: "SIA 102 — Werkvertrag",
  atv: "SIA 118 Teil C — Technische Bestimmungen",
  kostengliederung: "SIA 416 — Baukostenplanung",
  eRechnung: ["ZUGFeRD 2.1", "Swiss QR-Rechnung"],
  waehrung: "CHF",
  sprache: "de-CH",
  fristen: [
    {
      name: "Angebotsfrist",
      tage: 30,
      beschreibung: "SIA 118 Punkt 5.2",
    },
    {
      name: "Angebotsbindefrist",
      tage: 90,
      beschreibung: "SIA 118 Punkt 6.1",
    },
    {
      name: "Gewährleistungsfrist",
      tage: 730, // 2 Jahre
      beschreibung: "SIA 102 Punkt 172",
    },
    {
      name: "Rechnung Prüffrist",
      tage: 30,
      beschreibung: "SIA 102 Punkt 156",
    },
  ],
  positionstexte: [],
};

// ─── Compliance-Service ──────────────────────────────────────────────────────

const COMPLIANCE_BY_LAND: Record<Land, ComplianceConfig> = {
  DE: COMPLIANCE_DE,
  AT: COMPLIANCE_AT,
  CH: COMPLIANCE_CH,
};

export function getComplianceForLand(land: string): ComplianceConfig {
  const normalizedLand = land.toUpperCase() as Land;
  return COMPLIANCE_BY_LAND[normalizedLand] || COMPLIANCE_DE;
}

export function getFristen(land: string): FristConfig[] {
  return getComplianceForLand(land).fristen;
}

export function getRechtsgrundlage(
  land: string,
  bereich: "vergabe" | "vertrag" | "atv" | "kosten"
): string {
  const compliance = getComplianceForLand(land);
  switch (bereich) {
    case "vergabe":
      return compliance.vergaberecht;
    case "vertrag":
      return compliance.vertragsrecht;
    case "atv":
      return compliance.atv;
    case "kosten":
      return compliance.kostengliederung;
    default:
      return compliance.vergaberecht;
  }
}

export function getWaehrung(land: string): string {
  return getComplianceForLand(land).waehrung;
}

export function getERechnungFormate(land: string): string[] {
  return getComplianceForLand(land).eRechnung;
}

/**
 * Generiert Compliance-Kontext für den System-Prompt.
 */
export function getComplianceContext(land: string): string {
  const c = getComplianceForLand(land);
  return `
Rechtsgrundlage (${c.land}): ${c.name}
- Vergabe: ${c.vergaberecht}
- Vertrag: ${c.vertragsrecht}
- ATV: ${c.atv}
- Kosten: ${c.kostengliederung}
- Währung: ${c.waehrung}
- E-Rechnung: ${c.eRechnung.join(", ")}
- Fristen: ${c.fristen.map((f) => `${f.name} (${f.tage} Tage)`).join(", ")}
`.trim();
}
