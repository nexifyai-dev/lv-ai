import { ArrowLeftIcon, ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { BieterClient } from "../../bieter-client";

interface BieterPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function BieterPage({ params }: BieterPageProps) {
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
          <ClipboardListIcon className="text-muted-foreground size-5" />
          <h1 className="text-lg font-semibold">Bieterauswertung</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto px-6 py-6">
        <BieterClient projectId={projectId} />
      </div>
    </div>
  );
}
