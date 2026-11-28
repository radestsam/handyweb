import type { ToolDefinition } from "@handyweb/core";

export const pdfWatermarkMeta: ToolDefinition = {
    id: "pdf-watermark",
    slug: "pdf-watermark",
    aliases: ["add-watermark-to-pdf", "watermark-pdf", "pdf-stamp"],
    category: "pdf",
    alsoIn: [],
    related: ["image-watermark", "pdf-metadata", "pdf-merge"],
    tags: ["pdf", "watermark", "stamp"],
    title: { fa: "افزودن واترمارک به PDF", en: "PDF Watermark" },
    seoTitle: {
        fa: "افزودن واترمارک به PDF با متن فارسی",
        en: "PDF Watermark: Add Text to Every Page",
    },
    description: {
        fa: "افزودن واترمارک به PDF: متنی مانند «محرمانه» یا نام خود را روی همه صفحه‌ها بگذارید، با رنگ، زاویه، اندازه و پررنگی دلخواه.",
        en: "Put a text such as CONFIDENTIAL or your name on every page of a PDF, with the color, angle, size, and opacity you choose.",
    },
    keywords: {
        fa: [
            "واترمارک pdf",
            "افزودن واترمارک به pdf",
            "مهر روی pdf",
            "نوشتن محرمانه روی pdf",
            "واترمارک فارسی pdf",
        ],
        en: [
            "watermark pdf",
            "add watermark to pdf",
            "pdf confidential stamp",
            "pdf text watermark",
            "watermark pdf offline",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "beta",
    status: "published",
    featured: false,
    inputKinds: ["file", "text"],
    outputKinds: ["file"],
    limits: { maxFileBytes: 100_000_000 },
    limitations: {
        fa: "PDF تا ۱۰۰ مگابایت و متن تا ۱۰۰ نویسه. PDF قفل‌شده با گذرواژه پذیرفته نمی‌شود. واترمارک تصویری از متن است، پس در جستجوی PDF پیدا نمی‌شود، و با یک ویرایشگر PDF پاک‌شدنی است. امضای دیجیتال پس از افزودن واترمارک دیگر معتبر نیست.",
        en: "PDFs up to 100 MB and text up to 100 characters. Password-protected PDFs are not accepted. The watermark is a picture of the text, so a PDF search does not find it, and a PDF editor can remove it. A digital signature is no longer valid after the watermark is added.",
    },
    guide: {
        steps: [
            { fa: "یک فایل PDF برگزینید یا رها کنید.", en: "Choose or drop a PDF file." },
            {
                fa: "متن، رنگ، چینش، زاویه، اندازه و پررنگی را برگزینید.",
                en: "Choose the text, color, layout, angle, size, and opacity.",
            },
            {
                fa: "«افزودن واترمارک» را بزنید و فایل را دانلود کنید.",
                en: "Select Add watermark, then download the file.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "آیا واترمارک فارسی درست نشان داده می‌شود؟",
                    en: "Does a Persian watermark show correctly?",
                },
                answer: {
                    fa: "بله. مرورگر متن را با فونت فارسی سایت می‌کشد و حروف درست به هم می‌چسبند.",
                    en: "Yes. The browser draws the text with the Persian font of the site, so the letters join correctly.",
                },
            },
        ],
    },
};
