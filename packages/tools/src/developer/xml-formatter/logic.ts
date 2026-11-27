import { ToolFailure } from "@handyweb/core/runtime";

export type Action = "format" | "minify" | "validate";
export type Indent = "2" | "4" | "tab";

export interface XmlInput {
    text: string;
    action: Action;
    indent: Indent;
}

export interface XmlOutput {
    text: string;
    /** The name of the root element. */
    root: string;
    /** The number of elements in the document. */
    elements: number;
}

const INDENT: Record<Indent, string> = { "2": "  ", "4": "    ", tab: "\t" };

/** Where the parser of the browser found the first error. */
export interface ParseError {
    line: number | null;
    column: number | null;
    /** The message of the browser, in the browser language. */
    message: string;
}

/**
 * Reads the error of a <parsererror> element. Each engine writes it in its own
 * form:
 * - Chromium and WebKit (libxml2): "error on line 1 at column 10: Opening and ending tag mismatch"
 * - Firefox (expat): "XML Parsing Error: mismatched tag ... Line Number 1, Column 10:"
 * - jsdom (saxes), in the unit tests: "1:10: unexpected close tag."
 */
export function readParseError(text: string): ParseError {
    const chromium = /line (\d+) at column (\d+):\s*([^\n]*)/i.exec(text);
    if (chromium) {
        return {
            line: Number(chromium[1]),
            column: Number(chromium[2]),
            message: chromium[3]?.trim() ?? "",
        };
    }
    const firefox = /Line Number (\d+), Column (\d+)/i.exec(text);
    if (firefox) {
        const message = /XML Parsing Error:\s*([^\n]*)/i.exec(text)?.[1]?.trim() ?? "";
        return { line: Number(firefox[1]), column: Number(firefox[2]), message };
    }
    const saxes = /^(\d+):(\d+):\s*([^\n]*)/.exec(text.trim());
    if (saxes) {
        return {
            line: Number(saxes[1]),
            column: Number(saxes[2]),
            message: saxes[3]?.trim() ?? "",
        };
    }
    return { line: null, column: null, message: text.trim().split("\n")[0] ?? "" };
}

function notWellFormed(error: ParseError): ToolFailure {
    const where =
        error.line === null
            ? { fa: "", en: "" }
            : {
                  fa: ` (خط ${error.line}، ستون ${error.column})`,
                  en: ` (line ${error.line}, column ${error.column})`,
              };
    return new ToolFailure(
        "invalid-input",
        {
            fa: `XML درست ساخته نشده است${where.fa}.`,
            en: `The XML is not well-formed${where.en}.`,
        },
        error.message,
    );
}

/** The XML declaration is not a node of the DOM, so it is kept from the text. */
const DECLARATION = /^\uFEFF?\s*(<\?xml\s[^?]*\?>)/;

/**
 * Checks well-formedness with the XML parser of the browser (DOMParser). It
 * does not check a DTD or a schema. The parser loads no external entity and
 * no file.
 */
export function parseXml(text: string): Document {
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const error = doc.getElementsByTagName("parsererror")[0];
    if (error) throw notWellFormed(readParseError(error.textContent ?? ""));
    return doc;
}

function escapeText(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttribute(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;")
        .replace(/\t/g, "&#9;")
        .replace(/\n/g, "&#10;")
        .replace(/\r/g, "&#13;");
}

function openTag(element: Element): string {
    let tag = `<${element.nodeName}`;
    for (const attribute of Array.from(element.attributes)) {
        tag += ` ${attribute.name}="${escapeAttribute(attribute.value)}"`;
    }
    return tag;
}

const isBlank = (node: Node) =>
    node.nodeType === Node.TEXT_NODE && /^\s*$/.test(node.nodeValue ?? "");

/** Writes a node with no change to its text. Used inside mixed content. */
function inline(node: Node): string {
    switch (node.nodeType) {
        case Node.ELEMENT_NODE: {
            const element = node as Element;
            const children = Array.from(element.childNodes);
            if (children.length === 0) return `${openTag(element)}/>`;
            return `${openTag(element)}>${children.map(inline).join("")}</${element.nodeName}>`;
        }
        case Node.TEXT_NODE:
            return escapeText(node.nodeValue ?? "");
        case Node.CDATA_SECTION_NODE:
            return `<![CDATA[${node.nodeValue ?? ""}]]>`;
        case Node.COMMENT_NODE:
            return `<!--${node.nodeValue ?? ""}-->`;
        case Node.PROCESSING_INSTRUCTION_NODE: {
            const pi = node as ProcessingInstruction;
            return `<?${pi.target}${pi.data ? ` ${pi.data}` : ""}?>`;
        }
        case Node.DOCUMENT_TYPE_NODE:
            return new XMLSerializer().serializeToString(node);
        default:
            return "";
    }
}

/**
 * Writes a node on its own lines. An element whose children are only
 * elements, comments, and processing instructions gets one child per line.
 * An element with text or CDATA (mixed content) is written on one line with
 * its text unchanged, because whitespace in text can be meaningful.
 */
function block(node: Node, depth: number, unit: string, lines: string[]): void {
    const pad = unit.repeat(depth);
    if (node.nodeType !== Node.ELEMENT_NODE) {
        if (!isBlank(node)) lines.push(pad + inline(node));
        return;
    }
    const element = node as Element;
    const children = Array.from(element.childNodes).filter((child) => !isBlank(child));
    const mixed = children.some(
        (child) => child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE,
    );
    if (children.length === 0) {
        lines.push(`${pad}${openTag(element)}/>`);
    } else if (mixed) {
        lines.push(pad + inline(element));
    } else {
        lines.push(`${pad}${openTag(element)}>`);
        for (const child of children) block(child, depth + 1, unit, lines);
        lines.push(`${pad}</${element.nodeName}>`);
    }
}

/** Writes a node without the whitespace between elements. Mixed content stays unchanged. */
function compact(node: Node): string {
    if (node.nodeType !== Node.ELEMENT_NODE) return isBlank(node) ? "" : inline(node);
    const element = node as Element;
    const children = Array.from(element.childNodes).filter((child) => !isBlank(child));
    const mixed = children.some(
        (child) => child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE,
    );
    if (children.length === 0) return `${openTag(element)}/>`;
    if (mixed) return inline(element);
    return `${openTag(element)}>${children.map(compact).join("")}</${element.nodeName}>`;
}

export function processXml({ text, action, indent }: XmlInput): XmlOutput {
    if (text.trim() === "") {
        throw new ToolFailure("invalid-input", {
            fa: "ورودی خالی است.",
            en: "The input is empty.",
        });
    }
    const doc = parseXml(text);
    const root = doc.documentElement;
    const summary = { root: root.nodeName, elements: doc.getElementsByTagName("*").length };
    if (action === "validate") return { text: "", ...summary };

    const declaration = DECLARATION.exec(text)?.[1];
    const nodes = Array.from(doc.childNodes);
    if (action === "minify") {
        return { text: (declaration ?? "") + nodes.map(compact).join(""), ...summary };
    }
    const lines: string[] = declaration ? [declaration] : [];
    for (const node of nodes) block(node, 0, INDENT[indent], lines);
    return { text: lines.join("\n") + "\n", ...summary };
}
