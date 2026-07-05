// ─── LV.AI Model Configuration — MiMo AI (Xiaomi Token Plan) ─────────────────

export const DEFAULT_CHAT_MODEL = "MiMo-V2.5-Pro";

export const titleModel = {
  id: "MiMo-V2.5-Pro",
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
    id: "MiMo-V2.5-Pro",
    name: "MiMo V2.5 Pro",
    provider: "xiaomi",
    description:
      "Xiaomi MiMo V2.5 Pro — leistungsfähiges Modell für AVA-Aufgaben",
  },
];

export async function getCapabilities(): Promise<
  Record<string, ModelCapabilities>
> {
  const capabilities: Record<string, ModelCapabilities> = {};
  for (const model of chatModels) {
    capabilities[model.id] = {
      tools: true,
      vision: false,
      reasoning: true,
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
