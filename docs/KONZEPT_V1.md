# LV.AI — Gesamtkonzept v1.0

> **Archiviert:** 2026-07-05
> **Status:** Verbindliche Referenz für Roadmap und Architektur
> **Quelle:** Ursprungsauftrag des Projekts

Autonomer KI-Experte für Leistungsverzeichnisse, Ausschreibung, Vergabe und Abrechnung (AVA) im D/A/CH-Raum.

---

## 1. Ziel-Ableitung

"Leistungsverzeichnis" (LV) ist ein feststehender Fachbegriff aus dem Bauwesen (Ausschreibung, Vergabe, Abrechnung – kurz AVA). Ein LV listet alle auszuführenden Bauleistungen mit Mengen, Einheiten und Beschreibungen auf und ist die Grundlage für Angebote von Bietern.

Fachstandard für den elektronischen Austausch in D/A/CH: GAEB (Gemeinsamer Ausschuss Elektronik im Bauwesen), aktuell GAEB DA XML 3.3, Formate X81 (LV) bis X86 (Kostenschätzung). Über 90 % aller öffentlichen Bauausschreibungen in DE verwenden GAEB-Formate.

**Abgeleitetes Projektziel:** LV.AI wird der zentrale digitale Mitarbeiter für das gesamte Ausschreibungs-, Angebots- und Abrechnungsgeschäft eines Planungsbüros / Bauunternehmens im D/A/CH-Raum – proaktiv, autonom, GAEB-konform, mandantenfähig, mit Wissens-Gedächtnis pro Projekt und global.

## 2. Wettbewerbsanalyse

| Anbieter | Stärke | Lücke für LV.AI |
|---|---|---|
| ORCA AVA | Marktführer, DIN 276, GAEB/IFC/Excel, 18.000+ Kunden | Kein Chat/Agent, kein Gedächtnis, Windows-only |
| NEVARIS / RIB iTWO | Enterprise, BIM 5D | Zu komplex/teuer für KMU, keine Chat-UX |
| Phase0 (ex. Compa) | Cloud-SaaS, KI-LV-Erstellung, Preisspiegel, Rechnungsprüfung | Kein Langzeit-Agentengedächtnis, kein offenes Multi-Modell |
| SIDOUN KIAVA | Semantische Suche (DAss), BauTextKI | Geschlossenes System, kein offenes Agenten-Framework |
| BlackSwanAI | GAEB-Auswertung aller Formate | Nur GAEB-Auswertung, kein Vollzyklus-Agent |

**Strategische Konsequenz:**
1. GAEB-Konformität ist Pflicht, kein Nice-to-have.
2. Chat-first + Agentic ist die echte Marktlücke.
3. STLB-Bau/Sirados/Heinze sind Lizenzware — Schnittstellen vorsehen, nicht selbst reproduzieren.
4. Vercel AI Chatbot Template als Fundament, AVA-Fachlogik als eigene Schicht darüber.

## 3. Erweiterung — Vollständige AVA-Plattform

### 3.1 Kernmodule (über ursprüngliche Idee hinaus)

1. **GAEB-Engine** — Import/Export/Validierung aller Formate (X81–X86)
2. **Kostenschätzung nach DIN 276** — automatische Vorkalkulation aus Grobangaben
3. **Positions-Generator mit STLB-Bau-Anbindung** — KI schlägt GAEB-konforme Kurz-/Langtexte vor; Nutzer bindet eigene Lizenz-Zugänge ein
4. **Preisspiegel & Bieterauswertung** — automatischer Vergleich, Ausreißer-Erkennung, § 16 VOB/A Unterkostenangebot-Hinweis
5. **Vergabevorschlag inkl. VOB/A-Konformitätsprüfung** — formale Ausschlussgründe, Fristen, Nachforderungen
6. **Nachtragsmanagement** — KI erkennt Leistungsabweichungen, schlägt Nachtragsformulierungen vor
7. **Aufmaß- und Rechnungsprüfung** — Abgleich gegen Auftrags-LV, Mengenüberschreitung, doppelte Positionen, VOB/B-Fristen
8. **Zeichnungs- und Plan-Modul** — KI-gestützte SVG/DXF-Skizzen, Lagepläne, Grundrisse als Planungshilfe
9. **Angebots- und Rechnungs-Generator** — GoBD-konforme PDF + E-Rechnung (XRechnung/ZUGFeRD, Pflicht seit 2025/2026 in DE B2B)
10. **Fristen- und Termin-Agent** — überwacht Ausschreibungs-/Angebotsbindungs-/Gewährleistungs-/Zahlungsfristen, erinnert per Mail (Resend) und Chat
11. **Compliance-Modul D/A/CH** — VOB/A+B+C (DE), ÖNORM B2110/B2111 (AT), SIA-Normen (CH)
12. **Brainstorming- & Optimierungs-Agent** — läuft proaktiv, schlägt Alternativpositionen, Materialoptimierungen, Nachhaltigkeitsvarianten vor
13. **Wissensdatenbank / RAG-Ebene** — globale Bibliothek (Normen, Standardtexte, Muster-LVs) + projektspezifisches Wissen
14. **Reporting-Dashboard** — Projektstatus, offene Fristen, Kosten vs. Budget, LV-Fortschritt
15. **Rollen & Mandantenfähigkeit** — Multi-User, Rollen (Bauleiter, Kalkulator, Admin), von Anfang an architektonisch vorsehen

