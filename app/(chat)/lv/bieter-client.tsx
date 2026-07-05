"use client";

import {
  CheckCircle2Icon,
  ClipboardListIcon,
  Loader2Icon,
  ShieldAlertIcon,
  TrophyIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BieterStatus } from "@/lib/db/lv-queries";
import type { Offer } from "@/lib/db/schema";
import { getBieterAction, setBieterStatusAction } from "./bieter-actions";

interface BieterClientProps {
  projectId: string;
}

const STATUS_LABEL: Record<BieterStatus, string> = {
  offen: "Offen",
  eingereicht: "Eingereicht",
  gueltig: "Gültig",
  unvollstaendig: "Unvollständig",
  ausgeschlossen: "Ausgeschlossen",
  vergeben: "Zuschlag erteilt",
  abgelehnt: "Abgelehnt",
};

const STATUS_VARIANT: Record<
  BieterStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  offen: "outline",
  eingereicht: "secondary",
  gueltig: "default",
  unvollstaendig: "secondary",
  ausgeschlossen: "destructive",
  vergeben: "default",
  abgelehnt: "outline",
};

const formatEuro = (v: string | null) => {
  if (!v) {
    return "—";
  }
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n)) {
    return "—";
  }
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
};

export function BieterClient({ projectId }: BieterClientProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [begruendung, setBegruendung] = useState<Record<string, string>>({});
  const [showBegruendung, setShowBegruendung] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getBieterAction(projectId)
      .then((rows) => {
        if (!cancelled) {
          setOffers(rows);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Bieter konnten nicht geladen werden.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function handleStatus(
    offerId: string,
    status: BieterStatus,
    begruendungText?: string
  ) {
    startTransition(async () => {
      try {
        await setBieterStatusAction({
          offerId,
          projectId,
          status,
          auschlussGrund:
            status === "ausgeschlossen" ? (begruendungText ?? null) : null,
          zuschlagBegruendung:
            status === "vergeben" ? (begruendungText ?? null) : null,
        });
        toast.success(`Status auf "${STATUS_LABEL[status]}" gesetzt.`);
        const rows = await getBieterAction(projectId);
        setOffers(rows);
        setShowBegruendung(null);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Status-Wechsel fehlgeschlagen."
        );
      }
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        <Loader2Icon className="mr-2 size-4 animate-spin" />
        Bieter werden geladen…
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-border/50 p-8 text-center">
        <ClipboardListIcon className="mx-auto mb-4 size-10 text-muted-foreground/50" />
        <p className="mb-1 text-sm font-medium">Keine Bieter erfasst</p>
        <p className="text-xs text-muted-foreground">
          Laden Sie zunächst GAEB X84-Angebote im{" "}
          <a
            className="underline hover:text-foreground"
            href={`/lv/${projectId}/preisspiegel`}
          >
            Preisspiegel
          </a>{" "}
          hoch. Die Bieter werden automatisch persistiert.
        </p>
      </div>
    );
  }

  const vergebenBieter = offers.find((o) => o.status === "vergeben");

  return (
    <div className="space-y-6">
      {vergebenBieter && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4">
          <TrophyIcon className="size-5 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">
              Zuschlag erteilt an: {vergebenBieter.bieter}
            </p>
            <p className="text-xs text-muted-foreground">
              {vergebenBieter.zuschlagBegruendung ??
                "Keine Begründung erfasst."}
            </p>
          </div>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-base font-medium">Bieter ({offers.length})</h2>
        <div className="overflow-x-auto rounded-md border border-border/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rang</TableHead>
                <TableHead>Bieter</TableHead>
                <TableHead className="text-right">Gesamtsumme</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((o, i) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <Badge variant={i === 0 ? "default" : "outline"}>
                      {i + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{o.bieter}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatEuro(o.gesamtsumme)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[o.status as BieterStatus]}>
                      {STATUS_LABEL[o.status as BieterStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <BieterActions
                      begruendung={begruendung[o.id] ?? ""}
                      disabled={pending}
                      offer={o}
                      onBegruendungChange={(text) => {
                        setBegruendung((prev) => ({ ...prev, [o.id]: text }));
                      }}
                      onStatus={handleStatus}
                      showBegruendung={showBegruendung}
                      toggleBegruendung={(id) => {
                        setShowBegruendung(showBegruendung === id ? null : id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function BieterActions({
  begruendung,
  disabled,
  offer,
  onBegruendungChange,
  onStatus,
  showBegruendung,
  toggleBegruendung,
}: {
  begruendung: string;
  disabled: boolean;
  offer: Offer;
  onBegruendungChange: (text: string) => void;
  onStatus: (
    offerId: string,
    status: BieterStatus,
    begruendung?: string
  ) => void;
  showBegruendung: string | null;
  toggleBegruendung: (id: string) => void;
}) {
  const status = offer.status as BieterStatus;
  const isShowing = showBegruendung === offer.id;

  if (status === "vergeben") {
    return (
      <span className="text-xs text-emerald-600">
        <TrophyIcon className="mr-1 inline size-3" />
        Gewinner
      </span>
    );
  }
  if (status === "abgelehnt") {
    return <span className="text-xs text-muted-foreground">Abgelehnt</span>;
  }
  if (status === "ausgeschlossen") {
    return (
      <span className="text-xs text-destructive">
        <ShieldAlertIcon className="mr-1 inline size-3" />
        Ausgeschlossen
      </span>
    );
  }

  return (
    <div className="flex justify-end gap-1.5">
      {status === "offen" && (
        <Button
          disabled={disabled}
          onClick={() => onStatus(offer.id, "eingereicht")}
          size="sm"
          variant="outline"
        >
          Eingereicht
        </Button>
      )}
      {(status === "eingereicht" || status === "unvollstaendig") && (
        <Button
          disabled={disabled}
          onClick={() => toggleBegruendung(offer.id)}
          size="sm"
          variant="default"
        >
          <TrophyIcon className="mr-1 size-3" />
          Zuschlag
        </Button>
      )}
      {(status === "eingereicht" || status === "gueltig") && (
        <Button
          disabled={disabled}
          onClick={() => toggleBegruendung(offer.id)}
          size="sm"
          variant="destructive"
        >
          <XCircleIcon className="mr-1 size-3" />
          Ausschließen
        </Button>
      )}
      {status === "gueltig" && (
        <Button
          disabled={disabled}
          onClick={() => onStatus(offer.id, "abgelehnt")}
          size="sm"
          variant="outline"
        >
          Ablehnen
        </Button>
      )}
      {status === "eingereicht" && (
        <>
          <Button
            disabled={disabled}
            onClick={() => onStatus(offer.id, "gueltig")}
            size="sm"
            variant="outline"
          >
            <CheckCircle2Icon className="mr-1 size-3" />
            Gültig
          </Button>
          <Button
            disabled={disabled}
            onClick={() => onStatus(offer.id, "unvollstaendig")}
            size="sm"
            variant="outline"
          >
            Unvollständig
          </Button>
        </>
      )}
      {isShowing && (
        <BegruendungsForm
          begruendung={begruendung}
          disabled={disabled}
          offer={offer}
          onChange={onBegruendungChange}
          onSubmit={(id, actionStatus, text) => {
            onStatus(id, actionStatus, text);
          }}
          status={status}
        />
      )}
    </div>
  );
}

function BegruendungsForm({
  begruendung,
  disabled,
  offer,
  onChange,
  onSubmit,
  status,
}: {
  begruendung: string;
  disabled: boolean;
  offer: Offer;
  onChange: (text: string) => void;
  onSubmit: (id: string, status: BieterStatus, text?: string) => void;
  status: BieterStatus;
}) {
  const isZuschlag = status !== "ausgeschlossen";
  const label = isZuschlag
    ? "Zuschlag-Begründung (optional)"
    : "Ausschluss-Grund (Pflicht)";
  const actionStatus: BieterStatus = isZuschlag ? "vergeben" : "ausgeschlossen";

  return (
    <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg border border-border bg-card p-3 shadow-lg">
      <label
        className="mb-1 block text-xs font-medium text-muted-foreground"
        htmlFor={`begruendung-${offer.id}`}
      >
        {label}
      </label>
      <input
        autoFocus
        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:border-ring"
        disabled={disabled}
        id={`begruendung-${offer.id}`}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit(offer.id, actionStatus, begruendung || undefined);
          }
          if (e.key === "Escape") {
            onChange("");
          }
        }}
        placeholder="Begründung eingeben…"
        type="text"
        value={begruendung}
      />
      <div className="mt-2 flex justify-end gap-1.5">
        <Button
          disabled={disabled || (!isZuschlag && !begruendung)}
          onClick={() => {
            onSubmit(offer.id, actionStatus, begruendung || undefined);
          }}
          size="sm"
          variant={isZuschlag ? "default" : "destructive"}
        >
          {isZuschlag ? (
            <>
              <TrophyIcon className="mr-1 size-3" />
              Bestätigen
            </>
          ) : (
            <>
              <XCircleIcon className="mr-1 size-3" />
              Ausschließen
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
