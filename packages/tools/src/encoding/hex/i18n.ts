import type { LocalizedText } from "@handyweb/core";

// The other strings live in ../byte-codec/ByteCodecTool.tsx, shared with the binary tool.
export const strings = {
    name: { fa: "هگز", en: "Hex" },
} as const satisfies Record<string, LocalizedText>;
