import type { LocalizedText } from "@handyweb/core";
import { ToolFailure } from "@handyweb/core/runtime";

/*
 * IPv4 and IPv6 subnets with BigInt. Special ranges follow the IANA special
 * address registries (RFC 6890 and the ranges added after it).
 */

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

export function parseIpv4(text: string): bigint {
    const parts = text.split(".");
    if (
        parts.length !== 4 ||
        parts.some(
            (part) =>
                !/^\d{1,3}$/.test(part) ||
                Number(part) > 255 ||
                (part.length > 1 && part.startsWith("0")),
        )
    ) {
        throw fail("نشانی IPv4 درست نیست.", "This is not a valid IPv4 address.", "ipv4");
    }
    return parts.reduce((value, part) => (value << 8n) | BigInt(part), 0n);
}

export function formatIpv4(value: bigint): string {
    return [24n, 16n, 8n, 0n].map((shift) => String((value >> shift) & 255n)).join(".");
}

export function parseIpv6(text: string): bigint {
    let input = text
        .toLowerCase()
        .replace(/^\[|\]$/g, "")
        .replace(/%.*$/, "");
    // An IPv4 tail, such as ::ffff:192.0.2.1.
    const v4 = /(\d+\.\d+\.\d+\.\d+)$/.exec(input);
    if (v4) {
        const value = parseIpv4(v4[1] as string);
        input =
            input.slice(0, -v4[1]!.length) +
            `${(value >> 16n).toString(16)}:${(value & 0xffffn).toString(16)}`;
    }
    const halves = input.split("::");
    if (halves.length > 2)
        throw fail("نشانی IPv6 درست نیست.", "This is not a valid IPv6 address.", "ipv6");
    const head = halves[0] ? (halves[0] as string).split(":") : [];
    const tail = halves.length === 2 && halves[1] ? (halves[1] as string).split(":") : [];
    const missing = 8 - head.length - tail.length;
    if ((halves.length === 1 && missing !== 0) || (halves.length === 2 && missing < 1)) {
        throw fail("نشانی IPv6 درست نیست.", "This is not a valid IPv6 address.", "ipv6");
    }
    const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill("0"), ...tail];
    if (groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group)))
        throw fail("نشانی IPv6 درست نیست.", "This is not a valid IPv6 address.", "ipv6");
    return groups.reduce((value, group) => (value << 16n) | BigInt(`0x${group}`), 0n);
}

/** The short form of RFC 5952: lowercase, no leading zeros, the longest run of zero groups as ::. */
export function formatIpv6(value: bigint): string {
    const groups = Array.from({ length: 8 }, (_, i) =>
        Number((value >> BigInt((7 - i) * 16)) & 0xffffn),
    );
    let best = -1;
    let bestLength = 1;
    for (let i = 0; i < 8;) {
        if (groups[i] !== 0) {
            i++;
            continue;
        }
        let j = i;
        while (j < 8 && groups[j] === 0) j++;
        if (j - i > bestLength) {
            best = i;
            bestLength = j - i;
        }
        i = j;
    }
    const hex = groups.map((group) => group.toString(16));
    if (best < 0) return hex.join(":");
    return `${hex.slice(0, best).join(":")}::${hex.slice(best + bestLength).join(":")}`;
}

export interface Subnet {
    version: 4 | 6;
    address: string;
    prefix: number;
    network: string;
    last: string;
    /** IPv4 only. */
    broadcast: string | null;
    mask: string | null;
    wildcard: string | null;
    firstHost: string;
    lastHost: string;
    /** The number of addresses, and of usable hosts (IPv4 leaves out the network and broadcast). */
    addresses: bigint;
    hosts: bigint;
    special: LocalizedText | null;
    binaryMask: string | null;
}

interface Special {
    version: 4 | 6;
    network: string;
    prefix: number;
    name: LocalizedText;
}

