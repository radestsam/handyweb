import { SIGNATURES, type Signature } from "./signatures";

/** The number of first bytes the detector reads. */
export const HEADER_BYTES = 512;

function matches(bytes: Uint8Array, signature: Signature): boolean {
    const offset = signature.offset ?? 0;
    const pairs = signature.hex.match(/../g) ?? [];
    return pairs.every((pair, i) => {
        if (pair === "??") return true;
        const byte = bytes[offset + i];
        if (byte === undefined) return false;
        if (pair.includes("?")) {
            const high = pair[0] === "?" ? null : parseInt(pair[0] as string, 16);
            const low = pair[1] === "?" ? null : parseInt(pair[1] as string, 16);
            return (high === null || byte >> 4 === high) && (low === null || (byte & 15) === low);
        }
        return byte === parseInt(pair, 16);
    });
}

export interface Detection {
    /** Every signature that matches, the longest (most specific) first. */
    matches: Signature[];
    /** The extension of the file name, in lower case, without the dot. */
    extension: string;
    /** The extension does not belong to the detected type. */
    mismatch: boolean;
    /** The first bytes as hex, for display. */
    hex: string;
    /** The bytes look like plain text (no control bytes apart from whitespace). */
    looksLikeText: boolean;
}

export function detect(bytes: Uint8Array, fileName: string): Detection {
    const found = SIGNATURES.filter((signature) => matches(bytes, signature)).sort(
        (a, b) => b.hex.length + (b.offset ?? 0) - (a.hex.length + (a.offset ?? 0)),
    );
    const dot = fileName.lastIndexOf(".");
    const extension = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : "";
    const first = found[0];
    const mismatch =
        first !== undefined && extension !== "" && !first.extensions.includes(extension);
    const head = bytes.slice(0, Math.min(bytes.length, 512));
    const looksLikeText =
        head.length > 0 &&
        head.every(
            (byte) =>
                byte >= 0x20 || byte === 0x09 || byte === 0x0a || byte === 0x0d || byte >= 0x80,
        );
    const hex = Array.from(bytes.slice(0, 32), (byte) => byte.toString(16).padStart(2, "0")).join(
        " ",
    );
    return { matches: found, extension, mismatch, hex, looksLikeText };
}
