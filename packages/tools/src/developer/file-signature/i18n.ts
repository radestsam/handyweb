import type { LocalizedText } from "@handyweb/core";

export const strings = {
    orHex: { fa: "یا بایت‌های آغاز فایل به هگز", en: "Or the first bytes of a file as hex" },
    detected: { fa: "گونه واقعی", en: "Real type" },
    unknown: {
        fa: "امضای شناخته‌شده‌ای یافت نشد.",
        en: "No known signature found.",
    },
    text: { fa: "بایت‌ها به نوشته ساده می‌مانند.", en: "The bytes look like plain text." },
    extensions: { fa: "پسوندهای درست", en: "Expected extensions" },
    fileExtension: { fa: "پسوند این فایل", en: "This file's extension" },
    mismatch: {
        fa: "پسوند فایل با گونه واقعی آن جور نیست. شاید نام فایل گمراه‌کننده باشد.",
        en: "The file extension does not match its real type. The file name may be misleading.",
    },
    executable: {
        fa: "این فایل یک برنامه یا اسکریپت است. آن را تنها اگر از منبع آن مطمئن هستید باز کنید.",
        en: "This file is a program or a script. Open it only if you trust where it came from.",
    },
    firstBytes: { fa: "بایت‌های آغاز", en: "First bytes" },
    note: {
        fa: "تنها ۵۱۲ بایت نخست فایل خوانده می‌شود و فایل از دستگاه شما بیرون نمی‌رود.",
        en: "Only the first 512 bytes of the file are read, and the file never leaves your device.",
    },
    badHex: { fa: "هگز درست نیست.", en: "The hex is not valid." },
} as const satisfies Record<string, LocalizedText>;
