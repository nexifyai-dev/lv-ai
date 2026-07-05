# LV.AI — Token-Optimierungs-Strategie

> **Stand:** 2026-07-05
> **Ziel:** Reduzierung des Token-Verbrauchs bei Chat-Interaktionen ohne Qualitätseinbußen
> **Bezug:** Konzept v1.0 §5 (Proaktivität), CLAUDE.md (Schuldenfrei, Gesamtsystem-Denken)

---

## 1. Bestandsaufnahme — aktueller Verbrauch

### 1.1 System-Prompt (`lib/ai/prompts.ts`)

Der `regularPrompt` (~450 Token) wird **bei jeder Chat-Nachricht** neu gesendet. Inhalt:
- Rolle + Expertise (~120 Token)
- Arbeitsweise (~80 Token)
- LV-Position Format (~60 Token)
- Gewerke-Kenntnisse (~90 Token)
- Sprache (~30 Token)
- `artifactsPrompt` (~280 Token, wird bei `supportsTools=true` angehängt)

**Gesamt-System-Prompt: ~730 Token pro Request.**

### 1.2 Message-History (`app/(chat)/api/chat/route.ts:189`)

```ts
const modelMessages = await convertToModelMessages(uiMessages);
```

**Vollständige Historie** wird gesendet — keine Truncation, kein Sliding-Window, kein Summary. Bei 20 Nachrichten à ~100 Token = **2000 Token** zusätzlich pro Request.

### 1.3 Tools (`route.ts:214-232`)

5 Tools (`getWeather`, `createDocument`, `editDocument`, `updateDocument`, `requestSuggestions`) werden bei jedem Request mit Tool-Schemas gesendet. Geschätzt **~800 Token** für Tool-Definitionen.

### 1.4 Hochrechnung pro Chat-Nachricht

| Bestandteil | Token (geschätzt) |
|---|---|
| System-Prompt | ~730 |
| Tool-Definitionen | ~800 |
| Message-History (10 Nachrichten) | ~1000 |
| Aktuelle User-Nachricht | ~100 |
| **Input gesamt** | **~2630** |
| Output (Response) | ~300–800 |
| **Gesamt pro Request** | **~3000–3400** |

Bei 100 Chat-Nachrichten/Tag → **~300K Token/Tag**.

---

## 2. Best Practices — recherchiert (2026-07-05)

### 2.1 Prompt-Caching (Anthropic, OpenAI, DeepSeek)

**Prinzip:** Statischer Prompt-Teil wird gecacht; nur dynamische Teile neu berechnet.
- Anthropic: `cacheControl: { type: 'ephemeral' }` via `providerOptions.anthropic`
- OpenAI: automatisches Caching bei wiederkehrenden Prompt-Präfixen (>1024 Token)
- DeepSeek: automatisches Caching, 90% Rabatt auf Cache-Hits

**Voraussetzung:** Prompt muss stabilen Präfix haben (System-Prompt + Tool-Definitionen kommen zuerst).

**Ersparnis:** Bis zu 90% auf wiederkehrende Token.

### 2.2 Message-History-Truncation

**Prinzip:** Nur die letzten N Nachrichten senden, ältere zusammenfassen oder verwerfen.
- Vercel AI Chatbot Template (Referenz): kein natives Truncation
- OpenAI Cookbook: "Sliding Window" + Summary der älteren Nachrichten
- LangChain: `ConversationSummaryBufferMemory` (Summary + letzte N)

**Ersparnis:** Bei 20→5 Nachrichten: ~75% weniger History-Token.

### 2.3 Tool-Selection (lazy tool loading)

**Prinzip:** Nicht alle Tools bei jedem Request senden — nur die, die für den Kontext relevant sind.
- AI SDK 7: `experimental_activeTools` (schon genutzt in `route.ts:199`)
- Weitergehende Optimierung: Tool-Set dynamisch basierend auf User-Intent

**Ersparnis:** Wenn 5→2 Tools: ~500 Token weniger pro Request.

### 2.4 System-Prompt-Modularisierung

**Prinzip:** Statischen Expertise-Teil vom dynamischen Projekt-Kontext trennen.
- Statisch (~730 Token): rolle, gewerke, format → cachtbar
- Dynamisch (~50–200 Token): aktueller Projekt-Kontext, Land, Bauherr → nicht cachtbar

**Ersparnis:** Wenn statischer Teil gecacht: ~90% auf 730 Token.

### 2.5 Output-Token-Begrenzung

