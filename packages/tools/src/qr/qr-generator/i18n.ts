import type { LocalizedText } from "@handyweb/core";
import type { Ecc } from "./logic";

export const strings = {
    content: { fa: "نوشته یا نشانی", en: "Text or URL" },
    ecc: { fa: "سطح بازیابی خطا", en: "Error correction" },
    dark: { fa: "رنگ نقطه‌ها", en: "Dark color" },
    light: { fa: "رنگ زمینه", en: "Background color" },
    pngSize: { fa: "اندازه PNG", en: "PNG size" },
    preview: { fa: "کد QR", en: "QR code" },
    downloadSvg: { fa: "دانلود SVG", en: "Download SVG" },
    downloadPng: { fa: "دانلود PNG", en: "Download PNG" },
    version: { fa: "نسخه", en: "Version" },
    modules: { fa: "خانه", en: "modules" },
    inverted: {
        fa: "رنگ نقطه‌ها روشن‌تر از زمینه است. بسیاری از خواننده‌ها کد وارونه را نمی‌خوانند.",
        en: "The dark color is lighter than the background. Many readers cannot scan an inverted code.",
    },
    lowContrast: {
        fa: "دو رنگ به اندازه کافی با هم فرق ندارند و کد شاید خوانده نشود. رنگ نقطه‌ها را تیره‌تر کنید.",
        en: "The two colors are too close, and the code may not scan. Use a darker dark color.",
    },
    empty: { fa: "نوشته‌ای بنویسید تا کد QR ساخته شود.", en: "Type some text to make a QR code." },
    kind: { fa: "نوع محتوا", en: "Content type" },
    text: { fa: "متن یا پیوند", en: "Text or link" },
    wifi: { fa: "Wi-Fi", en: "Wi-Fi" },
    email: { fa: "ایمیل", en: "Email" },
    contact: { fa: "کارت تماس", en: "Contact" },
    ssid: { fa: "نام شبکه (SSID)", en: "Network name (SSID)" },
    password: { fa: "رمز", en: "Password" },
    security: { fa: "امنیت", en: "Security" },
    open: { fa: "بدون رمز", en: "No password" },
    hidden: { fa: "شبکه پنهان است", en: "The network is hidden" },
    to: { fa: "نشانی گیرنده", en: "To" },
    subject: { fa: "موضوع", en: "Subject" },
    body: { fa: "متن", en: "Message" },
    name: { fa: "نام", en: "Name" },
    phone: { fa: "تلفن", en: "Phone" },
    organization: { fa: "سازمان", en: "Organization" },
    url: { fa: "وب‌سایت", en: "Website" },
    payload: { fa: "محتوای کد", en: "Code content" },
    wifiNote: {
        fa: "رمز Wi-Fi درون کد نوشته می‌شود. هر کس کد را ببیند، می‌تواند رمز را بخواند.",
        en: "The Wi-Fi password is written inside the code. Anyone who sees the code can read the password.",
    },
} as const satisfies Record<string, LocalizedText>;

export const eccLabels: Record<Ecc, LocalizedText> = {
    L: { fa: "L ۷٪", en: "L 7%" },
    M: { fa: "M ۱۵٪", en: "M 15%" },
    Q: { fa: "Q ۲۵٪", en: "Q 25%" },
    H: { fa: "H ۳۰٪", en: "H 30%" },
};
