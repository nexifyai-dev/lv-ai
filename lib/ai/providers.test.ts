import { describe, expect, it, vi } from "vitest";
import { getLanguageModel, getTitleModel } from "./providers";

describe("LV.AI Providers", () => {
  describe("getLanguageModel", () => {
    it("should return a model for valid model ID", () => {
      const model = getLanguageModel("nexifyai-combo-llm");
      expect(model).toBeDefined();
    });
  });

  describe("getTitleModel", () => {
    it("should return a title model", () => {
      const model = getTitleModel();
      expect(model).toBeDefined();
    });
  });
});
