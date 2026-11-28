import { ToolFailure } from "@handyweb/core/runtime";
import type { PDFDocumentProxy } from "pdfjs-dist";

/** One worker for the page. pdf.js sends every document to it. */
let worker: Worker | null = null;

/**
 * Opens a PDF with pdf.js. The library and its worker load only here. pdf.js
 * gets the bytes directly, so it makes no network request: there are no range
 * requests, no font downloads, and no script support.
 */
export async function openWithPdfJs(bytes: Uint8Array): Promise<PDFDocumentProxy> {
    const pdfjs = await import("pdfjs-dist");
    worker ??= new Worker(new URL("./pdf.worker.ts", import.meta.url), { type: "module" });
    pdfjs.GlobalWorkerOptions.workerPort = worker;
    const task = pdfjs.getDocument({
        // pdf.js takes ownership of the buffer, so give it a copy.
        data: bytes.slice(),
        disableAutoFetch: true,
        disableStream: true,
        enableXfa: false,
        stopAtErrors: false,
    });
    try {
        return await task.promise;
    } catch (error) {
        void task.destroy();
        if (error instanceof pdfjs.PasswordException)
            throw new ToolFailure("unsupported", {
                fa: "این PDF با گذرواژه قفل شده است. نخست قفل آن را بردارید.",
                en: "This PDF is protected with a password. Remove the protection first.",
            });
        throw new ToolFailure("invalid-input", {
            fa: "این فایل PDF نیست یا آسیب دیده است.",
            en: "This file is not a PDF, or it is damaged.",
        });
    }
}
