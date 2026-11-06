import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/* Unit and component tests (node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md).
   jsdom for the components; the pure modules don't need it but don't mind it.
   Vite resolves the `@/` alias from tsconfig.json itself. */
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
});
