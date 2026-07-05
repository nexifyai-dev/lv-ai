import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────
// `server-only` darf in Vitest nicht echt geladen werden — stubben.
vi.mock("server-only", () => ({}));

// Drizzle und postgres dürfen in Unit-Tests nicht echt auf die DB zugreifen.
// Wir mocken das Modul-Top-Level, bevor lv-queries es importiert.

const mockWhere = vi.fn(() => mockChain);
const mockOrderBy = vi.fn(() => mockChain);
const mockLimit = vi.fn(() => mockChain);
const mockFrom = vi.fn(() => ({
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
  select: vi.fn(() => mockChain),
}));
// `then` als Property triggerd Biomes noThenProperty-Regel. Stattdessen
// wird mockChain als async-Iterable via Promise-resolventem Getter gefuehrt.
const mockChain: any = {
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
  select: vi.fn(() => mockChain),
  [Symbol.toPrimitive]: () => "",
  [Symbol.iterator]: () => ({ next: () => ({ done: true, value: undefined }) }),
};

const selectSpy = vi.fn(() => ({
  from: mockFrom,
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
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

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: () => ({
    select: selectSpy,
    insert: insertSpy,
    update: updateSpy,
    delete: deleteSpy,
  }),
}));

vi.mock("postgres", () => ({
  default: () => ({}),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("LV-Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getLvDocumentsByProject ruft select auf", async () => {
    const { getLvDocumentsByProject } = await import("./lv-queries");
    await getLvDocumentsByProject("proj-1");
    expect(selectSpy).toHaveBeenCalled();
  });

  it("getLvDocumentById akzeptiert UUID und gibt null bei leerem Resultat", async () => {
    const { getLvDocumentById } = await import("./lv-queries");
    const result = await getLvDocumentById("uuid-nicht-vorhanden");
    expect(result).toBeNull();
  });

  it("createLvDocument wirft ChatbotError bei DB-Fehler", async () => {
    insertSpy.mockImplementationOnce(() => {
      throw new Error("DB down");
    });
    const { createLvDocument } = await import("./lv-queries");
    await expect(
      createLvDocument({ projectId: "p1", titel: "Test-LV" })
    ).rejects.toThrow();
  });

  it("createLvPosition gibt Position-Objekt zurueck", async () => {
    const mockRow = {
      id: "pos-1",
      lvDocumentId: "lv-1",
      oz: "01.0010",
      kurztext: "Boden aushuben",
      sortierung: 0,
    };
    insertSpy.mockImplementationOnce(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(async () => [mockRow]),
      })),
    }));
    const { createLvPosition } = await import("./lv-queries");
    const result = await createLvPosition({
      lvDocumentId: "lv-1",
      oz: "01.0010",
      kurztext: "Boden aushuben",
    });
    expect(result).toEqual(mockRow);
  });

  it("updateLvPosition gibt null zurueck, wenn keine Zeile betroffen", async () => {
    updateSpy.mockImplementationOnce(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(async () => []),
        })),
      })),
    }));
    const { updateLvPosition } = await import("./lv-queries");
    const result = await updateLvPosition("nicht-vorhanden", { oz: "02.0010" });
    expect(result).toBeNull();
  });

  it("deleteLvPosition wirft keinen Fehler bei Erfolg", async () => {
    const { deleteLvPosition } = await import("./lv-queries");
    await expect(deleteLvPosition("pos-1")).resolves.toBeUndefined();
  });

  it("getLvDocumentSum gibt 0 zurueck bei leerem LV", async () => {
    selectSpy.mockImplementationOnce(
      () =>
        ({
          from: vi.fn(() => ({
            where: vi.fn(async () => []),
          })),
        }) as any
    );
    const { getLvDocumentSum } = await import("./lv-queries");
    const sum = await getLvDocumentSum("lv-leer");
    expect(sum).toBe(0);
  });

  it("projectExists gibt boolean zurueck", async () => {
    selectSpy.mockImplementationOnce(
      () =>
        ({
          from: vi.fn(() => ({
            where: vi.fn(() => ({
              limit: vi.fn(async () => [{ id: "p1" }]),
            })),
          })),
        }) as any
    );
    const { projectExists } = await import("./lv-queries");
    const exists = await projectExists("p1");
    expect(exists).toBe(true);
  });
});
