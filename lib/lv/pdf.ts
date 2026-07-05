// ─── LV-PDF-Generator ──────────────────────────────────────────────────────────
// Generiert ein professionelles Leistungsverzeichnis als PDF.
// Benötigt pdf-lib für PDF-Manipulation (keine Browser-Abhängigkeit).
//
// Verwendung (Server-seitig):
//   import { generateLvPdf } from "@/lib/lv/pdf";
//   const pdfBytes = await generateLvPdf(lvDocumentId);
//   // → Uint8Array, direkt als Response mit application/pdf Content-Type

import "server-only";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  getLvDocumentById,
  getLvDocumentSum,
  getLvPositionsByDocument,
  getProjectById,
} from "@/lib/db/lv-queries";

// ─── Layout-Konstanten (DIN A4 in mm, skaliert auf PDF-Points) ──────────────
const PAGE_WIDTH = 595.28; // A4 width in points
const PAGE_HEIGHT = 841.89; // A4 height in points
const MARGIN = 56.69; // ~20mm margin
const FONT_SIZE_TITLE = 16;
const FONT_SIZE_BODY = 9;
const FONT_SIZE_FOOTER = 7;
const ROW_HEIGHT = 18;
const HEADER_HEIGHT = 22;

// ─── Tabellen-Spalten (Breiten in Punkten) ───────────────────────────────────
const COL_OZ = 52;
const COL_TEXT = 220;
const COL_MENGE = 45;
const COL_EINHEIT = 35;
const COL_EP = 55;
const COL_GP = 65;
// ──────────────────────────────────────────────────────────────────────────────

function esc(text: string | null | undefined): string {
  if (!text) {
    return "";
  }
  // pdf-lib kann nur ASCII/Latin1 — Umlaute bleiben, pdf-lib >=1.17 supported Unicode
  return text.replace(/€/g, "EUR").substring(0, 200);
}

function euro(v: string | null): string {
  if (!v) {
    return "—";
  }
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n)) {
    return "—";
  }
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}

function euroShort(v: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(v);
}

// ─── PDF-Generator ───────────────────────────────────────────────────────────

