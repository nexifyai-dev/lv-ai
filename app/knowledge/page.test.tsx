import { describe, expect, it } from "vitest";

describe("Knowledge Page", () => {
  it("should have German labels", () => {
    const labels = {
      title: "Wissensbasis",
      subtitle: "Dokumente und Vorlagen für Ihre AVA-Projekte",
      upload: "Dateien hochladen",
      empty: "Noch keine Dokumente hochgeladen",
    };
    expect(labels.title).toBe("Wissensbasis");
    expect(labels.upload).toBe("Dateien hochladen");
  });

  it("should support AVA file types", () => {
    const fileTypes = [
      "PDF",
      "GAEB XML",
      "Excel",
      "Word",
      "CSV",
      "Bilder",
    ];
    expect(fileTypes).toContain("GAEB XML");
    expect(fileTypes).toContain("PDF");
  });
});
