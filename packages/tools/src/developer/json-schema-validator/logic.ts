import { Validator, type OutputUnit, type Schema, type SchemaDraft } from "@cfworker/json-schema";
import { ToolFailure } from "@handyweb/core/runtime";

/*
 * JSON Schema validation with @cfworker/json-schema, which reads the schema
 * as data and runs no generated code, so it works under a strict CSP. A
 * $ref to another URL is not loaded: the tool makes no network request.
 */

export type Draft = "auto" | SchemaDraft;
export const DRAFTS: readonly Draft[] = ["auto", "2020-12", "2019-09", "7", "4"];

export interface SchemaError {
    /** Where the error is in the data, as a JSON Pointer such as /users/0/name. */
    path: string;
    keyword: string;
    /** Where the rule is in the schema. */
    schemaPath: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: SchemaError[];
    draft: SchemaDraft;
}

function parse(text: string, which: "schema" | "data"): unknown {
    try {
        return JSON.parse(text);
    } catch (error) {
        throw new ToolFailure(
            "invalid-input",
            which === "schema"
                ? { fa: "شِما JSON درستی نیست.", en: "The schema is not valid JSON." }
                : { fa: "داده JSON درستی نیست.", en: "The data is not valid JSON." },
            error instanceof Error ? error.message : undefined,
        );
    }
}

/** Reads the draft from the $schema URL of the schema. */
export function detectDraft(schema: unknown): SchemaDraft {
    const uri =
        typeof schema === "object" && schema !== null
            ? (schema as { $schema?: unknown }).$schema
            : undefined;
    if (typeof uri !== "string") return "2020-12";
    if (uri.includes("2019-09")) return "2019-09";
    if (uri.includes("draft-07")) return "7";
    if (uri.includes("draft-04")) return "4";
    return "2020-12";
}

/** Keywords that only say "a part below did not match". Their child errors say why. */
const CONTAINERS = new Set([
    "properties",
    "items",
    "prefixItems",
    "additionalItems",
    "allOf",
    "$ref",
    "dependentSchemas",
    "patternProperties",
    "unevaluatedProperties",
    "unevaluatedItems",
]);

function pointer(location: string): string {
    const path = location.replace(/^#/, "");
    return path === "" ? "/" : decodeURIComponent(path);
}

export function validateJson(schemaText: string, dataText: string, draft: Draft): ValidationResult {
    const schema = parse(schemaText, "schema");
    const data = parse(dataText, "data");
    if (
        typeof schema !== "boolean" &&
        (typeof schema !== "object" || schema === null || Array.isArray(schema))
    ) {
        throw new ToolFailure(
            "invalid-input",
            { fa: "شِما باید یک شیء JSON باشد.", en: "The schema must be a JSON object." },
            "schema shape",
        );
    }
    const used = draft === "auto" ? detectDraft(schema) : draft;
    let units: OutputUnit[];
    try {
        units = new Validator(schema as Schema | boolean, used, false).validate(data).errors;
    } catch (error) {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: "شِما خوانده نشد. یک $ref به نشانی بیرونی بارگیری نمی‌شود.",
                en: "The schema could not be used. A $ref to another URL is not loaded.",
            },
            error instanceof Error ? error.message : undefined,
        );
    }
    // "additionalProperties: false" also adds a "false" unit for each extra
    // property. The additionalProperties unit already says it.
    const hasAdditional = units.some((unit) =>
        [
            "additionalProperties",
            "unevaluatedProperties",
            "additionalItems",
            "unevaluatedItems",
        ].includes(unit.keyword),
    );
    const errors = units
        .filter((unit) => !(unit.keyword === "false" && hasAdditional))
        .filter(
            (unit) =>
                !CONTAINERS.has(unit.keyword) ||
                !units.some(
                    (other) =>
                        other !== unit &&
                        other.keywordLocation.startsWith(unit.keywordLocation) &&
                        other.keywordLocation !== unit.keywordLocation,
                ),
        )
        .map((unit) => ({
            path: pointer(unit.instanceLocation),
            keyword: unit.keyword,
            schemaPath: unit.keywordLocation.replace(/^#/, "") || "/",
            message: unit.error,
        }));
    return { valid: units.length === 0, errors, draft: used };
}
