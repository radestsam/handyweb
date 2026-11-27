import type { LocalizedText } from "@handyweb/core";

export const strings = {
    mode: { fa: "کار", en: "Action" },
    encrypt: { fa: "رمزنگاری", en: "Encrypt" },
    decrypt: { fa: "رمزگشایی", en: "Decrypt" },
    passphrase: { fa: "عبارت عبور", en: "Passphrase" },
    show: { fa: "نمایش عبارت عبور", en: "Show passphrase" },
    text: { fa: "نوشته", en: "Text" },
    encrypted: { fa: "نوشته رمزنگاری‌شده (Base64)", en: "Encrypted text (Base64)" },
    working: { fa: "در حال ساختن کلید…", en: "Deriving the key…" },
    note: {
        fa: "AES-256-GCM، کلید با PBKDF2-SHA256 و ۶۰۰٬۰۰۰ دور. اگر عبارت عبور را فراموش کنید، هیچ راهی برای بازیابی نوشته نیست.",
        en: "AES-256-GCM, with the key from PBKDF2-SHA256 and 600,000 iterations. If you forget the passphrase, there is no way to get the text back.",
    },
} as const satisfies Record<string, LocalizedText>;
