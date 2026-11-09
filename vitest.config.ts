import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
  test: {
    environment: "node",
    exclude: ["node_modules", "tests/e2e"],
    globals: true,
    include: ["**/*.test.ts", "**/*.test.tsx"],
  },
});
