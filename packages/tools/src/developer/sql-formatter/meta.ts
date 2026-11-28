import type { ToolDefinition } from "@handyweb/core";

export const sqlFormatterMeta: ToolDefinition = {
    id: "sql-formatter",
    slug: "sql-formatter",
    aliases: ["sql-beautifier", "format-sql", "sql-pretty-print"],
    category: "developer",
    alsoIn: [],
    related: ["json-formatter", "xml-formatter", "yaml-formatter"],
    tags: ["sql", "format"],
    title: { fa: "فرمت و مرتب کردن کوئری SQL", en: "SQL Formatter" },
    seoTitle: {
        fa: "فرمت و مرتب کردن کوئری SQL و MySQL",
        en: "SQL Formatter for MySQL, PostgreSQL, and More",
    },
    description: {
        fa: "مرتب کردن کوئری SQL با تورفتگی خوانا، برای SQL استاندارد، PostgreSQL، MySQL، MariaDB، SQLite و SQL Server.",
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
        faq: [],
    },
    example: "select id, name from users where active = 1 order by name",
};
