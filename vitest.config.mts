import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      include: [
        "src/app/lib/reports/**/*.ts",
        "src/app/components/ui/sections/reports/sortRepos.ts",
        "src/app/components/ui/sections/reports/yearUtils.ts",
      ],
      exclude: ["src/**/*.test.ts", "src/**/__tests__/**"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
