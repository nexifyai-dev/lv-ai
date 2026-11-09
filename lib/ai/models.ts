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
  description: "Schnelles Modell für Titelgenerierung (Token-effizient)",
  id: "ds/deepseek-v4-flash",
  name: "DeepSeek V4 Flash",
  provider: "deepseek",
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
    description:
      "Round-Robin DeepSeek V4 Pro/Flash — automatische Lastverteilung, optimale Token-Effizienz",
    id: "nexifyai-combo-llm",
    name: "NeXify Combo LLM",
    provider: "nexify",
  },
  {
    description:
      "Höchste Qualität für fachliche AVA-Aufgaben — GAEB-Positionen, VOB-Analyse, Kostenschätzung",
    id: "ds/deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "deepseek",
    reasoningEffort: "medium",
  },
  {
    description:
      "Schnelles Modell für Routine-Chats und Titelgenerierung — minimaler Token-Verbrauch",
    id: "ds/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "deepseek",
  },
  {
    description:
      "Reasoning-Modell für komplexe AVA-Fälle — Nachtragsmanagement, VOB/A-Konformitätsprüfung",
    id: "ds/deepseek-reasoner",
    name: "DeepSeek Reasoner",
    provider: "deepseek",
    reasoningEffort: "high",
  },
];

export function getCapabilities(): Record<string, ModelCapabilities> {
  const capabilities: Record<string, ModelCapabilities> = {};
  for (const model of chatModels) {
    capabilities[model.id] = {
      reasoning:
        model.id === "ds/deepseek-reasoner" ||
        model.reasoningEffort !== undefined,
      tools: true,
      vision: true,
    };
  }
  return capabilities;
}

export const isDemo = process.env.IS_DEMO === "1";

export type GatewayModelWithCapabilities = ChatModel & {
  capabilities: ModelCapabilities;
};

export async function getAllGatewayModels(): Promise<
  GatewayModelWithCapabilities[]
> {
  // 9Router bietet /v1/models — statische Liste hier als kuratierte Auswahl.
  // Dynamische Liste via fetch wäre möglich, aber dann wären ungetestete
  // Modelle wählbar. Kuratierung ist sicherer.
  const caps = getCapabilities();
  return chatModels.map((m) => ({
    ...m,
    capabilities: caps[m.id] ?? { reasoning: true, tools: true, vision: true },
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
