import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const authMock = vi.fn();
vi.mock("@/app/(auth)/auth", () => ({ auth: authMock }));

const getDocMock = vi.fn();
const getPosMock = vi.fn();
vi.mock("@/lib/db/lv-queries", () => ({
  getLvDocumentById: getDocMock,
  getLvPositionsByDocument: getPosMock,
}));

const exportMock = vi.fn();
vi.mock("@/lib/gaeb/export", () => ({
  exportGaebFromDb: exportMock,
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

const PROJECT_ID = "00000000-0000-0000-0000-000000000001";
const DOC_ID = "00000000-0000-0000-0000-000000000002";

function makeRequest(params?: {
  documentId?: string;
  format?: string;
}): [Request, { params: Promise<{ projectId: string }> }] {
  const url = new URL("http://localhost/lv/proj/export");
  if (params?.documentId) {
    url.searchParams.set("documentId", params.documentId);
  }
  if (params?.format) {
    url.searchParams.set("format", params.format);
  }
  const req = new Request(url);
  return [req, { params: Promise.resolve({ projectId: PROJECT_ID }) }];
}

function authedSession() {
  authMock.mockResolvedValue({ user: { id: "user-1" } });
}

describe("GET /lv/[projectId]/export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lehnt ohne Session ab", async () => {
    authMock.mockResolvedValue(null);
    const { GET } = await import("./route");
    const [req, ctx] = makeRequest({ documentId: DOC_ID });
    const res = await GET(req, ctx);
    expect(res.status).toBe(401);
  });

  it("lehnt ab ohne documentId", async () => {
    authedSession();
    const { GET } = await import("./route");
    const [req, ctx] = makeRequest(); // kein documentId
    const res = await GET(req, ctx);
    expect(res.status).toBe(400);
  });

  it("lehnt ab wenn Dokument nicht gefunden", async () => {
    authedSession();
    getDocMock.mockResolvedValue(null);
    const { GET } = await import("./route");
    const [req, ctx] = makeRequest({ documentId: DOC_ID });
    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });

  it("lehnt ab wenn Dokument zu anderem Projekt gehört", async () => {
    authedSession();
    getDocMock.mockResolvedValue({
      id: DOC_ID,
      titel: "Test",
      projectId: "anderes-projekt",
    });
    const { GET } = await import("./route");
    const [req, ctx] = makeRequest({ documentId: DOC_ID });
    const res = await GET(req, ctx);
    expect(res.status).toBe(404);
  });

  it("lehnt ab wenn 0 Positionen", async () => {
    authedSession();
    getDocMock.mockResolvedValue({
      id: DOC_ID,
      titel: "Test-LV",
      projectId: PROJECT_ID,
    });
    getPosMock.mockResolvedValue([]);
    const { GET } = await import("./route");
    const [req, ctx] = makeRequest({ documentId: DOC_ID });
    const res = await GET(req, ctx);
    expect(res.status).toBe(400);
  });

  it("exportiert X83 als XML mit Download-Header", async () => {
    authedSession();
    getDocMock.mockResolvedValue({
      id: DOC_ID,
      titel: "Rohbau KiTa",
      projectId: PROJECT_ID,
    });
    getPosMock.mockResolvedValue([
      { oz: "1.1", kurztext: "Test", menge: "100", einheit: "m" },
    ]);
    exportMock.mockReturnValue('<?xml version="1.0"?><GAEB>test</GAEB>');

    const { GET } = await import("./route");
    const [req, ctx] = makeRequest({ documentId: DOC_ID, format: "X83" });
    const res = await GET(req, ctx);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/xml");
    expect(res.headers.get("Content-Disposition")).toContain("attachment");
    expect(res.headers.get("Content-Disposition")).toContain("GAEB_X83_");
    const body = await res.text();
    expect(body).toContain("<GAEB>");
  });

  it("nutzt X83 als Default-Format", async () => {
    authedSession();
    getDocMock.mockResolvedValue({
      id: DOC_ID,
      titel: "Test",
      projectId: PROJECT_ID,
    });
    getPosMock.mockResolvedValue([{ oz: "1", kurztext: "T" }]);
    exportMock.mockReturnValue("<GAEB/>");

    const { GET } = await import("./route");
    const [req, ctx] = makeRequest({ documentId: DOC_ID });
    await GET(req, ctx);

    expect(exportMock).toHaveBeenCalledWith(
      expect.objectContaining({ format: "X83" })
    );
  });

  it("unterstützt X84 Format", async () => {
    authedSession();
    getDocMock.mockResolvedValue({
      id: DOC_ID,
      titel: "Test",
      projectId: PROJECT_ID,
    });
    getPosMock.mockResolvedValue([{ oz: "1", kurztext: "T" }]);
    exportMock.mockReturnValue("<GAEB X84/>");

    const { GET } = await import("./route");
    const [req, ctx] = makeRequest({ documentId: DOC_ID, format: "X84" });
    const res = await GET(req, ctx);

    expect(res.status).toBe(200);
    expect(exportMock).toHaveBeenCalledWith(
      expect.objectContaining({ format: "X84" })
    );
    expect(res.headers.get("Content-Disposition")).toContain("GAEB_X84_");
  });

  it("gibt Export-Fehler als 400 zurück", async () => {
    authedSession();
    getDocMock.mockResolvedValue({
      id: DOC_ID,
      titel: "Test",
      projectId: PROJECT_ID,
    });
    getPosMock.mockResolvedValue([{ oz: "1", kurztext: "T" }]);
    exportMock.mockImplementation(() => {
      throw new Error("bidderName fehlt");
    });

    const { GET } = await import("./route");
    const [req, ctx] = makeRequest({ documentId: DOC_ID, format: "X84" });
    const res = await GET(req, ctx);
    expect(res.status).toBe(400);
  });
});
