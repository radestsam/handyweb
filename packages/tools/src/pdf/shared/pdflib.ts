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
