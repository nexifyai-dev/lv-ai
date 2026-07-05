import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";

// LV.AI: Akzeptiert mehr Dateitypen für AVA-Dokumente
const ALLOWED_TYPES = [
  "application/pdf",
  "application/xml",
  "text/xml",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/msword",
  "text/csv",
  "text/plain",
  "image/jpeg",
  "image/png",
];

const FileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "Dateigröße muss unter 20MB liegen",
    })
    .refine(
      (file) =>
        ALLOWED_TYPES.includes(file.type) ||
        file.name.endsWith(".gaeb") ||
        file.name.endsWith(".xml"),
      {
        message:
          "Erlaubte Dateitypen: PDF, XML, GAEB, Excel, Word, CSV, Bilder",
      }
    ),
});

// ─── Storage-Strategie ───────────────────────────────────────────────────────
// Produktion: Vercel Blob (BLOB_READ_WRITE_TOKEN gesetzt).
// Entwicklung/ohne Token: lokales Dateisystem unter public/uploads/lv-ai/.
// URL-Schema identisch: Route gibt immer { url, pathname, contentType } zurück.
const USE_LOCAL_STORAGE = !process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request Body ist leer", { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Anfrage konnte nicht verarbeitet werden" },
      { status: 500 }
    );
  }

  const file = formData.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json(
      { error: "Keine Datei hochgeladen" },
      { status: 400 }
    );
  }

  const validatedFile = FileSchema.safeParse({ file });

  if (!validatedFile.success) {
    const errorMessage = validatedFile.error.errors
      .map((error) => error.message)
      .join(", ");

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  const originalName = (formData.get("file") as File).name;
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  // Dateinamen um Timestamp ergänzen, um Kollisionen zu vermeiden
  const uniqueName = `${Date.now()}-${safeName}`;
  const fileBuffer = await file.arrayBuffer();

  // ─── Lokaler Storage (Dev-Fallback) ──────────────────────────────────────
  if (USE_LOCAL_STORAGE) {
    try {
      const path = await storeLocal(uniqueName, fileBuffer);
      return NextResponse.json({
        url: path,
        pathname: originalName,
        contentType: file.type,
      });
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : "Lokaler Upload fehlgeschlagen",
        },
        { status: 500 }
      );
    }
  }

  // ─── Vercel Blob (Produktion) ────────────────────────────────────────────
  try {
    const data = await put(`lv-ai/${uniqueName}`, fileBuffer, {
      access: "public",
      contentType: file.type || undefined,
    });

    return NextResponse.json({
      url: data.url,
      pathname: originalName,
      contentType: file.type,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload fehlgeschlagen (Vercel Blob)" },
      { status: 500 }
    );
  }
}

// ─── Lokaler Storage-Helper ──────────────────────────────────────────────────
// Schreibt in public/uploads/lv-ai/<uniqueName> und gibt die öffentliche URL
// relativ zur App-Root zurück. In Dev wird /uploads/... direkt von Next
// statisch aus public/ ausgeliefert.
async function storeLocal(
  uniqueName: string,
  buffer: ArrayBuffer
): Promise<string> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");

  const uploadDir = path.join(process.cwd(), "public", "uploads", "lv-ai");
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueName);
  await fs.writeFile(filePath, Buffer.from(buffer));

  return `/uploads/lv-ai/${uniqueName}`;
}
