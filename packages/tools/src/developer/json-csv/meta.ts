import type { ToolDefinition } from "@handyweb/core";

export const jsonCsvMeta: ToolDefinition = {
    id: "json-csv",
    slug: "json-csv",
    aliases: ["json-to-csv", "csv-to-json", "json-csv-converter", "json-to-excel"],
    category: "developer",
    alsoIn: [],
    related: ["json-formatter", "json-yaml"],
    tags: ["json", "csv", "excel", "convert"],
    title: {
        fa: "تبدیل JSON به CSV و برعکس",
        en: "JSON and CSV Converter",
    },
    description: {
        fa: "یک آرایه JSON را به CSV برای Excel برگردانید، با فارسی درست، یا یک فایل CSV را به JSON درآورید.",
        en: "Convert a JSON array to CSV for Excel, with Persian shown correctly, or a CSV file to JSON.",
    },
    keywords: {
        fa: ["تبدیل json به csv", "تبدیل csv به json", "json به اکسل", "csv فارسی"],
        en: ["json to csv", "csv to json", "json to excel", "csv converter"],
    },
    presets: [
        {
            id: "csv-to-json",
            title: { fa: "تبدیل CSV به JSON", en: "CSV to JSON Converter" },
            keywords: { fa: ["csv به json"], en: ["csv to json"] },
            options: { direction: "csv-to-json" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text", "file"],
    limits: { maxInputBytes: 10_000_000 },
    limitations: {
        fa: "JSON باید آرایه‌ای از شیءها یا آرایه‌ای از آرایه‌ها باشد. در خواندن CSV، تنها شماره‌های ساده شماره خوانده می‌شوند و کدهایی مانند 007 نوشته می‌مانند.",
        en: "The JSON must be an array of objects or an array of arrays. When reading CSV, only plain numbers become numbers, and codes such as 007 stay text.",
    },
    guide: {
        steps: [
            { fa: "سو و جداکننده را برگزینید.", en: "Choose the direction and the delimiter." },
            { fa: "JSON یا CSV را بچسبانید.", en: "Paste the JSON or the CSV." },
            {
                fa: "خروجی را کپی کنید یا فایل را دانلود کنید.",
                en: "Copy the output or download the file.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا فارسی در Excel به هم ریخته دیده می‌شود؟",
                    en: "Why does Persian look broken in Excel?",
                },
                answer: {
                    fa: "Excel فایل CSV را بدون نشانه BOM با رمزگذاری قدیمی باز می‌کند. گزینه «برای Excel» این نشانه را به آغاز فایل می‌افزاید تا فارسی درست دیده شود.",
                    en: "Excel opens a CSV file without a BOM in an old encoding. The “For Excel” option adds the BOM at the start of the file, so Persian shows correctly.",
                },
            },
            {
                question: {
                    fa: "کاما یا نقطه‌ویرگول؟",
                    en: "Comma or semicolon?",
                },
                answer: {
                    fa: "Excel در برخی تنظیم‌های زبانی نقطه‌ویرگول را جداکننده می‌داند. اگر همه داده در یک ستون آمد، نقطه‌ویرگول را بیازمایید.",
                    en: "With some language settings, Excel uses a semicolon as the delimiter. If all the data ends up in one column, try a semicolon.",
                },
            },
        ],
    },
    example: '[{"name":"سارا","city":"شیراز"},{"name":"Ali","city":"Tabriz"}]',
};
