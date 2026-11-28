import type { ToolDefinition } from "@handyweb/core";

export const htmlPreviewMeta: ToolDefinition = {
    id: "html-preview",
    slug: "html-preview",
    aliases: ["html-viewer", "html-previewer", "html-editor", "html-sandbox"],
    category: "developer",
    alsoIn: [],
    related: ["html-formatter", "html-entities"],
    tags: ["html", "preview"],
    title: { fa: "پیش‌نمایش و اجرای کد HTML", en: "HTML Previewer" },
    seoTitle: {
        fa: "پیش‌نمایش و اجرای کد HTML در مرورگر",
        en: "HTML Previewer: Run HTML Code in Your Browser",
    },
    description: {
        fa: "پیش نمایش HTML همزمان: کد HTML را بنویسید یا بچسبانید و نتیجه را در یک قاب امن و بسته ببینید. هیچ چیزی از اینترنت بارگیری نمی‌شود.",
        en: "Type or paste HTML and see a live preview in a safe, sandboxed frame. Nothing is loaded from the internet.",
    },
    keywords: {
        fa: ["پیش نمایش html", "اجرای html", "ویرایشگر html", "html آنلاین"],
        en: ["html preview", "html viewer", "html editor", "render html", "html sandbox"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["structured"],
    limits: { maxInputBytes: 2_000_000 },
    limitations: {
        fa: "تصویرها، فونت‌ها، اسکریپت‌ها و استایل‌های بیرونی بارگیری نمی‌شوند؛ تنها محتوای درون کد (inline و data:) نشان داده می‌شود. اسکریپت‌ها تنها با گزینه «اجرای اسکریپت» و در قاب بسته اجرا می‌شوند.",
        en: "Remote images, fonts, scripts, and stylesheets do not load; only content inside the code (inline and data:) shows. Scripts run only with the “Run inline scripts” option, inside the sandboxed frame.",
    },
    guide: {
        steps: [
            { fa: "کد HTML را بچسبانید.", en: "Paste the HTML code." },
            { fa: "پیش‌نمایش را ببینید.", en: "Look at the preview." },
            {
                fa: "اگر کد اسکریپت دارد و به آن اعتماد دارید، اجرای اسکریپت را روشن کنید.",
                en: "If the code has scripts and you trust it, turn on inline scripts.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "اجرای HTML ناشناس ایمن است؟",
                    en: "Is it safe to preview unknown HTML?",
                },
                answer: {
                    fa: "قاب پیش‌نمایش sandbox است و به این صفحه، کوکی‌ها یا حافظه مرورگر دسترسی ندارد. یک Content-Security-Policy همه درخواست‌های شبکه را می‌بندد، پس کد نمی‌تواند داده‌ای بفرستد.",
                    en: "The preview frame is sandboxed and cannot reach this page, cookies, or browser storage. A Content-Security-Policy blocks all network requests, so the code cannot send any data.",
                },
            },
        ],
    },
    example: '<h1>سلام</h1>\n<p style="color:#bc4a3c">این یک <b>پیش‌نمایش</b> است.</p>',
};
