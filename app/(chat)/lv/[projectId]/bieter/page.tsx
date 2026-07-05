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
      <header className="flex items-center gap-3 border-b border-border/40 px-6 py-4">
        <Link
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href={`/lv/${projectId}`}
        >
          <ArrowLeftIcon className="size-4" />
          Zurück zum LV
        </Link>
        <div className="ml-2 flex items-center gap-2">
          <ClipboardListIcon className="size-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Bieterauswertung</h1>
        </div>
      </header>
      <div className="flex-1 overflow-auto px-6 py-6">
        <BieterClient projectId={projectId} />
      </div>
    </div>
  );
}
