import type { ToolDefinition } from "@handyweb/core";

export const pdfMergeMeta: ToolDefinition = {
    id: "pdf-merge",
    slug: "pdf-merge",
    aliases: ["merge-pdf", "combine-pdf", "pdf-merger", "join-pdf"],
    category: "pdf",
    alsoIn: [],
    related: ["image-compressor", "file-signature"],
    tags: ["pdf", "merge", "combine"],
    title: { fa: "ادغام PDF", en: "PDF Merger" },
    seoTitle: {
        fa: "ادغام PDF و یکی کردن چند فایل PDF",
        en: "PDF Merger: Combine PDF Files into One",
    },
    description: {
        fa: "ادغام PDF: چند فایل PDF را به ترتیب دلخواه در یک فایل یکی کنید.",
        en: "Combine several PDF files into one, in the order you choose.",
    },
    keywords: {
        fa: ["یکی کردن pdf", "ادغام pdf", "چسباندن pdf", "ترکیب فایل pdf", "ادغام چند pdf"],
        en: ["merge pdf", "combine pdf", "join pdf files", "pdf merger", "merge pdf offline"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "beta",
    status: "published",
    featured: false,
    inputKinds: ["file"],
    outputKinds: ["file"],
    limits: { maxInputBytes: 200_000_000, maxFileBytes: 100_000_000 },
    limitations: {
        fa: "تا ۵۰ فایل، هر کدام تا ۱۰۰ مگابایت و همه با هم تا ۲۰۰ مگابایت. PDF قفل‌شده با گذرواژه پذیرفته نمی‌شود. نشانک‌ها (فهرست کناری) و پیوندهای میان فایل‌ها نگه داشته نمی‌شوند و فرم‌های پرشدنی ممکن است درست کار نکنند. فایل خروجی فراداده فایل‌های ورودی (عنوان، نویسنده) را ندارد.",
        en: "Up to 50 files, each up to 100 MB, and 200 MB in total. Password-protected PDFs are not accepted. Bookmarks (the outline) and links between files are not kept, and fillable forms may not work. The output has no metadata (title, author) from the input files.",
    },
    guide: {
        steps: [
            {
                fa: "دو فایل PDF یا بیشتر را برگزینید یا رها کنید.",
                en: "Choose or drop two or more PDF files.",
            },
            {
                fa: "با دکمه‌های بالا و پایین، ترتیب فایل‌ها را درست کنید.",
                en: "Put the files in order with the up and down buttons.",
            },
            {
                fa: "«یکی کردن PDFها» را بزنید و فایل را دانلود کنید.",
                en: "Select Merge PDFs, then download the file.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "آیا کیفیت برگه‌ها کم می‌شود؟",
                    en: "Does the merge lower the quality?",
                },
                answer: {
                    fa: "نه. برگه‌ها همان‌گونه که هستند رونوشت می‌شوند و تصویرها دوباره فشرده نمی‌شوند.",
                    en: "No. The pages are copied as they are, and images are not compressed again.",
                },
            },
        ],
    },
};
