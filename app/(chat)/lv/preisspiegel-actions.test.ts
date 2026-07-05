import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const authMock = vi.fn();
vi.mock("@/app/(auth)/auth", () => ({ auth: authMock }));

const revalidatePathMock = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));

const parseX84Mock = vi.fn();
const createPreisspiegelMock = vi.fn();
vi.mock("@/lib/gaeb/preisspiegel", () => ({
  parseX84Angebot: parseX84Mock,
  createPreisspiegel: createPreisspiegelMock,
}));

globalThis.fetch = vi.fn() as unknown as typeof fetch;

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const PROJECT_ID = "00000000-0000-0000-0000-000000000001";
const FILE_URL_A = "/uploads/lv-ai/bieter-a.xml";
const FILE_URL_B = "/uploads/lv-ai/bieter-b.xml";

function authedSession() {
  authMock.mockResolvedValue({ user: { id: "user-1" } });
}

const mockAngebotA = {
  bieterName: "Bieter A",
  positions: [],
  gesamtsumme: 10_000,
};
const mockAngebotB = {
  bieterName: "Bieter B",
  positions: [],
  gesamtsumme: 12_000,
};
const mockPreisspiegel = {
  positions: [],
  bieter: [],
  ausreisser: [],
  bieterCount: 2,
  positionCount: 0,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("generatePreisspiegelAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lehnt ohne Session ab", async () => {
    authMock.mockResolvedValue(null);
    const { generatePreisspiegelAction } = await import(
      "./preisspiegel-actions"
    );
    await expect(
      generatePreisspiegelAction({
        projectId: PROJECT_ID,
        fileUrls: [FILE_URL_A, FILE_URL_B],
      })
    ).rejects.toThrow();
  });

  it("lehnt mit weniger als 2 Dateien ab", async () => {
    authedSession();
    const { generatePreisspiegelAction } = await import(
      "./preisspiegel-actions"
    );
    await expect(
      generatePreisspiegelAction({
        projectId: PROJECT_ID,
        fileUrls: [FILE_URL_A],
      })
    ).rejects.toThrow();
  });

  it("lehnt mit ungültigen URLs ab", async () => {
    authedSession();
    const { generatePreisspiegelAction } = await import(
      "./preisspiegel-actions"
    );
    await expect(
      generatePreisspiegelAction({
        projectId: PROJECT_ID,
        fileUrls: ["file:///etc/passwd", "javascript:alert(1)"],
      })
    ).rejects.toThrow();
  });

  it("lehnt ab wenn weniger als 2 gültige Angebote", async () => {
    authedSession();
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => "invalid xml",
    });
    parseX84Mock.mockReturnValue(null);
    const { generatePreisspiegelAction } = await import(
      "./preisspiegel-actions"
    );
    await expect(
      generatePreisspiegelAction({
        projectId: PROJECT_ID,
        fileUrls: [FILE_URL_A, FILE_URL_B],
      })
    ).rejects.toThrow();
  });

  it("generiert Preisspiegel aus 2 validen Angeboten", async () => {
    authedSession();
    (globalThis.fetch as any)
      .mockResolvedValueOnce({ ok: true, text: async () => "xml-a" })
      .mockResolvedValueOnce({ ok: true, text: async () => "xml-b" });
    parseX84Mock
      .mockReturnValueOnce(mockAngebotA)
      .mockReturnValueOnce(mockAngebotB);
    createPreisspiegelMock.mockReturnValue(mockPreisspiegel);

    const { generatePreisspiegelAction } = await import(
      "./preisspiegel-actions"
    );
    const result = await generatePreisspiegelAction({
      projectId: PROJECT_ID,
      fileUrls: [FILE_URL_A, FILE_URL_B],
    });

    expect(result.bieterCount).toBe(2);
    expect(parseX84Mock).toHaveBeenCalledTimes(2);
    expect(createPreisspiegelMock).toHaveBeenCalledWith([
      mockAngebotA,
      mockAngebotB,
    ]);
    expect(revalidatePathMock).toHaveBeenCalledWith(
      `/lv/${PROJECT_ID}/preisspiegel`
    );
  });

  it("überspringt fehlerhafte Downloads und fährt fort", async () => {
    authedSession();
    (globalThis.fetch as any)
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, text: async () => "xml-b" })
      .mockResolvedValueOnce({ ok: true, text: async () => "xml-c" });
    parseX84Mock
      .mockReturnValueOnce(mockAngebotB)
      .mockReturnValueOnce(mockAngebotA);
    createPreisspiegelMock.mockReturnValue(mockPreisspiegel);

    const { generatePreisspiegelAction } = await import(
      "./preisspiegel-actions"
    );
    const result = await generatePreisspiegelAction({
      projectId: PROJECT_ID,
      fileUrls: ["/uploads/fail.xml", FILE_URL_B, FILE_URL_A],
    });

    expect(result.bieterCount).toBe(2);
  });
});
