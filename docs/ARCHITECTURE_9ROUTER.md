# 9Router Architektur — CLI-Integration & Token-Optimierung

> **Stand:** 2026-07-05
> **Zweck:** Zentrale Doku für alle AI-CLI-Integrationen über 9Router

---

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│ CLI Clients (alle auf 9router)                              │
│                                                             │
│  Claude Code → claude-env.sh → public HTTPS                │
│  Codex       → config.toml → lokal :20128                  │
│  Goose       → config.yaml → public HTTPS                  │
│  OpenCode    → opencode.json → lokal :20128                │
│  mimo-code   → auth.json → 9router-Provider                │
│  lv-ai app   → .env → lokal :20128                         │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 9Router Docker-Compose (9router-6kxn)                       │
│                                                             │
│  niner-router (:20128) — OpenAI-kompatible API              │
│       │                                                     │
│       ├── HEADROOM_URL: http://headroom:8787                │
│       ▼                                                     │
│  headroom (:8788) — Context-Optimization + Caching          │
│       │                                                     │
│       ▼                                                     │
│  DeepSeek V4 Backend (Pro / Flash / Reasoner)               │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Cloudflare Tunnel (nexify-main-v2)                          │
│                                                             │
│  ai-router.nexifyai.cloud → 127.0.0.1:20128 (HTTPS)        │
└─────────────────────────────────────────────────────────────┘
```

## Endpunkte

| Endpunkt | URL | Verwendung |
|----------|-----|------------|
| Lokal | `http://127.0.0.1:20128/v1` | CLI/Apps auf gleichem VPS (kein TLS-Overhead) |
| Public | `https://ai-router.nexifyai.cloud/v1` | Remote, Vercel-Deploy, externe Clients |

Beide Endpunkte nutzen denselben API-Key.

## CLI-Konfigurationen

### Claude Code

**Datei:** `/root/.nexify/claude-env.sh` (wird beim Shell-Start gesourced)

```
ANTHROPIC_BASE_URL=https://ai-router.nexifyai.cloud/v1
ANTHROPIC_AUTH_TOKEN=sk-97034a83a8033b14-vgu0wz-4ade76f7
ANTHROPIC_MODEL=nexifyai-combo-llm
```

Key: `glm-5.2-claude-code` (dediziert für Claude Code in 9router-DB).
Fallback: lokal `http://127.0.0.1:20128/v1` (auskommentiert, bei CF-Ausfall aktivierbar).

### Codex

**Datei:** `/root/.codex/config.toml`

```toml
model = "ds/deepseek-v4-pro"
model_provider = "9router"

[model_providers.9router]
base_url = "http://localhost:20128/v1"
wire_api = "responses"
```

Nutzt `ds/deepseek-v4-pro` für höchste Qualität. Subagent ebenfalls auf `ds/deepseek-v4-pro`.

### Goose

**Datei:** `/root/.config/goose/config.yaml` + `secrets.yaml`

```yaml
active_provider: custom_deepseek_via_nexify_ai_9router_config
providers:
  custom_deepseek_via_nexify_ai_9router_config:
    model: nexifyai-combo-llm
```

Key: `goose-deepseek` (dediziert in 9router-DB).
URL: `https://ai-router.nexifyai.cloud/v1` (public).

### OpenCode

**Datei:** `/root/.config/opencode/opencode.json`

```json
{
  "provider": {
    "9router": {
      "baseURL": "http://127.0.0.1:20128/v1",
      "apiKey": "sk-97034a83a8033b14-nveifp-cad43573"
    }
  },
  "model": "9router/nexifyai-combo-llm"
}
```

Explorer-Subagent nutzt `ds/deepseek-v4-flash` (Token-effizient).

### mimo-code

**Datei:** `/root/.local/share/mimocode/auth.json`

Provider `9router` hinzugefügt (neben bestehendem `xiaomi` und `vercel`).
Key: `all` (`sk-97034a83a8033b14-nveifp-cad43573`).
Default-Model: `nexifyai-combo-llm`.

### lv-ai App

**Datei:** `/workspace/leistungsverzeichnis/.env`

```
OPENAI_API_KEY=sk-97034a83a8033b14-nveifp-cad43573
OPENAI_BASE_URL=http://127.0.0.1:20128/v1
```

Lokale URL für Performance (gleicher VPS). Für Vercel-Deploy: auf `https://ai-router.nexifyai.cloud/v1` umstellen.

## Verfügbare Modelle

| Modell | Verwendung | Token-Effizienz |
|--------|-----------|-----------------|
| `nexifyai-combo-llm` | Default (Round-Robin Pro/Flash) | Hoch |
| `ds/deepseek-v4-pro` | Höchste Qualität (AVA-Fachlogik) | Mittel |
| `ds/deepseek-v4-flash` | Titel, Routine, Explorer-Subagent | Sehr hoch |
| `ds/deepseek-reasoner` | Komplexe AVA-Fälle (Nachträge, VOB/A) | Niedrig (Reasoning) |

## Token-Sparung — 4 Ebenen

### 1. Headroom Context-Optimization (Container-Ebene)

Headroom komprimiert wiederkehrende System-Prompts und Tool-Definitionen
vor dem Senden an DeepSeek. Bis zu 70% Token-Ersparnis bei langen Chats
mit vielen Tools. Automatisch aktiviert via `HEADROOM_URL` in 9router-Compose.

### 2. 9Router Round-Robin (Gateway-Ebene)

`nexifyai-combo-llm` wechselt zwischen DeepSeek V4 Pro (Qualität) und
Flash (Geschwindigkeit). Routine-Anfragen nutzen Flash (weniger Token),
fachliche Anfragen nutzen Pro (mehr Token, bessere Qualität).

### 3. Headroom Caching (Proxy-Ebene)

Wiederkehrende Prompts werden gecacht. Cache-Hits kosten 0 Token.
Besonders effektiv für lv-ai's stabile System-Prompts (T21 modularisiert).

### 4. lv-ai Prompt-Optimierung (App-Ebene)

- **T21:** `systemPromptParts()` trennt stabile von dynamischen Prompt-Teilen
- **T22:** `regularPrompt` komprimiert von ~450 auf ~212 Token (53% Reduktion)
- **T19:** `maxOutputTokens: 2000` verhindert Endlos-Antworten
- **T20:** Message-History auf letzte 8 Nachrichten trunciert

## API-Keys (Übersicht)

| Name | Key-Präfix | Verwendung |
|------|-----------|------------|
| `all` | `nveifp` | lv-ai, OpenCode, mimo-code |
| `glm-5.2-claude-code` | `vgu0wz` | Claude Code |
| `goose-deepseek` | `53tcm5` | Goose |
| `claude-code` | `5egxwa` | Reserve |
| `system` | `ijhhux` | Admin (nicht für Apps) |

## Wartung

### 9router neu starten

```bash
cd /docker/9router-6kxn
docker compose restart niner-router
```

### Health-Check (Watchdog)

```bash
# Manuell:
/root/nexifyai-platform/scripts/runtime/check-9router-health.sh

# Timer (alle 5 Min automatisch):
systemctl list-timers 9router-watchdog
```

### Logs

```bash
# niner-router
docker logs -f 9router-6kxn-niner-router-1

# headroom
docker logs -f 9router-6kxn-headroom-1

# Cloudflare Tunnel
journalctl -u cloudflared-main -f
```

### API-Key hinzufügen

1. 9router Dashboard: `http://127.0.0.1:20128` (lokal) oder `https://ai-router.nexifyai.cloud`
2. Settings → API Keys → New Key
3. Key in respective CLI-Config eintragen
