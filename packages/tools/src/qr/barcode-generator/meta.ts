import type { ToolDefinition } from "@handyweb/core";

export const barcodeGeneratorMeta: ToolDefinition = {
    id: "barcode-generator",
    slug: "barcode-generator",
    aliases: ["barcode-maker", "ean13-generator", "code128-generator", "upc-generator"],
    category: "qr",
    alsoIn: [],
    related: ["qr-generator", "code-reader"],
    tags: ["barcode", "ean", "code128", "upc"],
    title: { fa: "ساخت بارکد", en: "Barcode Generator" },
    description: {
        fa: "بارکد Code 128، EAN-13، EAN-8 و UPC-A بسازید، با رقم کنترل خودکار، و آن را SVG برای چاپ یا PNG دانلود کنید. هیچ چیزی بارگذاری نمی‌شود.",
        en: "Make Code 128, EAN-13, EAN-8, and UPC-A barcodes, with the check digit added for you, and download them as SVG for print or PNG.",
    },
    keywords: {
        fa: ["ساخت بارکد", "بارکد ساز", "بارکد ean13", "بارکد کالا", "تولید بارکد"],
        en: [
            "barcode generator",
            "ean-13 generator",
            "code 128 generator",
            "upc barcode",
            "barcode maker",
        ],
    },
    presets: [
        {
            id: "ean13",
            title: { fa: "ساخت بارکد EAN-13", en: "EAN-13 Barcode Generator" },
            keywords: { fa: ["بارکد ean13", "بارکد کالا"], en: ["ean13", "ean-13 barcode"] },
            options: { format: "ean13" },
        },
        {
            id: "code128",
            title: { fa: "ساخت بارکد Code 128", en: "Code 128 Barcode Generator" },
            keywords: { fa: ["بارکد code128"], en: ["code128", "code 128 barcode"] },
            options: { format: "code128" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["image"],
    limits: { maxInputBytes: 200 },
    limitations: {
        fa: "Code 128 تنها نویسه‌های ASCII را می‌پذیرد، نه حروف فارسی. EAN-13 و UPC-A افزونه دو یا پنج رقمی ندارند. QR را با ابزار ساخت QR بسازید.",
        en: "Code 128 takes only ASCII characters, not Persian letters. EAN-13 and UPC-A have no 2- or 5-digit add-on. Use the QR Code Generator for QR codes.",
    },
    guide: {
        steps: [
            { fa: "نوع بارکد را برگزینید.", en: "Choose the barcode type." },
            { fa: "محتوا را بنویسید.", en: "Enter the content." },
            {
                fa: "اندازه را تنظیم کنید و SVG یا PNG را دانلود کنید.",
                en: "Set the size and download the SVG or PNG.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "کدام بارکد را برای کالا به کار ببرم؟",
                    en: "Which barcode is for products in shops?",
                },
                answer: {
                    fa: "EAN-13. شماره آن را باید از GS1 ایران بگیرید تا در فروشگاه‌ها پذیرفته شود. Code 128 برای کاربرد درون‌سازمانی مانند انبار و برچسب است.",
                    en: "EAN-13. You need a number from GS1 for shops to accept it. Code 128 is for internal use, such as stock and labels.",
                },
            },
        ],
    },
    example: "HW-2026-001",
};
