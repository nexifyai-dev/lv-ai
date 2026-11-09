import {
  ArrowLeftIcon,
  ClipboardListIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  PrinterIcon,
  RulerIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type getLvDocumentById,
  getLvDocumentSum,
  getLvDocumentsByProject,
  getLvPositionsByDocument,
  projectExists,
} from "@/lib/db/lv-queries";
import {
  CreateLvDocumentButton,
  DeletePositionButton,
  PositionEditor,
} from "../lv-editor";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function LvProjectPage({ params }: PageProps) {
  const { projectId } = await params;

  // Projekt-Existenz prüfen (Auth passiert über (chat) Layout)
  const exists = await projectExists(projectId).catch(() => false);
  if (!exists) {
    notFound();
  }

  const documents = await getLvDocumentsByProject(projectId).catch(() => []);
  const formatEuro = (value: number) =>
    new Intl.NumberFormat("de-DE", {
      currency: "EUR",
      style: "currency",
    }).format(value);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="border-border/40 flex items-center gap-3 border-b px-6 py-4">
        <Link
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          href="/"
        >
          <ArrowLeftIcon className="size-4" />
          Zurück
        </Link>
        <div className="ml-2 flex items-center gap-2">
          <FileTextIcon className="text-muted-foreground size-5" />
          <h1 className="text-lg font-semibold">
            Leistungsverzeichnis · Projekt {projectId.slice(0, 8)}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            className="border-border/60 hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors"
            href={`/lv/${projectId}/preisspiegel`}
          >
            <FileSpreadsheetIcon className="size-3.5" />
            Preisspiegel
          </Link>
          <Link
            className="border-border/60 hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors"
            href={`/lv/${projectId}/bieter`}
          >
            <ClipboardListIcon className="size-3.5" />
            Bieter
          </Link>
          <Link
            className="border-border/60 hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors"
            href={`/lv/${projectId}/plan`}
          >
            <RulerIcon className="size-3.5" />
            Plan
          </Link>
          <CreateLvDocumentButton projectId={projectId} />
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6">
        {documents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {documents.map((doc) => (
              <DocumentSection
                document={doc}
                formatEuro={formatEuro}
                key={doc.id}
                projectId={projectId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function DocumentSection({
  document,
  formatEuro,
  projectId,
}: {
  document: Awaited<ReturnType<typeof getLvDocumentById>> & {
    id: string;
    titel: string;
    gaebFormat: string | null;
    version: string | null;
    status: string;
    createdAt: Date;
  };
  formatEuro: (value: number) => string;
  projectId: string;
}) {
  const positions = await getLvPositionsByDocument(document.id).catch(() => []);
  const sum = await getLvDocumentSum(document.id).catch(() => 0);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-medium">{document.titel}</h2>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            {document.gaebFormat && (
              <Badge variant="secondary">GAEB {document.gaebFormat}</Badge>
            )}
            {document.version && <span>v{document.version}</span>}
            <Badge variant="outline">{document.status}</Badge>
            <span>
              {new Date(document.createdAt).toLocaleDateString("de-DE")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-muted-foreground text-xs">Gesamtsumme</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatEuro(sum)}
            </div>
          </div>
          {positions.length > 0 && (
            <div className="flex items-center gap-2">
              <Link
                className="border-border/60 hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors"
                href={`/lv/${projectId}/export?documentId=${document.id}&format=X83`}
              >
                <DownloadIcon className="size-3.5" />
                GAEB X83
              </Link>
              <Link
                className="border-border/60 hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors"
                href={`/lv/${projectId}/export/pdf?documentId=${document.id}`}
              >
                <PrinterIcon className="size-3.5" />
                PDF
              </Link>
            </div>
          )}
          <PositionEditor lvDocumentId={document.id} />
        </div>
      </div>

      {positions.length === 0 ? (
        <p className="border-border/50 text-muted-foreground rounded-md border border-dashed px-4 py-6 text-sm">
          Keine Positionen vorhanden.
        </p>
      ) : (
        <div className="border-border/40 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">OZ</TableHead>
                <TableHead>Kurztext</TableHead>
                <TableHead className="w-28 text-right">Menge</TableHead>
                <TableHead className="w-20">Einheit</TableHead>
                <TableHead className="w-32 text-right">EP (€)</TableHead>
                <TableHead className="w-32 text-right">GP (€)</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => (
                <TableRow key={pos.id}>
                  <TableCell className="font-mono text-xs">{pos.oz}</TableCell>
                  <TableCell>
                    <div className="font-medium">{pos.kurztext}</div>
                    {pos.langtext && (
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        {pos.langtext}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {pos.menge ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {pos.einheit ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {pos.einheitspreis ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {pos.gesamtpreis ?? "—"}
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <PositionEditor lvDocumentId={document.id} position={pos} />
                    <DeletePositionButton positionId={pos.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <FileTextIcon className="text-muted-foreground/50 size-10" />
      <div>
        <p className="text-sm font-medium">Noch keine LV-Dokumente</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Erstelle das erste Leistungsverzeichnis über den Chat oder einen
          GAEB-Import.
        </p>
      </div>
    </div>
  );
}
