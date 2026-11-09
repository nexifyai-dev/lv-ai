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
  size: number;
  uploadedAt: Date;
  url: string;
}

export default function KnowledgePage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = useCallback(async (fileList: FileList | null) => {
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
          newFiles.push({
            name: file.name,
            size: file.size,
            uploadedAt: new Date(),
            url: data.url,
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
    if (name.endsWith(".pdf")) {
      return <FileTextIcon className="size-5 text-red-500" />;
    }
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      return <FileSpreadsheetIcon className="size-5 text-green-500" />;
    }
    if (name.endsWith(".jpg") || name.endsWith(".png")) {
      return <ImageIcon className="size-5 text-blue-500" />;
    }
    return <FileIcon className="text-muted-foreground size-5" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="border-border/40 flex h-14 items-center gap-3 border-b px-4">
        <button
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          onClick={() => router.push("/")}
          type="button"
        >
          ← Zurück zum Chat
        </button>
        <div className="ml-4 flex items-center gap-2">
          <BookOpenIcon className="text-primary size-5" />
          <h1 className="text-lg font-semibold">Wissensbasis</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">
              Dokumente und Vorlagen
            </h2>
            <p className="text-muted-foreground text-sm">
              Laden Sie LV-Vorlagen, GAEB-Dateien, Normen und andere Dokumente
              hoch. Die KI nutzt diese als Wissensbasis für Ihre Projekte.
            </p>
          </div>

          {/* Upload Zone */}
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Drop-Zone (Drag&Drop) hat bewusst keine Klick-Semantik */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: siehe oben */}
          <div
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-border"
            }`}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadIcon className="text-muted-foreground/50 mx-auto mb-4 size-10" />
            <p className="mb-1 text-sm font-medium">
              Dateien hierher ziehen oder
            </p>
            <label className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              <UploadIcon className="size-4" />
              Dateien auswählen
              <input
                accept=".pdf,.doc,.docx,.xls,.xlsx,.gaeb,.xml,.txt,.csv,.jpg,.jpeg,.png"
                className="hidden"
                multiple
                onChange={(e) => handleUpload(e.target.files)}
                type="file"
              />
            </label>
            <p className="text-muted-foreground mt-3 text-xs">
              PDF, GAEB XML, Excel, Word, CSV, Bilder — max. 20MB pro Datei
            </p>
            {isUploading && (
              <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent" />
                  Wird hochgeladen...
                </div>
              </div>
            )}
          </div>

          {/* File List */}
          <div className="mt-8">
            <h3 className="text-muted-foreground mb-4 text-sm font-medium">
              Hochgeladene Dokumente ({files.length})
            </h3>

            {files.length === 0 ? (
              <div className="text-muted-foreground/50 py-12 text-center">
                <BookOpenIcon className="mx-auto mb-3 size-12" />
                <p className="text-sm">Noch keine Dokumente hochgeladen</p>
                <p className="mt-1 text-xs">
                  Laden Sie LV-Vorlagen, GAEB-Dateien oder Normen hoch
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    className="border-border/50 bg-card/50 hover:bg-card flex items-center gap-3 rounded-lg border p-3 transition-colors"
                    key={file.name}
                  >
                    {getFileIcon(file.name)}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatSize(file.size)} ·{" "}
                        {file.uploadedAt.toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <a
                      className="text-primary text-xs hover:underline"
                      href={file.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Öffnen
                    </a>
                    <button
                      className="text-muted-foreground/50 hover:text-destructive transition-colors"
                      onClick={() => handleDelete(index)}
                      type="button"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-muted/50 mt-8 rounded-lg p-4">
            <h4 className="mb-2 text-sm font-medium">
              So nutzt LV.AI Ihre Dokumente
            </h4>
            <ul className="text-muted-foreground space-y-1 text-xs">
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
