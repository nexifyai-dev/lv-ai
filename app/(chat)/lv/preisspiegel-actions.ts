"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  createOffer,
  deleteOffersByProject,
  replaceOfferPositions,
} from "@/lib/db/lv-queries";
import { ChatbotError } from "@/lib/errors";
import {
  type BieterAngebot,
  createPreisspiegel,
  type PreisspiegelResult,
  parseX84Angebot,
} from "@/lib/gaeb/preisspiegel";

// ─── Auth-Guard ──────────────────────────────────────────────────────────────
async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ChatbotError(
      "unauthorized:auth",
      "Anmeldung erforderlich für Preisspiegel."
    );
  }
  return session;
}

// ─── Schema ──────────────────────────────────────────────────────────────────
const preisspiegelSchema = z.object({
  projectId: z.string().uuid("Projekt-ID ungültig."),
  fileUrls: z
    .array(
      z
        .string()
        .min(1)
        .refine(
          (url) =>
            url.startsWith("/uploads/") ||
            url.startsWith("https://") ||
            url.includes("vercel-storage.com"),
          "URL muss vom Upload-Endpoint stammen."
        )
    )
    .min(2, "Mindestens 2 Bieterangebote erforderlich.")
    .max(10, "Maximal 10 Bieterangebote pro Preisspiegel."),
});

type PreisspiegelInput = z.infer<typeof preisspiegelSchema>;

// ─── Resultat-Typ (mit persistierten Offer-IDs) ──────────────────────────────
export interface PreisspiegelActionResult extends PreisspiegelResult {
  offerIds: Record<string, string>; // bieterName → offerId
}

// ─── Action ──────────────────────────────────────────────────────────────────
export async function generatePreisspiegelAction(
  input: PreisspiegelInput
): Promise<PreisspiegelActionResult> {
  await requireSession();
  const parsed = preisspiegelSchema.safeParse(input);
  if (!parsed.success) {
    throw new ChatbotError(
      "bad_request:api",
      parsed.error.issues[0]?.message ?? "Eingabe ungültig."
    );
  }

  const { projectId, fileUrls } = parsed.data;

  // 1. Alle X84-Dateien herunterladen und parsen
  const angebote: BieterAngebot[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < fileUrls.length; i++) {
    const url = fileUrls[i];
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        warnings.push(
          `Datei ${i + 1} konnte nicht geladen werden (HTTP ${res.status}).`
        );
        continue;
      }
      const xml = await res.text();
      const angebot = parseX84Angebot(xml);
      if (angebot) {
        angebote.push(angebot);
      } else {
        warnings.push(`Datei ${i + 1} enthält kein gültiges X84-Angebot.`);
      }
    } catch {
      warnings.push(`Datei ${i + 1} Download fehlgeschlagen.`);
    }
  }

  if (angebote.length < 2) {
    throw new ChatbotError(
      "bad_request:api",
      `Nur ${angebote.length} gültige Angebote gefunden — mindestens 2 erforderlich.`
    );
  }

  // 2. Preisspiegel generieren
  const result = createPreisspiegel(angebote);

  // 3. Angebote in DB persistieren (VOB/A § 17 nachvollziehbar)
  // Bestehende Angebote ersetzen — Preisspiegel ist die aktuellste Auswertung.
  await deleteOffersByProject(projectId);
  const offerIds: Record<string, string> = {};
  for (const angebot of angebote) {
    const gesamtsumme =
      angebot.gesamtsumme !== undefined
        ? angebot.gesamtsumme.toFixed(2)
        : undefined;
    const row = await createOffer({
      projectId,
      bieter: angebot.bieterName,
      gesamtsumme,
      eingereichtAm: new Date(),
    });
    offerIds[angebot.bieterName] = row.id;
    await replaceOfferPositions(
      row.id,
      angebot.positions.map((p) => ({
        oz: p.oz,
        kurztext: p.kurztext,
        menge: p.menge,
        einheit: p.einheit,
        einheitspreis: p.einheitspreis,
        gesamtpreis: p.gesamtpreis,
      }))
    );
  }

  // 4. Cache invalidieren (Preisspiegel + Bieter-Seite)
  revalidatePath(`/lv/${projectId}/preisspiegel`);
  revalidatePath(`/lv/${projectId}/bieter`);

  return { ...result, offerIds };
}
