import type { ToolDefinition } from "@handyweb/core";

export const passwordGeneratorMeta: ToolDefinition = {
    id: "password-generator",
    slug: "password-generator",
    aliases: ["passphrase-generator", "random-password", "strong-password-generator"],
    category: "crypto",
    alsoIn: [],
    related: ["hash", "hmac", "random-token"],
    tags: ["password", "passphrase", "random"],
    title: { fa: "ساخت رمز عبور قوی", en: "Password Generator" },
    seoTitle: {
        fa: "ساخت رمز عبور قوی و تصادفی (پسورد ساز)",
        en: "Password Generator for Strong Random Passwords",
    },
    description: {
        fa: "ساخت رمز عبور قوی و تصادفی یا عبارت عبوری از کلمه‌های انگلیسی. تصادف از crypto.getRandomValues مرورگر می‌آید.",
        en: "Create a strong random password or a passphrase of English words. The randomness comes from crypto.getRandomValues.",
    },
    keywords: {
        fa: ["ساخت رمز", "رمز عبور قوی", "گذرواژه تصادفی", "پسورد قوی", "ساخت پسورد", "عبارت عبور"],
        en: [
            "password generator",
            "strong password",
            "random password",
            "passphrase generator",
            "diceware",
            "secure password",
        ],
    },
    presets: [
        {
            id: "passphrase",
            title: { fa: "ساخت عبارت عبور", en: "Passphrase Generator" },
            keywords: { fa: ["عبارت عبور"], en: ["passphrase", "diceware"] },
            options: { kind: "passphrase" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["structured"],
    outputKinds: ["text"],
    limitations: {
        fa: "عبارت عبور تنها از واژه‌های انگلیسی ساخته می‌شود. فهرست واژه فارسی با پروانه آزاد هنوز در دسترس نیست.",
        en: "Passphrases use English words only. A Persian word list with an open license is not available yet.",
    },
    guide: {
        steps: [
            {
                fa: "گذرواژه یا عبارت عبور را برگزینید.",
                en: "Choose Password or Passphrase.",
            },
            {
                fa: "درازا، نویسه‌ها یا شمار واژه‌ها را تنظیم کنید. توان آن به بیت نشان داده می‌شود.",
                en: "Set the length and the characters, or the number of words. The strength shows in bits.",
            },
            {
                fa: "پاسخ را کپی کنید، یا «ساخت دوباره» را بزنید.",
                en: "Copy the result, or select Generate again.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "گذرواژه چقدر باید نیرومند باشد؟",
                    en: "How strong must a password be?",
                },
                answer: {
                    fa: "برای حساب‌های مهم دست‌کم ۷۰ بیت. یک گذرواژه ۱۶ نویسه‌ای با همه دسته‌ها حدود ۱۰۰ بیت، و عبارت عبور شش واژه‌ای حدود ۷۷ بیت است.",
                    en: "At least 70 bits for important accounts. A 16-character password with all sets has about 100 bits, and a six-word passphrase has about 77 bits.",
                },
            },
            {
                question: {
                    fa: "گذرواژه را کجا نگه دارم؟",
                    en: "Where should I keep the password?",
                },
                answer: {
                    fa: "آن را در یک گذرواژه‌نگهدار (password manager) بگذارید.",
                    en: "Keep it in a password manager.",
                },
            },
            {
                question: {
                    fa: "عبارت عبور بهتر است یا گذرواژه؟",
                    en: "Is a passphrase better than a password?",
                },
                answer: {
                    fa: "هر دو اگر به اندازه کافی دراز باشند ایمن‌اند. عبارت عبور را آسان‌تر به یاد می‌آورید و تایپ می‌کنید، پس برای گذرواژه اصلی گذرواژه‌نگهدار یا رایانه خوب است.",
                    en: "Both are secure when they are long enough. A passphrase is easier to remember and to type, so it is good for the main password of a password manager or a computer.",
                },
            },
        ],
    },
    example: "24",
};
