import { describe, expect, it } from "vitest";
import {
  allowedModelIds,
  chatModels,
  DEFAULT_CHAT_MODEL,
  modelsByProvider,
  titleModel,
} from "./models";

describe("LV.AI Models Configuration (9Router / DeepSeek)", () => {
  describe("DEFAULT_CHAT_MODEL", () => {
    it("soll nexifyai-combo-llm als Standard verwenden", () => {
      expect(DEFAULT_CHAT_MODEL).toBe("nexifyai-combo-llm");
    });

    it("soll ein gültiges Modell sein (in chatModels enthalten)", () => {
      const found = chatModels.find((m) => m.id === DEFAULT_CHAT_MODEL);
      expect(found).toBeDefined();
    });
  });

  describe("titleModel", () => {
    it("soll ds/deepseek-v4-flash für Titelgenerierung nutzen (Token-effizient)", () => {
      expect(titleModel.id).toBe("ds/deepseek-v4-flash");
    });

    it("soll ein gültiges Modell sein", () => {
      const found = chatModels.find((m) => m.id === titleModel.id);
      expect(found).toBeDefined();
    });
  });

  describe("chatModels", () => {
    it("soll 4 kuratierte Modelle haben", () => {
      expect(chatModels.length).toBe(4);
    });

    it("soll nexifyai-combo-llm enthalten (Round-Robin-Standard)", () => {
      const combo = chatModels.find((m) => m.id === "nexifyai-combo-llm");
      expect(combo).toBeDefined();
      expect(combo?.name).toBe("NeXify Combo LLM");
      expect(combo?.provider).toBe("nexify");
    });

    it("soll ds/deepseek-v4-pro enthalten (höchste Qualität)", () => {
      const pro = chatModels.find((m) => m.id === "ds/deepseek-v4-pro");
      expect(pro).toBeDefined();
      expect(pro?.name).toBe("DeepSeek V4 Pro");
      expect(pro?.provider).toBe("deepseek");
    });

    it("soll ds/deepseek-v4-flash enthalten (schnell/kosteneffizient)", () => {
      const flash = chatModels.find((m) => m.id === "ds/deepseek-v4-flash");
      expect(flash).toBeDefined();
      expect(flash?.provider).toBe("deepseek");
    });

    it("soll ds/deepseek-reasoner enthalten (komplexe AVA-Fälle)", () => {
      const reasoner = chatModels.find((m) => m.id === "ds/deepseek-reasoner");
      expect(reasoner).toBeDefined();
      expect(reasoner?.provider).toBe("deepseek");
    });

    it("jedes Modell soll alle Pflichtfelder haben", () => {
      for (const model of chatModels) {
        expect(model.id).toBeDefined();
        expect(model.id.length).toBeGreaterThan(0);
        expect(model.name).toBeDefined();
        expect(model.provider).toBeDefined();
        expect(model.description).toBeDefined();
        expect(model.description.length).toBeGreaterThan(10);
      }
    });
  });

  describe("allowedModelIds", () => {
    it("soll alle chatModels-IDs enthalten", () => {
      for (const model of chatModels) {
        expect(allowedModelIds.has(model.id)).toBe(true);
      }
    });

    it("soll keine Fremd-IDs enthalten", () => {
      expect(allowedModelIds.has("mimo-v2.5-pro")).toBe(false);
      expect(allowedModelIds.has("gpt-4")).toBe(false);
    });
  });

  describe("modelsByProvider", () => {
    it("soll Provider 'nexify' und 'deepseek' haben", () => {
      expect(modelsByProvider.nexify).toBeDefined();
      expect(modelsByProvider.deepseek).toBeDefined();
    });

    it("soll nexify mit 1 Modell haben (combo-llm)", () => {
      expect(modelsByProvider.nexify.length).toBe(1);
    });

    it("soll deepseek mit 3 Modellen haben (pro, flash, reasoner)", () => {
      expect(modelsByProvider.deepseek.length).toBe(3);
    });
  });
});
