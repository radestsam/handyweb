import type { ToolDefinition } from "@handyweb/core";

export const faviconGeneratorMeta: ToolDefinition = {
    id: "favicon-generator",
    slug: "favicon-generator",
    aliases: ["favicon-maker", "ico-generator", "favicon-ico", "app-icon-generator"],
    category: "image",
    alsoIn: ["developer"],
    related: ["image-resize", "image-converter"],
    tags: ["favicon", "ico", "icon", "pwa"],
    title: { fa: "ساخت فاوآیکون", en: "Favicon Generator" },
    seoTitle: {
        fa: "ساخت فاوآیکون (favicon.ico) از عکس",
        en: "Favicon Generator: favicon.ico from a Picture",
    },
    description: {
        fa: "از یک تصویر، favicon.ico، آیکون اپل، آیکون‌های ۱۹۲ و ۵۱۲ و فایل manifest بسازید و همه را در یک ZIP با کد HTML آن دانلود کنید.",
        en: "Make favicon.ico, the Apple icon, 192 and 512 icons, and a manifest from one picture, and download them in one ZIP with the HTML.",
    },
    keywords: {
        fa: ["ساخت فاوآیکون", "favicon", "آیکون سایت", "ساخت ico", "فاو آیکون"],
        en: [
            "favicon generator",
            "favicon maker",
            "ico generator",
            "apple touch icon",
            "site icon",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["image"],
    outputKinds: ["file"],
    limits: { maxInputBytes: 100_000_000 },
    limitations: {
        fa: "ورودی PNG، JPEG، WebP، GIF یا BMP است؛ SVG پشتیبانی نمی‌شود. ICO تصویرهای PNG دارد که ویندوز XP آن را نمی‌خواند. برای بهترین نتیجه، تصویری مربع و دست‌کم ۵۱۲ پیکسلی به کار ببرید.",
        en: "Input is PNG, JPEG, WebP, GIF, or BMP; SVG is not supported. The ICO holds PNG images, which Windows XP cannot read. For the best result, use a square picture of at least 512 pixels.",
    },
    guide: {
        steps: [
            { fa: "لوگو یا تصویر را برگزینید.", en: "Choose the logo or picture." },
            {
                fa: "پس‌زمینه، رنگ و فاصله از لبه را برگزینید.",
                en: "Choose the background, the color, and the padding.",
            },
            {
                fa: "ساخت آیکون‌ها را بزنید، ZIP را دانلود کنید و کد HTML را در سایت بگذارید.",
                en: "Click Make the icons, download the ZIP, and put the HTML in your site.",
            },
        ],
        faq: [
            {
                question: { fa: "فایل‌ها را کجا بگذارم؟", en: "Where do I put the files?" },
                answer: {
                    fa: "در ریشه سایت، کنار index.html. کد HTML به همین نشانی‌ها اشاره می‌کند.",
                    en: "In the root of your site, next to index.html. The HTML points to these addresses.",
                },
            },
        ],
    },
};
