import type { LocalizedText } from "@handyweb/core";

// The other strings live in ../byte-codec/ByteCodecTool.tsx, shared with the hex tool.
export const strings = {
    name: { fa: "دودویی", en: "Binary" },
} as const satisfies Record<string, LocalizedText>;
