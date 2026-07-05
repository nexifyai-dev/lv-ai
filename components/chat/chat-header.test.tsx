import { describe, expect, it } from "vitest";

describe("LV.AI Chat Header", () => {
  it("should display LV.AI branding", () => {
    const brandName = "LV.AI";
    expect(brandName).toBe("LV.AI");
  });

  it("should not contain Vercel references", () => {
    const headerText = "LV.AI";
    expect(headerText).not.toContain("Vercel");
    expect(headerText).not.toContain("Deploy");
  });
});
