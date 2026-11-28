import type { ToolDefinition } from "@handyweb/core";

export const passwordStrengthMeta: ToolDefinition = {
    id: "password-strength",
    slug: "password-strength",
    aliases: ["password-strength-checker", "password-checker", "how-strong-is-my-password"],
    category: "crypto",
    alsoIn: [],
    related: ["password-generator", "hash", "random-token"],
    tags: ["password", "security", "strength"],
    title: { fa: "سنجش قدرت رمز عبور", en: "Password Strength Checker" },
    seoTitle: {
        fa: "سنجش قدرت رمز عبور و امنیت پسورد",
        en: "Password Strength Checker: How Secure Is It?",
    },
    description: {
        fa: "سنجش قدرت رمز عبور: ببینید پسورد شما چقدر قوی است، حدس زدن آن چقدر زمان می‌برد و چگونه بهترش کنید.",
        en: "See how strong a password is, how long it would take to guess, and how to make it better.",
    },
    keywords: {
        fa: [
            "سنجش قدرت گذرواژه",
            "قدرت رمز عبور",
            "رمز عبور قوی",
            "بررسی امنیت پسورد",
            "پسورد قوی",
        ],
        en: [
            "password strength checker",
            "how strong is my password",
            "password checker",
            "test password strength",
            "zxcvbn",
        ],
    },
    presets: [],
    execution: "worker",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["structured"],
    limits: { maxInputBytes: 1024 },
    limitations: {
        fa: "سنجش با zxcvbn-ts و واژه‌نامه‌های انگلیسی آن انجام می‌شود: گذرواژه‌های رایج، واژه‌ها و نام‌های انگلیسی. واژه‌ها و نام‌های فارسی را نمی‌شناسد، پس گذرواژه‌ای از واژه‌های رایج فارسی ممکن است قوی‌تر از واقع نشان داده شود. زمان‌ها برآوردند، نه تضمین. تنها ۲۵۶ نویسه نخست سنجیده می‌شود.",
        en: "The check uses zxcvbn-ts and its English dictionaries: common passwords, English words, and English names. It does not know Persian words or names, so a password made of common Persian words can show as stronger than it is. The times are estimates, not a promise. Only the first 256 characters are checked.",
    },
    guide: {
        steps: [
            { fa: "گذرواژه را در کادر بنویسید.", en: "Type the password in the box." },
            {
                fa: "قدرت، زمان حدس زدن و پیشنهادها را بخوانید.",
                en: "Read the strength, the time to guess, and the suggestions.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "چرا بار نخست کند است؟",
                    en: "Why is the first check slow?",
                },
                answer: {
                    fa: "ابزار یک بار واژه‌نامه‌هایی نزدیک ۹۰۰ کیلوبایت را بار می‌کند. پس از آن، مرورگر آن‌ها را نگه می‌دارد.",
                    en: "The tool loads about 900 KB of dictionaries once. After that, the browser keeps them.",
                },
            },
        ],
    },
};
