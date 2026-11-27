import type { LocalizedText } from "@handyweb/core";

/*
 * A small reader for EXIF (a TIFF structure). It reads IFD0, the EXIF IFD,
 * and the GPS IFD, and returns the tags that people care about. It never
 * throws on bad data: a broken offset ends the read.
 */

export type Group = "camera" | "photo" | "location" | "owner" | "other";

export interface Tag {
    id: number;
    group: Group;
    label: LocalizedText;
    /** Private data: location, owner, serial number. */
    sensitive?: boolean;
}

const T = (id: number, group: Group, en: string, fa: string, sensitive = false): [number, Tag] => [
    id,
    { id, group, label: { en, fa }, sensitive },
];

const MAIN = new Map<number, Tag>([
    T(0x010f, "camera", "Camera make", "سازنده دوربین"),
    T(0x0110, "camera", "Camera model", "مدل دوربین"),
    T(0x0131, "other", "Software", "نرم‌افزار"),
    T(0x0132, "photo", "Date changed", "تاریخ ویرایش"),
    T(0x010e, "other", "Description", "توضیح"),
    T(0x013b, "owner", "Artist", "هنرمند", true),
    T(0x8298, "owner", "Copyright", "حق نشر"),
    T(0x0112, "photo", "Orientation", "جهت عکس"),
    T(0x9003, "photo", "Date taken", "تاریخ گرفتن عکس"),
    T(0x9004, "photo", "Date digitized", "تاریخ دیجیتال شدن"),
    T(0x9010, "photo", "Time zone", "منطقه زمانی"),
    T(0x829a, "photo", "Exposure time", "زمان نوردهی"),
    T(0x829d, "photo", "F-number", "عدد F"),
    T(0x8827, "photo", "ISO", "ISO"),
    T(0x920a, "photo", "Focal length", "فاصله کانونی"),
    T(0xa433, "camera", "Lens make", "سازنده لنز"),
    T(0xa434, "camera", "Lens model", "مدل لنز"),
    T(0xa002, "photo", "Width", "پهنا"),
    T(0xa003, "photo", "Height", "بلندا"),
    T(0xa430, "owner", "Camera owner", "مالک دوربین", true),
    T(0xa431, "owner", "Camera serial number", "شماره سریال دوربین", true),
    T(0xa435, "owner", "Lens serial number", "شماره سریال لنز", true),
    T(0xa420, "owner", "Image unique ID", "شناسه یکتای عکس", true),
]);

const GPS = new Map<number, Tag>([
    T(0x0002, "location", "Latitude", "عرض جغرافیایی", true),
    T(0x0004, "location", "Longitude", "طول جغرافیایی", true),
    T(0x0006, "location", "Altitude", "ارتفاع", true),
    T(0x001d, "location", "GPS date", "تاریخ GPS", true),
]);

export interface Entry {
    tag: Tag;
    value: string;
}

export interface ExifData {
    entries: Entry[];
    /** Decimal degrees, or null. */
    gps: { latitude: number; longitude: number } | null;
    orientation: number;
    /** Tags that the reader does not name. */
    otherCount: number;
}

const SIZES: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

