// ─── Plan-Elemente für SVG-Zeichnungen ────────────────────────────────────────
// Definiert die Typen für Baupläne im AVA-Kontext.
// Jedes Element referenziert eine LV-Position (OZ) und hat geometrische
// Eigenschaften (x, y, Breite, Höhe, etc.).

export interface PlanElement {
  id: string;
  oz: string; // LV-Ordnungszahl-Referenz
  type: "rect" | "line" | "text" | "dimension";
  // Position (mm im Plan, skaliert auf SVG)
  x: number;
  y: number;
  // Nur für rect
  width?: number;
  height?: number;
  // Nur für line
  x2?: number;
  y2?: number;
  // Nur für text + dimension
  label?: string;
  // Nur für dimension (Richtung)
  direction?: "horizontal" | "vertical";
  // Nur für dimension (Bemaßungswert)
  value?: string;
  // Styling
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  fontSize?: number;
  rotation?: number; // Grad, nur für text
}

export interface Plan {
  id: string;
  projectId: string;
  titel: string;
  description?: string;
  elements: PlanElement[];
  // Skalierung: 1m = wieviele SVG-Pixel?
  scale: number; // default: 50 (1m = 50px)
  // Plangröße in mm
  planWidth: number; // default: 594 (A2)
  planHeight: number; // default: 420 (A2)
  createdAt: string;
  updatedAt: string;
}

export type PlanElementType = PlanElement["type"];
