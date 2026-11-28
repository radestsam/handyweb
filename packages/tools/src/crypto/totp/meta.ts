import type { ToolDefinition } from "@handyweb/core";

export const totpMeta: ToolDefinition = {
    id: "totp",
    slug: "totp",
    aliases: [
        "totp-generator",
        "2fa-code",
        "authenticator",
        "otp-generator",
        "google-authenticator-code",
    ],
    category: "crypto",
    alsoIn: [],
    related: ["hmac", "password-generator"],
    tags: ["totp", "2fa", "otp"],
    title: {
        fa: "ساخت کد ورود دومرحله‌ای (TOTP)",
        en: "TOTP Code Generator",
    },
    description: {
        fa: "از کلید پنهان یا پیوند otpauth یک حساب، کد شش‌رقمی ورود دومرحله‌ای (مانند Google Authenticator) را بسازید. همه کار در مرورگر شما انجام می‌شود.",
        en: "Make the six-digit two-factor login code (as in Google Authenticator) from the secret key or otpauth link of an account. Everything runs in your browser.",
    },
    keywords: {
        fa: ["کد دو مرحله ای", "totp", "گوگل آتنتیکیتور", "رمز یکبار مصرف", "2fa"],
        en: [
            "totp generator",
            "2fa code",
            "authenticator code",
            "otp generator",
            "google authenticator",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 10_000 },
    limitations: {
        fa: "تنها کد زمانی (TOTP)، نه کد شمارشی (HOTP). کد از ساعت این دستگاه ساخته می‌شود. این ابزار جایگزین یک برنامه احراز هویت نیست: کلید را نگه نمی‌دارد.",
        en: "Only time-based codes (TOTP), not counter codes (HOTP). The code comes from the clock of this device. This tool does not replace an authenticator app: it does not keep the key.",
    },
    guide: {
        steps: [
            {
                fa: "کلید پنهان Base32 یا پیوند otpauth:// را بچسبانید.",
                en: "Paste the Base32 secret key or the otpauth:// link.",
            },
            { fa: "کد کنونی را بخوانید یا کپی کنید.", en: "Read or copy the current code." },
        ],
        faq: [
            {
                question: { fa: "این ابزار ایمن است؟", en: "Is this tool safe?" },
                answer: {
                    fa: "کلید از مرورگر شما بیرون نمی‌رود و جایی ذخیره نمی‌شود. با این همه، کلید ورود دومرحله‌ای را تنها برای آزمایش یا بازیابی به کار ببرید و آن را با کسی هم‌رسانی نکنید.",
                    en: "The key does not leave your browser and is not stored. Still, use a two-factor key here only for testing or recovery, and never share it.",
                },
            },
            {
                question: { fa: "چرا کد پذیرفته نمی‌شود؟", en: "Why is the code not accepted?" },
                answer: {
                    fa: "بیشتر وقت‌ها ساعت دستگاه درست نیست. ساعت را با اینترنت همگام کنید. اگر سرویس الگوریتم یا شمار رقم دیگری می‌خواهد، آن را برگزینید.",
                    en: "Most often the device clock is wrong. Sync the clock with the internet. If the service uses another algorithm or digit count, choose it.",
                },
            },
        ],
    },
    example: "JBSWY3DPEHPK3PXP",
};
