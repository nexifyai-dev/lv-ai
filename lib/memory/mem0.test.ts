import { describe, expect, it } from "vitest";
import {
  createMem0Service,
  MEMORY_SCOPE_GLOBAL,
  MEMORY_SCOPE_PROJECT,
} from "./mem0";

describe("Mem0Service", () => {
  describe("createMem0Service", () => {
    it("should create a service instance", () => {
      const service = createMem0Service({
        apiKey: "test-key",
        userId: "test-user",
      });
      expect(service).toBeDefined();
    });
  });

  describe("MEMORY_SCOPE constants", () => {
    it("should define project scope", () => {
      expect(MEMORY_SCOPE_PROJECT).toBe("project");
    });

    it("should define global scope", () => {
      expect(MEMORY_SCOPE_GLOBAL).toBe("global");
    });
  });
});
