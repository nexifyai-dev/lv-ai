# Vercel AI Gateway vs. 9Router — Evaluation für lv-ai

> **Stand:** 2026-07-05
> **Entscheidung:** 9Router bleibt primärer Provider, Vercel AI Gateway nur als Fallback/Proxy

---

## Ausgangslage

Konzept v1.0 schlägt vor: "AI SDK + OpenRouter (Multi-Modell)" mit einem
Modell für Fachlogik und einem günstigen für Routine. Aktuelle Architektur
nutzt 9Router mit DeepSeek V4 (Pro/Flash/Reasoner) + Headroom.

## Vercel AI Gateway — was es bietet

- Ein API-Key für hunderte Modelle (OpenAI, Anthropic, Google, xAI, ...)
- Automatisches Fallback zwischen Providern bei Ausfällen
- Spend Monitoring, Budgets, Load-Balancing
- Bring Your Own Key (BYOK) — keine Markup auf Token
- OpenAI-kompatibel (`https://ai-gateway.vercel.sh/v1`)

## 9Router — was es bietet

- Ein API-Key für mehrere Provider (DeepSeek, Baseten, Vercel Gateway, ...)
- Headroom Context-Optimization (Token-Kompression bis 70%)
- Caching für wiederkehrende Prompts (0 Token bei Cache-Hits)
- Round-Robin (nexifyai-combo-llm: Pro/Flash je nach Last)
- Selbst-gehostet auf VPS (volle Kontrolle, keine Vendor-Lock-in)
- OpenAI-kompatibel (`http://127.0.0.1:20128/v1` / `https://ai-router.nexifyai.cloud/v1`)

## Vergleich

| Kriterium | Vercel AI Gateway | 9Router |
|-----------|-------------------|---------|
| Token-Kompression | Nein | Headroom (bis 70%) |
| Prompt-Caching | Nein | Ja (0 Token bei Hits) |
| Round-Robin | Nein (manuell) | nexifyai-combo-llm automatisch |
| Modell-Auswahl | Hunderte (OpenAI, Anthropic, ...) | DeepSeek V4 + Baseten + Vercel-Gateway |
| Selbst-gehostet | Nein (Vercel-Cloud) | Ja (eigener VPS) |
| Kosten | Token-Preis + Vercel-Plan | nur Token-Preis (DeepSeek direkt) |
| Fallback | Ja (automatisch) | Ja (Provider-Rotation) |
| DSGVO | Vercel US/EU | Eigener VPS (EU, voll kontrolle) |
| ECC-Verbot | ⚠️ Bezahlt (Vercel Pro) | ✅ Selbst-gehostet, kostenlos |

## Entscheidung

**9Router bleibt primärer Provider.** Gründe:

1. **Token-Ersparnis durch Headroom** — Vercel AI Gateway hat keine
   Context-Optimization. Bei lv-ai's langen System-Prompts (GAEB, VOB, DIN)
   spart Headroom signifikant mehr Token als ein einfacher Proxy.

2. **ECC-Verbot** — Vercel AI Gateway erfordert Vercel Pro/Team-Plan für
   ernsthafte Nutzung. 9Router ist selbst-gehostet, kostenlos.

3. **DSGVO-Kontrolle** — AVA-Daten (Bauherren, Preise, Ausschreibungen)
   sind sensitiv. Eigener VPS in EU gibt volle Datenkontrolle. Vercel AI
   Gateway routet durch Vercel-Infrastruktur (US/EU, aber nicht eigene).

4. **Cache-Hits = 0 Token** — Headroom cacht wiederkehrende Prompts.
   lv-ai's modularisierter System-Prompt (T21) ist ideal für Caching.
   Vercel AI Gateway hat kein Caching.

5. **Multi-Modell via 9Router möglich** — 9Router kann Vercel AI Gateway
   als Provider einbinden (ist bereits konfiguriert als `vercel-ai-gateway`
   in 9router-DB). So bekommen wir beide Welten: Headroom-Caching +
   Vercel's Modell-Auswahl, ohne Vercel-Pro-Pflicht.

## Vercel AI Gateway als 9Router-Provider (empfohlen)

9Router hat bereits `vercel-ai-gateway` als Provider-Connection in der DB.
Bei Bedarf können lv-ai-Modelle ergänzt werden, die via 9Router → Vercel
Gateway → OpenAI/Anthropic routen. Vorteile:

- Headroom-Caching bleibt aktiv (Token-Ersparnis)
- 9Router-Key bleibt gleich (keine App-Config-Änderung)
- Fallback auf Vercel bei DeepSeek-Ausfall
- Keine zusätzliche Kosten-Instanz (Vercel Free-Tier für Gateway)

## Vercel-Proxy für lv-ai Production-Deploy

Für Vercel-Deploy von lv-ai gilt: Die App läuft auf Vercel, ruft aber
9Router auf (nicht Vercel AI Gateway). `.env` in Vercel-Settings:

```
OPENAI_API_KEY=sk-97034a83a8033b14-nveifp-cad43573
OPENAI_BASE_URL=https://ai-router.nexifyai.cloud/v1
```

Public HTTPS (via Cloudflare Tunnel) statt lokal — Vercel kann nicht
auf `127.0.0.1` des VPS zugreifen.

## Fazit

| Setup | Empfehlung |
|-------|-----------|
| Lokaler Dev (VPS) | 9Router lokal (`127.0.0.1:20128`) |
| Vercel Production | 9Router public (`ai-router.nexifyai.cloud`) |
| Vercel AI Gateway | Nur als 9Router-Provider (Fallback), nicht direkt |
| OpenRouter | Nicht nötig — 9Router hat Multi-Provider bereits |

**Keine Migration nötig.** 9Router erfüllt alle Anforderungen aus
Konzept v1.0 (Multi-Modell, Token-Effizienz) und übertrifft Vercel AI
Gateway durch Headroom-Integration + DSGVO-Kontrolle.
