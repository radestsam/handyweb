/*
 * Finds codes in a picture. The browser's BarcodeDetector (Chrome, Edge, and
 * Android) reads QR codes and barcodes. Where it does not exist (Firefox and
 * Safari), jsQR reads QR codes only. jsQR loads only when it is needed.
 */

export interface Found {
    value: string;
    format: string;
}

interface DetectorLike {
    detect(source: ImageBitmapSource): Promise<Array<{ rawValue: string; format: string }>>;
}

type DetectorClass = {
    new (options?: { formats: string[] }): DetectorLike;
    getSupportedFormats(): Promise<string[]>;
};

let detector: Promise<DetectorLike | null> | null = null;

/** The browser detector, or null when the browser has none. */
export function browserDetector(): Promise<DetectorLike | null> {
    if (!detector) {
        const Detector = (globalThis as unknown as { BarcodeDetector?: DetectorClass })
            .BarcodeDetector;
        detector = Detector
            ? Detector.getSupportedFormats()
                  .then((formats) => (formats.length > 0 ? new Detector({ formats }) : null))
                  .catch(() => null)
            : Promise.resolve(null);
    }
    return detector;
}

/** Reads QR codes from raw pixels with jsQR. */
export async function decodeQrPixels(
    data: Uint8ClampedArray,
    width: number,
    height: number,
): Promise<Found | null> {
    const { default: jsQR } = await import("jsqr");
    const result = jsQR(data, width, height, { inversionAttempts: "attemptBoth" });
    return result ? { value: result.data, format: "qr_code" } : null;
}

/** Finds codes in a canvas: the browser detector first, then jsQR. */
export async function decodeCanvas(canvas: HTMLCanvasElement): Promise<Found[]> {
    const native = await browserDetector();
    if (native) {
        const found = await native.detect(canvas);
        if (found.length > 0)
            return found.map((code) => ({ value: code.rawValue, format: code.format }));
    }
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return [];
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const qr = await decodeQrPixels(pixels.data, canvas.width, canvas.height);
    return qr ? [qr] : [];
}
