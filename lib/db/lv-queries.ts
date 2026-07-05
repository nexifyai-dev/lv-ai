import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ChatbotError } from "../errors";
import { generateUUID } from "../utils";
import {
  type LvDocument,
  type LvPosition,
  lvDocument,
  lvPosition,
  type Offer,
  type OfferPosition,
  offer,
  offerPosition,
  project,
} from "./schema";

// Geteilte DB-Instanz (queries.ts macht es genauso, aber dort ist sie nicht
// exportiert). Für LV-spezifische Queries eigener Einstiegspunkt.
const client = postgres(process.env.POSTGRES_URL ?? "");
const db = drizzle(client);

// ─── LV-Dokumente ─────────────────────────────────────────────────────────────

export async function getLvDocumentsByProject(
  projectId: string
): Promise<LvDocument[]> {
  try {
    return await db
      .select()
      .from(lvDocument)
      .where(eq(lvDocument.projectId, projectId))
      .orderBy(desc(lvDocument.createdAt));
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "LV-Dokumente konnten nicht geladen werden."
    );
  }
}

export async function getLvDocumentById(
  id: string
): Promise<LvDocument | null> {
  try {
    const rows = await db
      .select()
      .from(lvDocument)
      .where(eq(lvDocument.id, id))
      .limit(1);
    return rows[0] ?? null;
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "LV-Dokument konnte nicht geladen werden."
    );
  }
}

export async function createLvDocument(input: {
  projectId: string;
  titel: string;
  gaebFormat?: "X81" | "X82" | "X83" | "X84" | "X85" | "X86" | "X87" | "X89";
  version?: string;
}): Promise<LvDocument> {
  const id = generateUUID();
  try {
    const [row] = await db
      .insert(lvDocument)
      .values({
        id,
        projectId: input.projectId,
        titel: input.titel,
        gaebFormat: input.gaebFormat,
        version: input.version,
      })
      .returning();
    return row;
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "LV-Dokument konnte nicht erstellt werden."
    );
  }
}

// ─── LV-Positionen ────────────────────────────────────────────────────────────

export async function getLvPositionsByDocument(
  lvDocumentId: string
): Promise<LvPosition[]> {
  try {
    return await db
      .select()
      .from(lvPosition)
      .where(eq(lvPosition.lvDocumentId, lvDocumentId))
      .orderBy(asc(lvPosition.sortierung), asc(lvPosition.oz));
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Positionen konnten nicht geladen werden."
    );
  }
}

export async function createLvPosition(input: {
  lvDocumentId: string;
  oz: string;
  kurztext: string;
  langtext?: string;
  menge?: string;
  einheit?: string;
  einheitspreis?: string;
  gesamtpreis?: string;
  positionstyp?: "standard" | "alternativ" | "nachtrag";
  sortierung?: number;
}): Promise<LvPosition> {
  const id = generateUUID();
  try {
    const [row] = await db
      .insert(lvPosition)
      .values({
        id,
        lvDocumentId: input.lvDocumentId,
        oz: input.oz,
        kurztext: input.kurztext,
        langtext: input.langtext,
        menge: input.menge,
        einheit: input.einheit,
        einheitspreis: input.einheitspreis,
        gesamtpreis: input.gesamtpreis,
        positionstyp: input.positionstyp ?? "standard",
        sortierung: input.sortierung ?? 0,
      })
      .returning();
    return row;
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Position konnte nicht erstellt werden."
    );
  }
}

export async function updateLvPosition(
  id: string,
  patch: Partial<Omit<LvPosition, "id" | "lvDocumentId" | "createdAt">>
): Promise<LvPosition | null> {
  try {
    const [row] = await db
      .update(lvPosition)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(lvPosition.id, id))
      .returning();
    return row ?? null;
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Position konnte nicht aktualisiert werden."
    );
  }
}

export async function deleteLvPosition(id: string): Promise<void> {
  try {
    await db.delete(lvPosition).where(eq(lvPosition.id, id));
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Position konnte nicht gelöscht werden."
    );
  }
}

// ─── Projekt-Scope-Guard ──────────────────────────────────────────────────────
// Stellt sicher, dass ein Projekt existiert (wird von der Route für die
// 404-Behandlung genutzt). Kein direkter User-Check hier — Auth passiert auf
// Route-Ebene via session.

export async function projectExists(projectId: string): Promise<boolean> {
  try {
    const rows = await db
      .select({ id: project.id })
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1);
    return rows.length > 0;
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Projekt konnte nicht geprüft werden."
    );
  }
}

