// ─── LV.AI Model Configuration — MiMo AI (Xiaomi Token Plan) ─────────────────
// API: https://token-plan-ams.xiaomimimo.com/v1 (OpenAI-kompatibel)
// Docs: https://mimo.mi.com/docs/en-US/tokenplan/integration/openai-compatible

export const DEFAULT_CHAT_MODEL = "mimo-v2.5-pro";

export const titleModel = {
  id: "mimo-v2.5-pro",
  name: "MiMo V2.5 Pro",
  provider: "xiaomi",
  description: "Schnelles Modell für Titelgenerierung",
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
    id: "mimo-v2.5-pro",
    name: "MiMo V2.5 Pro",
    provider: "xiaomi",
    description:
      "Xiaomi MiMo V2.5 Pro — 1T Params (42B aktiv), 1M Kontext, native Tool Calling, Reasoning",
  },
  {
    id: "mimo-v2.5",
    name: "MiMo V2.5",
    provider: "xiaomi",
    description:
      "Xiaomi MiMo V2.5 — Multimodal (Bild/Video/Audio/Text), 1M Kontext",
  },
];

export async function getCapabilities(): Promise<
  Record<string, ModelCapabilities>
> {
  const capabilities: Record<string, ModelCapabilities> = {};
  for (const model of chatModels) {
    capabilities[model.id] = {
      tools: true,
      vision: model.id === "mimo-v2.5", // V2.5 ist multimodal
      reasoning: true, // Beide unterstützen Reasoning
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
  // MiMo AI — keine dynamische Modell-Liste, nur konfigurierte Modelle
  return chatModels.map((m) => ({
    ...m,
    capabilities: {
      tools: true,
      vision: false,
      reasoning: true,
    },
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
