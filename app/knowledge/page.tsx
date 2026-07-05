"use client";

import {
  BookOpenIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export default function KnowledgePage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = useCallback(async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    setIsUploading(true);
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newFiles.push({
            name: file.name,
            url: data.url,
            size: file.size,
            uploadedAt: new Date(),
          });
          toast.success(`${file.name} hochgeladen`);
        } else {
          const err = await res.json();
          toast.error(err.error || `Fehler bei ${file.name}`);
        }
      } catch {
        toast.error(`Upload fehlgeschlagen: ${file.name}`);
      }
    }

    setFiles((prev) => [...newFiles, ...prev]);
    setIsUploading(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDelete = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("Datei entfernt");
  }, []);

  const getFileIcon = (name: string) => {
    if (name.endsWith(".pdf")) return <FileTextIcon className="size-5 text-red-500" />;
    if (name.endsWith(".xlsx") || name.endsWith(".xls"))
      return <FileSpreadsheetIcon className="size-5 text-green-500" />;
    if (name.endsWith(".jpg") || name.endsWith(".png"))
      return <ImageIcon className="size-5 text-blue-500" />;
    return <FileIcon className="size-5 text-muted-foreground" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex h-14 items-center gap-3 border-b border-border/40 px-4">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Zurück zum Chat
        </button>
        <div className="flex items-center gap-2 ml-4">
          <BookOpenIcon className="size-5 text-primary" />
          <h1 className="font-semibold text-lg">Wissensbasis</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Dokumente und Vorlagen
            </h2>
            <p className="text-sm text-muted-foreground">
              Laden Sie LV-Vorlagen, GAEB-Dateien, Normen und andere
              Dokumente hoch. Die KI nutzt diese als Wissensbasis für
              Ihre Projekte.
            </p>
          </div>

          {/* Upload Zone */}
          <div
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-border"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <UploadIcon className="size-10 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-sm font-medium mb-1">
              Dateien hierher ziehen oder
            </p>
            <label className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
              <UploadIcon className="size-4" />
              Dateien auswählen
              <input
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.gaeb,.xml,.txt,.csv,.jpg,.jpeg,.png"
                onChange={(e) => handleUpload(e.target.files)}
              />
            </label>
            <p className="text-xs text-muted-foreground mt-3">
              PDF, GAEB XML, Excel, Word, CSV, Bilder — max. 20MB pro Datei
            </p>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Wird hochgeladen...
                </div>
              </div>
            )}
          </div>

          {/* File List */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Hochgeladene Dokumente ({files.length})
            </h3>

            {files.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground/50">
                <BookOpenIcon className="size-12 mx-auto mb-3" />
                <p className="text-sm">
                  Noch keine Dokumente hochgeladen
                </p>
                <p className="text-xs mt-1">
                  Laden Sie LV-Vorlagen, GAEB-Dateien oder Normen hoch
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-colors hover:bg-card"
                  >
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(file.size)} ·{" "}
                        {file.uploadedAt.toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Öffnen
                    </a>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-muted-foreground/50 hover:text-destructive transition-colors"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 rounded-lg bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-2">
              So nutzt LV.AI Ihre Dokumente
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • <strong>LV-Vorlagen</strong> — Die KI erkennt Muster und
                schlägt Positionen vor
              </li>
              <li>
                • <strong>GAEB-Dateien</strong> — Werden direkt importiert und
                als LV-Struktur verwendet
              </li>
              <li>
                • <strong>Normen (DIN, VOB)</strong> — Werden als Referenz für
                Leistungsbeschreibungen genutzt
              </li>
              <li>
                • <strong>Angebote/Rechnungen</strong> — Für Vergleich und
                Prüfung herangezogen
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
