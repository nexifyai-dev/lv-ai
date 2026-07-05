import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────
vi.mock("server-only", () => ({}));

const authMock = vi.fn();
vi.mock("@/app/(auth)/auth", () => ({
  auth: authMock,
}));

const revalidatePathMock = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

const createDocMock = vi.fn();
const createPosMock = vi.fn();
const updatePosMock = vi.fn();
const deletePosMock = vi.fn();
const getDocMock = vi.fn();

vi.mock("@/lib/db/lv-queries", () => ({
  createLvDocument: createDocMock,
  createLvPosition: createPosMock,
  updateLvPosition: updatePosMock,
  deleteLvPosition: deletePosMock,
  getLvDocumentById: getDocMock,
}));

// ─── Helper ───────────────────────────────────────────────────────────────────
function authedSession() {
  authMock.mockResolvedValue({ user: { id: "user-1" } });
}
function noSession() {
  authMock.mockResolvedValue(null);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("LV-Server-Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createLvDocumentAction", () => {
    it("wirft ChatbotError ohne Session", async () => {
      noSession();
      const { createLvDocumentAction } = await import("./actions");
      await expect(
        createLvDocumentAction({
          projectId: "00000000-0000-0000-0000-000000000001",
          titel: "Test-LV",
        })
      ).rejects.toThrow("anmelden");
    });

    it("erstellt Dokument mit gueltiger Session und revalidiert Route", async () => {
      authedSession();
      const fakeDoc = {
        id: "doc-1",
        projectId: "00000000-0000-0000-0000-000000000001",
        titel: "Test-LV",
      };
      createDocMock.mockResolvedValue(fakeDoc);
      const { createLvDocumentAction } = await import("./actions");
      const result = await createLvDocumentAction({
        projectId: "00000000-0000-0000-0000-000000000001",
        titel: "Test-LV",
        gaebFormat: "X83",
      });
      expect(result).toEqual(fakeDoc);
      expect(revalidatePathMock).toHaveBeenCalledWith(
        "/lv/00000000-0000-0000-0000-000000000001"
      );
    });

    it("validiert titel-Pflichtfeld", async () => {
      authedSession();
      const { createLvDocumentAction } = await import("./actions");
      await expect(
        createLvDocumentAction({
          projectId: "00000000-0000-0000-0000-000000000001",
          titel: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("createLvPositionAction", () => {
    it("lehnt Position mit ungueltiger OZ ab", async () => {
      authedSession();
      getDocMock.mockResolvedValue({ id: "lv-1", projectId: "p-1" });
      const { createLvPositionAction } = await import("./actions");
      await expect(
        createLvPositionAction({
          lvDocumentId: "00000000-0000-0000-0000-000000000002",
          oz: "not-numeric",
          kurztext: "Boden aushuben",
        })
      ).rejects.toThrow();
    });

    it("wirft not_found wenn LV-Dokument nicht existiert", async () => {
      authedSession();
      getDocMock.mockResolvedValue(null);
      const { createLvPositionAction } = await import("./actions");
      await expect(
        createLvPositionAction({
          lvDocumentId: "00000000-0000-0000-0000-000000000002",
          oz: "01.0010",
          kurztext: "Boden aushuben",
        })
      ).rejects.toThrow("nicht gefunden");
    });

    it("erstellt Position und revalidiert Projektroute", async () => {
      authedSession();
      const doc = {
        id: "lv-1",
        projectId: "00000000-0000-0000-0000-000000000003",
      };
      const pos = {
        id: "pos-1",
        lvDocumentId: "lv-1",
        oz: "01.0010",
        kurztext: "Boden aushuben",
      };
      getDocMock.mockResolvedValue(doc);
      createPosMock.mockResolvedValue(pos);
      const { createLvPositionAction } = await import("./actions");
      const result = await createLvPositionAction({
        lvDocumentId: "00000000-0000-0000-0000-000000000002",
        oz: "01.0010",
        kurztext: "Boden aushuben",
        menge: "100.5",
        einheit: "m3",
      });
      expect(result).toEqual(pos);
      expect(revalidatePathMock).toHaveBeenCalledWith(
        "/lv/00000000-0000-0000-0000-000000000003"
      );
    });
  });

  describe("deleteLvPositionAction", () => {
    it("lehnt ungueltige UUID ab", async () => {
      authedSession();
      const { deleteLvPositionAction } = await import("./actions");
      await expect(deleteLvPositionAction("not-a-uuid")).rejects.toThrow(
        "Anfrage"
      );
    });

    it("loescht mit gueltiger UUID", async () => {
      authedSession();
      deletePosMock.mockResolvedValue(undefined);
      const { deleteLvPositionAction } = await import("./actions");
      const result = await deleteLvPositionAction(
        "00000000-0000-0000-0000-000000000004"
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe("updateLvPositionAction", () => {
    it("aktualisiert Position und revalidiert", async () => {
      authedSession();
      const updated = {
        id: "00000000-0000-0000-0000-000000000005",
        lvDocumentId: "00000000-0000-0000-0000-000000000006",
        oz: "02.0010",
        kurztext: "Geändert",
      };
      updatePosMock.mockResolvedValue(updated);
      getDocMock.mockResolvedValue({
        id: updated.lvDocumentId,
        projectId: "p-1",
      });
      const { updateLvPositionAction } = await import("./actions");
      const result = await updateLvPositionAction({
        id: updated.id,
        oz: "02.0010",
        kurztext: "Geändert",
      });
      expect(result).toEqual(updated);
    });

    it("wirft not_found wenn Position nicht existiert", async () => {
      authedSession();
      updatePosMock.mockResolvedValue(null);
      const { updateLvPositionAction } = await import("./actions");
      await expect(
        updateLvPositionAction({
          id: "00000000-0000-0000-0000-000000000005",
          kurztext: "Geändert",
        })
      ).rejects.toThrow("nicht gefunden");
    });
  });
});
