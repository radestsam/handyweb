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
        seoTitle: {
            fa: "متن: شمارش کلمات، مقایسه و پاک‌سازی متن",
            en: "Text Tools: Count Words, Compare, and Clean Text",
        },
        description: {
            fa: "شمارش کلمات و حروف، مقایسه دو متن، حذف خطوط تکراری، مرتب‌سازی و پاک‌سازی متن.",
            en: "Count words and characters, compare two texts, remove duplicate lines, and sort or clean up text.",
        },
    },
    {
        id: "persian",
        slug: "persian",
        order: 20,
        title: { fa: "فارسی", en: "Persian" },
        seoTitle: {
            fa: "فارسی: ابزارهای متن فارسی و تبدیل تاریخ شمسی",
            en: "Persian Text Tools and Jalali Date Converter",
        },
        description: {
            fa: "یکسان‌سازی متن فارسی، ی و ک عربی، نیم‌فاصله، اعداد فارسی و تبدیل تاریخ شمسی و میلادی.",
            en: "Persian text normalization, Arabic yeh and kaf, ZWNJ, Persian digits, and Jalali to Gregorian dates.",
        },
    },
    {
        id: "encoding",
        slug: "encoding",
        order: 30,
        title: { fa: "کدگذاری", en: "Encoding" },
        seoTitle: {
            fa: "کدگذاری: ابزارهای Base64، URL و یونیکد",
            en: "Encoding Tools: Base64, URL, HTML, and Unicode",
        },
        description: {
            fa: "رمزگذاری و رمزگشایی Base64، URL، موجودیت‌های HTML، یونیکد، هگز و باینری.",
            en: "Encode and decode Base64, URLs, HTML entities, Unicode escapes, hex, and binary.",
        },
    },
    {
        id: "crypto",
        slug: "crypto",
        order: 40,
        title: { fa: "هش و رمزنگاری", en: "Hashing and Cryptography" },
        seoTitle: {
            fa: "هش و رمزنگاری: ساخت هش، رمز عبور و توکن",
            en: "Hashing and Cryptography: Hash and Password Tools",
        },
        description: {
            fa: "ساخت هش SHA-256، HMAC، رمز عبور قوی، توکن تصادفی و کد ورود دومرحله‌ای.",
            en: "SHA-256 hashes, HMAC, strong passwords, random tokens, and two-factor (TOTP) codes.",
        },
    },
    {
        id: "developer",
        slug: "developer",
        order: 50,
        title: { fa: "برنامه‌نویسی", en: "Developer" },
        seoTitle: {
            fa: "برنامه‌نویسی: فرمت JSON، XML و ابزار توسعه",
            en: "Developer Tools: JSON, XML, Regex, and More",
        },
        description: {
            fa: "فرمت و اعتبارسنجی JSON، XML، YAML و SQL، تست Regex، رمزگشایی JWT و تبدیل تایم استمپ.",
            en: "Format and validate JSON, XML, YAML, and SQL, test regex, decode JWTs, and convert timestamps.",
        },
    },
    {
        id: "image",
        slug: "image",
        order: 60,
        title: { fa: "تصویر", en: "Images" },
        seoTitle: {
            fa: "تصویر: کم کردن حجم، برش و تغییر اندازه عکس",
            en: "Images: Compress, Resize, and Crop Photos Online",
        },
        description: {
            fa: "کم کردن حجم عکس، تغییر اندازه، برش، چرخاندن، تبدیل فرمت و پاک کردن فراداده عکس.",
            en: "Compress, resize, crop, rotate, and convert images, and remove photo metadata (EXIF).",
        },
    },
    {
        id: "pdf",
        slug: "pdf",
        order: 70,
        title: { fa: "PDF", en: "PDF" },
        seoTitle: {
            fa: "PDF: ادغام، کم کردن حجم و تبدیل PDF آنلاین",
            en: "PDF Tools: Merge, Compress, and Convert PDF",
        },
        description: {
            fa: "ادغام PDF، کم کردن حجم PDF، جدا کردن صفحات، تبدیل عکس به PDF و PDF به عکس.",
            en: "Merge, compress, and split PDF files, and convert images to PDF and PDF to images.",
        },
    },
    {
        id: "qr",
        slug: "qr",
        order: 80,
        title: { fa: "QR و بارکد", en: "QR Codes and Barcodes" },
        seoTitle: {
            fa: "QR و بارکد: ساخت و اسکن کیو آر کد و بارکد",
            en: "QR Codes and Barcodes: Generator and Reader",
        },
        description: {
            fa: "ساخت کد QR برای لینک و متن، ساخت بارکد، و اسکن QR و بارکد با دوربین یا عکس.",
            en: "Make QR codes for links and text, make barcodes, and scan QR codes and barcodes with a camera.",
        },
    },
    {
        id: "calculators",
        slug: "calculators",
        order: 90,
        title: { fa: "ماشین‌حساب و مبدل", en: "Calculators and Converters" },
        seoTitle: {
            fa: "ماشین‌حساب و مبدل: درصد، تخفیف و تبدیل واحد",
            en: "Calculators and Converters: Units, Percent, Dates",
        },
        description: {
            fa: "محاسبه درصد و تخفیف، تبدیل واحد، فاصله دو تاریخ، مالیات بر ارزش افزوده و منطقه زمانی.",
            en: "Percentage, discount, and VAT calculators, unit and time zone converters, and date differences.",
        },
    },
    {
        id: "network",
        slug: "network",
        order: 100,
        title: { fa: "شبکه", en: "Network" },
        seoTitle: {
            fa: "شبکه: محاسبه ساب‌نت IP و کدهای وضعیت HTTP",
            en: "Network Tools: Subnet Calculator and HTTP Codes",
        },
        description: {
            fa: "محاسبه ساب‌نت IP و CIDR، بازه‌های IP خصوصی، فرمت مک آدرس و کدهای وضعیت HTTP.",
            en: "IP subnet (CIDR) calculator, private IP ranges, MAC address formats, and HTTP status codes.",
        },
    },
];
