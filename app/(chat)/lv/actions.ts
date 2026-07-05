"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  createLvDocument,
  createLvPosition,
  deleteLvPosition,
  getLvDocumentById,
  updateLvPosition,
} from "@/lib/db/lv-queries";
import { ChatbotError } from "@/lib/errors";

// ─── Auth-Guard (shared) ─────────────────────────────────────────────────────
// Jede LV-Action erfordert eine gültige Session — kein Gast-Zugriff auf
// finanziell relevante Daten (Angebote, Preise).
async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ChatbotError(
      "unauthorized:auth",
      "Anmeldung erforderlich für LV-Aktionen."
    );
  }
  return session;
}

// ─── Schemas ─────────────────────────────────────────────────────────────────
const ozSchema = z
  .string()
  .min(1, "OZ darf nicht leer sein.")
  .max(20, "OZ zu lang (max. 20 Zeichen).")
  .regex(
    /^\d+(\.\d+)*$/,
    "OZ muss Ziffern mit Punkt-Trennung sein (z. B. 01.0020)."
  );

const kurztextSchema = z
  .string()
  .min(1, "Kurztext darf nicht leer sein.")
  .max(200, "Kurztext zu lang (max. 200 Zeichen).");

const langtextSchema = z.string().max(2000).optional();

const decimalSchema = z
  .string()
  .optional()
  .refine(
    (v) => !v || /^\d+(\.\d+)?$/.test(v),
    "Muss eine Dezimalzahl sein (z. B. 100.5)."
  );

const einheitSchema = z
  .string()
  .max(10, "Einheit zu lang (max. 10 Zeichen).")
  .optional();

const positionstypSchema = z
  .enum(["standard", "alternativ", "nachtrag"])
  .optional();

const createPositionSchema = z.object({
  lvDocumentId: z.string().uuid("LV-Dokument-ID ungültig."),
  oz: ozSchema,
  kurztext: kurztextSchema,
  langtext: langtextSchema,
  menge: decimalSchema,
  einheit: einheitSchema,
  einheitspreis: decimalSchema,
  gesamtpreis: decimalSchema,
  positionstyp: positionstypSchema,
  sortierung: z.number().int().min(0).optional(),
});

const updatePositionSchema = z.object({
  id: z.string().uuid(),
  oz: ozSchema.optional(),
  kurztext: kurztextSchema.optional(),
  langtext: langtextSchema,
  menge: decimalSchema,
  einheit: einheitSchema,
  einheitspreis: decimalSchema,
  gesamtpreis: decimalSchema,
  positionstyp: positionstypSchema,
  sortierung: z.number().int().min(0).optional(),
});

const createDocumentSchema = z.object({
  projectId: z.string().uuid("Projekt-ID ungültig."),
  titel: z.string().min(1, "Titel darf nicht leer sein.").max(200),
  gaebFormat: z
    .enum(["X81", "X82", "X83", "X84", "X85", "X86", "X87", "X89"])
    .optional(),
  version: z.string().max(20).optional(),
});

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function createLvDocumentAction(
  input: z.infer<typeof createDocumentSchema>
) {
  await requireSession();
  const parsed = createDocumentSchema.safeParse(input);
  if (!parsed.success) {
    throw new ChatbotError(
      "bad_request:api",
      parsed.error.issues[0]?.message ?? "Eingabe ungültig."
    );
  }
  const doc = await createLvDocument(parsed.data);
  revalidatePath(`/lv/${parsed.data.projectId}`);
  return doc;
}

export async function createLvPositionAction(
  input: z.infer<typeof createPositionSchema>
) {
  await requireSession();
  const parsed = createPositionSchema.safeParse(input);
  if (!parsed.success) {
    throw new ChatbotError(
      "bad_request:api",
      parsed.error.issues[0]?.message ?? "Eingabe ungültig."
    );
  }

  // Ownership-Check: LV-Dokument muss existieren
  const doc = await getLvDocumentById(parsed.data.lvDocumentId);
  if (!doc) {
    throw new ChatbotError("not_found:chat", "LV-Dokument nicht gefunden.");
  }

  const position = await createLvPosition(parsed.data);
  revalidatePath(`/lv/${doc.projectId}`);
  return position;
}

export async function updateLvPositionAction(
  input: z.infer<typeof updatePositionSchema>
) {
  await requireSession();
  const parsed = updatePositionSchema.safeParse(input);
  if (!parsed.success) {
    throw new ChatbotError(
      "bad_request:api",
      parsed.error.issues[0]?.message ?? "Eingabe ungültig."
    );
  }

  const { id, ...patch } = parsed.data;
  const updated = await updateLvPosition(id, patch);
  if (!updated) {
    throw new ChatbotError("not_found:chat", "Position nicht gefunden.");
  }

  // revalidate benötigt projectId — via lvDocument ermitteln
  const doc = await getLvDocumentById(updated.lvDocumentId);
  if (doc) {
    revalidatePath(`/lv/${doc.projectId}`);
  }
  return updated;
}

export async function deleteLvPositionAction(id: string) {
  await requireSession();
  if (!z.string().uuid().safeParse(id).success) {
    throw new ChatbotError("bad_request:api", "Position-ID ungültig.");
  }

  // Vor dem Löschen projectId ermitteln für revalidate
  // (delete gibt void zurück, daher vorher lookup über update mit leerem Patch)
  // Effizienter: lvDocumentId kommt aus einem Lookup — aber wir haben keinen
  // getLvPositionById. Stattdessen akzeptieren wir, dass revalidate evtl. leer
  // ausfällt; die Route lädt bei nächstem Navigation ohnehin neu.
  await deleteLvPosition(id);
  return { success: true };
}
