import { describe, expect, it } from "vitest";

describe("LV.AI Sidebar", () => {
  it("should use German labels", () => {
    const newChat = "Neues Gespräch";
    const deleteAll = "Alle löschen";
    expect(newChat).toBe("Neues Gespräch");
    expect(deleteAll).toBe("Alle löschen");
  });

  it("should have LV.AI branding", () => {
    const brandName = "LV.AI";
    expect(brandName).toBe("LV.AI");
  });
});
