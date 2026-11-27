import type { ToolDefinition } from "@handyweb/core";

export const codeReaderMeta: ToolDefinition = {
    id: "code-reader",
    slug: "code-reader",
    aliases: ["qr-reader", "qr-scanner", "barcode-scanner", "barcode-reader", "scan-qr-code"],
    category: "qr",
    alsoIn: [],
    related: ["qr-generator", "barcode-generator"],
    tags: ["qr", "barcode", "scanner", "camera"],
    title: { fa: "خواندن QR و بارکد", en: "QR Code and Barcode Reader" },
    description: {
        fa: "کد QR یا بارکد را با دوربین یا از یک عکس بخوانید؛ پیوند، رمز Wi-Fi، شماره و متن را ببینید. تصویر از دستگاه شما بیرون نمی‌رود.",
        en: "Read a QR code or a barcode with the camera or from a picture, and see the link, Wi-Fi password, number, or text. Nothing leaves your device.",
    },
    keywords: {
        fa: [
            "اسکن کیو آر کد",
            "خواندن qr",
            "بارکد خوان",
            "اسکنر qr آنلاین",
            "خواندن رمز وای فای از qr",
        ],
        en: [
            "qr code reader",
            "qr scanner",
            "barcode scanner",
            "scan qr code from image",
            "read qr online",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["image"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 100_000_000 },
    limitations: {
        fa: "بارکد (EAN، Code 128 و دیگران) تنها در مرورگرهایی خوانده می‌شود که بارکدخوان دارند، مانند Chrome، Edge و مرورگرهای اندروید. در Firefox و Safari تنها QR خوانده می‌شود. هر بار یک کد خوانده می‌شود.",
        en: "Barcodes (EAN, Code 128, and others) are read only in browsers with a barcode reader, such as Chrome, Edge, and Android browsers. In Firefox and Safari, only QR codes are read. One code is read at a time.",
    },
    guide: {
        steps: [
            {
                fa: "دوربین را روشن کنید و اجازه دهید، یا عکسی از کد را برگزینید.",
                en: "Turn on the camera and allow it, or choose a picture of the code.",
            },
            { fa: "کد را جلوی دوربین بگیرید.", en: "Hold the code in front of the camera." },
            {
                fa: "محتوا را کپی کنید یا پیوند را پس از خواندن باز کنید.",
                en: "Copy the content, or open the link after you read it.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "تصویر دوربین جایی فرستاده می‌شود؟",
                    en: "Is the camera picture sent anywhere?",
                },
                answer: {
                    fa: "نه. فریم‌ها تنها در مرورگر شما خوانده می‌شوند و دوربین پس از پیدا شدن کد یا بستن صفحه خاموش می‌شود.",
                    en: "No. The frames are read only in your browser, and the camera turns off when a code is found or the page closes.",
                },
            },
        ],
    },
};
