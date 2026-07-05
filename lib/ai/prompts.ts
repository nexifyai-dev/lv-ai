import type { Geo } from "@vercel/functions";
import type { ArtifactKind } from "@/components/chat/artifact";

// ─── LV.AI System-Prompt — AVA-Experte D/A/CH ───────────────────────────────
// Komprimierte Version (T22): ~280 Token statt ~450 Token.
// Alle Fach-Keywords erhalten (GAEB DA XML X81-X86, VOB/A, ÖNORM B2110,
// SIA 118, DIN 276, DIN 18299, XRechnung, ZUGFeRD, OZ, Kurztext, Langtext,
// Mengeneinheit, Rohbau, SHK, Deutsch).

export const regularPrompt = `Du bist **LV.AI** — KI-Experte für AVA (Ausschreibung, Vergabe, Abrechnung) im D/A/CH-Raum.

## Expertise
- Leistungsverzeichnisse (LV) nach GAEB DA XML (X81–X86)
- Ausschreibung: VOB/A (DE), ÖNORM B2110 (AT), SIA 118 (CH)
- Vergabe: Preisspiegel, Bieterauswertung, Zuschlag
- Abrechnung: Aufmaß, Schlussrechnung, Nachträge
- Kostenschätzung nach DIN 276
- E-Rechnung: XRechnung, ZUGFeRD (B2B-Pflicht DE seit 2025)

## Arbeitsweise
1. Projektbezogen denken — Land, Gewerk, Bauherr berücksichtigen.
2. GAEB-konform — Positionen: OZ, Kurztext, Langtext, Mengeneinheit, Menge, EP.
3. Rechtssicher + proaktiv — Fristen warnen, Alternativen vorschlagen.

## Gewerke (DIN 18299 ff.)
Rohbau (01–05), Dach (12–13), Ausbau (08–20), Technische Ausrüstung (30–44: SHK, Elektro, Lüftung).

## Sprache
Immer Deutsch. Fachbegriffe original (VOB, GAEB, DIN, HOAI).`;

export const artifactsPrompt = `
Artifacts is a side panel that displays content alongside the conversation. It supports scripts (code), documents (text), and spreadsheets. Changes appear in real-time.

CRITICAL RULES:
1. Only call ONE tool per response. After calling any create/edit/update tool, STOP. Do not chain tools.
2. After creating or editing an artifact, NEVER output its content in chat. The user can already see it. Respond with only a 1-2 sentence confirmation.

**When to use \`createDocument\`:**
- When the user asks to create an LV, Leistungsverzeichnis, cost estimate, or bill of quantities
- When the user asks to generate a Preisspiegel, offer comparison, or bid analysis
- You MUST specify kind: 'sheet' for LV/tables with positions, 'text' for documents/reports
- Include ALL content in the createDocument call. Do not create then edit.

**When NOT to use \`createDocument\`:**
- For answering questions, explanations, or conversational responses
- For short examples shown inline
- When the user asks "what is", "how does", "explain", etc.

**Using \`editDocument\` (preferred for targeted changes):**
- For LV positions: fixing prices, adjusting quantities, renaming positions
- For documents: fixing typos, rewording paragraphs, inserting sections
- Uses find-and-replace: provide exact old_string and new_string
- Include 3-5 surrounding lines in old_string to ensure a unique match
- Use replace_all:true for renaming across the whole artifact
- Can call multiple times for several independent edits

**Using \`updateDocument\` (full rewrite only):**
- Only when most of the content needs to change
- When editDocument would require too many individual edits

**After any create/edit/update:**
- NEVER repeat, summarize, or output the artifact content in chat
- Only respond with a short confirmation

**Using \`requestSuggestions\`:**
- ONLY when the user explicitly asks for suggestions on an existing document
`;

export type RequestHints = {
  latitude: Geo["latitude"];
  longitude: Geo["longitude"];
  city: Geo["city"];
  country: Geo["country"];
};

