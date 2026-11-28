import { deflateSync } from "node:zlib";
import type { QrMatrix } from "../../packages/tools/src/qr/qr-generator/logic";

/* Draws a QR matrix as a black-and-white PNG, 6 pixels per module. */

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

export function qrPng(matrix: QrMatrix, scale = 6): Buffer {
    const size = matrix.size * scale;
    const header = Buffer.alloc(13);
    header.writeUInt32BE(size, 0);
    header.writeUInt32BE(size, 4);
    // 8-bit grayscale.
    header.set([8, 0, 0, 0, 0], 8);
    const rows: Buffer[] = [];
    for (let y = 0; y < size; y++) {
        const row = Buffer.alloc(1 + size, 255);
        row[0] = 0;
        for (let x = 0; x < size; x++)
            if (matrix.modules[Math.floor(y / scale)]?.[Math.floor(x / scale)]) row[1 + x] = 0;
        rows.push(row);
    }
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk("IHDR", header),
        chunk("IDAT", deflateSync(Buffer.concat(rows))),
        chunk("IEND", Buffer.alloc(0)),
    ]);
}
