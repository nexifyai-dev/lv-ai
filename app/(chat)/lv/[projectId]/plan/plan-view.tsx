"use client";

import { createDemoPlan, renderPlanSvg } from "@/lib/plan/svg";

export function PlanView() {
  const plan = createDemoPlan();
  const svg = renderPlanSvg(plan);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div
        className="rounded-lg border border-border/40 bg-white shadow-sm"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG stammt aus renderPlanSvg, kein User-Input
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Demo-Plan: Die Zeichnungen werden in Phase 4 voll ausgebaut.
      </p>
    </div>
  );
}
