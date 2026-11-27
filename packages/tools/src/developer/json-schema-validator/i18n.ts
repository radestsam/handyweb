import type { LocalizedText } from "@handyweb/core";

export const strings = {
    draft: { fa: "نسخه JSON Schema", en: "JSON Schema draft" },
    auto: { fa: "خودکار ($schema)", en: "Auto ($schema)" },
    data: { fa: "داده JSON", en: "JSON data" },
    schema: { fa: "شِما (JSON Schema)", en: "Schema (JSON Schema)" },
    valid: { fa: "داده با شِما جور است.", en: "The data matches the schema." },
    invalid: { fa: "خطا", en: "errors" },
    path: { fa: "مسیر", en: "Path" },
    emptySchema: {
        fa: "شِما خالی است، پس هر داده‌ای پذیرفته می‌شود.",
        en: "The schema is empty, so any data matches.",
    },
} as const satisfies Record<string, LocalizedText>;
