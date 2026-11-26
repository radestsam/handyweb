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
            fa: "شمردن، چیدن، پاک‌سازی و دگرگون کردن نوشته.",
            en: "Count, convert, sort, and clean text.",
        },
    },
    {
        id: "persian",
        slug: "persian",
        order: 20,
        title: { fa: "فارسی", en: "Persian" },
        description: {
            fa: "یکسان‌سازی نویسه‌ها، شماره‌های فارسی، نیم‌فاصله و تبدیل تاریخ شمسی و میلادی.",
            en: "Character normalization, Persian digits, ZWNJ, and the Jalali calendar.",
        },
    },
    {
        id: "encoding",
        slug: "encoding",
        order: 30,
        title: { fa: "کدگذاری", en: "Encoding" },
        description: {
            fa: "Base64، URL، HTML، یونیکد و گونه‌های دیگر.",
            en: "Base64, URL, HTML, Unicode, and other formats.",
        },
    },
    {
        id: "crypto",
        slug: "crypto",
        order: 40,
        title: { fa: "هش و رمزنگاری", en: "Hashing and Cryptography" },
        description: {
            fa: "هش، HMAC، ساخت گذرواژه و شناسه‌های ایمن و پیش‌بینی‌ناپذیر.",
            en: "Hashes, HMAC, password generators, and secure random IDs.",
        },
    },
    {
        id: "developer",
        slug: "developer",
        order: 50,
        title: { fa: "برنامه‌نویسی", en: "Developer" },
        description: {
            fa: "آراستن و بررسی درستی JSON، XML و گونه‌های دیگر.",
            en: "Format and validate JSON, XML, and other formats.",
        },
    },
    {
        id: "image",
        slug: "image",
        order: 60,
        title: { fa: "تصویر", en: "Images" },
        description: {
            fa: "کوچک کردن، بریدن و فشرده‌سازی تصویر.",
            en: "Resize, crop, convert, and compress images.",
        },
    },
    {
        id: "pdf",
        slug: "pdf",
        order: 70,
        title: { fa: "PDF", en: "PDF" },
        description: {
            fa: "یکی کردن، جدا کردن و ویرایش برگه‌های PDF.",
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
            fa: "برگرداندن یکاها، تاریخ، پایه شماره‌ها و شمارش‌های روزانه.",
            en: "Unit, date, and number base conversion, and everyday calculations.",
        },
    },
    {
        id: "network",
        slug: "network",
        order: 100,
        title: { fa: "شبکه", en: "Network" },
        description: {
            fa: "شمارش نشانی IP و زیرشبکه و جدول‌های راهنما.",
            en: "IP and subnet calculators and reference tables.",
        },
    },
];
