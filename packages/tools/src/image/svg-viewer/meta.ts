import type { ToolDefinition } from "@handyweb/core";

export const svgViewerMeta: ToolDefinition = {
    id: "svg-viewer",
    slug: "svg-viewer",
    aliases: ["svg-preview", "view-svg", "svg-to-png", "svg-sanitizer"],
    category: "image",
    alsoIn: ["developer"],
    related: ["svg-optimizer", "favicon-generator", "image-converter"],
    tags: ["svg", "preview", "png", "sanitize"],
    title: { fa: "نمایش امن SVG و تبدیل به PNG", en: "SVG Viewer and SVG to PNG" },
    seoTitle: {
        fa: "نمایش امن SVG و تبدیل به PNG آنلاین",
        en: "SVG Viewer and SVG to PNG Converter Online",
    },
    description: {
        fa: "نمایش SVG به شکل امن، پیدا و پاک کردن بخش‌های خطرناک مانند اسکریپت، و تبدیل SVG به PNG با اندازه دلخواه.",
        en: "View SVG code or a file safely, find and remove unsafe parts such as scripts, and convert it to PNG at any size.",
    },
    keywords: {
        fa: ["نمایش svg", "تبدیل svg به png", "پیش نمایش svg", "باز کردن svg"],
        en: ["svg viewer", "svg to png", "svg preview", "view svg online", "svg sanitizer"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text", "file"],
    outputKinds: ["image", "text"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "اسکریپت، انیمیشن اسکریپتی، HTML درون SVG و فایل‌های اینترنتی (تصویر و فونت) برداشته می‌شوند، پس برخی SVGها کمی دیگرگون دیده می‌شوند. فونت‌هایی که روی دستگاه نیستند، با فونت دیگری نشان داده می‌شوند.",
        en: "Scripts, script animation, HTML inside the SVG, and files from the internet (images and fonts) are removed, so some SVGs look a little different. Fonts that are not on the device show in another font.",
    },
    guide: {
        steps: [
            {
                fa: "کد SVG را بچسبانید یا فایل را برگزینید.",
                en: "Paste the SVG code or choose the file.",
            },
            { fa: "پیش‌نمایش و هشدارها را ببینید.", en: "Look at the preview and the warnings." },
            { fa: "PNG یا SVG پاک را دانلود کنید.", en: "Download the PNG or the clean SVG." },
        ],
        faq: [
            {
                question: { fa: "SVG می‌تواند خطرناک باشد؟", en: "Can an SVG be dangerous?" },
                answer: {
                    fa: "بله. SVG می‌تواند اسکریپت داشته باشد و اگر درون یک صفحه گذاشته شود، اجرا شود. این ابزار SVG را تنها به شکل تصویر نشان می‌دهد و نسخه پاک آن را می‌سازد.",
                    en: "Yes. An SVG can hold a script that runs when the SVG is put inside a page. This tool shows the SVG only as an image and makes a clean copy.",
                },
            },
        ],
    },
    example:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#bc4a3c"/><path d="M10 9v14M22 9v14M10 16h12" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></svg>',
};
