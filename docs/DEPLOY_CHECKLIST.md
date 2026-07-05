# LV.AI — Production-Deploy-Checkliste

> **Stand:** 2026-07-05
> **Zweck:** Schritte, um einen lokalen Fix in der Produktion (Vercel) aktiv zu schalten

---

## Anlass

Der Upload-Bug (PDF/Excel wurde nicht im Chat oder Wissensspeicher angenommen) wurde lokal in Commit `cc3794f` gefixt und auf `main` gepusht. Der Fix ist in der Produktion erst aktiv, wenn Vercel neu deployed oder die entsprechende Umgebungsvariable gesetzt wird.

## Fix-Inhalt (Commit `cc3794f`)

- `/api/files/upload` hat jetzt einen **lokalen Storage-Fallback**: wenn `BLOB_READ_WRITE_TOKEN` fehlt, landen Dateien in `public/uploads/lv-ai/` und werden via `/uploads/lv-ai/<name>` ausgeliefert.
- `AttachmentsButton` im Chat nutzt `hasVision = true` als optimistischen Default (vorher `false` → Button deaktiviert bis SWR fertig).
- `.env.example` aktualisiert: MiMo AI statt 9Router, `BLOB_READ_WRITE_TOKEN` als optional markiert.

## Deploy-Optionen

### Option A: Vercel-Redeploy (empfohlen, schnellster Weg)

1. Im Vercel-Dashboard das lv-ai-Projekt öffnen
2. **Deployments** → neuester Deployment aus `main` → **Redeploy**
3. Wartet bis Build durchläuft (≈2–4 Min)
4. Upload-Button im Chat testen (Paperclip sollte klickbar sein)
5. PDF/Excel-Upload probieren — Datei sollte in `public/uploads/lv-ai/` auf dem Vercel-Server landen

**Voraussetzung:** Kein `BLOB_READ_WRITE_TOKEN` in Vercel-Env-Variablen gesetzt → lokaler Fallback greift.

**Limitierung:** Vercel-Serverless-Dateisystem ist **ephemär** — hochgeladene Dateien verschwinden beim nächsten Cold Start. Für Produktion mit持久 Storage: Option B.

### Option B: Vercel Blob Storage (persistent, empfohlen für Live-Betrieb)

1. Vercel-Dashboard → **Storage** → **Create Blob Store**
2. Store mit Region `fra1` (EU, DSGVO-freundlich) anlegen
3. Store mit lv-ai-Projekt verbinden
4. Vercel setzt automatisch `BLOB_READ_WRITE_TOKEN` in Env-Variablen
5. **Redeploy** des Projekts
6. Uploads landen jetzt persistent in Vercel Blob — URLs sind öffentlich und dauerhaft

**Kosten:** Vercel Blob hat ein Free-Tier (1 GB Storage, 10 GB Bandbreite/Monat). Für AVA-Betrieb mit vielen LV-PDFs langfristig kostenpflichtig, aber transparent.

### Option C: Lokaler Dev-Server (nur Test, nicht Produktion)

```bash
cd /workspace/leistungsverzeichnis
pnpm dev
# Uploads landen in public/uploads/lv-ai/ — funktional, aber nicht deployed
```

## Verifikation nach Deploy

1. **Chat-Upload-Button sichtbar und klickbar** (Paperclip, nicht grau)
2. **PDF-Upload klappt**: Datei auswählen → Toast "hochgeladen" → Datei-Preview im Composer
3. **Knowledge-Page `/knowledge`**: Drag-and-Drop oder Klick → Datei erscheint in Liste
4. **LV-Import-Action** (`/lv/[projectId]`): Hochgeladene Datei via `importLvFileAction` parsen → Positionen in DB

## Rollback

Falls der Fix neue Probleme verursacht:

```bash
git revert cc3794f  # lokaler Storage-Fallback entfernen
# ODER
git revert da6f285  # Token-Optimierung rückgängig
```

Dann `git push origin main` → Vercel redeployt automatisch.

## Bekannte Limits des lokalen Fallbacks

- **Vercel Serverless = ephemeres Dateisystem**: Dateien überleben keinen Cold Start. Für Produktion **muss** Vercel Blob (Option B) konfiguriert werden.
- **Kein CDN-Caching**: Lokale Dateien werden bei jedem Request neu von der Disk gelesen.
- **Keine Skalierung**: Bei mehreren Vercel-Instanzen hat jede ihr eigenes Dateisystem — Uploads sind nicht geteilt.

## Langfristige Verbesserung

Für echte Produktion mit AVA-Daten (potentiell sensible Bauherren-Preise):

1. **Vercel Blob mit Private Access** (nur authentifizierte Lese-Zugriffe)
2. **Datei-Validierung vor Upload** (Virenscanner, MIME-Type hardening)
3. **Cleanup-Job**: Uploads älter als 30 Tage automatisch löschen
4. **Audit-Log**: Wer hat welche Datei wann hochgeladen (multi-user-fähig für Phase 6)

---

*Diese Checkliste ist die Antwort auf den User-Report: "Das PDF wurde weder im Wissensspeicher noch sonst wo angenommen." Der Fix steht; Deploy entscheidet.*
