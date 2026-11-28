import type { ToolDefinition } from "@handyweb/core";

export const sqlFormatterMeta: ToolDefinition = {
    id: "sql-formatter",
    slug: "sql-formatter",
    aliases: ["sql-beautifier", "format-sql", "sql-pretty-print"],
    category: "developer",
    alsoIn: [],
    related: ["json-formatter", "xml-formatter", "yaml-formatter"],
    tags: ["sql", "format"],
    title: {
        fa: "آراستن کوئری SQL",
        en: "SQL Formatter",
    },
    description: {
        fa: "کوئری‌های SQL را با تورفتگی خوانا بیارایید، برای SQL استاندارد، PostgreSQL، MySQL، MariaDB، SQLite و SQL Server.",
        en: "Format SQL queries with readable indentation, for standard SQL, PostgreSQL, MySQL, MariaDB, SQLite, and SQL Server.",
    },
    keywords: {
        fa: ["آراستن sql", "مرتب کردن کوئری", "sql formatter"],
        en: [
            "sql formatter",
            "sql beautifier",
            "format sql",
            "pretty print sql",
            "postgresql formatter",
        ],
    },
    presets: [
        {
            id: "postgresql",
            title: { fa: "آراستن PostgreSQL", en: "PostgreSQL Formatter" },
            keywords: { fa: ["postgresql"], en: ["postgresql formatter"] },
            options: { dialect: "postgresql" },
        },
        {
            id: "mysql",
            title: { fa: "آراستن MySQL", en: "MySQL Formatter" },
            keywords: { fa: ["mysql"], en: ["mysql formatter"] },
            options: { dialect: "mysql" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 1_000_000 },
    limitations: {
        fa: "ابزار تنها می‌آراید و درستی کوئری را در برابر پایگاه داده نمی‌سنجد. ساختارهای ویژه یک گویش شاید با گویش دیگری خوانده نشوند.",
        en: "The tool only formats. It does not check the query against a database. Syntax that belongs to one dialect may not read with another.",
    },
    guide: {
        steps: [
            { fa: "گویش SQL را برگزینید.", en: "Choose the SQL dialect." },
            { fa: "کوئری را بچسبانید.", en: "Paste the query." },
            { fa: "خروجی را کپی کنید.", en: "Copy the output." },
        ],
        faq: [
            {
                question: {
                    fa: "کوئری من به سرور فرستاده می‌شود؟",
                    en: "Is my query sent to a server?",
                },
                answer: {
                    fa: "نه. آراستن در مرورگر شما انجام می‌شود، پس کوئری‌هایی با نام جدول‌ها و داده‌های درونی هم ایمن‌اند.",
                    en: "No. Formatting runs in your browser, so queries with internal table names and data are safe.",
                },
            },
        ],
    },
    example: "select id, name from users where active = 1 order by name",
};
