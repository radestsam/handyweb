import type { ToolDefinition } from "@handyweb/core";

export const pdfToImagesMeta: ToolDefinition = {
    id: "pdf-to-images",
    slug: "pdf-to-images",
    aliases: ["pdf-to-jpg", "pdf-to-png", "pdf-to-image", "convert-pdf-to-images"],
    category: "pdf",
    alsoIn: ["image"],
    related: ["images-to-pdf", "pdf-merge", "image-compressor"],
    tags: ["pdf", "image", "convert", "png", "jpg"],
    title: { fa: "تبدیل PDF به تصویر", en: "PDF to Images" },
    description: {
        fa: "برگه‌های یک PDF را با وضوح دلخواه به تصویر PNG یا JPG تبدیل کنید و جداگانه یا با هم در یک ZIP دانلود کنید. فایل از دستگاه شما بیرون نمی‌رود.",
        en: "Turn the pages of a PDF into PNG or JPG images at the resolution you choose, and download them one by one or as a ZIP. The file never leaves your device.",
    },
    keywords: {
        fa: [
            "تبدیل pdf به عکس",
            "تبدیل pdf به jpg",
            "تبدیل pdf به png",
            "عکس گرفتن از صفحات pdf",
            "تبدیل pdf به تصویر",
        ],
        en: [
            "pdf to jpg",
            "pdf to png",
            "pdf to image",
            "convert pdf pages to images",
            "pdf to jpg offline",
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
    outputKinds: ["image", "file"],
    limits: { maxFileBytes: 100_000_000 },
    limitations: {
        fa: "PDF تا ۱۰۰ مگابایت و در هر بار تا ۱۰۰ برگه. PDF قفل‌شده با گذرواژه پذیرفته نمی‌شود. تصویرهای JPEG 2000 و JBIG2 (در برخی فایل‌های اسکن‌شده) و فرم‌های XFA نشان داده نمی‌شوند. فونتی که در PDF گنجانده نشده، با فونت دستگاه جایگزین می‌شود. برگه‌ای که در این وضوح بیش از ۱۶.۷ مگاپیکسل شود، کوچک‌تر ساخته می‌شود.",
        en: "PDFs up to 100 MB, and up to 100 pages at a time. Password-protected PDFs are not accepted. JPEG 2000 and JBIG2 images (found in some scanned files) and XFA forms are not shown. A font that is not embedded in the PDF is replaced with a font of your device. A page larger than 16.7 megapixels at the chosen resolution is made smaller.",
    },
    guide: {
        steps: [
            { fa: "یک فایل PDF برگزینید یا رها کنید.", en: "Choose or drop a PDF file." },
            {
                fa: "قالب (PNG یا JPEG)، وضوح و برگه‌ها را برگزینید.",
                en: "Choose the format (PNG or JPEG), the resolution, and the pages.",
            },
            {
                fa: "«تبدیل به تصویر» را بزنید و هر تصویر یا همه را در یک ZIP دانلود کنید.",
                en: "Select Convert to images, then download each image or all of them as a ZIP.",
            },
        ],
        faq: [
            {
                question: { fa: "کدام وضوح را برگزینم؟", en: "Which resolution should I choose?" },
                answer: {
                    fa: "۷۲ dpi برای نمایش در صفحه، ۱۵۰ dpi برای خواندن متن و ۳۰۰ dpi برای چاپ. وضوح بیشتر فایل بزرگ‌تری می‌سازد.",
                    en: "72 dpi for screens, 150 dpi to read text easily, and 300 dpi for print. A higher resolution makes larger files.",
                },
            },
            {
                question: { fa: "PNG یا JPEG؟", en: "PNG or JPEG?" },
                answer: {
                    fa: "PNG برای متن و نمودار تیزتر است. JPEG برای برگه‌های پر از عکس فایل کوچک‌تری می‌سازد.",
                    en: "PNG keeps text and charts sharp. JPEG makes smaller files for pages that are mostly photos.",
                },
            },
        ],
    },
};
