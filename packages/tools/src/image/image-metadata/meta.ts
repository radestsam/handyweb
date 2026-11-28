import type { ToolDefinition } from "@handyweb/core";

export const imageMetadataMeta: ToolDefinition = {
    id: "image-metadata",
    slug: "image-metadata",
    aliases: [
        "exif-viewer",
        "exif-remover",
        "remove-exif",
        "photo-metadata",
        "remove-gps-from-photo",
    ],
    category: "image",
    alsoIn: ["crypto"],
    related: ["image-compressor", "file-signature"],
    tags: ["image", "exif", "metadata", "privacy", "gps"],
    title: { fa: "دیدن و پاک کردن فراداده عکس (EXIF)", en: "Image Metadata Viewer and Remover" },
    seoTitle: {
        fa: "دیدن و پاک کردن فراداده عکس (EXIF) و موقعیت",
        en: "Image Metadata Viewer and Remover (EXIF and GPS)",
    },
    description: {
        fa: "دیدن فراداده عکس (EXIF) مانند مکان GPS، مدل دوربین و تاریخ در JPEG، PNG و WebP، و پاک کردن آن بدون افت کیفیت.",
        en: "See the GPS location, camera model, date, and other metadata in a JPEG, PNG, or WebP photo, and remove it without quality loss.",
    },
    keywords: {
        fa: ["پاک کردن exif", "حذف موقعیت مکانی عکس", "فراداده عکس", "متادیتا عکس", "اطلاعات عکس"],
        en: [
            "exif viewer",
            "remove exif",
            "remove gps from photo",
            "photo metadata",
            "image metadata",
            "exif remover",
        ],
    },
    presets: [
        {
            id: "remove",
            title: {
                fa: "پاک کردن EXIF و مکان از عکس",
                en: "Remove EXIF and Location From a Photo",
            },
            keywords: {
                fa: ["حذف exif", "حذف gps"],
                en: ["remove exif", "strip exif", "remove location"],
            },
            options: { mode: "remove" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["image"],
    outputKinds: ["image", "structured"],
    limits: { maxInputBytes: 100_000_000 },
    limitations: {
        fa: "تنها JPEG، PNG و WebP. برچسب‌های رایج EXIF نام برده می‌شوند و بقیه شمرده می‌شوند. داده سازنده (MakerNote) درون EXIF است و با آن پاک می‌شود. HEIC پشتیبانی نمی‌شود. فراداده‌ای که درون خود پیکسل‌هاست (مانند واترمارک) پاک نمی‌شود.",
        en: "JPEG, PNG, and WebP only. Common EXIF tags are named and the rest are counted. Maker data (MakerNote) is inside EXIF and is removed with it. HEIC is not supported. Data inside the pixels (such as a watermark) is not removed.",
    },
    guide: {
        steps: [
            { fa: "عکس را برگزینید.", en: "Choose a photo." },
            {
                fa: "فراداده و هشدار مکان را بخوانید.",
                en: "Read the metadata and the location warning.",
            },
            {
                fa: "پاک کردن فراداده را بزنید و فایل پاک را دانلود کنید.",
                en: "Click Remove the metadata and download the clean file.",
            },
        ],
        faq: [
            {
                question: { fa: "کیفیت عکس کم می‌شود؟", en: "Does the photo lose quality?" },
                answer: {
                    fa: "نه. ابزار عکس را دوباره فشرده نمی‌کند؛ تنها بلوک‌های فراداده را برمی‌دارد و داده تصویر را بدون تغییر کپی می‌کند.",
                    en: "No. The tool does not compress the photo again; it only takes out the metadata blocks and copies the image data without change.",
                },
            },
            {
                question: {
                    fa: "چرا برچسب جهت عکس می‌ماند؟",
                    en: "Why does the Orientation tag stay?",
                },
                answer: {
                    fa: "بسیاری از عکس‌های گوشی تنها با این برچسب درست نشان داده می‌شوند. این برچسب هیچ داده شخصی ندارد.",
                    en: "Many phone photos show upright only because of this tag. It holds no personal data.",
                },
            },
            {
                question: {
                    fa: "تلگرام و واتس‌اپ فراداده را پاک می‌کنند؟",
                    en: "Do Telegram and WhatsApp remove metadata?",
                },
                answer: {
                    fa: "وقتی عکس را به شکل عکس می‌فرستید، معمولاً بله. اما وقتی آن را به شکل فایل می‌فرستید، فراداده و مکان می‌مانند.",
                    en: "When you send it as a photo, usually yes. But when you send it as a file, the metadata and the location stay.",
                },
            },
        ],
    },
};
