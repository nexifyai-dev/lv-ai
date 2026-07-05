import {
  ArrowLeftIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
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
      style: "currency",
      currency: "EUR",
    }).format(value);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border/40 px-6 py-4">
        <Link
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="/"
        >
          <ArrowLeftIcon className="size-4" />
          Zurück
        </Link>
        <div className="ml-2 flex items-center gap-2">
          <FileTextIcon className="size-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">
            Leistungsverzeichnis · Projekt {projectId.slice(0, 8)}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-sm transition-colors hover:bg-accent"
            href={`/lv/${projectId}/preisspiegel`}
          >
            <FileSpreadsheetIcon className="size-3.5" />
            Preisspiegel
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            <div className="text-xs text-muted-foreground">Gesamtsumme</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatEuro(sum)}
            </div>
          </div>
          {positions.length > 0 && (
            <Link
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              href={`/lv/${projectId}/export?documentId=${document.id}&format=X83`}
            >
              <DownloadIcon className="size-3.5" />
              GAEB X83
            </Link>
          )}
          <PositionEditor lvDocumentId={document.id} />
        </div>
      </div>

      {positions.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/50 px-4 py-6 text-sm text-muted-foreground">
          Keine Positionen vorhanden.
        </p>
      ) : (
        <div className="rounded-md border border-border/40">
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
                      <div className="mt-0.5 text-xs text-muted-foreground">
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
                  <TableCell className="text-right tabular-nums font-medium">
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
      <FileTextIcon className="size-10 text-muted-foreground/50" />
      <div>
        <p className="text-sm font-medium">Noch keine LV-Dokumente</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Erstelle das erste Leistungsverzeichnis über den Chat oder einen
          GAEB-Import.
        </p>
      </div>
    </div>
  );
}
