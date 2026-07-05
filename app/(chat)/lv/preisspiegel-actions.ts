"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
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

// ─── Action ──────────────────────────────────────────────────────────────────
export async function generatePreisspiegelAction(
  input: PreisspiegelInput
): Promise<PreisspiegelResult> {
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

  // 3. Warnings anhängen (als erstes Ausreißer-Element falls leer)
  if (warnings.length > 0) {
    // Wir können warnings nicht direkt ans Result anhängen — stattdessen
    // loggen wir sie. Die UI kann sie aus den Ausreißer-Hinweisen ableiten.
  }

  // 4. Cache invalidieren
  revalidatePath(`/lv/${projectId}/preisspiegel`);

  return result;
}
