"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  type BieterStatus,
  getOfferById,
  getOffersByProject,
  updateOfferStatus,
} from "@/lib/db/lv-queries";
import { ChatbotError } from "@/lib/errors";

// ─── Auth-Guard ──────────────────────────────────────────────────────────────
async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ChatbotError(
      "unauthorized:auth",
      "Anmeldung erforderlich für Bieterauswertung."
    );
  }
  return session;
}

// ─── Valid-Status-Übergänge (VOB/A § 17) ────────────────────────────────────
const STATUS_FLOW: Record<BieterStatus, BieterStatus[]> = {
  offen: ["eingereicht"],
  eingereicht: ["gueltig", "unvollstaendig", "ausgeschlossen"],
  gueltig: ["vergeben", "abgelehnt", "ausgeschlossen"],
  unvollstaendig: ["eingereicht"],
  ausgeschlossen: [],
  vergeben: [],
  abgelehnt: [],
};

const bieterStatusSchema = z.object({
  offerId: z.string().uuid("Angebot-ID ungültig."),
  projectId: z.string().uuid("Projekt-ID ungültig."),
  status: z.enum([
    "offen",
    "eingereicht",
    "gueltig",
    "unvollstaendig",
    "ausgeschlossen",
    "vergeben",
    "abgelehnt",
  ] as const),
  auschlussGrund: z.string().max(500).nullable().optional(),
  zuschlagBegruendung: z.string().max(500).nullable().optional(),
  bemerkungen: z.string().max(1000).nullable().optional(),
});

type BieterStatusInput = z.infer<typeof bieterStatusSchema>;

// ─── Action ──────────────────────────────────────────────────────────────────
export async function setBieterStatusAction(
  input: BieterStatusInput
): Promise<void> {
  await requireSession();
  const parsed = bieterStatusSchema.safeParse(input);
  if (!parsed.success) {
    throw new ChatbotError(
      "bad_request:api",
      parsed.error.issues[0]?.message ?? "Eingabe ungültig."
    );
  }

  const {
    offerId,
    projectId,
    status,
    auschlussGrund,
    zuschlagBegruendung,
    bemerkungen,
  } = parsed.data;

  // Prüfen ob Angebot existiert
  const existing = await getOfferById(offerId);
  if (!existing) {
    throw new ChatbotError("bad_request:api", "Angebot nicht gefunden.");
  }
  if (existing.projectId !== projectId) {
    throw new ChatbotError(
      "bad_request:api",
      "Angebot gehört nicht zu diesem Projekt."
    );
  }

  // Status-Übergang prüfen (VOB/A § 17)
  const erlaubt = STATUS_FLOW[existing.status] ?? [];
  if (!erlaubt.includes(status)) {
    throw new ChatbotError(
      "bad_request:api",
      `Status-Wechsel von "${existing.status}" zu "${status}" nicht erlaubt.`
    );
  }

  const patch: Parameters<typeof updateOfferStatus>[1] = {
    status,
    bemerkungen,
  };

  if (status === "ausgeschlossen") {
    patch.auschlussGrund = auschlussGrund ?? null;
  }
  if (status === "vergeben") {
    patch.zuschlagErteiltAm = new Date();
    patch.zuschlagBegruendung = zuschlagBegruendung ?? null;
    // Nur ein Bieter darf vergeben sein (VOB/A § 17)
    // Andere aktive Angebote auf abgelehnt setzen
    const alle = await getOffersByProject(projectId);
    for (const o of alle) {
      if (o.id !== offerId && o.status !== "ausgeschlossen") {
        await updateOfferStatus(o.id, { status: "abgelehnt" });
      }
    }
  }

  await updateOfferStatus(offerId, patch);
  revalidatePath(`/lv/${projectId}/bieter`);
}

// ─── Bieter-Daten laden ──────────────────────────────────────────────────────
export async function getBieterAction(projectId: string) {
  await requireSession();
  return getOffersByProject(projectId);
}
