"use client";

import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  FileSpreadsheetIcon,
  Loader2Icon,
  TrendingDownIcon,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PreisspiegelResult } from "@/lib/gaeb/preisspiegel";
import { generatePreisspiegelAction } from "./preisspiegel-actions";

interface PreisspiegelClientProps {
  projectId: string;
}

interface UploadedFile {
  name: string;
  url: string;
}

export function PreisspiegelClient({ projectId }: PreisspiegelClientProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<PreisspiegelResult | null>(null);
  const [pending, startTransition] = useTransition();

  // ─── Datei-Upload ────────────────────────────────────────────────────────
  async function handleUpload(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }
    setIsUploading(true);
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/files/upload", {
          body: formData,
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          newFiles.push({ name: file.name, url: data.url });
          toast.success(`${file.name} hochgeladen`);
        } else {
          toast.error(`${file.name} Upload fehlgeschlagen`);
        }
      } catch {
        toast.error(`${file.name} Upload fehlgeschlagen`);
      }
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setIsUploading(false);
  }

  // ─── Preisspiegel generieren ──────────────────────────────────────────────
  function handleGenerate() {
    if (files.length < 2) {
      toast.error("Mindestens 2 Bieterangebote erforderlich.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await generatePreisspiegelAction({
          fileUrls: files.map((f) => f.url),
          projectId,
        });
        setResult(res);
        toast.success(
          `Preisspiegel erstellt: ${res.bieterCount} Bieter, ${res.positionCount} Positionen, ${res.ausreisser.length} Ausreißer.`
        );
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Preisspiegel fehlgeschlagen."
        );
      }
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // ─── Render ───────────────────────────────────────────────────────────────
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
          <FileSpreadsheetIcon className="text-muted-foreground size-5" />
          <h1 className="text-lg font-semibold">Preisspiegel</h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6">
        {result ? (
          <PreisspiegelResultView result={result} />
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Upload-Bereich */}
            <div className="border-border/50 rounded-xl border-2 border-dashed p-8 text-center">
              <UploadIcon className="text-muted-foreground/50 mx-auto mb-4 size-10" />
              <p className="mb-1 text-sm font-medium">
                Bieterangebote (GAEB X84) hochladen
              </p>
              <p className="text-muted-foreground mb-4 text-xs">
                Mindestens 2 XML-Dateien für Preisvergleich
              </p>
              <label className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
                <UploadIcon className="size-4" />
                Dateien auswählen
                <input
                  accept=".xml,.gaeb"
                  className="hidden"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                  type="file"
                />
              </label>
              {isUploading && (
                <div className="text-muted-foreground mt-3 text-sm">
                  <Loader2Icon className="mr-2 inline size-4 animate-spin" />
                  Wird hochgeladen...
                </div>
              )}
            </div>

            {/* Datei-Liste */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-muted-foreground text-sm font-medium">
                  Hochgeladene Angebote ({files.length})
                </h3>
                {files.map((file, i) => (
                  <div
                    className="border-border/50 bg-card/50 flex items-center gap-3 rounded-lg border p-3"
                    key={file.url}
                  >
                    <FileSpreadsheetIcon className="text-muted-foreground size-5" />
                    <span className="flex-1 truncate text-sm">{file.name}</span>
                    <button
                      className="text-muted-foreground hover:text-destructive text-xs"
                      onClick={() => removeFile(i)}
                      type="button"
                    >
                      Entfernen
                    </button>
                  </div>
                ))}
                <button
                  className="bg-primary text-primary-foreground mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50"
                  disabled={files.length < 2 || pending}
                  onClick={handleGenerate}
                  type="button"
                >
                  {pending && <Loader2Icon className="size-4 animate-spin" />}
                  Preisspiegel erstellen
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Result-View ─────────────────────────────────────────────────────────────
function PreisspiegelResultView({ result }: { result: PreisspiegelResult }) {
  const formatEuro = (v: number) =>
    new Intl.NumberFormat("de-DE", {
      currency: "EUR",
      minimumFractionDigits: 2,
      style: "currency",
    }).format(v);

  const formatProzent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

  return (
    <div className="space-y-8">
      {/* Bieter-Ranking */}
      <section className="space-y-3">
        <h2 className="text-base font-medium">Bieter-Ranking</h2>
        <div className="border-border/40 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rang</TableHead>
                <TableHead>Bieter</TableHead>
                <TableHead className="text-right">Gesamtsumme</TableHead>
                <TableHead className="text-right">
                  Positionen mit Preis
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.bieter.map((b) => (
                <TableRow key={b.name}>
                  <TableCell>
                    <Badge variant={b.rang === 1 ? "default" : "outline"}>
                      {b.rang}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatEuro(b.gesamtsumme)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {b.positionenMitPreis}/
                    {b.positionenMitPreis + b.positionenOhnePreis}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Ausreißer-Warnungen */}
      {result.ausreisser.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-base font-medium">
            <AlertTriangleIcon className="text-destructive size-5" />
            Ausreißer ({result.ausreisser.length})
          </h2>
          <div className="space-y-2">
            {result.ausreisser.map((a) => (
              <div
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  a.verdacht === "unterkosten"
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-amber-500/50 bg-amber-500/5"
                }`}
                key={`${a.oz}-${a.bieter}`}
              >
                {a.verdacht === "unterkosten" ? (
                  <TrendingDownIcon className="text-destructive mt-0.5 size-5" />
                ) : (
                  <AlertTriangleIcon className="mt-0.5 size-5 text-amber-500" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">
                      {a.oz}
                    </span>
                    <span className="text-sm">{a.bieter}</span>
                    <Badge
                      variant={
                        a.verdacht === "unterkosten"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {formatProzent(a.abweichungProzent)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {a.hinweis}
                  </p>
                  <p className="mt-0.5 text-xs">
                    Preis: {formatEuro(a.gp)} · Durchschnitt:{" "}
                    {formatEuro(a.durchschnitt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Positionen-Vergleich */}
      <section className="space-y-3">
        <h2 className="text-base font-medium">Positionen-Vergleich</h2>
        <div className="border-border/40 overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">OZ</TableHead>
                <TableHead>Kurztext</TableHead>
                <TableHead className="text-right">Menge</TableHead>
                {result.bieter.map((b) => (
                  <TableHead className="text-right" key={b.name}>
                    {b.name}
                  </TableHead>
                ))}
                <TableHead className="text-right">Durchschnitt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.positions.map((pos) => (
                <TableRow key={pos.oz}>
                  <TableCell className="font-mono text-xs">{pos.oz}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">
                    {pos.kurztext}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right text-xs">
                    {pos.menge ?? "—"} {pos.einheit ?? ""}
                  </TableCell>
                  {result.bieter.map((b) => {
                    const preis = pos.preise[b.name];
                    const isTiefst = pos.tiefstpreis?.bieter === b.name;
                    const isHoechst = pos.hoechstpreis?.bieter === b.name;
                    return (
                      <TableCell
                        className={`text-right tabular-nums ${
                          isTiefst
                            ? "font-semibold text-green-600"
                            : isHoechst
                              ? "text-red-600"
                              : ""
                        }`}
                        key={b.name}
                      >
                        {preis?.gp ? formatEuro(preis.gp) : "—"}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-muted-foreground text-right tabular-nums">
                    {pos.durchschnitt ? formatEuro(pos.durchschnitt) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Neue Analyse */}
      <div className="text-center">
        <button
          className="border-border hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
          onClick={() => window.location.reload()}
          type="button"
        >
          Neue Analyse
        </button>
      </div>
    </div>
  );
}
