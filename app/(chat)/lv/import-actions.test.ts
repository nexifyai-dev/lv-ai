import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const authMock = vi.fn();
vi.mock("@/app/(auth)/auth", () => ({ auth: authMock }));

const revalidatePathMock = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));

const createDocMock = vi.fn();
const createPosMock = vi.fn();
vi.mock("@/lib/db/lv-queries", () => ({
  createLvDocument: createDocMock,
  createLvPosition: createPosMock,
}));

// parseLvContent mocken — wir wollen die Action-Logik testen, nicht den Parser
// (der hat eigene Tests).
const parseLvContentMock = vi.fn();
vi.mock("@/lib/gaeb/text-parser", () => ({
  parseLvContent: parseLvContentMock,
}));

// fetch mocken
const fetchMock = vi.fn();
globalThis.fetch = fetchMock as unknown as typeof fetch;

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const PROJECT_ID = "00000000-0000-0000-0000-000000000001";
const FILE_URL = "/uploads/lv-ai/123-test.xml";
const DOC_ID = "doc-001";

function authedSession() {
  authMock.mockResolvedValue({ user: { id: "user-1" } });
}

function makeTextResult(positions: any[], format = "lv-text") {
  return {
    format,
    gaebResult:
      format === "gaeb-xml"
        ? {
            positions,
            projectName: "GAEB-Projekt",
            success: true,
          }
        : undefined,
    lvTextResult:
      format === "lv-text"
        ? {
            hinweistexte: [],
            positions,
            success: true,
            warnings: [],
          }
        : undefined,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("importLvFileAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lehnt ohne Session ab", async () => {
    authMock.mockResolvedValue(null);
    const { importLvFileAction } = await import("./import-actions");
    await expect(
      importLvFileAction({
        fileName: "test.xml",
        fileUrl: FILE_URL,
        projectId: PROJECT_ID,
      })
    ).rejects.toThrow("anmelden");
  });

  it("lehnt ungültige URL ab (keine Upload-Domain)", async () => {
    authedSession();
    const { importLvFileAction } = await import("./import-actions");
    await expect(
      importLvFileAction({
        fileName: "test.xml",
        fileUrl: "https://evil.com/file.xml",
        projectId: PROJECT_ID,
      })
    ).rejects.toThrow();
  });

  it("lehnt leeren Dateiinhalt ab", async () => {
    authedSession();
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "",
    });
    const { importLvFileAction } = await import("./import-actions");
    // ChatbotError("bad_request:api") liefert generische Nachricht — wir
    // prüfen nur, dass ein Fehler geworfen wird, nicht die Substring-Message.
    await expect(
      importLvFileAction({
        fileName: "empty.xml",
        fileUrl: FILE_URL,
        projectId: PROJECT_ID,
      })
    ).rejects.toThrow();
  });

  it("lehnt unbekanntes Format ab", async () => {
    authedSession();
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "unstrukturierter Text",
    });
    parseLvContentMock.mockResolvedValue({ format: "unknown" });
    const { importLvFileAction } = await import("./import-actions");
    await expect(
      importLvFileAction({
        fileName: "test.txt",
        fileUrl: FILE_URL,
        projectId: PROJECT_ID,
      })
    ).rejects.toThrow();
  });

  it("lehnt ab wenn Parser 0 Positionen findet", async () => {
    authedSession();
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "irgendwas",
    });
    parseLvContentMock.mockResolvedValue(makeTextResult([]));
    const { importLvFileAction } = await import("./import-actions");
    await expect(
      importLvFileAction({
        fileName: "test.xml",
        fileUrl: FILE_URL,
        projectId: PROJECT_ID,
      })
    ).rejects.toThrow();
  });

  it("importiert LV-Text-Positionen und revalidiert Route", async () => {
    authedSession();
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "fake content",
    });
    const positions = [
      { einheit: "m", kurztext: "Wellrohr M25", menge: "800", oz: "1.6.10" },
      {
        einheit: "m³",
        kurztext: "Stahlbeton C20/25",
        menge: "12",
        oz: "4.1.50",
      },
    ];
    parseLvContentMock.mockResolvedValue(makeTextResult(positions, "lv-text"));
    createDocMock.mockResolvedValue({ id: DOC_ID, projectId: PROJECT_ID });
    createPosMock.mockResolvedValue({});

    const { importLvFileAction } = await import("./import-actions");
    const result = await importLvFileAction({
      fileName: "test.txt",
      fileUrl: FILE_URL,
      projectId: PROJECT_ID,
    });

    expect(result.documentId).toBe(DOC_ID);
    expect(result.format).toBe("lv-text");
    expect(result.positionCount).toBe(2);
    expect(result.skippedPositions).toBe(0);
    expect(createDocMock).toHaveBeenCalledWith({
      gaebFormat: undefined,
      projectId: PROJECT_ID,
      titel: "test", // fileName ohne Extension
      version: "1.0",
    });
    expect(createPosMock).toHaveBeenCalledTimes(2);
    expect(revalidatePathMock).toHaveBeenCalledWith(`/lv/${PROJECT_ID}`);
  });

  it("normalisiert Double-Dot-OZ (5..40 → 5.40)", async () => {
    authedSession();
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "fake",
    });
    const positions = [
      { einheit: "m²", kurztext: "Mauerwerk", menge: "716", oz: "5..40" },
    ];
    parseLvContentMock.mockResolvedValue(makeTextResult(positions, "lv-text"));
    createDocMock.mockResolvedValue({ id: DOC_ID, projectId: PROJECT_ID });
    createPosMock.mockResolvedValue({});

    const { importLvFileAction } = await import("./import-actions");
    await importLvFileAction({
      fileName: "test.txt",
      fileUrl: FILE_URL,
      projectId: PROJECT_ID,
    });

    expect(createPosMock).toHaveBeenCalledWith(
      expect.objectContaining({ oz: "5.40" })
    );
  });

  it("überspringt Positionen mit zu langer OZ und warnt", async () => {
    authedSession();
    fetchMock.mockResolvedValue({ ok: true, text: async () => "fake" });
    const longOz = "1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20.21";
    const positions = [
      { einheit: "St", kurztext: "Bad", menge: "1", oz: longOz },
      { einheit: "m", kurztext: "Good", menge: "10", oz: "1.10" },
    ];
    parseLvContentMock.mockResolvedValue(makeTextResult(positions, "lv-text"));
    createDocMock.mockResolvedValue({ id: DOC_ID, projectId: PROJECT_ID });
    createPosMock.mockResolvedValue({});

    const { importLvFileAction } = await import("./import-actions");
    const result = await importLvFileAction({
      fileName: "test.txt",
      fileUrl: FILE_URL,
      projectId: PROJECT_ID,
    });

    expect(result.positionCount).toBe(1);
    expect(result.skippedPositions).toBe(1);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("nutzt GAEB-Projektname als Titel wenn vorhanden", async () => {
    authedSession();
    fetchMock.mockResolvedValue({ ok: true, text: async () => "fake" });
    const positions = [
      { einheit: "m³", kurztext: "Boden", menge: "100", oz: "01.0010" },
    ];
    parseLvContentMock.mockResolvedValue({
      format: "gaeb-xml",
      gaebResult: {
        gaebFormat: "X83",
        positions,
        projectName: "GAEB-Testprojekt",
        success: true,
      },
    });
    createDocMock.mockResolvedValue({ id: DOC_ID, projectId: PROJECT_ID });
    createPosMock.mockResolvedValue({});

    const { importLvFileAction } = await import("./import-actions");
    await importLvFileAction({
      fileName: "x83.xml",
      fileUrl: FILE_URL,
      projectId: PROJECT_ID,
    });

    expect(createDocMock).toHaveBeenCalledWith(
      expect.objectContaining({
        gaebFormat: "X83",
        titel: "GAEB-Testprojekt",
      })
    );
  });

  it("gibt Document-ID und Format zurück", async () => {
    authedSession();
    fetchMock.mockResolvedValue({ ok: true, text: async () => "fake" });
    parseLvContentMock.mockResolvedValue(
      makeTextResult(
        [{ einheit: "St", kurztext: "Test", menge: "1", oz: "1.1" }],
        "gaeb-xml"
      )
    );
    createDocMock.mockResolvedValue({ id: DOC_ID, projectId: PROJECT_ID });
    createPosMock.mockResolvedValue({});

    const { importLvFileAction } = await import("./import-actions");
    const result = await importLvFileAction({
      fileName: "test.xml",
      fileUrl: FILE_URL,
      projectId: PROJECT_ID,
    });
    expect(result.documentId).toBe(DOC_ID);
    expect(result.format).toBe("gaeb-xml");
  });
});
