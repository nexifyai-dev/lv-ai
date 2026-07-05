import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mocks (vi.hoisted damit Referenzen vor vi.mock verfügbar sind) ──────────
const mocks = vi.hoisted(() => {
  const authMock = vi.fn();
  const revalidatePathMock = vi.fn();
  const getOfferByIdMock = vi.fn();
  const getOffersByProjectMock = vi.fn();
  const updateOfferStatusMock = vi.fn(async (_id: string, patch: any) => ({
    id: _id,
    ...patch,
  }));
  return {
    authMock,
    revalidatePathMock,
    getOfferByIdMock,
    getOffersByProjectMock,
    updateOfferStatusMock,
  };
});

vi.mock("@/app/(auth)/auth", () => ({ auth: mocks.authMock }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePathMock }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db/lv-queries", () => ({
  getOfferById: mocks.getOfferByIdMock,
  getOffersByProject: mocks.getOffersByProjectMock,
  updateOfferStatus: mocks.updateOfferStatusMock,
}));

import { setBieterStatusAction } from "./bieter-actions";

const {
  authMock,
  revalidatePathMock,
  getOfferByIdMock,
  getOffersByProjectMock,
  updateOfferStatusMock,
} = mocks;

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const PROJECT_ID = "00000000-0000-0000-0000-000000000001";
const OFFER_ID = "00000000-0000-0000-0000-000000000002";
const OTHER_OFFER_ID = "00000000-0000-0000-0000-000000000003";

function authedSession() {
  authMock.mockResolvedValue({ user: { id: "user-1" } });
}

function mockOffer(
  overrides: Partial<{ id: string; projectId: string; status: string }> = {}
) {
  return {
    id: OFFER_ID,
    projectId: PROJECT_ID,
    bieter: "Bieter A",
    status: "eingereicht",
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("setBieterStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authedSession();
  });

  it("lehnt ohne Session ab", async () => {
    authMock.mockResolvedValue(null);
    await expect(
      setBieterStatusAction({
        offerId: OFFER_ID,
        projectId: PROJECT_ID,
        status: "gueltig",
      })
    ).rejects.toThrow();
  });

  it("lehnt nicht-existierendes Angebot ab", async () => {
    getOfferByIdMock.mockResolvedValue(null);
    await expect(
      setBieterStatusAction({
        offerId: OFFER_ID,
        projectId: PROJECT_ID,
        status: "gueltig",
      })
    ).rejects.toThrow();
  });

  it("lehnt Angebot aus anderem Projekt ab", async () => {
    getOfferByIdMock.mockResolvedValue(
      mockOffer({ projectId: "anderes-projekt" })
    );
    await expect(
      setBieterStatusAction({
        offerId: OFFER_ID,
        projectId: PROJECT_ID,
        status: "gueltig",
      })
    ).rejects.toThrow();
  });

  it("erlaubt Übergang eingereicht → gueltig", async () => {
    getOfferByIdMock.mockResolvedValue(mockOffer({ status: "eingereicht" }));
    await setBieterStatusAction({
      offerId: OFFER_ID,
      projectId: PROJECT_ID,
      status: "gueltig",
    });
    expect(updateOfferStatusMock).toHaveBeenCalledWith(OFFER_ID, {
      status: "gueltig",
      bemerkungen: undefined,
    });
    expect(revalidatePathMock).toHaveBeenCalledWith(`/lv/${PROJECT_ID}/bieter`);
  });

  it("erlaubt Übergang gueltig → vergeben und lehnt andere Angebote ab", async () => {
    getOfferByIdMock.mockResolvedValue(mockOffer({ status: "gueltig" }));
    getOffersByProjectMock.mockResolvedValue([
      mockOffer({ id: OFFER_ID, status: "gueltig" }),
      mockOffer({ id: OTHER_OFFER_ID, status: "gueltig" }),
    ]);
    await setBieterStatusAction({
      offerId: OFFER_ID,
      projectId: PROJECT_ID,
      status: "vergeben",
      zuschlagBegruendung: "Günstigster gültiger Bieter.",
    });
    // Zuschlag für Hauptangebot
    expect(updateOfferStatusMock).toHaveBeenCalledWith(OFFER_ID, {
      status: "vergeben",
      zuschlagErteiltAm: expect.any(Date),
      zuschlagBegruendung: "Günstigster gültiger Bieter.",
      bemerkungen: undefined,
    });
    // Anderes aktiv → abgelehnt
    expect(updateOfferStatusMock).toHaveBeenCalledWith(OTHER_OFFER_ID, {
      status: "abgelehnt",
    });
  });

  it("erlaubt Übergang eingereicht → ausgeschlossen mit Grund", async () => {
    getOfferByIdMock.mockResolvedValue(mockOffer({ status: "eingereicht" }));
    await setBieterStatusAction({
      offerId: OFFER_ID,
      projectId: PROJECT_ID,
      status: "ausgeschlossen",
      auschlussGrund: "Fehlende Eignungserklärung.",
    });
    expect(updateOfferStatusMock).toHaveBeenCalledWith(OFFER_ID, {
      status: "ausgeschlossen",
      auschlussGrund: "Fehlende Eignungserklärung.",
      bemerkungen: undefined,
    });
  });

  it("lehnt ungültigen Status-Übergang ab (offen → vergeben)", async () => {
    getOfferByIdMock.mockResolvedValue(mockOffer({ status: "offen" }));
    await expect(
      setBieterStatusAction({
        offerId: OFFER_ID,
        projectId: PROJECT_ID,
        status: "vergeben",
      })
    ).rejects.toThrow();
  });

  it("erlaubt unvollstaendig → eingereicht (Nachreichung)", async () => {
    getOfferByIdMock.mockResolvedValue(mockOffer({ status: "unvollstaendig" }));
    await setBieterStatusAction({
      offerId: OFFER_ID,
      projectId: PROJECT_ID,
      status: "eingereicht",
    });
    expect(updateOfferStatusMock).toHaveBeenCalledWith(OFFER_ID, {
      status: "eingereicht",
      bemerkungen: undefined,
    });
  });

  it("lehnt ungültige UUID ab", async () => {
    await expect(
      setBieterStatusAction({
        offerId: "keine-uuid",
        projectId: PROJECT_ID,
        status: "gueltig",
      })
    ).rejects.toThrow();
  });

  it("vergeben-Angebot bleibt final (kein Wechsel weg)", async () => {
    getOfferByIdMock.mockResolvedValue(mockOffer({ status: "vergeben" }));
    await expect(
      setBieterStatusAction({
        offerId: OFFER_ID,
        projectId: PROJECT_ID,
        status: "abgelehnt",
      })
    ).rejects.toThrow();
  });
});
