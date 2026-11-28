import { ToolFailure } from "@handyweb/core/runtime";

/*
 * MAC addresses (EUI-48). The two lowest bits of the first byte say whether
 * the address is for one device or a group (I/G bit), and whether the maker
 * gave it or it was set locally (U/L bit). Phones use locally set, random
 * addresses for privacy.
 */

export type Style = "colon" | "hyphen" | "dot" | "plain";

export interface Mac {
    bytes: number[];
    multicast: boolean;
    local: boolean;
    broadcast: boolean;
    /** The first three bytes, which name the maker when the address is not local. */
    oui: string;
}

export function parseMac(text: string): Mac {
    const hex = text.trim().replace(/[\s:.\-]/g, "");
    if (!/^[0-9a-fA-F]{12}$/.test(hex)) {
        throw new ToolFailure(
            "invalid-input",
            { fa: "نشانی MAC باید ۱۲ رقم هگز باشد.", en: "A MAC address has 12 hex digits." },
            "mac",
        );
    }
    const bytes = (hex.match(/../g) as string[]).map((pair) => parseInt(pair, 16));
    const first = bytes[0] as number;
    return {
        bytes,
        multicast: (first & 1) === 1,
        local: (first & 2) === 2,
        broadcast: bytes.every((byte) => byte === 255),
        oui: bytes
            .slice(0, 3)
            .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
            .join(":"),
    };
}

export function formatMac(bytes: number[], style: Style, upper: boolean): string {
    let hex = bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    if (upper) hex = hex.toUpperCase();
    if (style === "plain") return hex;
    if (style === "dot") return (hex.match(/.{4}/g) as string[]).join(".");
    return (hex.match(/../g) as string[]).join(style === "colon" ? ":" : "-");
}

/** The modified EUI-64 interface ID that SLAAC builds from a MAC (RFC 4291, appendix A). */
export function eui64(bytes: number[]): string {
    const out = [
        (bytes[0] as number) ^ 2,
        bytes[1],
        bytes[2],
        0xff,
        0xfe,
        bytes[3],
        bytes[4],
        bytes[5],
    ] as number[];
    const groups = [];
    for (let i = 0; i < 8; i += 2)
        groups.push((((out[i] as number) << 8) | (out[i + 1] as number)).toString(16));
    return groups.join(":");
}

/** Reads many addresses, one per line. */
export function formatMany(
    text: string,
    style: Style,
    upper: boolean,
): Array<{ input: string; output: string | null }> {
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            try {
                return { input: line, output: formatMac(parseMac(line).bytes, style, upper) };
            } catch {
                return { input: line, output: null };
            }
        });
}
