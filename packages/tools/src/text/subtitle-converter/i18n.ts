import type { LocalizedText } from "@handyweb/core";

export const strings = {
    target: { fa: "گونه خروجی", en: "Output format" },
    shift: { fa: "جابه‌جایی زمان (ثانیه)", en: "Time shift (seconds)" },
    shiftHint: {
        fa: "عدد منفی زیرنویس را زودتر و عدد مثبت دیرتر نشان می‌دهد.",
        en: "A negative number shows the subtitles earlier, a positive number later.",
    },
    subtitles: { fa: "زیرنویس (SRT یا VTT)", en: "Subtitles (SRT or VTT)" },
    orFile: { fa: "یا فایل .srt یا .vtt", en: "Or an .srt or .vtt file" },
    windows1256: {
        fa: "فایل با رمزگذاری Windows-1256 (عربی ویندوز) بود و به UTF-8 برگردانده شد.",
        en: "The file was in Windows-1256 (Arabic Windows) and was converted to UTF-8.",
    },
    download: { fa: "دانلود زیرنویس", en: "Download the subtitles" },
    cues: { fa: "زیرنویس", en: "cues" },
} as const satisfies Record<string, LocalizedText>;
