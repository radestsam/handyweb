import type { LocalizedText } from "@handyweb/core";

export const strings = {
    name: { fa: "نام سایت (برای manifest)", en: "Site name (for the manifest)" },
    padding: { fa: "فاصله از لبه (درصد)", en: "Padding (percent)" },
    background: { fa: "پس‌زمینه", en: "Background" },
    transparent: { fa: "شفاف", en: "Transparent" },
    square: { fa: "مربع", en: "Square" },
    rounded: { fa: "گوشه گرد", en: "Rounded" },
    circle: { fa: "دایره", en: "Circle" },
    color: { fa: "رنگ پس‌زمینه", en: "Background color" },
    make: { fa: "ساخت آیکون‌ها", en: "Make the icons" },
    download: { fa: "دانلود ZIP", en: "Download the ZIP" },
    html: { fa: "این را در <head> بگذارید", en: "Put this in <head>" },
    files: { fa: "فایل‌ها", en: "Files" },
    appleNote: {
        fa: "آیکون اپل شفافیت ندارد، پس با پس‌زمینه سفید یا رنگ برگزیده ساخته می‌شود.",
        en: "The Apple icon has no transparency, so it gets a white background or the chosen color.",
    },
    small: {
        fa: "این تصویر از ۵۱۲ پیکسل کوچک‌تر است و آیکون‌های بزرگ کمی تار می‌شوند.",
        en: "This picture is smaller than 512 pixels, so the large icons will be a little soft.",
    },
} as const satisfies Record<string, LocalizedText>;
