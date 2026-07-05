"use client";

import { Loader2Icon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createLvDocumentAction,
  createLvPositionAction,
  deleteLvPositionAction,
  updateLvPositionAction,
} from "./actions";

// ─── Typen ───────────────────────────────────────────────────────────────────
type GaebFormat = "X81" | "X82" | "X83" | "X84" | "X85" | "X86" | "X87" | "X89";

interface Position {
  id: string;
  lvDocumentId: string;
  oz: string;
  kurztext: string;
  langtext?: string | null;
  menge?: string | null;
  einheit?: string | null;
  einheitspreis?: string | null;
  gesamtpreis?: string | null;
  positionstyp?: string | null;
  sortierung?: number | null;
}

// ─── Position-Editor (Dialog-basiert) ────────────────────────────────────────
export function PositionEditor({
  lvDocumentId,
  position,
  onDone,
}: {
  lvDocumentId: string;
  position?: Position | null;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const isEdit = Boolean(position?.id);
  const [form, setForm] = useState({
    oz: position?.oz ?? "",
    kurztext: position?.kurztext ?? "",
    langtext: position?.langtext ?? "",
    menge: position?.menge ?? "",
    einheit: position?.einheit ?? "",
    einheitspreis: position?.einheitspreis ?? "",
    gesamtpreis: position?.gesamtpreis ?? "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (isEdit && position) {
          await updateLvPositionAction({ id: position.id, ...form });
          toast.success("Position aktualisiert.");
        } else {
          await createLvPositionAction({ lvDocumentId, ...form });
          toast.success("Position erstellt.");
        }
        setOpen(false);
        onDone?.();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Fehler beim Speichern."
        );
      }
    });
  }

  return (
    <>
      <button
        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-sm transition-colors hover:bg-accent"
        onClick={() => setOpen(true)}
        type="button"
      >
        {isEdit ? (
          <>
            <PencilIcon className="size-3.5" />
            Bearbeiten
          </>
        ) : (
          <>
            <PlusIcon className="size-3.5" />
            Position hinzufügen
          </>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              {isEdit ? "Position bearbeiten" : "Neue Position"}
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="OZ"
                  onChange={(v) => update("oz", v)}
                  placeholder="01.0020"
                  required
                  value={form.oz}
                />
                <Field
                  label="Einheit"
                  onChange={(v) => update("einheit", v)}
                  placeholder="m³, m², Stk."
                  value={form.einheit}
                />
              </div>
              <Field
                label="Kurztext"
                onChange={(v) => update("kurztext", v)}
                placeholder="Boden aushuben"
                required
                value={form.kurztext}
              />
              <Field
                label="Langtext"
                onChange={(v) => update("langtext", v)}
                placeholder="Boden für Streifenfundamente aushuben, inkl. Abtransport"
                textarea
                value={form.langtext ?? ""}
              />
              <div className="grid grid-cols-3 gap-3">
                <Field
                  label="Menge"
                  onChange={(v) => update("menge", v)}
                  placeholder="100.5"
                  value={form.menge}
                />
                <Field
                  label="EP (€)"
                  onChange={(v) => update("einheitspreis", v)}
                  placeholder="25.00"
                  value={form.einheitspreis}
                />
                <Field
                  label="GP (€)"
                  onChange={(v) => update("gesamtpreis", v)}
                  placeholder="2512.50"
                  value={form.gesamtpreis}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="rounded-md px-3 py-1.5 text-sm hover:bg-accent"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Abbrechen
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  disabled={pending}
                  type="submit"
                >
                  {pending && <Loader2Icon className="size-3.5 animate-spin" />}
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Delete-Button ───────────────────────────────────────────────────────────
export function DeletePositionButton({
  positionId,
  onDone,
}: {
  positionId: string;
  onDone?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    // biome-ignore lint/suspicious/noAlert: browser-confirm ist für MVP ok
    if (!confirm("Position wirklich löschen?")) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteLvPositionAction(positionId);
        toast.success("Position gelöscht.");
        onDone?.();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Löschen fehlgeschlagen."
        );
      }
    });
  }

  return (
    <button
      aria-label="Position löschen"
      className="inline-flex items-center gap-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
      disabled={pending}
      onClick={handleDelete}
      type="button"
    >
      {pending ? (
        <Loader2Icon className="size-3.5 animate-spin" />
      ) : (
        <TrashIcon className="size-3.5" />
      )}
    </button>
  );
}

// ─── Create-LV-Document ──────────────────────────────────────────────────────
export function CreateLvDocumentButton({
  projectId,
  onDone,
}: {
  projectId: string;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    titel: "",
    gaebFormat: "" as GaebFormat | "",
    version: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createLvDocumentAction({
          projectId,
          titel: form.titel,
          gaebFormat: form.gaebFormat || undefined,
          version: form.version || undefined,
        });
        toast.success("LV-Dokument erstellt.");
        setOpen(false);
        setForm({ titel: "", gaebFormat: "", version: "" });
        onDone?.();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erstellung fehlgeschlagen."
        );
      }
    });
  }

  return (
    <>
      <button
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        onClick={() => setOpen(true)}
        type="button"
      >
        <PlusIcon className="size-4" />
        Neues LV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Neues LV-Dokument</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <Field
                label="Titel"
                onChange={(v) => setForm((p) => ({ ...p, titel: v }))}
                placeholder="LV Rohbauarbeiten KiTa Liebigstraße"
                required
                value={form.titel}
              />
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm">
                  <span className="text-muted-foreground">GAEB-Format</span>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        gaebFormat: e.target.value as GaebFormat | "",
                      }))
                    }
                    value={form.gaebFormat}
                  >
                    <option value="">—</option>
                    {(
                      [
                        "X81",
                        "X82",
                        "X83",
                        "X84",
                        "X85",
                        "X86",
                        "X87",
                        "X89",
                      ] as const
                    ).map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Version"
                  onChange={(v) => setForm((p) => ({ ...p, version: v }))}
                  placeholder="1.0"
                  value={form.version}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="rounded-md px-3 py-1.5 text-sm hover:bg-accent"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Abbrechen
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  disabled={pending}
                  type="submit"
                >
                  {pending && <Loader2Icon className="size-3.5 animate-spin" />}
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Field helper ────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: label wraps the input/textarea as child — valid implicit association
    <label className="space-y-1 text-sm">
      <span className="text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {textarea ? (
        <textarea
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          value={value}
        />
      ) : (
        <input
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          type="text"
          value={value}
        />
      )}
    </label>
  );
}
