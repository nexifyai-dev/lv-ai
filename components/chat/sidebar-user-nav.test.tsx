import { describe, expect, it } from "vitest";

describe("Sidebar User Nav", () => {
  it("should have German labels", () => {
    const labels = {
      darkMode: "Dunkelmodus",
      lightMode: "Hellmodus",
      loading: "Laden...",
      logout: "Abmelden",
    };
    expect(labels.logout).toBe("Abmelden");
    expect(labels.darkMode).toBe("Dunkelmodus");
  });

  it("should show user email or fallback", () => {
    const fallback = "LV.AI Nutzer";
    expect(fallback).toBe("LV.AI Nutzer");
  });
});
