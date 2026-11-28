import type { ToolDefinition } from "@handyweb/core";

export const unitConverterMeta: ToolDefinition = {
    id: "unit-converter",
    slug: "unit-converter",
    aliases: ["unit-conversion", "convert-units", "measurement-converter"],
    category: "calculators",
    alsoIn: [],
    related: ["number-base"],
    tags: ["units", "convert", "length", "weight"],
    title: { fa: "تبدیل واحد", en: "Unit Converter" },
    seoTitle: {
        fa: "تبدیل واحد طول، وزن، دما و واحدهای ایرانی",
        en: "Unit Converter for Length, Weight, and More",
    },
    description: {
        fa: "تبدیل واحد طول، وزن، دما، مساحت، حجم، سرعت، حجم داده، زمان، فشار و انرژی، با واحدهای ایرانی مانند مثقال، سیر، من، ذرع و جریب. همه نتیجه‌ها یک‌جا دیده می‌شوند.",
        en: "Convert length, weight, temperature, area, volume, speed, data, time, pressure, and energy, with Iranian units such as mesghal, sir, and jerib.",
    },
    keywords: {
        fa: [
            "تبدیل واحد",
            "تبدیل مثقال به گرم",
            "تبدیل اینچ به سانتی متر",
            "تبدیل فارنهایت به سانتیگراد",
            "تبدیل پوند به کیلوگرم",
        ],
        en: [
            "unit converter",
            "convert units",
            "inches to cm",
            "fahrenheit to celsius",
            "pounds to kg",
            "mesghal to gram",
        ],
    },
    presets: [
        {
            id: "length",
            title: { fa: "تبدیل واحد طول", en: "Length Converter" },
            keywords: {
                fa: ["تبدیل اینچ به سانت", "تبدیل متر به فوت"],
                en: ["length converter", "inches to cm"],
            },
            options: { kind: "length" },
        },
        {
            id: "weight",
            title: { fa: "تبدیل واحد وزن", en: "Weight Converter" },
            keywords: {
                fa: ["تبدیل مثقال به گرم", "تبدیل پوند به کیلو"],
                en: ["weight converter", "pounds to kg"],
            },
            options: { kind: "mass" },
        },
        {
            id: "mesghal-to-gram",
            title: { fa: "تبدیل مثقال به گرم", en: "Mesghal to Gram Converter" },
            keywords: { fa: ["مثقال به گرم", "مثقال طلا"], en: ["mesghal to gram"] },
            options: { kind: "mass", from: "mesghal" },
        },
        {
            id: "temperature",
            title: { fa: "تبدیل دما", en: "Temperature Converter" },
            keywords: {
                fa: ["تبدیل فارنهایت به سانتیگراد"],
                en: ["fahrenheit to celsius", "celsius to fahrenheit"],
            },
            options: { kind: "temperature" },
        },
        {
            id: "data",
            title: { fa: "تبدیل واحد حجم داده", en: "Data Size Converter" },
            keywords: {
                fa: ["تبدیل گیگابایت به مگابایت"],
                en: ["gb to mb", "data size converter", "gib to gb"],
            },
            options: { kind: "data" },
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
    limits: { maxInputBytes: 100 },
    limitations: {
        fa: "نتیجه‌ها تا ۱۰ رقم معنادار گرد می‌شوند. یکاهای ایرانی مقدار رایج امروز را دارند. سال ۳۶۵٫۲۴۲۵ روز است.",
        en: "Results are rounded to 10 significant digits. Iranian units have the values common today. A year is 365.2425 days.",
    },
    guide: {
        steps: [
            {
                fa: "نوع را برگزینید، مانند طول یا وزن.",
                en: "Choose the kind, such as length or weight.",
            },
            { fa: "مقدار و یکای آن را بنویسید.", en: "Enter the value and its unit." },
            { fa: "همه تبدیل‌ها را ببینید و کپی کنید.", en: "See every conversion and copy one." },
        ],
        faq: [
            {
                question: { fa: "هر مثقال چند گرم است؟", en: "How many grams is one mesghal?" },
                answer: {
                    fa: "مثقالی که در بازار طلای ایران به کار می‌رود ۴٫۶۰۸ گرم است.",
                    en: "The mesghal used in the Iranian gold market is 4.608 grams.",
                },
            },
            {
                question: {
                    fa: "چرا گیگابایت و گیبی‌بایت فرق دارند؟",
                    en: "Why do GB and GiB differ?",
                },
                answer: {
                    fa: "گیگابایت ۱۰۰۰³ بایت است و گیبی‌بایت ۱۰۲۴³ بایت. سازندگان دیسک گیگابایت را به کار می‌برند و ویندوز گیبی‌بایت را GB می‌نامد.",
                    en: "A gigabyte is 1000³ bytes and a gibibyte is 1024³ bytes. Disk makers use gigabytes, and Windows shows gibibytes as GB.",
                },
            },
        ],
    },
    example: "1",
};
