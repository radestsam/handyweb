import { defineConfig } from "vitest/config";

// Unit tests live next to the code as *.test.ts(x). A test that needs a DOM
// sets `// @vitest-environment jsdom` on its first line.
export default defineConfig({
    test: {
        include: ["packages/**/src/**/*.test.{ts,tsx}", "apps/web/src/**/*.test.{ts,tsx}"],
        environment: "node",
    },
});
