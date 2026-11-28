export type ExtractKind = "emails" | "urls" | "phones" | "numbers" | "hashtags" | "mentions";
export const EXTRACT_KINDS: readonly ExtractKind[] = [
    "emails",
    "urls",
    "phones",
    "numbers",
    "hashtags",
    "mentions",
];

/*
 * Simple, documented patterns. They find the common forms, not every form
 * that the standards allow.
 */
const PATTERNS: Record<ExtractKind, RegExp> = {
    emails: /[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)*\.[\p{L}]{2,}/gu,
    // http(s) and www. addresses. A final dot, comma, or bracket is not part of the URL.
    urls: /\b(?:https?:\/\/|www\.)[^\s<>"'«»]+[^\s<>"'«».,;:!?)\]}،؛]/gu,
    // Iranian mobile and landline numbers, and international numbers with a +.
    phones: /(?:\+|00)?(?:98|0)?9\d{2}[\s-]?\d{3}[\s-]?\d{4}\b|\+\d{1,3}[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}\b|\b0\d{2,3}[\s-]?\d{7,8}\b/gu,
    // Whole numbers and decimals, with thousands separators.
    numbers: /[-+]?\d{1,3}(?:[,٬]\d{3})+(?:[.٫]\d+)?|[-+]?\d+(?:[.٫]\d+)?/gu,
    hashtags: /#[\p{L}\p{N}_\u200c]+/gu,
    mentions: /(?<![\p{L}\p{N}.])@[A-Za-z0-9_.]{2,}/gu,
};

function latinDigits(text: string): string {
    return text
        .replace(/[۰-۹]/g, (d) => String((d.codePointAt(0) as number) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String((d.codePointAt(0) as number) - 0x0660));
}

export interface ExtractOptions {
    unique: boolean;
    sort: boolean;
}

/**
 * Finds the items of one kind. Persian and Arabic-Indic digits are read as
 * Latin digits for phones and numbers, and the result uses Latin digits.
 */
export function extract(text: string, kind: ExtractKind, options: ExtractOptions): string[] {
    const source = kind === "phones" || kind === "numbers" ? latinDigits(text) : text;
    let items = Array.from(source.matchAll(PATTERNS[kind]), (match) => match[0].trim());
    if (kind === "emails") items = items.map((item) => item.replace(/\.$/, ""));
    if (options.unique) items = [...new Set(items)];
    if (options.sort) items.sort(new Intl.Collator("fa", { numeric: true }).compare);
    return items;
}
