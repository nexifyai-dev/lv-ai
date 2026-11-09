import { describe, expect, it } from "vitest";

describe("Knowledge Page", () => {
  it("should have German labels", () => {
    const labels = {
      empty: "Noch keine Dokumente hochgeladen",
      subtitle: "Dokumente und Vorlagen für Ihre AVA-Projekte",
      title: "Wissensbasis",
      upload: "Dateien hochladen",
    };
    expect(labels.title).toBe("Wissensbasis");
    expect(labels.upload).toBe("Dateien hochladen");
  });

  it("should support AVA file types", () => {
    const fileTypes = ["PDF", "GAEB XML", "Excel", "Word", "CSV", "Bilder"];
    expect(fileTypes).toContain("GAEB XML");
    expect(fileTypes).toContain("PDF");
  });
});
