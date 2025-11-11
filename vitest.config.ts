import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/**",
        "build/**",
        "dist/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/types/**",
        "tests/**",
        // Exclude schema definition files (no logic to test)
        "src/utils/**",
        // Exclude server entry points (tested via integration)
        "src/index.ts",
        "src/server-http.ts",
        // Exclude simple template generators
        "src/tools/token-template.ts",
      ],
      include: ["src/**/*.ts"],
      thresholds: {
        lines: 83,
        functions: 91,
        branches: 71,
        statements: 82,
      },
    },
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "build", "dist"],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
