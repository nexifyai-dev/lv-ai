// ─── Plan-Elemente für SVG-Zeichnungen ────────────────────────────────────────
// Definiert die Typen für Baupläne im AVA-Kontext.
// Jedes Element referenziert eine LV-Position (OZ) und hat geometrische
// Eigenschaften (x, y, Breite, Höhe, etc.).

export interface PlanElement {
  // Nur für dimension (Richtung)
  direction?: "horizontal" | "vertical";
  fill?: string;
  fontSize?: number;
  height?: number;
  id: string;
  // Nur für text + dimension
  label?: string;
  oz: string; // LV-Ordnungszahl-Referenz
  rotation?: number; // Grad, nur für text
  // Styling
  stroke?: string;
  strokeWidth?: number;
  type: "rect" | "line" | "text" | "dimension";
  // Nur für dimension (Bemaßungswert)
  value?: string;
  // Nur für rect
  width?: number;
  // Position (mm im Plan, skaliert auf SVG)
  x: number;
  // Nur für line
  x2?: number;
  y: number;
  y2?: number;
}

export interface Plan {
  createdAt: string;
  description?: string;
  elements: PlanElement[];
  id: string;
  planHeight: number; // default: 420 (A2)
  // Plangröße in mm
  planWidth: number; // default: 594 (A2)
  projectId: string;
  // Skalierung: 1m = wieviele SVG-Pixel?
  scale: number; // default: 50 (1m = 50px)
  titel: string;
  updatedAt: string;
}

export type PlanElementType = PlanElement["type"];
