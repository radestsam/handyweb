import type { ToolDefinition } from "@handyweb/core";

export const pdfCompressMeta: ToolDefinition = {
    id: "pdf-compress",
    slug: "pdf-compress",
    aliases: ["compress-pdf", "pdf-compressor", "reduce-pdf-size", "shrink-pdf"],
    category: "pdf",
    alsoIn: [],
    related: ["image-compressor", "pdf-pages", "pdf-metadata"],
    tags: ["pdf", "compress", "size"],
    title: { fa: "کم کردن حجم PDF", en: "PDF Compressor" },
    description: {
        fa: "حجم PDF را با فشرده‌سازی دوباره تصویرهای JPEG و پاک کردن بخش‌های بی‌کاربرد کم کنید. فایل از دستگاه شما بیرون نمی‌رود.",
        en: "Make a PDF smaller by compressing its JPEG images again and removing parts that are not used. The file never leaves your device.",
    },
    keywords: {
        fa: [
            "کم کردن حجم pdf",
            "فشرده سازی pdf",
            "کاهش حجم pdf",
            "کوچک کردن pdf",
            "فشرده‌سازی pdf آفلاین",
        ],
        en: [
            "compress pdf",
            "reduce pdf size",
            "shrink pdf",
            "pdf compressor offline",
            "make pdf smaller",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "experimental",
    status: "published",
    featured: false,
    inputKinds: ["file"],
    outputKinds: ["file"],
    limits: { maxFileBytes: 200_000_000 },
    limitations: {
        fa: "PDF تا ۲۰۰ مگابایت. PDF قفل‌شده با گذرواژه پذیرفته نمی‌شود. تنها تصویرهای JPEG رنگی و خاکستری دوباره فشرده می‌شوند؛ تصویرهای CMYK، PNG و اسکن‌های سیاه‌وسفید، فونت‌ها و متن تغییر نمی‌کنند. کوچک‌تر شدن فایل تضمین نمی‌شود. امضای دیجیتال پس از فشرده‌سازی دیگر معتبر نیست.",
        en: "PDFs up to 200 MB. Password-protected PDFs are not accepted. Only color and gray JPEG images are compressed again. CMYK images, PNG-type images, black-and-white scans, fonts, and text do not change. A smaller file is not guaranteed. A digital signature is no longer valid after compression.",
    },
    guide: {
        steps: [
            { fa: "یک فایل PDF برگزینید یا رها کنید.", en: "Choose or drop a PDF file." },
            {
                fa: "میزان فشرده‌سازی را برگزینید و «فشرده‌سازی PDF» را بزنید.",
                en: "Choose the compression level, then select Compress PDF.",
            },
            {
                fa: "اگر فایل کوچک‌تر شد، آن را دانلود کنید.",
                en: "If the file got smaller, download it.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا فایل من کوچک‌تر نشد؟",
                    en: "Why did my file not get smaller?",
                },
                answer: {
                    fa: "این ابزار بیشتر تصویرهای JPEG را کوچک می‌کند. PDFی که بیشتر متن، فونت یا تصویرهای دیگر دارد، یا از پیش فشرده است، کوچک‌تر نمی‌شود.",
                    en: "This tool mostly makes JPEG images smaller. A PDF that is mostly text, fonts, or other images, or that is compressed already, does not get smaller.",
                },
            },
        ],
    },
};
