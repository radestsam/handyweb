import type { ToolDefinition } from "@handyweb/core";

export const pdfMetadataMeta: ToolDefinition = {
    id: "pdf-metadata",
    slug: "pdf-metadata",
    aliases: [
        "pdf-metadata-editor",
        "pdf-metadata-remover",
        "remove-pdf-metadata",
        "pdf-properties",
    ],
    category: "pdf",
    alsoIn: [],
    related: ["image-metadata", "pdf-merge", "pdf-to-images"],
    tags: ["pdf", "metadata", "privacy"],
    title: { fa: "ویرایش و پاک کردن فراداده PDF", en: "PDF Metadata Editor" },
    description: {
        fa: "عنوان، نویسنده، برنامه سازنده و تاریخ‌های یک PDF را ببینید، ویرایش کنید یا همه را پاک کنید. فایل از دستگاه شما بیرون نمی‌رود.",
        en: "See, edit, or remove the title, author, creator app, and dates of a PDF. The file never leaves your device.",
    },
    keywords: {
        fa: [
            "پاک کردن فراداده pdf",
            "ویرایش مشخصات pdf",
            "تغییر نویسنده pdf",
            "حذف متادیتا pdf",
            "عنوان pdf",
        ],
        en: [
            "remove pdf metadata",
            "edit pdf metadata",
            "change pdf author",
            "pdf properties editor",
            "pdf title",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "beta",
    status: "published",
    featured: false,
    inputKinds: ["file"],
    outputKinds: ["file", "structured"],
    limits: { maxFileBytes: 100_000_000 },
    limitations: {
        fa: "PDF تا ۱۰۰ مگابایت. PDF قفل‌شده با گذرواژه پذیرفته نمی‌شود. تنها فراداده سند پاک می‌شود: نام‌ها و داده‌های درون برگه‌ها، فایل‌های پیوست، یادداشت‌ها و فرم‌ها دست نمی‌خورند. امضای دیجیتال پس از ذخیره دیگر معتبر نیست.",
        en: "PDFs up to 100 MB. Password-protected PDFs are not accepted. Only document metadata is removed: names and data on the pages, attached files, comments, and forms do not change. A digital signature is no longer valid after the file is saved.",
    },
    guide: {
        steps: [
            { fa: "یک فایل PDF برگزینید یا رها کنید.", en: "Choose or drop a PDF file." },
            {
                fa: "فیلدها را ویرایش کنید، یا «پاک کردن همه فراداده» را بزنید.",
                en: "Edit the fields, or select Remove all metadata.",
            },
            { fa: "فایل تازه را دانلود کنید.", en: "Download the new file." },
        ],
        faq: [
            {
                question: {
                    fa: "چرا فراداده PDF را پاک کنم؟",
                    en: "Why remove the metadata of a PDF?",
                },
                answer: {
                    fa: "PDF ممکن است نام شما، نام شرکت، برنامه و تاریخ ساخت را نگه دارد. پیش از فرستادن فایل به دیگران، این داده‌ها را پاک کنید.",
                    en: "A PDF can hold your name, your company, the app, and the date it was made. Remove them before you send the file to others.",
                },
            },
            {
                question: {
                    fa: "آیا نسخه‌های کهنه فراداده در فایل می‌مانند؟",
                    en: "Do old copies of the metadata stay in the file?",
                },
                answer: {
                    fa: "نه. فایل دوباره نوشته می‌شود و بخش‌هایی که به کار نمی‌روند، از جمله فراداده XMP و ویرایش‌های کهنه، برداشته می‌شوند.",
                    en: "No. The file is written again, and the parts that are not used, such as XMP metadata and old revisions, are removed.",
                },
            },
        ],
    },
};
