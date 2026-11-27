import { ToolFailure } from "@handyweb/core/runtime";

/*
 * UUID (RFC 9562) and ULID generation and inspection. All random bits come
 * from crypto.getRandomValues. The time comes from the caller, so tests can
 * pass a fixed clock.
 */

export type IdKind = "v4" | "v7" | "ulid";
export const ID_KINDS: readonly IdKind[] = ["v4", "v7", "ulid"];

/** Fills a byte array with random values. Tests pass a fixed source. */
export type ByteSource = (bytes: Uint8Array<ArrayBuffer>) => Uint8Array<ArrayBuffer>;
export const cryptoBytes: ByteSource = (bytes) => crypto.getRandomValues(bytes);

const HEX = (bytes: Uint8Array) =>
    Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

function formatUuid(bytes: Uint8Array): string {
    const hex = HEX(bytes);
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** UUID version 4: 122 random bits. */
export function uuidV4(random: ByteSource = cryptoBytes): string {
    const bytes = random(new Uint8Array(16));
    bytes[6] = ((bytes[6] as number) & 0x0f) | 0x40;
    bytes[8] = ((bytes[8] as number) & 0x3f) | 0x80;
    return formatUuid(bytes);
}

/**
 * UUID version 7: a 48-bit Unix time in milliseconds, then 74 random bits.
 * IDs made in a later millisecond sort after earlier ones.
 */
export function uuidV7(nowMs: number, random: ByteSource = cryptoBytes): string {
    const bytes = random(new Uint8Array(16));
    let time = Math.floor(nowMs);
    for (let i = 5; i >= 0; i--) {
        bytes[i] = time % 256;
        time = Math.floor(time / 256);
    }
    bytes[6] = ((bytes[6] as number) & 0x0f) | 0x70;
    bytes[8] = ((bytes[8] as number) & 0x3f) | 0x80;
    return formatUuid(bytes);
}

/** Crockford Base32: no I, L, O, or U. */
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const MAX_ULID_TIME = 2 ** 48 - 1;

/** ULID: a 48-bit Unix time in milliseconds (10 characters), then 80 random bits (16 characters). */
export function ulid(nowMs: number, random: ByteSource = cryptoBytes): string {
    let time = Math.floor(nowMs);
    if (time < 0 || time > MAX_ULID_TIME) throw new RangeError("time");
    let head = "";
    for (let i = 0; i < 10; i++) {
        head = (CROCKFORD[time % 32] as string) + head;
        time = Math.floor(time / 32);
    }
    // 80 random bits are 16 groups of 5 bits.
    const bytes = random(new Uint8Array(10));
    let bits = 0n;
    for (const byte of bytes) bits = (bits << 8n) | BigInt(byte);
    let tail = "";
    for (let i = 0; i < 16; i++) {
        tail = (CROCKFORD[Number(bits & 31n)] as string) + tail;
        bits >>= 5n;
    }
    return head + tail;
}

export interface Format {
    uppercase: boolean;
    /** Leave out the hyphens of a UUID. */
    hyphens: boolean;
}

export function generateId(
    kind: IdKind,
    nowMs: number,
    format: Format,
    random: ByteSource = cryptoBytes,
): string {
    if (kind === "ulid") return ulid(nowMs, random);
    let id = kind === "v4" ? uuidV4(random) : uuidV7(nowMs, random);
    if (!format.hyphens) id = id.replace(/-/g, "");
    return format.uppercase ? id.toUpperCase() : id;
}

export const MAX_COUNT = 1000;

export function generateIds(kind: IdKind, count: number, nowMs: number, format: Format): string {
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: `شمار باید میان ۱ و ${MAX_COUNT.toLocaleString("fa-IR")} باشد.`,
                en: `The count must be from 1 to ${MAX_COUNT.toLocaleString("en")}.`,
            },
            "count",
        );
    }
    return Array.from({ length: count }, () => generateId(kind, nowMs, format)).join("\n");
}

export type Variant = "ncs" | "rfc" | "microsoft" | "future";

export interface Inspection {
    kind: "uuid" | "ulid";
    /** The ID in its standard form: lowercase UUID with hyphens, or uppercase ULID. */
    canonical: string;
    /** UUID version, 0 to 15. Null for a ULID. */
    version: number | null;
    variant: Variant | null;
    /** "nil" or "max" for the two special UUIDs. */
    special: "nil" | "max" | null;
    /** The time in the ID, in milliseconds since 1970, for UUID v1, v6, v7 and ULID. */
    timeMs: number | null;
}

const UUID =
    /^(?:urn:uuid:)?\{?([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})\}?$/i;
const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/i;

/** 100-nanosecond intervals between 1582-10-15 (the Gregorian reform) and 1970-01-01. */
const GREGORIAN_OFFSET = 122_192_928_000_000_000n;

export function inspectId(input: string): Inspection {
    const text = input.trim();
    const uuid = UUID.exec(text);
    if (uuid) {
        const hex = uuid.slice(1).join("").toLowerCase();
        const canonical = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
        const special = /^0+$/.test(hex) ? "nil" : /^f+$/.test(hex) ? "max" : null;
        const version = parseInt(hex[12] as string, 16);
        const v = parseInt(hex[16] as string, 16);
        const variant: Variant = v < 8 ? "ncs" : v < 12 ? "rfc" : v < 14 ? "microsoft" : "future";
        let timeMs: number | null = null;
        if (!special && variant === "rfc") {
            if (version === 7) {
                timeMs = parseInt(hex.slice(0, 12), 16);
            } else if (version === 1 || version === 6) {
                const ticks =
                    version === 1
                        ? BigInt(`0x${hex.slice(13, 16)}${hex.slice(8, 12)}${hex.slice(0, 8)}`)
                        : BigInt(`0x${hex.slice(0, 12)}${hex.slice(13, 16)}`);
                timeMs = Number((ticks - GREGORIAN_OFFSET) / 10_000n);
            }
        }
        return {
            kind: "uuid",
            canonical,
            version: special ? null : version,
            variant: special ? null : variant,
            special,
            timeMs,
        };
    }
    if (ULID.test(text)) {
        const upper = text.toUpperCase();
        // The first character holds only 3 bits of the 48-bit time.
        if (CROCKFORD.indexOf(upper[0] as string) > 7) {
            throw new ToolFailure(
                "invalid-input",
                {
                    fa: "زمان این ULID از بیشینه بزرگ‌تر است: نویسه نخست باید 0 تا 7 باشد.",
                    en: "The time of this ULID is above the maximum: the first character must be 0 to 7.",
                },
                "ulid overflow",
            );
        }
        let time = 0;
        for (const char of upper.slice(0, 10)) time = time * 32 + CROCKFORD.indexOf(char);
        return {
            kind: "ulid",
            canonical: upper,
            version: null,
            variant: null,
            special: null,
            timeMs: time,
        };
    }
    throw new ToolFailure(
        "invalid-input",
        {
            fa: "این UUID یا ULID نیست. UUID ۳۲ رقم هگز دارد و ULID ۲۶ نویسه Crockford Base32.",
            en: "This is not a UUID or a ULID. A UUID has 32 hex digits, and a ULID has 26 Crockford Base32 characters.",
        },
        "not an id",
    );
}