const SPECIAL: Special[] = [
    {
        version: 4,
        network: "0.0.0.0",
        prefix: 8,
        name: { en: "This network (RFC 791)", fa: "همین شبکه (RFC 791)" },
    },
    {
        version: 4,
        network: "10.0.0.0",
        prefix: 8,
        name: { en: "Private (RFC 1918)", fa: "خصوصی (RFC 1918)" },
    },
    {
        version: 4,
        network: "100.64.0.0",
        prefix: 10,
        name: { en: "Carrier-grade NAT (RFC 6598)", fa: "NAT اپراتور (RFC 6598)" },
    },
    {
        version: 4,
        network: "127.0.0.0",
        prefix: 8,
        name: { en: "Loopback (RFC 1122)", fa: "Loopback، خود دستگاه (RFC 1122)" },
    },
    {
        version: 4,
        network: "169.254.0.0",
        prefix: 16,
        name: { en: "Link-local (RFC 3927)", fa: "Link-local (RFC 3927)" },
    },
    {
        version: 4,
        network: "172.16.0.0",
        prefix: 12,
        name: { en: "Private (RFC 1918)", fa: "خصوصی (RFC 1918)" },
    },
    {
        version: 4,
        network: "192.0.0.0",
        prefix: 24,
        name: { en: "IETF protocol assignments (RFC 6890)", fa: "رزرو IETF (RFC 6890)" },
    },
    {
        version: 4,
        network: "192.0.2.0",
        prefix: 24,
        name: {
            en: "Documentation, TEST-NET-1 (RFC 5737)",
            fa: "برای مستندات، TEST-NET-1 (RFC 5737)",
        },
    },
    {
        version: 4,
        network: "192.168.0.0",
        prefix: 16,
        name: { en: "Private (RFC 1918)", fa: "خصوصی (RFC 1918)" },
    },
    {
        version: 4,
        network: "198.18.0.0",
        prefix: 15,
        name: { en: "Benchmarking (RFC 2544)", fa: "آزمون کارایی (RFC 2544)" },
    },
    {
        version: 4,
        network: "198.51.100.0",
        prefix: 24,
        name: {
            en: "Documentation, TEST-NET-2 (RFC 5737)",
            fa: "برای مستندات، TEST-NET-2 (RFC 5737)",
        },
    },
    {
        version: 4,
        network: "203.0.113.0",
        prefix: 24,
        name: {
            en: "Documentation, TEST-NET-3 (RFC 5737)",
            fa: "برای مستندات، TEST-NET-3 (RFC 5737)",
        },
    },
    {
        version: 4,
        network: "224.0.0.0",
        prefix: 4,
        name: { en: "Multicast (RFC 5771)", fa: "چندپخشی (RFC 5771)" },
    },
    {
        version: 4,
        network: "240.0.0.0",
        prefix: 4,
        name: { en: "Reserved (RFC 1112)", fa: "رزرو (RFC 1112)" },
    },
    {
        version: 4,
        network: "255.255.255.255",
        prefix: 32,
        name: { en: "Limited broadcast (RFC 919)", fa: "پخش همگانی محدود (RFC 919)" },
    },
    {
        version: 6,
        network: "::",
        prefix: 128,
        name: { en: "Unspecified (RFC 4291)", fa: "نامشخص (RFC 4291)" },
    },
    {
        version: 6,
        network: "::1",
        prefix: 128,
        name: { en: "Loopback (RFC 4291)", fa: "Loopback، خود دستگاه (RFC 4291)" },
    },
    {
        version: 6,
        network: "::ffff:0:0",
        prefix: 96,
        name: { en: "IPv4-mapped (RFC 4291)", fa: "IPv4 نگاشته (RFC 4291)" },
    },
    {
        version: 6,
        network: "64:ff9b::",
        prefix: 96,
        name: { en: "IPv4/IPv6 translation (RFC 6052)", fa: "ترجمه IPv4/IPv6 (RFC 6052)" },
    },
    {
        version: 6,
        network: "2001:db8::",
        prefix: 32,
        name: { en: "Documentation (RFC 3849)", fa: "برای مستندات (RFC 3849)" },
    },
    {
        version: 6,
        network: "fc00::",
        prefix: 7,
        name: { en: "Unique local (RFC 4193)", fa: "محلی یکتا (RFC 4193)" },
    },
    {
        version: 6,
        network: "fe80::",
        prefix: 10,
        name: { en: "Link-local (RFC 4291)", fa: "Link-local (RFC 4291)" },
    },
    {
        version: 6,
        network: "ff00::",
        prefix: 8,
        name: { en: "Multicast (RFC 4291)", fa: "چندپخشی (RFC 4291)" },
    },
];