**Prinzip:** `maxOutputTokens` setzen, um lange Antworten zu verhindern.
- Aktuell: keine Begrenzung → Modell kann beliebig lang antworten
- Empfehlung: 1500–2000 Token für Chat-Antworten, 4000 für LV-Generierung

**Ersparnis:** Verhindert "Endlos-Antworten", typisch 20–40% Ersparnis bei Output.

---

## 3. Lv-AI-spezifische Empfehlungen (priorisiert)

### Priorität 1: System-Prompt modularisieren + Caching-vorbereiten

**Schritt 1:** `systemPrompt()` splittet in:
- `stableSystemPrompt` (rolle, gewerke, format, sprache) — ~730 Token, cachtbar
- `dynamicContextPrompt` (projekt-Kontext, requestHints) — ~50–200 Token

**Schritt 2:** In `route.ts` werden beide getrennt übergeben:
```ts
streamText({
  system: [
    { 
      role: 'system', 
      content: stableSystemPrompt,
      // Caching-Marker, sobald Provider es unterstützt
      // providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' } } }
    },
    {
      role: 'system',
      content: dynamicContextPrompt,
    }
  ],
  ...
});
```

**Ersparnis:** Sobald MiMo/9Router Caching unterstützt: ~90% auf statischen Teil.
**Aufwand:** 1–2 Stunden.

### Priorität 2: Message-History-Truncation

**Schritt:** In `route.ts` vor `convertToModelMessages`:
```ts
const TRUNCATE_AFTER = 8; // letzte 8 Nachrichten + Summary
const recentMessages = uiMessages.slice(-TRUNCATE_AFTER);
if (uiMessages.length > TRUNCATE_AFTER) {
  // Ältere Nachrichten via generateText zusammenfassen
  // (oder einfacher: nur Recent senden, ohne Summary — MVP)
}
const modelMessages = await convertToModelMessages(recentMessages);
```

**Ersparnis:** Bei 20→8 Nachrichten: ~60% weniger History-Token.
**Aufwand:** 2–3 Stunden (mit Summary) oder 30 Min (ohne Summary).

### Priorität 3: Tool-Set dynamisch

**Schritt:** Nur `createDocument/editDocument/updateDocument` senden, wenn der User nach LV-Erstellung fragt; `getWeather` entfernen (nicht relevant für AVA).

**Ersparnis:** ~200–500 Token pro Request.
**Aufwand:** 1 Stunde.

### Priorität 4: Output-Token-Limit

**Schritt:** In `streamText`-Aufruf:
```ts
maxOutputTokens: 2000, // Chat
// oder 4000 für LV-Generierung
```

**Ersparnis:** 20–40% auf Output-Token.
**Aufwand:** 15 Minuten.

### Priorität 5: Compressed System-Prompt

**Schritt:** `regularPrompt` von ~450 auf ~250 Token kürzen, ohne Fachlichkeit zu verlieren. Beispiele:
- "Du kennst alle Gewerke nach DIN 18299 ff." statt alle Gewerke einzeln aufzulisten
- Format-Beschreibung kompakter

**Ersparnis:** ~200 Token pro Request.
**Aufwand:** 30 Minuten.

---

## 4. Implementierungs-Reihenfolge

1. **Quick Wins (Aufwand <1 Tag, Ersparnis ~30%):**
   - Output-Token-Limit (P4)
   - Tool-Set dynamisch (P3)
   - Message-History-Truncation ohne Summary (P2 MVP)

2. **Mittelfristig (1–2 Tage, Ersparnis ~50%):**
   - System-Prompt modularisieren (P1)
   - Compressed System-Prompt (P5)
   - Message-History mit Summary

3. **Langfristig (bei Provider-Migration):**
   - Prompt-Caching aktivieren (sobald MiMo/9Router unterstützt)
   - Mem0-basierte Context-Injection statt voller History

---

## 5. Quellen (recherchiert 2026-07-05)

- AI SDK 7 Doku: https://ai-sdk.dev/docs/foundations/prompts (providerOptions, cacheControl)
- AI SDK Core Settings: https://ai-sdk.dev/docs/ai-sdk-core/settings (maxOutputTokens)
- Vercel AI Chatbot Template: Referenz-Implementierung (keine native Truncation)
- Anthropic Prompt Caching: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
- OpenAI Cookbook: Sliding-Window-Pattern für Chat-Historie

---

*Dieses Dokument ist die Grundlage für die Implementierung in den Tasks T19–T23.*
