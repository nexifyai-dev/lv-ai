import { createOpenAI } from "@ai-sdk/openai";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";
import { titleModel } from "./models";

// ─── MiMo AI Provider (Xiaomi Token Plan) ────────────────────────────────────
// OpenAI-kompatible API: https://token-plan-ams.xiaomimimo.com/v1

const MIMO_BASE_URL =
  process.env.OPENAI_BASE_URL || "https://token-plan-ams.xiaomimimo.com/v1";
const MIMO_API_KEY = process.env.OPENAI_API_KEY || "";

const mimoAI = createOpenAI({
  baseURL: MIMO_BASE_URL,
  apiKey: MIMO_API_KEY,
});

// ─── Provider Export ─────────────────────────────────────────────────────────

export const myProvider = isTestEnvironment
  ? (() => {
      const { chatModel, titleModel: mockTitleModel } =
        require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "title-model": mockTitleModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  // MiMo AI — OpenAI-kompatible API
  return mimoAI.chat(modelId);
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  return mimoAI.chat(titleModel.id);
}
