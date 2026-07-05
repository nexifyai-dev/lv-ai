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
    it("should use mimo-v2.5-pro as default", () => {
      expect(DEFAULT_CHAT_MODEL).toBe("mimo-v2.5-pro");
    });
  });

  describe("titleModel", () => {
    it("should use mimo-v2.5-pro for title generation", () => {
      expect(titleModel.id).toBe("mimo-v2.5-pro");
    });
  });

  describe("chatModels", () => {
    it("should have 2 models configured", () => {
      expect(chatModels.length).toBe(2);
    });

    it("should include mimo-v2.5-pro", () => {
      const proModel = chatModels.find((m) => m.id === "mimo-v2.5-pro");
      expect(proModel).toBeDefined();
      expect(proModel?.name).toBe("MiMo V2.5 Pro");
    });

    it("should include mimo-v2.5", () => {
      const baseModel = chatModels.find((m) => m.id === "mimo-v2.5");
      expect(baseModel).toBeDefined();
      expect(baseModel?.name).toBe("MiMo V2.5");
    });

    it("each model should have required fields", () => {
      for (const model of chatModels) {
        expect(model.id).toBeDefined();
        expect(model.name).toBeDefined();
        expect(model.provider).toBe("xiaomi");
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
    it("should group models by xiaomi provider", () => {
      expect(modelsByProvider.xiaomi).toBeDefined();
      expect(modelsByProvider.xiaomi.length).toBe(2);
    });
  });
});