function specialName(version: 4 | 6, value: bigint): LocalizedText | null {
    const bits = version === 4 ? 32 : 128;
    let best: Special | null = null;
    for (const range of SPECIAL) {
        if (range.version !== version) continue;
        const base = version === 4 ? parseIpv4(range.network) : parseIpv6(range.network);
        const shift = BigInt(bits - range.prefix);
        if (value >> shift === base >> shift && (!best || range.prefix > best.prefix)) best = range;
    }
    return best?.name ?? null;
}

/** Reads "192.168.1.10/24", "192.168.1.10 255.255.255.0", or "2001:db8::1/64". */
export function calculate(input: string): Subnet {
    const text = input.trim();
    if (!text) throw fail("ورودی خالی است.", "The input is empty.", "empty");
    const [addressText = "", maskText] = text.split(/\s*\/\s*|\s+/);
    const version: 4 | 6 = addressText.includes(":") ? 6 : 4;
    const bits = version === 4 ? 32 : 128;
    const value = version === 4 ? parseIpv4(addressText) : parseIpv6(addressText);
    let prefix = bits;
    if (maskText !== undefined) {
        if (/^\d+$/.test(maskText)) prefix = Number(maskText);
        else if (version === 4) {
            const mask = parseIpv4(maskText);
            const binary = mask.toString(2).padStart(32, "0");
            if (!/^1*0*$/.test(binary))
                throw fail(
                    "ماسک زیرشبکه پیوسته نیست.",
                    "The subnet mask is not contiguous.",
                    "mask",
                );
            prefix = binary.indexOf("0") === -1 ? 32 : binary.indexOf("0");
        } else throw fail("پیشوند را به شکل /64 بنویسید.", "Write the prefix as /64.", "prefix");
        if (prefix < 0 || prefix > bits)
            throw fail(
                `پیشوند باید از ۰ تا ${bits} باشد.`,
                `The prefix must be from 0 to ${bits}.`,
                "prefix",
            );
    }
    const full = (1n << BigInt(bits)) - 1n;
    const hostBits = BigInt(bits - prefix);
    const maskValue = (full >> hostBits) << hostBits;
    const network = value & maskValue;
    const last = network | (full ^ maskValue);
    const addresses = 1n << hostBits;
    const format = version === 4 ? formatIpv4 : formatIpv6;
    // In IPv4, /31 (RFC 3021) and /32 have no network or broadcast address to leave out.
    const reserved = version === 4 && prefix < 31;
    return {
        version,
        address: format(value),
        prefix,
        network: format(network),
        last: format(last),
        broadcast: version === 4 ? formatIpv4(last) : null,
        mask: version === 4 ? formatIpv4(maskValue) : null,
        wildcard: version === 4 ? formatIpv4(full ^ maskValue) : null,
        firstHost: format(reserved ? network + 1n : network),
        lastHost: format(reserved ? last - 1n : last),
        addresses,
        hosts: reserved ? addresses - 2n : addresses,
        special: specialName(version, value),
        binaryMask:
            version === 4
                ? (maskValue.toString(2).padStart(32, "0").match(/.{8}/g) as string[]).join(".")
                : null,
    };
}
