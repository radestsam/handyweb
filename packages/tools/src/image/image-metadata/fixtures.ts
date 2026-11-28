/*
 * Test files for the metadata tests, built in code. The pixel data comes from
 * 5 x 3 images made with sips and cwebp; the metadata is added here.
 */

const bytes = (base64: string) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

export const PLAIN_JPEG = bytes(
    "/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAABaADAAQAAAABAAAAAwAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAwAFAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwUDAwMFBgUFBQUGCAYGBgYGCAoICAgICAgKCgoKCgoKCgwMDAwMDA4ODg4ODw8PDw8PDw8PD//bAEMBAgICBAQEBwQEBxALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/dAAQAAf/aAAwDAQACEQMRAD8A+e6KKK/Gz/Sw/9k=",
);
export const PLAIN_PNG = bytes(
    "iVBORw0KGgoAAAANSUhEUgAAAAUAAAADCAYAAABbNsX4AAAAEklEQVR4nGM4YWT0Hx0zEC0IAPv0IIYUdOInAAAAAElFTkSuQmCC",
);
export const PLAIN_WEBP = bytes("UklGRh4AAABXRUJQVlA4TBEAAAAvBIAAAAdQmSJXpv+BiOh/AAA=");

type Value =
    | { type: 2; text: string }
    | { type: 3; values: number[] }
    | { type: 4; values: number[] }
    | { type: 5; values: [number, number][] };

