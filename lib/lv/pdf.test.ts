import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const pdfSaveMock = vi.fn(async () => new Uint8Array([37, 80, 68, 70]));
  const drawTextMock = vi.fn();
  const drawLineMock = vi.fn();
  const drawRectangleMock = vi.fn();
  const getPagesMock = vi.fn(() => [{}]);

  const getLvDocumentByIdMock = vi.fn();
  const getLvPositionsByDocumentMock = vi.fn();
  const getLvDocumentSumMock = vi.fn();
  const getProjectByIdMock = vi.fn();

  return {
    drawLineMock,
    drawRectangleMock,
    drawTextMock,
    getLvDocumentByIdMock,
    getLvDocumentSumMock,
    getLvPositionsByDocumentMock,
    getPagesMock,
    getProjectByIdMock,
    pdfSaveMock,
  };
});

vi.mock("server-only", () => ({}));

vi.mock("pdf-lib", () => ({
  PDFDocument: {
    create: vi.fn(() => ({
      addPage: vi.fn(() => ({
        drawLine: mocks.drawLineMock,
        drawRectangle: mocks.drawRectangleMock,
        drawText: mocks.drawTextMock,
      })),
      embedFont: vi.fn(async () => ({})),
      getPages: mocks.getPagesMock,
      save: mocks.pdfSaveMock,
    })),
  },
  rgb: vi.fn(() => ({})),
  StandardFonts: { Helvetica: "Helvetica", HelveticaBold: "HelveticaBold" },
}));

vi.mock("@/lib/db/lv-queries", () => ({
  getLvDocumentById: mocks.getLvDocumentByIdMock,
  getLvDocumentSum: mocks.getLvDocumentSumMock,
  getLvPositionsByDocument: mocks.getLvPositionsByDocumentMock,
  getProjectById: mocks.getProjectByIdMock,
}));

import { generateLvPdf } from "./pdf";

const {
  pdfSaveMock,
  drawTextMock,
  getLvDocumentByIdMock,
  getLvPositionsByDocumentMock,
  getLvDocumentSumMock,
  getProjectByIdMock,
} = mocks;

describe("generateLvPdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getPagesMock.mockReturnValue([
      {
        drawLine: mocks.drawLineMock,
        drawRectangle: mocks.drawRectangleMock,
        drawText: mocks.drawTextMock,
      },
    ]);
  });

  it("wirft wenn LV nicht existiert", async () => {
    getLvDocumentByIdMock.mockResolvedValue(null);
    await expect(
      generateLvPdf("00000000-0000-0000-0000-000000000001")
    ).rejects.toThrow("LV-Dokument nicht gefunden.");
  });

  it("generiert PDF mit Deckblatt und Positionen", async () => {
    getLvDocumentByIdMock.mockResolvedValue({
      createdAt: new Date(),
      gaebFormat: "X83",
      id: "lv-1",
      projectId: "proj-1",
      titel: "Rohbauarbeiten KiTa",
      updatedAt: new Date(),
    });
    getProjectByIdMock.mockResolvedValue({
      id: "proj-1",
      name: "KiTa Liebigstraße",
    });
    getLvPositionsByDocumentMock.mockResolvedValue([
      {
        einheit: "m³",
        einheitspreis: "25.00",
        gesamtpreis: "2512.50",
        kurztext: "Boden aushuben",
        langtext: null,
        menge: "100.500",
        oz: "01.0010",
      },
      {
        einheit: "m³",
        einheitspreis: "185.00",
        gesamtpreis: "8325.00",
        kurztext: "Streifenfundamente",
        langtext: "Beton C25/30",
        menge: "45.000",
        oz: "01.0020",
      },
    ]);
    getLvDocumentSumMock.mockResolvedValue(10_837.5);

    const result = await generateLvPdf("00000000-0000-0000-0000-000000000001");

    expect(result.filename).toContain("Rohbauarbeiten");
    expect(result.filename).toContain(".pdf");
    expect(result.bytes).toBeInstanceOf(Uint8Array);
    expect(pdfSaveMock).toHaveBeenCalled();
    expect(drawTextMock).toHaveBeenCalled();
  });

  it("generiert PDF auch ohne Projekt", async () => {
    getLvDocumentByIdMock.mockResolvedValue({
      gaebFormat: null,
      id: "lv-2",
      titel: "Estricharbeiten",
    });
    getProjectByIdMock.mockResolvedValue(null);
    getLvPositionsByDocumentMock.mockResolvedValue([
      {
        einheit: "m²",
        einheitspreis: "12.50",
        gesamtpreis: "2500.00",
        kurztext: "Zementestrich",
        langtext: null,
        menge: "200",
        oz: "02.0010",
      },
    ]);
    getLvDocumentSumMock.mockResolvedValue(2500);

    const result = await generateLvPdf("00000000-0000-0000-0000-000000000002");
    expect(result.bytes).toBeInstanceOf(Uint8Array);
  });

  it("generiert PDF mit leerem LV (0 Positionen)", async () => {
    getLvDocumentByIdMock.mockResolvedValue({
      id: "lv-3",
      titel: "Leeres LV",
    });
    getProjectByIdMock.mockResolvedValue(null);
    getLvPositionsByDocumentMock.mockResolvedValue([]);
    getLvDocumentSumMock.mockResolvedValue(0);

    const result = await generateLvPdf("00000000-0000-0000-0000-000000000003");
    expect(result.bytes).toBeInstanceOf(Uint8Array);
  });
});
