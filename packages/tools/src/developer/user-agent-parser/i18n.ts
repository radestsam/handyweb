import type { LocalizedText } from "@handyweb/core";

export const strings = {
    ua: { fa: "رشته User-Agent", en: "User-Agent string" },
    mine: { fa: "User-Agent این مرورگر", en: "This browser's User-Agent" },
    browser: { fa: "مرورگر", en: "Browser" },
    engine: { fa: "موتور", en: "Engine" },
    os: { fa: "سیستم‌عامل", en: "Operating system" },
    device: { fa: "گونه دستگاه", en: "Device type" },
    bot: { fa: "ربات", en: "Bot" },
    unknownValue: { fa: "ناشناخته", en: "Unknown" },
    note: {
        fa: "مرورگرهای امروزی User-Agent را کوتاه می‌کنند: برای نمونه، Windows 10 و 11 هر دو «Windows NT 10.0» می‌نویسند. پس پاسخ یک برآورد است.",
        en: "Modern browsers reduce the User-Agent: for example, Windows 10 and 11 both write “Windows NT 10.0”. So the result is an estimate.",
    },
} as const satisfies Record<string, LocalizedText>;

export const deviceLabels: Record<string, LocalizedText> = {
    desktop: { fa: "رایانه", en: "Desktop" },
    mobile: { fa: "گوشی", en: "Mobile" },
    tablet: { fa: "تبلت", en: "Tablet" },
    bot: { fa: "ربات", en: "Bot" },
    unknown: { fa: "ناشناخته", en: "Unknown" },
};
