import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { getLvDocumentById } from "@/lib/db/lv-queries";
import { ChatbotError } from "@/lib/errors";
import { generateLvPdf } from "@/lib/lv/pdf";

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

  if (!documentId || !z.string().uuid().safeParse(documentId).success) {
    return new ChatbotError(
      "bad_request:api",
      "documentId Query-Parameter fehlt oder ungültig."
    ).toResponse();
  }

  const document = await getLvDocumentById(documentId);
  if (!document || document.projectId !== projectId) {
    return new ChatbotError("not_found:chat").toResponse();
  }

  let pdfBytes: Uint8Array;
  let filename: string;
  try {
    const result = await generateLvPdf(documentId);
    pdfBytes = result.bytes;
    filename = result.filename;
  } catch (err) {
    return new ChatbotError(
      "bad_request:api",
      err instanceof Error ? err.message : "PDF-Generierung fehlgeschlagen."
    ).toResponse();
  }

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      "Cache-Control": "no-store",
    },
  });
}
