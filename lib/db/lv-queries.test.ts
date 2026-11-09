import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────
// `server-only` darf in Vitest nicht echt geladen werden — stubben.
vi.mock("server-only", () => ({}));

// Drizzle und postgres dürfen in Unit-Tests nicht echt auf die DB zugreifen.
// vi.hoisted stellt sicher, dass die Mocks vor vi.mock verfügbar sind.
const mocks = vi.hoisted(() => {
  // Thenable, das sofort zu [] resolved — für `await db.select().from().where()...`
  const makeThenable = () => ({
    limit: vi.fn(() => makeThenable()),
    orderBy: vi.fn(() => makeThenable()),
    // biome-ignore lint/suspicious/noThenProperty: Thenable-Mock braucht `then` für await
    then: vi.fn((resolve: any) => Promise.resolve([]).then(resolve)),
    where: vi.fn(() => makeThenable()),
  });

  const chain = makeThenable();

  const selectSpy = vi.fn(() => ({
    from: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    orderBy: vi.fn(() => chain),
    where: vi.fn(() => chain),
  }));

  const insertSpy = vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn(async () => [{}]),
    })),
  }));

  const updateSpy = vi.fn(() => ({
    set: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(async () => [{}]),
      })),
    })),
  }));

  const deleteSpy = vi.fn(() => ({
    where: vi.fn(async () => undefined),
  }));

  return { chain, deleteSpy, insertSpy, selectSpy, updateSpy };
});

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: () => ({
    delete: mocks.deleteSpy,
    insert: mocks.insertSpy,
    select: mocks.selectSpy,
    update: mocks.updateSpy,
  }),
}));

vi.mock("postgres", () => ({
  default: () => ({}),
}));

// ─── Statische Imports (vi.mock wird gehoistet VOR diesen Imports) ──────────
import {
  createLvDocument,
  createLvPosition,
  deleteLvPosition,
  getLvDocumentById,
  getLvDocumentSum,
  getLvDocumentsByProject,
  projectExists,
  updateLvPosition,
} from "./lv-queries";

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("LV-Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getLvDocumentsByProject ruft select auf", async () => {
    await getLvDocumentsByProject("proj-1");
    expect(mocks.selectSpy).toHaveBeenCalled();
  });

  it("getLvDocumentById akzeptiert UUID und gibt null bei leerem Resultat", async () => {
    mocks.selectSpy.mockReturnValueOnce({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => []),
        })),
      })),
    } as any);
    const result = await getLvDocumentById("uuid-nicht-vorhanden");
    expect(result).toBeNull();
  });

  it("createLvDocument wirft ChatbotError bei DB-Fehler", async () => {
    mocks.insertSpy.mockImplementationOnce(() => {
      throw new Error("DB down");
    });
    await expect(
      createLvDocument({ projectId: "p1", titel: "Test-LV" })
    ).rejects.toThrow();
  });

  it("createLvPosition gibt Position-Objekt zurueck", async () => {
    const mockRow = {
      id: "pos-1",
      kurztext: "Boden aushuben",
      lvDocumentId: "lv-1",
      oz: "01.0010",
      sortierung: 0,
    };
    mocks.insertSpy.mockReturnValueOnce({
      values: vi.fn(() => ({
        returning: vi.fn(async () => [mockRow]),
      })),
    } as any);
    const result = await createLvPosition({
      kurztext: "Boden aushuben",
      lvDocumentId: "lv-1",
      oz: "01.0010",
    });
    expect(result).toEqual(mockRow);
  });

  it("updateLvPosition gibt null zurueck, wenn keine Zeile betroffen", async () => {
    mocks.updateSpy.mockReturnValueOnce({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(async () => []),
        })),
      })),
    } as any);
    const result = await updateLvPosition("nicht-vorhanden", { oz: "02.0010" });
    expect(result).toBeNull();
  });

  it("deleteLvPosition wirft keinen Fehler bei Erfolg", async () => {
    await expect(deleteLvPosition("pos-1")).resolves.toBeUndefined();
  });

  it("getLvDocumentSum gibt 0 zurueck bei leerem LV", async () => {
    mocks.selectSpy.mockReturnValueOnce({
      from: vi.fn(() => ({
        where: vi.fn(async () => []),
      })),
    } as any);
    const sum = await getLvDocumentSum("lv-leer");
    expect(sum).toBe(0);
  });

  it("projectExists gibt boolean zurueck", async () => {
    mocks.selectSpy.mockReturnValueOnce({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => [{ id: "p1" }]),
        })),
      })),
    } as any);
    const exists = await projectExists("p1");
    expect(exists).toBe(true);
  });
});