// ─── Hilfsfunktion: Gesamtwert eines LV-Dokuments ────────────────────────────

export async function getLvDocumentSum(lvDocumentId: string): Promise<number> {
  try {
    const positions = await db
      .select({ gesamtpreis: lvPosition.gesamtpreis })
      .from(lvPosition)
      .where(eq(lvPosition.lvDocumentId, lvDocumentId));
    return positions.reduce((sum, p) => {
      const wert = p.gesamtpreis ? Number.parseFloat(p.gesamtpreis) : 0;
      return sum + (Number.isFinite(wert) ? wert : 0);
    }, 0);
  } catch (_error) {
    return 0;
  }
}

// ─── Angebote (Bieter) ─────────────────────────────────────────────────────────
// VOB/A § 17 Zuschlagserteilung: Status-Wechsel offen → eingereicht → gueltig →
// ausgeschlossen/unvollstaendig → vergeben/abgelehnt.

export async function deleteOffersByProject(projectId: string): Promise<void> {
  try {
    await db.delete(offer).where(eq(offer.projectId, projectId));
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Angebote konnten nicht gelöscht werden."
    );
  }
}

export type BieterStatus =
  | "offen"
  | "eingereicht"
  | "gueltig"
  | "unvollstaendig"
  | "ausgeschlossen"
  | "vergeben"
  | "abgelehnt";

export async function getOffersByProject(projectId: string): Promise<Offer[]> {
  try {
    return await db
      .select()
      .from(offer)
      .where(eq(offer.projectId, projectId))
      .orderBy(asc(offer.bieter));
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Angebote konnten nicht geladen werden."
    );
  }
}

export async function getOfferById(id: string): Promise<Offer | null> {
  try {
    const rows = await db.select().from(offer).where(eq(offer.id, id)).limit(1);
    return rows[0] ?? null;
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Angebot konnte nicht geladen werden."
    );
  }
}

export async function createOffer(input: {
  projectId: string;
  bieter: string;
  gaebSourceId?: string;
  gesamtsumme?: string;
  bemerkungen?: string;
  eingereichtAm?: Date;
}): Promise<Offer> {
  const id = generateUUID();
  try {
    const [row] = await db
      .insert(offer)
      .values({
        id,
        projectId: input.projectId,
        bieter: input.bieter,
        gaebSourceId: input.gaebSourceId,
        gesamtsumme: input.gesamtsumme,
        bemerkungen: input.bemerkungen,
        eingereichtAm: input.eingereichtAm,
        status: "eingereicht",
      })
      .returning();
    return row;
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Angebot konnte nicht erstellt werden."
    );
  }
}

export async function updateOfferStatus(
  id: string,
  patch: {
    status?: BieterStatus;
    auschlussGrund?: string | null;
    zuschlagErteiltAm?: Date | null;
    zuschlagBegruendung?: string | null;
    bemerkungen?: string | null;
  }
): Promise<Offer | null> {
  try {
    const [row] = await db
      .update(offer)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(offer.id, id))
      .returning();
    return row ?? null;
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Angebotsstatus konnte nicht aktualisiert werden."
    );
  }
}

// ─── Offer-Positionen (position-level Preise pro Bieter) ──────────────────────

export async function getOfferPositions(
  offerId: string
): Promise<OfferPosition[]> {
  try {
    return await db
      .select()
      .from(offerPosition)
      .where(eq(offerPosition.offerId, offerId))
      .orderBy(asc(offerPosition.sortierung), asc(offerPosition.oz));
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Angebotspositionen konnten nicht geladen werden."
    );
  }
}

export async function replaceOfferPositions(
  offerId: string,
  positions: Array<{
    oz: string;
    kurztext?: string;
    menge?: string;
    einheit?: string;
    einheitspreis?: string;
    gesamtpreis?: string;
    sortierung?: number;
  }>
): Promise<void> {
  try {
    // Bestehende Positionen ersetzen (cascade delete via FK)
    await db.delete(offerPosition).where(eq(offerPosition.offerId, offerId));
    if (positions.length === 0) {
      return;
    }
    await db.insert(offerPosition).values(
      positions.map((p, i) => ({
        offerId,
        oz: p.oz,
        kurztext: p.kurztext,
        menge: p.menge,
        einheit: p.einheit,
        einheitspreis: p.einheitspreis,
        gesamtpreis: p.gesamtpreis,
        sortierung: p.sortierung ?? i,
      }))
    );
  } catch (_error) {
    throw new ChatbotError(
      "bad_request:database",
      "Angebotspositionen konnten nicht gespeichert werden."
    );
  }
}
