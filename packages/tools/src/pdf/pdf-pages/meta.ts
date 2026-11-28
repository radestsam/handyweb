import type { ToolDefinition } from "@handyweb/core";

export const pdfPagesMeta: ToolDefinition = {
    id: "pdf-pages",
    slug: "pdf-pages",
    aliases: [
        "split-pdf",
        "extract-pdf-pages",
        "rotate-pdf",
        "delete-pdf-pages",
        "reorder-pdf-pages",
        "pdf-page-organizer",
    ],
    category: "pdf",
    alsoIn: [],
    related: ["pdf-merge", "pdf-to-images", "images-to-pdf"],
    tags: ["pdf", "split", "rotate", "extract", "reorder"],
    title: { fa: "ویرایش برگه‌های PDF", en: "PDF Page Organizer" },
    description: {
        fa: "برگه‌های PDF را ببینید، بچرخانید، جابه‌جا کنید، بردارید، جدا کنید یا هر برگه را فایلی جداگانه کنید. فایل از دستگاه شما بیرون نمی‌رود.",
        en: "See the pages of a PDF, then turn, reorder, remove, extract, or split them into single files. The file never leaves your device.",
    },
    keywords: {
        fa: [
            "جدا کردن صفحات pdf",
            "چرخاندن pdf",
            "حذف صفحه pdf",
            "جابه‌جایی صفحات pdf",
            "تقسیم pdf",
        ],
        en: [
            "split pdf",
            "rotate pdf pages",
            "delete pdf pages",
            "extract pdf pages",
            "reorder pdf pages",
        ],
    },
    presets: [],
    execution: "worker",
    privacy: "local",
    networkUse: "none",
    maturity: "beta",
    status: "published",
    featured: false,
    inputKinds: ["file"],
    outputKinds: ["file"],
    limits: { maxFileBytes: 100_000_000 },
    limitations: {
        fa: "PDF تا ۱۰۰ مگابایت و ۳۰۰ برگه. PDF قفل‌شده با گذرواژه پذیرفته نمی‌شود. نشانک‌ها (فهرست کناری) و پیوندهای میان برگه‌ها نگه داشته نمی‌شوند و فرم‌های پرشدنی ممکن است درست کار نکنند. فایل خروجی فراداده فایل ورودی را ندارد.",
        en: "PDFs up to 100 MB and 300 pages. Password-protected PDFs are not accepted. Bookmarks (the outline) and links between pages are not kept, and fillable forms may not work. The output has no metadata from the input file.",
    },
    guide: {
        steps: [
            { fa: "یک فایل PDF برگزینید یا رها کنید.", en: "Choose or drop a PDF file." },
            {
                fa: "برگه‌ها را بچرخانید، جابه‌جا کنید یا بردارید. برای جدا کردن، برگه‌ها را گزینش کنید.",
                en: "Turn, move, or remove pages. To extract pages, select them.",
            },
            {
                fa: "«ذخیره PDF»، «جدا کردن گزیده‌ها» یا «جدا کردن هر برگه» را بزنید و فایل را دانلود کنید.",
                en: "Select Save PDF, Extract selected, or Split into single pages, then download the file.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "آیا چرخاندن کیفیت را کم می‌کند؟",
                    en: "Does turning a page lower the quality?",
                },
                answer: {
                    fa: "نه. تنها نشانه چرخش برگه تغییر می‌کند و محتوای برگه دست نمی‌خورد.",
                    en: "No. Only the turn setting of the page changes. The content of the page stays the same.",
                },
            },
        ],
    },
};
