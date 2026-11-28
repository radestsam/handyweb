import { stringify } from "yaml";
import { ToolFailure } from "@handyweb/core/runtime";
import { MAX_ALIASES, parseYaml } from "../yaml-formatter/logic";

export type Direction = "json-to-yaml" | "yaml-to-json";

function empty(): ToolFailure {
    return new ToolFailure(
        "invalid-input",
        { fa: "ورودی خالی است.", en: "The input is empty." },
        "empty",
    );
}

export function jsonToYaml(text: string): string {
    if (text.trim() === "") throw empty();
    let value: unknown;
    try {
        value = JSON.parse(text);
    } catch (error) {
        throw new ToolFailure(
            "invalid-input",
            { fa: "JSON درست نیست.", en: "The JSON is not valid." },
            error instanceof Error ? error.message : undefined,
        );
    }
    return stringify(value, { indent: 2, lineWidth: 0 });
}

/** One document becomes one JSON value. Several documents become a JSON array. */
export function yamlToJson(text: string, indent: number): string {
    if (text.trim() === "") throw empty();
    const values = parseYaml(text).map((document) => document.toJS({ maxAliasCount: MAX_ALIASES }));
    const value: unknown = values.length === 1 ? values[0] : values;
    return JSON.stringify(value, null, indent);
}
