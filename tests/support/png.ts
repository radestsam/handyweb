import { deflateSync } from "node:zlib";

/* Makes PNG files for the image tests, so no binary fixture is kept in Git. */

function crc32(bytes: Buffer): number {
    let crc = ~0;
    for (const byte of bytes) {
        crc ^= byte;
        for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return ~crc >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
}

/** An RGBA PNG with a color gradient: red is x times step, green is y times step. */
export function makePng(width: number, height: number, pixels = true, step = 1): Buffer {
    const header = Buffer.alloc(13);
    header.writeUInt32BE(width, 0);
    header.writeUInt32BE(height, 4);
    header.set([8, 6, 0, 0, 0], 8);
    const rows: Buffer[] = [];
    if (pixels) {
        for (let y = 0; y < height; y++) {
            const row = Buffer.alloc(1 + width * 4);
            for (let x = 0; x < width; x++)
                row.set([(x * step) % 256, (y * step) % 256, 128, 255], 1 + x * 4);
            rows.push(row);
        }
    }
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk("IHDR", header),
        chunk("IDAT", deflateSync(Buffer.concat(rows))),
        chunk("IEND", Buffer.alloc(0)),
    ]);
}
