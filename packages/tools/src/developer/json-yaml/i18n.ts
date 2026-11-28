import type { LocalizedText } from "@handyweb/core";

export const strings = {
    direction: { fa: "سو", en: "Direction" },
    jsonToYaml: { fa: "JSON به YAML", en: "JSON to YAML" },
    yamlToJson: { fa: "YAML به JSON", en: "YAML to JSON" },
    swap: { fa: "جابه‌جایی ورودی و خروجی", en: "Swap input and output" },
} as const satisfies Record<string, LocalizedText>;
