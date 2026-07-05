import { ArrowLeftIcon, RulerIcon } from "lucide-react";
import Link from "next/link";
import { PlanView } from "./plan-view";

interface PlanPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function PlanPage({ params }: PlanPageProps) {
  const { projectId } = await params;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border/40 px-6 py-4">
        <Link
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href={`/lv/${projectId}`}
        >
          <ArrowLeftIcon className="size-4" />
          Zurück zum LV
        </Link>
        <div className="ml-2 flex items-center gap-2">
          <RulerIcon className="size-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Plan</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto">
        <PlanView />
      </div>
    </div>
  );
}
