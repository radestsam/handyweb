/*
 * Punycode decoding (RFC 3492), to show an internationalized domain name
 * (xn--...) in its own letters. Only decoding is needed: the URL parser of the
 * browser already encodes.
 */

const BASE = 36;
const T_MIN = 1;
const T_MAX = 26;
const SKEW = 38;
const DAMP = 700;

function adapt(delta: number, points: number, first: boolean): number {
    let d = first ? Math.floor(delta / DAMP) : delta >> 1;
    d += Math.floor(d / points);
    let k = 0;
    while (d > ((BASE - T_MIN) * T_MAX) >> 1) {
        d = Math.floor(d / (BASE - T_MIN));
        k += BASE;
    }
    return k + Math.floor(((BASE - T_MIN + 1) * d) / (d + SKEW));
}

function digit(code: number): number {
    if (code >= 48 && code <= 57) return code - 22;
    if (code >= 65 && code <= 90) return code - 65;
    if (code >= 97 && code <= 122) return code - 97;
    return BASE;
}

/** Decodes one label without the "xn--" prefix. Throws on bad input. */
export function decodeLabel(input: string): string {
    const output: number[] = [];
    const last = input.lastIndexOf("-");
    for (let j = 0; j < Math.max(0, last); j++) output.push(input.charCodeAt(j));
    let n = 128;
    let bias = 72;
    let i = 0;
    for (let index = last > 0 ? last + 1 : 0; index < input.length;) {
        const old = i;
        for (let w = 1, k = BASE; ; k += BASE) {
            if (index >= input.length) throw new RangeError("punycode");
            const d = digit(input.charCodeAt(index++));
            if (d >= BASE) throw new RangeError("punycode");
            i += d * w;
            const t = k <= bias ? T_MIN : k >= bias + T_MAX ? T_MAX : k - bias;
            if (d < t) break;
            w *= BASE - t;
        }
        bias = adapt(i - old, output.length + 1, old === 0);
        n += Math.floor(i / (output.length + 1));
        i %= output.length + 1;
        output.splice(i++, 0, n);
    }
    return String.fromCodePoint(...output);
}

/** Decodes every xn-- label of a host name. Labels that do not decode stay as they are. */
export function toUnicode(host: string): string {
    return host
        .split(".")
        .map((label) => {
            if (!label.toLowerCase().startsWith("xn--")) return label;
            try {
                return decodeLabel(label.slice(4));
            } catch {
                return label;
            }
        })
        .join(".");
}
