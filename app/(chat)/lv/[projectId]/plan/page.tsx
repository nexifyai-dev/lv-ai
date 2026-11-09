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
      <header className="border-border/40 flex items-center gap-3 border-b px-6 py-4">
        <Link
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          href={`/lv/${projectId}`}
        >
          <ArrowLeftIcon className="size-4" />
          Zurück zum LV
        </Link>
        <div className="ml-2 flex items-center gap-2">
          <RulerIcon className="text-muted-foreground size-5" />
          <h1 className="text-lg font-semibold">Plan</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto">
        <PlanView />
      </div>
    </div>
  );
}
