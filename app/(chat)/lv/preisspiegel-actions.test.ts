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

vi.mock("server-only", () => ({}));

const deleteOffersByProjectMock = vi.fn(async () => undefined);
const createOfferMock = vi.fn(
  async (input: { bieter: string; projectId: string }) => ({
    id: `offer-${input.bieter}`,
    projectId: input.projectId,
    bieter: input.bieter,
    status: "eingereicht",
  })
);
const replaceOfferPositionsMock = vi.fn(async () => undefined);
vi.mock("@/lib/db/lv-queries", () => ({
  deleteOffersByProject: deleteOffersByProjectMock,
  createOffer: createOfferMock,
  replaceOfferPositions: replaceOfferPositionsMock,
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
    // DB persistiert Angebote (VOB/A § 17)
    expect(deleteOffersByProjectMock).toHaveBeenCalledWith(PROJECT_ID);
    expect(createOfferMock).toHaveBeenCalledTimes(2);
    expect(replaceOfferPositionsMock).toHaveBeenCalledTimes(2);
    expect(revalidatePathMock).toHaveBeenCalledWith(
      `/lv/${PROJECT_ID}/preisspiegel`
    );
    expect(revalidatePathMock).toHaveBeenCalledWith(`/lv/${PROJECT_ID}/bieter`);
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
    // Persistierte Angebote trotz Download-Fehler
    expect(deleteOffersByProjectMock).toHaveBeenCalled();
    expect(createOfferMock).toHaveBeenCalledTimes(2);
  });

  it("persistiert alle Positionen in DB", async () => {
    authedSession();
    (globalThis.fetch as any)
      .mockResolvedValueOnce({ ok: true, text: async () => "xml-a" })
      .mockResolvedValueOnce({ ok: true, text: async () => "xml-b" });
    const angebotMitPos = {
      bieterName: "Bieter X",
      positions: [
        {
          oz: "01.0010",
          kurztext: "Aushub",
          menge: "100",
          einheit: "m³",
          einheitspreis: "25.00",
          gesamtpreis: "2500.00",
        },
      ],
      gesamtsumme: 2500,
    };
    parseX84Mock
      .mockReturnValueOnce(angebotMitPos)
      .mockReturnValueOnce(mockAngebotB);
    createPreisspiegelMock.mockReturnValue(mockPreisspiegel);

    const { generatePreisspiegelAction } = await import(
      "./preisspiegel-actions"
    );
    await generatePreisspiegelAction({
      projectId: PROJECT_ID,
      fileUrls: [FILE_URL_A, FILE_URL_B],
    });

    expect(replaceOfferPositionsMock).toHaveBeenCalledTimes(2);
    // Erster Call: Positionen korrekt gemappt
    const firstCall = replaceOfferPositionsMock.mock.calls[0] as unknown[];
    const firstCallPositions = firstCall[1] as Array<{
      oz: string;
      kurztext: string;
      einheitspreis: string;
    }>;
    expect(firstCallPositions).toHaveLength(1);
    expect(firstCallPositions[0].oz).toBe("01.0010");
    expect(firstCallPositions[0].kurztext).toBe("Aushub");
    expect(firstCallPositions[0].einheitspreis).toBe("25.00");
  });
});
