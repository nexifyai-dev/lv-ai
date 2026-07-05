// ─── SVG-Plan-Generator ───────────────────────────────────────────────────────
// Erzeugt SVG-Baupläne aus PlanElement-Daten.
// Rendert Rechtecke, Linien, Texte und Bemaßungen.
//
// Verwendung:
//   import { renderPlanSvg } from "@/lib/plan/svg";
//   const svgString = renderPlanSvg(plan);

import type { Plan, PlanElement } from "./types";

// ─── DIN A2 Querformat (594 × 420 mm) ──────────────────────────────────────
const PX_PER_MM = 2;
const GRID_COLOR = "#e5e5e5";
const GRID_INTERVAL = 100; // 50mm Raster (10px pro 50mm = Raster alle 50mm)

// ─── SVG-Helfer ─────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderRect(el: PlanElement): string {
  const w = el.width ?? 100;
  const h = el.height ?? 100;
  const fill = el.fill ?? "rgba(59, 130, 246, 0.08)";
  const stroke = el.stroke ?? "#3b82f6";
  const sw = el.strokeWidth ?? 1;
  const rx = el.type === "rect" ? 2 : 0;

  return `<rect x="${el.x}" y="${el.y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" rx="${rx}" />`;
}

function renderLine(el: PlanElement): string {
  const x2 = el.x2 ?? el.x + 100;
  const y2 = el.y2 ?? el.y;
  const stroke = el.stroke ?? "#ef4444";
  const sw = el.strokeWidth ?? 1.5;

  return `<line x1="${el.x}" y1="${el.y}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" />`;
}

function renderText(el: PlanElement): string {
  const label = esc(el.label ?? el.oz);
  const fontSize = el.fontSize ?? 11;
  const fill = el.fill ?? "#1e293b";
  const rotation = el.rotation
    ? ` transform="rotate(${el.rotation} ${el.x} ${el.y})"`
    : "";

  return `<text x="${el.x}" y="${el.y}" font-family="system-ui, sans-serif" font-size="${fontSize}" fill="${fill}" font-weight="600"${rotation}>${label}</text>`;
}

function renderDimension(el: PlanElement): string {
  const label = esc(el.label ?? el.value ?? "—");
  const fontSize = el.fontSize ?? 9;
  const fill = el.fill ?? "#6b7280";

  let dimLines = "";
  if (el.direction === "horizontal") {
    const len = (el.width ?? el.x2 ?? 0) - el.x;
    const offset = 20;
    // Bemaßungslinie
    dimLines += `<line x1="${el.x}" y1="${el.y - offset}" x2="${el.x + len}" y2="${el.y - offset}" stroke="#9ca3af" stroke-width="1" />`;
    // Linker Abstrich
    dimLines += `<line x1="${el.x}" y1="${el.y}" x2="${el.x}" y2="${el.y - offset - 5}" stroke="#9ca3af" stroke-width="0.5" />`;
    // Rechter Abstrich
    dimLines += `<line x1="${el.x + len}" y1="${el.y}" x2="${el.x + len}" y2="${el.y - offset - 5}" stroke="#9ca3af" stroke-width="0.5" />`;
    // Pfeil links
    dimLines += `<line x1="${el.x}" y1="${el.y - offset}" x2="${el.x + 5}" y2="${el.y - offset - 3}" stroke="#9ca3af" stroke-width="0.5" />`;
    dimLines += `<line x1="${el.x}" y1="${el.y - offset}" x2="${el.x + 5}" y2="${el.y - offset + 3}" stroke="#9ca3af" stroke-width="0.5" />`;
    // Pfeil rechts
    dimLines += `<line x1="${el.x + len}" y1="${el.y - offset}" x2="${el.x + len - 5}" y2="${el.y - offset - 3}" stroke="#9ca3af" stroke-width="0.5" />`;
    dimLines += `<line x1="${el.x + len}" y1="${el.y - offset}" x2="${el.x + len - 5}" y2="${el.y - offset + 3}" stroke="#9ca3af" stroke-width="0.5" />`;
    // Text (zentriert über Bemaßungslinie)
    dimLines += `<text x="${el.x + len / 2}" y="${el.y - offset - 6}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" fill="${fill}">${label}</text>`;
  } else {
    const len = (el.height ?? el.y2 ?? 0) - el.y;
    const offset = 20;
    dimLines += `<line x1="${el.x + offset}" y1="${el.y}" x2="${el.x + offset}" y2="${el.y + len}" stroke="#9ca3af" stroke-width="1" />`;
    dimLines += `<line x1="${el.x + 5}" y1="${el.y}" x2="${el.x + offset}" y2="${el.y}" stroke="#9ca3af" stroke-width="0.5" />`;
    dimLines += `<line x1="${el.x + 5}" y1="${el.y + len}" x2="${el.x + offset}" y2="${el.y + len}" stroke="#9ca3af" stroke-width="0.5" />`;
    // Pfeil oben
    dimLines += `<line x1="${el.x + offset}" y1="${el.y}" x2="${el.x + offset - 3}" y2="${el.y + 5}" stroke="#9ca3af" stroke-width="0.5" />`;
    dimLines += `<line x1="${el.x + offset}" y1="${el.y}" x2="${el.x + offset + 3}" y2="${el.y + 5}" stroke="#9ca3af" stroke-width="0.5" />`;
    // Pfeil unten
    dimLines += `<line x1="${el.x + offset}" y1="${el.y + len}" x2="${el.x + offset - 3}" y2="${el.y + len - 5}" stroke="#9ca3af" stroke-width="0.5" />`;
    dimLines += `<line x1="${el.x + offset}" y1="${el.y + len}" x2="${el.x + offset + 3}" y2="${el.y + len - 5}" stroke="#9ca3af" stroke-width="0.5" />`;
    // Text (vertikal)
    dimLines += `<text x="${el.x + offset - 8}" y="${el.y + len / 2 + 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" fill="${fill}" transform="rotate(-90 ${el.x + offset - 8} ${el.y + len / 2 + 4})">${label}</text>`;
  }

  return `<g class="dimension">${dimLines}</g>`;
}

