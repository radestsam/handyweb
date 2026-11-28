import { safeFileName, type ZipEntry } from "@handyweb/core/files";
import { ToolFailure } from "@handyweb/core/runtime";
import { openPdf, pdfLib } from "../shared/pdflib";

/** The largest PDF file, in bytes. */
export const MAX_FILE_BYTES = 100_000_000;
/** The largest number of pages that the tool shows and edits. */
export const MAX_PAGES = 300;

export type Rotation = 0 | 90 | 180 | 270;

/** One page of the result: which source page it is, its added turn, and whether it is selected. */
export interface PageState {
    /** The 0-based index of the page in the source PDF. */
    source: number;
    /** The turn that the tool adds, clockwise, on top of the turn the page has. */
    rotation: Rotation;
    selected: boolean;
}

export function initialPages(count: number): PageState[] {
    return Array.from({ length: count }, (_, source) => ({
        source,
        rotation: 0,
        selected: false,
    }));
}

/** Turns one page by a quarter, clockwise (1) or counterclockwise (-1). */
export function rotatePage(pages: readonly PageState[], index: number, step: 1 | -1): PageState[] {
    return pages.map((page, i) =>
        i === index
            ? { ...page, rotation: ((page.rotation + 90 * step + 360) % 360) as Rotation }
            : page,
    );
}

/** Turns the selected pages, or all pages when none is selected. */
export function rotateMany(pages: readonly PageState[], step: 1 | -1): PageState[] {
    const any = pages.some((page) => page.selected);
    return pages.map((page) =>
        !any || page.selected
            ? { ...page, rotation: ((page.rotation + 90 * step + 360) % 360) as Rotation }
            : page,
    );
}

export function toggleSelected(pages: readonly PageState[], index: number): PageState[] {
    return pages.map((page, i) => (i === index ? { ...page, selected: !page.selected } : page));
}

export function selectAll(pages: readonly PageState[], selected: boolean): PageState[] {
    return pages.map((page) => ({ ...page, selected }));
}

const nothing = () =>
    new ToolFailure("invalid-input", {
        fa: "دست‌کم یک برگه باید بماند.",
        en: "At least one page must stay.",
    });

type Lib = Awaited<ReturnType<typeof pdfLib>>;
type Source = Awaited<ReturnType<typeof openPdf>>;

async function build(
    lib: Lib,
    source: Source,
    pages: readonly Pick<PageState, "source" | "rotation">[],
): Promise<Uint8Array> {
    const output = await lib.PDFDocument.create({ updateMetadata: false });
    const copied = await output.copyPages(
        source,
        pages.map((page) => page.source),
    );
    for (const [index, page] of copied.entries()) {
        const added = pages[index]?.rotation ?? 0;
        page.setRotation(lib.degrees((page.getRotation().angle + added) % 360));
        output.addPage(page);
    }
    return output.save();
}

/**
 * Makes a new PDF from the pages, in the order of the list, with their turns.
 * The new file gets no metadata from the source.
 */
export async function buildPdf(
    bytes: Uint8Array,
    pages: readonly Pick<PageState, "source" | "rotation">[],
): Promise<Uint8Array> {
    if (pages.length === 0) throw nothing();
    return build(await pdfLib(), await openPdf(bytes), pages);
}

/** Makes one PDF for each page. The file names follow the order of the list. */
export async function splitPdf(
    bytes: Uint8Array,
    pages: readonly Pick<PageState, "source" | "rotation">[],
    sourceName: string,
    onProgress?: (done: number) => void,
): Promise<ZipEntry[]> {
    if (pages.length === 0) throw nothing();
    const lib = await pdfLib();
    const source = await openPdf(bytes);
    const digits = String(pages.length).length;
    const base = sourceName.replace(/\.pdf$/i, "") || "document";
    const entries: ZipEntry[] = [];
    for (const [index, page] of pages.entries()) {
        entries.push({
            name: safeFileName(`${base}-page-${String(index + 1).padStart(digits, "0")}.pdf`),
            data: await build(lib, source, [page]),
        });
        onProgress?.(index + 1);
    }
    return entries;
}

/** True when the list is the source as it is: every page, in order, with no turn. */
export function unchanged(pages: readonly PageState[], count: number): boolean {
    return (
        pages.length === count &&
        pages.every((page, index) => page.source === index && page.rotation === 0)
    );
}

export function outputName(source: string, suffix: "edited" | "selected" | "pages"): string {
    const base = source.replace(/\.pdf$/i, "") || "document";
    return safeFileName(`${base}-${suffix}.${suffix === "pages" ? "zip" : "pdf"}`);
}