## 4. Architektur-Konzept

### 4.1 Leitprinzip: "Jeder Chat ist ein Projekt"

- Neuer Chat = neues Bauprojekt-Objekt (`projects` Tabelle), 1:1 zur Chat-Session
- Beim Anlegen: Kurzabfrage (Projektname, Gewerk, Land DE/AT/CH, Adresse/Bauherr) → strukturierte Metadaten + erste mem0-Erinnerung
- Jede Nachricht wird gegen zwei Gedächtnis-Ebenen gespiegelt:
  - **Projekt-Memory (mem0, scoped `project_id`)** – bauvorhabenspezifisch
  - **Global-Memory (mem0, scoped `user_id`, `agent_id`)** – büroweite Präferenzen, Standardtexte, Muster

### 4.2 Technischer Stack

| Komponente | Wahl | Begründung |
|---|---|---|
| Frontend | Next.js 16 (App Router) | Server Actions + RSC ideal für Streaming-Chat |
| UI-Kit | shadcn/ui + Tailwind | Volle Kontrolle, keine Lizenzkosten |
| Chat-Fundament | Vercel AI Chatbot Template (Fork) | Spart Wochen an Grundgerüst-Arbeit |
| LLM | AI SDK + OpenRouter (Multi-Modell) | Ein Modell für Fachlogik, ein günstiges für Routine |
| Agenten-Gedächtnis | mem0 | Vektorsuche + Knowledge-Graph + KV-Cache, 3 Scopes (user/session/agent) |
| Datenbank | Neon Postgres | Serverless, gute Next.js-Integration |
| Datei-Storage | Vercel Blob / S3-kompatibel | Uploads (Pläne, Kataloge, Muster) |
| E-Mail | Resend | Transactional, Cron-getriggert |
| PDF | React-PDF / Puppeteer | Angebote, Rechnungen, Zeichnungen |
| GAEB | Eigener Parser nach GAEB DA XML 3.3 | Kernstück |
| Auth (MVP) | Passwort-Gate (`LV2026!!`) | Mittelfristig: Auth.js/Clerk |

### 4.3 Datenmodell

```
users, projects, chats, messages, memories (mem0)
files_global, files_project
lv_documents (project_id, gaeb_format, version, status)
lv_positions (lv_document_id, oz, kurztext, langtext, menge, einheit, einheitspreis)
offers (project_id, bieter, gaeb_source_id, gesamtsumme, status)
invoices (project_id, nummer, betrag, status, faelligkeit, e_rechnung_format)
reminders (project_id, typ, faellig_am, gesendet)
drawings (project_id, typ, storage_url_svg, storage_url_pdf)
```

## 5. Proaktivität & Autonomie

- Bei jeder LV-Position: automatischer VOB/C-Abgleich + Vollständigkeitsprüfung
- Bei jedem Angebotseingang: automatischer Preisspiegel + Auffälligkeits-Hinweis
- Bei Fristnähe: Resend-Mail X Tage vorher, konfigurierbar
- Wöchentlicher Brainstorming-Impuls pro aktivem Projekt (Optimierungen, Terminrisiko, Nachtragsverdacht) als Chat-Nachricht "von sich aus"
- Cron/Background-Jobs (Vercel Cron) werten mem0-Projekt-Timeline aus und triggern proaktive Nachrichten

## 6. Umsetzungs-Roadmap

| Phase | Inhalt | Ergebnis |
|---|---|---|
| 0 – Fundament | Template, shadcn, Passwort-Gate, Neon-DB, mem0 | Lauffähiger Chat mit Gedächtnis |
| 1 – LV-Kern | LV-Positions-Editor, KI-Vorschläge, PDF-Export einfacher Angebote | Erste nutzbare LV-Erstellung |
| 2 – GAEB-Engine | Import/Export X81/X83/X84/X86, Validierung | Kompatibilität mit Baubranche |
| 3 – Vergabe & Rechnung | Preisspiegel, Bieterauswertung, Aufmaßprüfung, E-Rechnung | Vollständiger AVA-Zyklus |
| 4 – Zeichnungen & Pläne | SVG/PDF-Plan-Generator, Grundrisse, Detailskizzen | Visualisierung im Chat |
| 5 – Proaktivität | Cron-Jobs, Resend-Erinnerungen, Brainstorming-Agent, Nachtragserkennung | Autonomer Agentenbetrieb |
| 6 – Skalierung | Multi-User-Auth, Rollen, Mandanten, D/A/CH-Feinschliff | Produktreife |

## 7. Offene Annahmen (zur Bestätigung)

- **Primäres Land zuerst?** (DE/VOB vs. AT/ÖNORM vs. CH/SIA) — beeinflusst erstes Compliance-Modul
- **Lizenzquellen für Standardtexte** (STLB-Bau, Sirados) — vorhanden oder rein freitextbasiert?
- **Zielnutzerkreis:** Solo oder mehrere Personen/Rollen von Anfang an?

---

*Dieses Konzept ist die verbindliche Referenz für die Roadmap. Abweichungen in CLAUDE.md/README haben sich aus Code-Wahrheit ergeben (MiMo AI statt 9Router) und sind dort dokumentiert.*
