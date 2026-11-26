import type { ToolLoader } from "@handyweb/core";

/*
 * The UI module of each tool, loaded on demand. Each import() becomes its own
 * chunk, so a tool page loads only its own code.
 */
export const loaders: Readonly<Record<string, ToolLoader>> = {};
