import type { ToolDefinition } from "@handyweb/core";

export const markdownEditorMeta: ToolDefinition = {
    id: "markdown-editor",
    slug: "markdown-editor",
    aliases: ["markdown-preview", "markdown-to-html", "md-editor", "markdown-viewer"],
    category: "text",
    alsoIn: ["developer"],
    related: ["html-preview", "html-formatter"],
    tags: ["markdown", "editor", "preview"],
    title: {
        fa: "ویرایشگر و پیش‌نمایش Markdown",
        en: "Markdown Editor and Preview",
    },
    description: {
        fa: "Markdown بنویسید و همزمان پیش‌نمایش آن را، راست‌به‌چپ یا چپ‌به‌راست، ببینید. HTML پاک‌سازی‌شده را کپی یا به شکل فایل دانلود کنید.",
        en: "Write Markdown and see a live preview, right to left or left to right. Copy the sanitized HTML or download it as a file.",
    },
    keywords: {
        fa: ["مارک داون", "markdown", "ویرایشگر markdown", "تبدیل markdown به html"],
        en: [
            "markdown editor",
            "markdown preview",
            "markdown to html",
            "md editor",
            "github markdown",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text", "file"],
    limits: { maxInputBytes: 2_000_000 },
    limitations: {
        fa: "Markdown گیت‌هاب (جدول، فهرست کار) پشتیبانی می‌شود، اما فرمول ریاضی و نمودار نه. تصویرهای اینترنتی در پیش‌نمایش بارگیری نمی‌شوند. نوشته ذخیره نمی‌شود: پیش از بستن صفحه آن را دانلود کنید.",
        en: "GitHub Markdown (tables, task lists) is supported, but not math or diagrams. Internet images do not load in the preview. The text is not saved: download it before you close the page.",
    },
    guide: {
        steps: [
            { fa: "Markdown بنویسید یا بچسبانید.", en: "Write or paste Markdown." },
            { fa: "پیش‌نمایش را ببینید.", en: "Look at the preview." },
            {
                fa: "HTML را کپی یا فایل را دانلود کنید.",
                en: "Copy the HTML or download the file.",
            },
        ],
        faq: [
            {
                question: { fa: "نوشته من ذخیره می‌شود؟", en: "Is my text saved?" },
                answer: {
                    fa: "نه. HandyWeb هیچ نوشته‌ای را نگه نمی‌دارد، حتی در مرورگر. برای نگه داشتن، فایل Markdown را دانلود کنید.",
                    en: "No. HandyWeb keeps no text, not even in the browser. To keep it, download the Markdown file.",
                },
            },
        ],
    },
    example: "# سلام\n\nاین یک **نمونه** است.\n\n- یک\n- دو",
};