// ─── Grid-Hintergrund ───────────────────────────────────────────────────────

function renderGrid(w: number, h: number): string {
  let grid = "";
  for (let x = 0; x <= w; x += GRID_INTERVAL) {
    grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${GRID_COLOR}" stroke-width="0.5" />`;
  }
  for (let y = 0; y <= h; y += GRID_INTERVAL) {
    grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${GRID_COLOR}" stroke-width="0.5" />`;
  }
  return `<g class="grid" opacity="0.5">${grid}</g>`;
}

// ─── Hauptfunktion ──────────────────────────────────────────────────────────

export function renderPlanSvg(plan: Plan): string {
  const w = plan.planWidth * PX_PER_MM;
  const h = plan.planHeight * PX_PER_MM;

  const elements = plan.elements
    .map((el) => {
      switch (el.type) {
        case "rect":
          return renderRect(el);
        case "line":
          return renderLine(el);
        case "text":
          return renderText(el);
        case "dimension":
          return renderDimension(el);
        default:
          return "";
      }
    })
    .join("\n    ");

  const grid = renderGrid(w, h);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="background:#fafafa">
  <style>
    .plan-element text { font-family: system-ui, sans-serif; }
    .plan-element line { stroke-linecap: round; }
  </style>
  ${grid}
  <!-- Plan: ${esc(plan.titel)} -->
  <g class="plan-element">
    ${elements}
  </g>
  <!-- Titelblock -->
  <rect x="${w - 280}" y="${h - 50}" width="280" height="50" fill="white" stroke="#d1d5db" stroke-width="1" />
  <text x="${w - 270}" y="${h - 32}" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#1e293b">${esc(plan.titel)}</text>
  <text x="${w - 270}" y="${h - 17}" font-family="system-ui, sans-serif" font-size="9" fill="#6b7280">Maßstab: 1:${plan.scale} · LV.AI</text>
</svg>`;
}

// ─── Beispiel-Plan (Demo-Daten für einen KiTa-Rohbau) ──────────────────────

export function createDemoPlan(): Plan {
  return {
    id: "demo-plan",
    projectId: "demo",
    titel: "Rohbauarbeiten KiTa — Grundriss",
    description: "Beispiel-Grundriss mit Positionen",
    scale: 100,
    planWidth: 594,
    planHeight: 420,
    elements: [
      {
        id: "e1",
        oz: "01.0010",
        type: "rect",
        x: 200,
        y: 100,
        width: 600,
        height: 400,
        stroke: "#3b82f6",
        label: "KiTa-Gebäude",
      },
      {
        id: "e2",
        oz: "01.0020",
        type: "rect",
        x: 220,
        y: 120,
        width: 160,
        height: 180,
        stroke: "#10b981",
        label: "Gruppenraum 1",
      },
      {
        id: "e3",
        oz: "01.0030",
        type: "rect",
        x: 400,
        y: 120,
        width: 160,
        height: 180,
        stroke: "#10b981",
        label: "Gruppenraum 2",
      },
      {
        id: "e4",
        oz: "01.0040",
        type: "rect",
        x: 580,
        y: 120,
        width: 200,
        height: 180,
        stroke: "#f59e0b",
        label: "Mehrzweckraum",
      },
      {
        id: "e5",
        oz: "01.0050",
        type: "text",
        x: 260,
        y: 210,
        label: "17,50 m²",
        fontSize: 10,
        fill: "#6b7280",
      },
      {
        id: "e6",
        oz: "01.0060",
        type: "text",
        x: 440,
        y: 210,
        label: "17,50 m²",
        fontSize: 10,
        fill: "#6b7280",
      },
      {
        id: "e7",
        oz: "01.0070",
        type: "text",
        x: 640,
        y: 210,
        label: "23,00 m²",
        fontSize: 10,
        fill: "#6b7280",
      },
      {
        id: "e8",
        oz: "01.0080",
        type: "dimension",
        x: 200,
        y: 520,
        direction: "horizontal",
        value: "20,00 m",
        label: "Gebäudelänge: 20,00 m",
      },
      {
        id: "e9",
        oz: "01.0090",
        type: "dimension",
        x: 820,
        y: 100,
        height: 400,
        direction: "vertical",
        value: "12,00 m",
        label: "Gebäudebreite: 12,00 m",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
