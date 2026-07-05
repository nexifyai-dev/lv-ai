// ─── GAEB X84 Preisspiegel-Engine ────────────────────────────────────────────
// Importiert Bieterangebote (GAEB X84) und generiert Preisspiegel.
//
// X84 = Angebotsabgabe (Bieter sendet ausgefüllte Preise an AG)
// Der Preisspiegel vergleicht mehrere Bieterangebote positionweise
// und identifiziert Ausreißer (VOB/A § 16 Unterkostenangebot-Verdacht).
//
// Verwendung:
//   import { createPreisspiegel } from "@/lib/gaeb/preisspiegel";
//   const spiegel = createPreisspiegel(angebote);
//   // → { positions: [...], bieter: [...], ausreisser: [...] }

import { GaebParser, type GaebPosition } from "./parser";

export interface BieterAngebot {
  bieterName: string;
  positions: GaebPosition[]; // X84-parste Positionen mit einheitspreis/gesamtpreis
  gesamtsumme?: number;
}

export interface PreisspiegelPosition {
  oz: string;
  kurztext: string;
  menge?: string;
  einheit?: string;
  preise: Record<string, { ep?: number; gp?: number }>; // bieterName → {ep, gp}
  tiefstpreis?: { bieter: string; gp: number };
  hoechstpreis?: { bieter: string; gp: number };
  durchschnitt?: number;
  abweichung?: number; // % Abweichung vom Durchschnitt (für Ausreißer-Erkennung)
}

export interface PreisspiegelAusreisser {
  oz: string;
  bieter: string;
  gp: number;
  durchschnitt: number;
  abweichungProzent: number;
  verdacht: "unterkosten" | "ueberkosten" | "ok";
  hinweis: string;
}

export interface PreisspiegelBieter {
  name: string;
  gesamtsumme: number;
  rang: number; // 1 = günstigster
  positionenMitPreis: number;
  positionenOhnePreis: number;
}

export interface PreisspiegelResult {
  positions: PreisspiegelPosition[];
  bieter: PreisspiegelBieter[];
  ausreisser: PreisspiegelAusreisser[];
  bieterCount: number;
  positionCount: number;
}

// ─── Parsing: X84 XML → BieterAngebot ────────────────────────────────────────

