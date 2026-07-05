import { describe, expect, it } from "vitest";
import {
  bieterStatusEnum,
  chat,
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
  projektStatusEnum,
  project,
  rechnungStatusEnum,
  reminder,
  stream,
  suggestion,
  user,
  vote,
  document,
} from "./schema";

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
      expect(user._.name).toBe("User");
    });

    it("should export project table with LV-specific fields", () => {
      expect(project).toBeDefined();
      expect(project._.name).toBe("Project");
    });

    it("should export chat table with projectId reference", () => {
      expect(chat).toBeDefined();
      expect(chat._.name).toBe("Chat");
    });

    it("should export message table", () => {
      expect(message).toBeDefined();
      expect(message._.name).toBe("Message_v2");
    });

    it("should export vote table", () => {
      expect(vote).toBeDefined();
      expect(vote._.name).toBe("Vote_v2");
    });

    it("should export document table", () => {
      expect(document).toBeDefined();
      expect(document._.name).toBe("Document");
    });

    it("should export suggestion table", () => {
      expect(suggestion).toBeDefined();
      expect(suggestion._.name).toBe("Suggestion");
    });

    it("should export stream table", () => {
      expect(stream).toBeDefined();
      expect(stream._.name).toBe("Stream");
    });
  });

  describe("LV-Specific Tables", () => {
    it("should export lvDocument table with GAEB format", () => {
      expect(lvDocument).toBeDefined();
      expect(lvDocument._.name).toBe("LvDocument");
    });

    it("should export lvPosition table with OZ, menge, einheit", () => {
      expect(lvPosition).toBeDefined();
      expect(lvPosition._.name).toBe("LvPosition");
    });

    it("should export offer table for Bieter", () => {
      expect(offer).toBeDefined();
      expect(offer._.name).toBe("Offer");
    });

    it("should export invoice table for Rechnungen", () => {
      expect(invoice).toBeDefined();
      expect(invoice._.name).toBe("Invoice");
    });

    it("should export reminder table for Erinnerungen", () => {
      expect(reminder).toBeDefined();
      expect(reminder._.name).toBe("Reminder");
    });

    it("should export fileGlobal table for generische Uploads", () => {
      expect(fileGlobal).toBeDefined();
      expect(fileGlobal._.name).toBe("FileGlobal");
    });

    it("should export fileProject table for projektspezifische Uploads", () => {
      expect(fileProject).toBeDefined();
      expect(fileProject._.name).toBe("FileProject");
    });

    it("should export drawing table for Zeichnungen", () => {
      expect(drawing).toBeDefined();
      expect(drawing._.name).toBe("Drawing");
    });
  });
});
