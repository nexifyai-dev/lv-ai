import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => {
  const makeThenable = () => ({
    // biome-ignore lint/suspicious/noThenProperty: Thenable-Mock braucht `then` für await
    then: vi.fn((resolve: any) => Promise.resolve([]).then(resolve)),
    where: vi.fn(() => makeThenable()),
    orderBy: vi.fn(() => makeThenable()),
    limit: vi.fn(() => makeThenable()),
  });

  const chain = makeThenable();

  const selectSpy = vi.fn(() => ({
    from: vi.fn(() => chain),
    where: vi.fn(() => chain),
    orderBy: vi.fn(() => chain),
    limit: vi.fn(() => chain),
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

  return { selectSpy, insertSpy, updateSpy, deleteSpy, chain };
});

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: () => ({
    select: mocks.selectSpy,
    insert: mocks.insertSpy,
    update: mocks.updateSpy,
    delete: mocks.deleteSpy,
  }),
}));

vi.mock("postgres", () => ({
  default: () => ({}),
}));

import {
  createOffer,
  deleteOffersByProject,
  getOfferById,
  getOfferPositions,
  getOffersByProject,
  replaceOfferPositions,
  updateOfferStatus,
} from "./lv-queries";

describe("Offer-Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getOffersByProject ruft select+where auf", async () => {
    await getOffersByProject("proj-1");
    expect(mocks.selectSpy).toHaveBeenCalled();
  });

  it("getOfferById gibt null bei leerem Resultat", async () => {
    mocks.selectSpy.mockReturnValueOnce({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => []),
        })),
      })),
    } as any);
    const result = await getOfferById("uuid-nicht-vorhanden");
    expect(result).toBeNull();
  });

  it("createOffer gibt neue Offer-Row zurück", async () => {
    const mockRow = {
      id: "offer-1",
      projectId: "p1",
      bieter: "Bauhaus GmbH",
      status: "eingereicht",
    };
    mocks.insertSpy.mockReturnValueOnce({
      values: vi.fn(() => ({
        returning: vi.fn(async () => [mockRow]),
      })),
    } as any);
    const result = await createOffer({
      projectId: "p1",
      bieter: "Bauhaus GmbH",
    });
    expect(result).toEqual(mockRow);
  });

  it("createOffer wirft ChatbotError bei DB-Fehler", async () => {
    mocks.insertSpy.mockImplementationOnce(() => {
      throw new Error("DB down");
    });
    await expect(
      createOffer({ projectId: "p1", bieter: "X" })
    ).rejects.toThrow();
  });

  it("updateOfferStatus gibt null zurück bei leerem Resultat", async () => {
    mocks.updateSpy.mockReturnValueOnce({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(async () => []),
        })),
      })),
    } as any);
    const result = await updateOfferStatus("nicht-vorhanden", {
      status: "gueltig",
    });
    expect(result).toBeNull();
  });

  it("deleteOffersByProject ruft delete+where auf", async () => {
    await deleteOffersByProject("proj-1");
    expect(mocks.deleteSpy).toHaveBeenCalled();
  });

  it("getOfferPositions ruft select+where+orderBy auf", async () => {
    await getOfferPositions("offer-1");
    expect(mocks.selectSpy).toHaveBeenCalled();
  });

  it("replaceOfferPositions löscht alte und fügt neue Positionen ein", async () => {
    await replaceOfferPositions("offer-1", [
      { oz: "01.0010", kurztext: "Aushub" },
      { oz: "01.0020", kurztext: "Beton" },
    ]);
    expect(mocks.deleteSpy).toHaveBeenCalled();
    expect(mocks.insertSpy).toHaveBeenCalled();
  });

  it("replaceOfferPositions mit leerem Array nur löschen", async () => {
    await replaceOfferPositions("offer-1", []);
    expect(mocks.deleteSpy).toHaveBeenCalled();
    expect(mocks.insertSpy).not.toHaveBeenCalled();
  });
});
