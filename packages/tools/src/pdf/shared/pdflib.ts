import type { PDFDocument, PDFObject, PDFRef } from "@cantoo/pdf-lib";
import { sniffBytes } from "@handyweb/core/files";
import { ToolFailure } from "@handyweb/core/runtime";

/** The PDF library is large, so it loads only when a PDF is opened. */
export const pdfLib = () => import("@cantoo/pdf-lib");

const notPdf = () =>
    new ToolFailure("invalid-input", {
        fa: "این فایل PDF نیست یا آسیب دیده است.",
        en: "This file is not a PDF, or it is damaged.",
    });

const encrypted = () =>
    new ToolFailure("unsupported", {
        fa: "این PDF با گذرواژه قفل شده است. نخست قفل آن را بردارید.",
        en: "This PDF is protected with a password. Remove the protection first.",
    });

/** Opens one PDF. Throws a ToolFailure when the file is not a PDF or is encrypted. */
export async function openPdf(bytes: Uint8Array) {
    // Do not trust the file name or the MIME type. A PDF starts with "%PDF-".
    if (sniffBytes(bytes.subarray(0, 16)) !== "pdf") throw notPdf();
    const { PDFDocument } = await pdfLib();
    let document;
    try {
        // Load an encrypted file too, so that the check below can name the problem.
        document = await PDFDocument.load(bytes, {
            updateMetadata: false,
            ignoreEncryption: true,
        });
    } catch {
        throw notPdf();
    }
    if (document.isEncrypted) throw encrypted();
    // A damaged file can load without a page tree. Reading the pages finds it.
    let pages = 0;
    try {
        pages = document.getPageCount();
    } catch {
        throw notPdf();
    }
    if (pages === 0) throw notPdf();
    return document;
}

type Lib = Awaited<ReturnType<typeof pdfLib>>;

/**
 * Deletes every object that the document does not use. pdf-lib keeps all
 * objects that it parsed, so an old information dictionary, an old XMP
 * stream, or an older revision of the file would otherwise stay in the output.
 */
export function removeUnused(lib: Lib, document: PDFDocument): void {
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
