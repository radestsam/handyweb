import type { ToolDefinition } from "@handyweb/core";

export const regexTesterMeta: ToolDefinition = {
    id: "regex-tester",
    slug: "regex-tester",
    aliases: ["regex", "regexp-tester", "regular-expression-tester", "regex-checker"],
    category: "developer",
    alsoIn: ["text"],
    related: ["text-diff", "unicode-explorer"],
    tags: ["regex", "regexp", "pattern"],
    title: { fa: "آزمون عبارت باقاعده (Regex)", en: "Regex Tester" },
    seoTitle: {
        fa: "آزمون عبارت باقاعده (Regex) با پشتیبانی فارسی",
        en: "Regex Tester for JavaScript Regular Expressions",
    },
    description: {
        fa: "یک الگوی regex جاوااسکریپت را روی نوشته بیازمایید، یافته‌ها و گروه‌ها را ببینید و از الگوهای کند آگاه شوید. با نوشته فارسی و \\p{…} هم کار می‌کند.",
        en: "Test a JavaScript regular expression on text, see the matches and groups, and get a warning for slow patterns. It works with Persian text and \\p{…} too.",
    },
    keywords: {
        fa: ["regex", "عبارت باقاعده", "الگوی جستجو", "تست regex", "ریجکس"],
        en: ["regex tester", "regexp", "regular expression", "regex test", "javascript regex"],
    },
    presets: [],
    execution: "worker",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["structured"],
    limits: { maxInputBytes: 1_000_000 },
    limitations: {
        fa: "الگو با موتور regex جاوااسکریپت مرورگر شما اجرا می‌شود و شاید با PCRE، Python یا Go فرق داشته باشد. هر اجرا پس از ۲ ثانیه می‌ایستد. جایگاه‌ها به واحد UTF-16 شمرده می‌شوند.",
        en: "Patterns run with the JavaScript regex engine of your browser, which can differ from PCRE, Python, or Go. Each run stops after 2 seconds. Positions count UTF-16 code units.",
    },
    guide: {
        steps: [
            {
                fa: "الگو را بنویسید و پرچم‌ها را برگزینید.",
                en: "Write the pattern and choose the flags.",
            },
            {
                fa: "نوشته آزمایشی را بچسبانید. یافته‌ها همزمان رنگی می‌شوند.",
                en: "Paste the test text. Matches are highlighted as you type.",
            },
            {
                fa: "جایگاه و گروه‌های هر یافته را در جدول ببینید.",
                en: "See the position and the groups of each match in the table.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا \\d شماره‌های فارسی را نمی‌گیرد؟",
                    en: "Why does \\d not match Persian digits?",
                },
                answer: {
                    fa: "در جاوااسکریپت \\d تنها 0 تا 9 لاتین است. برای شماره‌های فارسی [۰-۹] یا با پرچم u الگوی \\p{Nd} را به کار ببرید.",
                    en: "In JavaScript, \\d is only the Latin 0 to 9. For Persian digits, use [۰-۹], or \\p{Nd} with the u flag.",
                },
            },
            {
                question: {
                    fa: "catastrophic backtracking چیست؟",
                    en: "What is catastrophic backtracking?",
                },
                answer: {
                    fa: "الگویی مانند (a+)+ روی نوشته‌ای که تقریباً جور است، راه‌های بی‌شماری را می‌آزماید و زمان آن نمایی بالا می‌رود. این ابزار هر الگو را در یک worker جدا اجرا می‌کند و پس از ۲ ثانیه آن را می‌ایستاند، پس صفحه گیر نمی‌کند.",
                    en: "A pattern such as (a+)+ tries a huge number of paths on text that almost matches, and its time grows exponentially. This tool runs each pattern in a separate worker and stops it after 2 seconds, so the page does not freeze.",
                },
            },
        ],
    },
    example: "سفارش 12 و 345 تومان",
};
