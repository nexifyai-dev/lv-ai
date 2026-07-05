import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  getLvDocumentById,
  getLvPositionsByDocument,
} from "@/lib/db/lv-queries";
import { ChatbotError } from "@/lib/errors";
import { exportGaebFromDb, type GaebFormat } from "@/lib/gaeb/export";

export const maxDuration = 30;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new ChatbotError("unauthorized:auth").toResponse();
  }

  const { projectId } = await params;
  const url = new URL(request.url);
  const documentId = url.searchParams.get("documentId");
  const format = (url.searchParams.get("format") ?? "X83") as GaebFormat;

  if (!documentId || !z.string().uuid().safeParse(documentId).success) {
    return new ChatbotError(
      "bad_request:api",
      "documentId Query-Parameter fehlt oder ungültig."
    ).toResponse();
  }

  if (!["X81", "X82", "X83", "X84", "X85", "X86"].includes(format)) {
    return new ChatbotError(
      "bad_request:api",
      "Format ungültig. Erlaubt: X81–X86."
    ).toResponse();
  }

  const document = await getLvDocumentById(documentId);
  if (!document || document.projectId !== projectId) {
    return new ChatbotError("not_found:chat").toResponse();
  }

  const positions = await getLvPositionsByDocument(documentId);
  if (positions.length === 0) {
    return new ChatbotError(
      "bad_request:api",
      "LV-Dokument hat keine Positionen."
    ).toResponse();
  }

  let xml: string;
  try {
    xml = exportGaebFromDb({
      format,
      projectName: document.titel,
      positions: positions.map((p) => ({
        oz: p.oz,
        kurztext: p.kurztext,
        langtext: p.langtext,
        menge: p.menge,
        einheit: p.einheit,
        einheitspreis: p.einheitspreis,
        gesamtpreis: p.gesamtpreis,
      })),
    });
  } catch (err) {
    return new ChatbotError(
      "bad_request:api",
      err instanceof Error ? err.message : "GAEB-Export fehlgeschlagen."
    ).toResponse();
  }

  const safeName = document.titel.replace(/[^a-zA-Z0-9äöüÄÖÜß._-]/g, "_");
  const filename = `GAEB_${format}_${safeName}.xml`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
