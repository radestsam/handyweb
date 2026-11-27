/*
 * A small DER reader (ITU-T X.690), enough to read X.509 certificates and
 * PKCS #10 certificate requests. It reads definite lengths only, as DER
 * requires.
 */

export interface Node {
    /** The first identifier byte: class, constructed bit, and tag number. */
    tag: number;
    /** Where the content starts and ends in the input. */
    start: number;
    end: number;
    /** The whole element, from the tag byte to the end. */
    headerStart: number;
    children: Node[];
}

export class DerError extends Error {}

export function parseDer(bytes: Uint8Array, offset = 0, end = bytes.length): Node {
    if (offset + 2 > end) throw new DerError("truncated");
    const tag = bytes[offset] as number;
    if ((tag & 0x1f) === 0x1f) throw new DerError("long tag");
    let length = bytes[offset + 1] as number;
    let start = offset + 2;
    if (length & 0x80) {
        const count = length & 0x7f;
        if (count === 0 || count > 4) throw new DerError("length");
        length = 0;
        for (let i = 0; i < count; i++) length = length * 256 + (bytes[start + i] as number);
        start += count;
    }
    const stop = start + length;
    if (stop > end) throw new DerError("truncated");
    const children: Node[] = [];
    // Constructed types, and BIT STRING / OCTET STRING that hold DER inside.
    if (tag & 0x20) {
        for (let at = start; at < stop;) {
            const child = parseDer(bytes, at, stop);
            children.push(child);
            at = child.end;
        }
    }
    return { tag, start, end: stop, headerStart: offset, children };
}

/** Parses DER that is wrapped in an OCTET STRING or a BIT STRING, if it is DER. */
export function inner(bytes: Uint8Array, node: Node): Node | null {
    const start = node.tag === 0x03 ? node.start + 1 : node.start;
    try {
        const child = parseDer(bytes, start, node.end);
        return child.end === node.end ? child : null;
    } catch {
        return null;
    }
}

export function oid(bytes: Uint8Array, node: Node): string {
    const parts: number[] = [];
    let value = 0;
    for (let i = node.start; i < node.end; i++) {
        const byte = bytes[i] as number;
        value = value * 128 + (byte & 0x7f);
        if (!(byte & 0x80)) {
            if (parts.length === 0)
                parts.push(
                    value < 80 ? Math.floor(value / 40) : 2,
                    value < 80 ? value % 40 : value - 80,
                );
            else parts.push(value);
            value = 0;
        }
    }
    return parts.join(".");
}

export function text(bytes: Uint8Array, node: Node): string {
    const content = bytes.slice(node.start, node.end);
    // BMPString is UTF-16 big-endian; the other string types are UTF-8 or ASCII.
    if (node.tag === 0x1e) {
        let out = "";
        for (let i = 0; i + 1 < content.length; i += 2)
            out += String.fromCharCode(((content[i] as number) << 8) | (content[i + 1] as number));
        return out;
    }
    return new TextDecoder().decode(content);
}

/** UTCTime (YYMMDDHHMMSSZ) or GeneralizedTime (YYYYMMDDHHMMSSZ). */
export function time(bytes: Uint8Array, node: Node): Date {
    const value = text(bytes, node);
    const m =
        node.tag === 0x17
            ? /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/.exec(value)
            : /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/.exec(value);
    if (!m) throw new DerError("time");
    let year = Number(m[1]);
    if (node.tag === 0x17) year += year < 50 ? 2000 : 1900;
    return new Date(
        Date.UTC(
            year,
            Number(m[2]) - 1,
            Number(m[3]),
            Number(m[4]),
            Number(m[5]),
            Number(m[6] ?? 0),
        ),
    );
}

export function hex(bytes: Uint8Array, start: number, end: number, separator = ":"): string {
    return Array.from(bytes.slice(start, end), (byte) =>
        byte.toString(16).padStart(2, "0").toUpperCase(),
    ).join(separator);
}
