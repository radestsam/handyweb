import { safeFileName } from "@handyweb/core/files";
import type { PDFNumber, PDFObject, PDFRawStream } from "@cantoo/pdf-lib";
import { openPdf, pdfLib, removeUnused } from "../shared/pdflib";

/** The largest PDF file, in bytes. */
export const MAX_FILE_BYTES = 200_000_000;

export type Level = "light" | "medium" | "strong";

/** JPEG quality and the longest image side for each level. */
export const LEVELS: Record<Level, { quality: number; maxSide: number }> = {
    light: { quality: 0.8, maxSide: 2500 },
    medium: { quality: 0.65, maxSide: 1800 },
    strong: { quality: 0.5, maxSide: 1200 },
};

/** A new image is used only when it is at least this much smaller. */
const MIN_SAVING = 0.1;
/** Images smaller than this are left as they are. */
const MIN_IMAGE_BYTES = 20_000;

/** A JPEG image of the PDF that the browser can decode and encode again. */
export interface JpegImage {
    bytes: Uint8Array;
    width: number;
    height: number;
    /** 1 for gray, 3 for color. */
    components: 1 | 3;
}

/** Encodes a JPEG again. Returns null when the browser cannot do it. */
export type Recompress = (
    image: JpegImage,
    target: { quality: number; maxSide: number },
) => Promise<{ bytes: Uint8Array; width: number; height: number } | null>;

export interface CompressResult {
    bytes: Uint8Array;
    imagesFound: number;
    imagesChanged: number;
}

type Lib = Awaited<ReturnType<typeof pdfLib>>;

/** The number of color components of a color space that the tool can handle, or null. */
function components(
    lib: Lib,
    value: PDFObject | undefined,
    lookup: (o: PDFObject) => PDFObject | undefined,
): 1 | 3 | null {
    const space = value instanceof lib.PDFRef ? lookup(value) : value;
    if (space === lib.PDFName.of("DeviceRGB")) return 3;
    if (space === lib.PDFName.of("DeviceGray")) return 1;
    if (space instanceof lib.PDFArray && space.get(0) === lib.PDFName.of("ICCBased")) {
        const stream = lookup(space.get(1));
        if (stream instanceof lib.PDFStream) {
            const n = stream.dict.get(lib.PDFName.of("N"));
            if (n instanceof lib.PDFNumber && (n.asNumber() === 1 || n.asNumber() === 3))
                return n.asNumber() as 1 | 3;
        }
    }
    return null;
}

/**
 * Makes a PDF smaller. It always writes the file again with object streams
 * and without unused objects. Then each large JPEG image in RGB or gray is
 * encoded again with `recompress`, and the new image is used only when it is
 * at least 10% smaller. CMYK images, images with a Decode array, and images
 * with other filters do not change. Text and vector graphics do not change.
 */
export async function compressPdf(
    bytes: Uint8Array,
    level: Level,
    recompress: Recompress,
    onProgress?: (done: number, total: number) => void,
): Promise<CompressResult> {
    const lib = await pdfLib();
    const document = await openPdf(bytes);
    const { context } = document;
    removeUnused(lib, document);
    const lookup = (object: PDFObject) =>
        object instanceof lib.PDFRef ? context.lookup(object) : object;
    const name = (key: string) => lib.PDFName.of(key);

    const images = context.enumerateIndirectObjects().filter(([, object]) => {
        if (!(object instanceof lib.PDFRawStream)) return false;
        const dict = object.dict;
        return (
            dict.get(name("Subtype")) === name("Image") &&
            dict.get(name("Filter")) === name("DCTDecode") &&
            !dict.has(name("Decode")) &&
            !dict.has(name("ImageMask")) &&
            dict.get(name("BitsPerComponent")) instanceof lib.PDFNumber &&
            (dict.get(name("BitsPerComponent")) as PDFNumber).asNumber() === 8
        );
    });

    let changed = 0;
    for (const [index, [ref, object]] of images.entries()) {
        const stream = object as PDFRawStream;
        const dict = stream.dict;
        const space = components(lib, dict.get(name("ColorSpace")), lookup);
        const width = dict.get(name("Width"));
        const height = dict.get(name("Height"));
        if (
            space !== null &&
            width instanceof lib.PDFNumber &&
            height instanceof lib.PDFNumber &&
            stream.contents.length >= MIN_IMAGE_BYTES
        ) {
            const result = await recompress(
                {
                    bytes: stream.contents,
                    width: width.asNumber(),
                    height: height.asNumber(),
                    components: space,
                },
                LEVELS[level],
            );
            if (result && result.bytes.length <= stream.contents.length * (1 - MIN_SAVING)) {
                const next = dict.clone(context);
                next.delete(name("Length"));
                next.delete(name("DecodeParms"));
                next.set(name("Width"), lib.PDFNumber.of(result.width));
                next.set(name("Height"), lib.PDFNumber.of(result.height));
                // The browser writes color JPEGs. A gray image becomes RGB.
                if (space === 1) next.set(name("ColorSpace"), name("DeviceRGB"));
                context.assign(ref, lib.PDFRawStream.of(next, result.bytes));
                changed++;
            }
        }
        onProgress?.(index + 1, images.length);
    }
    const output = await document.save({ useObjectStreams: true });
    return { bytes: output, imagesFound: images.length, imagesChanged: changed };
}

/** The saving in percent, rounded toward zero. A negative value means the file got larger. */
export function saving(before: number, after: number): number {
    return before > 0 ? Math.trunc((1 - after / before) * 100) : 0;
}

/** The name of the output file. */
export function compressedName(source: string): string {
    const base = source.replace(/\.pdf$/i, "") || "document";
    return safeFileName(`${base}-compressed.pdf`);
}
