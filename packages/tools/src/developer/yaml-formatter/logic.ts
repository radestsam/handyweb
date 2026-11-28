import { parseAllDocuments, type Document } from "yaml";
import { ToolFailure } from "@handyweb/core/runtime";

export type Action = "format" | "validate";
export type Indent = 2 | 4;

/** Stops a document with many aliases from growing without end (a "billion laughs" file). */
export const MAX_ALIASES = 1000;

export interface YamlOutput {
    text: string;
    documents: number;
}

/**
 * Parses every document of a YAML stream. The first error throws a
 * ToolFailure with its line and column. Only the YAML 1.2 core schema is used,
 * so no tag can run code.
 */
export function parseYaml(text: string): Document.Parsed[] {
    const documents = parseAllDocuments(text, { prettyErrors: true });
    if (!Array.isArray(documents)) return [];
    for (const document of documents) {
        const error = document.errors[0];
        if (error) {
            const position = error.linePos?.[0];
            const where = position
                ? {
                      fa: ` (خط ${position.line}، ستون ${position.col})`,
                      en: ` (line ${position.line}, column ${position.col})`,
                  }
                : { fa: "", en: "" };
            throw new ToolFailure(
                "invalid-input",
                { fa: `YAML درست نیست${where.fa}.`, en: `The YAML is not valid${where.en}.` },
                error.message.split("\n")[0],
            );
        }
    }
    return documents;
}

/** Writes each document again with the chosen indent. Comments stay. */
export function processYaml(text: string, action: Action, indent: Indent): YamlOutput {
    if (text.trim() === "") {
        throw new ToolFailure(
            "invalid-input",
            { fa: "ورودی خالی است.", en: "The input is empty." },
            "empty",
        );
    }
    const documents = parseYaml(text);
    // Reading the values checks the alias limit.
    for (const document of documents) document.toJS({ maxAliasCount: MAX_ALIASES });
    if (action === "validate") return { text: "", documents: documents.length };
    const parts = documents.map((document) => document.toString({ indent, lineWidth: 0 }));
    return { text: parts.join(""), documents: documents.length };
}
