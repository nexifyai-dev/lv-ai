import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const authMock = vi.fn();
vi.mock("@/app/(auth)/auth", () => ({
  auth: authMock,
}));

const putMock = vi.fn();
vi.mock("@vercel/blob", () => ({
  put: putMock,
}));

// vi.hoisted stellt sicher, dass die Mocks vor vi.mock-Aufruf verfügbar sind
// (vi.mock wird gehoistet, normale consts nicht).
const fsMocks = vi.hoisted(() => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("node:fs/promises", () => ({
  mkdir: fsMocks.mkdir,
  writeFile: fsMocks.writeFile,
}));

vi.mock("node:path", async (orig) => {
  const real = await orig<typeof import("node:path")>();
  return {
    ...real,
    join: (...parts: string[]) => parts.join("/"),
  };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildFormData(file: { name: string; type: string; content: string }) {
  const blob = new Blob([file.content], { type: file.type });
  const fd = new FormData();
  fd.append("file", blob, file.name);
  return fd;
}

function jsonRequest(body: FormData): Request {
  return new Request("http://localhost/api/files/upload", {
    method: "POST",
    body,
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("/api/files/upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    // Default: kein BLOB-Token → lokaler Fallback aktiv. vi.stubEnv statt
    // delete (Biome noDelete-Regel).
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lehnt Anfragen ohne Session mit 401 ab", async () => {
    authMock.mockResolvedValue(null);
    const { POST } = await import("./route");
    const fd = buildFormData({
      name: "test.pdf",
      type: "application/pdf",
      content: "%PDF-1.4 test",
    });
    const res = await POST(jsonRequest(fd));
    expect(res.status).toBe(401);
  });

  it("lehnt leeren Body ab", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    const { POST } = await import("./route");
    const req = new Request("http://localhost/api/files/upload", {
      method: "POST",
      body: null,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("lehnt nicht-erlaubten Dateityp ab", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    const { POST } = await import("./route");
    const fd = buildFormData({
      name: "evil.exe",
      type: "application/x-msdownload",
      content: "binary",
    });
    const res = await POST(jsonRequest(fd));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Dateitypen");
  });

  it("lehnt Datei > 20MB ab", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    const { POST } = await import("./route");
    // 21MB Buffer
    const big = new Blob([new Uint8Array(21 * 1024 * 1024)], {
      type: "application/pdf",
    });
    const fd = new FormData();
    fd.append("file", big, "big.pdf");
    const res = await POST(jsonRequest(fd));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("20MB");
  });

  it("nutzt lokalen Fallback wenn BLOB_READ_WRITE_TOKEN fehlt", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    fsMocks.mkdir.mockClear();
    fsMocks.writeFile.mockClear();

    const { POST } = await import("./route");
    const fd = buildFormData({
      name: "plan.pdf",
      type: "application/pdf",
      content: "%PDF-1.4 test",
    });
    const res = await POST(jsonRequest(fd));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toMatch(/^\/uploads\/lv-ai\//);
    expect(data.pathname).toBe("plan.pdf");
    expect(data.contentType).toBe("application/pdf");
    expect(fsMocks.mkdir).toHaveBeenCalled();
    expect(fsMocks.writeFile).toHaveBeenCalled();
  });

  it("nutzt Vercel Blob wenn BLOB_READ_WRITE_TOKEN gesetzt", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    process.env.BLOB_READ_WRITE_TOKEN = "vercel-blob-token";
    putMock.mockResolvedValue({
      url: "https://example.public.blob.vercel-storage.com/lv-ai/123-plan.pdf",
      pathname: "lv-ai/123-plan.pdf",
    });

    const { POST } = await import("./route");
    const fd = buildFormData({
      name: "plan.pdf",
      type: "application/pdf",
      content: "%PDF-1.4 test",
    });
    const res = await POST(jsonRequest(fd));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toContain("vercel-storage.com");
    expect(data.pathname).toBe("plan.pdf");
    expect(putMock).toHaveBeenCalled();
  });

  it("akzeptiert GAEB-Datei (.xml Endung)", async () => {
    authMock.mockResolvedValue({ user: { id: "u1" } });
    fsMocks.mkdir.mockClear();
    fsMocks.writeFile.mockClear();

    const { POST } = await import("./route");
    const fd = buildFormData({
      name: "lv.xml",
      type: "application/xml",
      content: '<?xml version="1.0"?><GAEB></GAEB>',
    });
    const res = await POST(jsonRequest(fd));
    expect(res.status).toBe(200);
  });
});
