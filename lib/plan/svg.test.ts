import { describe, expect, it } from "vitest";
import { createDemoPlan, renderPlanSvg } from "./svg";

describe("renderPlanSvg", () => {
  const plan = createDemoPlan();

  it("generiert valides SVG mit XML-Deklaration", () => {
    const svg = renderPlanSvg(plan);
    expect(svg).toContain('<?xml version="1.0"');
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain("</svg>");
  });

  it("enthält Plan-Titel im Titelblock", () => {
    const svg = renderPlanSvg(plan);
    expect(svg).toContain("Rohbauarbeiten KiTa");
  });

  it("rendert alle Element-Typen", () => {
    const svg = renderPlanSvg(plan);
    expect(svg).toContain("<rect"); // Rechtecke
    expect(svg).toContain("<text"); // Text-Elemente
    expect(svg).toContain('<g class="dimension">'); // Bemaßungen
  });

  it("enthält Grid für Orientierung", () => {
    const svg = renderPlanSvg(plan);
    expect(svg).toContain('<g class="grid"');
  });

  it("escaped XML-Sonderzeichen im Titel", () => {
    const planWithSpecial = {
      ...plan,
      titel: 'KiTa "Sonnenschein" & Co.',
    };
    const svg = renderPlanSvg(planWithSpecial);
    expect(svg).toContain("&amp;"); // & escaped
    expect(svg).not.toContain(" & Co.");
  });

  it("erzeugt SVG mit korrekten ViewBox-Dimensionen (A2)", () => {
    const svg = renderPlanSvg(plan);
    // A2 Querformat: 594x420mm, PX_PER_MM=2 → 1188x840
    expect(svg).toContain('viewBox="0 0 1188 840"');
  });

  it("generiert horizontale Bemaßung", () => {
    const svg = renderPlanSvg(plan);
    expect(svg).toContain("Gebäudelänge");
    expect(svg).toContain("20,00 m");
  });

  it("generiert vertikale Bemaßung", () => {
    const svg = renderPlanSvg(plan);
    expect(svg).toContain("Gebäudebreite");
  });
});

describe("createDemoPlan", () => {
  it("erzeugt Plan mit 9 Elementen", () => {
    const plan = createDemoPlan();
    expect(plan.elements.length).toBe(9);
    expect(plan.scale).toBe(100);
    expect(plan.planWidth).toBe(594);
    expect(plan.planHeight).toBe(420);
  });
});
