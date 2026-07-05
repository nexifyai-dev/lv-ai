import { describe, expect, it } from "vitest";
import {
  Mem0Service,
  createMem0Service,
  MEMORY_SCOPE_PROJECT,
  MEMORY_SCOPE_GLOBAL,
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