export async function generateLvPdf(
  lvDocumentId: string
): Promise<{ bytes: Uint8Array; filename: string }> {
  const doc = await getLvDocumentById(lvDocumentId);
  if (!doc) {
    throw new Error("LV-Dokument nicht gefunden.");
  }

  const projekt = await getProjectById(doc.projectId);
  const positionen = await getLvPositionsByDocument(lvDocumentId);
  const summe = await getLvDocumentSum(lvDocumentId);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  // ─── Deckblatt ──────────────────────────────────────────────────────────────
  y -= 40;
  page.drawText("LEISTUNGSVERZEICHNIS", {
    x: MARGIN,
    y,
    size: FONT_SIZE_TITLE + 4,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 32;
  page.drawText(esc(doc.titel), {
    x: MARGIN,
    y,
    size: FONT_SIZE_TITLE,
    font: fontBold,
  });

  y -= 24;
  if (projekt) {
    page.drawText(`Projekt: ${esc(projekt.name)}`, {
      x: MARGIN,
      y,
      size: FONT_SIZE_BODY + 1,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
    y -= 18;
  }

  page.drawText(`Stand: ${new Date().toLocaleDateString("de-DE")} · LV.AI`, {
    x: MARGIN,
    y,
    size: FONT_SIZE_BODY,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  y -= 24;
  if (doc.gaebFormat) {
    page.drawText(`GAEB-Format: ${esc(doc.gaebFormat)}`, {
      x: MARGIN,
      y,
      size: FONT_SIZE_BODY,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    y -= 18;
  }

  page.drawText(`Positionen: ${positionen.length}`, {
    x: MARGIN,
    y,
    size: FONT_SIZE_BODY,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  if (summe > 0) {
    y -= 18;
    page.drawText(`Gesamtsumme: ${euroShort(summe)}`, {
      x: MARGIN,
      y,
      size: FONT_SIZE_BODY,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  // ─── Neue Seite für Positionstabelle ──────────────────────────────────────
  y -= 40;
  if (y < 100) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }

  // Tabellen-Kopf
  const headers = ["OZ", "Kurztext / Langtext", "Menge", "ME", "EP", "GP"];
  const colWidths = [COL_OZ, COL_TEXT, COL_MENGE, COL_EINHEIT, COL_EP, COL_GP];

  let x = MARGIN;
  for (let i = 0; i < headers.length; i++) {
    page.drawRectangle({
      x,
      y: y - HEADER_HEIGHT + 4,
      width: colWidths[i],
      height: HEADER_HEIGHT,
      color: rgb(0.92, 0.92, 0.92),
    });
    page.drawText(headers[i], {
      x: i === 1 ? x + 3 : i >= 3 ? x + colWidths[i] - 4 : x + 3,
      y: y - HEADER_HEIGHT + 8,
      size: FONT_SIZE_BODY - 1,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    x += colWidths[i];
  }
  y -= HEADER_HEIGHT;

  // Positionen zeichnen
  for (const pos of positionen) {
    if (y - ROW_HEIGHT < MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
      // Wiederhole Header auf neuer Seite
      let hx = MARGIN;
      for (let hi = 0; hi < headers.length; hi++) {
        page.drawRectangle({
          x: hx,
          y: y - HEADER_HEIGHT + 4,
          width: colWidths[hi],
          height: HEADER_HEIGHT,
          color: rgb(0.92, 0.92, 0.92),
        });
        page.drawText(headers[hi], {
          x: hi === 1 ? hx + 3 : hi >= 3 ? hx + colWidths[hi] - 4 : hx + 3,
          y: y - HEADER_HEIGHT + 8,
          size: FONT_SIZE_BODY - 1,
          font: fontBold,
          color: rgb(0.2, 0.2, 0.2),
        });
        hx += colWidths[hi];
      }
      y -= HEADER_HEIGHT;
    }

    const rowY = y - ROW_HEIGHT;

    // OZ
    page.drawText(esc(pos.oz), {
      x: MARGIN + 3,
      y: rowY + 4,
      size: FONT_SIZE_BODY,
      font: fontBold,
    });

    // Kurztext
    const text = pos.langtext
      ? `${esc(pos.kurztext)} · ${esc(pos.langtext)}`
      : esc(pos.kurztext);
    page.drawText(text.substring(0, 80), {
      x: MARGIN + COL_OZ + 3,
      y: rowY + 4,
      size: FONT_SIZE_BODY,
      font,
    });

    // Menge (rechtsbündig)
    page.drawText(pos.menge ?? "—", {
      x: MARGIN + COL_OZ + COL_TEXT + COL_MENGE - 4,
      y: rowY + 4,
      size: FONT_SIZE_BODY,
      font,
    });

    // Einheit
    page.drawText(esc(pos.einheit) || "—", {
      x: MARGIN + COL_OZ + COL_TEXT + COL_MENGE + COL_EINHEIT - 4,
      y: rowY + 4,
      size: FONT_SIZE_BODY,
      font,
    });

    // Einheitspreis (rechtsbündig)
    page.drawText(euro(pos.einheitspreis), {
      x: MARGIN + COL_OZ + COL_TEXT + COL_MENGE + COL_EINHEIT + COL_EP - 4,
      y: rowY + 4,
      size: FONT_SIZE_BODY,
      font,
    });

    // Gesamtpreis (rechtsbündig)
    page.drawText(euro(pos.gesamtpreis), {
      x:
        MARGIN +
        COL_OZ +
        COL_TEXT +
        COL_MENGE +
        COL_EINHEIT +
        COL_EP +
        COL_GP -
        4,
      y: rowY + 4,
      size: FONT_SIZE_BODY,
      font: fontBold,
    });

    y = rowY;
  }

  // ─── Summenzeile ──────────────────────────────────────────────────────────
  y -= ROW_HEIGHT + 4;
  if (y < MARGIN + 60) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }

  // Trennlinie
  page.drawLine({
    start: {
      x: MARGIN + COL_OZ + COL_TEXT + COL_MENGE + COL_EINHEIT,
      y: y + ROW_HEIGHT + 2,
    },
    end: {
      x: MARGIN + COL_OZ + COL_TEXT + COL_MENGE + COL_EINHEIT + COL_EP + COL_GP,
      y: y + ROW_HEIGHT + 2,
    },
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText("Gesamtsumme (netto)", {
    x: MARGIN + 3,
    y: y + 4,
    size: FONT_SIZE_BODY,
    font: fontBold,
  });

  page.drawText(euroShort(summe), {
    x:
      MARGIN +
      COL_OZ +
      COL_TEXT +
      COL_MENGE +
      COL_EINHEIT +
      COL_EP +
      COL_GP -
      4,
    y: y + 4,
    size: FONT_SIZE_BODY + 1,
    font: fontBold,
  });

  y -= 30;

  // ─── Footer auf allen Seiten ──────────────────────────────────────────────
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    p.drawText(
      `Seite ${i + 1} / ${pages.length} · LV.AI · ${new Date().toLocaleDateString("de-DE")}`,
      {
        x: MARGIN,
        y: 30,
        size: FONT_SIZE_FOOTER,
        font,
        color: rgb(0.5, 0.5, 0.5),
      }
    );
    p.drawText(`GAEB DA XML 3.3 · ${esc(doc.titel)}`, {
      x: MARGIN,
      y: 20,
      size: FONT_SIZE_FOOTER,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  const bytes = await pdfDoc.save();
  const filename = `LV_${esc(doc.titel)
    .replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "_")
    .substring(0, 50)
    .trim()}.pdf`;

  return { bytes, filename };
}
