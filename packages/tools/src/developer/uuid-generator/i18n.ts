import type { LocalizedText } from "@handyweb/core";
import type { IdKind, Variant } from "./logic";

export const strings = {
    kind: { fa: "گونه", en: "Type" },
    count: { fa: "چند تا", en: "How many" },
    uppercase: { fa: "حروف بزرگ", en: "Uppercase" },
    hyphens: { fa: "با خط تیره", en: "With hyphens" },
    output: { fa: "خروجی (هر کدام در یک خط)", en: "Output (one per line)" },
    regenerate: { fa: "ساخت دوباره", en: "Generate again" },
    inspect: { fa: "بررسی یک UUID یا ULID", en: "Inspect a UUID or ULID" },
    inspectPlaceholder: { fa: "UUID یا ULID را بچسبانید", en: "Paste a UUID or a ULID" },
    type: { fa: "گونه", en: "Type" },
    version: { fa: "نسخه", en: "Version" },
    variant: { fa: "گونه چیدمان (variant)", en: "Variant" },
    time: { fa: "زمان درون شناسه", en: "Time in the ID" },
    canonical: { fa: "شکل استاندارد", en: "Standard form" },
    nil: { fa: "UUID تهی (همه صفر)", en: "Nil UUID (all zeros)" },
    max: { fa: "UUID بیشینه (همه F)", en: "Max UUID (all F)" },
    note: {
        fa: "بخش‌های تصادفی با crypto.getRandomValues مرورگر ساخته می‌شوند. زمان در v7 و ULID از ساعت همین دستگاه می‌آید.",
        en: "The random parts come from crypto.getRandomValues of your browser. The time in v7 and ULID comes from the clock of this device.",
    },
} as const satisfies Record<string, LocalizedText>;

export const kindLabels: Record<IdKind, LocalizedText> = {
    v4: { fa: "UUID v4", en: "UUID v4" },
    v7: { fa: "UUID v7", en: "UUID v7" },
    ulid: { fa: "ULID", en: "ULID" },
};

export const variantLabels: Record<Variant, LocalizedText> = {
    rfc: { fa: "RFC 9562 (استاندارد)", en: "RFC 9562 (standard)" },
    ncs: { fa: "NCS (کهنه)", en: "NCS (legacy)" },
    microsoft: { fa: "Microsoft (کهنه)", en: "Microsoft (legacy)" },
    future: { fa: "رزرو برای آینده", en: "Reserved for the future" },
};
