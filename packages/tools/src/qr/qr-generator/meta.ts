import type { ToolDefinition } from "@handyweb/core";

export const qrGeneratorMeta: ToolDefinition = {
    id: "qr-generator",
    slug: "qr-generator",
    aliases: ["qr-code-generator", "qr-code", "url-qr-generator", "text-to-qr"],
    category: "qr",
    alsoIn: [],
    related: ["url-encoding"],
    tags: ["qr", "qr code"],
    title: {
        fa: "ساخت کد QR",
        en: "QR Code Generator",
    },
    description: {
        fa: "برای یک نشانی یا هر نوشته، حتی فارسی، کد QR بسازید و آن را به شکل PNG یا SVG دانلود کنید. رنگ‌ها را برگزینید و هشدار خوانایی بگیرید.",
        en: "Make a QR code for a URL or any text, including Persian, and download it as PNG or SVG. Choose the colors and get a warning when they may not scan.",
    },
    keywords: {
        fa: ["کد qr", "ساخت کیوآر کد", "بارکد دوبعدی", "qr لینک", "کیو آر کد"],
        en: ["qr code generator", "qr code", "url to qr", "text to qr", "qr svg", "qr png"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["text"],
    outputKinds: ["image"],
    limits: { maxInputBytes: 4_000 },
    limitations: {
        fa: "یک کد QR تا حدود ۲٬۹۰۰ بایت را با سطح L در خود جا می‌دهد. هر حرف فارسی دو بایت است. گونه‌های ویژه مانند Wi-Fi و کارت ویزیت هنوز نیامده‌اند.",
        en: "One QR code holds up to about 2,900 bytes at level L. Each Persian letter takes two bytes. Special payloads such as Wi-Fi and contact cards are not available yet.",
    },
    guide: {
        steps: [
            {
                fa: "نشانی یا نوشته را بنویسید یا بچسبانید.",
                en: "Type or paste the URL or the text.",
            },
            {
                fa: "سطح بازیابی خطا و رنگ‌ها را برگزینید.",
                en: "Choose the error correction level and the colors.",
            },
            {
                fa: "کد را به شکل PNG یا SVG دانلود کنید و پیش از چاپ آن را با گوشی بیازمایید.",
                en: "Download the code as PNG or SVG, and test it with a phone before you print it.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "سطح بازیابی خطا چیست؟",
                    en: "What is the error correction level?",
                },
                answer: {
                    fa: "بخشی از کد که اگر پاک یا پوشیده شود، کد هنوز خوانده می‌شود: L تا ۷٪، M تا ۱۵٪، Q تا ۲۵٪ و H تا ۳۰٪. سطح بالاتر کد را بزرگ‌تر و پرنقش‌تر می‌کند.",
                    en: "How much of the code can be damaged or covered and still scan: L up to 7%, M up to 15%, Q up to 25%, and H up to 30%. A higher level makes the code larger and denser.",
                },
            },
            {
                question: {
                    fa: "PNG یا SVG؟",
                    en: "PNG or SVG?",
                },
                answer: {
                    fa: "برای وب و پیام‌رسان PNG. برای چاپ و طراحی SVG، چون در هر اندازه‌ای تیز می‌ماند.",
                    en: "PNG for the web and messaging apps. SVG for print and design, because it stays sharp at any size.",
                },
            },
            {
                question: {
                    fa: "کد QR من تاریخ انقضا دارد؟",
                    en: "Does my QR code expire?",
                },
                answer: {
                    fa: "نه. نوشته مستقیم درون کد است و هیچ سرویس یا لینک واسطه‌ای در کار نیست.",
                    en: "No. The text is stored in the code itself, with no service or redirect link in between.",
                },
            },
        ],
    },
    example: "https://handyweb.ir/fa/",
};
