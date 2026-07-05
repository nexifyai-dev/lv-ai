# LV.AI — Autonomer KI-Experte für Leistungsverzeichnisse

<p align="center">
  <strong>Ausschreibung · Vergabe · Abrechnung (AVA) im D/A/CH-Raum</strong>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#compliance"><strong>Compliance</strong></a>
</p>

---

## Was ist LV.AI?

LV.AI ist ein chat-basierter KI-Experte für das gesamte Ausschreibungs-, Angebots- und Abrechnungsgeschäft (AVA) im Bauwesen. Er unterstützt Planungsbüros und Bauunternehmen in Deutschland, Österreich und der Schweiz.

### Kernfunktionen

- **Leistungsverzeichnisse (LV)** — Erstellung und Verwaltung nach GAEB DA XML
- **Ausschreibung** — GAEB-konforme Ausschreibungsunterlagen (X81–X86)
- **Vergabe** — Preisspiegel, Bieterauswertung, Zuschlagsempfehlung
- **Abrechnung** — Aufmaß, Schlussrechnung, Nachtragsmanagement
- **E-Rechnung** — XRechnung/ZUGFeRD (seit 2025/2026 Pflicht für B2B in DE)
- **Kostenschätzung** — Nach DIN 276 Kosten im Bauwesen

## Tech Stack

| Komponente | Technologie |
|-----------|-------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS 4](https://tailwindcss.com) |
| AI | [Vercel AI SDK 6](https://ai-sdk.dev) + MiMo AI (Xiaomi Token Plan, OpenAI-kompatibel) |
| Datenbank | [Neon Postgres](https://neon.tech) + [Drizzle ORM](https://orm.drizzle.team) |
| Memory | [mem0](https://mem0.ai) (Projekt + Global Scope) |
| Auth | [Auth.js](https://authjs.dev) (MVP: Passwort-Gate) |
| Testing | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) |

## Getting Started

### Voraussetzungen

- Node.js 20+
- pnpm 10+
- Neon Postgres Datenbank (oder andere PostgreSQL)
- MiMo AI API Key (Xiaomi Token Plan, OpenAI-kompatibel)

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd leistungsverzeichnis

# Abhängigkeiten installieren
pnpm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env mit Ihren Werten ausfüllen

# Datenbank-Migration ausführen
pnpm db:migrate

# Entwicklungsserver starten
pnpm dev
```

Die Anwendung läuft auf [localhost:3000](http://localhost:3000).

### Umgebungsvariablen

| Variable | Beschreibung | Pflicht |
|----------|-------------|---------|
| `AUTH_SECRET` | Auth.js Geheimnis | ✅ |
| `OPENAI_API_KEY` | MiMo AI API Key (Xiaomi Token Plan) | ✅ |
| `OPENAI_BASE_URL` | MiMo AI Endpoint (`https://token-plan-ams.xiaomimimo.com/v1`) | ✅ |
| `POSTGRES_URL` | PostgreSQL Connection String | ✅ |
| `MEM0_API_KEY` | mem0 API Key | Optional |
| `LV_PASSWORD` | Passwort-Gate (Standard: LV2026!!) | Optional |

## Compliance

LV.AI unterstützt automatisch die korrekte Rechtsgrundlage je Land:

| Land | Vergabe | Vertrag | ATV | Währung |
|------|---------|---------|-----|---------|
| 🇩🇪 DE | VOB/A | VOB/B | VOB/C (DIN 18299) | EUR |
| 🇦🇹 AT | ÖNORM B2110 | ÖNORM B2111 | ÖNORM Anhang C | EUR |
| 🇨🇭 CH | SIA 118 | SIA 102 | SIA 118 C | CHF |

## Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth-Routen
│   └── (chat)/             # Chat-Hauptansicht
├── components/             # UI-Komponenten (shadcn/ui)
├── lib/
│   ├── ai/                 # Models, Prompts, Providers (MiMo AI)
│   ├── compliance/         # D/A/CH Compliance-Modul
│   ├── db/                 # Drizzle Schema + Queries
│   ├── memory/             # mem0 Integration
│   └── gaeb/               # GAEB DA XML Parser
├── docs/                   # Projekt-Dokumentation
└── tests/                  # E2E + Integration Tests
```

## Tests

```bash
# Unit Tests ausführen
pnpm test

# Unit Tests im Watch-Modus
pnpm test:watch

# E2E Tests ausführen
pnpm test:e2e
```

## Roadmap

| Phase | Status | Beschreibung |
|-------|--------|--------------|
| 0 – Fundament | ✅ | Template, Schema, mem0, Auth, GAEB-Parser |
| 1 – LV-Kern | 🚧 | LV-Editor, Positionen, PDF-Export |
| 2 – GAEB-Engine | ⏳ | Import/Export GAEB DA XML |
| 3 – Vergabe | ⏳ | Preisspiegel, Bieterauswertung |
| 4 – Zeichnungen | ⏳ | SVG/PDF Plan-Generator |
| 5 – Proaktivität | ⏳ | Cron, Erinnerungen, Brainstorming-Agent |
| 6 – Skalierung | ⏳ | Multi-User, Rollen, Mandantenfähigkeit |

## Lizenz

MIT License — Siehe [LICENSE](LICENSE) für Details.

---

<p align="center">
  <strong>LV.AI</strong> — Autonomer KI-Experte für Leistungsverzeichnisse<br>
  D/A/CH · GAEB DA XML · VOB · ÖNORM · SIA
</p>
