import type { ToolDefinition } from "@handyweb/core";

export const imagesToPdfMeta: ToolDefinition = {
    id: "images-to-pdf",
    slug: "images-to-pdf",
    aliases: ["jpg-to-pdf", "image-to-pdf", "png-to-pdf", "photo-to-pdf", "convert-images-to-pdf"],
    category: "pdf",
    alsoIn: ["image"],
    related: ["pdf-merge", "image-compressor", "image-rotate"],
    tags: ["pdf", "image", "convert", "jpg"],
    title: { fa: "تبدیل عکس به PDF", en: "Image to PDF Converter" },
    seoTitle: {
        fa: "تبدیل عکس به PDF (JPG و PNG به PDF)",
        en: "Image to PDF Converter: JPG and PNG to PDF",
    },
    description: {
        fa: "تبدیل عکس به PDF: چند عکس JPG، PNG یا WebP را به ترتیب دلخواه در یک فایل PDF بگذارید، با صفحه A4، Letter یا هم‌اندازه عکس.",
        en: "Put JPG, PNG, or WebP pictures into one PDF in the order you choose, on A4, Letter, or image-sized pages.",
    },
    keywords: {
        fa: [
            "تبدیل عکس به pdf",
            "تبدیل jpg به pdf",
            "تبدیل تصویر به pdf",
            "ساخت pdf از عکس",
            "تبدیل png به pdf",
        ],
        en: [
            "jpg to pdf",
            "image to pdf",
            "png to pdf",
            "convert photos to pdf",
            "images to pdf offline",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "beta",
    status: "published",
    featured: false,
    inputKinds: ["image"],
    outputKinds: ["file"],
    limits: { maxInputBytes: 200_000_000, maxFileBytes: 50_000_000 },
    limitations: {
        fa: "تا ۱۰۰ تصویر، هر کدام تا ۵۰ مگابایت و ۵۰ مگاپیکسل، و همه با هم تا ۲۰۰ مگابایت. از GIF متحرک تنها نخستین فریم برداشته می‌شود. فایل PDF فراداده عکس‌ها (EXIF، مکان) را ندارد.",
        en: "Up to 100 images, each up to 50 MB and 50 megapixels, and 200 MB in total. An animated GIF gives its first frame only. The PDF has no metadata (EXIF, location) from the photos.",
    },
    guide: {
        steps: [
            {
                fa: "یک یا چند تصویر را برگزینید یا رها کنید.",
                en: "Choose or drop one or more images.",
            },
            {
                fa: "با دکمه‌های بالا و پایین، ترتیب برگه‌ها را درست کنید.",
                en: "Put the pages in order with the up and down buttons.",
            },
            {
                fa: "اندازه برگه و حاشیه را برگزینید، «ساخت PDF» را بزنید و فایل را دانلود کنید.",
                en: "Choose the page size and the margin, select Make PDF, then download the file.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "آیا کیفیت عکس‌ها کم می‌شود؟",
                    en: "Does the PDF lower the quality?",
                },
                answer: {
                    fa: "نه. JPEG و PNG همان‌گونه که هستند در PDF گذاشته می‌شوند. WebP، GIF و BMP بی‌افت به PNG تبدیل می‌شوند. JPEGی که چرخش EXIF دارد، صاف و دوباره با کیفیت بالا ذخیره می‌شود.",
                    en: "No. JPEG and PNG files go into the PDF as they are. WebP, GIF, and BMP become PNG with no loss. A JPEG with an EXIF turn is drawn upright and saved again at high quality.",
                },
            },
        ],
    },
};
