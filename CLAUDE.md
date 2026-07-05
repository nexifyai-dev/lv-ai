# LV.AI — Autonomer AVA-Copilot
> **Projekt:** Leistungsverzeichnis, Ausschreibung, Vergabe, Abrechnung (AVA)
> **Region:** D/A/CH (Deutschland, Österreich, Schweiz)
> **Stand:** 2026-07-05

---

## 🎯 Projektziel

LV.AI ist ein chat-basierter KI-Experte für das gesamte AVA-Geschäft im Bauwesen:
- Leistungsverzeichnisse (LV) erstellen und verwalten
- Ausschreibungen nach GAEB DA XML (X81–X86)
- Vergabe mit Preisspiegel und Bieterauswertung
- Abrechnung, Aufmaß, Nachtragsmanagement
- E-Rechnung (XRechnung/ZUGFeRD)

## 🏗 Tech-Stack

| Komponente | Technologie |
|-----------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS 4 |
| AI | Vercel AI SDK 6 + 9Router (NeXify, DeepSeek V4 Backend) |
| Datenbank | Neon Postgres + Drizzle ORM 0.34 |
| Memory | mem0 (Projekt + Global Scope) |
| Auth | Auth.js (MVP: Passwort-Gate) |
| Testing | Vitest + Playwright |

## 📂 Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth-Routen
│   └── (chat)/             # Chat-Hauptansicht
├── components/             # UI-Komponenten (shadcn/ui)
├── lib/
│   ├── ai/                 # Models, Prompts, Providers (9Router)
│   ├── compliance/         # D/A/CH Compliance-Modul (VOB/ÖNORM/SIA)
│   ├── db/                 # Drizzle Schema + Queries
│   ├── memory/             # mem0 Integration
│   └── gaeb/               # GAEB-Parser (Phase 2)
├── docs/                   # Projekt-Dokumentation
└── tests/                  # E2E + Integration Tests
```

## 🔑 Kernregeln

1. **GAEB-Konformität** — Alle LV-Daten folgen GAEB DA XML Struktur
2. **D/A/CH-Compliance** — Automatische Anpassung je Land (VOB/ÖNORM/SIA)
3. **Projekt = Chat** — Jeder Chat ist ein Bauprojekt mit Metadaten
4. **Dual Memory** — Projekt-Scope + Global-Scope via mem0
5. **Deutsche Fachsprache** — Alle UI-Texte und KI-Antworten auf Deutsch

## 🔗 AI-Provider Integration

- Provider: 9Router (NeXify Multi-Provider-Gateway) — OpenAI-kompatible API
- Architektur: Docker-Compose-Stack `9router-6kxn` auf dem VPS
  - `niner-router` (Port 20128, Next.js, OpenAI-kompatibel)
  - `headroom` (Port 8788, Context-Optimization + Token-Caching)
- Endpunkte (gleicher API-Key):
  - **Lokal**: `http://127.0.0.1:20128/v1` (für lv-ai auf gleichem VPS)
  - **Public HTTPS**: `https://ai-router.nexifyai.cloud/v1` (via Cloudflare Tunnel `nexify-main-v2`, für Vercel/Remote)
- Default Model: `nexifyai-combo-llm` (Round-Robin DeepSeek V4 Pro/Flash)
- Title Model: `ds/deepseek-v4-flash` (Token-effizient)
- Weitere: `ds/deepseek-v4-pro` (höchste Qualität), `ds/deepseek-reasoner` (komplexe AVA-Fälle)
- Konfiguration via `OPENAI_API_KEY` + `OPENAI_BASE_URL` in `.env`
- Token-Einsparung: Headroom-Caching + Round-Robin + Prompt-Modularisierung (T21/T22)

## 📋 Compliance-Module

| Land | Vergabe | Vertrag | ATV | Währung |
|------|---------|---------|-----|---------|
| DE | VOB/A | VOB/B | VOB/C (DIN 18299) | EUR |
| AT | ÖNORM B2110 | ÖNORM B2111 | ÖNORM Anhang C | EUR |
| CH | SIA 118 | SIA 102 | SIA 118 C | CHF |

## 📊 Aktueller Status

| Phase | Status | Beschreibung |
|-------|--------|--------------|
| 0 – Fundament | ✅ Abgeschlossen | Template, Schema, mem0, Auth, GAEB-Parser, D/A/CH-Compliance |
| 1 – LV-Kern | 🚧 In Arbeit | LV-Editor ✅, Positionen ✅, PDF ⏳ |
| 2 – GAEB-Engine | ✅ Abgeschlossen | GAEB DA XML Export (X81/X83/X84), Import-Action, Text-Parser, Download-Route |
| 3 – Vergabe | 🚧 In Arbeit | Preisspiegel-Engine ✅, Preisspiegel-UI ✅, Bieterauswertung ⏳ |
| 4 – Zeichnungen | ⏳ Offen | SVG/PDF Plan-Generator |
| 5 – Proaktivität | ⏳ Offen | Cron, Erinnerungen |
| 6 – Skalierung | ⏳ Offen | Multi-User, Rollen |

---

*Single Point of Entry — immer zuerst lesen*
