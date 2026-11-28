import type { ToolDefinition } from "@handyweb/core";

export const pdfTextMeta: ToolDefinition = {
    id: "pdf-text",
    slug: "pdf-text",
    aliases: ["pdf-to-text", "pdf-text-extractor", "extract-text-from-pdf", "pdf-to-txt"],
    category: "pdf",
    alsoIn: ["text"],
    related: ["pdf-to-images", "pdf-metadata", "text-counter"],
    tags: ["pdf", "text", "extract", "txt"],
    title: { fa: "استخراج متن از PDF", en: "PDF Text Extractor" },
    seoTitle: {
        fa: "استخراج متن از PDF و تبدیل PDF به متن",
        en: "PDF Text Extractor: PDF to Text Online",
    },
    description: {
        fa: "استخراج متن از PDF: متن همه صفحه‌ها را بیرون بکشید، کپی کنید یا در فایل TXT دانلود کنید.",
        en: "Pull the text out of every page of a PDF, then copy it or download it as a TXT file.",
    },
    keywords: {
        fa: [
            "استخراج متن از pdf",
            "تبدیل pdf به متن",
            "کپی متن pdf",
            "تبدیل pdf به txt",
            "متن pdf فارسی",
        ],
        en: [
            "pdf to text",
            "extract text from pdf",
            "pdf to txt",
            "copy text from pdf",
            "pdf text extractor offline",
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
    outputKinds: ["text", "file"],
    limits: { maxFileBytes: 100_000_000 },
    limitations: {
        fa: "PDF تا ۱۰۰ مگابایت و تا ۱۰۰۰ برگه. PDF قفل‌شده با گذرواژه پذیرفته نمی‌شود. نوشته درون تصویرها (PDF اسکن‌شده) خوانده نمی‌شود. ترتیب متن ستون‌ها و جدول‌ها و ترتیب واژه‌های فارسی در برخی PDFها ممکن است به‌هم ریخته باشد، چون به ساختار درونی فایل بستگی دارد.",
        en: "PDFs up to 100 MB and 1,000 pages. Password-protected PDFs are not accepted. Text inside images (scanned PDFs) is not read. In some PDFs, columns, tables, or the order of Persian words can come out mixed up, because the order depends on how the file was made.",
    },
    guide: {
        steps: [
            { fa: "یک فایل PDF برگزینید یا رها کنید.", en: "Choose or drop a PDF file." },
            {
                fa: "متن برگه‌ها خوانده و نشان داده می‌شود.",
                en: "The text of the pages is read and shown.",
            },
            {
                fa: "متن را کپی کنید یا فایل TXT را دانلود کنید.",
                en: "Copy the text, or download it as a TXT file.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا متن PDF من خالی است؟",
                    en: "Why is the text of my PDF empty?",
                },
                answer: {
                    fa: "برگه‌های PDF اسکن‌شده تصویرند و نوشته‌ای در خود ندارند. این ابزار OCR ندارد.",
                    en: "The pages of a scanned PDF are pictures with no text in them. This tool has no OCR.",
                },
            },
        ],
    },
};