/** Builds big-endian TIFF bytes with IFD0, an EXIF IFD, and a GPS IFD. */
export function buildTiff(
    ifd0: Map<number, Value>,
    exif: Map<number, Value>,
    gps: Map<number, Value>,
): Uint8Array {
    const out: number[] = [0x4d, 0x4d, 0, 42, 0, 0, 0, 8];
    const u16 = (n: number) => [(n >> 8) & 255, n & 255];
    const u32 = (n: number) => [(n >>> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255];
    const size = (v: Value) =>
        v.type === 2
            ? v.text.length + 1
            : v.type === 3
              ? v.values.length * 2
              : v.type === 4
                ? v.values.length * 4
                : v.values.length * 8;
    const data = (v: Value) =>
        v.type === 2
            ? [...new TextEncoder().encode(v.text), 0]
            : v.type === 3
              ? v.values.flatMap(u16)
              : v.type === 4
                ? v.values.flatMap(u32)
                : v.values.flatMap(([a, b]) => [...u32(a), ...u32(b)]);
    const count = (v: Value) => (v.type === 2 ? v.text.length + 1 : v.values.length);
    // Lay out: IFD0, then EXIF IFD, then GPS IFD, each followed by its large values.
    const write = (
        ifd: Map<number, Value>,
        start: number,
        links: Map<number, number>,
    ): number[] => {
        const entries = [...ifd.entries()].sort((a, b) => a[0] - b[0]);
        const all = [
            ...entries.map(([id, v]) => ({ id, v })),
            ...[...links.entries()].map(([id, at]) => ({
                id,
                v: { type: 4, values: [at] } as Value,
            })),
        ];
        all.sort((a, b) => a.id - b.id);
        let extra = start + 2 + all.length * 12 + 4;
        const head: number[] = [...u16(all.length)];
        const tail: number[] = [];
        for (const { id, v } of all) {
            head.push(...u16(id), ...u16(v.type), ...u32(count(v)));
            const d = data(v);
            if (size(v) <= 4) head.push(...d, ...new Array(4 - d.length).fill(0));
            else {
                head.push(...u32(extra));
                tail.push(...d);
                extra += d.length;
            }
        }
        return [...head, 0, 0, 0, 0, ...tail];
    };
    const length = (ifd: Map<number, Value>, links: number) => {
        const values = [...ifd.values()].reduce((sum, v) => sum + (size(v) > 4 ? size(v) : 0), 0);
        return 2 + (ifd.size + links) * 12 + 4 + values;
    };
    const exifAt = 8 + length(ifd0, 2);
    const gpsAt = exifAt + length(exif, 0);
    out.push(
        ...write(
            ifd0,
            8,
            new Map([
                [0x8769, exifAt],
                [0x8825, gpsAt],
            ]),
        ),
    );
    out.push(...write(exif, exifAt, new Map()));
    out.push(...write(gps, gpsAt, new Map()));
    return Uint8Array.from(out);
}

export const SAMPLE_TIFF = buildTiff(
    new Map<number, Value>([
        [0x010f, { type: 2, text: "Canon" }],
        [0x0110, { type: 2, text: "EOS R5" }],
        [0x0112, { type: 3, values: [6] }],
    ]),
    new Map<number, Value>([
        [0x829d, { type: 5, values: [[28, 10]] }],
        [0x8827, { type: 3, values: [200] }],
        [0x9003, { type: 2, text: "2026:03:21 10:30:00" }],
        [0xa431, { type: 2, text: "SN12345" }],
    ]),
    new Map<number, Value>([
        [0x0001, { type: 2, text: "N" }],
        [
            0x0002,
            {
                type: 5,
                values: [
                    [35, 1],
                    [41, 1],
                    [24, 1],
                ],
            },
        ],
        [0x0003, { type: 2, text: "E" }],
        [
            0x0004,
            {
                type: 5,
                values: [
                    [51, 1],
                    [23, 1],
                    [0, 1],
                ],
            },
        ],
    ]),
);

function segment(marker: number, payload: Uint8Array): Uint8Array {
    const out = new Uint8Array(4 + payload.length);
    out.set([0xff, marker, (payload.length + 2) >> 8, (payload.length + 2) & 255]);
    out.set(payload, 4);
    return out;
}

const text = (value: string) => new TextEncoder().encode(value);

export function join(...parts: Uint8Array[]): Uint8Array {
    const out = new Uint8Array(parts.reduce((sum, p) => sum + p.length, 0));
    let at = 0;
    for (const part of parts) {
        out.set(part, at);
        at += part.length;
    }
    return out;
}

/** The plain JPEG with EXIF (orientation 6, GPS, serial), XMP, ICC, and a comment. */
export const RICH_JPEG = join(
    PLAIN_JPEG.subarray(0, 2),
    segment(0xe1, join(text("Exif\0\0"), SAMPLE_TIFF)),
    segment(0xe1, text("http://ns.adobe.com/xap/1.0/\0<x:xmpmeta>secret</x:xmpmeta>")),
    segment(0xe2, text("ICC_PROFILE\0\x01\x01fake-profile")),
    segment(0xfe, text("secret comment")),
    PLAIN_JPEG.subarray(2),
);

function crc32(data: Uint8Array): number {
    let crc = ~0;
    for (const byte of data) {
        crc ^= byte;
        for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return ~crc >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
    const body = join(text(type), data);
    const out = new Uint8Array(12 + data.length);
    new DataView(out.buffer).setUint32(0, data.length);
    out.set(body, 4);
    new DataView(out.buffer).setUint32(8 + data.length, crc32(body));
    return out;
}

/** The plain PNG with a text chunk, an eXIf chunk, and a time chunk after IHDR. */
export const RICH_PNG = join(
    PLAIN_PNG.subarray(0, 33),
    pngChunk("tEXt", text("Author\0Sara")),
    pngChunk("eXIf", SAMPLE_TIFF),
    pngChunk("tIME", Uint8Array.from([7, 234, 3, 21, 10, 30, 0])),
    PLAIN_PNG.subarray(33),
);

/** A WebP with VP8X (EXIF and XMP flags), the image chunk, and EXIF and XMP chunks. */
export function richWebp(): Uint8Array {
    const image = PLAIN_WEBP.subarray(12);
    const chunk = (type: string, data: Uint8Array) => {
        const out = new Uint8Array(8 + data.length + (data.length % 2));
        out.set(text(type));
        new DataView(out.buffer).setUint32(4, data.length, true);
        out.set(data, 8);
        return out;
    };
    const vp8x = new Uint8Array(10);
    vp8x[0] = 0x08 | 0x04;
    // Canvas 5 x 3, stored minus one.
    vp8x.set([4, 0, 0, 2, 0, 0], 4);
    const body = join(
        text("WEBP"),
        chunk("VP8X", vp8x),
        image,
        chunk("EXIF", SAMPLE_TIFF),
        chunk("XMP ", text("<x:xmpmeta/>")),
    );
    const head = new Uint8Array(8);
    head.set(text("RIFF"));
    new DataView(head.buffer).setUint32(4, body.length, true);
    return join(head, body);
}
