import { parseIpv4, parseIpv6, SPECIAL, type Special } from "../ip-calculator/logic";

/*
 * The special IPv4 and IPv6 ranges (IANA special-purpose registries), and a
 * lookup that says which of them an address is in. The table lives in the
 * IP calculator, so both tools use the same data.
 */

export { SPECIAL };
export type { Special };

/** Every special range that holds the address, the most specific first, or null for bad input. */
export function rangesFor(text: string): Special[] | null {
    const input = text.trim();
    if (!input) return null;
    const version: 4 | 6 = input.includes(":") ? 6 : 4;
    let value: bigint;
    try {
        value = version === 4 ? parseIpv4(input) : parseIpv6(input);
    } catch {
        return null;
    }
    const bits = version === 4 ? 32 : 128;
    return SPECIAL.filter((range) => {
        if (range.version !== version) return false;
        const base = version === 4 ? parseIpv4(range.network) : parseIpv6(range.network);
        const shift = BigInt(bits - range.prefix);
        return value >> shift === base >> shift;
    }).sort((a, b) => b.prefix - a.prefix);
}
