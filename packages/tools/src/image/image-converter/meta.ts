import type { ToolDefinition } from "@handyweb/core";

export const imageConverterMeta: ToolDefinition = {
    id: "image-converter",
    slug: "image-converter",
    aliases: ["convert-image", "image-format-converter", "jpg-png-converter", "webp-converter"],
    category: "image",
    alsoIn: [],
    related: ["image-compressor", "image-resize", "base64-file"],
    tags: ["image", "convert", "png", "jpg", "webp"],
    title: { fa: "تبدیل فرمت تصویر", en: "Image Converter" },
    description: {
        fa: "عکس را میان PNG، JPG و WebP تبدیل کنید، برای نمونه WebP به PNG یا PNG به JPG. تبدیل در مرورگر شما انجام می‌شود و عکس بارگذاری نمی‌شود.",
        en: "Convert a picture between PNG, JPG, and WebP, for example WebP to PNG or PNG to JPG. The conversion runs in your browser and nothing is uploaded.",
    },
    keywords: {
        fa: [
            "تبدیل عکس",
            "تبدیل فرمت عکس",
            "تبدیل webp به png",
            "تبدیل png به jpg",
            "تبدیل jpg به png",
        ],
        en: [
            "image converter",
            "convert image",
            "webp to png",
            "png to jpg",
            "jpg to png",
            "jpg to webp",
        ],
    },
    presets: [
        {
            id: "jpg-to-png",
            title: { fa: "تبدیل JPG به PNG", en: "JPG to PNG Converter" },
            keywords: { fa: ["jpg به png"], en: ["jpg to png", "jpeg to png"] },
            options: { to: "png" },
        },
        {
            id: "png-to-jpg",
            title: { fa: "تبدیل PNG به JPG", en: "PNG to JPG Converter" },
            keywords: { fa: ["png به jpg"], en: ["png to jpg", "png to jpeg"] },
            options: { to: "jpg" },
        },
        {
            id: "jpg-to-webp",
            title: { fa: "تبدیل JPG به WebP", en: "JPG to WebP Converter" },
            keywords: { fa: ["jpg به webp"], en: ["jpg to webp", "jpeg to webp"] },
            options: { to: "webp" },
        },
        {
            id: "webp-to-png",
            title: { fa: "تبدیل WebP به PNG", en: "WebP to PNG Converter" },
            keywords: { fa: ["webp به png"], en: ["webp to png"] },
            options: { to: "png" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["image"],
    outputKinds: ["image"],
    limits: { maxInputBytes: 100_000_000 },
    limitations: {
        fa: "ورودی PNG، JPEG، WebP، GIF یا BMP است و خروجی PNG، JPEG یا WebP. GIF متحرک تنها با نخستین فریم تبدیل می‌شود. فراداده (EXIF) و پروفایل رنگ در خروجی نمی‌مانند. Safari قدیمی WebP نمی‌نویسد. HEIC و AVIF پشتیبانی نمی‌شوند.",
        en: "Input is PNG, JPEG, WebP, GIF, or BMP, and output is PNG, JPEG, or WebP. An animated GIF converts with its first frame only. Metadata (EXIF) and color profiles are not kept. Old Safari cannot write WebP. HEIC and AVIF are not supported.",
    },
    guide: {
        steps: [
            { fa: "قالب خروجی را برگزینید.", en: "Choose the output format." },
            { fa: "عکس را برگزینید یا بکشید و رها کنید.", en: "Choose or drop a picture." },
            {
                fa: "تبدیل را بزنید و نتیجه را دانلود کنید.",
                en: "Click Convert and download the result.",
            },
        ],
        faq: [
            {
                question: { fa: "PNG بهتر است یا JPG؟", en: "Is PNG or JPG better?" },
                answer: {
                    fa: "برای عکس، JPG یا WebP کوچک‌ترند. برای نوشته، نمودار، لوگو و تصویر شفاف، PNG بهتر است، چون کیفیت را کم نمی‌کند.",
                    en: "For photos, JPG or WebP are smaller. For text, charts, logos, and transparent pictures, PNG is better because it loses no quality.",
                },
            },
            {
                question: {
                    fa: "پس‌زمینه شفاف PNG در JPG چه می‌شود؟",
                    en: "What happens to a transparent PNG background in JPG?",
                },
                answer: {
                    fa: "JPG شفافیت ندارد. بخش‌های شفاف با رنگ زمینه‌ای که برمی‌گزینید (سفید به‌طور پیش‌فرض) پر می‌شوند.",
                    en: "JPG has no transparency. Transparent areas are filled with the background color you choose (white by default).",
                },
            },
        ],
    },
};
