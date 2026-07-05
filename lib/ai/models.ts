// ─── LV.AI Model Configuration — 9Router (NeXify Multi-Provider-Gateway) ──────
// API: https://ai-router.nexifyai.cloud/v1 (OpenAI-kompatibel)
// Läuft lokal auf dem VPS via systemd `9router-server.service` (Port 20128),
// public über Cloudflare Tunnel (nexify-main-v2).
//
// Modelle (Stand 2026-07-05, siehe /v1/models):
//   - nexifyai-combo-llm — Round-Robin DeepSeek-V4-Pro/Flash (Standard)
//   - ds/deepseek-v4-pro — höchste Qualität, Reasoning
//   - ds/deepseek-v4-flash — schnell, kosteneffizient
//   - ds/deepseek-reasoner — Reasoning-Modell für komplexe AVA-Fälle
//
// Token-Einsparung: combo-llm nutzt Flash für Routine-Chats, Pro für
// fachliche Antworten. Automatisches Caching via DeepSeek-Backend.

export const DEFAULT_CHAT_MODEL = "nexifyai-combo-llm";

export const titleModel = {
  id: "ds/deepseek-v4-flash",
  name: "DeepSeek V4 Flash",
  provider: "deepseek",
  description: "Schnelles Modell für Titelgenerierung (Token-effizient)",
};

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  reasoningEffort?: "none" | "minimal" | "low" | "medium" | "high";
};

export const chatModels: ChatModel[] = [
  {
    id: "nexifyai-combo-llm",
    name: "NeXify Combo LLM",
    provider: "nexify",
    description:
      "Round-Robin DeepSeek V4 Pro/Flash — automatische Lastverteilung, optimale Token-Effizienz",
  },
  {
    id: "ds/deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "deepseek",
    description:
      "Höchste Qualität für fachliche AVA-Aufgaben — GAEB-Positionen, VOB-Analyse, Kostenschätzung",
    reasoningEffort: "medium",
  },
  {
    id: "ds/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "deepseek",
    description:
      "Schnelles Modell für Routine-Chats und Titelgenerierung — minimaler Token-Verbrauch",
  },
  {
    id: "ds/deepseek-reasoner",
    name: "DeepSeek Reasoner",
    provider: "deepseek",
    description:
      "Reasoning-Modell für komplexe AVA-Fälle — Nachtragsmanagement, VOB/A-Konformitätsprüfung",
    reasoningEffort: "high",
  },
];

export function getCapabilities(): Record<string, ModelCapabilities> {
  const capabilities: Record<string, ModelCapabilities> = {};
  for (const model of chatModels) {
    capabilities[model.id] = {
      tools: true,
      vision: true,
      reasoning: model.id === "ds/deepseek-reasoner" || model.reasoningEffort !== undefined,
    };
  }
  return capabilities;
}

export const isDemo = process.env.IS_DEMO === "1";

export type GatewayModelWithCapabilities = ChatModel & {
  capabilities: ModelCapabilities;
};

// biome-ignore lint/suspicious/useAwait: async für API-Kompatibilität (Aufrufer erwarten Promise), auch wenn intern kein await nötig ist
export async function getAllGatewayModels(): Promise<
  GatewayModelWithCapabilities[]
> {
  // 9Router bietet /v1/models — statische Liste hier als kuratierte Auswahl.
  // Dynamische Liste via fetch wäre möglich, aber dann wären ungetestete
  // Modelle wählbar. Kuratierung ist sicherer.
  const caps = getCapabilities();
  return chatModels.map((m) => ({
    ...m,
    capabilities: caps[m.id] ?? { tools: true, vision: true, reasoning: true },
  }));
}

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
