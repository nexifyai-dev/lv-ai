import { describe, expect, it } from "vitest";
import {
  bieterStatusEnum,
  chat,
  document,
  drawing,
  erinnerungTypEnum,
  fileGlobal,
  fileProject,
  gaebFormatEnum,
  invoice,
  landEnum,
  lvDocument,
  lvPosition,
  message,
  offer,
  offerPosition,
  project,
  projektStatusEnum,
  rechnungStatusEnum,
  reminder,
  stream,
  suggestion,
  user,
  vote,
} from "./schema";

// Drizzle 0.34+ speichert den Tabellennamen im Symbol `drizzle:Name`.
// Der frühere Zugriff über `table._.name` wurde in 0.34 entfernt.
const TABLE_NAME_SYMBOL = Symbol.for("drizzle:Name");
function tableName(table: unknown): string {
  if (!table || typeof table !== "object") {
    return "";
  }
  const sym = (table as Record<symbol, unknown>)[TABLE_NAME_SYMBOL];
  return typeof sym === "string" ? sym : "";
}

describe("LV.AI Database Schema", () => {
  describe("Enums", () => {
    it("should define landEnum with DE, AT, CH", () => {
      expect(landEnum.enumValues).toEqual(["DE", "AT", "CH"]);
    });

    it("should define projektStatusEnum with all AVA phases", () => {
      expect(projektStatusEnum.enumValues).toEqual([
        "entwurf",
        "ausschreibung",
        "vergabe",
        "ausfuehrung",
        "abrechnung",
        "abgeschlossen",
      ]);
    });

    it("should define gaebFormatEnum with X81-X89", () => {
      expect(gaebFormatEnum.enumValues).toEqual([
        "X81",
        "X82",
        "X83",
        "X84",
        "X85",
        "X86",
        "X87",
        "X89",
      ]);
    });

    it("should define bieterStatusEnum", () => {
      expect(bieterStatusEnum.enumValues).toEqual([
        "offen",
        "eingereicht",
        "gueltig",
        "unvollstaendig",
        "ausgeschlossen",
        "vergeben",
        "abgelehnt",
      ]);
    });

    it("should define rechnungStatusEnum", () => {
      expect(rechnungStatusEnum.enumValues).toEqual([
        "entwurf",
        "gesendet",
        "geprueft",
        "bezahlt",
        "beanstandet",
      ]);
    });

    it("should define erinnerungTypEnum", () => {
      expect(erinnerungTypEnum.enumValues).toEqual([
        "frist",
        "zahlung",
        "gewaehrleistung",
        "nachtrag",
        "termin",
      ]);
    });
  });

  describe("Core Tables", () => {
    it("should export user table", () => {
      expect(user).toBeDefined();
      expect(tableName(user)).toBe("User");
    });

    it("should export project table with LV-specific fields", () => {
      expect(project).toBeDefined();
      expect(tableName(project)).toBe("Project");
    });

    it("should export chat table with projectId reference", () => {
      expect(chat).toBeDefined();
      expect(tableName(chat)).toBe("Chat");
    });

    it("should export message table", () => {
      expect(message).toBeDefined();
      expect(tableName(message)).toBe("Message_v2");
    });

    it("should export vote table", () => {
      expect(vote).toBeDefined();
      expect(tableName(vote)).toBe("Vote_v2");
    });

    it("should export document table", () => {
      expect(document).toBeDefined();
      expect(tableName(document)).toBe("Document");
    });

    it("should export suggestion table", () => {
      expect(suggestion).toBeDefined();
      expect(tableName(suggestion)).toBe("Suggestion");
    });

    it("should export stream table", () => {
      expect(stream).toBeDefined();
      expect(tableName(stream)).toBe("Stream");
    });
  });

  describe("LV-Specific Tables", () => {
    it("should export lvDocument table with GAEB format", () => {
      expect(lvDocument).toBeDefined();
      expect(tableName(lvDocument)).toBe("LvDocument");
    });

    it("should export lvPosition table with OZ, menge, einheit", () => {
      expect(lvPosition).toBeDefined();
      expect(tableName(lvPosition)).toBe("LvPosition");
    });

    it("should export offer table for Bieter", () => {
      expect(offer).toBeDefined();
      expect(tableName(offer)).toBe("Offer");
    });

    it("should export offerPosition table for position-level Bieter-preise", () => {
      expect(offerPosition).toBeDefined();
      expect(tableName(offerPosition)).toBe("OfferPosition");
    });

    it("should export invoice table for Rechnungen", () => {
      expect(invoice).toBeDefined();
      expect(tableName(invoice)).toBe("Invoice");
    });

    it("should export reminder table for Erinnerungen", () => {
      expect(reminder).toBeDefined();
      expect(tableName(reminder)).toBe("Reminder");
    });

    it("should export fileGlobal table for generische Uploads", () => {
      expect(fileGlobal).toBeDefined();
      expect(tableName(fileGlobal)).toBe("FileGlobal");
    });

    it("should export fileProject table for projektspezifische Uploads", () => {
      expect(fileProject).toBeDefined();
      expect(tableName(fileProject)).toBe("FileProject");
    });

    it("should export drawing table for Zeichnungen", () => {
      expect(drawing).toBeDefined();
      expect(tableName(drawing)).toBe("Drawing");
    });
  });
});
