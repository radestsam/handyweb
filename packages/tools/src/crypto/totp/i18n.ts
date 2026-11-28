import type { LocalizedText } from "@handyweb/core";

export const strings = {
    secret: {
        fa: "کلید پنهان (Base32) یا پیوند otpauth://",
        en: "Secret key (Base32) or otpauth:// link",
    },
    algorithm: { fa: "الگوریتم", en: "Algorithm" },
    digits: { fa: "شمار رقم", en: "Digits" },
    period: { fa: "دوره (ثانیه)", en: "Period (seconds)" },
    code: { fa: "کد کنونی", en: "Current code" },
    next: { fa: "کد بعدی", en: "Next code" },
    remaining: { fa: "ثانیه مانده", en: "seconds left" },
    account: { fa: "حساب", en: "Account" },
    warning: {
        fa: "این کلید دسترسی به حساب شما را می‌دهد. آن را جایی نچسبانید که به آن اعتماد ندارید. این صفحه آن را نگه نمی‌دارد و نمی‌فرستد.",
        en: "This key gives access to your account. Do not paste it anywhere you do not trust. This page does not store or send it.",
    },
    clock: {
        fa: "کد از ساعت این دستگاه ساخته می‌شود. اگر ساعت درست نباشد، کد پذیرفته نمی‌شود.",
        en: "The code comes from the clock of this device. If the clock is wrong, the code is not accepted.",
    },
} as const satisfies Record<string, LocalizedText>;
