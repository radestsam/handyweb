import type { ToolDefinition } from "@handyweb/core";

export const uuidGeneratorMeta: ToolDefinition = {
    id: "uuid-generator",
    slug: "uuid-generator",
    aliases: ["uuid", "guid-generator", "uuid-v4", "uuid-v7", "ulid-generator", "uuid-decoder"],
    category: "developer",
    alsoIn: ["crypto"],
    related: ["random-token"],
    tags: ["uuid", "ulid", "guid", "id"],
    title: { fa: "ساخت UUID و ULID", en: "UUID and ULID Generator" },
    seoTitle: {
        fa: "ساخت UUID و ULID (نسخه ۴ و ۷) آنلاین",
        en: "UUID and ULID Generator (v4 and v7) Online",
    },
    description: {
        fa: "UUID نسخه ۴ و ۷ یا ULID بسازید، تا ۱٬۰۰۰ تا در یک بار. یک UUID یا ULID را هم بچسبانید تا نسخه و زمان درون آن را ببینید.",
        en: "Create UUID version 4 and 7 or ULID values, up to 1,000 at a time. Paste a UUID or a ULID to see its version and the time inside it.",
    },
    keywords: {
        fa: ["uuid", "guid", "ulid", "شناسه یکتا", "ساخت uuid"],
        en: ["uuid generator", "uuid v4", "uuid v7", "guid generator", "ulid", "uuid decoder"],
    },
    presets: [
        {
            id: "v7",
            title: { fa: "ساخت UUID v7", en: "UUID v7 Generator" },
            keywords: { fa: ["uuid v7"], en: ["uuid v7", "time-ordered uuid"] },
            options: { kind: "v7" },
        },
        {
            id: "ulid",
            title: { fa: "ساخت ULID", en: "ULID Generator" },
            keywords: { fa: ["ulid"], en: ["ulid"] },
            options: { kind: "ulid" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["structured", "text"],
    outputKinds: ["text"],
    limitations: {
        fa: "شناسه‌هایی که در یک میلی‌ثانیه ساخته می‌شوند، در v7 و ULID به ترتیب ساخت چیده نمی‌شوند، چون بخش پایانی آن‌ها تصادفی است.",
        en: "IDs made in the same millisecond are not sorted in the order they were made in v7 and ULID, because their last part is random.",
    },
    guide: {
        steps: [
            {
                fa: "گونه را برگزینید: UUID v4، UUID v7 یا ULID.",
                en: "Choose the type: UUID v4, UUID v7, or ULID.",
            },
            {
                fa: "شمار و شکل را برگزینید و خروجی را کپی کنید.",
                en: "Choose how many and the format, then copy the output.",
            },
            {
                fa: "برای دیدن نسخه و زمان یک شناسه، آن را در بخش بررسی بچسبانید.",
                en: "To see the version and the time of an ID, paste it into the inspect box.",
            },
        ],
        faq: [
            {
                question: { fa: "v4 یا v7؟", en: "v4 or v7?" },
                answer: {
                    fa: "v4 سراسر تصادفی است. v7 با زمان آغاز می‌شود، پس شناسه‌های تازه‌تر پس از کهنه‌ترها چیده می‌شوند و برای کلید پایگاه داده بهتر است. هر دو در RFC 9562 آمده‌اند.",
                    en: "v4 is fully random. v7 starts with the time, so newer IDs sort after older ones, which is better for database keys. Both are in RFC 9562.",
                },
            },
            {
                question: { fa: "ULID چیست؟", en: "What is a ULID?" },
                answer: {
                    fa: "شناسه‌ای ۲۶ نویسه‌ای: ۱۰ نویسه نخست زمان به میلی‌ثانیه و ۱۶ نویسه دیگر ۸۰ بیت تصادفی است. با Crockford Base32 نوشته می‌شود و I، L، O و U ندارد تا با 1 و 0 اشتباه نشود.",
                    en: "A 26-character ID: the first 10 characters are the time in milliseconds, and the other 16 are 80 random bits. It uses Crockford Base32, which has no I, L, O, or U, so it is not confused with 1 and 0.",
                },
            },
            {
                question: { fa: "UUID تکراری می‌شود؟", en: "Can a UUID repeat?" },
                answer: {
                    fa: "در عمل نه. v4 ۱۲۲ بیت تصادفی دارد و بخت تکرار حتی پس از میلیاردها شناسه بسیار کم است.",
                    en: "Not in practice. A v4 UUID has 122 random bits, and the chance of a repeat is tiny even after billions of IDs.",
                },
            },
        ],
    },
    example: "5",
};