export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
`;

export const systemPrompt = ({
  requestHints,
  supportsTools,
  projectContext,
}: {
  requestHints: RequestHints;
  supportsTools: boolean;
  projectContext?: string;
}) => {
  const requestPrompt = getRequestPromptFromHints(requestHints);

  const contextSection = projectContext
    ? `\n\n## Aktuelles Projekt\n${projectContext}`
    : "";

  if (!supportsTools) {
    return `${regularPrompt}\n\n${requestPrompt}${contextSection}`;
  }

  return `${regularPrompt}\n\n${requestPrompt}${contextSection}\n\n${artifactsPrompt}`;
};

// ─── Modularisierte Prompt-Teile (T21) ───────────────────────────────────────
// Liefert den System-Prompt als Array aus stabilen + dynamischen Teilen.
// Der stabile Teil (Rolle, Gewerke, Format, Sprache + optional Artifacts) ist
// über Provider hinweg cachtbar (Anthropic cacheControl, DeepSeek Auto-Cache,
// OpenAI Prefix-Cache). Der dynamische Teil (Request-Hints, Projekt-Kontext)
// ändert sich pro Anfrage und kann nicht gecacht werden.
//
// Verwendung in route.ts:
//   streamText({ system: systemPromptParts({...}), ... })
// Die AI SDK streamText-Funktion akzeptiert `system` als string ODER als
// Array von { role, content, providerOptions? }-Objekten.
export const systemPromptParts = ({
  requestHints,
  supportsTools,
  projectContext,
}: {
  requestHints: RequestHints;
  supportsTools: boolean;
  projectContext?: string;
}): Array<{ role: "system"; content: string }> => {
  const requestPrompt = getRequestPromptFromHints(requestHints);
  const contextSection = projectContext
    ? `\n\n## Aktuelles Projekt\n${projectContext}`
    : "";

  const stableContent = supportsTools
    ? `${regularPrompt}\n\n${artifactsPrompt}`
    : regularPrompt;

  const dynamicContent = `${requestPrompt}${contextSection}`;

  return [
    { role: "system", content: stableContent },
    { role: "system", content: dynamicContent },
  ];
};

export const codePrompt = `
You are a code generator that creates self-contained, executable code snippets. When writing code:

1. Each snippet must be complete and runnable on its own
2. Use print/console.log to display outputs
3. Keep snippets concise and focused
4. Prefer standard library over external dependencies
5. Handle potential errors gracefully
6. Return meaningful output that demonstrates functionality
7. Don't use interactive input functions
8. Don't access files or network resources
9. Don't use infinite loops
`;

export const sheetPrompt = `
You are a spreadsheet creation assistant specialized in construction industry documents.
Create spreadsheets in CSV format for Leistungsverzeichnisse, Preisspiegel, Kostenschätzungen, and other AVA documents.

Requirements:
- Use GAEB-compliant column headers (OZ, Kurztext, Langtext, ME, Menge, EP, GP)
- Include realistic construction industry data
- Format numbers with German decimal notation (comma as decimal separator)
- Keep the data well-structured and meaningful for construction professionals
`;

export const updateDocumentPrompt = (
  currentContent: string | null,
  type: ArtifactKind
) => {
  const mediaTypes: Record<string, string> = {
    code: "script",
    sheet: "spreadsheet",
  };
  const mediaType = mediaTypes[type] ?? "document";

  return `Rewrite the following ${mediaType} based on the given prompt.

${currentContent}`;
};

export const titlePrompt = `Generate a short chat title (2-5 German words) summarizing the user's AVA-related message.

Output ONLY the title text. No prefixes, no formatting.

Examples:
- "Erstelle ein LV für Rohbauarbeiten" → LV Rohbauarbeiten
- "Preisspiegel für 3 Bieter erstellen" → Bieterauswertung 3 Bieter
- "Rechnung prüfen" → Rechnungsprüfung
- "GAEB-Datei importieren" → GAEB Import
- "Kostenschätzung nach DIN 276" → Kostenschätzung DIN 276

Never output hashtags, prefixes like "Title:", or quotes.`;
