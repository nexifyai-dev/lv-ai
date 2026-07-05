import { describe, expect, it } from "vitest";
import {
  chatModels,
  DEFAULT_CHAT_MODEL,
  titleModel,
  allowedModelIds,
  modelsByProvider,
} from "./models";

describe("LV.AI Models Configuration", () => {
  describe("DEFAULT_CHAT_MODEL", () => {
    it("should use nexifyai-combo-llm as default", () => {
      expect(DEFAULT_CHAT_MODEL).toBe("nexifyai-combo-llm");
    });
  });

  describe("titleModel", () => {
    it("should use deepseek model for title generation", () => {
      expect(titleModel.id).toContain("deepseek");
    });
  });

  describe("chatModels", () => {
    it("should have at least 2 models configured", () => {
      expect(chatModels.length).toBeGreaterThanOrEqual(2);
    });

    it("should include nexifyai-combo-llm", () => {
      const comboModel = chatModels.find(
        (m) => m.id === "nexifyai-combo-llm"
      );
      expect(comboModel).toBeDefined();
    });

    it("should include deepseek model", () => {
      const deepseekModel = chatModels.find((m) =>
        m.id.includes("deepseek")
      );
      expect(deepseekModel).toBeDefined();
    });

    it("each model should have required fields", () => {
      for (const model of chatModels) {
        expect(model.id).toBeDefined();
        expect(model.name).toBeDefined();
        expect(model.provider).toBeDefined();
        expect(model.description).toBeDefined();
      }
    });
  });

  describe("allowedModelIds", () => {
    it("should contain all chat model IDs", () => {
      for (const model of chatModels) {
        expect(allowedModelIds.has(model.id)).toBe(true);
      }
    });
  });

  describe("modelsByProvider", () => {
    it("should group models by provider", () => {
      const providers = Object.keys(modelsByProvider);
      expect(providers.length).toBeGreaterThan(0);
    });

    it("should have models in each provider group", () => {
      for (const provider of Object.values(modelsByProvider)) {
        expect(provider.length).toBeGreaterThan(0);
      }
    });
  });
});
