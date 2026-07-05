"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { createLvDocument, createLvPosition } from "@/lib/db/lv-queries";
import { ChatbotError } from "@/lib/errors";
import { parseLvContent } from "@/lib/gaeb/text-parser";

// ─── Auth-Guard ──────────────────────────────────────────────────────────────
async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ChatbotError(
      "unauthorized:auth",
      "Anmeldung erforderlich für LV-Import."
    );
  }
  return session;
}

// ─── Schemas ─────────────────────────────────────────────────────────────────
const importSchema = z.object({
  projectId: z.string().uuid("Projekt-ID ungültig."),
  fileUrl: z
    .string()
    .min(1, "Datei-URL fehlt.")
    .refine(
      (url) =>
        url.startsWith("/uploads/") ||
        url.startsWith("https://") ||
        url.includes("vercel-storage.com"),
      "URL muss vom Upload-Endpoint stammen (/uploads/ oder HTTPS)."
    ),
  fileName: z.string().min(1).max(200),
  contentType: z.string().optional(),
  titel: z.string().min(1, "Titel darf nicht leer sein.").max(200).optional(),
  gaebFormat: z
    .enum(["X81", "X82", "X83", "X84", "X85", "X86", "X87", "X89"])
    .optional(),
});

type ImportInput = z.infer<typeof importSchema>;

export interface ImportResult {
  documentId: string;
  format: "gaeb-xml" | "lv-text" | "unknown";
  positionCount: number;
  skippedPositions: number;
  warnings: string[];
}

// ─── Action ──────────────────────────────────────────────────────────────────
export async function importLvFileAction(
  input: ImportInput
): Promise<ImportResult> {
  await requireSession();
  const parsed = importSchema.safeParse(input);
  if (!parsed.success) {
    throw new ChatbotError(
      "bad_request:api",
      parsed.error.issues[0]?.message ?? "Eingabe ungültig."
    );
  }

  const { projectId, fileUrl, fileName, titel, gaebFormat } = parsed.data;

  // 1) Dateiinhalt laden
  let content: string;
  try {
    const res = await fetch(fileUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new ChatbotError(
        "bad_request:api",
        `Datei konnte nicht geladen werden (HTTP ${res.status}).`
      );
    }
    content = await res.text();
  } catch (err) {
    throw new ChatbotError(
      "offline:chat",
      err instanceof Error ? err.message : "Download fehlgeschlagen."
    );
  }

  if (!content || content.trim().length === 0) {
    throw new ChatbotError(
      "bad_request:api",
      "Datei ist leer oder enthält keinen Text."
    );
  }

  // 2) Format erkennen + parsen
  const parseResult = await parseLvContent(content);

  if (parseResult.format === "unknown") {
    throw new ChatbotError(
      "bad_request:api",
      "Format nicht erkannt. Erlaubt: GAEB DA XML (X81-X89) oder tabellarisches LV."
    );
  }

  const positions =
    parseResult.format === "gaeb-xml"
      ? (parseResult.gaebResult?.positions ?? [])
      : (parseResult.lvTextResult?.positions ?? []);

  if (positions.length === 0) {
    throw new ChatbotError(
      "bad_request:api",
      "Keine Positionen im Dokument gefunden."
    );
  }

  // 3) LV-Dokument in DB anlegen
  const resolvedTitel =
    titel ??
    parseResult.gaebResult?.projectName ??
    parseResult.lvTextResult?.projectName ??
    fileName.replace(/\.[^.]+$/, "");

  const resolvedGaebFormat =
    gaebFormat ??
    (parseResult.format === "gaeb-xml"
      ? (parseResult.gaebResult?.gaebFormat as
          | "X81"
          | "X82"
          | "X83"
          | "X84"
          | "X85"
          | "X86"
          | "X87"
          | "X89"
          | undefined)
      : undefined);

  const document = await createLvDocument({
    projectId,
    titel: resolvedTitel,
    gaebFormat: resolvedGaebFormat,
    version: "1.0",
  });

  // 4) Positionen in DB schreiben — OZ normalisieren (Double-Dot → Single-Dot)
  let imported = 0;
  let skipped = 0;
  const warnings: string[] = [];

  for (const pos of positions) {
    const normalizedOz = pos.oz.replace(/\.{2,}/g, ".");
    if (!normalizedOz || normalizedOz.length > 20) {
      skipped++;
      warnings.push(`OZ ungültig übersprungen: "${pos.oz}"`);
      continue;
    }

    try {
      await createLvPosition({
        lvDocumentId: document.id,
        oz: normalizedOz,
        kurztext: pos.kurztext.slice(0, 500),
        langtext: pos.langtext?.slice(0, 2000),
        menge: pos.menge,
        einheit: pos.einheit,
        einheitspreis: pos.einheitspreis,
        gesamtpreis: pos.gesamtpreis,
        positionstyp: pos.positionstyp ?? "standard",
        sortierung: imported,
      });
      imported++;
    } catch (err) {
      skipped++;
      warnings.push(
        `Position ${pos.oz} übersprungen: ${err instanceof Error ? err.message : "DB-Fehler"}`
      );
    }
  }

  // 5) Hinweistexte als Warnungen durchreichen (für Transparenz)
  if (parseResult.lvTextResult?.hinweistexte?.length) {
    warnings.push(
      `${parseResult.lvTextResult.hinweistexte.length} Hinweistexte erkannt (nicht als Positionen importiert).`
    );
  }

  // 6) Cache invalidieren
  revalidatePath(`/lv/${projectId}`);

  return {
    documentId: document.id,
    format: parseResult.format,
    positionCount: imported,
    skippedPositions: skipped,
    warnings,
  };
}
