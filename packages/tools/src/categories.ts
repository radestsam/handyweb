import type { ToolCategory } from "@handyweb/core";

/*
 * Every category of the catalog. A category gets a page only when it holds at
 * least one published tool, so the list can name categories that are empty
 * today.
 */
export const categories: readonly ToolCategory[] = [
    {
        id: "text",
        slug: "text",
        order: 10,
        title: { fa: "متن", en: "Text" },
        description: {
            fa: "شمارش، تبدیل، مرتب‌سازی و پاک‌سازی متن.",
            en: "Count, convert, sort, and clean text.",
        },
    },
    {
        id: "persian",
        slug: "persian",
        order: 20,
        title: { fa: "فارسی", en: "Persian" },
        description: {
            fa: "یکسان‌سازی نویسه‌ها، اعداد فارسی، نیم‌فاصله و تاریخ جلالی.",
            en: "Character normalization, Persian digits, ZWNJ, and the Jalali calendar.",
        },
    },
    {
        id: "encoding",
        slug: "encoding",
        order: 30,
        title: { fa: "کدگذاری", en: "Encoding" },
        description: {
            fa: "Base64، URL، HTML، یونیکد و قالب‌های دیگر.",
            en: "Base64, URL, HTML, Unicode, and other formats.",
        },
    },
    {
        id: "crypto",
        slug: "crypto",
        order: 40,
        title: { fa: "هش و رمزنگاری", en: "Hashing and Cryptography" },
        description: {
            fa: "هش، HMAC، تولید رمز عبور و شناسه‌های تصادفی امن.",
            en: "Hashes, HMAC, password generators, and secure random IDs.",
        },
    },
    {
        id: "developer",
        slug: "developer",
        order: 50,
        title: { fa: "برنامه‌نویسی", en: "Developer" },
        description: {
            fa: "قالب‌بندی و اعتبارسنجی JSON، XML و قالب‌های دیگر.",
            en: "Format and validate JSON, XML, and other formats.",
        },
    },
    {
        id: "image",
        slug: "image",
        order: 60,
        title: { fa: "تصویر", en: "Images" },
        description: {
            fa: "تغییر اندازه، برش، تبدیل و فشرده‌سازی تصویر.",
            en: "Resize, crop, convert, and compress images.",
        },
    },
    {
        id: "pdf",
        slug: "pdf",
        order: 70,
        title: { fa: "PDF", en: "PDF" },
        description: {
            fa: "ادغام، تقسیم و ویرایش صفحه‌های PDF.",
            en: "Merge, split, and edit PDF pages.",
        },
    },
    {
        id: "qr",
        slug: "qr",
        order: 80,
        title: { fa: "QR و بارکد", en: "QR Codes and Barcodes" },
        description: {
            fa: "ساخت و خواندن کد QR و بارکد.",
            en: "Create and read QR codes and barcodes.",
        },
    },
    {
        id: "calculators",
        slug: "calculators",
        order: 90,
        title: { fa: "ماشین‌حساب و مبدل", en: "Calculators and Converters" },
        description: {
            fa: "تبدیل واحد، تاریخ، مبنای عددی و محاسبه‌های روزمره.",
            en: "Unit, date, and number base conversion, and everyday calculations.",
        },
    },
    {
        id: "network",
        slug: "network",
        order: 100,
        title: { fa: "شبکه", en: "Network" },
        description: {
            fa: "محاسبه IP و زیرشبکه و جدول‌های مرجع.",
            en: "IP and subnet calculators and reference tables.",
        },
    },
];