export function parseX84Angebot(xml: string): BieterAngebot | null {
  const parser = new GaebParser();
  const result = parser.parse(xml);
  if (!result.success || result.positions.length === 0) {
    return null;
  }

  // GaebParser extrahiert nur QU/QUDesc/ShortDesc/LongDesc, nicht UP/TP.
  // X84-spezifische Preisfelder (UP=Einheitspreis, TP=Gesamtpreis) hier
  // direkt aus dem XML extrahieren und in die Positionen eintragen.
  const positions = result.positions.map((pos) => {
    const itemRegex = new RegExp(
      `<Item>[\\s\\S]*?<IDno>${escapeRegex(pos.oz)}</IDno>([\\s\\S]*?)</Item>`,
      "i"
    );
    const itemMatch = xml.match(itemRegex);
    const itemXml = itemMatch?.[1] ?? "";

    const upMatch = itemXml.match(/<UP>([^<]+)<\/UP>/i);
    const tpMatch = itemXml.match(/<TP>([^<]+)<\/TP>/i);

    return {
      ...pos,
      einheitspreis: upMatch?.[1]?.trim(),
      gesamtpreis: tpMatch?.[1]?.trim(),
    };
  });

  // Bieter-Name aus GAEB-XML extrahieren (PrtType BI)
  const bieterMatch = xml.match(
    /<PrtType>BI<\/PrtType>[\s\S]*?<PrtName>([^<]+)<\/PrtName>/i
  );
  const bieterName = bieterMatch?.[1]?.trim() ?? "Unbekannter Bieter";

  // Gesamtsumme aus Offer-Block
  const totalMatch = xml.match(/<OfferTotal>([^<]+)<\/OfferTotal>/i);
  const gesamtsumme = totalMatch ? parseGermanNumber(totalMatch[1]) : undefined;

  return {
    bieterName,
    positions,
    gesamtsumme,
  };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Preisspiegel-Generierung ────────────────────────────────────────────────

export function createPreisspiegel(
  angebote: BieterAngebot[]
): PreisspiegelResult {
  if (angebote.length === 0) {
    return {
      positions: [],
      bieter: [],
      ausreisser: [],
      bieterCount: 0,
      positionCount: 0,
    };
  }

  // 1. Alle eindeutigen OZ sammeln (Reihenfolge aus erstem Angebot)
  const ozOrder: string[] = [];
  const positionMap: Map<string, GaebPosition> = new Map();
  for (const angebot of angebote) {
    for (const pos of angebot.positions) {
      if (!positionMap.has(pos.oz)) {
        ozOrder.push(pos.oz);
        positionMap.set(pos.oz, pos);
      }
    }
  }

  // 2. Preisspiegel-Positionen aufbauen
  const positions: PreisspiegelPosition[] = [];
  const ausreisser: PreisspiegelAusreisser[] = [];

  for (const oz of ozOrder) {
    const basePos = positionMap.get(oz);
    if (!basePos) {
      continue;
    }
    const preise: Record<string, { ep?: number; gp?: number }> = {};
    const gpWerte: { bieter: string; gp: number }[] = [];

    for (const angebot of angebote) {
      const pos = angebot.positions.find((p) => p.oz === oz);
      if (!pos) {
        continue;
      }
      const ep = pos.einheitspreis
        ? parseGermanNumber(pos.einheitspreis)
        : undefined;
      const gp = pos.gesamtpreis
        ? parseGermanNumber(pos.gesamtpreis)
        : undefined;
      if (ep || gp) {
        preise[angebot.bieterName] = { ep, gp };
        if (gp) {
          gpWerte.push({ bieter: angebot.bieterName, gp });
        }
      }
    }

    if (gpWerte.length === 0) {
      continue;
    }

    // Tiefst-/Höchstpreis
    const sorted = [...gpWerte].sort((a, b) => a.gp - b.gp);
    const tiefstpreis = sorted[0];
    const hoechstpreis = sorted.at(-1);

    // Durchschnitt
    const sum = gpWerte.reduce((acc, p) => acc + p.gp, 0);
    const durchschnitt = sum / gpWerte.length;

    const spiegelPos: PreisspiegelPosition = {
      oz,
      kurztext: basePos.kurztext,
      menge: basePos.menge,
      einheit: basePos.einheit,
      preise,
      tiefstpreis,
      hoechstpreis,
      durchschnitt,
    };
    positions.push(spiegelPos);

    // 3. Ausreißer-Erkennung (VOB/A § 16 Unterkostenangebot)
    for (const gpWert of gpWerte) {
      const abweichung = ((gpWert.gp - durchschnitt) / durchschnitt) * 100;
      const _absAbweichung = Math.abs(abweichung);

      // VOB/A § 16: Verdacht bei > 20% unter Durchschnitt
      if (abweichung < -20) {
        ausreisser.push({
          oz,
          bieter: gpWert.bieter,
          gp: gpWert.gp,
          durchschnitt,
          abweichungProzent: abweichung,
          verdacht: "unterkosten",
          hinweis: `§ 16 VOB/A: Preis ${abweichung.toFixed(1)}% unter Durchschnitt — mögliches Unterkostenangebot. Prüfung der Einstandpreise erforderlich.`,
        });
      } else if (abweichung > 30) {
        ausreisser.push({
          oz,
          bieter: gpWert.bieter,
          gp: gpWert.gp,
          durchschnitt,
          abweichungProzent: abweichung,
          verdacht: "ueberkosten",
          hinweis: `Preis ${abweichung.toFixed(1)}% über Durchschnitt — ungewöhnlich teuer. Prüfung empfohlen.`,
        });
      }
    }
  }

  // 4. Bieter-Ranking
  const bieter: PreisspiegelBieter[] = angebote.map((a) => {
    const gesamtsumme =
      a.gesamtsumme ??
      a.positions.reduce((sum, p) => {
        const gp = p.gesamtpreis ? parseGermanNumber(p.gesamtpreis) : 0;
        return sum + (Number.isFinite(gp) ? gp : 0);
      }, 0);

    const positionenMitPreis = a.positions.filter((p) => p.gesamtpreis).length;
    const positionenOhnePreis = a.positions.length - positionenMitPreis;

    return {
      name: a.bieterName,
      gesamtsumme,
      rang: 0, // wird nach Sortierung gesetzt
      positionenMitPreis,
      positionenOhnePreis,
    };
  });

  bieter.sort((a, b) => a.gesamtsumme - b.gesamtsumme);
  bieter.forEach((b, i) => {
    b.rang = i + 1;
  });

  return {
    positions,
    bieter,
    ausreisser,
    bieterCount: angebote.length,
    positionCount: positions.length,
  };
}

// ─── Helper: Deutsche Zahlen parsen ──────────────────────────────────────────
// GAEB kann deutsche (1.234,56) oder internationale (1234.56) Notation haben.
function parseGermanNumber(value: string): number {
  if (!value) {
    return 0;
  }
  const cleaned = value.trim().replace(/\s/g, "");
  // Deutsche Notation: 1.234,56 → 1234.56
  if (cleaned.includes(",") && cleaned.includes(".")) {
    // Punkt = Tausender, Komma = Dezimal
    return Number.parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
  }
  // Nur Komma → deutsche Dezimal
  if (cleaned.includes(",")) {
    return Number.parseFloat(cleaned.replace(",", "."));
  }
  return Number.parseFloat(cleaned) || 0;
}
