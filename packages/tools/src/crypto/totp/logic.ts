import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Time-based one-time passwords: HOTP (RFC 4226) on a time counter
 * (RFC 6238), with HMAC from Web Crypto. The secret is Base32 (RFC 4648), as
 * in authenticator apps and otpauth:// links.
 */

export type TotpAlgorithm = "SHA-1" | "SHA-256" | "SHA-512";

export interface TotpConfig {
    secret: Uint8Array<ArrayBuffer>;
    algorithm: TotpAlgorithm;
    digits: number;
    period: number;
    label: string;
    issuer: string;
}

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/** Reads Base32. Spaces, dashes, padding, and lower case are accepted. */
export function base32Decode(text: string): Uint8Array<ArrayBuffer> {
    const clean = text
        .toUpperCase()
        .replace(/[\s-]+/g, "")
        .replace(/=+$/, "");
    if (clean === "") throw fail("کلید را بنویسید.", "Enter the secret key.", "empty");
    const bytes: number[] = [];
    let buffer = 0;
    let bits = 0;
    for (const char of clean) {
        const value = ALPHABET.indexOf(char);
        if (value === -1) {
            throw fail(
                `«${char}» در Base32 نیست. کلید تنها A تا Z و ۲ تا ۷ دارد.`,
                `"${char}" is not Base32. The key holds only A to Z and 2 to 7.`,
                "base32",
            );
        }
        buffer = (buffer << 5) | value;
        bits += 5;
        if (bits >= 8) {
            bits -= 8;
            bytes.push((buffer >> bits) & 0xff);
        }
    }
    return new Uint8Array(bytes);
}

/** Reads an otpauth://totp/... link, or a plain Base32 secret. */
export function parseTotp(input: string): TotpConfig {
    const text = input.trim();
    if (!/^otpauth:/i.test(text)) {
        return {
            secret: base32Decode(text),
            algorithm: "SHA-1",
            digits: 6,
            period: 30,
            label: "",
            issuer: "",
        };
    }
    let url: URL;
    try {
        url = new URL(text);
    } catch {
        throw fail("این پیوند otpauth درست نیست.", "This otpauth link is not valid.", "uri");
    }
    if (url.host.toLowerCase() !== "totp") {
        throw fail(
            "تنها کدهای زمانی (totp) پذیرفته می‌شوند، نه hotp.",
            "Only time-based codes (totp) are supported, not hotp.",
            "hotp",
        );
    }
    const params = url.searchParams;
    const algorithmName = (params.get("algorithm") ?? "SHA1").toUpperCase().replace("-", "");
    const algorithm: TotpAlgorithm =
        algorithmName === "SHA256" ? "SHA-256" : algorithmName === "SHA512" ? "SHA-512" : "SHA-1";
    const digits = Number(params.get("digits") ?? 6);
    const period = Number(params.get("period") ?? 30);
    if (![6, 7, 8].includes(digits) || !Number.isInteger(period) || period < 1 || period > 300) {
        throw fail(
            "شمار رقم یا دوره کد درست نیست.",
            "The digits or the period are not valid.",
            "params",
        );
    }
    return {
        secret: base32Decode(params.get("secret") ?? ""),
        algorithm,
        digits,
        period,
        label: decodeURIComponent(url.pathname.replace(/^\//, "")),
        issuer: params.get("issuer") ?? "",
    };
}

/** HOTP for one counter value (RFC 4226 section 5.3). */
export async function hotp(
    secret: Uint8Array<ArrayBuffer>,
    counter: number,
    digits: number,
    algorithm: TotpAlgorithm,
): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        secret,
        { name: "HMAC", hash: algorithm },
        false,
        ["sign"],
    );
    const message = new ArrayBuffer(8);
    const view = new DataView(message);
    view.setUint32(0, Math.floor(counter / 2 ** 32));
    view.setUint32(4, counter >>> 0);
    const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, message));
    const offset = (mac[mac.length - 1] as number) & 0x0f;
    const code =
        (((mac[offset] as number) & 0x7f) << 24) |
        ((mac[offset + 1] as number) << 16) |
        ((mac[offset + 2] as number) << 8) |
        (mac[offset + 3] as number);
    return String(code % 10 ** digits).padStart(digits, "0");
}

/** The code at a time in milliseconds, and the seconds left in its period. */
export async function totpAt(
    config: TotpConfig,
    nowMs: number,
): Promise<{ code: string; remaining: number }> {
    const seconds = Math.floor(nowMs / 1000);
    const counter = Math.floor(seconds / config.period);
    return {
        code: await hotp(config.secret, counter, config.digits, config.algorithm),
        remaining: config.period - (seconds % config.period),
    };
}
