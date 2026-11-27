import type { ToolDefinition } from "@handyweb/core";

export const subtitleConverterMeta: ToolDefinition = {
    id: "subtitle-converter",
    slug: "subtitle-converter",
    aliases: ["srt-to-vtt", "vtt-to-srt", "subtitle-shift", "persian-subtitle-fix"],
    category: "text",
    alsoIn: ["persian"],
    related: ["persian-normalizer", "text-cleaner"],
    tags: ["subtitle", "srt", "vtt"],
    title: {
        fa: "تبدیل زیرنویس SRT و VTT و درست کردن فارسی",
        en: "Subtitle Converter (SRT and VTT)",
    },
    description: {
        fa: "زیرنویس SRT را به WebVTT یا برعکس برگردانید، زمان آن را جابه‌جا کنید، و زیرنویس فارسی به‌هم‌ریخته (Windows-1256) را به UTF-8 درست کنید.",
        en: "Convert SRT subtitles to WebVTT or back, shift their timing, and fix garbled Persian subtitles (Windows-1256) by converting them to UTF-8.",
    },
    keywords: {
        fa: [
            "زیرنویس",
            "تبدیل srt به vtt",
            "زیرنویس به هم ریخته",
            "درست کردن زیرنویس فارسی",
            "همگام سازی زیرنویس",
        ],
        en: [
            "srt to vtt",
            "vtt to srt",
            "subtitle converter",
            "subtitle shift",
            "fix persian subtitles",
        ],
    },
    presets: [
        {
            id: "to-srt",
            title: { fa: "تبدیل VTT به SRT", en: "VTT to SRT Converter" },
            keywords: { fa: ["vtt به srt"], en: ["vtt to srt"] },
            options: { to: "srt" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["text", "file"],
    outputKinds: ["text", "file"],
    limits: { maxInputBytes: 10_000_000 },
    limitations: {
        fa: "تنها SRT و WebVTT. ASS، SSA و زیرنویس درون فایل ویدیو پذیرفته نمی‌شوند. سبک‌ها و بخش‌های STYLE و REGION در VTT به SRT نمی‌روند.",
        en: "Only SRT and WebVTT. ASS, SSA, and subtitles inside video files are not accepted. Styles and the STYLE and REGION blocks of VTT do not carry over to SRT.",
    },
    guide: {
        steps: [
            {
                fa: "فایل زیرنویس را برگزینید یا متن آن را بچسبانید.",
                en: "Choose the subtitle file or paste its text.",
            },
            {
                fa: "گونه خروجی و جابه‌جایی زمان را برگزینید.",
                en: "Choose the output format and the time shift.",
            },
            { fa: "زیرنویس را دانلود کنید.", en: "Download the subtitles." },
        ],
        faq: [
            {
                question: {
                    fa: "چرا زیرنویس فارسی من به شکل «ÓáÇã» دیده می‌شود؟",
                    en: "Why do my Persian subtitles look like «ÓáÇã»?",
                },
                answer: {
                    fa: "فایل با رمزگذاری قدیمی Windows-1256 ذخیره شده است. این ابزار آن را می‌شناسد و به UTF-8 برمی‌گرداند تا در همه پخش‌کننده‌ها درست دیده شود.",
                    en: "The file was saved in the old Windows-1256 encoding. This tool detects it and converts it to UTF-8, so it shows correctly in every player.",
                },
            },
            {
                question: {
                    fa: "زیرنویس زودتر یا دیرتر از صدا است.",
                    en: "The subtitles are early or late.",
                },
                answer: {
                    fa: "در «جابه‌جایی زمان» چند ثانیه بنویسید: منفی برای زودتر و مثبت برای دیرتر. همه زیرنویس‌ها به همان اندازه جابه‌جا می‌شوند.",
                    en: "Enter a number of seconds in “Time shift”: negative for earlier, positive for later. Every subtitle moves by the same amount.",
                },
            },
        ],
    },
    example: "1\n00:00:01,000 --> 00:00:03,000\nسلام دنیا\n",
};