/** Reads EXIF from TIFF bytes (the part after "Exif\0\0"). */
export function readExif(tiff: Uint8Array): ExifData {
    const result: ExifData = { entries: [], gps: null, orientation: 1, otherCount: 0 };
    if (tiff.length < 8) return result;
    const view = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
    const little = tiff[0] === 0x49 && tiff[1] === 0x49;
    if (!little && !(tiff[0] === 0x4d && tiff[1] === 0x4d)) return result;
    const u16 = (at: number) => view.getUint16(at, little);
    const u32 = (at: number) => view.getUint32(at, little);
    const inside = (at: number, size: number) => at >= 0 && at + size <= tiff.length;

    type Raw = number[] | string;
    const readValue = (entry: number): Raw | null => {
        const type = u16(entry + 2);
        const count = u32(entry + 4);
        const size = (SIZES[type] ?? 0) * count;
        if (size === 0 || size > 65536) return null;
        const at = size <= 4 ? entry + 8 : u32(entry + 8);
        if (!inside(at, size)) return null;
        if (type === 2) {
            return new TextDecoder()
                .decode(tiff.subarray(at, at + count))
                .replace(/\0+$/, "")
                .trim();
        }
        if (type === 7) return Array.from(tiff.subarray(at, at + Math.min(count, 64)));
        const values: number[] = [];
        for (let i = 0; i < count && i < 16; i++) {
            if (type === 1) values.push(tiff[at + i] as number);
            else if (type === 3) values.push(u16(at + i * 2));
            else if (type === 4) values.push(u32(at + i * 4));
            else if (type === 9) values.push(view.getInt32(at + i * 4, little));
            else if (type === 5 || type === 10) {
                const num = type === 5 ? u32(at + i * 8) : view.getInt32(at + i * 8, little);
                const den =
                    type === 5 ? u32(at + i * 8 + 4) : view.getInt32(at + i * 8 + 4, little);
                values.push(den === 0 ? 0 : num / den);
            }
        }
        return values;
    };

    const visited = new Set<number>();
    const gpsRaw = new Map<number, Raw>();

    const readIfd = (offset: number, names: Map<number, Tag>, isGps: boolean) => {
        if (visited.has(offset) || !inside(offset, 2)) return;
        visited.add(offset);
        const count = u16(offset);
        for (let n = 0; n < count && n < 512; n++) {
            const entry = offset + 2 + n * 12;
            if (!inside(entry, 12)) return;
            const id = u16(entry);
            if (!isGps && (id === 0x8769 || id === 0x8825)) {
                readIfd(u32(entry + 8), id === 0x8825 ? GPS : MAIN, id === 0x8825);
                continue;
            }
            const value = readValue(entry);
            if (value === null) continue;
            if (isGps) gpsRaw.set(id, value);
            const tag = names.get(id);
            if (!tag) {
                if (!isGps) result.otherCount++;
                continue;
            }
            if (id === 0x0112 && !isGps && Array.isArray(value)) result.orientation = value[0] ?? 1;
            if (isGps) continue;
            result.entries.push({ tag, value: format(id, value) });
        }
    };

    readIfd(u32(4), MAIN, false);

    // GPS values need their reference (N/S, E/W), so they are read after the IFD.
    const dms = (value: Raw | undefined) =>
        Array.isArray(value) && value.length >= 3
            ? (value[0] as number) + (value[1] as number) / 60 + (value[2] as number) / 3600
            : null;
    const lat = dms(gpsRaw.get(2));
    const lon = dms(gpsRaw.get(4));
    if (lat !== null && lon !== null) {
        const latitude = gpsRaw.get(1) === "S" ? -lat : lat;
        const longitude = gpsRaw.get(3) === "W" ? -lon : lon;
        result.gps = { latitude, longitude };
        result.entries.push({ tag: GPS.get(2) as Tag, value: latitude.toFixed(6) });
        result.entries.push({ tag: GPS.get(4) as Tag, value: longitude.toFixed(6) });
    }
    const alt = gpsRaw.get(6);
    if (Array.isArray(alt) && alt.length > 0) {
        const below = Array.isArray(gpsRaw.get(5)) && (gpsRaw.get(5) as number[])[0] === 1;
        result.entries.push({
            tag: GPS.get(6) as Tag,
            value: `${below ? "-" : ""}${(alt[0] as number).toFixed(1)} m`,
        });
    }
    const date = gpsRaw.get(0x1d);
    if (typeof date === "string" && date)
        result.entries.push({ tag: GPS.get(0x1d) as Tag, value: date });
    return result;
}

function format(id: number, value: number[] | string): string {
    if (typeof value === "string") return value;
    const first = value[0] ?? 0;
    if (id === 0x829a)
        return first > 0 && first < 1 ? `1/${Math.round(1 / first)} s` : `${first} s`;
    if (id === 0x829d) return `f/${first.toFixed(1)}`;
    if (id === 0x920a) return `${Math.round(first * 10) / 10} mm`;
    if (id === 0xa420 || value.length > 4)
        return String.fromCharCode(...value.filter((c) => c >= 32 && c < 127));
    return value.join(", ");
}

/** A TIFF block with only the orientation tag, so a photo still shows upright. */
export function orientationOnlyExif(orientation: number): Uint8Array {
    const bytes = new Uint8Array(6 + 8 + 2 + 12 + 4);
    bytes.set([0x45, 0x78, 0x69, 0x66, 0, 0], 0);
    const view = new DataView(bytes.buffer);
    bytes.set([0x4d, 0x4d], 6);
    view.setUint16(8, 42);
    view.setUint32(10, 8);
    view.setUint16(14, 1);
    view.setUint16(16, 0x0112);
    view.setUint16(18, 3);
    view.setUint32(20, 1);
    view.setUint16(24, orientation);
    view.setUint32(28, 0);
    return bytes;
}
