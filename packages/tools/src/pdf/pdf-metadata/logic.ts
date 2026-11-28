import { safeFileName } from "@handyweb/core/files";
import type { PDFDocument, PDFObject, PDFRef } from "@cantoo/pdf-lib";
import { openPdf, pdfLib } from "../shared/pdflib";

/** The largest PDF file, in bytes. */
export const MAX_FILE_BYTES = 100_000_000;

/** The text fields of the document information dictionary that the tool edits. */
export const TEXT_FIELDS = [
    "Title",
    "Author",
    "Subject",
    "Keywords",
    "Creator",
    "Producer",
] as const;
export type TextField = (typeof TEXT_FIELDS)[number];

export interface PdfMetadata {
    text: Record<TextField, string>;
    created: Date | undefined;
    modified: Date | undefined;
    /** Other keys in the information dictionary, such as custom fields. */
    otherKeys: string[];
    /** True when the file also has an XMP metadata stream. */
    hasXmp: boolean;
    pages: number;
}

type Lib = Awaited<ReturnType<typeof pdfLib>>;

function infoDict(lib: Lib, document: PDFDocument) {
    const info = document.context.trailerInfo.Info;
    const value = info instanceof lib.PDFRef ? document.context.lookup(info) : info;
    return value instanceof lib.PDFDict ? value : undefined;
}

function readText(lib: Lib, value: PDFObject | undefined): string {
    if (value instanceof lib.PDFString || value instanceof lib.PDFHexString)
        return value.decodeText();
    return "";
}

function readDate(lib: Lib, value: PDFObject | undefined): Date | undefined {
    if (!(value instanceof lib.PDFString || value instanceof lib.PDFHexString)) return undefined;
    try {
        const date = value.decodeDate();
        return Number.isNaN(date.getTime()) ? undefined : date;
    } catch {
        return undefined;
    }
}

/** Reads the metadata of a PDF. */
export async function readMetadata(bytes: Uint8Array): Promise<PdfMetadata> {
    const lib = await pdfLib();
    const document = await openPdf(bytes);
    const info = infoDict(lib, document);
    const get = (key: string) => {
        const value = info?.get(lib.PDFName.of(key));
        return value instanceof lib.PDFRef ? document.context.lookup(value) : value;
    };
    const known = new Set<string>([...TEXT_FIELDS, "CreationDate", "ModDate"]);
    return {
        text: Object.fromEntries(
            TEXT_FIELDS.map((key) => [key, readText(lib, get(key))]),
        ) as Record<TextField, string>,
        created: readDate(lib, get("CreationDate")),
        modified: readDate(lib, get("ModDate")),
        otherKeys: (info?.keys() ?? [])
            .map((key) => key.decodeText())
            .filter((key) => !known.has(key)),
        hasXmp: document.catalog.has(lib.PDFName.of("Metadata")),
        pages: document.getPageCount(),
    };
}

/**
 * Deletes every object that the document does not use. pdf-lib keeps all
 * objects that it parsed, so an old information dictionary, an old XMP
 * stream, or an older revision of the file would otherwise stay in the output.
 */
function removeUnused(lib: Lib, document: PDFDocument): void {
    const { context } = document;
    const used = new Set<string>();
    const stack: PDFObject[] = [];
    const roots = [context.trailerInfo.Root, context.trailerInfo.Info];
    for (const root of roots) if (root) stack.push(root);
    while (stack.length > 0) {
        const object = stack.pop() as PDFObject;
        if (object instanceof lib.PDFRef) {
            const key = object.toString();
            if (used.has(key)) continue;
            used.add(key);
            const target = context.lookup(object);
            if (target) stack.push(target);
        } else if (object instanceof lib.PDFDict) {
            for (const [, value] of object.entries()) stack.push(value);
        } else if (object instanceof lib.PDFArray) {
            stack.push(...object.asArray());
        } else if (object instanceof lib.PDFStream) {
            stack.push(object.dict);
        }
    }
    for (const [ref] of context.enumerateIndirectObjects())
        if (!used.has(ref.toString())) context.delete(ref as PDFRef);
}

/**
 * Writes a PDF with new metadata. An empty field is left out. The file gets a
 * new information dictionary with only these fields, so custom fields are
 * removed. The XMP metadata stream is removed too, because it would show the
 * old values in some readers. The pages do not change.
 */
export async function writeMetadata(
    bytes: Uint8Array,
    text: Record<TextField, string>,
    dates: { created: Date | undefined; modified: Date | undefined },
): Promise<Uint8Array> {
    const lib = await pdfLib();
    const document = await openPdf(bytes);
    const { context } = document;
    const info = context.obj({});
    for (const key of TEXT_FIELDS) {
        const value = text[key].trim();
        if (value !== "") info.set(lib.PDFName.of(key), lib.PDFHexString.fromText(value));
    }
    if (dates.created)
        info.set(lib.PDFName.of("CreationDate"), lib.PDFString.fromDate(dates.created));
    if (dates.modified) info.set(lib.PDFName.of("ModDate"), lib.PDFString.fromDate(dates.modified));
    if (info.keys().length > 0) context.trailerInfo.Info = context.register(info);
    else delete context.trailerInfo.Info;
    document.catalog.delete(lib.PDFName.of("Metadata"));
    removeUnused(lib, document);
    return document.save();
}

/** An empty set of text fields, for "remove all". */
export function emptyText(): Record<TextField, string> {
    return Object.fromEntries(TEXT_FIELDS.map((key) => [key, ""])) as Record<TextField, string>;
}

/** The name of the output file. */
export function outputName(source: string): string {
    const base = source.replace(/\.pdf$/i, "") || "document";
    return safeFileName(`${base}-metadata.pdf`);
}
